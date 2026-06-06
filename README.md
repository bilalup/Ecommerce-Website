# 🛍️ Ecommerce Website

[![Live Demo](https://img.shields.io/badge/Live-Website-blue)](https://ecommerce-website.bilalsi.com/)
[![GitHub stars](https://img.shields.io/github/stars/bilalup/Ecommerce-Website?style=social)](https://github.com/bilalup/Ecommerce-Website/stargazers)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

A modern, full-stack eCommerce platform featuring a sleek user interface, secure authentication, and seamless shopping experience.

---

## 🚀 Live Demo

Check out the live app 👉  
**https://ecommerce-website.bilalsi.com/**

---

## ✨ Features

- 🔐 **User Authentication** – Secure signup and login with JWT.
- 🛒 **Product Catalog** – Browse, search, and filter products.
- 🛍️ **Shopping Cart** – Add, view, update, and remove items.
- 📦 **Order Checkout** – Place orders with automatic total calculation.
- 🖥️ **Admin Dashboard** _(if implemented)_ – Manage products, orders, and users.
- 📱 **Responsive Design** – Optimized for mobile, tablet, and desktop.
- 🛡️ **Secure Cookie Handling** – HttpOnly & SameSite cookies for token storage.

---

## 🛠️ Tech Stack

| Layer        | Technologies Used                                                       |
| ------------ | ----------------------------------------------------------------------- |
| **Frontend** | React, Axios, Zustand (or Redux), Tailwind CSS (or Bootstrap)           |
| **Backend**  | Node.js, Express, MongoDB (Mongoose ORM)                                |
| **Auth**     | JSON Web Tokens (JWT) via HttpOnly cookies                              |
| **Hosting**  | Frontend: Vercel / Netlify <br> Backend: DigitalOcean / Render / Heroku |
| **Other**    | CORS, dotenv for env config, GitHub for version control                 |

---

## 📂 Project Structure

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/bilalup/Ecommerce-Website.git
cd Ecommerce-Website
```
2. Setup Environment Variables

Create .env files in server and client.
```bash
server/.env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
JWT_SECRET=my_secret
CLOUDINARY_NAME=dbtmd2fzn
CLOUDINARY_API_KEY=your_cloudonary_api_key
CLOUDINARY_API_SECRET=your_cloudonary_api_secret
```
3. Install dependencies

Backend
```bash
cd server
npm install
npm run dev
```
Frontend
```bash
cd client
npm install
npm start
```
🎯 Usage

1. Open http://localhost:5173 in your browser.
2. Sign up or log in.
3. Browse products and add to cart.
4. Checkout to place an order.

📡 API Endpoints (Examples)

POST /auth/register → Create user

POST /auth/login → Login and set JWT cookie

POST /auth/logout → Logout (clear cookie)

GET /products → Fetch all products

GET /products/:id → Fetch single product

👤 Author

Built and maintained by Bilal

🌐 Website: ecommerce-website.bilalsi.com

💻 GitHub: @bilalup

⭐ If you like this project, don’t forget to star the repo on GitHub!

