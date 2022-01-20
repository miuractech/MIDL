import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  Query,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "../config/firebase.config";

/**
 * This is a Generic Firebase Repository Class,
 * that takes a typeparam that defines the document type and a string param for as the collection path.
 *
 * @typeParam DocType
 * @param collectionPath
 * @returns an instance of this class
 */
export default class FirebaseRepository<T> {
  private _path: string = "";

  constructor(path: string) {
    this._path = path;
    this.getOne = this.getOne.bind(this);
    this.getAll = this.getAll.bind(this);
    this.createOne = this.createOne.bind(this);
    this.updatedOne = this.updatedOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  getPath() {
    return this._path;
  }

  async getAll(path: string, queryConstraints: Array<QueryConstraint>) {
    try {
      const firebaseQueryBuilder = query(
        collection(firestore, path),
        ...queryConstraints
      ) as Query<T>;
      const docs = await getDocs(firebaseQueryBuilder);
      return docs.docs.map((doc) => doc.data());
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else return "Unknown Error Caught!";
    }
  }

  async getOne(path: string, docId: string) {
    try {
      const firebaseDocRef = doc(
        firestore,
        path,
        docId
      ) as DocumentReference<T>;
      const document = await getDoc(firebaseDocRef);
      if (document.exists()) return document.data();
      else throw new Error("Document doesn't exists");
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else return "Unknown Error Caught!";
    }
  }

  async createOne(path: string, payload: T, docId: string) {
    try {
      await setDoc(doc(firestore, `${path}/${docId}`), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return await this.getOne(path, docId);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else return "Unknown Error Caught!";
    }
  }

  async updatedOne(path: string, payload: Partial<T>, docId: string) {
    const timestamp = serverTimestamp();
    try {
      const docRef = doc(firestore, `${path}/${docId}`);
      await updateDoc(docRef, { ...payload, updatedAt: timestamp });
      return await this.getOne(path, docId);
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else return "Unknown Error Caught!";
    }
  }

  async deleteOne(path: string, docId: string) {
    try {
      deleteDoc(doc(firestore, `${path}/${docId}`));
      return {
        message: "Document Successfully Deleted",
      };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return error.message;
      } else return "Unknown Error Caught!";
    }
  }
}
