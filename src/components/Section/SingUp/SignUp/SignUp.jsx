import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { message } from "antd";
import { useAuth } from "../../../../context/AuthContext";
import { supabase } from "../../../../supabase";

const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetLink, setResetLink] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    await auth.loginWithGG();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!rememberMe) {
      message.error("Please accept the Terms and Conditions");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email);

      if (error) throw error;

      if (data && data.length > 0) {
        message.error("Email is already existed");
      } else {
        if (!navigator.onLine) {
          message.error("No internet access.");
          setIsLoading(false);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        const { error: updateError } = await supabase
          .from("users")
          .update({ full_name: fullName })
          .eq("email", email);

        if (updateError) throw updateError;

        setResetLink(true);
        message.success("Sign up successful. Check your email to confirm.");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section zubuz-extra-section">
      <div className="container">
        <div className="zubuz-section-title center">
          <h2>Create Account</h2>
        </div>
        <div className="zubuz-account-wrap">
          <form onSubmit={handleSubmit}>
            <div className="zubuz-account-field">
              <label>Enter your full name</label>
              <input
                type="text"
                placeholder="Adam Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
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
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="zubuz-account-checkbox">
              <input
                type="checkbox"
                id="check"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="check">
                I have read and accept the{" "}
                <button
                  className="text-blue-600 decoration-2 hover:underline hover:cursor-pointer font-medium darkFocusOutlineNone darkFocusRing-1 darkFocus"
                  onClick={() =>
                    window.open("https://www.beekrowd.com/terms", "_blank")
                  }
                >
                  Terms and Conditions
                </button>
              </label>
            </div>
            <button
              id="zubuz-account-btn"
              type="submit"
              // className="zubuz-account-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
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
                Already have an account? <Link to="/sign-in">Log in here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
