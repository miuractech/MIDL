import { User } from "firebase/auth";

import { ApplicationError } from ".";
import { TApplicationUser } from "./types/application.user";

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
