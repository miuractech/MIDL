import React from "react";

import { useSubject } from "../../lib/hooks";
import {
  useFetchStaffUser,
  useFirebaseAuth,
} from "../../Midl/roleBasedAuth/role.hooks";
import { user$ } from "../../store/user";
import StaffUserNotSignedIn from "./staff.user.not.signedin";

const Role: React.FC = () => {
  const user = useSubject(user$);
  const { firebaseUserSignOut } = useFirebaseAuth();
  const { loading, error } = useFetchStaffUser();

  if (loading) return <h1>Loading</h1>;
  else if (!loading && user === null) return <StaffUserNotSignedIn />;
  else if (!loading && user !== null && !user.emailVerified)
    return <StaffUserNotSignedIn />;
  else if (!loading && user !== null)
    return (
      <React.Fragment>
        <h1>Email Verified</h1>
        <button onClick={() => firebaseUserSignOut()}>Sign Out</button>
      </React.Fragment>
    );
  else {
    return (
      <React.Fragment>
        {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
      </React.Fragment>
    );
  }
};

export default Role;
