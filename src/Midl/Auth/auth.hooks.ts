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
      const sub = onAuthStateChanged(auth, (user) => {
        if (user !== null) {
          user$.next(user);
          setLoading(false);
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

export function useFetchUserIsAdmin() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loadingIsAdmin, setLoadingIsAdmin] = React.useState(true);

  React.useEffect(() => {
    const sub = user$.subscribe(async (user) => {
      const token = await user?.getIdTokenResult();
      if (token !== undefined && token.claims["role"] === "admin") {
        setIsAdmin(true);
        setLoadingIsAdmin(false);
      } else {
        setLoadingIsAdmin(false);
      }
    });
    return () => sub.unsubscribe();
  }, []);

  return { isAdmin, loadingIsAdmin };
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
