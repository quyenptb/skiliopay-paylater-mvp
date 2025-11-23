export interface User {
  id: string;
  name: string;
  email: string;
  timezone: string;        
  locale: string;
  isVerified: boolean;
  successfulTxns: number;  
  hasPaymentMethod: boolean;
  paymentMethodLast4?: string;
  createdAt: string;        
}