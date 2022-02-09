import { orderBy, where } from "firebase/firestore";

import { auth, firestore } from "../../config/firebase.config";
import { ApplicationError } from "../../lib";
import { FirebaseAuth } from "../../lib/firebase.auth";
import { FirebaseRepository } from "../../lib/firebase.repository";
import { adminUserState$ } from "../../store/admin.user";
import { roleOptions, TStaffRole } from "../../types/role.types";
import { DefaultErrorMessage } from "../settings";


const applicationError = new ApplicationError();

const firebaseAuth = new FirebaseAuth(
  DefaultErrorMessage,
  auth,
  applicationError
);
const firebaseRepository = new FirebaseRepository<TStaffRole>(
  "/roles",
  firestore,
  DefaultErrorMessage
);

/**
 * googleSignIn function will let you sign in / sign up a user via google popup.
 * the auth is provided by GOOGLE. 
 * 
 * @example
 * ```
 * import { AdminAuthInterface } from "../Midl/admin";
 * 
 * const App = () =>{
 *  const { googleSignIn } = AdminAuthInterface();
 * 
 *    return(
 *      <button
 *       onClick = {()=>googleSignIn()}
 *      >
 *        Click to Sign In
 *      </button>
 *    )
 * }
 * ```
 * 
 */
async function googleSignIn() {
  const res = await firebaseAuth.firebaseGoogleSignIn();
  if ("severity" in res)
    adminUserState$.next({
      user: null,
      userLoading: false,
      error: res.message,
      signOutMessage: "",
    });
  else
    adminUserState$.next({
      user: res,
      userLoading: false,
      error: "",
      signOutMessage: "",
    });
}

async function userSignOut() {
  const res = await firebaseAuth.firebaseUserSignOut();
  if ("severity" in res)
    adminUserState$.next({
      user: null,
      userLoading: false,
      error: res.message,
      signOutMessage: "",
    });
  else
    adminUserState$.next({
      user: null,
      userLoading: false,
      error: "",
      signOutMessage: res.message,
    });
}

async function getAllStaffAndRoles() {
  return await firebaseRepository.getAll([orderBy("createdAt")]);
}

async function addStaffRole(payload: {
  email: string;
  role: roleOptions;
  id: string;
}) {
  const dup = await firebaseRepository.getAll([
    where("email", "==", payload.email),
  ]);
  if ("severity" in dup) return dup;
  else if (dup.length > 0) {
    return new ApplicationError().handleDefaultError(
      "Duplicate Field",
      "The Email is Already Taken",
      "info"
    );
  } else
    return await firebaseRepository.createOne(
      { ...payload, disabled: false },
      payload.id
    );
}

async function editStaffRole(email: string, role: roleOptions, docId: string) {
  return await firebaseRepository.updateOne(
    { role: role, email: email },
    docId
  );
}

async function disableStaff(email: string, docId: string) {
  return await firebaseRepository.updateOne(
    { disabled: true, email: email },
    docId
  );
}

async function enableStaff(email: string, docId: string) {
  return await firebaseRepository.updateOne(
    { disabled: false, email: email },
    docId
  );
}

export interface TAdminAuthInterface {
  googleSignIn: typeof googleSignIn;
  userSignOut: typeof userSignOut;
}

export interface TAdminFirestoreInterface {
  getAllStaffAndRoles: typeof getAllStaffAndRoles;
  addStaffRole: typeof addStaffRole;
  editStaffRole: typeof editStaffRole;
  disableStaff: typeof disableStaff;
  enableStaff: typeof enableStaff;
}

export function AdminAuthInterface(): TAdminAuthInterface {
  return {
    googleSignIn: googleSignIn,
    userSignOut: userSignOut,
  };
}

export function AdminFirestoreInterface(): TAdminFirestoreInterface {
  return {
    getAllStaffAndRoles,
    addStaffRole,
    editStaffRole,
    disableStaff,
    enableStaff,
  };
}
