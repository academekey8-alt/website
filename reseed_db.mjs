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

const courses = [
  { title: 'Foundations of Leadership', category: 'Leadership & Management', image: 'assets/img/03_Leadership_Training.png.png', description: 'Build the core mindset and practical skills that distinguish effective leaders.', duration: '8-hour session', format: 'In-Person' },
  { title: 'Managing High-Performance Teams', category: 'Leadership & Management', image: 'assets/img/07_About_Team_Meeting.png', description: 'Develop the tools to build, lead, and sustain high-performing teams.', duration: '5-hour session', format: 'Virtual Live' },
  { title: 'Strategic Thinking for Leaders', category: 'Leadership & Management', image: 'assets/img/06_Onsite_Workshop.png', description: 'Equip leaders with frameworks for long-term thinking and decision-making.', duration: '8-hour session', format: 'On-Site' },
  { title: 'Customer Experience Excellence', category: 'Customer Service', image: 'assets/img/02_Programs_Desk.png', description: 'Transform every customer touchpoint and build lasting customer relationships.', duration: '4-hour session', format: 'In-Person' },
  { title: 'Handling Difficult Customers', category: 'Customer Service', image: 'assets/img/01_Home_Hero_Speaker.png', description: 'Master de-escalation, active listening, and resolution skills.', duration: '3.5-hour session', format: 'Virtual Live' },
  { title: 'Business Communication Essentials', category: 'Communication Skills', image: 'assets/img/04_Classroom_Training.png', description: 'Sharpen written, verbal, and non-verbal communication across professional contexts.', duration: '6-hour session', format: 'In-Person' },
  { title: 'Presentation Skills Masterclass', category: 'Communication Skills', image: 'assets/img/03_Leadership_Training.png.png', description: 'Develop confidence and clarity when presenting to any audience.', duration: '2-day intensive', format: 'On-Site' },
  { title: 'Consultative Selling', category: 'Sales Training', image: 'assets/img/05_Virtual_Sessions.png.png', description: 'Build a sales approach that earns trust and uncovers real needs.', duration: '8-hour session', format: 'In-Person' },
  { title: 'Negotiation Skills for Sales Professionals', category: 'Sales Training', image: 'assets/img/06_Onsite_Workshop.png', description: 'Master principled negotiation, managing objections, and closing deals.', duration: '5-hour session', format: 'Virtual Live' },
  { title: 'Project Management Fundamentals', category: 'Project Management', image: 'assets/img/06_Onsite_Workshop.png', description: 'Practical frameworks for planning, executing, and closing projects.', duration: '8-hour session', format: 'In-Person' },
  { title: 'Effective Recruitment & Interviewing', category: 'Human Resources', image: 'assets/img/07_About_Team_Meeting.png', description: 'Design structured hiring processes and conduct bias-aware interviews.', duration: '6-hour session', format: 'In-Person' },
  { title: 'Workplace Health & Safety Essentials', category: 'Workplace Compliance', image: 'assets/img/03_Leadership_Training.png.png', description: 'Build a compliance-aware workplace culture covering legislative obligations.', duration: '4-hour session', format: 'On-Site' },
  { title: 'Emotional Intelligence at Work', category: 'Other Professional Development', image: 'assets/img/02_Programs_Desk.png', description: 'Develop the self-awareness and empathy that underpin every high-performing relationship.', duration: '4-hour session', format: 'Virtual Live' }
];

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
