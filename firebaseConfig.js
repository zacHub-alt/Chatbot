// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIkQ2ll7--_6ZTyycyGpW-yApSFHWPAB8",
  authDomain: "chatbot-1311e.firebaseapp.com",
  projectId: "chatbot-1311e",
  storageBucket: "chatbot-1311e.appspot.com",
  messagingSenderId: "725798771564",
  appId: "1:725798771564:web:d53ac25e9f0b8fecfe7149",
  measurementId: "G-YQY8R6CRX9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Conditionally initialize analytics only on the client side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, auth, analytics };