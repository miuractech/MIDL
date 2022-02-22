import { getFirestore, runTransaction } from "firebase/firestore";
import React from "react";
import { useDispatch } from "react-redux";
import { ApplicationError } from "rxf";
import { from } from "rxjs";

import { MetaProductCategoryLimit } from "../../settings";
import {
  setAddedMetaProductCategory,
  setMetaProductCategoryAddError,
} from "../../store/meta-product.category.slice";
import { TMetaProductCategory } from "../../types";
import { metaProductCategoryRepo } from "./helpers-category";

async function addNewCategoryAsyncWrapper(
  payload: { name: string; createdBy: string; familyId: string },
  docId: string
) {
  const res = await runTransaction(getFirestore(), async () => {
    const docs = await metaProductCategoryRepo.getAll([]);

    if ("severity" in docs) return docs;
    else if (
      docs.length < MetaProductCategoryLimit &&
      docs.filter((d) => d.name === payload.name).length === 0
    ) {
      const writeable: TMetaProductCategory = {
        id: docId,
        index: docs.length,
        name: payload.name,
        createdBy: payload.createdBy,
        updatedBy: payload.createdBy,
        familyId: payload.familyId,
        status: "published",
      };
      return metaProductCategoryRepo.createOne(writeable, docId);
    } else {
      return new ApplicationError().handleCustomError(
        "Conflict/Limit",
        "Naming Conflict or Limit",
        "Naming Conflicts or Limit of Documents has Exceeded",
        "error"
      );
    }
  });
  return res;
}

export default function useAddCategory(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const dispatch = useDispatch();

  function addNewCategory(
    payload: { name: string; createdBy: string; familyId: string },
    docId: string
  ) {
    setLoadingFlag(true);
    const obs$ = from(addNewCategoryAsyncWrapper(payload, docId));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) dispatch(setMetaProductCategoryAddError(res));
      else {
        dispatch(setAddedMetaProductCategory(res));
        dispatch(setMetaProductCategoryAddError(null));
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, addNewCategory };
}
