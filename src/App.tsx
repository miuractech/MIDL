import { User } from "firebase/auth";
import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

import { auth } from "./config/firebase.config";
import { useFetchFirebaseUser } from "./lib";
import GoogleSignIn from "./Midl/auth/components/google-sign-in";
import IsAdmin from "./Midl/auth/components/is-admin";
import UserSignOut from "./Midl/auth/components/user-signout";
import { setAdminUserState } from "./Midl/auth/store/admin.user.slice";
import GetAllStaffRoles from "./Midl/staff-role/components/get-all-roles";
import { RootState, store } from "./store";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
};

const Wrapper: React.FC = () => {
  const dispatch = useDispatch();
  useFetchFirebaseUser(
    "Something Went Wrong",
    (userParam: User | null, loadingParam: boolean, errorParam: string) => {
      dispatch(
        setAdminUserState({
          user: userParam,
          userLoading: loadingParam,
          error: errorParam,
          signOutMessage: "",
        })
      );
    },
    auth
  );

  return (
    <React.Fragment>
      <h1>Top Level Where The User State is Fetched.</h1>
      <GoogleSignIn />
      <IsAdmin
        LoadingRenderProp={() => <h1>Loading</h1>}
        NotAdminRenderProp={() => <h1>Not Admin</h1>}
        NotSignedInRenderProp={() => <h1>Not Signed In</h1>}
        AdminRenderProp={() => <GetAllStaffRoles />}
      />
      <UserSignOut />
    </React.Fragment>
  );
};

export default App;
