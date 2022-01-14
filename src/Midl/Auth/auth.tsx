import React from "react";
import useAuth from "./auth.hooks";
import NotSignedUser from "./not.signed.screen";
import Signed from "./signed.screen";

const Auth: React.FC = () => {
  const { userState } = useAuth();

  if (userState === undefined) {
    return <h1>Loading</h1>;
  } else if (userState === null) {
    return <NotSignedUser />;
  } else {
    return <Signed />;
  }
};

export default Auth;
