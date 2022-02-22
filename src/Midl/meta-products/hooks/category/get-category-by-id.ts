import React from "react";
import { TApplicationErrorObject } from "rxf";
import { from } from "rxjs";

import { TMetaProductCategory } from "../../types";
import { metaProductCategoryRepo } from "./helpers-category";

export default function useGetCategoryById(mounted: boolean) {
  const [loadingFlag, setLoadingFlag] = React.useState(false);
  const [category, setCategory] = React.useState<null | TMetaProductCategory>(
    null
  );
  const [categoryError, setCategoryError] =
    React.useState<null | TApplicationErrorObject>(null);

  function getCategoryById(id: string) {
    setLoadingFlag(true);
    const obs$ = from(metaProductCategoryRepo.getOne(id));
    const sub = obs$.subscribe((res) => {
      if ("severity" in res) setCategoryError(res);
      else {
        setCategory(res);
        setCategoryError(null);
      }
      setLoadingFlag(false);
    });
    if (!mounted) sub.unsubscribe();
  }

  return { category, categoryError, loadingFlag, getCategoryById };
}
