import { useSubject } from "../../lib/hooks";
import { adminUserState$ } from "../../store/admin.user";
import AdminUserNotSignedIn from "./admin.user.not.signedin";
import AdminUserSignedIn from "./admin.user.signedin";

const AuthState: React.FC<{ loading: boolean }> = (props) => {
  useSubject(adminUserState$);
  if (props.loading) {
    return <h1>Loading</h1>;
  } else if (adminUserState$.value.user === null && !props.loading) {
    return <AdminUserNotSignedIn />;
  } else if (adminUserState$.value.user !== null && !props.loading) {
    return <AdminUserSignedIn />;
  } else {
    return <h1>Something has gone wrong!</h1>;
  }
};

export default AuthState;
