import { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router";

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
      />
    </div>
  );
};

const SubmitButton = ({ text, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
    >
      {text}
    </button>
  );
};

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("confirm 0");
    if (newPassword === confirmPassword) {
      console.log("confirm 1");
      console.log("supabase", supabase);
      try {
        const { data, error } = supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.log("confirm 2");
          console.log("error supabase", error);
          setErrorMessage("An error occurred while updating the password.");
        } else {
          console.log("confirm 3");
          console.log("data", data);
          setSuccessMessage("Password updated successfully.");
          navigate("/login");
        }
      } catch (error) {
        console.log("confirm 4");
        console.log("error", error);
        setErrorMessage("An error occurred while updating the password.");
      }
    } else {
      console.log("failed");
      setErrorMessage("Passwords do not match.");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <div className="p-4 sm:p-7">
          <form onSubmit={handleSubmit} className="mt-5">
            <h1 className="text-center mb-4 block text-2xl font-bold text-gray-800 dark:text-white">
              Update Password
            </h1>

            {successMessage && (
              <div className="text-green-500 mb-4">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}

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
              <SubmitButton onClick={handleSubmit} text="Save" />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdatePassword;
