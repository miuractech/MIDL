import { Timestamp } from "firebase/firestore";

export interface TUser {
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}

export interface IRolesDoc {
  id: string;
  email: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  disabled: boolean;
}
