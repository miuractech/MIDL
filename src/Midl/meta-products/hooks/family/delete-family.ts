import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { from } from "rxjs";
import {
  setMetaProductFamilies,
  setMetaProductFamilyEditError,
} from "../../store/meta-product.family.slice";
import { metaProductFamilyRepo, reorderFamilyHelper } from "./helpers-family";

async function deleteFamilyAsyncWrapper(docId: string, userName: string) {
  const res = await runTransaction(getFirestore(), async () => {
    const doc = await metaProductFamilyRepo.updateOne(
      { status: "deleted" },
      docId
    );
    if ("severity" in doc) return doc;
    else {
      return await reorderFamilyHelper(userName, doc.index);
    }
  });
  return res;
}

export default function useDeleteFamily(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function deleteFamily(docId: string, userName: string) {
    setLoadingFlag(true);
    const obs$ = from(deleteFamilyAsyncWrapper(docId, userName));
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

  return { loadingFlag, deleteFamily };
}
