import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";
import {
  setEditedMetaProductCategory,
  setMetaProductCategoryEditError,
} from "../../store/meta-product.category.slice";
import { metaProductCategoryRepo } from "./helpers-category";

export default function useUpdateCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function updateCategoryName(
    payload: { name: string; updatedBy: string },
    docId: string
  ) {
    setLoadingFlag(true);
    const obs$ = from(metaProductCategoryRepo.updateOne(payload, docId));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductCategoryEditError(res));
      else {
        dispatch(setEditedMetaProductCategory(res));
        dispatch(setMetaProductCategoryEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, updateCategoryName };
}
