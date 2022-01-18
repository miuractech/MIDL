import { User } from "firebase/auth";
import { BehaviorSubject } from "rxjs";

export const user$ = new BehaviorSubject<User | null>(null);
