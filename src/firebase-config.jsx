// src/firebase-config.jsx
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRcKaxMEoruMK-y4MSAX2bcJfFssOLWUA",
  authDomain: "hackathon-2-b34f0.firebaseapp.com",
  projectId: "hackathon-2-b34f0",
  storageBucket: "hackathon-2-b34f0.firebasestorage.app",
  messagingSenderId: "311176165731",
  appId: "1:311176165731:web:f9ab810fb144b9609cbb56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the necessary Firebase functions and objects
export { auth, db, doc, getDoc, setDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, storage };
