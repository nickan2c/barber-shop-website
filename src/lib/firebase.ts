import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-RqG9plvHyMNpZz6XPD4maqI7LAd8GLs",
  authDomain: "barber-shop-website-2a8dd.firebaseapp.com",
  projectId: "barber-shop-website-2a8dd",
  storageBucket: "barber-shop-website-2a8dd.firebasestorage.app",
  messagingSenderId: "370607901933",
  appId: "1:370607901933:web:5561bf090203df1cb490e4",
  measurementId: "G-F7ZMFT0F07"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 