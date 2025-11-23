import { v4 as uuidv4 } from 'uuid';
import { addDays, formatISO } from 'date-fns';
import db from '../db';
import { PAYLATER_CONFIG } from '../config/paylater.config';
import {User} from '../models/User';
import {Cart} from '../models/Cart';
import {PayLaterAgreement} from '../models/PayLaterAgreement';
import { Installment } from '../models/Installment';
import { ActivityLog } from '../models/ActivityLog';

export class PayLaterService {
  //get cart to render paylater option
  private getCart(cartId: string): Cart | undefined {
  const row = db.prepare('SELECT * FROM carts WHERE id = ?').get(cartId) as {
    id: string;
    items: string;     
    [key: string]: any; 
  } | undefined;

  if (!row) return undefined;

  return {
    ...row,
    items: JSON.parse(row.items),
  } as Cart;
}
  //get user to check eligibility
  private getUser(userId: string): User | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as User | undefined;
  }
  
  //check user's eligibility
  public checkEligibility(userId: string, amount: number): { eligible: boolean; reason?: string } {
    const user = this.getUser(userId);
    
    if (!user) return { eligible: false, reason: 'User not found' };
    
    if (!user.isVerified) return { eligible: false, reason: 'User not verified' };
    if (user.successfulTxns < 1) return { eligible: false, reason: 'Insufficient transaction history' };
    if (!user.hasPaymentMethod) return { eligible: false, reason: 'No payment method linked' };
    
    if (amount < PAYLATER_CONFIG.minEligibleAmount) return { eligible: false, reason: 'Amount below minimum limit' };
    if (amount > PAYLATER_CONFIG.maxEligibleAmount) return { eligible: false, reason: 'Amount exceeds maximum limit' };

    return { eligible: true };
  }

  public getUserById(userId: string): User  | undefined {
    return this.getUser(userId);
  }

  //create paylater agreement
  public createAgreement(userId: string, cartId: string): PayLaterAgreement {
    const cart = this.getCart(cartId);
    if (!cart) throw new Error('Cart not found');

    const eligibility = this.checkEligibility(userId, cart.totalAmount);
    if (!eligibility.eligible) throw new Error(eligibility.reason);

    const agreementId = uuidv4();
    const now = new Date();
    
    //calculate installment amount 
    const installmentCount = 3;
    const totalCents = Math.round(cart.totalAmount * 100);
    const baseAmountCents = Math.floor(totalCents / installmentCount);
    const remainderCents = totalCents % installmentCount;

    const firstInstallmentAmount = (baseAmountCents + remainderCents) / 100;
    const otherInstallmentAmount = baseAmountCents / 100;

    
    const insertAgreement = db.prepare(`
      INSERT INTO agreements (id, userId, orderId, totalAmount, currency, installmentCount, amountPerInstallment, status, createdAt, firstPaidAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertInstallment = db.prepare(`
      INSERT INTO installments (id, agreementId, installmentNumber, amount, dueDate, status, paidAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertLog = db.prepare(`
      INSERT INTO activity_logs (id, agreementId, type, metadata, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertAgreement.run(
        agreementId,
        userId,
        cartId, 
        cart.totalAmount,
        cart.currency,
        3,
        firstInstallmentAmount, //never use this amount to calculate total installments
        'ACTIVE',
        formatISO(now),
        formatISO(now) 
      );

      //add log for agreement creation (important event)
      insertLog.run(uuidv4(), agreementId, 'agreement_created', JSON.stringify({ amount: cart.totalAmount }), formatISO(now));

      const daysOffsets = PAYLATER_CONFIG.installmentDays; 

      daysOffsets.forEach((days, index) => {
        const installmentNumber = (index + 1) as 1 | 2 | 3;
        const dueDate = addDays(now, days);
        const isFirst = index === 0;
        
        const status = isFirst ? 'PAID' : 'UPCOMING';
        const amount = isFirst ? firstInstallmentAmount : otherInstallmentAmount;
        const paidAt = isFirst ? formatISO(now) : null;

        insertInstallment.run(
          uuidv4(),
          agreementId,
          installmentNumber,
          amount,
          formatISO(dueDate),
          status,
          paidAt
        );

        if (isFirst) {
           insertLog.run(uuidv4(), agreementId, 'charge_succeeded', JSON.stringify({ installment: 1, amount: amount }), formatISO(now));
        }
      });
    });

    transaction();

    return db.prepare('SELECT * FROM agreements WHERE id = ?').get(agreementId) as PayLaterAgreement;
  }

  public getAgreementDetails(agreementId: string) {
    const agreementRow = db.prepare('SELECT * FROM agreements WHERE id = ?').get(agreementId);
    if (!agreementRow) throw new Error('Agreement not found');
    const agreement = agreementRow as PayLaterAgreement;

    const installments = db.prepare('SELECT * FROM installments WHERE agreementId = ? ORDER BY installmentNumber ASC').all(agreementId) as Installment[];
    const logs = db.prepare('SELECT * FROM activity_logs WHERE agreementId = ? ORDER BY createdAt DESC').all(agreementId) as ActivityLog[];

    if (!agreement) throw new Error('Agreement not found');

    return {
      agreement,
      installments,
      logs
    };
}

  public getUserAgreements(userId: string): { agreement: PayLaterAgreement, installments: Installment[] }[] {
  const agreements = db
    .prepare('SELECT * FROM agreements WHERE userId = ? ORDER BY createdAt DESC')
    .all(userId) as PayLaterAgreement[];


  return agreements.map(agreement => {
    const installments = db
      .prepare('SELECT * FROM installments WHERE agreementId = ? ORDER BY installmentNumber ASC')
      .all(agreement.id) as Installment[];

    return { agreement, installments };
  });
}

  //retry installment payment
  public retryInstallmentPayment(installmentId: string, simulateFailure: boolean = false): { success: boolean; message: string } {
    const installment = db.prepare('SELECT * FROM installments WHERE id = ?').get(installmentId) as Installment | undefined;
    
    if (!installment) throw new Error('Installment not found');
    if (installment.status === 'PAID') throw new Error('Installment already paid');
    
    // Logic chặn retry quá 2 lần theo đề bài
    if (installment.retryCount >= PAYLATER_CONFIG.maxRetries) {
       return { success: false, message: 'Max retries exceeded. Account flagged.' };
    }

    const now = formatISO(new Date());
    const newRetryCount = (installment.retryCount ?? 0) + 1;

    if (simulateFailure) {
      db.prepare('UPDATE installments SET status = ?, retryCount = ?, lastRetryAttempt = ? WHERE id = ?')
        .run('FAILED', newRetryCount, now, installmentId);
      
      db.prepare('INSERT INTO activity_logs (id, agreementId, type, metadata, createdAt) VALUES (?, ?, ?, ?, ?)')
        .run(uuidv4(), installment.agreementId, 'charge_failed', JSON.stringify({ installmentId, attempt: newRetryCount }), now);

      return { success: false, message: 'Payment failed (simulated)' };
    }

    db.transaction(() => {
      db.prepare('UPDATE installments SET status = ?, paidAt = ?, retryCount = ?, lastRetryAttempt = ? WHERE id = ?')
        .run('PAID', now, newRetryCount, now, installmentId);

      const remaining = db.prepare('SELECT count(*) as count FROM installments WHERE agreementId = ? AND status != ?')
        .get(installment.agreementId, 'PAID') as { count: number };

      if (remaining.count === 0) {
        db.prepare('UPDATE agreements SET status = ? WHERE id = ?').run('COMPLETED', installment.agreementId);
      }

      db.prepare('INSERT INTO activity_logs (id, agreementId, type, metadata, createdAt) VALUES (?, ?, ?, ?, ?)')
        .run(uuidv4(), installment.agreementId, 'charge_succeeded', JSON.stringify({ installmentId, attempt: newRetryCount }), now);
    })();

    return { success: true, message: 'Payment successful' };
  }

  public runScheduler() {
    const logs: string[] = [];
    const now = formatISO(new Date());
    
    // 1. Auto-charge DUE Installments
    const dueInstallments = db.prepare("SELECT * FROM installments WHERE status = 'UPCOMING'").all() as Installment[];
    
    dueInstallments.forEach(inst => {
        this.retryInstallmentPayment(inst.id, false); 
        logs.push(`Auto-charged installment ${inst.id} (Due)`);
    });

    // 2. Auto-retry FAILED Installments (Logic 24h retry)
    const failedInstallments = db.prepare("SELECT * FROM installments WHERE status = 'FAILED' AND retryCount < 2").all() as Installment[];
    
    failedInstallments.forEach(inst => {
        this.retryInstallmentPayment(inst.id, false); 
        logs.push(`Auto-retried installment ${inst.id} (Retry #${(inst.retryCount || 0) + 1})`);
    });

    // 3. Flag Account if Retry >= 2 (Logic Flagged)
    const givingUpInstallments = db.prepare("SELECT * FROM installments WHERE status = 'FAILED' AND retryCount >= 2").all() as Installment[];
    givingUpInstallments.forEach(inst => {
        db.prepare("UPDATE agreements SET status = 'SUSPENDED' WHERE id = ?").run(inst.agreementId);
        logs.push(`Suspended agreement ${inst.agreementId} due to max retries`);
    });

    return { success: true, processed: logs.length, logs };
  }

  public getConfig() {
    return PAYLATER_CONFIG;
  }

  



}