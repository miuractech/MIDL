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
import { useSubject } from "../../global/hooks";
import { notSigned, notSignedStates$, user$ } from "./shared.state";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    <React.Fragment>
      {user$.value !== null ? (
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign Out
        </button>
      ) : (
        <div>
          <form onSubmit={handleSubmit(submit)}>
            <input
              placeholder="email"
              type="text"
              {...register("email", { required: true, pattern: emailRegex })}
            />
            <input
              placeholder="password"
              type="password"
              {...register("password", { required: true })}
            />
            <button onClick={handleSubmit(submit)}>Sign Up</button>
          </form>
        </div>
      )}
      <button onClick={() => notSignedStates$.next(notSigned.LOGIN)}>
        Already Have an Account? Login
      </button>
      <button onClick={() => notSignedStates$.next(notSigned.VERIFY_EMAIL)}>
        Verify Email
      </button>
      <button onClick={() => notSignedStates$.next(notSigned.FORGOT_PASSWORD)}>
        Forgot Password
      </button>
      {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
    </React.Fragment>
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
    <React.Fragment>
      {user$.value !== null ? (
        <button
          onClick={() => {
            signOut(auth);
          }}
        >
          Sign Out
        </button>
      ) : (
        <div>
          <form onSubmit={handleSubmit(submit)}>
            <input
              placeholder="email"
              type="text"
              {...register("email", { required: true, pattern: emailRegex })}
            />
            <input
              placeholder="password"
              type="password"
              {...register("password", { required: true })}
            />
            <button onClick={handleSubmit(submit)}>Sign In</button>
          </form>
        </div>
      )}
      <button onClick={() => notSignedStates$.next(notSigned.SIGN_UP)}>
        Create an Account
      </button>
      <button onClick={() => notSignedStates$.next(notSigned.VERIFY_EMAIL)}>
        Verify Email
      </button>
      <button onClick={() => notSignedStates$.next(notSigned.FORGOT_PASSWORD)}>
        Forgot Password
      </button>
      {error.length > 0 && <span style={{ color: "red" }}>{error}</span>}
    </React.Fragment>
  );
};

const VerifyEmail: React.FC = () => {
  return (
    <React.Fragment>
      <div>
        <button
          onClick={async () => {
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
        </button>
      </div>
    </React.Fragment>
  );
};

export default NotSigned;
