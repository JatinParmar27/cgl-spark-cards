// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdXeUaM1uWzSvzwezc5qGAyR_84F8C4lc",
  authDomain: "cgl-sprak-card.firebaseapp.com",
  projectId: "cgl-sprak-card",
  storageBucket: "cgl-sprak-card.firebasestorage.app",
  messagingSenderId: "307806585604",
  appId: "1:307806585604:web:07067da4abca5f4fc08651",
  measurementId: "G-ZPKCRPNMKF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
