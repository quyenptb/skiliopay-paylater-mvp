// backend/src/seed.ts
import db from './db';
import fixtures from '../data/paylater_seed_fixtures.json';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';


const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, timezone, locale, isVerified, successfulTxns, hasPaymentMethod, paymentMethodLast4, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCart = db.prepare(`
  INSERT INTO carts (id, userId, items, totalAmount, currency)
  VALUES (?, ?, ?, ?, ?)
`);

db.transaction(() => {
  db.exec(`DELETE FROM carts; DELETE FROM users;`);

  for (const u of fixtures.users) {
    insertUser.run(
      u.user_id,
      u.name,
      `${u.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      u.timezone,
      u.locale,
      u.verified ? 1 : 0,
      u.prior_successful_txns,
      u.has_payment_method ? 1 : 0,
      u.default_pm_last4 || null,
      formatISO(new Date())
    );
  }

  for (const c of fixtures.carts) {
  const items = Array.from({ length: c.item_count }, (_, i) => ({
    name: `Item ${i + 1}`,
    price: c.total_amount / c.item_count
  }));

  insertCart.run(
    c.cart_id,
    c.user_id,
    JSON.stringify(items),
    c.total_amount,
    c.currency
  );
}


})();
