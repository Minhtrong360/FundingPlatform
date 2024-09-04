import React, { useState } from "react";
import { useNavigate } from "react-router";

import { message } from "antd";
import { supabase } from "../../../../supabase";
import LoadingButtonClick from "../../../LoadingButtonClick";
import AnnouncePage from "../../../AnnouncePage";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

      if (error) {
        console.log("User not found");
        throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          throw error;
        } else {
          setResetLink(true);
        }
      }
    } catch (error) {
      message.error(error.message);
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingButtonClick isLoading={isLoading} />

      {resetLink ? (
        <AnnouncePage
          title="Congratulations!"
          announce="Email for reset password have been sent."
          describe="Email sent successfully. Check your inbox to confirm."
        />
      ) : (
        <div className="section zubuz-extra-section">
          <div className="container">
            <div className="zubuz-section-title center">
              <h2>Reset Password</h2>
            </div>
            <div className="zubuz-account-wrap">
              <form onSubmit={handleSubmit}>
                <div className="zubuz-account-field">
                  <label>Enter email address</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>

                <button
                  id="zubuz-account-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  <span>Reset password</span>
                </button>
                <div className="zubuz-account-bottom m-0">
                  <p>
                    If you didn’t request a password recovery link, please
                    ignore this.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPasswordForm;
