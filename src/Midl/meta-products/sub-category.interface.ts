import {
  orderBy,
  QueryConstraint,
  runTransaction,
  where,
} from "firebase/firestore";
import { firestore } from "../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../lib";
import { TMetaProductSubCategory } from "../../types";
import { DefaultErrorMessage, MetaProductSubCategoryLimit } from "./settings";

const metaProductSubCategoryRepo =
  new FirebaseRepository<TMetaProductSubCategory>(
    "/meta/products/sub_category",
    firestore,
    DefaultErrorMessage
  );

function getAllSubCategories(filters: Array<QueryConstraint>) {
  return metaProductSubCategoryRepo.getAll(filters);
}

function fetchSubCategoryById(docId: string) {
  return metaProductSubCategoryRepo.getOne(docId);
}

async function addNewSubCategory(
  payload: {
    name: string;
    createdBy: string;
    familyId: string;
    categoryId: string;
  },
  docId: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductSubCategoryRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductSubCategoryLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductSubCategory = {
        id: docId,
        index: docs.length,
        name: payload.name,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        familyId: payload.familyId,
        categoryId: payload.categoryId,
        status: "published",
      };
      return metaProductSubCategoryRepo.createOne(writeable, docId);
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

function updateSubCategoryName(
  payload: { name: string; updatedBy: string },
  docId: string
) {
  return metaProductSubCategoryRepo.updateOne(payload, docId);
}

function deleteSubCategory(docId: string) {
  return metaProductSubCategoryRepo.updateOne({ status: "deleted" }, docId);
}

async function fetchSubCategoryByName(name: string) {
  const res = await metaProductSubCategoryRepo.getAll([
    where("name", "==", name),
  ]);
  if ("severity" in res) return res;
  else {
    if (res.length === 1) return res[0];
    else return new ApplicationError().handleDocumentNotFound();
  }
}

async function reorderSubCategory(
  nextIndex: number,
  currentIndex: number,
  userName: string
) {
  const res = await runTransaction(firestore, async () => {
    const docs = await metaProductSubCategoryRepo.getAll([orderBy("index")]);

    if ("severity" in docs) return docs;
    else {
      const reordered = reorder(docs, nextIndex, currentIndex);
      if ("severity" in reordered) return reordered;
      else {
        const batch = metaProductSubCategoryRepo.createBatch();
        reordered.forEach((r) => {
          r.updatedBy = userName;
          metaProductSubCategoryRepo.batchCommitUpdate(
            batch,
            { updatedBy: userName, index: r.index },
            r.id
          );
        });
        await batch.commit();
        return await metaProductSubCategoryRepo.getAll([orderBy("index")]);
      }
    }
  });
  return res;
}

export interface TMetaProductSubCategoryDBInterface {
  getAllSubCategories: typeof getAllSubCategories;
  fetchSubCategoryById: typeof fetchSubCategoryById;
  addNewSubCategory: typeof addNewSubCategory;
  updateSubCategoryName: typeof updateSubCategoryName;
  deleteSubCategory: typeof deleteSubCategory;
  fetchSubCategoryByName: typeof fetchSubCategoryByName;
  reorderSubCategory: typeof reorderSubCategory;
}

export const MetaProductSubCategoryDBInterface =
  (): TMetaProductSubCategoryDBInterface => {
    return {
      getAllSubCategories,
      fetchSubCategoryById,
      fetchSubCategoryByName,
      addNewSubCategory,
      updateSubCategoryName,
      deleteSubCategory,
      reorderSubCategory,
    };
  };
