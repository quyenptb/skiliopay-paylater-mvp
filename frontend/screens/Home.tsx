
import React from 'react';
import { User } from '../api';
import { formatCurrency } from '../utils';

interface HomeProps {
  user: User;
  onStartCheckout: () => void;
  onGoToPlans: () => void;
}

export default function Home({ user, onStartCheckout, onGoToPlans }: HomeProps) {
  return (
    <div className="screen-content" style={{ backgroundColor: '#38C87B', color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header / Top Bar */}
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', color: '#38C87B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
             {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Hello,</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</div>
          </div>
        </div>
        <button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
             <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
             <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>

      {/* Wallet Card */}
      <div style={{ margin: '0 20px', backgroundColor: '#fff', borderRadius: 20, padding: 20, color: '#1F2937', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Skilio Wallet</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#38C87B' }}>{formatCurrency(user.balance)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>XX Bank</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#9CA3AF' }}>$2,405</div>
            </div>
         </div>

         <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {['Transfer', 'History', 'My QR', 'Other'].map(item => (
              <div key={item} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                 <div style={{ width: 48, height: 48, borderRadius: 16, border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1F2937' }}>
                   {/* Icons placeholder */}
                   <div style={{ width: 24, height: 24, background: '#D1D5DB', borderRadius: 4 }}></div>
                 </div>
                 <div style={{ fontSize: 12, fontWeight: 500 }}>{item}</div>
              </div>
            ))}
         </div>
      </div>

      {/* Services Grid (Mock) */}
      <div style={{ flex: 1, backgroundColor: '#fff', marginTop: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 32 }}>
        
        {/* Big Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
           <button 
             onClick={onStartCheckout}
             style={{ 
               padding: 20, borderRadius: 16, backgroundColor: '#ECFDF5', 
               display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 
             }}
           >
             <div style={{ width: 40, height: 40, background: '#38C87B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>$</div>
             <span style={{ fontWeight: 600, color: '#065F46' }}>Buy Item</span>
             <span style={{ fontSize: 10, color: '#065F46' }}>(Start Checkout)</span>
           </button>

           <button 
             onClick={onGoToPlans}
             style={{ 
               padding: 20, borderRadius: 16, backgroundColor: '#F0FDF4', 
               display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
               border: '2px solid #38C87B'
             }}
           >
             <div style={{ width: 40, height: 40, background: '#fff', border: '1px solid #38C87B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38C87B', fontWeight: 700 }}>PL</div>
             <span style={{ fontWeight: 600, color: '#38C87B' }}>My PayLater</span>
             <span style={{ fontSize: 10, color: '#38C87B' }}>(View Plans)</span>
           </button>
        </div>

      </div>

      {/* Bottom Nav */}
      <div style={{ height: 80, backgroundColor: '#fff', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-around', color: '#9CA3AF' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#1F2937' }}>
            <div style={{ width: 24, height: 24, background: '#1F2937', borderRadius: 4, marginBottom: 4 }}></div>
            <span style={{ fontSize: 10, fontWeight: 600 }}>Home</span>
         </div>
         <div style={{ width: 24, height: 24, background: '#E5E7EB', borderRadius: 4 }}></div>
         <div style={{ width: 48, height: 48, background: '#38C87B', borderRadius: '50%', marginTop: -24, border: '4px solid #fff' }}></div>
         <div style={{ width: 24, height: 24, background: '#E5E7EB', borderRadius: 4 }}></div>
         <div style={{ width: 24, height: 24, background: '#E5E7EB', borderRadius: 4 }}></div>
      </div>

    </div>
  );
}
