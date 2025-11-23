export type ActivityType =
  | 'agreement_created'
  | 'charge_attempted'
  | 'charge_succeeded'
  | 'charge_failed'
  | 'retry_triggered'
  | 'agreement_cancelled';

export interface ActivityLog {
  id: string;
  agreementId: string;
  type: ActivityType;
  metadata?: Record<string, any>;
  createdAt: string;     
}