import { Timestamp } from "firebase/firestore";

export interface TFirestoreDefault {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
