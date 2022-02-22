import { where } from "firebase/firestore";
import React from "react";
import { ApplicationError, TApplicationErrorObject } from "rxf";
import { from } from "rxjs";

import { TMetaProductFamily } from "../../types";
import { metaProductFamilyRepo } from "./helpers-family";

async function familyByNameAsyncWrapper(name: string) {
  const res = await metaProductFamilyRepo.getAll([where("name", "==", name)]);
  if ("severity" in res) return res;
  else {
    if (res.length === 1) return res[0];
    else return new ApplicationError().handleDocumentNotFound();
  }
}

export default function useGetFamilyByName(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const [family, setFamily] = React.useState<null | TMetaProductFamily>(null);
  const [familyError, setFamilyError] =
    React.useState<null | TApplicationErrorObject>(null);

  function getFamilyByName(name: string) {
    setLoadingFlag(true);
    const obs$ = from(familyByNameAsyncWrapper(name));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) setFamilyError(res);
      else {
        setFamily(res);
        setFamilyError(null);
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { loadingFlag, getFamilyByName, family, familyError };
}
