import React from "react";

import { useSubject } from "../../lib/hooks";
import { FirebaseAuthInterface } from "../../Midl/Auth/auth.hooks";
import { authError$ } from "../../store/error";
import { user$ } from "../../store/user";

const { googleSignIn, authModule, defaultErrorMessage } =
  FirebaseAuthInterface();

const AdminUserNotSignedIn: React.FC = () => {
  useSubject(authError$);

  async function handleClickGoogleAuth() {
    authError$.next(null);
    const res = await googleSignIn(authModule, defaultErrorMessage);
    if ("severity" in res) {
      authError$.next(res);
    } else {
      user$.next(res);
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          minWidth: "300px",
          width: "50vw",
          minHeight: 600,
          height: "100vh",
        }}
      >
        <img
          src="/left-side-image.png"
          alt="screen"
          height="auto"
          width="100%"
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", minWidth: "50vw" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
            width: "100%",
          }}
        >
          <img src="/miurac-logo.png" alt="logo" />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={{ border: "none" }} onClick={handleClickGoogleAuth}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <img src="/google-logo.png" alt="google-logo" />
              <div style={{ padding: 3, color: "#777777" }}>
                Sign In With Google
              </div>
            </div>
          </button>
        </div>
        {authError$.value !== null && (
          <span style={{ color: "red" }}>{authError$.value.message}</span>
        )}
      </div>
    </div>
  );
};

export default AdminUserNotSignedIn;
