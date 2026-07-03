# Harbor CRM — Customer Management System

A full-stack CRM web application for managing customers, built with React, Express, and MySQL. Features complete CRUD operations, a dashboard with analytics, JWT authentication, dark mode, and CSV export.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Full CRUD** — create, read, update, and delete customers
- **Dashboard** — live stats, an animated donut chart, and recent customers
- **Search, filter & pagination** — find customers fast
- **Authentication** — signup/login with hashed passwords (bcrypt) and JWT tokens
- **Protected API** — customer data requires a valid token
- **Dark mode** — toggle with a saved preference 🌙
- **CSV export** — download the full customer list 📤
- **Form validation** — clear inline errors
- **Responsive, modern UI** — built with Tailwind CSS

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), React Router, Axios, Tailwind CSS, Recharts, Framer Motion |
| Backend | Node.js, Express |
| Database | MySQL with Sequelize ORM |
| Auth | JWT, bcryptjs |

## 📂 Project Structure

```
customer-management-system/
├── client/              # React frontend
│   └── src/
│       ├── api/          # Axios calls
│       ├── components/   # Reusable UI (Sidebar, Modal, etc.)
│       ├── context/      # Auth context
│       └── pages/        # Dashboard, Customers, Login, etc.
└── server/              # Express backend
    ├── config/           # Database connection
    ├── controllers/      # Route logic
    ├── middleware/       # Auth middleware
    ├── models/           # Sequelize models
    └── routes/           # API routes
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- MySQL (e.g. via [XAMPP](https://www.apachefriends.org/))

### 1. Clone the repository
```bash
git clone https://github.com/yostena16/customer-management-system.git
cd customer-management-system
```

### 2. Set up the database
Start MySQL (XAMPP) and create a database named `crm_db` (via phpMyAdmin). The tables are created automatically on first run.

### 3. Set up the backend
```bash
cd server
npm install
```
Create a `.env` file in `server/` (see `.env.example`):
```env
PORT=5000
DB_NAME=crm_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=your_long_random_secret
```
Start the backend:
```bash
npm run dev
```

### 4. Set up the frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

### 5. Open the app
Visit **http://localhost:5173** 🎉

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register a user | — |
| POST | `/api/auth/login` | Log in, get a token | — |
| GET | `/api/customers` | List customers (search, pagination) | ✅ |
| GET | `/api/customers/:id` | Get one customer | ✅ |
| POST | `/api/customers` | Create a customer | ✅ |
| PUT | `/api/customers/:id` | Update a customer | ✅ |
| DELETE | `/api/customers/:id` | Delete a customer | ✅ |

## 🔮 Future Improvements
- Role-based access (admin vs. staff)
- Customer interaction/activity timeline
- Email notifications
- Deployment (Vercel + Render)

## 📝 License
This project is open source and available under the [MIT License](LICENSE).

## 👤 Author
Built by [yostena16](https://github.com/yostena16).