import React from "react";

import { staffUserNotSignedInStates } from "../../constants";
import { useFirebaseAuth } from "../../Midl/roleBasedAuth/role.hooks";
import { user$ } from "../../store/user";
import ButtonWithOutStyle from "../global/button.without.style";
import UniversalButton from "../global/universal.button";
import { staffUserNotSignedStatesObservable$ } from "./shared.state";

const VerifyEmail: React.FC = () => {
  const { firebaseSendEmailVerification } = useFirebaseAuth();

  return (
    <React.Fragment>
      <div>
        {user$.value !== null ? (
          <UniversalButton
            handleClick={async () => {
              if (user$.value !== null) {
                try {
                  await firebaseSendEmailVerification(user$.value);
                } catch (error) {
                  console.error(error);
                }
              }
            }}
          >
            Send Verify Link
          </UniversalButton>
        ) : null}

        <ButtonWithOutStyle
          handleClick={() =>
            staffUserNotSignedStatesObservable$.next(
              staffUserNotSignedInStates.SIGN_UP
            )
          }
        >
          Cancel
        </ButtonWithOutStyle>
      </div>
    </React.Fragment>
  );
};

export default VerifyEmail;
