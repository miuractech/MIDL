import { User } from "firebase/auth";
import { BehaviorSubject } from "rxjs";
import { notSigned } from "../../constants";

export const notSignedStates$ = new BehaviorSubject(notSigned.SIGN_UP);
export const user$ = new BehaviorSubject<User | null>(null);
