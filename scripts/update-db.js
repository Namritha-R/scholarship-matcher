import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Support both local .env file and GitHub Actions environment variables
let env = process.env;

if (!env.VITE_FIREBASE_API_KEY) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      env = {};
      envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) env[key.trim()] = val.trim();
      });
    }
  } catch (e) {
    console.log("No .env file found, using system environment variables.");
  }
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("🚀 Starting database update...");
  
  const scholarships = [
    {
      id: "fresh-1",
      name: "Gates Millennium Scholarship 2026",
      org: "Bill & Melinda Gates Foundation",
      level: ["Undergraduate"],
      field: ["Any"],
      country: "USA",
      region: "USA",
      amount: "Full Funding",
      amountNum: 80000,
      deadline: "Sep",
      description: "For outstanding minority students to pursue undergraduate education.",
      eligibility: { nationality: "US Citizen/Resident", gpa: 3.3, financialNeed: true, merit: true, gender: "Any", minority: true },
      link: "https://www.gmsp.org/",
      tags: ["Minority", "Full Funding"]
    },
    {
      id: "fresh-2",
      name: "Rotary Peace Fellowships 2026",
      org: "Rotary Foundation",
      level: ["Masters"],
      field: ["Social Sciences", "Humanities"],
      country: "Global",
      region: "Global",
      amount: "Full Funding",
      amountNum: 60000,
      deadline: "May",
      description: "For professionals dedicated to peace and conflict resolution.",
      eligibility: { nationality: "Any", gpa: 3.0, financialNeed: false, merit: true, gender: "Any", minority: false },
      link: "https://www.rotary.org/",
      tags: ["Peace", "Leadership"]
    },
    {
      id: "fresh-3",
      name: "MEXT Scholarship 2026",
      org: "Government of Japan",
      level: ["Undergraduate", "Masters"],
      field: ["Any"],
      country: "Japan",
      region: "Asia",
      amount: "Full Funding + Stipend",
      amountNum: 50000,
      deadline: "May",
      description: "Full scholarship for international students to study in Japan.",
      eligibility: { nationality: "Non-Japanese", gpa: 3.2, financialNeed: false, merit: true, gender: "Any", minority: false },
      link: "https://www.mext.go.jp/",
      tags: ["Full Funding", "Government"]
    }
  ];

  for (const s of scholarships) {
    await setDoc(doc(db, 'scholarships', s.id), s);
    console.log(`✅ Added: ${s.name}`);
  }
  
  console.log("🎉 Database update complete!");
}

run().catch(error => {
  console.error("❌ Error updating database:", error);
});
