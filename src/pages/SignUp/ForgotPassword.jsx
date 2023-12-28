import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabase";

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-2 dark:text-white">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
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
      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      {text}
    </button>
  );
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState(false); // State để lưu đường liên kết
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Implement password reset logic here
    let { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw error;
    } else {
      // Gửi thành công, cập nhật đường liên kết
      setResetLink(true);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-6">
      {resetLink ? (
        <div className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
          Email sent successfully. Check your inbox for the reset{" "}
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank" // Đặt giá trị của target thành "_blank"
            rel="noopener noreferrer" // Đề phòng các vấn đề bảo mật
            className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            link
          </a>
          .
        </div>
      ) : (
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Remember your password?
                <a
                  onClick={() => navigate("/login")}
                  className="ml-1 text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                >
                  Sign in here
                </a>
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
                <SubmitButton text="Reset password" />
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ForgotPassword;
