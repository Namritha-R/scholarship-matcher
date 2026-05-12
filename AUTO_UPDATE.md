# 🔄 Auto-Update Scholarship System

This project now supports a true auto-update system using **Firebase Firestore** and **Cloud Functions**. 

Because the application must remain serverless and lightweight, we use a hybrid approach:
1. **Firestore Database:** Stores the scholarship documents.
2. **Cloud Functions:** Runs background logic to "search the internet" and update the database.
3. **Frontend Fallback:** If the database is not reached, the app falls back to the local `scholarships.js` file.

---

## 🛠 What Has Been Set Up

1. **Firebase Configuration:** Created `.firebaserc` (linked to `scholarship-matcher-c767f`) and `firebase.json`.
2. **Firestore Rules:** Set up `firestore.rules` to allow public reads but restricted writes (only the backend can write).
3. **Cloud Functions Directory:** Created a `functions` folder with a template for the auto-update logic.
4. **Frontend Integration:** Updated `results.js` to fetch from Firestore first, with a loading state and a fallback to the static file if the database is empty or unreachable.

---

## 🚀 How to Make It Live (Your Next Steps)

Since I cannot log into your Google account to deploy these resources on your machine, you need to run the following commands in your terminal:

### 1. Login and Select Project
```bash
firebase login
firebase use scholarship-matcher-c767f
```

### 2. Fill in the Frontend Config
Go to your Firebase Console, find your Web App settings, and copy the full config object. Then paste it into `js/utils/firebase.js`:
```javascript
const firebaseConfig = {
  projectId: "scholarship-matcher-c767f",
  apiKey: "YOUR_API_KEY",
  authDomain: "scholarship-matcher-c767f.firebaseapp.com",
  // ... fill the rest
};
```

### 3. Deploy to Firebase
```bash
firebase deploy
```

---

## 🔍 The "Search the Internet" Logic

In `functions/index.js`, I created a function called `updateScholarships`. 

Currently, this function is a **simulation** that adds 2 new scholarships to the database to prove the system works. To make it a "true" internet searcher, you have two options depending on your budget:

### Option A: Use a Search API + LLM (Recommended)
Raw web scraping breaks easily. The most robust way to auto-update is:
1. Use an API like **SerpAPI** or **Google Custom Search** to search for "Scholarships for [Level] 2026".
2. Send the resulting text to an LLM (like **Gemini API** or **OpenAI**) with a prompt: *"Extract scholarship details from this text and return it in this exact JSON format: {name, org, level...}"*.
3. Save that JSON to Firestore.

### Option B: Web Scraping
You can use libraries like `axios` and `cheerio` inside the function to scrape specific, trusted scholarship portals (like DAAD or Fulbright) directly.

To trigger the update, you can hit the generated URL of the function, or set it as a **Scheduled Function** (Cron Job) in Firebase.
