import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";

import {
  setEditedMetaProductFamily,
  setMetaProductFamilyEditError,
} from "../../store/meta-product.family.slice";
import { metaProductFamilyRepo } from "./helpers-family";

export default function useUpdateFamily(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function updateFamilyName(
    payload: { name: string; updatedBy: string },
    docId: string
  ) {
    setLoadingFlag(true);
    const obs$ = from(metaProductFamilyRepo.updateOne(payload, docId));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductFamilyEditError(res));
      else {
        dispatch(setEditedMetaProductFamily(res));
        dispatch(setMetaProductFamilyEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, updateFamilyName };
}
