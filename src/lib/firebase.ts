
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtzcyxfbxAoH4UMuk1Acnk_R33aGp8-fk",
  authDomain: "ai-health-assistant-c1d40.firebaseapp.com",
  projectId: "ai-health-assistant-c1d40",
  storageBucket: "ai-health-assistant-c1d40.appspot.com",
  messagingSenderId: "109162562142",
  appId: "1:109162562142:web:dd50f9df213185350c6acf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
