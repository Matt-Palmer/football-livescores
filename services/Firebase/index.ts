// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATDHuwlIRxppCp7fs32uR_MLoVlsqycSw",
  authDomain: "livescores-6735c.firebaseapp.com",
  projectId: "livescores-6735c",
  storageBucket: "livescores-6735c.appspot.com",
  messagingSenderId: "407154020438",
  appId: "1:407154020438:web:9a9895f13e59ed6542ebf7",
  measurementId: "G-7BEVZX5978",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
