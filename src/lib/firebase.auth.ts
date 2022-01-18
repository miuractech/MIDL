import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../config/firebase.config";

export default class FirebaseAuth {
  async firebaseGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const firebaseUser = await signInWithPopup(auth, provider);
      return firebaseUser.user;
    } catch (error) {
      throw new Error("Something went wrong!");
    }
  }

  async firebaseCreateUserWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      return (await createUserWithEmailAndPassword(auth, email, password)).user;
    } catch (error) {
      throw error;
    }
  }

  async firebaseEmailPasswordSignin(email: string, password: string) {
    try {
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return firebaseUser.user;
    } catch (error) {
      throw error;
    }
  }

  async firebaseUserSignOut() {
    try {
      await signOut(auth);
      return {
        message: "User has successfully signed out!",
      };
    } catch (error) {
      throw error;
    }
  }

  async firebaseSendEmailVerification(user: User) {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw error;
    }
  }
}
