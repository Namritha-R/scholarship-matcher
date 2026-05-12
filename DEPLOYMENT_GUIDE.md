# 🚀 Beginner's Guide: GitHub & Vercel Deployment

This guide will walk you through uploading your project to GitHub and deploying it to Vercel for free, step-by-step.

---

## 📁 Step 1: Upload Your Project to GitHub

This is the easiest way to manage your code and connect it to Vercel.

1. **Create a GitHub Account:** If you don't have one, go to [GitHub.com](https://github.com) and sign up.
2. **Create a New Repository:**
   * Click the **"+"** icon in the top right and select **New repository**.
   * Name it `scholarship-matcher`.
   * Keep it **Public** (or Private if you prefer).
   * **Do NOT** check "Add a README file" (we already have documentation).
   * Click **Create repository**.
3. **Upload your code (Run these in your VS Code terminal):**
   * Run these commands one by one to push your code to GitHub:
     ```bash
     git init
     git add .
     git commit -m "Initial commit with Firebase"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/scholarship-matcher.git
     git push -u origin main
     ```
     *(Replace `YOUR_USERNAME` with your actual GitHub username).*

---

## 🌐 Step 2: Deploy to Vercel using GitHub

Vercel will connect to your GitHub and automatically publish your site every time you update your code!

1. **Create a Vercel Account:** Go to [Vercel.com](https://vercel.com) and click **Sign Up**. Choose **Continue with GitHub**.
2. **Import Project:**
   * Click **Add New** -> **Project**.
   * You will see a list of your GitHub repositories. Click **Import** next to `scholarship-matcher`.
3. **Configure and Deploy:**
   * Vercel will automatically detect that you are using **Vite**.
   * You don't need to change any settings!
   * Click **Deploy**.
   * Wait 1-2 minutes, and your site will be live on a public URL!

---

## 🔥 Step 3: Check if Scholarships are Updated in Firebase

To see if your database is receiving the updated scholarships:

1. Go to the **[Firebase Console](https://console.firebase.google.com/)**.
2. Click on your project: `scholarship-matcher-c767f`.
3. In the left sidebar, click on **Build** and then **Firestore Database**.
4. You will see a tab called **Data**.
5. Look for the `scholarships` collection in the first column.
6. Click on it to see the list of scholarship documents.
7. **How to know it updated:** If you see documents with IDs like `fresh-1` or `fresh-2` (or whatever the scraper finds), it means the update worked! If the list is empty, you need to run the update function first.

---

## 🧹 Reminder: Firebase Deploy
Before the database can work, make sure you have run this in your terminal to upload the rules:
```bash
firebase deploy
```
