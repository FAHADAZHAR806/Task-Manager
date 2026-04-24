# 📝 TaskFlow - Professional Task Management System

**TaskFlow** is a full-stack, production-ready Task Management application. It enables users to organize their daily productivity through a secure, personalized dashboard. This project demonstrates advanced concepts in modern web development, including **Role-Based API Logic**, **State Management**, and **Secure Authentication Flows**.

---

## 🚀 Live Demo

[**View Live Project**](https://your-vercel-link.vercel.app)

---

## ✨ Key Features

- **User Authentication:** Complete Register/Login system with password encryption.
- **Secure Password Recovery:** Token-based "Forgot Password" flow with expiration logic.
- **Full CRUD Operations:** Users can Create, Read, Update, and Delete tasks.
- **Data Isolation:** Every user has a private database scope—users can only access their own tasks.
- **Responsive UI:** Clean, minimalist dashboard designed with Tailwind CSS for all device sizes.
- **API Security:** Protected backend routes that verify user identity before processing requests.

---

## 🛠️ Technical Stack

| Category          | Technology                                        |
| :---------------- | :------------------------------------------------ |
| **Frontend**      | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend**       | Next.js API Routes (Serverless)                   |
| **Database**      | MongoDB with Mongoose ODM                         |
| **Security**      | JSON Web Tokens (JWT) & Bcrypt.js                 |
| **Communication** | Axios for asynchronous API requests               |
| **Icons**         | Lucide React                                      |

---

## 🛡️ Security & Architecture

To ensure professional-grade security, this project implements:

1. **Password Hashing:** Utilizing `bcryptjs` to ensure no plain-text passwords reside in the database.
2. **JWT Authorization:** Secure session handling using JSON Web Tokens.
3. **Sensitive Data Protection:** Environment variables (`.env`) are used to protect DB credentials and Secret Keys.
4. **Input Sanitization:** Backend logic trims and validates user inputs (e.g., email formatting) to prevent injection.

---

## ⚙️ Local Development Setup

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone (https://github.com/yourusername/taskflow.git)
   cd taskflow
   ```
