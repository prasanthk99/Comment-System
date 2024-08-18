import React from "react";
import { CommentInput } from "../components/CommentInput";
import { Comments } from "../components/Comments";
import { useAuth } from "../contextApi/AuthContext";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img 
            src={user.photoURL ?? ""} 
            width="40px" 
            style={{ borderRadius: "50%", margin: "6px" }} 
            alt="User profile"
          />
          <h3>{user.displayName ?? "Anonymous"}</h3>
        </div>
        <button onClick={logout}>Logout</button>
      </div>
      <div className="content">
        <CommentInput />
        <Comments />
      </div>
    </div>
  );
};

export default Home;