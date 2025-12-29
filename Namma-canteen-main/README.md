# 🍗 Namma Canteen - Smart Campus Dining & Engagement Platform

![Hackathon Status](https://img.shields.io/badge/Hackathon-Hack--AI--thon_2025-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-Google_Gemini_%7C_HTML5_%7C_Tailwind-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-MVP_Ready-green?style=for-the-badge)

> **Submission for Hack-AI-thon | Open Innovation**
> *Solving campus queues with AI-driven pre-ordering and gamified student rewards.*

---

## 📖 Project Overview
**Namma Canteen** is a hyper-local web application designed to eliminate long waiting lines in college cafeterias. Unlike standard food delivery apps, we focus on **campus engagement** by linking academic performance (Attendance) to dining rewards.

The system features a **Real-Time Kitchen Display System (KDS)** for staff and an **AI-Powered Recommendation Engine** for students, creating a seamless "Click & Collect" experience.

---

## 🚀 Key Features

### 🎓 For Students (The App)
* **Gamified Discounts (USP):** Students with **>75% Attendance** automatically receive a **10% Discount** (Green Banner).
* **Smart Menu:** Image-free, fast-loading menu focusing on traditional items (Morning/Afternoon categories).
* **AI Smart-Pairing:** Integrated **Google Gemini AI** analyzes the cart and suggests the perfect traditional drink (e.g., *Jigarthanda* with *Spicy Chicken*).
* **Closed-Loop Feedback:** Students can rate meals (1-5 Stars) post-pickup, ensuring quality control.
* **Secure Pickup:** Simulated OTP verification prevents order theft.

### 👨‍🍳 For Admin (Kitchen Staff)
* **Live Kanban Board:** Drag-and-drop status tracking (`Placed` → `Cooking` → `Ready`).
* **Daily Prep List:** Automatically aggregates item counts (e.g., *"Total Vadas needed: 45"*).
* **Feedback Dashboard:** View student ratings and comments to improve food quality.

---

## 🛠️ Google Technologies Used
1.  **Google Gemini API (via Google AI Studio):**
    * **Role:** Acts as the recommendation engine.
    * **Function:** Context-aware analysis of cart items to suggest complementary sides/drinks.
2.  **Google Fonts:**
    * **Role:** UI Typography.
    * **Font:** *Poppins* for modern readability.
3.  **HTML5 & JavaScript (Web Standards):**
    * **Role:** Core application logic and Progressive Web App (PWA) structure.

---

## 📸 Screenshots
| Student Menu & AI | Discount Logic | Kitchen Dashboard |
|:---:|:---:|:---:|
| *[Insert Screenshot of Menu]* | *[Insert Screenshot of Green Banner]* | *[Insert Screenshot of Admin View]* |

---

## ⚙️ How to Run Locally

Since this is a client-side web application, no complex server installation is required.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/namma-canteen.git
    ```
2.  **Open the Project:**
    * Navigate to the folder.
    * Open `index.html` in any modern web browser (Chrome/Edge).
3.  **Test the Roles:**
    * The app simulates both Student and Admin views in the same window for the Hackathon Demo.
    * **Note:** You must insert your own Google Gemini API Key in the code (Line 118) if cloning freshly.

---

## 🔮 Future Roadmap
* **Phase 2:** Integration with **Google Pay UPI API** for real payments.
* **Phase 3:** **Vertex AI** implementation to predict food demand based on exam schedules.
* **Phase 4:** Voice-assisted ordering using **Google Speech-to-Text** for accessibility.

---

## 👥 Team
* **Track:** Open Innovation
* **Focus Area:** Campus Community Solutions

---
*Built with ❤️ for the Hack-AI-thon 2025*
