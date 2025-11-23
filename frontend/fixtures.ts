
export const FIXTURES = {
  meta: {
    currency: "USD",
    eligible_threshold: 30.0,
    max_threshold: 500.0,
  },
  users: [
    {
      user_id: "U001",
      name: "Alya Pratama",
      verified: true,
      prior_successful_txns: 3,
      has_payment_method: true,
      balance: 45678.90
    },
    {
      user_id: "U002",
      name: "Bao Nguyen",
      verified: true,
      prior_successful_txns: 2,
      has_payment_method: false,
      balance: 210.50
    },
    {
      user_id: "U003",
      name: "Nur Izzah",
      verified: false,
      prior_successful_txns: 1,
      has_payment_method: true,
      balance: 1000.00
    },
    {
      user_id: "U004",
      name: "Kai Chen",
      verified: true,
      prior_successful_txns: 1,
      has_payment_method: true,
      balance: 50.00
    },
    {
      user_id: "U005",
      name: "Thao Le",
      verified: true,
      prior_successful_txns: 0,
      has_payment_method: true,
      balance: 300.00
    },
    {
      user_id: "U006",
      name: "Rizky Saputra",
      verified: true,
      prior_successful_txns: 5,
      has_payment_method: true,
      balance: 8900.00
    },
    {
      user_id: "U007",
      name: "Maricar Dizon",
      verified: true,
      prior_successful_txns: 4,
      has_payment_method: true,
      balance: 120.00
    },
  ],
  carts: [
    { cart_id: "C001", total_amount: 120.0, merchant: "Lazada", items: 3 },
    { cart_id: "C002", total_amount: 45.5, merchant: "Shopee", items: 2 },
    { cart_id: "C003", total_amount: 85.0, merchant: "Zalora", items: 1 },
    { cart_id: "C004", total_amount: 150.0, merchant: "Tokopedia", items: 4 },
    { cart_id: "C005", total_amount: 29.99, merchant: "GrabFood", items: 1 },
    { cart_id: "C006", total_amount: 60.0, merchant: "Gojek", items: 2 },
    { cart_id: "C007", total_amount: 999.99, merchant: "Apple Store", items: 6 },
    { cart_id: "C008", total_amount: 30.0, merchant: "Uniqlo", items: 1 },
  ],
  scenarios: [
    { id: "S001", user_id: "U001", cart_id: "C001", desc: "Happy Path: Eligible User, Standard Cart" },
    { id: "S002", user_id: "U001", cart_id: "C002", desc: "Retry Flow: Payment Fail -> Retry Success" },
    { id: "S003", user_id: "U006", cart_id: "C007", desc: "High Value > $500 (Ineligible)" },
    { id: "S004", user_id: "U002", cart_id: "C003", desc: "Ineligible: No Payment Method" },
    { id: "S005", user_id: "U003", cart_id: "C004", desc: "Ineligible: Unverified" },
    { id: "S006", user_id: "U005", cart_id: "C006", desc: "Ineligible: No History" },
    { id: "S007", user_id: "U004", cart_id: "C005", desc: "Amount < $30 (Ineligible)" },
    { id: "S008", user_id: "U007", cart_id: "C008", desc: "Edge Case: Exact $30 Threshold" },
  ]
};
