import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyCxMXCKoLOdLHlwIEfNO3RboWTq58B9Bdg",
  authDomain:        "academekey-e4dac.firebaseapp.com",
  projectId:         "academekey-e4dac",
  storageBucket:     "academekey-e4dac.firebasestorage.app",
  messagingSenderId: "243228126556",
  appId:             "1:243228126556:web:ba22fec81b1aa7617ea599",
  measurementId:     "G-PWDWB4DPT6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
