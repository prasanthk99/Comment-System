import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { toast } from "react-toastify";

interface AuthContextProps {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  //SignIn function
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider).then((result) => {
        console.log(result);
        toast.success("LoggedIn Successfully :)");
      });
    } catch (error) {
      console.log(error);
      toast.error("LoginIn Failed !!!");
    }
  };

  //Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.info('Logged Out');
    } catch (error) {
      console.log(error);
      toast.error("Failed LogOut !!!");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
