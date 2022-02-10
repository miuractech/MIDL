import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TApplicationErrorObject, useFetchDataOnMount } from "../../../../lib";
import { RootState } from "../../../../store";
import IsAdmin from "../../../auth/components/is-admin";
import { MetaProductFamilyDBInterface } from "../../interfaces";
import {
  setMetaProductFamilies,
  setMetaProductFamilyFetchError,
} from "../../store/meta-product.family.slice";
import { TMetaProductFamily } from "../../types";

const { getAllFamilies } = MetaProductFamilyDBInterface();

const GetAllFamilies: React.FC = () => {
  return (
    <IsAdmin
      LoadingRenderProp={() => <h1>Loading</h1>}
      NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
      NotAdminRenderProp={() => <h1>Not Admin</h1>}
      AdminRenderProp={() => <AllFamiliesWrapper />}
    />
  );
};

const AllFamiliesWrapper: React.FC = () => {
  const { metaProductFamilies, fetchError } = useSelector(
    (state: RootState) => state.metaProductFamily
  );
  const dispatch = useDispatch();

  function familiesStateUpdateCallback(
    res: Array<TMetaProductFamily> | TApplicationErrorObject
  ) {
    if ("severity" in res) dispatch(setMetaProductFamilyFetchError(res));
    else {
      dispatch(setMetaProductFamilies(res));
      dispatch(setMetaProductFamilyFetchError(null));
    }
  }

  useFetchDataOnMount<Array<TMetaProductFamily>, TApplicationErrorObject>(
    getAllFamilies,
    familiesStateUpdateCallback
  );

  return (
    <React.Fragment>
      {metaProductFamilies.map((m) => (
        <h1 key={m.id}>{m.name}</h1>
      ))}
      {fetchError !== null && (
        <span style={{ color: "red" }}>{fetchError.message}</span>
      )}
    </React.Fragment>
  );
};

export default GetAllFamilies;
