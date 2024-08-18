// // firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAm384U39xs9UiQrEsy9koC0DNt09KMkOU",
  authDomain: "comment-system-f6b0e.firebaseapp.com",
  projectId: "comment-system-f6b0e",
  storageBucket: "comment-system-f6b0e.appspot.com",
  messagingSenderId: "1086098494869",
  appId: "1:1086098494869:web:1aa3db4e8d7d8878eb129c",
  measurementId: "G-NZMCDZYQVP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
