import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";

import countries from "../../components/Country";
import AlertMsg from "../../components/AlertMsg";
import industries from "../../components/Industries";
import MultiSelectField from "../../components/MultiSelectField";
import { useEffect, useState } from "react";
import { formatNumber } from "../../features/CostSlice";
import { Tooltip } from "antd";

function Company({
  handleSubmit,
  formData,
  handleInputChange,
  handleIndustryChange,
  typeOfferingOptions,
}) {
  const [projectImageUrl, setProjectImageUrl] = useState(formData.project_url); // State to store project image URL
  const [cardImageUrl, setCardImageUrl] = useState(formData.card_url); // State to store card image URL

  // Function to handle project image file upload
  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setProjectImageUrl(e.target.result); // Set the project image URL in state
    };
    reader.readAsDataURL(file); // Read the uploaded file
    // Update formData with the project image URL
  };

  useEffect(() => {
    handleInputChange({
      target: { name: "project_url", value: projectImageUrl },
    });
  }, [projectImageUrl]);
  useEffect(() => {
    setProjectImageUrl(formData.project_url);
  }, [formData.project_url]);

  // Function to handle card image file upload
  const handleCardImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCardImageUrl(e.target.result); // Set the card image URL in state
    };
    reader.readAsDataURL(file); // Read the uploaded file
    // Update formData with the card image URL
  };
  useEffect(() => {
    handleInputChange({
      target: { name: "card_url", value: cardImageUrl },
    });
  }, [cardImageUrl]);
  useEffect(() => {
    setCardImageUrl(formData.card_url);
  }, [formData.card_url]);

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
      <div className="max-w-xl mx-auto overflow-auto h-screen">
        <div className="max-w-[85rem] px-4 py-8 mx-auto ">
          <AlertMsg />

          <div className="max-w-xl mx-auto">
            <div className="text-left">
              <p className="mt-1 text-gray-800 font-semibold darkTextGray">
                Please fill basic information about your company.
              </p>
            </div>

            <div className="mt-12">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 lg:gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Company name"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      required
                    />
                    <SelectField
                      label="Country"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Target amount"
                      id="target-amount"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                    <SelectField
                      label="Type offering"
                      id="type-offering"
                      name="offer_type"
                      options={typeOfferingOptions}
                      value={formData.offer_type}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Min ticket size"
                      id="min-ticket-size"
                      name="ticket_size"
                      value={formData.ticket_size}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                    <InputField
                      label="No. ticket"
                      id="no-ticket"
                      name="no_ticket"
                      value={formData.no_ticket}
                      type="number"
                      readOnly // Đặt readOnly để ngăn người dùng chỉnh sửa trường này thủ công
                    />
                  </div>

                  <SelectField
                    label="Annual revenue last year"
                    id="revenueStatus"
                    name="revenueStatus"
                    value={formData.revenueStatus}
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
                    ]}
                  />

                  <MultiSelectField
                    label="Industry"
                    id="industry"
                    name="industry"
                    OPTIONS={industries}
                    selectedItems={formData.industry}
                    setSelectedItems={handleIndustryChange}
                    required
                  />

                  <InputField
                    label="Key words"
                    title="Key words should be separated by comma (,)"
                    id="keyWords"
                    name="keyWords"
                    value={formData.keyWords}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />

                  <InputField
                    label="Offer"
                    id="offer"
                    name="offer"
                    value={formData.offer}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />
                  {/* <div> */}
                  {/* <InputField
                      label="Profile Image link"
                      id="project_url"
                      name="project_url"
                      value={formData.project_url}
                      onChange={handleInputChange}
                      type="text"
                      required
                    /> */}
                  {/* Add file input for project image */}
                  {/* <span className="py-1 px-2 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60">
                      {" "}
                    </span> */}
                  {/* <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="py-1 px-2 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60"
                    /> */}
                  {/* </div> */}

                  <div>
                    <InputField
                      label="Card Image link"
                      id="card_url"
                      name="card_url"
                      value={formData.card_url}
                      onChange={handleInputChange}
                      type="text"
                      required
                    />
                    <span className="py-1 px-2 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60">
                      {" "}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCardImageUpload}
                      className="py-1 px-2 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60"
                    />
                    {/* Display the card image */}
                  </div>

                  <InputField
                    label="Website"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />

                  <InputField
                    label="Calendly"
                    id="calendly"
                    name="calendly"
                    value={formData.calendly}
                    onChange={handleInputChange}
                    type="text"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <SelectField
                      label="Team size"
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      type="text"
                      options={["1-10", "11-50", "51-200", "201-500", ">500"]}
                      required
                    />

                    <InputField
                      label="Raised before"
                      id="amountRaised"
                      name="amountRaised"
                      value={formatNumber(formData.amountRaised)}
                      onChange={handleInputChange}
                      type="text"
                      required
                    />
                  </div>

                  <SelectField
                    label="Founded year"
                    id="operationTime"
                    name="operationTime"
                    value={formData.operationTime}
                    onChange={handleInputChange}
                    options={years}
                    type="text"
                  />
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
                    ]}
                    value={formData.round}
                    onChange={handleInputChange}
                    type="text"
                  />

                  <TextAreaField
                    label="Company description"
                    id="company-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    maxLength={700} // Giới hạn 700 ký tự
                  />
                </div>

                <div className="mt-6 grid">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Company;
