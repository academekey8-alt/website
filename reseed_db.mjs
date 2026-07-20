import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxMXCKoLOdLHlwIEfNO3RboWTq58B9Bdg",
  authDomain: "academekey-e4dac.firebaseapp.com",
  projectId: "academekey-e4dac",
  storageBucket: "academekey-e4dac.firebasestorage.app",
  messagingSenderId: "243228126556",
  appId: "1:243228126556:web:ba22fec81b1aa7617ea599",
  measurementId: "G-PWDWB4DPT6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

import fs from 'fs';
const courses = JSON.parse(fs.readFileSync('extracted_courses.json', 'utf8'));

async function seed() {
  console.log("Authenticating...");
  await signInWithEmailAndPassword(auth, "flyggoagency@gmail.com", "Flyggo@8");
  
  console.log("Clearing existing courses...");
  const snapshot = await getDocs(collection(db, "courses"));
  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, "courses", d.id));
  }

  console.log("Adding original courses...");
  for (const c of courses) {
    await addDoc(collection(db, "courses"), c);
    console.log("Added:", c.title);
  }
  
  console.log("Database seeded successfully!");
  process.exit(0);
}

seed();
