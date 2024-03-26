import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import SpinnerBtn from "../components/SpinnerBtn";
import { toast } from "react-toastify";
import AlertMsg from "../components/AlertMsg";
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID; // Thay thế với Measurement ID của bạn

ReactGA.initialize(GA_MEASUREMENT_ID);

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = async (email, password, setLoading) => {
  try {
    if (!navigator.onLine) {
      // Không có kết nối Internet
      toast.error("No internet access.");
      return;
    }
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
    if (!navigator.onLine) {
      // Không có kết nối Internet
      toast.error("No internet access.");
      return;
    }
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

// arrayComparison.js

// Hàm so sánh hai mảng và trả về các phần tử trùng khớp
export function compareArrays(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}

// Hàm hiển thị kết quả so sánh
export function displayCommonElements(array1, array2) {
  const commonElements = compareArrays(array1, array2);

  if (commonElements.length > 0) {
    console.log("Có sự trùng khớp giữa hai mảng:");
    console.log("Các phần tử trùng khớp:", commonElements);
    // Hoặc có thể return kết quả để sử dụng ở nơi gọi hàm
    return commonElements;
  } else {
    console.log("Không có phần tử trùng khớp giữa hai mảng.");
    return [];
  }
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        setCurrentUser(userSupabase);
      }

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

  useEffect(() => {
    if (currentUser) {
      if (
        currentUser[0]?.plan === "Free" ||
        currentUser[0]?.plan === null ||
        currentUser[0]?.plan === undefined ||
        currentUser[0]?.subscription_status !== "active"
      )
        setSubscribed(false);
    } else {
      setSubscribed(true);
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        user,
        subscribed,
        login: (email, password) => login(email, password, setLoading),
        signOut,
        loginWithGG: () => loginWithGG(setLoading),
        displayCommonElements,
      }}
    >
      <AlertMsg />
      {loading ? <SpinnerBtn /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
