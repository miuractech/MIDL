import React from "react";

import { useFetchFirebaseGoogleUser } from "../../Midl/Auth/auth.hooks";
import AuthState from "./auth.state";

const Admin: React.FC = () => {
  const { error, loading } = useFetchFirebaseGoogleUser();
  return (
    <React.Fragment>
      <AuthState loading={loading} />
      {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
    </React.Fragment>
  );
};

export default Admin;
