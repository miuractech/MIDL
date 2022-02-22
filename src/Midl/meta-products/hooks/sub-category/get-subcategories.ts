import { getFirestore, orderBy } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { FirebaseRepository } from "rxf";
import { from } from "rxjs";

import { setMetaProductCategoryFetchError } from "../../store/meta-product.category.slice";
import {
  setMetaProductSubCategories,
  setMetaProductSubCategoryFetchError,
} from "../../store/meta-product.subcategory.slice";

import { TMetaProductSubCategory } from "../../types";

const metaProductSubCategoryRepo =
  new FirebaseRepository<TMetaProductSubCategory>(
    "/meta/products/sub_category",
    getFirestore()
  );

export default function useGetSubCategories(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function getSubCategories() {
    setLoadingFlag(true);
    const obs$ = from(
      metaProductSubCategoryRepo.getAll([orderBy("createdAt")])
    );
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductSubCategoryFetchError(res));
      else {
        dispatch(setMetaProductSubCategories(res));
        dispatch(setMetaProductCategoryFetchError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, getSubCategories };
}
