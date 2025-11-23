
import React from 'react';
import { Cart, EligibilityResponse } from '../api';
import { formatCurrency, calculatePreview } from '../utils';
import Logo from '../components/Logo';

interface CheckoutProps {
  cart: Cart;
  eligibility: EligibilityResponse;
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  onPay: () => void;
}

export default function Checkout({ cart, eligibility, paymentMethod, setPaymentMethod, onPay }: CheckoutProps) {
  const preview = calculatePreview(cart.total_amount);

  const Radio = ({ selected, disabled }: { selected: boolean, disabled?: boolean }) => (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: `2px solid ${selected ? '#000' : '#D1D5DB'}`, 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: disabled ? 0.5 : 1
    }}>
      {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#000' }}></div>}
    </div>
  );

  return (
    <div className="screen-content">
      <div style={{ padding: '20px 0 24px 0', textAlign: 'center' }}>
        <Logo />
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: '#000' }}>Order Total</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#000' }}>{formatCurrency(cart.total_amount)}</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 24, textAlign: 'left', paddingLeft: 4 }}>Select Payment Method</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Wallet */}
        <div 
          onClick={() => setPaymentMethod('wallet')}
          style={{ 
            border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px', 
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ marginRight: 16 }}>
             <Radio selected={paymentMethod === 'wallet'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937' }}>skilioPay Wallet</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Balance: $456.78</div>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>skilioPay</div>
        </div>

        {/* Visa */}
        <div 
          onClick={() => setPaymentMethod('card')}
          style={{ 
            border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px', 
            display: 'flex', alignItems: 'center', cursor: 'pointer',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ marginRight: 16 }}>
             <Radio selected={paymentMethod === 'card'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937' }}>VISA Card</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>Saved Card: **** **** 1234</div>
          </div>
          <div style={{ fontWeight: 800, color: '#1A1F71', fontSize: 16 }}>VISA</div>
        </div>

        {/* PayLater */}
        <div 
          onClick={() => eligibility.eligible && setPaymentMethod('paylater')}
          style={{ 
            border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px', 
            display: 'flex', alignItems: 'center', 
            cursor: eligibility.eligible ? 'pointer' : 'default',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            opacity: eligibility.eligible ? 1 : 0.6
          }}
        >
          <div style={{ marginRight: 16 }}>
             {eligibility.eligible ? (
               <Radio selected={paymentMethod === 'paylater'} />
             ) : (
               <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#F3F4F6' }}></div>
             )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#1F2937' }}>PayLater - Split into 3 Installments</div>
            {eligibility.eligible ? (
               <div style={{ fontSize: 13, color: '#4B5563', marginTop: 4 }}>
                 3 installments of <span style={{fontWeight: 600}}>{formatCurrency(preview.others)}</span>
               </div>
            ) : (
               <div style={{ fontSize: 13, color: '#EF4444', marginTop: 4, fontWeight: 500 }}>
                 {eligibility.reason}
               </div>
            )}
          </div>
        </div>

      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 32px 20px', background: '#fff' }}>
        <button 
          onClick={onPay}
          disabled={paymentMethod === 'paylater' && !eligibility.eligible}
          style={{
            width: '100%', height: 50, borderRadius: 25,
            backgroundColor: (paymentMethod === 'paylater' && !eligibility.eligible) ? '#9CA3AF' : 'var(--color-primary)',
            color: '#fff', fontSize: 16, fontWeight: 600,
            transition: 'background-color 0.2s',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          Pay {formatCurrency(cart.total_amount)}
        </button>
        <div style={{ width: 134, height: 5, background: '#000', margin: '20px auto 0', borderRadius: 100 }}></div>
      </div>
    </div>
  );
}
