import { getFirestore, orderBy } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { FirebaseRepository } from "rxf";
import { from } from "rxjs";

import {
  setMetaProductFamilies,
  setMetaProductFamilyFetchError,
} from "../../store/meta-product.family.slice";
import { TMetaProductFamily } from "../../types";
import { metaProductFamilyRepo } from "./helpers-family";

export default function useGetFamilies(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function getFamilies() {
    setLoadingFlag(true);
    const obs$ = from(metaProductFamilyRepo.getAll([orderBy("createdAt")]));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductFamilyFetchError(res));
      else {
        dispatch(setMetaProductFamilies(res));
        dispatch(setMetaProductFamilyFetchError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, getFamilies };
}
