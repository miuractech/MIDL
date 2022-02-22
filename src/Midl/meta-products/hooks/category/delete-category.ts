import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setMetaProductCategories,
  setMetaProductCategoryEditError,
} from "../../store/meta-product.category.slice";
import {
  metaProductCategoryRepo,
  reorderCategoryHelper,
} from "./helpers-category";

async function deleteCategoryAsyncWrapper(docId: string, userName: string) {
  const res = await runTransaction(getFirestore(), async () => {
    const doc = await metaProductCategoryRepo.updateOne(
      { status: "deleted" },
      docId
    );
    if ("severity" in doc) return doc;
    else {
      return await reorderCategoryHelper(userName, doc.index);
    }
  });
  return res;
}

export default function useDeleteCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function deleteCategory(docId: string, userName: string) {
    setLoadingFlag(true);
    const obs$ = from(deleteCategoryAsyncWrapper(docId, userName));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductCategoryEditError(res));
      else {
        dispatch(setMetaProductCategories(res));
        dispatch(setMetaProductCategoryEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, deleteCategory };
}
