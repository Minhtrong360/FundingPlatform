import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import Footer from "./Footer";

import HeroSection from "./Components/HeroSection";
import Features from "./Components/Features";

import HeroCard from "./Components/HeroCard";
import PricingWithLemon from "./Components/PricingWithLemon";
import { Avatar, Card, Modal, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { CardContent, IconButton } from "@mui/material";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import countries from "../../components/Country";
import MultiSelectField from "../../components/MultiSelectField";
import industries from "../../components/Industries";
import { formatNumber } from "../../features/CostSlice";
import SpinnerBtn from "../../components/SpinnerBtn";
import Header from "./Header";
import FlowiseChat from "../FinalcialPage/FLowiseChat";
import PartnerMarquee from "./Components/PartnerMarquee/";
import BrandSection from "../../components/Section/Home-1/Brand/Brand";
import ContentSectionOne from "../../components/Section/Home-1/Content/ContentOne";
import ContentSectionTwo from "../../components/Section/Home-1/Content/ContentTwo";
import FeatureSection from "../../components/Section/Home-1/Feature/Feature";
import Faq from "../../components/Section/Home-1/Faq/Faq";
import TestimonialSection from "../../components/Section/Common/Testimonial/Testimonial";
import NewsSection from "../../components/Section/Home-1/News/News";
import Cta from "../../components/Section/Common/Cta";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader"
// import BubleChatBot from "./Components/BubleChatBot";

const HomePage = () => {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    // Kiểm tra nếu người dùng chưa có full_name hoặc role
    const checkUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, roll")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (!data.full_name || !data.roll) {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    checkUserData();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState({
    full_name: "",
    plan: "",
    subscribe: "",
    company: "",
    company_website: "",
    detail: "",
    roll: "Founder",
    avatar: null,
    interested_in: ["Technology"],
    investment_size: ["$0-$10,000"],
    country: ["US"],
    subscription_status: "",
    type: "Individual", // Default value for type
    revenueStatusWanted: "$0 - $10k",
    notification_count: 0,
    facebook: "",
    twitter: "",
    linkedin: "",
    next_billing_date: "",
    institutionalName: "",
    institutionalWebsite: "",
    teamSize: "1-10",
    amountRaised: "",
    operationTime: "",
    round: "",
    code: "",
  });
  const handleIndustryChange = (selectedItems) => {
    setUserData({
      ...userData,
      interested_in: selectedItems,
    });
  };
  const handleCountryChange = (selectedItems) => {
    setUserData({
      ...userData,
      country: selectedItems,
    });
  };

  const handleInvestmentChange = (selectedItems) => {
    setUserData({
      ...userData,
      investment_size: selectedItems,
    });
  };
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
        throw new Error("No internet access.");
      }

      if (!userData.full_name) {
        message.warning(`Please full-fill your full name`);
        return;
      }
      if (!userData.roll) {
        message.warning(`Please full-fill your role`);
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

      const { data: companies, error: companyError } = await supabase
        .from("company")
        .select("*")
        .eq("revenueStatus", userData.revenueStatusWanted);

      if (companyError) {
        throw new Error("Error fetching companies: " + companyError.message);
      }
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

      const filteredCompanies = companies.filter(
        (company) =>
          company.industry.some((industry) =>
            industryCondition.includes(industry)
          ) &&
          investmentSizeCondition.some(
            (size) =>
              company.ticket_size >= size.min && company.ticket_size <= size.max
          ) &&
          company.revenueStatus === userData.revenueStatusWanted
      );

      const notifications = await supabase
        .from("notifications")
        .select("*")
        .eq("receivedUser", userData.email);
      const notifiedCompanies = notifications.data.flatMap((notification) =>
        JSON.parse(notification.content)
      );
      const notifiedCompanyNames = notifiedCompanies.map(
        (company) => company.name
      );
      const newCompanies = filteredCompanies.filter(
        (company) => !notifiedCompanyNames.includes(company.name)
      );
      const notificationContent = newCompanies.map((company) => ({
        id: company.id,
        name: company.name,
        project_id: company.project_id,
      }));
      let currentNotificationCount = userData.notification_count;
      if (notificationContent.length > 0) {
        const notificationsToInsert = [
          {
            receivedUser: userData.email,
            content: JSON.stringify(notificationContent),
          },
        ];

        await supabase.from("notifications").insert(notificationsToInsert);
        currentNotificationCount = userData.notification_count + 1;
      }

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
          institutionalName: userData.institutionalName,
          institutionalWebsite: userData.institutionalWebsite,
          teamSize: userData.teamSize,
          amountRaised: userData.amountRaised,
          operationTime: userData.operationTime,
          round: userData.round,
          code: userData.code,
        })
        .eq("id", user.id);

      if (error) {
        throw new Error("Error updating user data: " + error.message);
      }

      message.success("Updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message);
      console.log("Error handling form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollChange = (e) => {
    const { value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      roll: value,
    }));
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

  const [years, setYears] = useState([]);

  useEffect(() => {
    // Hàm để tạo danh sách các năm từ năm bắt đầu đến năm hiện tại
    const generateYears = () => {
      const currentYear = new Date().getFullYear();

      const startYear = 1900; // Bạn có thể thay đổi năm bắt đầu tại đây
      const yearsArray = [];
      for (let year = startYear; year <= currentYear; year++) {
        yearsArray.push(year.toString());
      }
      return yearsArray;
    };

    // Gọi hàm generateYears để tạo danh sách các năm và cập nhật state
    const yearsList = generateYears();
    setYears(yearsList);
  }, []);

  return (
    <>
      {/* <HomeHeader /> */}
      <HomeHeader />
      <FlowiseChat page="Home" />
      {/* {user && <BubleChatBot />} */}
      <HeroSection />
      <BrandSection />
      <ContentSectionOne />
      <ContentSectionTwo />
      <FeatureSection />
      <Faq />
      <TestimonialSection />
      <NewsSection />
      <Cta />

      <Footer />
      {user && (
        <Modal
          title="Please, Complete Your Profile"
          open={isModalOpen}
          onCancel={handleSubmit}
          footer={null}
        >
          <div className="flex-col justify-center">
            <div className="flex flex-col items-center justify-center mb-4 space-y-6">
              <Card className="sm:w-[350px] w-full sm:mb-0 mb-10">
                <CardContent className="flex flex-col items-center text-center">
                  <h3 className="mt-4 text-lg font-semibold">
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

                  {/* <p className="text-sm text-gray-500">Maximum upload size is 1 MB</p> */}
                  <p className="mt-4 text-sm text-gray-800">
                    Member Since:{" "}
                    {new Date(user.created_at).toISOString().split("T")[0]}
                  </p>
                </CardContent>
              </Card>
            </div>

            <span className="text-red-500">
              {" "}
              * is required information. Please full-fill them.
            </span>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col w-full max-w-4xl space-y-4 sm:ml-0">
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <div className="mt-4">
                        <InputField
                          label="Full name *"
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
                          value={user.email}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="roll"
                          className="block mb-2 text-sm text-gray-700 darkTextWhite"
                        >
                          Role <span className="font-semibold">*</span>
                        </label>
                        <select
                          id="roll"
                          name="roll"
                          value={userData.roll}
                          onChange={handleRollChange}
                          className="block w-full px-4 py-3 text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 darkTextGray400 "
                        >
                          <option value="Founder">Founder</option>
                          <option value="Investor">Investor</option>
                          <option value="Other">Other</option>
                        </select>
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

                      <div className="mt-4" style={{ visibility: "hidden" }}>
                        <SelectField
                          label="Country"
                          id="country"
                          name="country"
                          required
                          options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                        />
                      </div>
                    </div>
                  </div>

                  {userData.roll === "Investor" && (
                    <>
                      <div className="text-xs italic text-blue-600">
                        * For better startups matching, please fill in the
                        following information.
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="flex flex-col">
                          <div className="mt-4">
                            <MultiSelectField
                              label="Industry"
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
                              label="Team size"
                              id="teamSize"
                              name="teamSize"
                              value={userData.teamSize}
                              onChange={handleInputChange}
                              type="text"
                              options={[
                                "1-10",
                                "11-50",
                                "51-200",
                                "201-500",
                                ">500",
                              ]}
                            />
                          </div>
                          <div className="mt-4">
                            <SelectField
                              label="Founded year"
                              id="operationTime"
                              name="operationTime"
                              value={userData.operationTime}
                              onChange={handleInputChange}
                              options={years}
                              type="text"
                            />
                          </div>
                          <div className="mt-4">
                            <label
                              htmlFor="type"
                              className="block mb-2 text-sm darkTextWhite"
                            >
                              Type of Organization
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
                              <label
                                htmlFor="institutional"
                                className="text-sm"
                              >
                                Institutional
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="mt-4">
                            <SelectField
                              label="Expected revenue range"
                              id="revenueStatusWanted"
                              name="revenueStatusWanted"
                              value={userData.revenueStatusWanted}
                              onChange={handleInputChange}
                              required
                              options={[
                                "$0 - $10k",
                                "$10k - $50k",
                                "$50k - $100k",
                                "$100k - $500k",
                                "$500k - $1M",
                                "$1M - $5M",
                                ">$5M",
                              ]} // Thay thế bằng danh sách các tùy chọn bạn muốn
                            />
                          </div>
                          <div className="mt-4">
                            <MultiSelectField
                              label="Country"
                              id="country"
                              name="country"
                              selectedItems={userData.country}
                              setSelectedItems={handleCountryChange}
                              required
                              OPTIONS={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                            />
                          </div>
                          <div className="mt-4">
                            <InputField
                              label="Raised before"
                              id="amountRaised"
                              name="amountRaised"
                              value={formatNumber(userData.amountRaised)}
                              onChange={handleInputChange}
                              type="text"
                              required
                            />
                          </div>
                          <div className="mt-4">
                            <SelectField
                              label="Round"
                              id="round"
                              name="round"
                              options={[
                                "Pre-seed",
                                "Seed",
                                "Series A",
                                "Series B",
                                "Series C",
                                "Non-Profit",
                              ]}
                              value={userData.round}
                              onChange={handleInputChange}
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-xs italic text-blue-600">
                    * SPECIAL CODE
                  </div>
                  <div className="mt-4">
                    <InputField
                      label="FundFlow Premium code"
                      id="code"
                      name="code"
                      value={userData.code}
                      onChange={handleInputChange}
                      type="text"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hs-about-hire-us-2"
                      className="block mt-2 mb-2 text-sm font-medium text-gray-700 darkTextWhite"
                    >
                      Tell something about you
                    </label>
                    <textarea
                      id="hs-about-hire-us-2"
                      name="detail"
                      rows="4"
                      className="block w-full px-4 py-3 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none darkTextGray400 "
                      value={userData.detail}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-6 lg:gap-6 ">
                    <button
                      type="submit"
                      className={`w-full sm:w-[30%] py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none   ${
                        isLoading
                          ? "bg-gray-500 hover:bg-gray-500 hover:cursor-not-allowed"
                          : ""
                      }`}
                      style={{ justifySelf: "end" }} // Canh phải
                      disabled={isLoading}
                    >
                      {isLoading ? <SpinnerBtn /> : "Save"}
                    </button>
                  </div>
                </>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};
export default HomePage;
