import { BehaviorSubject } from "rxjs";

import { TApplicationErrorObject } from "../lib/types/application.error.type";

export const authError$ = new BehaviorSubject<null | TApplicationErrorObject>(
  null
);

export const fetchRolesError$ =
  new BehaviorSubject<null | TApplicationErrorObject>(null);

export const staffFormError$ =
  new BehaviorSubject<null | TApplicationErrorObject>(null);
