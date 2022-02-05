import { User } from "firebase/auth";
import { BehaviorSubject } from "rxjs";

export interface TAdminUserState {
  user: User | null;
  userLoading: boolean;
  error: string;
  signOutMessage: string;
}

export const adminUserState$ = new BehaviorSubject<TAdminUserState>({
  user: null,
  userLoading: true,
  error: "",
  signOutMessage: "",
});
