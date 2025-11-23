
import React, { useState } from 'react';
import { Agreement, Installment, api, PlanDetails } from '../api';
import { formatCurrency, formatDate } from '../utils';


interface DashboardProps {
  plan: PlanDetails;
  onHome: () => void;
  onRefresh: () => void;
}

export default function Dashboard({ plan, onHome, onRefresh }: DashboardProps) {
  const [processing, setProcessing] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [forceFail, setForceFail] = useState(false);

  const { agreement, installments } = plan;
  const isSuspended = agreement.status === 'SUSPENDED';
  const paidCount = installments.filter(i => i.status === 'PAID').length;
  const failedItem = installments.find(i => i.status === 'FAILED');

  const handleRetry = async () => {
    if (!failedItem) return;
    setProcessing(true);
    try {
      await api.retryPayment(agreement.userId, failedItem.id, forceFail);
      onRefresh();
    } catch (e: any) {
      setFailMessage(e.message || "Payment couldn't be processed");
      setShowFailModal(true);
    } finally {
      setProcessing(false);
    }
  };

const renderInstallmentRow = (inst: Installment) => {
  const isPaid = inst.status === 'PAID';
  const isOverdue = inst.status === 'OVERDUE';

  // Status màu
  let statusBorder = isPaid ? 'var(--color-primary)' : '#E5E7EB';
  let statusText = isPaid ? 'var(--color-primary)' : (isOverdue ? '#EF4444' : '#000');
  let statusLabel = isPaid ? 'Paid' : (isOverdue ? 'Overdue' : 'Not Paid');

  // Tính Late Fee
  const lateFee = isOverdue ? Math.max(2, inst.amount * 0.02) : 0;

  return (
    <div key={inst.id} style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: '#fff', 
          padding: '8px 0', 
          borderRadius: 6, 
          fontSize: 12, 
          fontWeight: 700, 
          width: 100, 
          textAlign: 'center'
        }}>
          Installment {inst.installmentNumber}
        </div>

        <div style={{ 
          border: '1px solid',
          borderColor: statusBorder,
          color: statusText,
          padding: '4px 0',
          width: 90,
          textAlign: 'center',
          borderRadius: 16,
          fontSize: 12,
          fontWeight: 700,
          backgroundColor: !isPaid && isOverdue ? '#FEE2E2' : 'transparent'
        }}>
          {statusLabel}
        </div>

        <div style={{ width: 60, textAlign: 'right', fontWeight: 700, fontSize: 14 }}>
          {formatCurrency(inst.amount)}
        </div>
      </div>

      {/* Late fee nằm ngay bên dưới, cùng form, màu đỏ */}
      {isOverdue && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>
            + {formatCurrency(lateFee)}
          </span>
        </div>
      )}
    </div>
  );
};



  return (
    <div className="screen-content" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
       {/* Header */}
       <div style={{ height: 44, display: 'flex', alignItems: 'center', padding: '0 16px', position: 'relative', borderBottom: '1px solid #F3F4F6' }}>
         <button style={{ fontSize: 24, padding: 8 }} onClick={onHome}>‹</button>
         <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>PayLater Dashboard</div>
       </div>

       <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', paddingBottom: 100 }}>
          
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            Plan {agreement.id.slice(-4)} {isSuspended ? 'full plan' : ''}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: 15, fontWeight: 600, marginBottom: 32 }}>
             <div>Merchant: {agreement.merchant || 'N/A'}</div>
             <div>Status: {agreement.status}</div>
          </div>

          <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 24 }}>
             {installments.length > 0 ? formatCurrency(installments[0].amount) : 0}/{formatCurrency(agreement.totalAmount)}
             {isSuspended && <span style={{color: '#1F2937'}}>+$2.0</span>}
          </div>

          <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Your progress</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{paidCount} installment completed</span>
              </div>
              <div style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
                <div style={{ flex: 1, backgroundColor: 'var(--color-primary)' }}></div>
                <div style={{ flex: 1, backgroundColor: paidCount > 1 ? 'var(--color-primary)' : 'transparent' }}></div>
                <div style={{ flex: 1, backgroundColor: paidCount > 2 ? 'var(--color-primary)' : 'transparent' }}></div>
              </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
             <span>Total Amount</span>
             <span style={{ fontWeight: 700, color: '#000' }}>{formatCurrency(agreement.totalAmount)}</span>
          </div>
          <div style={{ height: 1, backgroundColor: '#E5E7EB', marginBottom: 16 }}></div>

          <div style={{ paddingBottom: 20 }}>
             {installments.map(inst => renderInstallmentRow(inst))}
          </div>

          {isSuspended && failedItem && (
             <div style={{ marginTop: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                   Late for Installment {failedItem.installmentNumber} due at {formatDate(failedItem.dueDate)}
                </div>
                
                <div style={{ marginBottom: 8, fontSize: 10, color: '#999' }}>
                   <label>
                     <input type="checkbox" checked={forceFail} onChange={e => setForceFail(e.target.checked)} /> Simulate API Failure
                   </label>
                </div>

                <button 
                  onClick={handleRetry}
                  disabled={processing}
                  style={{
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    padding: '12px 32px', borderRadius: 24, fontWeight: 600, fontSize: 16,
                    opacity: processing ? 0.7 : 1
                  }}
                >
                  {processing ? 'Processing...' : 'Retry Payment Now'}
                </button>
             </div>
          )}

       </div>

       <div style={{ 
         position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 32px 20px', 
         background: '#fff', borderTop: '1px solid #F3F4F6',
         display: 'flex', gap: 12
       }}>
          <button style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: '#6B7280', color: '#fff', fontWeight: 600, fontSize: 16 }}>
            See Order
          </button>
          <button onClick={onHome} style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 600, fontSize: 16 }}>
            Go to home
          </button>
       </div>

      {showFailModal && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            width: 320, backgroundColor: '#fff', borderRadius: 24, padding: '24px 20px',
            textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#000', marginBottom: 4 }}>skilioPay PayLater</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#000', marginBottom: 12 }}>
              {formatCurrency(failedItem?.amount || 0)}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1C9085', marginBottom: 16 }}>
              Payment Failed
            </div>

            <div style={{ backgroundColor: '#FFF5F5', padding: 16, borderRadius: 8, marginBottom: 24, textAlign: 'left' }}>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8, lineHeight: 1.5 }}>
                 {failMessage || "Your payment couldn't be processed. Please update your card."}
              </p>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                 Contact 9123 4567 for help!
              </p>
            </div>

            <button 
              onClick={() => setShowFailModal(false)}
              style={{
                width: '100%', height: 48, borderRadius: 24,
                backgroundColor: 'var(--color-primary)', color: '#fff',
                fontWeight: 600, fontSize: 16
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}