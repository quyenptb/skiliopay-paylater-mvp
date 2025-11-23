// src/models/PayLaterAgreement.ts
export type AgreementStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';

export interface PayLaterAgreement {
  id: string;
  userId: string;
  orderId: string;         
  totalAmount: number;
  currency: string;
  installmentCount: 3;
  amountPerInstallment: number;  
  status: AgreementStatus;
  createdAt: string;       
  firstPaidAt?: string;
  cancelledAt?: string;
}