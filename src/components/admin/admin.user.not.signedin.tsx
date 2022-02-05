import React from "react";

import { useSubject } from "../../lib/hooks";
import { AdminAuthInterface } from "../../Midl/admin/admin.interface";
import { adminUserState$ } from "../../store/admin.user";

const { googleSignIn } = AdminAuthInterface();

const AdminUserNotSignedIn: React.FC = () => {
  useSubject(adminUserState$);

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
          <button style={{ border: "none" }} onClick={() => googleSignIn()}>
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
        {adminUserState$.value.error.length > 0 && (
          <span style={{ color: "red" }}>{adminUserState$.value.error}</span>
        )}
        <span>{adminUserState$.value.signOutMessage}</span>
      </div>
    </div>
  );
};

export default AdminUserNotSignedIn;
