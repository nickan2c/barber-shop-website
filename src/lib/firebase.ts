import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  enableIndexedDbPersistence,
  connectFirestoreEmulator
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-RqG9plvHyMNpZz6XPD4maqI7LAd8GLs",
  authDomain: "barber-shop-website-2a8dd.firebaseapp.com",
  projectId: "barber-shop-website-2a8dd",
  storageBucket: "barber-shop-website-2a8dd.firebasestorage.app",
  messagingSenderId: "370607901933",
  appId: "1:370607901933:web:5561bf090203df1cb490e4",
  measurementId: "G-F7ZMFT0F07"
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  if (typeof window !== 'undefined') {
    // Initialize Firebase if it hasn't been initialized yet
    if (!getApps().length) {
      console.log('Initializing Firebase app...');
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      console.log('Firebase app already initialized');
      firebaseApp = getApps()[0];
    }

    if (firebaseApp) {
      // Initialize Authentication
      console.log('Initializing Firebase Auth...');
      auth = getAuth(firebaseApp);

      // Initialize Firestore
      console.log('Initializing Firestore...');
      db = getFirestore(firebaseApp);

      // Only connect to emulator if explicitly enabled
      if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        console.log('Connecting to Firestore emulator...');
        connectFirestoreEmulator(db, 'localhost', 8080);
      } else {
        console.log('Using production Firestore');
      }

      // Enable offline persistence if supported
      if (process.env.NEXT_PUBLIC_ENABLE_FIRESTORE_PERSISTENCE === 'true') {
        enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support persistence.');
          }
        });
      }

      console.log('Firebase initialization complete');
    }
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Helper function to check if Firebase is initialized
export const isFirebaseInitialized = () => {
  if (!firebaseApp || !auth || !db) {
    console.error('Firebase not fully initialized:', {
      app: !!firebaseApp,
      auth: !!auth,
      db: !!db
    });
    return false;
  }
  return true;
};

// Export the instances with proper typing
export const clientAuth = auth as Auth;
export const clientDb = db as Firestore;
export { firebaseApp }; 