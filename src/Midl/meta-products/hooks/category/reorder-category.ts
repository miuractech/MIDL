import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";
import {
  setMetaProductCategories,
  setMetaProductCategoryEditError,
} from "../../store/meta-product.category.slice";
import { reorderCategoryHelper } from "./helpers-category";

async function reorderCategoryAsyncWrapper(
  userName: string,
  currentIndex: number,
  nextIndex: number
) {
  const res = await runTransaction(getFirestore(), async () => {
    return await reorderCategoryHelper(userName, currentIndex, nextIndex);
  });
  return res;
}

export default function useReorderCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function reorderCategory(
    userName: string,
    currentIndex: number,
    nextIndex: number
  ) {
    setLoadingFlag(true);
    const obs$ = from(
      reorderCategoryAsyncWrapper(userName, currentIndex, nextIndex)
    );
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

  return { loadingFlag, reorderCategory };
}
