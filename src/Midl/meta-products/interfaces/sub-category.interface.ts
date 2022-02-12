import { orderBy, runTransaction, where } from "firebase/firestore";
import { firestore } from "../../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../../lib";
import { TMetaProductSubCategory } from "../types";
import { DefaultErrorMessage, MetaProductSubCategoryLimit } from "../settings";

const metaProductSubCategoryRepo =
  new FirebaseRepository<TMetaProductSubCategory>(
    "/meta/products/sub_category",
    firestore,
    DefaultErrorMessage
  );

/**
 * Gets All the SubCategories
 *
 * @example
 *
 * ```
 *
 * import React from "react";
 * import { useDispatch, useSelector } from "react-redux";
 *
 * import { TApplicationErrorObject, useFetchDataOnMount } from "../../../../lib";
 * import { RootState } from "../../../../store";
 * import IsAdmin from "../../../auth/components/is-admin";
 * import { MetaProductSubCategoryDBInterface } from "../../interfaces";
 * import {
 *   setMetaProductSubCategories,
 *   setMetaProductSubCategoryFetchError,
 * } from "../../store/meta-product.subcategory.slice";
 * import { TMetaProductSubCategory } from "../../types";
 *
 * const { getAllSubCategories } = MetaProductSubCategoryDBInterface();
 *
 * const GetAllSubCategories: React.FC = () => {
 *   return (
 *     <IsAdmin
 *       LoadingRenderProp={() => <h1>Loading</h1>}
 *       NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
 *       NotAdminRenderProp={() => <h1>Not Admin</h1>}
 *       AdminRenderProp={() => <AllSubCategoriesWrapper />}
 *     />
 *   );
 * };
 *
 * const AllSubCategoriesWrapper: React.FC = () => {
 *   const { metaProductSubCategories, fetchError } = useSelector(
 *     (state: RootState) => state.metaProductSubCategory
 *   );
 *   const dispatch = useDispatch();
 *
 *   function subCategoriesStateUpdateCallback(
 *     res: Array<TMetaProductSubCategory> | TApplicationErrorObject
 *   ) {
 *     if ("severity" in res) dispatch(setMetaProductSubCategoryFetchError(res));
 *     else {
 *       dispatch(setMetaProductSubCategories(res));
 *       dispatch(setMetaProductSubCategoryFetchError(null));
 *     }
 *   }
 *
 *   useFetchDataOnMount<Array<TMetaProductSubCategory>, TApplicationErrorObject>(
 *     getAllSubCategories,
 *     subCategoriesStateUpdateCallback
 *   );
 *
 *   return (
 *     <React.Fragment>
 *       {metaProductSubCategories.map((m) => (
 *         <div key={m.id}>
 *           <h1>
 *             {m.index} {m.name}
 *           </h1>
 *         </div>
 *       ))}
 *       {fetchError !== null && (
 *         <span style={{ color: "red" }}>{fetchError.message}</span>
 *       )}
 *     </React.Fragment>
 *   );
 * };
 *
 * export default GetAllSubCategories;
 *
 *
 * ```
 *
 */
function getAllSubCategories() {
  return metaProductSubCategoryRepo.getAll([orderBy("createdAt")]);
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

/**
 *
 * Requires Admin Level Privileges to Use
 *
 */
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
