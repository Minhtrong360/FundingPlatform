import { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router";
import AlertMsg from "../../components/AlertMsg";
// import { toast } from "react-toastify";

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
      />
    </div>
  );
};

const SubmitButton = ({ text, onClick, isLoading }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isLoading}
      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
    >
      {text}
    </button>
  );
};

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Bắt đầu loading
    if (newPassword === confirmPassword) {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.log("error supabase", error);
          message.error(error.message);
        } else {
          message.success("Password updated successfully.");

          setTimeout(() => {
            setIsLoading(false); // Kết thúc loading sau 1 giây
            navigate("/login");
          }, 1000);
        }
      } catch (error) {
        message.error(error.message);
      }
    } else {
      message.error("Passwords do not match.");
    }
    setIsLoading(false);
  };

  return (
    <main className="w-full max-w-md mx-auto p-6">
      <AlertMsg />
      <div className="mt-7 bg-white border border-gray-300 rounded-xl shadow-sm darkBgBlue darkBorderGray">
        <div className="p-4 sm:p-7">
          <form onSubmit={handleSubmit} className="mt-5">
            <h1 className="text-center mb-4 block text-2xl font-semibold text-gray-800 darkTextWhite">
              Update Password
            </h1>

            <div className="grid gap-y-4">
              <InputField
                label="New password"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
              <InputField
                label="Confirm password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <LoadingButtonClick isLoading={isLoading} />
              <SubmitButton onClick={handleSubmit} text="Save" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdatePassword;
