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

/**
 *
 * Class Wrapper for All the Needed Firebase Auth Functionalities
 *
 */
export class FirebaseAuth {
  private _defaultErrorMessage: string;
  private _auth: Auth;
  private _applicationError: ApplicationError;

  constructor(
    defaultErrorMessage: string,
    auth: Auth,
    applicationError: ApplicationError
  ) {
    this._defaultErrorMessage = defaultErrorMessage;
    this._auth = auth;
    this._applicationError = applicationError;
  }

  async firebaseGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const firebaseUser = await signInWithPopup(this._auth, provider);
      return firebaseUser.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return this._applicationError.handleFirebaseError(error, "error");
      } else
        return this._applicationError.handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseCreateUserWithEmailAndPassword(
    email: string,
    password: string
  ) {
    try {
      return (await createUserWithEmailAndPassword(this._auth, email, password))
        .user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return this._applicationError.handleFirebaseError(error, "error");
      } else
        return this._applicationError.handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseEmailPasswordSignin(email: string, password: string) {
    try {
      const firebaseUser = await signInWithEmailAndPassword(
        this._auth,
        email,
        password
      );
      return firebaseUser.user;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return this._applicationError.handleFirebaseError(error, "error");
      } else
        return this._applicationError.handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseUserSignOut() {
    try {
      await signOut(this._auth);
      return {
        message: "User has successfully signed out!",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return this._applicationError.handleFirebaseError(error, "error");
      } else
        return this._applicationError.handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async firebaseSendEmailVerification(user: User) {
    try {
      await sendEmailVerification(user);
      return {
        message: "Success",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return this._applicationError.handleFirebaseError(error, "error");
      } else
        return this._applicationError.handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }
}
