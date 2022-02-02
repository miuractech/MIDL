import { orderBy, Timestamp } from "firebase/firestore";
import React from "react";
import { BehaviorSubject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { TApplicationErrorObject } from "../../lib";

import {
  useObservable,
  useFetchDataOnMount,
  useSubject,
} from "../../lib/hooks";
import {
  useFetchUserIsAdmin,
  FirebaseAuthInterface,
  FirebaseRepositoryAdminInterface,
} from "../../Midl/Auth/auth.hooks";
import { fetchRolesError$, staffFormError$ } from "../../store/error";
import { edited$, fetchedRoles$, rolesCached$ } from "../../store/role";
import { user$ } from "../../store/user";
import { IRolesDoc } from "../../types/role.types";
import UniversalButton from "../global/universal.button";
import StaffForm from "./staff.form";

const showStaffForm$ = new BehaviorSubject(false);
const {
  userSignOut,
  authModule,
  defaultErrorMessage: defaultErrorAuth,
} = FirebaseAuthInterface();

const {
  createOneRoleForOneStaff,
  updateOneRoleForOneStaff,
  getAllRolesDocs,
  getOneRolesDoc,
  collectionPath,
  firestoreModule,
  defaultErrorMessage: defaultErrorRepo,
} = FirebaseRepositoryAdminInterface();

const AdminUserSignedIn: React.FC = () => {
  useSubject(showStaffForm$);
  const submitForm = async (email: string, role: string) => {
    const id = uuidv4();
    const res = await createOneRoleForOneStaff(
      { email: email, role: role, id: id, disabled: false },
      email,
      collectionPath,
      firestoreModule,
      defaultErrorRepo,
      getOneRolesDoc
    );
    if ("severity" in res) staffFormError$.next(res);
    else edited$.next(res);
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
        onClick={async () => await userSignOut(authModule, defaultErrorAuth)}
      >
        Sign Out
      </button>
    </div>
  );
};

const Main: React.FC = () => {
  const rolesCachedState = useObservable(rolesCached$);
  useSubject(edited$);
  useSubject(fetchRolesError$);
  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(user$.value);

  function fetchCallback() {
    return getAllRolesDocs(
      [orderBy("createdAt")],
      collectionPath,
      firestoreModule,
      defaultErrorRepo
    );
  }

  function stateUpdateCallback(
    param: Array<IRolesDoc> | TApplicationErrorObject
  ) {
    if ("severity" in param) fetchRolesError$.next(param);
    else fetchedRoles$.next(param);
  }

  const { loading } = useFetchDataOnMount<
    Array<IRolesDoc>,
    TApplicationErrorObject
  >(fetchCallback, stateUpdateCallback);

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
        {isAdmin && !loadingIsAdmin ? (
          <div>
            <UniversalButton handleClick={() => showStaffForm$.next(true)}>
              Add New Staff
            </UniversalButton>
          </div>
        ) : null}
      </div>
      <div style={{ margin: 20, background: "white" }}>
        {loading && <h1>Loading</h1>}
        {fetchRolesError$.value !== null && !isAdmin && (
          <span style={{ color: "red" }}>{fetchRolesError$.value.message}</span>
        )}
        {rolesCachedState !== undefined && isAdmin && !loadingIsAdmin
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
              { email: email, role: role },
              email,
              collectionPath,
              firestoreModule,
              defaultErrorRepo,
              getOneRolesDoc
            );
            console.log(res);
            if ("severity" in res) staffFormError$.next(res);
            else edited$.next(res);
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
