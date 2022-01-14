import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  Query,
  query,
  Timestamp,
} from "firebase/firestore";
import { auth, firestore } from "../../config/firebase.config";
import { IRolesDoc } from "./types";

export async function firebaseGoogleSignin() {
  const provider = new GoogleAuthProvider();

  try {
    const res = await signInWithPopup(auth, provider);
    console.log(res);
  } catch (error) {
    throw new Error("Something went wrong!");
  }
}

export async function firebaseGoogleSignOut() {
  await signOut(auth);
}

export async function getRolesDocs(path: string) {
  try {
    const q = query(collection(firestore, path)) as Query<IRolesDoc>;
    const docs = await getDocs(q);
    const docsMapped = docs.docs.map((doc) => doc.data());
    return docsMapped;
  } catch (error) {
    console.log(error);
    console.error(error);
  }
}