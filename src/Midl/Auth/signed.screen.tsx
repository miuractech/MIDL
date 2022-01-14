import {
  collection,
  doc,
  getDoc,
  getDocs,
  Query,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import {
  BehaviorSubject,
  combineLatestWith,
  from,
  map,
  Observable,
} from "rxjs";
import { v4 as uuidv4 } from "uuid";

import { firestore } from "../../config/firebase.config";
import useAuth from "./auth.hooks";
import Button from "./blue.button";
import { getRolesDocs } from "./features";
import StaffForm from "./staff.form";
import { IRolesDoc } from "./types";

const showStaffForm$ = new BehaviorSubject(false);
const showStaffEditForm$ = new BehaviorSubject(false);
const roles$ = from(getRolesDocs("roles"));
const edited$ = new BehaviorSubject<IRolesDoc | null>(null);
const rolesCached$ = edited$.pipe(
  combineLatestWith(roles$),
  map(([edited, val]) => {
    if (edited !== null && val !== undefined) {
      if (val.length === 0) {
        val.push(edited);
      } else {
        const index = val.findIndex((role) => role.id === edited.id);
        if (index !== -1) {
          val[index] = edited;
        }
      }
    }
    return val;
  })
);

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
                option: option,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                disabled: false,
              });
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
  console.log(state, edited$.value);

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
        {state !== undefined ? (
          state.map((s) => (
            <StaffList
              key={s.email}
              email={s.email}
              option={s.option}
              id={s.id}
              createdAt={s.createdAt}
              updatedAt={s.updatedAt}
              disabled={s.disabled}
            />
          ))
        ) : (
          <h1>Loading Roles</h1>
        )}
      </div>
    </div>
  );
};

const StaffList: React.FC<{
  email: string;
  option: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id: string;
  disabled: boolean;
}> = (props) => {
  useSubject(showStaffEditForm$);
  return (
    <React.Fragment>
      {showStaffEditForm$.value ? (
        <StaffForm
          headerValue="Edit Account"
          placeHolderEmail={props.email}
          placeHolderRole={props.option}
          closeForm={() => showStaffEditForm$.next(false)}
          submitForm={async (email: string, option: string) => {
            const timestamp = serverTimestamp();
            try {
              await updateDoc(doc(firestore, `/roles/${props.id}`), {
                email: email,
                option: option,
                updatedAt: timestamp,
              });
            } catch (error) {
              console.error(error);
            }
            try {
              const docRef = doc(firestore, "roles", props.id);
              const res = await getDoc(docRef);
              const data = res.data() as IRolesDoc;
              console.log(data);
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
        <h4>{props.option}</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button onClick={() => showStaffEditForm$.next(true)}>Edit</button>
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
