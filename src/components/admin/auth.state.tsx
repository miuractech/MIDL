import { useSubject } from "../../lib/hooks";
import { user$ } from "../../store/user";
import AdminUserNotSignedIn from "./admin.user.not.signedin";
import AdminUserSignedIn from "./admin.user.signedin";

const AuthState: React.FC<{ loading: boolean }> = (props) => {
  useSubject(user$);
  if (props.loading) {
    return <h1>Loading</h1>;
  } else if (user$.value === null && !props.loading) {
    return <AdminUserNotSignedIn />;
  } else if (user$.value !== null && !props.loading) {
    return <AdminUserSignedIn />;
  } else {
    return <h1>Something has gone wrong!</h1>;
  }
};

export default AuthState;
