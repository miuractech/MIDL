import { Timestamp } from "firebase/app/dist/firestore";

interface TBase {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TRole extends TBase {
  email: string;
  role: string;
}
