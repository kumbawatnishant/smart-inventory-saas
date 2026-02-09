# 📦 Smart Inventory AI SaaS

![Status](https://img.shields.io/badge/Status-MVP_Ready-success)
![AI](https://img.shields.io/badge/AI-Powered-purple)
![License](https://img.shields.io/badge/License-MIT-blue)

> **Stop losing money on overstock.** A smart inventory system that uses Generative AI to predict demand and automate e-commerce workflows.

## 🚀 Live Demo

**[View Live Demo](https://your-demo-link.com)**  
*Credentials:* `admin` / `password`

---

## 💡 The Problem
Small e-commerce shops struggle with two things:
1.  **Stockouts & Overstock**: Guessing how much to order leads to lost sales or dead capital.
2.  **Content Fatigue**: Writing SEO descriptions for hundreds of SKUs is tedious.

## 🤖 The Solution
**Smart Inventory AI** solves this by integrating **Groq (Llama 3)** directly into the supply chain.

### Key Features

-   **🔮 AI Demand Forecasting**: Calculates "Days Remaining" based on sales velocity and flags critical stock.
-   **🧠 Strategic Restocking**: The AI analyzes sales history to recommend *exact* reorder quantities and urgency levels.
-   **✍️ Auto-SEO**: Generates high-converting, SEO-optimized product descriptions with one click.
-   **📊 Real-Time Analytics**: Interactive dashboard built with React & Tailwind CSS.
-   **🔐 Secure Access**: Role-based authentication using JWT.

---

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Lucide React
-   **Backend**: Node.js, Express.js, SQLite (Dev)
-   **AI Engine**: Groq SDK (Llama 3.3 70b)
-   **Auth**: JWT & Bcrypt

---

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/smart-inventory-saas.git
cd smart-inventory-saas
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3000
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secret_key
```

### 3. Seed Database
Initialize the SQLite database with dummy products, sales history, and the admin user:
```bash
node setup_db.js
```

### 4. Run
Start the backend and frontend:
```bash
# Terminal 1 (Backend)
node server.js

# Terminal 2 (Frontend)
npm run dev
```

---

## 📸 Screenshots

| Dashboard Overview | AI Predictions |
|:---:|:---:|
| *(Place GIF/Screenshot here)* | *(Place GIF/Screenshot here)* |

---

## 📄 License
MIT