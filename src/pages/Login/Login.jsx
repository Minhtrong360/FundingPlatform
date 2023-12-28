import React, { useState } from "react";
// import LoginGoogle from './LoginGoogle';  // Update the path accordingly

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function GoogleLoginButton() {
  const { login, loginWithGG } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const handleButtonClick = () => {
    setShowLogin(true);
  };

  const signInWitGG = async (e) => {
    console.log("signInWitGG");
    e.preventDefault();
    await loginWithGG();
  };

  return (
    <div>
      <button
        className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        type="button"
        onClick={(e) => signInWitGG(e)}
      >
        {" "}
        Sign in Google{" "}
      </button>
    </div>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      setErrorMsg("");
      setLoading(true);

      if (!email || !password) {
        setErrorMsg("Please fill in the fields");
        return;
      }

      const { user, session, error } = await login(email, password);

      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("HandleSignIn error:", error.message);
      setErrorMsg("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-slate-900 bg-gray-100 flex h-screen items-center py-16">
      <main className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Don't have an account yet?
                <a
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate("/signup")}
                >
                  Sign up here
                </a>
              </p>
            </div>

            <div className="mt-5">
              {/* <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                G
                Sign in with Google
              </button> */}
              <GoogleLoginButton />

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:mr-6 after:flex-1 after:border-t after:border-gray-200 after:ml-6 dark:before:border-gray-600 dark:after:border-gray-600">
                Or
              </div>

              {/* Form */}
              <form onSubmit={handleSignIn}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 dark:text-white"
                      >
                        Password
                      </label>
                      <a
                        className="text-sm text-blue-600 hover:underline"
                        href="http://localhost:3000/forgot-password"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 text-sm dark:text-white"
                    >
                      Remember me
                    </label>
                  </div>
                  {errorMsg && <div className="text-red-700">{errorMsg}</div>}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-600 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              {/* End Form */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
