import { orderBy, runTransaction, where } from "firebase/firestore";
import { firestore } from "../../../config/firebase.config";
import { ApplicationError, FirebaseRepository, reorder } from "../../../lib";
import { TMetaProductCategory } from "../types";
import { DefaultErrorMessage, MetaProductCategoryLimit } from "../settings";

const metaProductCategoryRepo = new FirebaseRepository<TMetaProductCategory>(
  "/meta/products/category",
  firestore,
  DefaultErrorMessage
);

/**
 *
 * Gets All the Categories
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
 * import { MetaProductCategoryDBInterface } from "../../interfaces";
 * import {
 *   setMetaProductCategories,
 *   setMetaProductCategoryFetchError,
 * } from "../../store/meta-product.category.slice";
 * import { TMetaProductCategory } from "../../types";
 *
 * const { getAllCategories } = MetaProductCategoryDBInterface();
 *
 * const GetAllCategories: React.FC = () => {
 *   return (
 *     <IsAdmin
 *       LoadingRenderProp={() => <h1>Loading</h1>}
 *       NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
 *       NotAdminRenderProp={() => <h1>Not Admin</h1>}
 *       AdminRenderProp={() => <AllCategoriesWrapper />}
 *     />
 *   );
 * };
 *
 * const AllCategoriesWrapper: React.FC = () => {
 *   const { metaProductCategories, fetchError } = useSelector(
 *     (state: RootState) => state.metaProductCategory
 *   );
 *   const dispatch = useDispatch();
 *
 *   function categoriesStateUpdateCallback(
 *     res: Array<TMetaProductCategory> | TApplicationErrorObject
 *   ) {
 *     if ("severity" in res) dispatch(setMetaProductCategoryFetchError(res));
 *     else {
 *       dispatch(setMetaProductCategories(res));
 *       dispatch(setMetaProductCategoryFetchError(null));
 *     }
 *   }
 *
 *   useFetchDataOnMount<Array<TMetaProductCategory>, TApplicationErrorObject>(
 *     getAllCategories,
 *     categoriesStateUpdateCallback
 *   );
 *
 *   return (
 *     <React.Fragment>
 *       {metaProductCategories.map((m) => (
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
 * export default GetAllCategories;
 *
 *
 * ```
 */
function getAllCategories() {
  return metaProductCategoryRepo.getAll([orderBy("createdAt")]);
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
        const batch = metaProductCategoryRepo.createBatch();
        reordered.forEach((r) => {
          r.updatedBy = userName;
          metaProductCategoryRepo.batchCommitUpdate(
            batch,
            { updatedBy: userName, index: r.index },
            r.id
          );
        });
        await batch.commit();
        return await metaProductCategoryRepo.getAll([orderBy("index")]);
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

/**
 *
 * Requires Admin Level Privileges to Use
 *
 */
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
