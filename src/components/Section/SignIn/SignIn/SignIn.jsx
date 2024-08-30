import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../context/AuthContext";
import SpinnerBtn from "../../../SpinnerBtn";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loginWithGG } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      if (!navigator.onLine) {
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
        window.location.reload(); // Reload the page after navigating
      }
    } catch (error) {
      console.log("HandleSignIn error:", error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    await loginWithGG();
  };

  return (
    <div className="section zubuz-extra-section">
      <div className="container">
        <div className="zubuz-section-title center">
          <h2>Welcome Back</h2>
        </div>
        <div className="zubuz-account-wrap">
          <form onSubmit={handleSignIn}>
            <div className="zubuz-account-field">
              <label>Enter email address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="zubuz-account-field">
              <label>Enter Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>
            <div className="zubuz-account-checkbox-wrap">
              <div className="zubuz-account-checkbox">
                <input
                  type="checkbox"
                  id="check"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="check">Remember me</label>
              </div>
              <Link className="forgot-password" to="/reset-password">
                Forgot password?
              </Link>
            </div>
            <button id="zubuz-account-btn" type="submit" disabled={loading}>
              {loading ? <SpinnerBtn /> : <span>Sign in</span>}
            </button>
            <div className="zubuz-or">
              <p>or</p>
            </div>
            <Link className="zubuz-connect-login" onClick={signInWithGoogle}>
              <img src="/images/icon/google.svg" alt="" />
              Sign up with Google
            </Link>

            <div className="zubuz-account-bottom">
              <p>
                Not a member yet? <Link to="/sign-up">Sign up here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
