// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE4ghpSuL1hRKpbFv0QYIxIe-_3Koy9Nk",
  authDomain: "miurac-midl.firebaseapp.com",
  projectId: "miurac-midl",
  storageBucket: "miurac-midl.appspot.com",
  messagingSenderId: "746589407161",
  appId: "1:746589407161:web:43b67c5533c9ef2b369868",
  measurementId: "G-Y8HNDQ29E1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);