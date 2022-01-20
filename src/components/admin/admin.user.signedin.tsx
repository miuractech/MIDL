import { orderBy, Timestamp } from "firebase/firestore";
import React from "react";
import { BehaviorSubject } from "rxjs";
import { v4 as uuidv4 } from "uuid";

import { useObservable, useStartupData, useSubject } from "../../lib/hooks";
import {
  useFirebaseAuth,
  useFirebaseRepositoryAdmin,
} from "../../Midl/Auth/auth.hooks";
import { edited$, fetchedRoles$, rolesCached$ } from "../../store/role";
import { IRolesDoc } from "../../types/role.types";
import UniversalButton from "../global/universal.button";
import StaffForm from "./staff.form";

const showStaffForm$ = new BehaviorSubject(false);

const AdminUserSignedIn: React.FC = () => {
  useSubject(showStaffForm$);
  const { createOneRoleForOneStaff, collectionPath } =
    useFirebaseRepositoryAdmin();
  const submitForm = async (email: string, role: string) => {
    const id = uuidv4();
    const res = await createOneRoleForOneStaff(
      collectionPath,
      { email: email, role: role, id: id, disabled: false },
      id
    );
    if (typeof res !== "string") edited$.next(res);
  };

  return (
    <React.Fragment>
      {showStaffForm$.value ? (
        <StaffForm
          buttonValue="Add New Account"
          headerValue="Add New Account"
          closeForm={() => showStaffForm$.next(false)}
          submitForm={async (email: string, role: string) =>
            await submitForm(email, role)
          }
        />
      ) : null}
      <BlackBorder />
      <Main />
    </React.Fragment>
  );
};

const BlackBorder: React.FC = () => {
  const { firebaseUserSignOut } = useFirebaseAuth();

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
        onClick={() => firebaseUserSignOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

const Main: React.FC = () => {
  const rolesCachedState = useObservable(rolesCached$);
  useSubject(edited$);
  const { getAllRolesDocs, collectionPath } = useFirebaseRepositoryAdmin();

  function fetchCallback() {
    return getAllRolesDocs(collectionPath, [orderBy("createdAt")]);
  }

  function stateUpdateCallback(param: Array<IRolesDoc>) {
    fetchedRoles$.next(param);
  }
  const { loading, error } = useStartupData<Array<IRolesDoc>>(
    fetchCallback,
    stateUpdateCallback
  );

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
        <div>
          <UniversalButton handleClick={() => showStaffForm$.next(true)}>
            Add New Staff
          </UniversalButton>
        </div>
      </div>
      <div style={{ margin: 20, background: "white" }}>
        {loading && <h1>Loading</h1>}
        {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
        {rolesCachedState !== undefined
          ? rolesCachedState.map((s) => (
              <StaffList
                key={s.email}
                email={s.email}
                role={s.role}
                id={s.id}
                createdAt={s.createdAt}
                updatedAt={s.updatedAt}
                disabled={s.disabled}
              />
            ))
          : null}
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
  const [editFormShow, setEditFormShow] = React.useState(false);
  const { updateOneRoleForOneStaff, collectionPath } =
    useFirebaseRepositoryAdmin();

  return (
    <React.Fragment>
      {editFormShow ? (
        <StaffForm
          headerValue="Edit Account"
          placeHolderEmail={props.email}
          placeHolderRole={props.role}
          closeForm={() => setEditFormShow(false)}
          submitForm={async (email: string, role: string) => {
            const res = await updateOneRoleForOneStaff(
              collectionPath,
              { email: email, role: role },
              props.id
            );
            if (typeof res !== "string") edited$.next(res);
          }}
          buttonValue="Edit"
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
          <button>Disable</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AdminUserSignedIn;
