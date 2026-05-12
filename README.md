# 🎓 ScholarPath — Global Scholarship Matcher

ScholarPath is a high-performance, client-side platform designed to match users to scholarships worldwide based on their unique academic and personal profile.

It features a country-aware form wizard that adapts to different grading systems (like GPA in the USA, Percentages in India, or Abitur in Germany) and computes a match score for each scholarship.

## 🚀 Key Features

- **Smart Matching Engine**: Calculates a 0-100% compatibility score based on education level, field, region, and GPA.
- **Country-Aware Form**: Dynamically changes input fields based on your nationality to match your local education system.
- **Auto-Update System**: Integrated with Firebase Firestore and Cloud Functions to fetch and store fresh data.
- **Hybrid Discovery**: Combines scored results from a database with targeted live web search shortcuts.

## 🛠 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), CSS Custom Properties
- **Build Tool**: Vite
- **Backend/Database**: Firebase Firestore & Cloud Functions

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/scholarship-matcher.git
   cd scholarship-matcher
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## 📖 Project Documentation

Detailed guides are available in the project files:
*   [How It Works](HOW_IT_WORKS.md) — Detailed breakdown of the matching algorithm and form logic.
*   [Auto-Update Setup](AUTO_UPDATE.md) — How the backend functions update the database.
*   [Deployment Guide](DEPLOYMENT_GUIDE.md) — Step-by-step guide to deploy on GitHub and Vercel for free.

---
*Created with ❤️ for students worldwide.*
