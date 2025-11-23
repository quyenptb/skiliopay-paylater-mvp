// src/models/Installment.ts
export type InstallmentStatus = 
  | 'PAID' 
  | 'UPCOMING' 
  | 'DUE' 
  | 'OVERDUE' 
  | 'FAILED' 
  | 'PENDING_RETRY';

export interface Installment {
  id: string;
  agreementId: string;
  installmentNumber: 1 | 2 | 3;
  amount: number;
  dueDate: string;         
  status: InstallmentStatus;
  paidAt?: string;
  failedAt?: string;
  retryCount: number;      
  lastRetryAttempt?: string;
}