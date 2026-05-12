
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQbWEjsS-MXlwJK07gx01248Qnz2dcL7s",
  authDomain: "scholarship-matcher-c767f.firebaseapp.com",
  projectId: "scholarship-matcher-c767f",
  storageBucket: "scholarship-matcher-c767f.firebasestorage.app",
  messagingSenderId: "602957197917",
  appId: "1:602957197917:web:6a0f51d832544698c0d3b4",
  measurementId: "G-TGQVLLLS1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export db for use in other files
export { db };