import { orderBy } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setMetaProductCategories,
  setMetaProductCategoryFetchError,
} from "../../store/meta-product.category.slice";
import { metaProductCategoryRepo } from "./helpers-category";

export default function useGetCategories(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function getCategories() {
    setLoadingFlag(true);
    const obs$ = from(metaProductCategoryRepo.getAll([orderBy("createdAt")]));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductCategoryFetchError(res));
      else {
        dispatch(setMetaProductCategories(res));
        dispatch(setMetaProductCategoryFetchError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, getCategories };
}
