import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import { AdminAuthHooks } from "../hooks/auth.hooks";

const { useFetchUserIsAdmin } = AdminAuthHooks();

const IsAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.adminUser);
  const { isAdmin, loadingIsAdmin } = useFetchUserIsAdmin(user);

  if (loadingIsAdmin) return <h1>{"Loading User's Admin State."}</h1>;
  else if (isAdmin === "isNotSignedIn")
    return (
      <h1>{"You Are Not Signed in. Please Sign in, and Then Try Again"}</h1>
    );
  else if (isAdmin === "isNotAdmin") return <h1>{"You Are Not an Admin."}</h1>;
  else return <h1>{`Welcome ${user?.displayName}`}</h1>;
};

export default IsAdmin;
