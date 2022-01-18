import { yupResolver } from "@hookform/resolvers/yup";
import { FirebaseError } from "firebase/app";
import React from "react";
import { useForm } from "react-hook-form";
import { Container, Inner, staffUserNotSignedInStates } from "../../constants";

import { useFirebaseAuth } from "../../Midl/roleBasedAuth/role.hooks";
import { user$ } from "../../store/user";
import ButtonWithOutStyle from "../global/button.without.style";
import GenericRegisterLoginInput from "../global/generic.input";
import UniversalButton from "../global/universal.button";
import { IForm, validationSchema } from "./form";
import { staffUserNotSignedStatesObservable$ } from "./shared.state";

const SignUp: React.FC = () => {
  const [serverError, setServerError] = React.useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>({ resolver: yupResolver(validationSchema) });
  const { firebaseCreateUserWithEmailAndPassword, firebaseUserSignOut } =
    useFirebaseAuth();

  const submit = async (data: { email: string; password: string }) => {
    try {
      user$.next(
        await firebaseCreateUserWithEmailAndPassword(data.email, data.password)
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        setServerError(error.message);
      }
    }
  };

  return (
    <div style={{ ...Container, background: "white" }}>
      <div
        style={{
          ...Inner,
          background: "white",
          boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
          flexDirection: "column",
        }}
      >
        {user$.value !== null ? (
          <div>
            <span style={{ color: "green" }}>
              You are not signed in as a Staff Member or your email is not
              verified
            </span>
            <ButtonWithOutStyle
              handleClick={() => {
                firebaseUserSignOut();
              }}
            >
              Sign Out
            </ButtonWithOutStyle>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Sign Up As A Staff Member</h3>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={handleSubmit(submit)}
            >
              <GenericRegisterLoginInput
                placeHolder="email"
                type="text"
                register={register}
                field="email"
              />
              <span>{errors.email?.message}</span>
              <GenericRegisterLoginInput
                placeHolder="password"
                type="password"
                register={register}
                field="password"
              />
              {errors.password?.message}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <UniversalButton handleClick={() => handleSubmit(submit)}>
                  Sign Up
                </UniversalButton>
              </div>
            </form>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ButtonWithOutStyle
            handleClick={() =>
              staffUserNotSignedStatesObservable$.next(
                staffUserNotSignedInStates.LOGIN
              )
            }
          >
            Already Have an Account? Login
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() =>
              staffUserNotSignedStatesObservable$.next(
                staffUserNotSignedInStates.VERIFY_EMAIL
              )
            }
          >
            Verify Email
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() =>
              staffUserNotSignedStatesObservable$.next(
                staffUserNotSignedInStates.FORGOT_PASSWORD
              )
            }
          >
            Forgot Password
          </ButtonWithOutStyle>
          {serverError.length > 0 && (
            <span style={{ color: "red" }}>{serverError}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
