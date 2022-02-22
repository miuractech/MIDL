import React from "react";
import { TApplicationErrorObject } from "rxf";
import { from } from "rxjs";

import { TMetaProductFamily } from "../../types";
import { metaProductFamilyRepo } from "./helpers-family";

export default function useGetFamilyById(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const [family, setFamily] = React.useState<null | TMetaProductFamily>(null);
  const [familyError, setFamilyError] =
    React.useState<null | TApplicationErrorObject>(null);

  function getFamilyById(id: string) {
    setLoadingFlag(true);
    const obs$ = from(metaProductFamilyRepo.getOne(id));
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

  return { family, familyError, loadingFlag, getFamilyById };
}
