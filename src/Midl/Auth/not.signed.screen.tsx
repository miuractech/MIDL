import useAuth from "./auth.hooks";

const NotSignedUser: React.FC = () => {
  const { firebaseGoogleSignin } = useAuth();

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
          <button
            style={{ border: "none" }}
            onClick={() => firebaseGoogleSignin()}
          >
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
      </div>
    </div>
  );
};

export default NotSignedUser;
