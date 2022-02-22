import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";
import {
  setMetaProductFamilies,
  setMetaProductFamilyEditError,
} from "../../store/meta-product.family.slice";
import { reorderFamilyHelper } from "./helpers-family";

async function reorderFamilyAsyncWrapper(
  userName: string,
  currentIndex: number,
  nextIndex: number
) {
  const res = await runTransaction(getFirestore(), async () => {
    return await reorderFamilyHelper(userName, currentIndex, nextIndex);
  });
  return res;
}

export default function useReorderFamily(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function reorderFamily(
    userName: string,
    currentIndex: number,
    nextIndex: number
  ) {
    setLoadingFlag(true);
    const obs$ = from(
      reorderFamilyAsyncWrapper(userName, currentIndex, nextIndex)
    );
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductFamilyEditError(res));
      else {
        dispatch(setMetaProductFamilies(res));
        dispatch(setMetaProductFamilyEditError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, reorderFamily };
}
