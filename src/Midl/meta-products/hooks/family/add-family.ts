import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { ApplicationError } from "rxf";
import { from } from "rxjs";
import { MetaProductFamilyLimit } from "../../settings";
import {
  setAddedMetaProductFamily,
  setMetaProductFamilyAddError,
} from "../../store/meta-product.family.slice";
import { TMetaProductFamily } from "../../types";
import { metaProductFamilyRepo } from "./helpers-family";

async function addNewFamilyAsyncWrapper(
  payload: { name: string; createdBy: string },
  docId: string
) {
  const res = await runTransaction(getFirestore(), async () => {
    const docs = await metaProductFamilyRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductFamilyLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductFamily = {
        id: docId,
        name: payload.name,
        index: docs.length,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        status: "published",
      };

      return metaProductFamilyRepo.createOne(writeable, docId);
    } else {
      return new ApplicationError().handleCustomError(
        "Conflict",
        "Naming Conflict/Limit",
        "Naming Conflicts or Limit of Documents has Exceeded",
        "error"
      );
    }
  });
  return res;
}

export default function useAddFamily(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function addFamily(
    payload: { name: string; createdBy: string },
    docId: string
  ) {
    setLoadingFlag(true);
    const obs$ = from(addNewFamilyAsyncWrapper(payload, docId));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductFamilyAddError(res));
      else {
        dispatch(setAddedMetaProductFamily(res));
        dispatch(setMetaProductFamilyAddError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, addFamily };
}
