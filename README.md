# SkilioPay PayLater MVP

A working prototype for SkilioPay's "Buy Now, Pay Later" feature, enabling users to split eligible purchases ($10 - $500) into 3 equal installments.

## Features

Eligibility Engine: Automatically checks user history, verification status, and cart amount limits.

Smart Installment Calculation: Handles currency rounding precisely (no lost cents).

Resilient Payment System:

Happy Path: Instant approval and schedule creation.

Retry Logic: Handles failed payments with a manual retry option.

Auto-Scheduler Simulation: A dedicated endpoint to simulate daily cron-jobs for auto-charging due payments and managing retries.

Security: Middleware-based authentication using x-user-id context.

## Setup Instructions

Prerequisites

Node.js (v16 or higher)

npm or pnpm

Installation

Clone the repository:

git clone [https://github.com/yourusername/skiliopay-mvp.git](https://github.com/yourusername/skiliopay-mvp.git)
cd skiliopay-mvp


Install dependencies:

npm install


Running the Project

Start the Backend Server:

npm run dev

## Server runs on http://localhost:3000



## Known Limitations (MVP)

Data Persistence: Uses better-sqlite3 (file-based). Data resets when the seed script is run.

Authentication: Uses a header-based mock authentication (x-user-id) instead of a full JWT implementation.

Payment Gateway: Simulated. No actual funds are deducted.

Concurrency: Scheduler is synchronous for demo purposes; production would use a message queue (RabbitMQ/Kafka).
