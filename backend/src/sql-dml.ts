import db from './db'; 
import { formatISO, subDays } from 'date-fns';

const installmentId = '25a47970-85e1-48ef-9b56-c931adc505e1';
const agreementId = 'ce7a1d40-6eec-421d-aeff-b88247152b1c';

const pastDue = subDays(new Date(), 5);
const updateInstallmentSql = `
  UPDATE installments
  SET dueDate = ?, status = 'FAILED', failedAt = NULL, retryCount = 1
  WHERE id = ?
`;
const stmt1 = db.prepare(updateInstallmentSql);
const info1 = stmt1.run(formatISO(pastDue), installmentId);
console.log(`Installment ${installmentId} updated. Changes: ${info1.changes}`);

const updateAgreementSql = `
  UPDATE agreements
  SET status = 'SUSPENDED'
  WHERE id = ?
`;
const stmt2 = db.prepare(updateAgreementSql);
const info2 = stmt2.run(agreementId);
console.log(`Agreement ${agreementId} updated to SUSPENDED. Changes: ${info2.changes}`);
