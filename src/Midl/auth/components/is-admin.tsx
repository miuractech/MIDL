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
  AdminRenderProp: React.FC<{ user: User | null }>;
}> = (props) => {
  const { user } = useSelector((state: RootState) => state.adminUser);
  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(user);

  if (loadingIsAdmin) return <props.LoadingRenderProp />;
  else if (isAdmin === "isNotSignedIn") return <props.NotSignedInRenderProp />;
  else if (isAdmin === "isNotAdmin") return <props.NotAdminRenderProp />;
  else return <props.AdminRenderProp user={user} />;
};

export default IsAdmin;
