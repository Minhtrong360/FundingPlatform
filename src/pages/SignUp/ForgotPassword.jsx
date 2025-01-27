import React, { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabase";

import AnnouncePage from "../../components/AnnouncePage";

import LoadingButtonClick from "../../components/LoadingButtonClick";
import { message } from "antd";

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-2 darkTextWhite">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextGray darkFocus"
        required
        aria-describedby={`${name}-error`}
      />
      {/* Error message will be conditionally rendered here */}
    </div>
  );
};

const SubmitButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
    >
      {text}
    </button>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState(false); // State để lưu đường liên kết
  const [isLoading, setIsLoading] = useState(false); // State để lưu trạng thái isLoading
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Bắt đầu loading

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      // Kiểm tra xem email có tồn tại trong Supabase hay không
      const { error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email);

      if (error) {
        console.log("không có user");
        throw error;
      } else {
        // Email tồn tại, thực hiện reset password logic
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
          throw error;
        } else {
          // Gửi thành công, cập nhật đường liên kết
          setResetLink(true);
        }
      }
    } catch (error) {
      message.error(error.message);
      console.log("error", error);
    } finally {
      setIsLoading(false); // Kết thúc loading dù có lỗi hay không
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
        <main className="w-full max-w-md mx-auto p-6">
          <div className="mt-7 bg-white border border-gray-300 rounded-xl shadow-sm darkBgBlue darkBorderGray">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="block text-2xl font-semibold text-gray-800 darkTextWhite">
                  Forgot password?
                </h1>
                <p className="mt-2 text-sm text-gray-600 darkTextGray">
                  Remember your password?
                  <button
                    onClick={() => navigate("/sign-in")}
                    className="ml-1 text-blue-600 decoration-2 hover:underline hover:cursor-pointer font-medium darkFocusOutlineNone darkFocusRing-1 darkFocus"
                  >
                    Sign in here
                  </button>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-5">
                <div className="grid gap-y-4">
                  <InputField
                    label="Email address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <SubmitButton text="Reset password" disabled={isLoading} />
                </div>
              </form>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default ForgotPassword;
