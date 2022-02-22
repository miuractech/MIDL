import { TFirestoreDefault } from "rxf";

export type roleOptions = "manager" | "staff" | "printing" | "shipping";

export interface TStaffRole extends TFirestoreDefault {
  email: string;
  role: roleOptions;
  disabled: boolean;
}
