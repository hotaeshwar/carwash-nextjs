import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyDsjriMqrVoS6YPi7Aofzr_M_y2mbZdBM0",
  authDomain: "actioncardetailing-329c5.firebaseapp.com",
  projectId: "actioncardetailing-329c5",
  storageBucket: "actioncardetailing-329c5.firebasestorage.app",
  messagingSenderId: "201209715585",
  appId: "1:201209715585:web:9922505be85e5eec58e680",
  measurementId: "G-0M8RX01ZR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication - ADD THIS LINE
export const auth = getAuth(app);