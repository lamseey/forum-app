// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCxjPpaVcdBhJ0OABj_8MeAfHUc9eJ0uw4",
  authDomain: "forum-app-acc8c.firebaseapp.com",
  projectId: "forum-app-acc8c",
  storageBucket: "forum-app-acc8c.firebasestorage.app",
  messagingSenderId: "806103128816",
  appId: "1:806103128816:web:9fc6d89480f6fe74354035"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };