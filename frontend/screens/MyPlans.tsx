
import React from 'react';
import { Agreement, PlanDetails } from '../api';
import { formatCurrency, formatDate } from '../utils';

interface MyPlansProps {
  plans: PlanDetails[];
  onBack: () => void;
  onSelectPlan: (plan: PlanDetails) => void;
}

export default function MyPlans({ plans, onBack, onSelectPlan }: MyPlansProps) {
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return '#1C9085'; // Teal
      case 'SUSPENDED': return '#EF4444'; // Red
      case 'COMPLETED': return '#38C87B'; // Green
      case 'CANCELLED': return '#9CA3AF'; // Gray
      default: return '#000';
    }
  };

  return (
    <div className="screen-content" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      
      {/* Header */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', backgroundColor: '#fff', borderBottom: '1px solid #F3F4F6' }}>
         <button style={{ fontSize: 24, padding: 8 }} onClick={onBack}>‹</button>
         <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>My PayLater Plans</div>
         <div style={{ width: 40 }}></div>
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        
        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 100, color: '#9CA3AF' }}>No plans found.</div>
        ) : (
          plans.map(planWrapper => {
             const { agreement, installments } = planWrapper;
             const nextDue = installments.find(i => i.status !== 'PAID');
             
             return (
              <div 
                key={agreement.id} 
                onClick={() => onSelectPlan(planWrapper)}
                style={{ 
                  backgroundColor: getStatusColor(agreement.status), 
                  borderRadius: 12, padding: 16, marginBottom: 16,
                  color: '#fff', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Plan {agreement.id.slice(-4)}</div>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>Merchant: {agreement.merchant || 'N/A'}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                       {installments.length > 0 ? formatCurrency(installments[0].amount) : 0}/{formatCurrency(agreement.totalAmount)}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700 }}>
                       Status: {agreement.status}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', fontSize: 11, opacity: 0.9 }}>
                     {installments.map(i => (
                       <div key={i.id} style={{ marginBottom: 2 }}>
                         Inst {i.installmentNumber}: {i.status === 'PAID' ? 'Paid' : formatDate(i.dueDate)}
                       </div>
                     ))}
                     {agreement.status === 'ACTIVE' && (
                       <div style={{ marginTop: 8, background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 4, display: 'inline-block' }}>
                         Cancel Plan
                       </div>
                     )}
                  </div>
                </div>
              </div>
             );
          })
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          {plans.length > 0 && plans[0].installments.length > 0 && (
            <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
              Your next installment due is {formatDate(plans[0].installments.find(i => i.status !== 'PAID')?.dueDate || '')}
            </div>
          )}
          <div style={{ fontSize: 10, color: '#38C87B', marginTop: 4 }}>You will be reminded 3 days & 1 day before the due</div>
        </div>

      </div>

      <div style={{ padding: 20, backgroundColor: '#fff', borderTop: '1px solid #F3F4F6' }}>
         <button onClick={onBack} style={{ width: '100%', height: 48, borderRadius: 24, backgroundColor: '#38C87B', color: '#fff', fontWeight: 600 }}>
           Go to home
         </button>
      </div>

    </div>
  );
}