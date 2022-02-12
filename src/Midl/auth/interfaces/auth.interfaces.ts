import { auth } from "../../../config/firebase.config";
import { ApplicationError } from "../../../lib";
import { FirebaseAuth } from "../../../lib/firebase.auth";
import { DefaultErrorMessage } from "../settings";

const applicationError = new ApplicationError();

const firebaseAuth = new FirebaseAuth(
  DefaultErrorMessage,
  auth,
  applicationError
);

/**
 * googleSignIn Function Will Let You Sign in / Sign up a User Via Google Popup.
 * The Auth is Provided by GOOGLE.
 *
 * @example
 *
 * ```
 * import { User } from "firebase/auth";
 * import React from "react";
 * import { useDispatch, useSelector } from "react-redux";
 *
 * import { TApplicationErrorObject } from "../../../lib";
 * import { RootState } from "../../../store";
 * import { AdminAuthInterface } from "../interfaces/auth.interfaces";
 * import { setAdminUserState } from "../store/admin.user.slice";
 *
 * const { googleSignIn } = AdminAuthInterface();
 *
 * const GoogleSignIn: React.FC = () => {
 *   const dispatch = useDispatch();
 *   const { user } = useSelector((state: RootState) => state.adminUser);
 *
 *   function userStateUpdateCallback(res: User | TApplicationErrorObject) {
 *     if ("severity" in res) {
 *       dispatch(
 *         setAdminUserState({
 *           user: null,
 *           userLoading: false,
 *           error: res.message,
 *           signOutMessage: "",
 *         })
 *       );
 *     } else {
 *       dispatch(
 *         setAdminUserState({
 *           user: res,
 *           userLoading: false,
 *           error: "",
 *           signOutMessage: "",
 *         })
 *       );
 *     }
 *   }
 *
 *   return (
 *     <React.Fragment>
 *       {user === null ? (
 *         <button
 *           onClick={async () => {
 *             userStateUpdateCallback(await googleSignIn());
 *           }}
 *         >
 *           Sign In With Google
 *         </button>
 *       ) : (
 *         <h1>You Are Already Signed In.</h1>
 *       )}
 *     </React.Fragment>
 *   );
 * };
 *
 * export default GoogleSignIn;
 *
 *
 * ```
 *
 */
async function googleSignIn() {
  return await firebaseAuth.firebaseGoogleSignIn();
}

/**
 *
 * googleSignOut Function Will Sign Out the Current User.
 * The Auth is Provided by GOOGLE.
 *
 * @example
 * ```
 *
 * import { useDispatch, useSelector } from "react-redux";
 *
 * import { AdminAuthInterface } from "../interfaces/auth.interfaces";
 * import { TApplicationErrorObject } from "../../../lib";
 * import { RootState } from "../../../store";
 * import { setAdminUserState } from "../store/admin.user.slice";
 * import React from "react";
 *
 * const { userSignOut } = AdminAuthInterface();
 *
 * const UserSignOut: React.FC = () => {
 *   const dispatch = useDispatch();
 *   const { user, signOutMessage } = useSelector(
 *     (state: RootState) => state.adminUser
 *   );
 *
 *   function userStateUpdateCallback(
 *     res: TApplicationErrorObject | { message: string }
 *   ) {
 *     if ("severity" in res) {
 *       dispatch(
 *         setAdminUserState({
 *           user: user,
 *           userLoading: false,
 *           error: res.message,
 *           signOutMessage: "",
 *         })
 *       );
 *     } else {
 *       dispatch(
 *         setAdminUserState({
 *           user: null,
 *           userLoading: false,
 *           error: "",
 *           signOutMessage: res.message,
 *         })
 *       );
 *     }
 *   }
 *
 *   return (
 *     <React.Fragment>
 *       {user !== null ? (
 *         <button
 *           onClick={async () => {
 *             userStateUpdateCallback(await userSignOut());
 *           }}
 *         >
 *           Sign Out
 *         </button>
 *       ) : (
 *         <h1>{signOutMessage}</h1>
 *       )}
 *     </React.Fragment>
 *   );
 * };
 *
 * export default UserSignOut;
 *
 *
 * ```
 */
async function userSignOut() {
  return await firebaseAuth.firebaseUserSignOut();
}

export interface TAdminAuthInterface {
  googleSignIn: typeof googleSignIn;
  userSignOut: typeof userSignOut;
}

/**
 *
 * Authentication Interface Meant for Admin Users
 *
 */
export function AdminAuthInterface(): TAdminAuthInterface {
  return {
    googleSignIn: googleSignIn,
    userSignOut: userSignOut,
  };
}
