import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBE4ghpSuL1hRKpbFv0QYIxIe-_3Koy9Nk",
  authDomain: "miurac-midl.firebaseapp.com",
  projectId: "miurac-midl",
  storageBucket: "miurac-midl.appspot.com",
  messagingSenderId: "746589407161",
  appId: "1:746589407161:web:43b67c5533c9ef2b369868",
  measurementId: "G-Y8HNDQ29E1",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth, app };
