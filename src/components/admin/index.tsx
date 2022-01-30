import { User } from "firebase/auth";
import React from "react";

import { auth } from "../../config/firebase.config";
import { DefaultErrorMessage } from "../../constants/default.error.message";
import { useFetchFirebaseUser } from "../../lib/hooks";
import { user$ } from "../../store/user";
import AuthState from "./auth.state";

/**
 *
 * Entry Point to the Admin Route
 *
 * @calls [[useFetchFirebaseUser]]
 *
 * @returns Conditionally Renders the UI for the Admin Route Depending on if the User is Signed in or Not.
 */
const Admin: React.FC = () => {
  function stateUpdateCallback(user: User | null) {
    user$.next(user);
  }

  const { error, loading } = useFetchFirebaseUser(
    DefaultErrorMessage,
    stateUpdateCallback,
    auth
  );

  return (
    <React.Fragment>
      <AuthState loading={loading} />
      {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
    </React.Fragment>
  );
};

export default Admin;
