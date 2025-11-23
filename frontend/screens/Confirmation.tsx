
import React from 'react';
import { formatCurrency, calculatePreview, formatDate, addDays } from '../utils';

interface ConfirmationProps {
  amount: number;
  onConfirm: () => void;
  loading: boolean;
}

export default function Confirmation({ amount, onConfirm, loading }: ConfirmationProps) {
  const preview = calculatePreview(amount);
  const today = new Date();
  const date2 = addDays(today, 30);
  const date3 = addDays(today, 60);

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{ width: 320, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>skilioPay PayLater</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{formatCurrency(amount)}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>Your Installment Plan</div>
        </div>

        <div style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: '#4B5563' }}>Installment 1: <strong style={{ color: '#000' }}>Pay today</strong></span>
            <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(preview.first)}</strong>
          </div>
          <div style={{ height: 1, background: '#E5E7EB', margin: '8px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span style={{ color: '#4B5563' }}>Installment 2: {formatDate(date2)}</span>
            <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(preview.others)}</strong>
          </div>
          <div style={{ height: 1, background: '#E5E7EB', margin: '8px 0' }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#4B5563' }}>Installment 3: {formatDate(date3)}</span>
            <strong style={{ color: 'var(--color-primary)' }}>{formatCurrency(preview.others)}</strong>
          </div>
        </div>

        <button 
          onClick={onConfirm}
          disabled={loading}
          style={{
            width: '100%', height: 44, backgroundColor: 'var(--color-primary)', color: '#fff',
            fontWeight: 600, borderRadius: 22, marginTop: 24, fontSize: 14
          }}
        >
          {loading ? 'Processing...' : 'Confirm and Pay'}
        </button>
      </div>
    </div>
  );
}
