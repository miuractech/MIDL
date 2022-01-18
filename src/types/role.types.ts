import { Timestamp } from "firebase/firestore";

export interface IRolesDoc {
  id: string;
  email: string;
  role: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  disabled: boolean;
}
