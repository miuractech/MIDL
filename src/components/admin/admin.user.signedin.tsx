import { Timestamp } from "firebase/firestore";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BehaviorSubject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { TApplicationErrorObject } from "../../lib";

import { useFetchDataOnMount, useSubject } from "../../lib/hooks";
import { useFetchUserIsAdmin } from "../../Midl/admin/admin.hooks";
import {
  AdminAuthInterface,
  AdminFirestoreInterface,
} from "../../Midl/admin/admin.interface";
import { RootState } from "../../store";
import { adminUserState$ } from "../../store/admin.user";
import {
  setAddedRole,
  setEditedRole,
  setRoles,
  setStaffRolesAddError,
  setStaffRolesEditError,
  setStaffRolesFetchError,
} from "../../store/staff-role";
import { roleOptions, TStaffRole } from "../../types/role.types";

import UniversalButton from "../global/universal.button";
import StaffForm from "./staff.form";

const showStaffForm$ = new BehaviorSubject(false);
const { userSignOut } = AdminAuthInterface();
const {
  getAllStaffAndRoles,
  editStaffRole,
  addStaffRole,
  enableStaff,
  disableStaff,
} = AdminFirestoreInterface();

const AdminUserSignedIn: React.FC = () => {
  useSubject(showStaffForm$);
  const staffRoles = useSelector((state: RootState) => state.staffRoles);
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      {showStaffForm$.value ? (
        <StaffForm
          buttonValue="Add New Account"
          headerValue="Add New Account"
          closeForm={() => showStaffForm$.next(false)}
          submitForm={async (email: string, role: roleOptions) => {
            const res = await addStaffRole({
              email: email,
              role: role,
              id: uuidv4(),
            });
            if ("severity" in res) dispatch(setStaffRolesAddError(res));
            else {
              dispatch(setAddedRole(res));
              dispatch(setStaffRolesAddError(null));
            }
          }}
          serverError={
            staffRoles.addError !== null ? staffRoles.addError.message : ""
          }
        />
      ) : null}
      <BlackBorder />
      <Main />
    </React.Fragment>
  );
};

const BlackBorder: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: 50,
        background: "black",
        position: "relative",
      }}
    >
      <button
        style={{ position: "absolute", right: 25, top: 15 }}
        onClick={async () => await userSignOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

const Main: React.FC = () => {
  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(
    adminUserState$.value.user
  );
  const staffRolesState = useSelector((state: RootState) => state.staffRoles);
  const dispatch = useDispatch();
  function stateUpdateCallbackOrCatchError(
    param: Array<TStaffRole> | TApplicationErrorObject
  ) {
    if ("severity" in param) dispatch(setStaffRolesFetchError(param));
    else {
      dispatch(setRoles(param));
      dispatch(setStaffRolesFetchError(null));
    }
  }
  const { loading } = useFetchDataOnMount<
    Array<TStaffRole>,
    TApplicationErrorObject
  >(getAllStaffAndRoles, stateUpdateCallbackOrCatchError);

  return (
    <div
      style={{
        background: "#EFEDED",
        borderRadius: "8px",
        minWidth: 800,
        minHeight: 600,
        margin: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <h3>Staff Account and Roles</h3>
        {isAdmin === "isAdmin" && !loadingIsAdmin ? (
          <div>
            <UniversalButton handleClick={() => showStaffForm$.next(true)}>
              Add New Staff
            </UniversalButton>
          </div>
        ) : null}
      </div>
      <div style={{ margin: 20, background: "white" }}>
        {loading && <h1>Loading</h1>}
        {staffRolesState.fetchError !== null && (
          <span style={{ color: "red" }}>
            {staffRolesState.fetchError.message}
          </span>
        )}
        {staffRolesState.staffRoles.map((s) => (
          <StaffList
            key={s.email}
            email={s.email}
            role={s.role}
            id={s.id}
            createdAt={s.createdAt}
            updatedAt={s.updatedAt}
            disabled={s.disabled}
          />
        ))}
      </div>
    </div>
  );
};

const StaffList: React.FC<{
  email: string;
  role: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  id: string;
  disabled: boolean;
}> = (props) => {
  const dispatch = useDispatch();
  const [editFormShow, setEditFormShow] = React.useState(false);
  const staffRolesState = useSelector((state: RootState) => state.staffRoles);

  return (
    <React.Fragment>
      {editFormShow ? (
        <StaffForm
          headerValue="Edit Account"
          placeHolderEmail={props.email}
          placeHolderRole={props.role}
          closeForm={() => setEditFormShow(false)}
          submitForm={async (email: string, role: roleOptions) => {
            const res = await editStaffRole(role, email);
            if ("severity" in res) dispatch(setStaffRolesEditError(res));
            else {
              dispatch(setEditedRole(res));
              dispatch(setStaffRolesEditError(null));
            }
          }}
          buttonValue="Edit"
          serverError={
            staffRolesState.editError !== null
              ? staffRolesState.editError.message
              : ""
          }
        />
      ) : null}
      <div
        style={{
          display: "flex",
          background: "white",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <h4 style={{ width: 300 }}>{props.email}</h4>
        <h4>{props.role}</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button onClick={() => setEditFormShow(true)}>Edit</button>
          <button
            onClick={async () => {
              const res = props.disabled
                ? await enableStaff(props.id)
                : await disableStaff(props.id);
              if ("severity" in res) dispatch(setStaffRolesEditError(res));
              else {
                dispatch(setEditedRole(res));
                dispatch(setStaffRolesEditError(null));
              }
            }}
          >
            {props.disabled ? "Enable" : "Disable"}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminUserSignedIn;
