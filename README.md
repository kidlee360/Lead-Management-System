## Lead Management System

## Overview
This is a modern, responsive, and secure Lead Management System designed to help sales teams track, manage, and analyze their entire sales pipeline from initial contact through closing.

The system features granular user authorization (Admin/Manager vs. Sales Rep) and comprehensive reporting for data-driven decision-making.




## Tech Stack
This application is built on the industry-leading T3 Stack principles for performance and maintainability.

- **Framework**: Next.js 14 (App Router) & React (for dynamic UI and server-side rendering (SSR) for performance)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS Modules (utility-first CSS framework for rapid, responsive design)
- **Database**: PostgreSQL (via Drizzle ORM) (robust, relational database for secure storage of leads, users, and history logs)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt (for secure password hashing) (secure, state-less authentication for user sessions and API authorization checks)
- **Deployment**: Vercel (App) / DigitalOcean Managed DB (Data) (recommended professional hosting strategy)




## Key Features
User Roles
Admin/Manager: Full access to all data, advanced reporting, user management.

Sales Rep: Access limited to only their assigned leads (owner_id filtering), ability to update lead stage/status.




## Modules
Kanban Pipeline Board: Drag-and-drop interface for visually moving leads through the sales stages.

Advanced Reporting Dashboard (Manager View):

Conversion Rate Pie Chart: Visualizes overall efficiency (Won/Lost/In-Progress).

Performance Bar Chart: Compares revenue won by individual Sales Reps.

Lead Trend Chart: Tracks month-over-month lead creation momentum.

Lead History Tracking: Uses a dedicated lead_history table to accurately calculate Time in Stage.

Secure User Management: Robust login/logout with bearer tokens and Bcrypt password hashing.

## Local Setup & Development
Follow these steps to get the project running on your local machine.

Prerequisites
Node.js (v18+)

npm or yarn

Local or remote PostgreSQL database instance.


## 1. Clone the repository
```bash
git clone https://github.com/kidlee360/Lead-Management-System.git
cd full-stack-lms
```

## 2. Install dependencies
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```


## 3. Database Setup and Schema
The SQL schema for the required tables (users, leads, lead_history, stages) is located in the database/schema.sql file.

Connect to your PostgreSQL instance.

Execute the script in database/schema.sql to create all necessary tables.

Optional: Execute the script in database/seed.sql to populate with sample data.




## 4. Configure Environment Variables
Create a file named .env.local in the root directory and populate it with your confidential keys:

# CRITICAL: Database Connection
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]"

# CRITICAL: JWT Secret for Token Signing
JWT_SECRET="Your_Long_Secure_Secret_Key_Here"

# Default Admin User Credentials (change post-initial setup)
DEFAULT_ADMIN_EMAIL="admin@lms.com"
DEFAULT_ADMIN_PASSWORD="supersecurepassword123"


## 5. Run the Application
Bash

npm run dev
# OR
yarn dev
The application will be accessible at http://localhost:3000.



## Security Summary
Password Storage: All user passwords are encrypted using Bcrypt.

Authentication: Uses JWT Bearer Tokens for state-less, secure API communication.

SQL Injection Prevention: All PostgreSQL queries use parameterized queries to prevent SQL injection attacks.

Access Control: Strict authorization checks (checkTokenAndGetRole) are applied to all sensitive API routes (e.g., admin reporting).