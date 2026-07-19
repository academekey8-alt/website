import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxMXCKoLOdLHlwIEfNO3RboWTq58B9Bdg",
  authDomain: "academekey-e4dac.firebaseapp.com",
  projectId: "academekey-e4dac",
  storageBucket: "academekey-e4dac.firebasestorage.app",
  messagingSenderId: "243228126556",
  appId: "1:243228126556:web:ba22fec81b1aa7617ea599"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clean() {
  const snapshot = await getDocs(collection(db, "courses"));
  let deleted = 0;
  snapshot.forEach(async (d) => {
    if (!d.data().title || d.data().title.trim() === "") {
      await deleteDoc(doc(db, "courses", d.id));
      deleted++;
    }
  });
  console.log("Deleted empty courses:", deleted);
}

clean();
