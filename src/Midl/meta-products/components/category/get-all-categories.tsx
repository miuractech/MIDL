import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TApplicationErrorObject, useFetchDataOnMount } from "../../../../lib";
import { RootState } from "../../../../store";
import IsAdmin from "../../../auth/components/is-admin";
import { MetaProductCategoryDBInterface } from "../../interfaces";
import {
  setMetaProductCategories,
  setMetaProductCategoryFetchError,
} from "../../store/meta-product.category.slice";
import { TMetaProductCategory } from "../../types";

const { getAllCategories } = MetaProductCategoryDBInterface();

const GetAllCategories: React.FC = () => {
  return (
    <IsAdmin
      LoadingRenderProp={() => <h1>Loading</h1>}
      NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
      NotAdminRenderProp={() => <h1>Not Admin</h1>}
      AdminRenderProp={() => <AllCategoriesWrapper />}
    />
  );
};

const AllCategoriesWrapper: React.FC = () => {
  const { metaProductCategories, fetchError } = useSelector(
    (state: RootState) => state.metaProductCategory
  );
  const dispatch = useDispatch();

  function categoriesStateUpdateCallback(
    res: Array<TMetaProductCategory> | TApplicationErrorObject
  ) {
    if ("severity" in res) dispatch(setMetaProductCategoryFetchError(res));
    else {
      dispatch(setMetaProductCategories(res));
      dispatch(setMetaProductCategoryFetchError(null));
    }
  }

  useFetchDataOnMount<Array<TMetaProductCategory>, TApplicationErrorObject>(
    getAllCategories,
    categoriesStateUpdateCallback
  );

  return (
    <React.Fragment>
      {metaProductCategories.map((m) => (
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

export default GetAllCategories;
