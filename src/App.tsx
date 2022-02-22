import { User } from "firebase/auth";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import { useFetchFirebaseUser } from "rxf";

import "./config/firebase.config";
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
    (userParam: User | null, loadingParam: boolean, errorParam: string) => dispatch(setAdminUserState({
      user: userParam,userLoading: loadingParam, error: errorParam, signOutMessage: ""
    }))
  );
  return (
    <React.Fragment>
      <h1>Top Level Where The User State is Fetched.</h1>
    </React.Fragment>
  );
};

export default App;
