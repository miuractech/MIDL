import { User } from "firebase/auth";
import React from "react";
import { from } from "rxjs";

import { FirebaseRepository } from "../../lib/firebase.repository";
import { IRolesDoc } from "../../types/role.types";
import { DefaultErrorMessage } from "../../constants/default.error.message";
import { auth, firestore } from "../../config/firebase.config";
import { FirebaseAuth } from "../../lib/firebase.auth";
import { ADMIN } from "./settings";

const firebaseAuth = new FirebaseAuth(DefaultErrorMessage, auth);
const firebaseRepository = new FirebaseRepository<IRolesDoc>(
  "/roles",
  firestore,
  DefaultErrorMessage
);

export function useFetchUserIsAdmin(userParam: User | null) {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loadingIsAdmin, setLoadingIsAdmin] = React.useState(true);

  React.useEffect(() => {
    if (userParam !== null) {
      const observable$ = from(userParam?.getIdTokenResult());
      const sub = observable$.subscribe(async (token) => {
        if (token !== undefined && token.claims["role"] === ADMIN) {
          setIsAdmin(true);
        }
        setLoadingIsAdmin(false);
      });
      return () => sub.unsubscribe();
    }
  }, [userParam]);

  return { isAdmin, loadingIsAdmin };
}

export function FirebaseAuthInterface() {
  const authModule = firebaseAuth.getAuth();
  const defaultErrorMessage = firebaseAuth.getDefaultErrorMessage();
  const googleSignIn = firebaseAuth.firebaseGoogleSignIn;
  const userSignOut = firebaseAuth.firebaseUserSignOut;

  return { authModule, defaultErrorMessage, googleSignIn, userSignOut };
}

export function FirebaseRepositoryAdminInterface() {
  const collectionPath = firebaseRepository.getPath();
  const firestoreModule = firebaseRepository.getFirestore();
  const defaultErrorMessage = firebaseRepository.getDefaultErrorMessage();
  const getAllRolesDocs = firebaseRepository.getAll;
  const getOneRolesDoc = firebaseRepository.getOne;
  const createOneRoleForOneStaff = firebaseRepository.createOne;
  const updateOneRoleForOneStaff = firebaseRepository.updatedOne;
  return {
    getAllRolesDocs,
    createOneRoleForOneStaff,
    updateOneRoleForOneStaff,
    getOneRolesDoc,
    collectionPath,
    firestoreModule,
    defaultErrorMessage,
  };
}
