import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { BehaviorSubject, Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";

import { firestore } from "../../config/firebase.config";
import { useStartupData } from "../../global/hooks";
import { edited$, fetchedRoles$, rolesCached$ } from "../../store/auth";
import useAuth from "./auth.hooks";
import Button from "./blue.button";
import { getRolesDocs } from "./features";
import StaffForm from "./staff.form";
import { IRolesDoc } from "./types";

const showStaffForm$ = new BehaviorSubject(false);

const Signed: React.FC = () => {
  useSubject(showStaffForm$);

  return (
    <React.Fragment>
      {showStaffForm$.value ? (
        <StaffForm
          buttonValue="Add New Account"
          headerValue="Add New Account"
          submitForm={async (email: string, option: string) => {
            const id = uuidv4();
            try {
              await setDoc(doc(firestore, `/roles/${id}`), {
                id: id,
                email: email,
                role: option,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                disabled: false,
              });
            } catch (error) {
              console.error(error);
            }
            try {
              const docRef = doc(firestore, "roles", id);
              const res = await getDoc(docRef);
              const data = res.data() as IRolesDoc;
              edited$.next(data);
            } catch (error) {
              console.error(error);
            }
          }}
          closeForm={() => {
            showStaffForm$.next(false);
          }}
        />
      ) : null}
      <BlackBorder />
      <Main />
    </React.Fragment>
  );
};

const BlackBorder: React.FC = () => {
  const { firebaseGoogleSignOut } = useAuth();

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
        onClick={() => firebaseGoogleSignOut()}
      >
        Sign Out
      </button>
    </div>
  );
};

const Main: React.FC = () => {
  const state = useObservable(rolesCached$);
  useSubject(edited$);

  function fetchCallback() {
    return getRolesDocs("/roles");
  }

  function stateUpdateCallback(param: Array<IRolesDoc>) {
    fetchedRoles$.next(param);
  }

  const { error, loading } = useStartupData<IRolesDoc>(
    fetchCallback,
    stateUpdateCallback,
    "Something Gone Wrong or You don't have sufficient Permission"
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
          <Button handleClick={() => showStaffForm$.next(true)}>
            Add New Staff
          </Button>
        </div>
      </div>
      <div style={{ margin: 20, background: "white" }}>
        {loading && <h1>Loading</h1>}
        {error.length > 0 && <h1>{error}</h1>}
        {state !== undefined
          ? state.map((s) => (
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
          submitForm={async (email: string, option: string) => {
            const timestamp = serverTimestamp();
            try {
              await updateDoc(doc(firestore, `/roles/${props.id}`), {
                email: email,
                role: option,
                updatedAt: timestamp,
              });
            } catch (error) {
              console.error(error);
            }
            try {
              const docRef = doc(firestore, "roles", props.id);
              const res = await getDoc(docRef);
              const data = res.data() as IRolesDoc;
              edited$.next(data);
            } catch (error) {
              console.error(error);
            }
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
        <h4>{props.email}</h4>
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

function useSubject<T>(subject$: BehaviorSubject<T>) {
  const [state, setState] = React.useState(subject$.value);

  React.useEffect(() => {
    const subjectSub = subject$.subscribe(setState);
    return () => {
      subjectSub.unsubscribe();
    };
  }, []);

  return state;
}

function useObservable<T>(observable$: Observable<T>) {
  const [state, setState] = React.useState<T | undefined>();
  React.useEffect(() => {
    const sub = observable$.subscribe(setState);
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return state;
}

export default Signed;
