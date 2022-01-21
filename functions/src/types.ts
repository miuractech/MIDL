import * as admin from "firebase-admin";

interface TBase {
  id: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export interface TRole extends TBase {
  email: string;
  role: string;
}
