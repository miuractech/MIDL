<<<<<<< HEAD
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
        //change:skimmed code to use one setLoading
        if (user !== null) {
          user$.next(user);
        } else {
          user$.next(null);
        }
        setLoading(false);
      });
      //question: why return sub?
      return sub;
    } catch (error) {
      setLoading(false);
      setError("Sorry! Something has gone wrong, maybe.");
    }
  }, []);
  //Feedback @somnath: return user even if the user is set in the redux store since the name of this hooks contains the word "fetch". or we have to change the name
  
  return { loading, error };
}

export function useFetchUserIsAdmin() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [loadingIsAdmin, setLoadingIsAdmin] = React.useState(true);

  React.useEffect(() => {
    const sub = user$.subscribe(async (user) => {
      const token = await user?.getIdTokenResult();
       //change:skimmed code to use one setLoading
      if (token !== undefined && token.claims["role"] === "admin") {
        setIsAdmin(true);
      }
      setLoadingIsAdmin(false);
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
    //change? @somnath : createOneStaff
    createOneRoleForOneStaff,
    //change? @somnath : updateOneStaff
    updateOneRoleForOneStaff,
    //change? @somnath : adminCollectionPath or rolescollectionpath depending on what is the motive here 
    collectionPath,
  };
}
=======
import { User } from "firebase/auth";
import React from "react";
import { from } from "rxjs";

import { FirebaseRepository } from "../../lib/firebase.repository";
import { IRolesDoc } from "../../types/role.types";
import { DefaultErrorMessage, ADMIN } from "./settings";
import { auth, firestore } from "../../config/firebase.config";
import { FirebaseAuth } from "../../lib/firebase.auth";

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
>>>>>>> 8b1fedd45a2e476a4b92aece80c611659d39cb84
