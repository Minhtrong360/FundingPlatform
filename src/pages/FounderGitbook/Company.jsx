import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";

import countries from "../../components/Country";
import AlertMsg from "../../components/AlertMsg";
import industries from "../../components/Industries";
import MultiSelectField from "../../components/MultiSelectField";
import { useEffect, useState } from "react";

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

  return (
    <>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <AlertMsg />
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800 sm:text-4xl darkTextWhite">
              Company Info
            </h1>
            <p className="mt-1 text-gray-600 darkTextGray">
              This will be an amazing journey.
            </p>
          </div>

          <div className="mt-12">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 lg:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <InputField
                    label="Company name"
                    id="company-name"
                    name="companyName"
                    value={formData.companyName}
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
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange}
                    type="number"
                    required
                  />
                  <SelectField
                    label="Type offering"
                    id="type-offering"
                    name="typeOffering"
                    options={typeOfferingOptions}
                    value={formData.typeOffering}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <InputField
                    label="Min ticket size"
                    id="min-ticket-size"
                    name="minTicketSize"
                    value={formData.minTicketSize}
                    onChange={handleInputChange}
                    type="number"
                    required
                  />
                  <InputField
                    label="No. ticket"
                    id="no-ticket"
                    name="noTicket"
                    value={formData.noTicket}
                    type="number"
                    readOnly // Đặt readOnly để ngăn người dùng chỉnh sửa trường này thủ công
                  />
                </div>

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
                  label="Offer"
                  id="offer"
                  name="offer"
                  value={formData.offer}
                  onChange={handleInputChange}
                  type="text"
                  required
                />
                <div>
                  <InputField
                    label="Profile image url (>700*800 recommended)"
                    id="project_url"
                    name="project_url"
                    value={formData.project_url}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />
                  {/* Add file input for project image */}
                  <span className="py-1 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60">
                    Or you can:{" "}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                    className="py-1 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60"
                  />
                </div>

                <div>
                  <InputField
                    label="Company card url (>716*384 recommended)"
                    id="card_url"
                    name="card_url"
                    value={formData.card_url}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />
                  <span className="py-1 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60">
                    Or you can:{" "}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCardImageUpload}
                    className="py-1 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-60"
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

                <TextAreaField
                  label="Company description"
                  id="company-description"
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mt-6 grid">
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Company;
