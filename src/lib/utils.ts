import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { ApplicationError } from "./application.error";

/**
 *
 * Serialized Firebase User Type if You want to Use Redux With Serialized Objects
 *
 */
 export interface TApplicationUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
}


export interface TDefault {
  index: number;
}

export function firebaseUserToApplicationUser(
  firebaseUser: User
): TApplicationUser {
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    providerId: firebaseUser.providerId,
  };
}

/**
 *
 * Takes an Array of Elements(The Elements Must Have a Field Called Index), the Next, and the Current Index of an Element.
 * It Then Places the Element at that Next Index and Reorders All the Elements by their New Indexes
 *
 * @example
 *
 * ```
 *
 * const arr: Array<{ index: number; name: string }> = [
 *   {
 *     index: 0,
 *     name: "Sanjeev",
 *   },
 *   {
 *     index: 1,
 *     name: "Somnath",
 *   },
 * ];
 *
 * const res = reorder(arr, 0, 1);
 *
 * // output = [{index: 0, name: "Somnath"}, {index: 1, name: "Sanjeev"}]
 *
 * ```
 *
 */
export function reorder<T extends TDefault>(
  param: Array<T>,
  toPlace: number,
  docIndex: number
) {
  const check =
    toPlace >= 0 &&
    toPlace <= param.length - 1 &&
    docIndex <= param.length - 1 &&
    docIndex >= 0 &&
    param.length > 0;

  if (check) {
    const extracted = param.splice(docIndex, 1)[0];
    param.splice(toPlace, 0, extracted);
    param.forEach((p) => (p.index = param.indexOf(p)));
    return param;
  } else {
    return new ApplicationError().handleDefaultError(
      "Wrong Inputs",
      "The Given Inputs Are Wrong or An Unknown Error Occurred for Client",
      "error"
    );
  }
}


/**
 *
 * Default Fields for All Firebase Documents.
 * All The Application Objects that Represent Firebase Documents in React Must Extend this Type
 *
 */
 export interface TFirestoreDefault {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

