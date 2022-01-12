// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVvT190YHjnYh5LRobXI4cQf8F3_vuGOc",
  authDomain: "dropoutstore-8979d.firebaseapp.com",
  projectId: "dropoutstore-8979d",
  storageBucket: "dropoutstore-8979d.appspot.com",
  messagingSenderId: "300563119027",
  appId: "1:300563119027:web:fefd76170953e8b14669c6",
  measurementId: "G-RXD44LFG2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);