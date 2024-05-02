import { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router";
import AlertMsg from "../../components/AlertMsg";
// import { toast } from "react-toastify";

import LoadingButtonClick from "../../components/LoadingButtonClick";
import { message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const SubmitButton = ({ text, onClick, isLoading }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isLoading}
      className="mt-6 w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
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

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="w-full max-w-md mx-auto p-6">
      <AlertMsg />
      <div className="mt-7 bg-white border border-gray-300 rounded-xl shadow-sm darkBgBlue darkBorderGray">
        <div className="p-4 sm:p-7">
          <form onSubmit={handleSubmit} className="mt-5">
            <h1 className="text-center mb-4 block text-2xl font-semibold text-gray-800 darkTextWhite">
              Update Password
            </h1>

            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="newPassword"
                  className="block text-sm mb-2 darkTextWhite"
                >
                  New password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm darkBgBlue darkBorderGray darkTextGray"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm mb-2 darkTextWhite"
                >
                  Confirm password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm darkBgBlue darkBorderGray darkTextGray"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </button>
              </div>
            </div>
            <LoadingButtonClick isLoading={isLoading} />
            <SubmitButton onClick={handleSubmit} text="Save" />
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdatePassword;
