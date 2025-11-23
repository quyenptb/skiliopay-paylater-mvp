
import React, { useEffect, useState } from 'react';
import { FIXTURES } from './fixtures';
import { api, Agreement, EligibilityResponse, PlanDetails } from './api';
import Checkout from './screens/Checkout';
import Confirmation from './screens/Confirmation';
import Success from './screens/Success';
import Dashboard from './screens/Dashboard';
import Home from './screens/Home';
import MyPlans from './screens/MyPlans';

export default function App() {
  const [activeScenario, setActiveScenario] = useState(FIXTURES.scenarios[0]);
  
  const [view, setView] = useState<'home' | 'checkout' | 'success' | 'myplans' | 'dashboard'>('home');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [eligibility, setEligibility] = useState<EligibilityResponse>({ eligible: false });
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPlans, setUserPlans] = useState<PlanDetails[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);

  // Initialize Scenario
  useEffect(() => {
    handleScenarioChange(activeScenario);
  }, [activeScenario]);

  const handleScenarioChange = async (s: any) => {

    setActiveScenario(s);
    setView('home');
    setPaymentMethod('card');
    setShowConfirm(false);
    
    const cart = FIXTURES.carts.find(c => c.cart_id === s.cart_id);
    if (cart) {
      const res = await api.checkEligibility(s.user_id, cart.total_amount);
      setEligibility(res);
    }
  };

  const loadUserPlans = async () => {
  const plans = await api.getMyPlans(activeScenario.user_id); 

  setUserPlans(plans);
};

  // --- Actions ---

  const handlePay = () => {
    if (paymentMethod === 'paylater') {
      setShowConfirm(true);
    } else {
      alert(`Standard payment via ${paymentMethod} success`);
    }
  };

  const confirmPayLater = async () => {
  setLoading(true);
  try {
    const agreement = await api.createAgreement(activeScenario.user_id, activeScenario.cart_id);
    const updated = await api.getPlanDetails(activeScenario.user_id, agreement.id);
    setSelectedPlan(updated); 
    setShowConfirm(false);
    setView('success');
  } catch (e: any) {
    alert(`Error: ${e.message}`);
  } finally {
    setLoading(false);
  }
};


  // --- Navigation ---
  
  const goToMyPlans = async () => {
    await loadUserPlans();
    setView('myplans');
  };

  const goToDashboard = (plan: PlanDetails) => {
  api.getPlanDetails(activeScenario.user_id, plan.agreement.id).then(details => {
    setSelectedPlan(details); // details: { agreement, installments, logs }
    setView('dashboard');
  });
};

  // Find User/Cart Objects
  const currentUser = FIXTURES.users.find(u => u.user_id === activeScenario.user_id);
  const currentCart = FIXTURES.carts.find(c => c.cart_id === activeScenario.cart_id);

  if (!currentUser || !currentCart) return <div>Error loading scenario data</div>;

  return (
    <div className="app-shell" style={{ width: 375, height: 812, background: '#fff', borderRadius: 40, overflow: 'hidden', position: 'relative', boxShadow: '0 0 0 10px #1f1f1f, 0 20px 50px rgba(0,0,0,0.5)' }}>
      
      {/* Scenario Debugger */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', overflowX: 'auto', background: '#333', padding: 4 }}>
        {FIXTURES.scenarios.map(s => (
          <button 
            key={s.id} 
            onClick={() => handleScenarioChange(s)} 
            style={{ 
              padding: '4px 8px', fontSize: 10, borderRadius: 4, marginRight: 4,
              background: activeScenario.id === s.id ? '#38C87B' : '#555', 
              color: 'white', fontWeight: 600, border: 'none', whiteSpace: 'nowrap'
            }}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div style={{ height: 44, display: 'flex', justifyContent: 'space-between', padding: '0 24px', alignItems: 'center', fontSize: 14, fontWeight: 600, marginTop: 24, backgroundColor: view === 'home' ? '#38C87B' : '#fff', color: view === 'home' ? '#fff' : '#000' }}>
         <span>9:41</span>
         <div style={{ width: 18, height: 12, border: `1px solid ${view === 'home' ? '#fff' : '#000'}`, borderRadius: 4 }}></div>
      </div>

      {view === 'home' && (
        <Home 
          user={currentUser} 
          onStartCheckout={() => setView('checkout')} 
          onGoToPlans={goToMyPlans} 
        />
      )}

      {view === 'checkout' && (
        <Checkout 
          cart={currentCart} 
          eligibility={eligibility} 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
          onPay={handlePay}
        />
      )}

      {showConfirm && (
        <Confirmation 
          amount={currentCart.total_amount} 
          onConfirm={confirmPayLater} 
          loading={loading} 
        />
      )}

      {view === 'success' && selectedPlan && (
  <Success 
    plan={selectedPlan} 
    onHome={() => setView('home')} 
    onSeePlan={() => goToDashboard(selectedPlan)}
  />
)}


      {view === 'myplans' && (
        <MyPlans 
  plans={userPlans} 
  onBack={() => setView('home')} 
  onSelectPlan={goToDashboard}
/>

      )}

      {view === 'dashboard' && selectedPlan && (
        <Dashboard 
          plan={selectedPlan} 
          onHome={() => setView('home')} 
          onRefresh={async () => {
  const updated = await api.getPlanDetails(activeScenario.user_id, selectedPlan.agreement.id);
  setSelectedPlan(updated); 
}}
        />
      )}

    </div>
  );
}
