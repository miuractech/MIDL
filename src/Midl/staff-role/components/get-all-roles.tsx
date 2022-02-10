import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { StaffRoleInterface } from "..";
import { TApplicationErrorObject, useFetchDataOnMount } from "../../../lib";
import { RootState } from "../../../store";
import { TStaffRole } from "../../../types";
import {
  setStaffRoles,
  setStaffRolesFetchError,
} from "../store/staff-role.slice";

const { getAllStaffAndRoles } = StaffRoleInterface();

const GetAllStaffRoles: React.FC = () => {
  const dispatch = useDispatch();
  const { staffRole } = useSelector((state: RootState) => state.staffRole);
  function staffRoleUpdateCallback(
    res: Array<TStaffRole> | TApplicationErrorObject
  ) {
    if ("severity" in res) dispatch(setStaffRolesFetchError(res));
    else {
      dispatch(setStaffRoles(res));
      dispatch(setStaffRolesFetchError(null));
    }
  }

  // This Custom Hook or Function fetches the Data with the First Param Passed in and Updates the StaffRole state in Redux Store
  // Via the Second Param.
  useFetchDataOnMount<Array<TStaffRole>, TApplicationErrorObject>(
    getAllStaffAndRoles,
    staffRoleUpdateCallback
  );

  return (
    <React.Fragment>
      {staffRole.map((role) => (
        <h3>{role.email}</h3>
      ))}
    </React.Fragment>
  );
};

export default GetAllStaffRoles;
