// src/firebase-config.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRcKaxMEoruMK-y4MSAX2bcJfFssOLWUA",
    authDomain: "hackathon-2-b34f0.firebaseapp.com",
    projectId: "hackathon-2-b34f0",
    storageBucket: "hackathon-2-b34f0.appspot.com",
    messagingSenderId: "311176165731",
    appId: "1:311176165731:web:f9ab810fb144b9609cbb56"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut };
