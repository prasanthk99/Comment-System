import "./App.scss";
import React from "react";
import { useAuth } from "./contextApi/AuthContext";
import Home from "./pages/Home";
import GoogleSignIn from "./pages/GoogleSignIn";
import { Bounce, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {/* Switching between Pages */}
      {user ? <Home /> : <GoogleSignIn />}
    </div>
  );
};

export default App;
