import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const firebaseConfig = {
  // Config your firebase here
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "busybuy-45dda.firebaseapp.com",
  projectId: "busybuy-45dda",
  storageBucket: "busybuy-45dda.firebasestorage.app",
  messagingSenderId: "512585049947",
  appId: "1:512585049947:web:cbf69b4d738cb0a628dc7e",
};

console.log(process.env);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
export { db };
