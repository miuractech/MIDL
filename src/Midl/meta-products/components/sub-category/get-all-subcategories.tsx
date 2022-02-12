import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TApplicationErrorObject, useFetchDataOnMount } from "../../../../lib";
import { RootState } from "../../../../store";
import IsAdmin from "../../../auth/components/is-admin";
import { MetaProductSubCategoryDBInterface } from "../../interfaces";
import {
  setMetaProductSubCategories,
  setMetaProductSubCategoryFetchError,
} from "../../store/meta-product.subcategory.slice";
import { TMetaProductSubCategory } from "../../types";

const { getAllSubCategories } = MetaProductSubCategoryDBInterface();

const GetAllSubCategories: React.FC = () => {
  return (
    <IsAdmin
      LoadingRenderProp={() => <h1>Loading</h1>}
      NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
      NotAdminRenderProp={() => <h1>Not Admin</h1>}
      AdminRenderProp={() => <AllSubCategoriesWrapper />}
    />
  );
};

const AllSubCategoriesWrapper: React.FC = () => {
  const { metaProductSubCategories, fetchError } = useSelector(
    (state: RootState) => state.metaProductSubCategory
  );
  const dispatch = useDispatch();

  function subCategoriesStateUpdateCallback(
    res: Array<TMetaProductSubCategory> | TApplicationErrorObject
  ) {
    if ("severity" in res) dispatch(setMetaProductSubCategoryFetchError(res));
    else {
      dispatch(setMetaProductSubCategories(res));
      dispatch(setMetaProductSubCategoryFetchError(null));
    }
  }

  useFetchDataOnMount<Array<TMetaProductSubCategory>, TApplicationErrorObject>(
    getAllSubCategories,
    subCategoriesStateUpdateCallback
  );

  return (
    <React.Fragment>
      {metaProductSubCategories.map((m) => (
        <div key={m.id}>
          <h1>
            {m.index} {m.name}
          </h1>
        </div>
      ))}
      {fetchError !== null && (
        <span style={{ color: "red" }}>{fetchError.message}</span>
      )}
    </React.Fragment>
  );
};

export default GetAllSubCategories;
