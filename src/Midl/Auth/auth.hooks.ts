import { onAuthStateChanged } from "firebase/auth";
import React from "react";

import { auth } from "../../config/firebase.config";
import FirebaseAuth from "../../lib/firebase.auth";
import FirebaseRepository from "../../lib/firebase.repository";
import { user$ } from "../../store/user";
import { IRolesDoc } from "../../types/role.types";

export function useFetchFirebaseGoogleUser() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    try {
      setLoading(true);
      const sub = onAuthStateChanged(auth, async (user) => {
        if (user !== null) {
          const idToken = await user?.getIdTokenResult();
          if (idToken !== undefined && idToken.claims["role"] === "admin") {
            setLoading(false);
            user$.next(user);
          } else {
            setLoading(false);
            user$.next(null);
          }
        } else {
          setLoading(false);
          user$.next(null);
        }
      });
      return sub;
    } catch (error) {
      setLoading(false);
      setError("Sorry! Something has gone wrong, maybe.");
    }
  }, []);

  return { loading, error };
}

export function useFirebaseAuth() {
  const firebaseAuth = new FirebaseAuth();
  const firebaseGoogleSignIn = firebaseAuth.firebaseGoogleSignIn;
  const firebaseUserSignOut = firebaseAuth.firebaseUserSignOut;

  return { firebaseGoogleSignIn, firebaseUserSignOut };
}

export function useFirebaseRepositoryAdmin() {
  const firebaseRepository = new FirebaseRepository<IRolesDoc>("/roles");
  const collectionPath = firebaseRepository.getPath();
  const getAllRolesDocs = firebaseRepository.getAll;
  const createOneRoleForOneStaff = firebaseRepository.createOne;
  const updateOneRoleForOneStaff = firebaseRepository.updatedOne;
  return {
    getAllRolesDocs,
    createOneRoleForOneStaff,
    updateOneRoleForOneStaff,
    collectionPath,
  };
}
