import { getFirestore } from "firebase/firestore";
import { FirebaseRepository } from "rxf";
import { TStaffRole } from "../types";

const firebaseRepository = new FirebaseRepository<TStaffRole>(
  "/roles",
  getFirestore()
);

export default firebaseRepository;
