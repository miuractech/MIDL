import { onAuthStateChanged } from "firebase/auth";
import React from "react";

import { auth } from "../../config/firebase.config";
import { firebaseGoogleSignin, firebaseGoogleSignOut } from "./features";
import { TUser } from "./types";

export default function useAuth() {
  const [userState, setUserState] = React.useState<TUser | null>();
  React.useEffect(() => {
    const sub = onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        const idToken = await user?.getIdTokenResult();
        if (idToken !== undefined && idToken.claims["role"] === "admin") {
          setUserState({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } else {
          setUserState(null);
        }
      } else {
        setUserState(null);
      }
    });
    return sub;
  }, []);

  return { firebaseGoogleSignin, firebaseGoogleSignOut, userState };
}
