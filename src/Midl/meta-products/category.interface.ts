import {
  orderBy,
  QueryConstraint,
  runTransaction,
  where,
} from "firebase/firestore";
import { firestore } from "../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../lib";
import { TMetaProductCategory } from "../../types";
import { DefaultErrorMessage, MetaProductCategoryLimit } from "../settings";

const metaProductCategoryRepo = new FirebaseRepository<TMetaProductCategory>(
  "/meta/products/category",
  firestore,
  DefaultErrorMessage
);

function getAllCategories(filters: Array<QueryConstraint>) {
  return metaProductCategoryRepo.getAll(filters);
}

function fetchCategoryById(docId: string) {
  return metaProductCategoryRepo.getOne(docId);
}

async function addNewCategory(
  payload: { name: string; createdBy: string; familyId: string },
  docId: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductCategoryRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductCategoryLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductCategory = {
        id: docId,
        index: docs.length,
        name: payload.name,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        familyId: payload.familyId,
        status: "published",
      };
      return metaProductCategoryRepo.createOne(writeable, docId);
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

function updateCategoryName(
  payload: { name: string; updatedBy: string },
  docId: string
) {
  return metaProductCategoryRepo.updateOne(payload, docId);
}

function deleteCategory(docId: string) {
  return metaProductCategoryRepo.updateOne({ status: "deleted" }, docId);
}

async function fetchCategoryByName(name: string) {
  const res = await metaProductCategoryRepo.getAll([where("name", "==", name)]);
  if ("severity" in res) return res;
  else {
    if (res.length === 1) return res[0];
    else return new ApplicationError().handleDocumentNotFound();
  }
}

async function reorderCategory(
  nextIndex: number,
  currentIndex: number,
  userName: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductCategoryRepo.getAll([orderBy("index")]);

    if ("severity" in docs) return docs;
    else {
      const reordered = reorder(docs, nextIndex, currentIndex);
      if ("severity" in reordered) return reordered;
      else {
        reordered.forEach((r) => {
          r.updatedBy = userName;
          metaProductCategoryRepo.updateOne(r, r.id);
        });
        return reordered;
      }
    }
  });
  return res;
}

export interface TMetaProductCategoryDBInterface {
  getAllCategories: typeof getAllCategories;
  fetchCategoryById: typeof fetchCategoryById;
  addNewCategory: typeof addNewCategory;
  updateCategoryName: typeof updateCategoryName;
  deleteCategory: typeof deleteCategory;
  fetchCategoryByName: typeof fetchCategoryByName;
  reorderCategory: typeof reorderCategory;
}

export const MetaProductCategoryDBInterface =
  (): TMetaProductCategoryDBInterface => {
    return {
      getAllCategories,
      fetchCategoryById,
      fetchCategoryByName,
      addNewCategory,
      updateCategoryName,
      deleteCategory,
      reorderCategory,
    };
  };
