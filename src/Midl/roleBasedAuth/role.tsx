import { onAuthStateChanged, signOut } from "firebase/auth";
import React from "react";

import { auth } from "../../config/firebase.config";
import { useSubject } from "../../global/hooks";
import NotSigned from "./not.signed";
import { user$ } from "./shared.state";

const Role: React.FC = () => {
  const [roleState, setRoleState] = React.useState("Loading");
  useSubject(user$);

  React.useEffect(() => {
    const sub = onAuthStateChanged(auth, async (user) => {
      if (user === undefined) {
        setRoleState("Loading");
      } else if (user === null) {
        user$.next(null);
        setRoleState("NotSigned");
      } else {
        const idToken = await user?.getIdTokenResult();
        if (
          idToken !== undefined &&
          ["manager", "staff", "printing", "shipping"].includes(
            idToken.claims["role"] as string
          ) &&
          user.emailVerified
        ) {
          user$.next(user);
          setRoleState("Signed");
        } else if (!user.emailVerified) {
          user$.next(user);
          setRoleState("NotSigned");
        } else {
          user$.next(null);
          setRoleState("NotSigned");
        }
      }
    });
    return sub;
  }, []);

  if (roleState === "Loading") {
    return <h1>Loading</h1>;
  } else if (roleState === "NotSigned") {
    return <NotSigned />;
  } else if (roleState === "Signed") {
    return (
      <React.Fragment>
        <h1>Email Verified</h1>
        <button onClick={() => signOut(auth)}>Sign Out</button>
      </React.Fragment>
    );
  } else {
    return <h1>Something Went Wrong</h1>;
  }
};

export default Role;
