import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";

import { auth } from "../../config/firebase.config";
import { emailRegex, notSigned } from "../../constants";
import { useSubject } from "../../global/hooks";
import { ButtonWithOutStyle, Input, UniversalButton } from "./form.ui";
import { notSignedStates$, user$ } from "./shared.state";

const Container = {
  display: "flex",
  height: "100vh",
  width: "100vw",
  minHeight: "600px",
  minWidth: "400px",
  justifyContent: "center",
  alignItems: "center",
};

const Inner = {
  display: "flex",
  padding: 10,
};

const NotSigned: React.FC = () => {
  useSubject(notSignedStates$);

  if (notSignedStates$.value === notSigned.SIGN_UP) {
    return <Signup />;
  } else if (notSignedStates$.value === notSigned.LOGIN) {
    return <Login />;
  } else if (notSignedStates$.value === notSigned.FORGOT_PASSWORD) {
    return <h1>Forgot Password</h1>;
  } else if (notSignedStates$.value === notSigned.VERIFY_EMAIL) {
    return <VerifyEmail />;
  } else {
    return <h1>Something Went Wrong</h1>;
  }
};

const Signup: React.FC = () => {
  const { register, handleSubmit } =
    useForm<{ email: string; password: string }>();
  const [error, setError] = React.useState("");

  const submit = async (data: { email: string; password: string }) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
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
                signOut(auth);
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
              <Input
                placeHolder="email"
                type="text"
                register={register}
                field="email"
                constraintsObj={{ required: true, pattern: emailRegex }}
              />
              <Input
                placeHolder="password"
                type="password"
                register={register}
                field="password"
                constraintsObj={{ required: true }}
              />
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
            handleClick={() => notSignedStates$.next(notSigned.LOGIN)}
          >
            Already Have an Account? Login
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() => notSignedStates$.next(notSigned.VERIFY_EMAIL)}
          >
            Verify Email
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() => notSignedStates$.next(notSigned.FORGOT_PASSWORD)}
          >
            Forgot Password
          </ButtonWithOutStyle>
          {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const { register, handleSubmit } =
    useForm<{ email: string; password: string }>();

  const [error, setError] = React.useState("");

  const submit = async (data: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
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
                signOut(auth);
              }}
            >
              Sign Out
            </ButtonWithOutStyle>
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Log In As A Staff Member</h3>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column" }}
              onSubmit={handleSubmit(submit)}
            >
              <Input
                placeHolder="email"
                type="text"
                register={register}
                field="email"
                constraintsObj={{ required: true, pattern: emailRegex }}
              />
              <Input
                placeHolder="password"
                type="password"
                register={register}
                field="password"
                constraintsObj={{ required: true }}
              />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <UniversalButton handleClick={() => handleSubmit(submit)}>
                  Log In
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
            handleClick={() => notSignedStates$.next(notSigned.SIGN_UP)}
          >
            Create An Account
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() => notSignedStates$.next(notSigned.VERIFY_EMAIL)}
          >
            Verify Email
          </ButtonWithOutStyle>
          <ButtonWithOutStyle
            handleClick={() => notSignedStates$.next(notSigned.FORGOT_PASSWORD)}
          >
            Forgot Password
          </ButtonWithOutStyle>
          {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
        </div>
      </div>
    </div>
  );
};

const VerifyEmail: React.FC = () => {
  return (
    <React.Fragment>
      <div>
        {user$.value !== null ? (
          <UniversalButton
            handleClick={async () => {
              if (user$.value !== null) {
                try {
                  await sendEmailVerification(user$.value);
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
          handleClick={() => notSignedStates$.next(notSigned.SIGN_UP)}
        >
          Cancel
        </ButtonWithOutStyle>
      </div>
    </React.Fragment>
  );
};

export default NotSigned;
