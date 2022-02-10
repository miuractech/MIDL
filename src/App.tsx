import { User } from "firebase/auth";
import React from "react";
import { Provider, useDispatch } from "react-redux";

import { auth } from "./config/firebase.config";
import { useFetchFirebaseUser } from "./lib";
import { setAdminUserState } from "./Midl/auth/store/admin.user.slice";
import { store } from "./store";

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
    </React.Fragment>
  );
};

export default App;
