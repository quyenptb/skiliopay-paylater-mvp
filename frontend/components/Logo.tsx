
import React from 'react';

export default function Logo() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
      <div style={{ position: 'relative', fontSize: 24, fontWeight: 700, color: '#000', letterSpacing: '-0.5px' }}>
        skilioPay
        <svg 
          width="18" height="18" viewBox="0 0 24 24" fill="none" 
          style={{ position: 'absolute', top: -12, left: 16, transform: 'rotate(15deg)' }}
        >
          <path d="M12 20C12 20 2 14 2 8C2 4 5 2 8 2C10 2 12 4 12 4C12 4 14 2 16 2C19 2 22 4 22 8C22 14 12 20 12 20Z" fill="#B7E82A"/>
        </svg>
      </div>
    </div>
  );
}
