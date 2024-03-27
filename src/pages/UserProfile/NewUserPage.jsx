import { CardContent } from "@mui/material";
import { Avatar, Card, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import InputField from "../../components/InputField";

import apiService from "../../app/apiService";
import LoadingButtonClick from "../../components/LoadingButtonClick";

import industries from "../../components/Industries";
import countries from "../../components/Country";
import MultiSelectField from "../../components/MultiSelectField";
import SelectField from "../../components/SelectField";

import { IconButton } from "@mui/material";

function NewUserPage() {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

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
    facebook: "",
    twitter: "",
    linkedin: "",
    next_billing_date: "",
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
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            next_billing_date: data.next_billing_date || "",
          });
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
            facebook: userData.facebook,
            twitter: userData.twitter,
            linkedin: userData.linkedin,
            next_billing_date: userData.next_billing_date,
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

  const [currentTab, setCurrentTab] = useState("user-info");

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick />
      ) : (
        <div className="flex-row justify-center sm:flex py-10 min-h-screen">
          <div className="flex flex-col space-y-6">
            <Card className="sm:w-[350px] w-full sm:mb-0 mb-10">
              <CardContent className="flex flex-col items-center text-center">
                <h3 className="mt-4 font-semibold text-lg">
                  {userData.full_name}
                </h3>

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
                <p className="mt-4 text-sm text-gray-500">
                  Upload a new avatar. Larger image will be resized
                  automatically.
                </p>
                {/* <p className="text-sm text-gray-500">Maximum upload size is 1 MB</p> */}
                <p className="mt-4 text-sm text-gray-500">
                  Member Since:{" "}
                  {new Date(user.created_at).toISOString().split("T")[0]}
                </p>
              </CardContent>
            </Card>
          </div>

          <form onSubmit={handleSubmit} className="sm:ml-10">
            <div className="flex flex-col w-full max-w-4xl space-y-4 sm:ml-0">
              <h2 className="text-2xl font-semibold">User Profile</h2>

              <ul className="py-4 flex  justify-start items-center border-y-2">
                <li
                  className={`cursor-pointer mr-4 ${
                    currentTab === "user-info"
                      ? "border-b-2 border-black font-bold"
                      : ""
                  }`}
                  onClick={() => setCurrentTab("user-info")}
                >
                  User info
                </li>
                <li
                  className={`cursor-pointer mr-4 ${
                    currentTab === "billing"
                      ? "border-b-2 border-black font-bold"
                      : ""
                  }`}
                  onClick={() => setCurrentTab("billing")}
                >
                  Billing Information
                </li>
              </ul>

              {currentTab === "user-info" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="mt-4">
                        <InputField
                          label="Full name"
                          id="full_name"
                          name="full_name"
                          value={userData.full_name}
                          onChange={handleInputChange}
                          type="text"
                        />
                      </div>
                      <div className="mt-4">
                        <InputField
                          label="Email"
                          id="email"
                          name="email"
                          value={userData.email}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="mt-4">
                        <SelectField
                          label="Country"
                          id="country"
                          name="country"
                          value={userData.country}
                          onChange={handleInputChange}
                          required
                          options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="mt-4">
                        <InputField
                          label="Company"
                          id="company"
                          name="company"
                          value={userData.company}
                          onChange={handleInputChange}
                          type="text"
                        />
                      </div>
                      <div className="mt-4">
                        <InputField
                          label="Company website"
                          id="company_website"
                          name="company_website"
                          value={userData.company_website}
                          onChange={handleInputChange}
                          type="text"
                        />
                      </div>
                      <div className="mt-4">
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
                    </div>
                  </div>

                  {userData.roll === "Investor" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <div className="mt-4">
                          <MultiSelectField
                            label="Interested in"
                            id="industry"
                            name="industry"
                            OPTIONS={industries}
                            selectedItems={userData.interested_in}
                            setSelectedItems={handleIndustryChange}
                            required
                          />
                        </div>
                        <div className="mt-4">
                          <MultiSelectField
                            label="Investment size"
                            id="investment_size"
                            name="investment_size"
                            OPTIONS={investment_size}
                            selectedItems={userData.investment_size}
                            setSelectedItems={handleInvestmentChange}
                            required
                          />
                        </div>
                        <div className="mt-4">
                          <SelectField
                            label="Country"
                            id="country"
                            name="country"
                            value={userData.country}
                            onChange={handleInputChange}
                            required
                            options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="mt-4">
                          <SelectField
                            label="Which company do you like?"
                            id="revenueStatusWanted"
                            name="revenueStatusWanted"
                            value={userData.revenueStatusWanted}
                            onChange={handleInputChange}
                            required
                            options={["Pre-revenue", "Post-revenue"]} // Thay thế bằng danh sách các tùy chọn bạn muốn
                          />
                        </div>
                        <div className="mt-4">
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
                            <label
                              htmlFor="individual"
                              className="mr-4 text-sm"
                            >
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
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-sm">Social Profile</h3>
                    <div className="flex items-center mt-2">
                      <FacebookIcon />
                      <input
                        id="facebook"
                        name="facebook"
                        value={userData.facebook}
                        onChange={handleInputChange}
                        className="ml-4 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <TwitterIcon />
                      <input
                        id="twitter"
                        name="twitter"
                        value={userData.twitter}
                        onChange={handleInputChange}
                        className="ml-4 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                      />
                    </div>
                    <div className="flex items-center mt-4">
                      <LinkedinIcon />
                      <input
                        id="linkedin"
                        name="linkedin"
                        value={userData.linkedin}
                        onChange={handleInputChange}
                        className="ml-4 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:gap-6 mt-6">
                    <button
                      type="submit"
                      className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600 ${
                        isLoading ? "bg-gray-500 disabled" : ""
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}

              {currentTab === "billing" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <div className="mt-4">
                        <InputField
                          label="Plan"
                          id="plan"
                          name="plan"
                          value={userData.plan}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="mt-4">
                        <InputField
                          label="Subscription status"
                          id="subscription_status"
                          name="subscription_status"
                          value={userData.subscription_status}
                          type="text"
                          disabled
                        />
                      </div>
                      <div style={{ visibility: "hidden" }}>
                        <SelectField
                          options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Tooltip title="YYYY-MM-DD">
                        <div className="mt-4">
                          <InputField
                            label="Subscribe date"
                            id="subscribe"
                            name="subscribe"
                            value={
                              new Date(userData.subscribe)
                                .toISOString()
                                .split("T")[0]
                            }
                            type="text"
                            disabled
                          />
                        </div>
                      </Tooltip>

                      <Tooltip title="YYYY-MM-DD">
                        <div className="mt-4">
                          <InputField
                            label="Next billing date"
                            id="next_billing_date"
                            name="next_billing_date"
                            value={
                              new Date(userData.next_billing_date)
                                .toISOString()
                                .split("T")[0]
                            }
                            type="text"
                            disabled
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:gap-6 mt-6">
                    <button
                      type="button"
                      className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600 ${
                        isLoading ? "bg-gray-500 disabled" : ""
                      }`}
                      onClick={handleBilling}
                    >
                      Billing Portal
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export function FacebookIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="48"
      height="48"
      viewBox="0 0 48 48"
    >
      <linearGradient
        id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
        x1="9.993"
        x2="40.615"
        y1="9.993"
        y2="40.615"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#2aa4f4"></stop>
        <stop offset="1" stopColor="#007ad9"></stop>
      </linearGradient>
      <path
        fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
        d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
      ></path>
      <path
        fill="#fff"
        d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
      ></path>
    </svg>
  );
}

export function TwitterIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="48"
      height="48"
      viewBox="0 0 48 48"
    >
      <polygon
        fill="#616161"
        points="41,6 9.929,42 6.215,42 37.287,6"
      ></polygon>
      <polygon
        fill="#fff"
        fillRule="evenodd"
        points="31.143,41 7.82,7 16.777,7 40.1,41"
        clipRule="evenodd"
      ></polygon>
      <path
        fill="#616161"
        d="M15.724,9l20.578,30h-4.106L11.618,9H15.724 M17.304,6H5.922l24.694,36h11.382L17.304,6L17.304,6z"
      ></path>
    </svg>
  );
}

export function LinkedinIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="48"
      height="48"
      viewBox="0 0 48 48"
    >
      <path
        fill="#0288D1"
        d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
      ></path>
      <path
        fill="#FFF"
        d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
      ></path>
    </svg>
  );
}

export default NewUserPage;
