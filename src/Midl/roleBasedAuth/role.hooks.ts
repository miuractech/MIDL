import { onAuthStateChanged } from "firebase/auth";
import React from "react";

import { auth } from "../../config/firebase.config";
import FirebaseAuth from "../../lib/firebase.auth";
import { user$ } from "../../store/user";
import { roles } from "./setting";

export function useFetchStaffUser() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    try {
      const sub = onAuthStateChanged(auth, async (user) => {
        if (user === null) {
          user$.next(null);
          setLoading(false);
        } else {
          const idToken = await user?.getIdTokenResult();
          const res =
            idToken !== undefined &&
            roles.includes(
              idToken.claims["role"] as string
            ) &&
            user.emailVerified;
          if (res) {
            user$.next(user);
            setLoading(false);
          } else if (!user.emailVerified) {
            user$.next(user);
            setLoading(false);
          } else {
            user$.next(null);
            setLoading(false);
          }
        }
        //question @somnath : why return sub?
        return sub;
      });
    } catch (error) {
      setLoading(false);
      setError("Sorry! Something has gone wrong.");
    }
  }, [user$.value]);
  return { loading, error };
}

export function useFirebaseAuth() {
  const firebaseAuth = new FirebaseAuth();

  const firebaseCreateUserWithEmailAndPassword =
    firebaseAuth.firebaseCreateUserWithEmailAndPassword;
  const firebaseEmailPasswordSignin = firebaseAuth.firebaseEmailPasswordSignin;
  const firebaseUserSignOut = firebaseAuth.firebaseUserSignOut;
  const firebaseSendEmailVerification =
    firebaseAuth.firebaseSendEmailVerification;

  return {
    firebaseEmailPasswordSignin,
    firebaseUserSignOut,
    firebaseCreateUserWithEmailAndPassword,
    firebaseSendEmailVerification,
  };
}
