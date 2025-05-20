# ShopEasy

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

> ShopEasy is a full-featured eCommerce platform built using the MERN stack

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [Configuration](#configuration)

## 🔍 Overview

ShopEasy is a comprehensive eCommerce platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It provides a robust solution for online shopping experiences with modern authentication, efficient state management, and responsive design.

## 💻 Technologies Used

### Frontend
- **React.js** (with Vite)
- **Redux Toolkit** and **Redux-Persist** for state management
- **Ant Design** for UI components and styling
- **Clerk** for user authentication

### Backend
- **Express.js** server
- **MongoDB** database
- **Mongoose** for data modeling
- **Clerk** for authentication and validation
- **REST API** architecture
- **CORS** for cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js (latest stable version recommended)
- Git
- MongoDB database
- Clerk account for authentication services

### Installation

1. Clone the repository
```bash
git clone https://github.com/JiteshBalani/eCom.git
cd eCom
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Setup

1. **Client Environment (.env file in `client` directory)**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-clerk-key
VITE_BACKEND_URL='http://localhost:3000'
```

2. **Server Environment (.env file in `server` directory)**
```
FRONTEND_URL=http://localhost:5173
DB_URL=your-mongodb-database-url
CLERK_SECRET_KEY=sk_test_your-secret-clerk-key
PORT=3000
```

## ▶️ Running the Application

### Start Frontend Server
```bash
cd client
npm run dev
```
Frontend will be available at: `http://localhost:5173`

### Start Backend Server
```bash
cd server
npm run dev
```
Backend API will be available at: `http://localhost:3000`

## 📁 Project Structure

```
eCom/
├── client/           # Frontend React application
│   ├── public/
│   ├── src/
│   ├── .env          # Frontend environment variables
│   └── package.json
│
└── server/           # Backend Express application 
    ├── controllers/
    ├── models/
    ├── routes/
    ├── .env          # Backend environment variables
    └── package.json
```

## ✨ Features

- User authentication and authorization with Clerk
- Product catalog browsing and searching
- Shopping cart functionality
- Order processing and management
- Persistent state with Redux-Persist
- Responsive design with Ant Design components
- RESTful API endpoints

## ⚙️ Configuration

### Clerk Authentication

1. Sign up for a Clerk account at [clerk.dev](https://clerk.dev)
2. Create a new application in your Clerk dashboard
3. Get your API keys from the Clerk dashboard
4. Add your publishable key to the client `.env` file
5. Add your secret key to the server `.env` file

### MongoDB

1. Create a MongoDB database (Atlas or local)
2. Get your connection string
3. Add the connection string to the `DB_URL` in your server `.env` file

---

Developed by [Jitesh Balani](https://github.com/JiteshBalani)
