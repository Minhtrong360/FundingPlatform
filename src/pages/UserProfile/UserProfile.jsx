import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
// import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import InputField from "../../components/InputField";

import apiService from "../../app/apiService";
import LoadingButtonClick from "../../components/LoadingButtonClick";

import industries from "../../components/Industries";
import countries from "../../components/Country";
import MultiSelectField from "../../components/MultiSelectField";
import SelectField from "../../components/SelectField";

import { Avatar, Tooltip, message } from "antd";
import { IconButton } from "@mui/material";

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
    roll: "Founder",
    avatar: null,
    interested_in: ["Technology"],
    investment_size: ["$0-$10,000"],
    country: "US",
    subscription_status: "",
    type: "Individual", // Default value for type
    revenueStatusWanted: "Pre-revenue",
    notification_count: 0,
  });
  const handleIndustryChange = (selectedItems) => {
    setUserData({
      ...userData,
      interested_in: selectedItems,
    });
  };

  const handleInvestmentChange = (selectedItems) => {
    setUserData({
      ...userData,
      investment_size: selectedItems,
    });
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        setIsLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setUserData({
            full_name: data.full_name || "",
            email: data.email || "",
            plan: data.plan || "Free",
            subscribe: data.subscribe || "",
            company: data.company || "",
            company_website: data.company_website || "",
            detail: data.detail || "",
            roll: data.roll || "Founder",
            avatar: data.avatar || null,
            interested_in: data.interested_in || ["Technology"],
            investment_size: data.investment_size || ["$0-$10,000"],
            country: data.country || "US",
            type: data.type || "Individual", // Default value for type
            subscription_status: data.subscription_status || "",
            revenueStatusWanted: data.revenueStatusWanted || "Pre-revenue",
            notification_count: data.notification_count || 0,
            subscription_id: data.subscription_id || "",
          });

          if (data.subscribe && data.subscription_status === "active") {
            const subscribeDate = new Date(data.subscribe);
            setExpiredDate(subscribeDate.toISOString().split("T")[0]);
          } else if (user.created_at) {
            const createdDate = new Date(user.created_at);
            setExpiredDate(createdDate.toISOString().split("T")[0]);
          }
        }
      } catch (error) {
        message.error(error.message);
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    }

    fetchUserData();
  }, [user.id, user.created_at]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const dataURItoFile = (dataURI, fileNamePrefix) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const extension = dataURI.split(",")[0].split("/")[1].split(";")[0]; // Lấy phần mở rộng của tệp từ data URI
    const fileName = `${fileNamePrefix}-${Date.now()}.${extension}`; // Tạo tên tệp duy nhất với ngày giờ hiện tại và phần mở rộng
    const blob = new Blob([ab], { type: `image/${extension}` });
    return new File([blob], fileName, { type: `image/${extension}` });
  };

  const uploadImageToSupabase = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("beekrowd_storage") // Chọn bucket
        .upload(`beekrowd_images/${file.name}`, file); // Lưu ảnh vào folder beekrowd_images

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Trả về liên kết ảnh từ Supabase
      // Lấy URL của ảnh đã lưu

      const imageUrl = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      let avatarUrl = userData.avatar;
      if (avatarUrl && avatarUrl.startsWith("data:image")) {
        const file = dataURItoFile(avatarUrl, "img");
        const uploadedAvatarUrl = await uploadImageToSupabase(file);
        if (uploadedAvatarUrl) {
          avatarUrl = uploadedAvatarUrl;
        }
      }

      // Find all companies with revenueStatus matching userData.revenueStatusWanted
      const { data: companies, error: companyError } = await supabase
        .from("company")
        .select("*")
        .eq("revenueStatus", userData.revenueStatusWanted);

      if (companyError) {
        throw companyError;
      }

      // Define conditions for filtering companies
      const industryCondition = userData.interested_in;
      const investmentSizeCondition = userData.investment_size.map((size) => {
        const min = parseInt(
          size.split("-")[0].replace("$", "").replace(/,/g, "")
        );
        const max = parseInt(
          size.split("-")[1].replace("$", "").replace(/,/g, "")
        );
        return { min, max };
      });

      // Filter companies by industry and investment size
      const filteredCompanies = companies.filter(
        (company) =>
          company.industry.some((industry) =>
            industryCondition.includes(industry)
          ) &&
          investmentSizeCondition.some(
            (size) =>
              company.ticket_size >= size.min && company.ticket_size <= size.max
          )
      );

      // Check if the user has already been notified about these companies
      const notifications = await supabase
        .from("notifications")
        .select("*")
        .eq("receivedUser", userData.email);

      const notifiedCompanies = notifications.data.map(
        (notification) => notification.content
      );

      // Filter out companies that have already been notified
      const newCompanies = filteredCompanies.filter(
        (company) => !notifiedCompanies.includes(company.name)
      );

      // Prepare notification content with array of companies
      const notificationContent = newCompanies.map((company) => ({
        id: company.id,
        name: company.name,
        project_id: company.project_id,
      }));

      if (notificationContent.length > 0) {
        // Add new notifications for the user
        const notificationsToInsert = [
          {
            receivedUser: userData.email,
            content: JSON.stringify(notificationContent), // Convert content to JSON string
          },
        ];

        // Insert new notifications into the notifications table
        await supabase.from("notifications").insert(notificationsToInsert);

        const currentNotificationCount = userData.notification_count + 1;

        // Update user data in Supabase
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
            roll: userData.roll,
            avatar: avatarUrl,
            interested_in: userData.interested_in,
            investment_size: userData.investment_size,
            country: userData.country,
            type: userData.type,
            revenueStatusWanted: userData.revenueStatusWanted,
            notification_count: currentNotificationCount,
          })
          .eq("id", user.id);

        if (error) {
          throw error;
        }

        message.success("Updated successfully!");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error updating user data:", error);
    }
    setIsLoading(false);
  };

  const handleRollChange = (e) => {
    const { value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      roll: value,
    }));
  };

  const handleBilling = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      setIsLoading(true);

      if (!userData.subscription_id) {
        throw Error("User does not subscribe.");
      }
      const response = await apiService.post("/request/customers", {
        subscription_id: userData.subscription_id,
      });

      window.open(response.data.data.urls.customer_portal, "_blank");
    } catch (error) {
      console.log("error", error);
      message.warning("User does not subscribe.");
    }
    setIsLoading(false);
  };

  const investment_size = [
    "$0-$10,000",
    "$10,000-$50,000",
    "$50,000-$200,000",
    "$200,000-$500,000",
    "Greater than $500,000",
  ];

  const [avatarUrl, setAvatarUrl] = useState(userData.avatar); // State to store project image URL
  useEffect(() => {
    setAvatarUrl(userData.avatar);
  }, [userData.avatar]);
  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target.result); // Set the project image URL in state
    };
    reader.readAsDataURL(file); // Read the uploaded file
    // Update formData with the project image URL
  };

  useEffect(() => {
    handleInputChange({
      target: { name: "avatar", value: avatarUrl },
    });
  }, [avatarUrl]);

  return (
    <div className="max-w-[85rem] px-3 py-20 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <AlertMsg />
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800 sm:text-4xl darkTextWhite">
            User info settings
          </h1>
          <p className="mt-1 text-gray-600 darkTextGray">
            Tell us your basic information.
          </p>
          <div className="flex flex-col items-center justify-center mt-4">
            <input
              type="file"
              onChange={handleProjectImageUpload}
              id="upload"
              accept="image/*"
              style={{ display: "none" }}
            />
            <label htmlFor="upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <Avatar
                  id="avatar"
                  src={avatarUrl}
                  style={{
                    width: "150px",
                    height: "150px",
                  }}
                />
              </IconButton>
            </label>
            <label htmlFor="avatar" />
          </div>
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
                  type="text"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="roll"
                  className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
                >
                  Role
                </label>
                <select
                  id="roll"
                  name="roll"
                  value={userData.roll}
                  onChange={handleRollChange}
                  className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                >
                  <option value="Founder">Founder</option>
                  <option value="Investor">Investor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {userData.roll === "Investor" && (
                <>
                  <MultiSelectField
                    label="Interested in"
                    id="industry"
                    name="industry"
                    OPTIONS={industries}
                    selectedItems={userData.interested_in}
                    setSelectedItems={handleIndustryChange}
                    required
                  />

                  <MultiSelectField
                    label="Investment size"
                    id="investment_size"
                    name="investment_size"
                    OPTIONS={investment_size}
                    selectedItems={userData.investment_size}
                    setSelectedItems={handleInvestmentChange}
                    required
                  />
                  <SelectField
                    label="Country"
                    id="country"
                    name="country"
                    value={userData.country}
                    onChange={handleInputChange}
                    required
                    options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                  />

                  <SelectField
                    label="Which company do you like?"
                    id="revenueStatusWanted"
                    name="revenueStatusWanted"
                    value={userData.revenueStatusWanted}
                    onChange={handleInputChange}
                    required
                    options={["Pre-revenue", "Post-revenue"]} // Thay thế bằng danh sách các tùy chọn bạn muốn
                  />
                  <div>
                    <label
                      htmlFor="type"
                      className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
                    >
                      Type
                    </label>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="individual"
                        name="type"
                        value="Individual"
                        checked={userData.type === "Individual"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="individual" className="mr-4 text-sm">
                        Individual
                      </label>
                      <input
                        type="radio"
                        id="institutional"
                        name="type"
                        value="Institutional"
                        checked={userData.type === "Institutional"}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label htmlFor="institutional" className="text-sm">
                        Institutional
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <Tooltip
                  title={
                    <div>
                      <p className="m-3 text-base">
                        You can manage your subscription here!
                      </p>
                      <button
                        type="button"
                        onClick={handleBilling}
                        className="w-full py-2 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
                      >
                        Billing Portal
                      </button>
                    </div>
                  }
                  color="gray"
                  zIndex={20000}
                >
                  <div>
                    <InputField
                      label="Plan"
                      id="plan"
                      name="plan"
                      value={
                        userData.plan &&
                        userData.subscription_status === "active"
                          ? userData.plan
                          : "Free"
                      }
                      type="text"
                      disabled
                    />
                    <button
                      type="button"
                      onClick={handleBilling}
                      className="hidden w-full py-3 px-4 my-2 justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
                    >
                      Billing Portal
                    </button>
                  </div>
                </Tooltip>

                <div>
                  <InputField
                    label="Subscribe date"
                    id="subscribe"
                    name="subscribe"
                    value={expiredDate}
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
                  className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
                >
                  Details
                </label>
                <textarea
                  id="hs-about-hire-us-2"
                  name="detail"
                  rows="4"
                  className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                  value={userData.detail}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <LoadingButtonClick isLoading={isLoading} />
            <div className="grid grid-cols-1  gap-4 lg:gap-6 mt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserInfoSettings;
