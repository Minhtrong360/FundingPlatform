import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import SpinnerBtn from "../components/SpinnerBtn";
import AlertMsg from "../components/AlertMsg";
import ReactGA from "react-ga4";
import { message } from "antd";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = async (email, password) => {
  try {
    if (!navigator.onLine) {
      message.error("No internet access.");
      return;
    }
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user, session, error };
  } catch (error) {
    console.log("Login error:", error.message);
    throw error;
  }
};

const signOut = async () => {
  await supabase.auth.signOut();
  // Xóa dữ liệu từ Local Storage khi đăng xuất
  localStorage.removeItem("user");
  localStorage.removeItem("subscribed");
  localStorage.removeItem("admin");
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [loading, setLoading] = useState(true);

  const [subscribed, setSubscribed] = useState(
    localStorage.getItem("subscribed") === "true"
  );
  const [admin, setAdmin] = useState(localStorage.getItem("admin") === "true");

  useEffect(() => {
    let currentUserFromLocalStorage = JSON.parse(localStorage.getItem("user"));

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setAuth(currentUser ? true : false);
      ReactGA.set({ user_pseudo_id: currentUser?.id ? currentUser?.id : "" });
      ReactGA.set({ client_id: currentUser?.id ? currentUser?.id : "" });

      let { data: userSupabase } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser?.id);

      if (userSupabase) {
        setUserData(userSupabase[0]);
        if (
          userSupabase[0]?.plan === "Free" ||
          userSupabase[0]?.plan === null ||
          userSupabase[0]?.plan === undefined ||
          userSupabase[0]?.subscription_status === "canceled" ||
          userSupabase[0]?.subscription_status === "cancelled"
        )
          setSubscribed(false);
        else setSubscribed(true);
        if (userSupabase[0].admin) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      }

      setLoading(false);
    };
    if (!currentUserFromLocalStorage) {
      getUser();
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        const user = session.user;
        const { data: userSupabase } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        const isSubscribed = ![
          "Free",
          null,
          undefined,
          "canceled",
          "cancelled",
        ].includes(userSupabase[0]?.plan);
        const isAdmin = userSupabase[0]?.admin ?? false;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userData", JSON.stringify(userSupabase[0]));
        localStorage.setItem("subscribed", isSubscribed.toString());
        localStorage.setItem("admin", isAdmin.toString());

        setUser(user);
        setSubscribed(isSubscribed);
        setAdmin(isAdmin);
        setUserData(userSupabase[0]);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAuth(false);
        setSubscribed(false);
        setAdmin(false);
        localStorage.clear();
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
        subscribed,
        admin,
        userData,
        login: (email, password) => login(email, password),
        signOut,
      }}
    >
      <AlertMsg />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
