import React from "react";
import { useAuth } from "../contextApi/AuthContext";

//Component resposible for Google signin
const GoogleSignIn: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="google-signin">
      <div>
        <h2>Sign In with Google</h2>
        <button onClick={signInWithGoogle} className="sigin-btn">
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google logo"
            width="50px"
            style={{ backgroundColor: "white" }}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleSignIn;