import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX1IBMI4S_r722wEiEBjej9KojIKd5ukk",
  authDomain: "iartist-4c3a5.firebaseapp.com",
  projectId: "iartist-4c3a5",
  storageBucket: "iartist-4c3a5.appspot.com",
  messagingSenderId: "880787231069",
  appId: "1:880787231069:web:2c1bde24fa2af16c2858b4",
  measurementId: "G-CN6F9Y1SE8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
