import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { useGetAllStaffRoles } from "../hooks";
import { RootState } from "../../../store";

const GetAllStaffRoles: React.FC = () => {
  const { staffRole, fetchError } = useSelector(
    (state: RootState) => state.staffRole
  );
  const { loadingFlag, getStaffRoles } = useGetAllStaffRoles(true);
  React.useEffect(() => {
    getStaffRoles();
  }, []);

  return (
    <React.Fragment>
      {loadingFlag && <h1>Loading</h1>}
      {staffRole.map((role) => (
        <h3 key={role.id}>{role.email}</h3>
      ))}
      {fetchError !== null && (
        <span style={{ color: "red" }}>{fetchError?.message}</span>
      )}
    </React.Fragment>
  );
};

export default GetAllStaffRoles;
