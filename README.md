# Sasurie iTrans 🚌✨

**Sasurie iTrans** is an Intelligent Transport Management System designed for **Sasurie Institutions**. It is a mobile-first Progressive Web Application (PWA) prototype that bridges the gap between students and transport administrators through real-time tracking, AI-powered assistance, and digital attendance.

---

## 🚀 Features

### 🎓 For Students
*   **Live Bus Tracking:** Real-time location updates of college buses via Google Maps integration.
*   **QR Attendance:** Contactless attendance system using camera scanning.
*   **AI Assistant:** Integrated **Google Gemini AI** chatbot to answer queries about bus timings, routes, and delays.
*   **Digital Profile:** View route details, stopping points, and attendance history.
*   **Notifications:** Receive instant alerts regarding delays or route changes.

### 🛡️ For Admins
*   **Fleet Dashboard:** Bird's-eye view of all bus statuses (On Time, Delayed, Breakdown).
*   **QR Generator:** Generate dynamic daily QR codes for specific bus routes.
*   **Broadcast System:** Send push notifications to specific routes or the entire campus.
*   **Feedback Management:** Review and resolve student complaints regarding transport.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI Integration:** [Google GenAI SDK](https://ai.google.dev/) (Gemini Models)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **QR Technology:** `jsQR` (Scanning) & `qrcode.react` (Generation)
*   **Build/Runtime:** ES Modules via CDN (No-build prototype) / Vite compatible.

---

## 📸 Screenshots

| Welcome Screen | Student Dashboard | Live Tracking |
|:---:|:---:|:---:|
| *(Add Screenshot)* | *(Add Screenshot)* | *(Add Screenshot)* |

---

## ⚡ Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/sasurie-itrans.git
    cd sasurie-itrans
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Application**
    ```bash
    npm start
    # or
    npm run dev
    ```

> **Note:** This project currently uses a CDN-based import structure (`esm.sh`) for rapid prototyping. If moving to production, it is recommended to migrate to a standard Vite build process.

---

## 🔐 Demo Credentials

To explore the application, use the following default credentials included in the prototype:

### 👨‍🎓 Student Login
*   **Register Number:** `732423243010`
*   **DOB:** (Any value)

### 👮 Admin Login
*   **Admin ID:** `ADMIN_01`
*   **Password:** `password`

---

## 🤖 AI Configuration

The project uses the **Google Gemini API** for the chat interface.
To enable the AI features:
1.  Get an API key from [Google AI Studio](https://aistudio.google.com/).
2.  Ensure your environment variables are set up to inject the key into `StudentFlow.tsx`.

---

## 📱 Mobile Optimization

This app is designed with a **mobile-first** approach. For the best experience during development:
*   Open Developer Tools (F12).
*   Toggle Device Toolbar (Ctrl+Shift+M).
*   Select a mobile device (e.g., iPhone 12/14 Pro).

---

## 📄 License

This project is created for educational purposes as a prototype for Sasurie Institutions.

---

Made with ❤️ using React & Flutter logic.
