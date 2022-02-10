import { User } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";

import { TApplicationErrorObject } from "../../../lib";
import { AdminAuthInterface } from "../interfaces/auth.interfaces";
import { setAdminUserState } from "../store/admin.user.slice";

const { googleSignIn } = AdminAuthInterface();

const GoogleSignIn: React.FC = () => {
  const dispatch = useDispatch();

  function userStateUpdateCallback(res: User | TApplicationErrorObject) {
    if ("severity" in res) {
      dispatch(
        setAdminUserState({
          user: null,
          userLoading: false,
          error: res.message,
          signOutMessage: "",
        })
      );
    } else {
      dispatch(
        setAdminUserState({
          user: res,
          userLoading: false,
          error: "",
          signOutMessage: "",
        })
      );
    }
  }

  return (
    <React.Fragment>
      <button
        onClick={async () => {
          userStateUpdateCallback(await googleSignIn());
        }}
      >
        Sign In With Google
      </button>
    </React.Fragment>
  );
};

export default GoogleSignIn;
