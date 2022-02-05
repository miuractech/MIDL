import {
  orderBy,
  QueryConstraint,
  runTransaction,
  where,
} from "firebase/firestore";

import { firestore } from "../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../lib";
import { TMetaProductFamily } from "../../types/meta-product.types";
import { DefaultErrorMessage, MetaProductFamilyLimit } from "../settings";

const metaProductFamilyRepo = new FirebaseRepository<TMetaProductFamily>(
  "/meta/products/family",
  firestore,
  DefaultErrorMessage
);

function getAllFamilies(filters: Array<QueryConstraint>) {
  return metaProductFamilyRepo.getAll(filters);
}

function fetchFamilyById(docId: string) {
  return metaProductFamilyRepo.getOne(docId);
}

async function addNewFamily(
  payload: { name: string; createdBy: string },
  docId: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductFamilyRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductFamilyLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductFamily = {
        id: docId,
        name: payload.name,
        index: docs.length,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        status: "published",
      };

      return metaProductFamilyRepo.createOne(writeable, docId);
    } else {
      return new ApplicationError().handleDefaultError(
        "Conflict/Limit",
        "Naming Conflicts or Limit of Documents has Exceeded",
        "error"
      );
    }
  });
  return res;
}

function updateFamily(
  payload: { name: string; updatedBy: string },
  docId: string
) {
  return metaProductFamilyRepo.updateOne(payload, docId);
}

function deleteFamily(docId: string) {
  return metaProductFamilyRepo.updateOne({ status: "deleted" }, docId);
}

async function fetchFamilyByName(name: string) {
  const res = await metaProductFamilyRepo.getAll([where("name", "==", name)]);
  if ("severity" in res) return res;
  else {
    if (res.length === 1) return res[0];
    else return new ApplicationError().handleDocumentNotFound();
  }
}

async function reorderFamily(
  nextIndex: number,
  currentIndex: number,
  userName: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductFamilyRepo.getAll([orderBy("index")]);

    if ("severity" in docs) return docs;
    else {
      const reordered = reorder(docs, nextIndex, currentIndex);
      if ("severity" in reordered) return reordered;
      else {
        reordered.forEach((r) => {
          r.updatedBy = userName;
          metaProductFamilyRepo.updateOne(r, r.id);
        });
        return reordered;
      }
    }
  });
  return res;
}

export interface TMetaProductFamilyInterface {
  getAllFamilies: typeof getAllFamilies;
  fetchFamilyById: typeof fetchFamilyById;
  fetchFamilyByName: typeof fetchFamilyByName;
  addNewFamily: typeof addNewFamily;
  updateFamily: typeof updateFamily;
  deleteFamily: typeof deleteFamily;
  reorderFamily: typeof reorderFamily;
}

export function MetaProductFamilyInterface(): TMetaProductFamilyInterface {
  return {
    getAllFamilies,
    fetchFamilyById,
    fetchFamilyByName,
    addNewFamily,
    updateFamily,
    deleteFamily,
    reorderFamily,
  };
}
