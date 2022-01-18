import { BehaviorSubject } from "rxjs";

import { staffUserNotSignedInStates } from "../../constants";

export const staffUserNotSignedStatesObservable$ = new BehaviorSubject(
  staffUserNotSignedInStates.SIGN_UP
);
