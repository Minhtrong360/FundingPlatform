import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import SpinnerBtn from "../../components/SpinnerBtn";
import InputField from "../../components/InputField";

import apiService from "../../app/apiService";
import LoadingButtonClick from "../../components/LoadingButtonClick";

function UserInfoSettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [expiredDate, setExpiredDate] = useState("");
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    plan: "",
    subscribe: "",
    company: "",
    company_website: "",
    detail: "",
  });
  useEffect(() => {
    // Tạo một async function để lấy thông tin người dùng từ Supabase
    async function fetchUserData() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          toast.error("No internet access.");
          return;
        }
        setIsLoading(true);
        // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id) // Thay "id" bằng trường id thực tế trong cơ sở dữ liệu của bạn
          .single(); // Sử dụng .single() để lấy một bản ghi duy nhất

        if (error) {
          throw error;
        }

        // Cập nhật state userData với thông tin người dùng đã lấy được
        if (data) {
          setUserData(data);
          if (data.subscribe && data.subscription_status === "active") {
            const subscribeDate = new Date(data.subscribe * 1000);
            setExpiredDate(subscribeDate.toISOString().split("T")[0]);
          } else if (user.created_at) {
            // Kiểm tra nếu có user.created_at
            const createdDate = new Date(user.created_at);
            setExpiredDate(createdDate.toISOString().split("T")[0]);
          }
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    }

    // Gọi hàm fetchUserData khi component được mount
    fetchUserData();
  }, [user.id]); // Sử dụng user.id làm phần tử phụ thuộc để useEffect được gọi lại khi user.id thay đổi

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu xử lý, đặt isLoading thành true
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }
      // Thực hiện cập nhật thông tin người dùng vào cơ sở dữ liệu Supabase
      const { error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          email: userData.email,
          plan: userData.plan,
          subscribe: userData.subscribe,
          company: userData.company,
          company_website: userData.company_website,
          detail: userData.detail,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast.success("Updated successfully!");
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating user data:", error);
    }
    setIsLoading(false);
  };

  const handleBilling = async (plan, userId) => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }
      setIsLoading(true);
      // Khi xử lý form submit

      const checkoutSessionResponse = await apiService.post(
        "stripe/create-portal-session",
        { customerId: userData.customer_id }
      );

      const session = checkoutSessionResponse.data.data.session;

      // const userEmail = encodeURIComponent(user.email); // Encode email để đảm bảo nó an toàn trong URL
      // const updatedURL = `${session.url}?prefilled_email=${userEmail}`;

      window.open(session.url, "_blank");
    } catch (error) {
      toast.error("User does not subscribe");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <AlertMsg />
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            User info settings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Tell us your basic information.
          </p>
        </div>

        <div className="mt-12">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:gap-6">
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <div>
                  <InputField
                    label="Full name"
                    id="full_name"
                    name="full_name"
                    value={userData.full_name}
                    onChange={handleInputChange}
                    type="text"
                  />
                </div>
              </div>

              <div>
                <InputField
                  label="Email"
                  id="email"
                  name="email"
                  value={userData.email}
                  // onChange={handleInputChange}
                  type="text"
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <InputField
                    label="Plan"
                    id="plan"
                    name="plan"
                    value={
                      userData.plan && userData.subscription_status === "active"
                        ? userData.plan
                        : "Free"
                    }
                    // onChange={handleInputChange}
                    type="text"
                    disabled
                  />
                </div>

                <div>
                  <InputField
                    label="Subscribe date"
                    id="subscribe"
                    name="subscribe"
                    value={expiredDate}
                    // onChange={handleInputChange}
                    type="date"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <InputField
                    label="Company"
                    id="company"
                    name="company"
                    value={userData.company}
                    onChange={handleInputChange}
                    type="text"
                  />
                </div>

                <div>
                  <InputField
                    label="Company website"
                    id="company_website"
                    name="company_website"
                    value={userData.company_website}
                    onChange={handleInputChange}
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="hs-about-hire-us-2"
                  className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >
                  Details
                </label>
                <textarea
                  id="hs-about-hire-us-2"
                  name="detail"
                  rows="4"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                  value={userData.detail}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <LoadingButtonClick isLoading={isLoading} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleBilling}
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
              >
                Billing Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserInfoSettings;
