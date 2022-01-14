import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "../../config/firebase.config";
import { firebaseGoogleSignin, firebaseGoogleSignOut } from "./features";
import { TUser } from "./types";

export default function useAuth() {
  const [userState, setUserState] = React.useState<TUser | null>();
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUserState({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUserState(null);
      }
    });
  }, []);

  return { firebaseGoogleSignin, firebaseGoogleSignOut, userState };
}
