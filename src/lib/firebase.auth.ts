import { FirebaseError } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";

import { ApplicationError } from "./application.error";

export class FirebaseAuth {
  private _defaultErrorMessage: string;
  private _auth: Auth;

  constructor(defaultErrorMessage: string, auth: Auth) {
    this._defaultErrorMessage = defaultErrorMessage;
    this._auth = auth;
  }

  getAuth = () => this._auth;
  getDefaultErrorMessage = () => this._defaultErrorMessage;

  async firebaseGoogleSignIn(auth: Auth, defaultErrorMessage: string) {
    const provider = new GoogleAuthProvider();
    try {
      const firebaseUser = await signInWithPopup(auth, provider);
      return firebaseUser.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseCreateUserWithEmailAndPassword(
    email: string,
    password: string,
    auth: Auth,
    defaultErrorMessage: string
  ) {
    try {
      return (await createUserWithEmailAndPassword(auth, email, password)).user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseEmailPasswordSignin(
    email: string,
    password: string,
    auth: Auth,
    defaultErrorMessage: string
  ) {
    try {
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return firebaseUser.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseUserSignOut(auth: Auth, defaultErrorMessage: string) {
    try {
      await signOut(auth);
      return {
        message: "User has successfully signed out!",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseSendEmailVerification(user: User, defaultErrorMessage: string) {
    try {
      await sendEmailVerification(user);
      return {
        message: "Success",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }
}
