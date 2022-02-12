import { Timestamp } from "firebase/firestore";

/**
 *
 * Default Fields for All Firebase Documents.
 * All The Application Objects that Represent Firebase Documents in React Must Extend this Type
 *
 */
export interface TFirestoreDefault {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
