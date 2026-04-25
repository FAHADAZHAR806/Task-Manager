# 📝 FocusFlow - Professional Task Management System

**FocusFlow** is a modern, full-stack Task Management application designed for peak productivity. Featuring a drag-and-drop interface and secure data isolation, it allows users to manage their workflow with a professional-grade dashboard.

---

## 🚀 Live Demo

[**View Live Project**](https://task-manager-eta-five-23.vercel.app/login)

---

## ✨ Key Features

- **Interactive Kanban Board:** Smooth **Drag-and-Drop** functionality powered by `@hello-pangea/dnd` to manage task statuses (Pending, In Progress, Completed).
- **User Authentication:** Secure Login/Register system using **JSON Web Tokens (JWT)** and **Bcrypt.js** for password encryption.
- **Dynamic Profile System:** Smart profile detection using **Cookies** and `jwt-decode` to fetch user data without local storage dependency.
- **Productivity Analytics:** Real-time stats dashboard showing total tasks, completion rates, and progress tracking.
- **Full CRUD Operations:** Create, Edit, and Delete tasks with a sleek, user-friendly modal interface.
- **Smart Filtering:** Instant search and priority-based filtering (High, Medium, Low) to stay focused on what matters.
- **Data Isolation:** Enterprise-level security where every user has a private database scope.
- **Mobile First Design:** Fully responsive UI built with **Tailwind CSS** and **Lucide React** icons.

---

## 🛠️ Technical Stack

| Category         | Technology                                        |
| :--------------- | :------------------------------------------------ |
| **Frontend**     | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Interactions** | @hello-pangea/dnd (Drag & Drop)                   |
| **Backend**      | Next.js API Routes (Serverless)                   |
| **Database**     | MongoDB with Mongoose ODM                         |
| **Security**     | JWT (Cookies/Headers), Bcrypt.js                  |
| **API Client**   | Axios for asynchronous requests                   |
| **Icons**        | Lucide React                                      |

---

## 🛡️ Security & Architecture

This project implements professional-grade security protocols:

1. **Hybrid Auth Verification:** Backend logic verifies tokens from both **HTTP Headers** and **Cookies** for maximum compatibility.
2. **Password Hashing:** Utilizing `bcryptjs` to ensure zero plain-text passwords in the database.
3. **Sensitive Data Protection:** Strict use of Environment Variables (`.env`) for DB URI and JWT Secret Keys.
4. **Data Integrity:** Used `.select("-password")` on API routes to ensure sensitive user data never reaches the client-side.

---

## ⚙️ Local Development Setup

To run FocusFlow locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/focusflow.git](https://github.com/yourusername/focusflow.git)
   cd focusflow
   ```
