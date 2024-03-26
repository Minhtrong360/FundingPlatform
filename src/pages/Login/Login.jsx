import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertMsg from "../../components/AlertMsg";
import { toast } from "react-toastify";

import SpinnerBtn from "../../components/SpinnerBtn";
import { GoogleOutlined } from "@ant-design/icons";
import { message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      setLoading(true);

      const { error } = await login(email, password);

      if (error) {
        message.error(error.message);
      } else {
        const redirectTo = location?.state?.from?.pathname || "/";
        navigate(redirectTo);
      }
    } catch (error) {
      console.log("HandleSignIn error:", error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const { loginWithGG } = useAuth();

  const signInWitGG = async (e) => {
    e.preventDefault();
    await loginWithGG();
  };

  return (
    <div className="darkBgBlue bg-gray-100 flex h-screen items-center py-16">
      <AlertMsg />
      <main className="w-full max-w-md mx-auto p-6">
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm darkBgBlue darkBorderGray">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-semibold text-gray-800 darkTextWhite">
                Sign in
              </h1>
              <p className=" mt-2 text-sm text-gray-600 darkTextGray">
                Don't have an account yet?
                <button
                  className="ml-1 text-blue-600 hover:underline hover:cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign up here
                </button>
              </p>
            </div>

            <div className="mt-5">
              <button
                onClick={(e) => signInWitGG(e)}
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
              >
                {loading ? (
                  <SpinnerBtn />
                ) : (
                  <>
                    <GoogleOutlined />
                    Sign up with Google
                  </>
                )}
              </button>

              <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:mr-6 after:flex-1 after:border-t after:border-gray-200 after:ml-6 darkBeforeBorderGray darkAfterBorderGray">
                Or
              </div>

              <form onSubmit={handleSignIn}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm mb-2 darkTextWhite"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm darkBgBlue darkBorderGray darkTextGray"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="password"
                        className="block text-sm mb-2 darkTextWhite"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:underline hover:cursor-pointer"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm darkBgBlue darkBorderGray darkTextGray"
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
                      className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 darkBgBlue darkBorderGray"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 text-sm darkTextWhite"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 darkFocusOutlineNone darkFocusRing-1 darkFocus"
                    disabled={loading} // Vô hiệu hóa nút khi đang loading
                  >
                    {loading ? <SpinnerBtn /> : "Sign in"}{" "}
                    {/* Hiển thị "Signing in..." khi loading */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
