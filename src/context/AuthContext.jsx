// import { createContext, useEffect, useReducer, useState } from "react";
// import { supabase } from "../supabase";

// // import apiService from "../app/apiService";
// // import { isValidToken } from "../utils/jwt";

// const initialState = {
//   isInitialized: false,
//   isAuthenticated: false,
//   customer: null,
// };

// const AuthContext = createContext({ ...initialState });

// function AuthProvider({ children }) {
//   const [user, setUser] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       const storedUser = localStorage.getItem(
//         "sb-dheunoflmddynuaxiksw-auth-token"
//       );

//       if (storedUser) {
//         initialState.isAuthenticated = true;
//         const convertUser = JSON.parse(storedUser);
//         if (convertUser) {
//           try {
//             const { data: existingUser, error } = await supabase
//               .from("users")
//               .select()
//               .eq("email", convertUser.user.email);

//             if (error) {
//               console.log("Error checking user:", error);
//               return;
//             }

//             setUser(existingUser[0]);
//           } catch (error) {
//             console.log("An error occurred while fetching user:", error);
//           }
//         } else {
//           setUser(null);
//         }
//       }
//     };

//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         switch (event) {
//           case "SIGNED_IN":
//             if (session?.user.app_metadata.provider === "email") {
//               const { data: existingUser, error } = await supabase
//                 .from("users")
//                 .select()
//                 .eq("email", session?.user.email);

//               if (error) {
//                 console.log("Error checking user:", error);
//                 return;
//               }
//               setUser(existingUser[0]);
//               // localStorage.setItem("user", JSON.stringify(existingUser[0]));
//             } else {
//               const email = session.user.email;

//               // Check if the user already exists in the Supabase database
//               const { data: existingUser, error } = await supabase
//                 .from("users")
//                 .select()
//                 .eq("email", email);

//               if (error) {
//                 console.log("Error checking user:", error);
//                 return;
//               }

//               if (existingUser && existingUser.length > 0) {
//                 // User exists, set the user data

//                 setUser(existingUser[0]);
//                 // localStorage.setItem("user", JSON.stringify(existingUser[0]));
//               } else {
//                 // User does not exist, insert a new user into the database
//                 const { data: newUser, error: insertError } = await supabase
//                   .from("users")
//                   .insert([
//                     {
//                       email,
//                       full_name: session.user.user_metadata.full_name,
//                       avatar_url: session.user.user_metadata.avatar_url,
//                     },
//                   ])
//                   .select();

//                 if (insertError) {
//                   console.log("Error inserting user:", insertError);
//                   return;
//                 }
//                 setUser(newUser[0]);
//                 // localStorage.setItem("user", JSON.stringify(newUser[0]));
//               }
//             }

//             break;
//           case "SIGNED_OUT":
//             localStorage.removeItem("sb-dheunoflmddynuaxiksw-auth-token");
//             setUser(null);
//             await supabase.auth.signOut();

//             break;
//           default:
//         }
//       }
//     );
//     return () => {
//       authListener?.unsubcribe();
//     };
//   }, []);

//   async function login({ email, password }, callback) {
//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) {
//         console.log("Error when signing in:", error.message);
//       } else {
//         // Authentication successful
//         callback();
//       }
//     } catch (error) {
//       console.error("An error occurred during login:", error.message);
//     }
//   }

//   const loginWithGG = async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//       });
//       if (error) {
//         console.log("error", error);
//         throw error;
//       }
//     } catch (error) {
//       console.log("Error logging in with Google:", error.message);
//     }
//   };

//   const logout = async () => {
//     localStorage.removeItem("sb-dheunoflmddynuaxiksw-auth-token");
//     setUser(null);
//     await supabase.auth.signOut();
//   };

//   return (
//     <AuthContext.Provider value={{ login, logout, loginWithGG, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export { AuthContext, AuthProvider };

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = async (email, password) => {
  try {
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

const signOut = () => supabase.auth.signOut();

const loginWithGG = async () =>
  await supabase.auth.signInWithOAuth({
    provider: "google",
  });

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
        login,
        signOut,
        loginWithGG,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
