# 🍗 Namma Canteen - Smart Campus Dining & Engagement Platform

![Hackathon Status](https://img.shields.io/badge/Hackathon-Hack--AI--thon_2025-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React_19_%7C_Firebase_%7C_Vite-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production_Ready-green?style=for-the-badge)

> **Submission for Hack-AI-thon | Open Innovation** > _Solving campus queues with AI-driven pre-ordering and gamified student rewards._

---

## 📖 Project Overview

**Namma Canteen** is a hyper-local web application designed to eliminate long waiting lines in college cafeterias. Unlike standard food delivery apps, we focus on **campus engagement** by linking academic performance (Attendance) to dining rewards.

The system features a **Real-Time Kitchen Display System (KDS)** for staff and an **AI-Powered Recommendation Engine** for students, creating a seamless "Click & Collect" experience.

---

## 🛠️ Tech Stack

| Category           | Technology                         |
| ------------------ | ---------------------------------- |
| **Frontend**       | React 19.2, React Router DOM 7.11  |
| **Build Tool**     | Vite 6.2                           |
| **Authentication** | Firebase Auth (Email + Phone OTP)  |
| **Database**       | Firebase Firestore                 |
| **AI Engine**      | Google Gemini AI (`@google/genai`) |
| **Styling**        | Tailwind CSS                       |

---

## 🚀 Key Features

### 🔐 Authentication System

- **Email + Password Signup** with automatic email verification
- **Phone OTP Verification** using Firebase Phone Auth with invisible reCAPTCHA
- **Forgot Password** flow with email reset link
- **Multi-Factor Authentication** — Email verified + Phone verified for full access
- **Protected Routes** — Auth pages auto-redirect based on verification status
- **Session Management** with secure logout and state persistence

### 🎓 For Students (The App)

- **Gamified Discounts (USP):** Students with **>75% Attendance** automatically receive a **10% Discount** (Green Banner).
- **Smart Menu:** Image-free, fast-loading menu focusing on traditional items (Morning/Afternoon categories).
- **AI Smart-Pairing:** Integrated **Google Gemini AI** analyzes the cart and suggests the perfect traditional drink (e.g., _Jigarthanda_ with _Spicy Chicken_).
- **Closed-Loop Feedback:** Students can rate meals (1-5 Stars) post-pickup, ensuring quality control.
- **Secure Pickup:** OTP verification prevents order theft.
- **Toast Notifications:** Color-coded real-time status updates for order progress.

### 👨‍🍳 For Admin (Kitchen Staff)

- **Live Kanban Board:** Drag-and-drop status tracking (`Placed` → `Cooking` → `Ready`).
- **Daily Prep List:** Automatically aggregates item counts (e.g., _"Total Vadas needed: 45"_).
- **Feedback Dashboard:** View student ratings and comments to improve food quality.

### 🎨 UI/UX Features

- **Animated Splash Screen** with branding
- **Responsive Navigation** with role-based menu items
- **Dark Theme** optimized design
- **Smooth Page Transitions** using React Router

---

## 📁 Project Structure

```
Namma-canteen-main/
├── components/
│   ├── auth/              # Phone verification components
│   ├── layout/            # Navbar, header components
│   ├── cart/              # Cart-related components
│   ├── menu/              # Menu item components
│   ├── modals/            # Modal dialogs
│   ├── orders/            # Order tracking components
│   ├── AdminView.jsx      # Admin dashboard view
│   ├── StudentView.jsx    # Student ordering view
│   └── SplashScreen.jsx   # App loading splash
├── pages/
│   ├── LoginScreen.jsx
│   ├── SignupScreen.jsx
│   ├── VerifyOTPScreen.jsx
│   ├── EmailVerificationScreen.jsx
│   ├── ForgotPasswordScreen.jsx
│   ├── HomePage.jsx
│   ├── MenuPage.jsx
│   ├── OrdersPage.jsx
│   ├── ProfilePage.jsx
│   └── KitchenPage.jsx
├── services/
│   ├── authService.js     # Complete Firebase auth wrapper
│   └── geminiService.js   # AI recommendation engine
├── context/
│   └── AppContext.jsx     # Global state management
├── firebase/
│   └── config.js          # Firebase initialization
├── App.jsx                # Main app with routing
├── index.html             # Entry point
├── vite.config.js         # Vite configuration
└── package.json
```

---

## ⚙️ How to Run Locally

### Prerequisites

- Node.js 18+ installed
- Firebase project configured (or use existing config)

### Installation Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/priyadharshan50/Namma-canteen-main.git
   cd Namma-canteen-main
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**

   - Update `firebase/config.js` with your Firebase credentials
   - Add your Google Gemini API key in `services/geminiService.js`

4. **Run Development Server:**

   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 Authentication Flow

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   /signup   │───▶│ Email Verification│───▶│     /login      │
└─────────────┘    └──────────────────┘    └────────┬────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │  /verify-phone  │
                                           └────────┬────────┘
                                                     │
                                                     ▼
                                           ┌─────────────────┐
                                           │   Dashboard /   │
                                           └─────────────────┘
```

---

## 📸 Screenshots

**Student Menu & AI**
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/eb501f76-1be0-4104-b46d-77fd958c0f26" />

**Discount Logic**
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/8ea1e6e7-51e5-46cb-8df9-dea426496c48" />

**Kitchen Dashboard**
<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/b5e86198-d676-486c-9df9-da34072ad817" />

---

## 🔮 Future Roadmap

- **Phase 2:** Integration with **Google Pay UPI API** for real payments.
- **Phase 3:** **Vertex AI** implementation to predict food demand based on exam schedules.
- **Phase 4:** Voice-assisted ordering using **Google Speech-to-Text** for accessibility.
- **Phase 5:** PWA support with offline menu browsing.

---

## 👥 Team

- **Track:** Open Innovation
- **Focus Area:** Campus Community Solutions

---

## 📄 License

This project is open source and available under the MIT License.

---

_Built with ❤️ for the Hack-AI-thon 2025_
