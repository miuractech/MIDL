import React from "react";

import { useSubject } from "../../lib/hooks";
import { adminUserState$ } from "../../store/admin.user";
import AuthState from "./auth.state";

const Admin: React.FC = () => {
  const { userLoading, error } = useSubject(adminUserState$);

  return (
    <React.Fragment>
      <AuthState loading={userLoading} />
      {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
    </React.Fragment>
  );
};

export default Admin;
