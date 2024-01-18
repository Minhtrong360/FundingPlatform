import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import SpinnerBtn from "../components/SpinnerBtn";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = async (email, password, setLoading) => {
  try {
    setLoading(true);
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    return { user, session, error };
  } catch (error) {
    setLoading(false);
    console.log("Login error:", error.message);
    throw error;
  }
};

const signOut = () => supabase.auth.signOut();

const loginWithGG = async (setLoading) => {
  try {
    setLoading(true);
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    setLoading(false);
    return { user, session, error };
  } catch (error) {
    setLoading(false);
    console.log("Google login error:", error.message);
    throw error;
  }
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setAuth(currentUser ? true : false);
      setLoading(false);
    };
    getUser();
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuth(false);
      } else if (event === "SIGNED_IN") {
        setUser(session.user);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setAuth(false);
        setUser(null);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        login: (email, password) => login(email, password, setLoading),
        signOut,
        loginWithGG: () => loginWithGG(setLoading),
      }}
    >
      {loading ? <SpinnerBtn /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
