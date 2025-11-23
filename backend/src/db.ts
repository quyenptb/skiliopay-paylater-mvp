// src/db.ts
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('paylater.db', { verbose: console.log }); 

db.exec('PRAGMA foreign_keys = ON;');



db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    locale TEXT,
    isVerified INTEGER NOT NULL DEFAULT 0,        -- 0 = false, 1 = true
    successfulTxns INTEGER NOT NULL DEFAULT 0,
    hasPaymentMethod INTEGER NOT NULL DEFAULT 0,
    paymentMethodLast4 TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    items TEXT NOT NULL,              -- JSON stringified
    totalAmount REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS agreements (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('ab89', 1 + (abs(random()) % 4), 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    userId TEXT NOT NULL,
    orderId TEXT NOT NULL,
    totalAmount REAL NOT NULL,
    currency TEXT NOT NULL,
    installmentCount INTEGER NOT NULL DEFAULT 3,
    amountPerInstallment REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    createdAt TEXT NOT NULL,
    firstPaidAt TEXT,
    cancelledAt TEXT,
    FOREIGN KEY (userId) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS installments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('ab89', 1 + (abs(random()) % 4), 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    agreementId TEXT NOT NULL,
    installmentNumber INTEGER NOT NULL,
    amount REAL NOT NULL,
    dueDate TEXT NOT NULL,
    status TEXT NOT NULL,
    paidAt TEXT,
    failedAt TEXT,
    retryCount INTEGER NOT NULL DEFAULT 0,
    lastRetryAttempt TEXT,
    FOREIGN KEY (agreementId) REFERENCES agreements (id)
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('ab89', 1 + (abs(random()) % 4), 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
    agreementId TEXT NOT NULL,
    type TEXT NOT NULL,
    metadata TEXT,                    -- JSON stringified
    createdAt TEXT NOT NULL,
    FOREIGN KEY (agreementId) REFERENCES agreements (id)
  );
`);




export default db;