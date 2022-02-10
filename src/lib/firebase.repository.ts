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
  WriteBatch,
  writeBatch,
} from "firebase/firestore";

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

  async getAll(queryConstraints: Array<QueryConstraint>) {
    try {
      const firebaseQueryBuilder = query(
        collection(this._firestore, this._path),
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
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async getOne(docId: string) {
    try {
      const firebaseDocRef = doc(
        this._firestore,
        this._path,
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
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async createOne(payload: T, docId: string) {
    try {
      await setDoc(doc(this._firestore, `${this._path}/${docId}`), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return this.getOne(docId);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async updateOne(payload: Partial<T>, docId: string) {
    const timestamp = serverTimestamp();
    try {
      const docRef = doc(this._firestore, `${this._path}/${docId}`);
      await updateDoc(docRef, { ...payload, updatedAt: timestamp });
      return this.getOne(docId);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  async deleteOne(docId: string) {
    try {
      deleteDoc(doc(this._firestore, `${this._path}/${docId}`));
      return {
        message: "Document Successfully Deleted",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return new ApplicationError().handleFirebaseError(error, "error");
      } else
        return new ApplicationError().handleDefaultError(
          "Unknown",
          this._defaultErrorMessage,
          "error"
        );
    }
  }

  createBatch() {
    return writeBatch(this._firestore);
  }

  batchCommitUpdate(batch: WriteBatch, payload: Partial<T>, docId: string) {
    const docRef = doc(this._firestore, `${this._path}/${docId}`);
    batch.update(docRef, { ...payload, updatedAt: serverTimestamp() });
  }
}
