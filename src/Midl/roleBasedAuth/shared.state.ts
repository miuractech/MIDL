import { User } from "firebase/auth";
import { BehaviorSubject } from "rxjs";

export const notSigned = {
  SIGN_UP: "SIGN_UP",
  LOGIN: "LOGIN",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  VERIFY_EMAIL: "VERIFY_EMAIL",
};

export const notSignedStates$ = new BehaviorSubject(notSigned.SIGN_UP);
export const user$ = new BehaviorSubject<User | null>(null);
