import React from "react";

import { staffUserNotSignedInStates } from "../../constants";
import { useSubject } from "../../lib/hooks";
import ButtonWithOutStyle from "../global/button.without.style";
import Login from "./login";
import { staffUserNotSignedStatesObservable$ } from "./shared.state";
import SignUp from "./signup";
import VerifyEmail from "./verify.email";

const StaffUserNotSignedIn: React.FC = () => {
  useSubject(staffUserNotSignedStatesObservable$);
  if (
    staffUserNotSignedStatesObservable$.value ===
    staffUserNotSignedInStates.SIGN_UP
  )
    return <SignUp />;
  else if (
    staffUserNotSignedStatesObservable$.value ===
    staffUserNotSignedInStates.LOGIN
  )
    return <Login />;
  else if (
    staffUserNotSignedStatesObservable$.value ===
    staffUserNotSignedInStates.VERIFY_EMAIL
  )
    return <VerifyEmail />;
  else if (
    staffUserNotSignedStatesObservable$.value ===
    staffUserNotSignedInStates.FORGOT_PASSWORD
  )
    return (
      <React.Fragment>
        <h1>Feature Not Implemented Yet</h1>
        <ButtonWithOutStyle
          handleClick={() =>
            staffUserNotSignedStatesObservable$.next(
              staffUserNotSignedInStates.SIGN_UP
            )
          }
        >
          Go Back
        </ButtonWithOutStyle>
      </React.Fragment>
    );
  else return <h1>Something has gone wrong!</h1>;
};

export default StaffUserNotSignedIn;
