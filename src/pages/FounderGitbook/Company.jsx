import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";
import countries from "../../components/Country";
import industries from "../../components/Industries";
import MultiSelectField from "../../components/MultiSelectField";
import { useEffect, useState } from "react";
import { formatNumber } from "../../features/CostSlice";
import { message } from "antd";

function Company({
  handleSubmit,
  formData,
  handleInputChange,
  handleIndustryChange,
  typeOfferingOptions,
}) {
  const [projectImageUrl, setProjectImageUrl] = useState(formData.project_url);
  const [cardImageUrl, setCardImageUrl] = useState(formData.card_url);

  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      message.warning("File size exceeds the maximum allowed size: 2MB.");
      event.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setProjectImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    handleInputChange({
      target: { name: "project_url", value: projectImageUrl },
    });
  }, [projectImageUrl]);

  useEffect(() => {
    setProjectImageUrl(formData.project_url);
  }, [formData.project_url]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleCardImageUpload = (event) => {
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      message.warning("File size exceeds the maximum allowed size: 2MB.");
      event.target.value = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setCardImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
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
    const generateYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = 1900;
      const yearsArray = [];
      for (let year = startYear; year <= currentYear; year++) {
        yearsArray.push(year.toString());
      }
      return yearsArray;
    };
    const yearsList = generateYears();
    setYears(yearsList);
  }, []);

  return (
    <div className="h-5/6">
      <div className="shadow-xl rounded-md border h-5/6 mt-4 overflow-auto sticky ml-4 mr-4 md:ml-0 md:mr-0 mb-2">
        <div className="max-w-xl mx-auto h-screen">
          <div className="max-w-[85rem] px-4 py-8 mx-auto">
            <div className="max-w-xl mx-auto">
              <div className="text-left">
                <p className="mt-1 text-gray-800 font-semibold darkTextGray">
                  Please fill basic information below.
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
                        options={countries}
                      />
                    </div>

                    <div className="grid gap-4 lg:gap-6">
                      <SelectField
                        label="Do you want to raise funds?"
                        id="showAdditionalFields"
                        name="showAdditionalFields"
                        value={formData.showAdditionalFields}
                        onChange={(event) =>
                          handleInputChange({
                            target: {
                              name: "showAdditionalFields",
                              value: event.target.value,
                            },
                          })
                        }
                        options={["Yes", "No"]}
                        required
                      />

                      {formData.showAdditionalFields === "Yes" && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            <InputField
                              label="Target amount"
                              id="target-amount"
                              name="target_amount"
                              value={formatNumber(formData.target_amount)}
                              onChange={handleInputChange}
                              type="text"
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
                              value={formatNumber(formData.ticket_size)}
                              onChange={handleInputChange}
                              type="text"
                              required
                            />
                            <InputField
                              label="No. ticket"
                              id="no-ticket"
                              name="no_ticket"
                              value={formData.no_ticket}
                              type="number"
                              readOnly
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
                              "Non-Profit",
                            ]}
                          />

                          <InputField
                            label="Keywords"
                            title="Keywords should be separated by comma (,)"
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

                          <InputField
                            label="Website"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            type="text"
                            required
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            <SelectField
                              label="Team size"
                              id="teamSize"
                              name="teamSize"
                              value={formData.teamSize}
                              onChange={handleInputChange}
                              type="text"
                              options={[
                                "1-10",
                                "11-50",
                                "51-200",
                                "201-500",
                                ">500",
                              ]}
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
                              "Non-Profit",
                            ]}
                            value={formData.round}
                            onChange={handleInputChange}
                            type="text"
                          />
                        </>
                      )}
                      <div>
                        <InputField
                          label="Company logo"
                          id="project_url"
                          name="project_url"
                          value={
                            formData.project_url.length > 30
                              ? formData.project_url.substring(0, 30) + "..."
                              : formData.project_url
                          }
                          onChange={handleInputChange}
                          type="text"
                          required
                        />
                        <span className="py-1 px-2 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "></span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProjectImageUpload}
                          className="py-1 px-2 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
                        />
                      </div>
                      <div>
                        <InputField
                          label="Profile Image link"
                          id="card_url"
                          name="card_url"
                          value={
                            formData.card_url.length > 30
                              ? formData.card_url.substring(0, 30) + "..."
                              : formData.card_url
                          }
                          onChange={handleInputChange}
                          type="text"
                          required
                        />
                        <span className="py-1 px-2 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "></span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCardImageUpload}
                          className="py-1 px-2 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
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
                        label="Calendly"
                        id="calendly"
                        name="calendly"
                        value={formData.calendly}
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
                        maxLength={700}
                      />
                    </div>
                  </div>
                  <div className="mt-6 grid"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="shadow-lg w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none   mt-2"
      >
        Submit
      </button>
    </div>
  );
}

export default Company;
