// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-28b2b.firebaseapp.com",
  projectId: "realestate-28b2b",
  storageBucket: "realestate-28b2b.firebasestorage.app",
  messagingSenderId: "172358843732",
  appId: "1:172358843732:web:1ba8e0093eeb2c5f4c9cc1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);