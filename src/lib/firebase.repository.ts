import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  Query,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { TApplicationErrorObject } from "./types/application.error.type";

import { ApplicationError } from "./application.error";

export class FirebaseRepository<T> {
  private _path: string;
  private _firestore: Firestore;
  private _defaultErrorMessage: string;

  constructor(path: string, firestore: Firestore, defaultErrorMessage: string) {
    this._path = path;
    this._firestore = firestore;
    this._defaultErrorMessage = defaultErrorMessage;
  }

  getPath = () => this._path;
  getFirestore = () => this._firestore;
  getDefaultErrorMessage = () => this._defaultErrorMessage;

  async getAll(
    queryConstraints: Array<QueryConstraint>,
    path: string,
    firestore: Firestore,
    defaultErrorMessage: string
  ) {
    try {
      const firebaseQueryBuilder = query(
        collection(firestore, path),
        ...queryConstraints
      ) as Query<T>;
      const docs = await getDocs(firebaseQueryBuilder);
      return docs.docs.map((doc) => doc.data());
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async getOne(
    docId: string,
    path: string,
    firestore: Firestore,
    defaultErrorMessage: string
  ) {
    try {
      const firebaseDocRef = doc(
        firestore,
        path,
        docId
      ) as DocumentReference<T>;
      const document = await getDoc(firebaseDocRef);
      if (document.exists()) return document.data();
      else return new ApplicationError().handleDocumentNotFound();
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async createOne(
    payload: T,
    docId: string,
    path: string,
    firestore: Firestore,
    defaultErrorMessage: string,
    getOneDoc: (
      docId: string,
      path: string,
      firestore: Firestore,
      defaultErrorMessage: string
    ) => Promise<T | TApplicationErrorObject>
  ) {
    try {
      await setDoc(doc(firestore, `${path}/${docId}`), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return await getOneDoc(docId, path, firestore, defaultErrorMessage);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async updatedOne(
    payload: Partial<T>,
    docId: string,
    path: string,
    firestore: Firestore,
    defaultErrorMessage: string,
    getOneDoc: (
      docId: string,
      path: string,
      firestore: Firestore,
      defaultErrorMessage: string
    ) => Promise<T | TApplicationErrorObject>
  ) {
    const timestamp = serverTimestamp();
    try {
      const docRef = doc(firestore, `${path}/${docId}`);
      await updateDoc(docRef, { ...payload, updatedAt: timestamp });
      return await getOneDoc(docId, path, firestore, defaultErrorMessage);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }

  async deleteOne(
    docId: string,
    path: string,
    firestore: Firestore,
    defaultErrorMessage: string
  ) {
    try {
      deleteDoc(doc(firestore, `${path}/${docId}`));
      return {
        message: "Document Successfully Deleted",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          defaultErrorMessage,
          "error"
        );
    }
  }
}
