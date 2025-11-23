
import React from 'react';
import { PlanDetails } from '../api';
import { formatCurrency, formatDate } from '../utils';

interface SuccessProps {
  plan: PlanDetails;
  onHome: () => void;
  onSeePlan: () => void;
}

export default function Success({ plan, onHome, onSeePlan }: SuccessProps) {
  
  console.log("Raw plan:", plan);
console.log("Keys:", Object.keys(plan));
console.log("Installments actual:", (plan as any).installments);

  
  const firstInstallment = plan.installments[0];
  const nextInstallment = plan.installments[1];
  const lastInstallment = plan.installments[2];

  return (
    <div className="screen-content" style={{ display: 'flex', flexDirection: 'column' }}>
       {/* Header */}
       <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', position: 'relative' }}>
         <button style={{ fontSize: 24, padding: 8 }} onClick={onHome}>‹</button>
         <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>PayLater Plan</div>
       </div>

       <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', paddingBottom: 100 }}>
          
          {/* Big Success Circle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ 
              width: 96, height: 96, borderRadius: '50%', backgroundColor: '#DCFCE7', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
            }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                  <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-primary)' }}>
               {formatCurrency(firstInstallment.amount)}
            </div>
            <div style={{ 
              backgroundColor: '#DCFCE7', color: 'var(--color-primary)', 
              padding: '8px 24px', borderRadius: 20, fontSize: 14, fontWeight: 700, marginTop: 12 
            }}>
              Payment Success!
            </div>
          </div>

          {/* Progress Section */}
          <div style={{ marginBottom: 24 }}>
             <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Your progress</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>1 installment completed</span>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(firstInstallment.paidAt || new Date())}</span>
             </div>
             <div style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: '33%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, padding: '0 2px' }}>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#9CA3AF' }}></div>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#9CA3AF' }}></div>
             </div>
          </div>

          {/* Details Card */}
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: 14, color: '#6B7280', fontWeight: 500 }}>Total Amount</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>{formatCurrency(plan.agreement.totalAmount)}</span>
             </div>

             {/* Row 1 */}
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E5E7EB', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Installment 1</span>
                <div style={{ 
                  border: '1px solid var(--color-primary)', color: 'var(--color-primary)', 
                  padding: '2px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700 
                }}>
                  Paid
                </div>
             </div>

             {/* Row 2 */}
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E5E7EB', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Installment 2</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                  {formatCurrency(nextInstallment.amount)} at {formatDate(nextInstallment.dueDate)}
                </span>
             </div>

             {/* Row 3 */}
             <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>Installment 3</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                   {formatCurrency(lastInstallment.amount)} at {formatDate(lastInstallment.dueDate)}
                </span>
             </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#9CA3AF' }}>
               Your next installment is due on {formatDate(nextInstallment.dueDate)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-primary)', marginTop: 4 }}>
               You will be reminded 3 days & 1 day before due
            </div>
          </div>

       </div>

       {/* Footer Buttons */}
       <div style={{ 
         position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 32px 20px', 
         background: '#fff', borderTop: '1px solid #F3F4F6',
         display: 'flex', gap: 12
       }}>
          <button 
             onClick={onSeePlan}
             style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: '#6B7280', color: '#fff', fontWeight: 600, fontSize: 16 }}
          >
            See Full Plan
          </button>
          <button 
             onClick={onHome}
             style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: 16 }}
          >
            Go to home
          </button>
       </div>
       <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
         <div style={{ width: 134, height: 5, background: '#000', borderRadius: 100 }}></div>
       </div>
    </div>
  );
}
