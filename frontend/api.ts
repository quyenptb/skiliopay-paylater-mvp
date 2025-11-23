
import { FIXTURES } from './fixtures';

const BASE_URL = 'http://localhost:3000/api/paylater';

// --- Types ---
export interface User {
  user_id: string;
  name: string;
  verified: boolean;
  prior_successful_txns: number;
  has_payment_method: boolean;
  balance: number;
}

export interface Cart {
  cart_id: string;
  total_amount: number;
  merchant: string;
  items: number;
}

export interface EligibilityResponse {
  eligible: boolean;
  reason?: string;
}

export interface Installment {
  id: string;
  agreementId: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: | 'PAID' 
  | 'UPCOMING' 
  | 'DUE' 
  | 'OVERDUE' 
  | 'FAILED' 
  | 'PENDING_RETRY';
  paidAt?: string | null;
  failedAt?: string | null;
  retryCount?: number;
  lastRetryAttempt?: string | null;
}

export interface Agreement {
  id: string;
  userId: string;
  orderId: string;
  totalAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';
  merchant: string;
  createdAt: string;
  //installments: Installment[];
}

export interface PlanDetails {
  agreement: Agreement;
  installments: Installment[];
  logs?: any[];
}



const getHeaders = (userId: string) => ({
  'Content-Type': 'application/json',
  'x-user-id': userId
});

export const api = {
  
  // 1. Check Eligibility
  // POST /api/paylater/eligibility
  checkEligibility: async (userId: string, amount: number): Promise<EligibilityResponse> => {
    const res = await fetch(`${BASE_URL}/eligibility`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, amount }) // Sending userId in body too as per some backend patterns, but header is key
    });
    
    if (!res.ok) {
        // Handle server errors or 400s
        const err = await res.json();
        console.error("Eligibility Check Failed:", err);
        return { eligible: false, reason: err.error || "Server Error" };
    }

    return await res.json();
  },

  // 2. Create Agreement
  // POST /api/paylater/create
  createAgreement: async (userId: string, cartId: string): Promise<Agreement> => {
    const res = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ cartId })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create agreement');
    }

    return await res.json();
  },

  // 3. Get My Plans
  // GET /api/paylater/my-plans
  getMyPlans: async (userId: string): Promise<Agreement[]> => {
    const res = await fetch(`${BASE_URL}/my-plans`, {
      method: 'GET',
      headers: getHeaders(userId)
    });

    if (!res.ok) {
      console.error("Failed to fetch plans");
      return [];
    }

    return await res.json();
  },

  // 4. Get Single Plan Details
  // GET /api/paylater/plans/:id
  getPlanDetails: async (userId: string, agreementId: string): Promise<PlanDetails> => {
    const res = await fetch(`${BASE_URL}/plans/${agreementId}`, {
      method: 'GET',
      headers: getHeaders(userId)
    });

    if (!res.ok) {
      throw new Error('Plan not found');
    }

    return await res.json();
  },

  // 5. Retry Payment
  // POST /api/paylater/pay/:installmentId
  retryPayment: async (userId: string, installmentId: string, simulateFailure: boolean): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/pay/${installmentId}`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ simulateFailure })
    });

    const data = await res.json();

    if (!res.ok) {
      // Backend returns 402 or 400 on failure
      throw new Error(data.message || data.error || 'Payment failed');
    }

    return data;
  }
};
