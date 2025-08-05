# Etraincon Backend

This directory contains the backend services for the Etraincon platform.

## 🚀 Overview

The backend is responsible for:
- User authentication & management
- Course, quiz, and certification data storage
- AI/ML inference endpoints (if served from backend)
- API for frontend and integrations
- Compliance and progress tracking logic

## ⚙️ Tech Stack

- Node.js (Express)
- PostgreSQL
- RESTful API (or GraphQL)
- Optional: Python microservices for ML inference

## 🏁 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
Set up environment variables:
Copy .env.example to .env and fill in your database, API keys, etc.

Run local development server:

bash
Copy
Edit
npm run dev
Database migration/seed scripts:
See /backend/scripts/ or relevant instructions.

📦 Folder Structure
/routes — API route handlers

/controllers — Core business logic

/models — DB models/schemas

/middleware — Auth, validation, etc.

/services — Third-party or internal services (email, blockchain, etc.)

/ml — (Optional) ML model serving endpoints

🧪 Testing
Run tests with:

bash
Copy
Edit
npm test
📖 Documentation
See API Reference for endpoint docs.

Contributions:
See CONTRIBUTING.md.

Contact:
For backend-specific questions, open a GitHub Issue or email backend@etraincon.com.
