import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setMetaProductSubCategories,
  setMetaProductSubCategoryEditError,
} from "../../store/meta-product.subcategory.slice";
import { reorderSubCategoryHelper } from "./helpers-subcategory";

async function reorderSubCategoryAsyncWrapper(
  userName: string,
  currentIndex: number,
  nextIndex: number
) {
  const res = await runTransaction(getFirestore(), async () => {
    return await reorderSubCategoryHelper(userName, currentIndex, nextIndex);
  });
  return res;
}

export default function useReorderSubCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function reorderSubCategory(
    userName: string,
    currentIndex: number,
    nextIndex: number
  ) {
    setLoadingFlag(true);
    const obs$ = from(
      reorderSubCategoryAsyncWrapper(userName, currentIndex, nextIndex)
    );
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductSubCategoryEditError(res));
      else {
        dispatch(setMetaProductSubCategories(res));
        dispatch(setMetaProductSubCategoryEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, reorderSubCategory };
}
