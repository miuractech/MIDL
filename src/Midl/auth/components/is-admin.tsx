import { User } from "firebase/auth";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import { AdminAuthHooks } from "../hooks/auth.hooks";

const { useFetchUserIsAdmin } = AdminAuthHooks();

const IsAdmin: React.FC<{
  LoadingRenderProp: React.FC;
  NotSignedInRenderProp: React.FC;
  NotAdminRenderProp: React.FC;
  AdminRenderProp: React.FC<{ user: User; displayName: string }>;
}> = (props) => {
  const { user } = useSelector((state: RootState) => state.adminUser);
  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(user);

  if (loadingIsAdmin) return <props.LoadingRenderProp />;
  else if (isAdmin === "isAdmin" && user !== null && user.displayName !== null)
    return <props.AdminRenderProp user={user} displayName={user.displayName} />;
  else if (isAdmin === "isNotAdmin") return <props.NotAdminRenderProp />;
  else return <props.NotSignedInRenderProp />;
};

export default IsAdmin;
