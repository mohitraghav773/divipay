// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// Your Firebase config (from Firebase Console → Project Settings)
const firebaseConfig = {
  apiKey: "AIzaSyCPVPo-jHHGuYY0e4U4lQ-VFvySuMeC2sE",
  authDomain: "divipay-5b1de.firebaseapp.com",
  projectId: "divipay-5b1de",
  storageBucket: "divipay-5b1de.appspot.com", // ✅ FIXED storageBucket URL
  messagingSenderId: "323161333268",
  appId: "1:323161333268:android:78c52d5cd8a005ce311101",
  measurementId: "G-PJYGWVZGFX",
  databaseURL: "https://divipay-5b1de-default-rtdb.firebaseio.com/", // ✅ ADD THIS LINE
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };  // ✅ Named export to prevent re-initialization
export default app;