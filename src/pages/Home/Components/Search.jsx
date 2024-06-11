import React, { useEffect, useState } from "react";

import industries from "../../../components/Industries";
import { Modal, Select } from "antd";
import regions from "../../../components/Regions";

import { PlusCircleOutlined } from "@ant-design/icons";

const Search = ({
  onSearch,
  onIndustryChange,
  companies,
  searchTerm,
  setSearchTerm,

  currentTab,
  setCurrentTab,
  setVisibleItemCount,
  setTargetAmount,
  setRevenueRange,
  setRound,
  setRegion,
  targetAmountArray,
  setCountry,
  selectedCode,
}) => {
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filteredSuggestions = companies.filter((company) =>
        company.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSuggestions([]);
  };

  const handleIndustryClick = (industry) => {
    onIndustryChange(industry);
  };
  const handleTargetAmount = (value) => {
    setTargetAmount(value);
  };
  const handleRevenueRange = (value) => {
    setRevenueRange(value);
  };
  const handleRound = (value) => {
    setRound(value);
  };
  const handleRegion = (value) => {
    setRegion(value);
  };
  // const handleCountry = (value) => {
  //   setCountry(value);
  // };

  const [suggestions, setSuggestions] = useState([]);

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    onSearch(name); // Optional: Trigger the search when a suggestion is clicked
  };

  const { Option } = Select;

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
    } else {
      setSuggestions(companies);
    }
  }, [currentTab, companies, searchTerm]);

  const handleChange = (value) => {
    setVisibleItemCount(6);
    setCurrentTab(value);
  };

  const revenueRange = [
    "$0 - $10k",
    "$10k - $50k",
    "$50k - $100k",
    "$100k - $500k",
    "$500k - $1M",
    "$1M - $5M",
    ">$5M",
    "Non-Profit",
  ];

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTargetAmount("");
    setRevenueRange("");
    setRound("");
    setRegion("");
    setIsOpen(false);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-1 mt-24">
        <div className="text-center">
          <h3
            id="profiles"
            className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray"
          >
            {selectedCode
              ? `Business profiles for ${selectedCode}`
              : "Business profiles"}
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-md  darkBgBlue darkBorderGray darkShadowGray">
                <div className="flex-[1_0_0%]">
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className=" px-4 block w-full h-full border-transparent rounded-md focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                    placeholder="Search profiles"
                    value={searchTerm}
                    onChange={handleSearchChange} // Thêm sự kiện onChange này
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <button
                    type="submit"
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            {suggestions.length > 0 && (
              <ul className=" mt-2 top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
                {suggestions.map((company, index) => (
                  <li
                    key={index}
                    className="text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(company.name)}
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4  flex flex-wrap justify-center sm:gap-5 gap-2">
            <Select
              className="m-1 w-40 text-center my-2 min-h-[40px]"
              value={currentTab}
              onChange={handleChange}
            >
              <Option value="All">All profiles</Option>
              <Option value="verified">Verified profiles</Option>
              <Option value="unverified">Unverified profiles</Option>
            </Select>

            <Select
              className="m-1 w-40 my-2 min-h-[40px]"
              defaultValue=""
              onChange={handleIndustryClick}
              optionLabelProp="label"
            >
              <Option value="" label="All industries">
                All industries
              </Option>
              {industries.map((industry, index) => (
                <Option key={index} value={industry} label={industry}>
                  {industry}
                </Option>
              ))}
            </Select>

            <div className="lg:flex hidden  flex-wrap justify-center sm:gap-5 gap-2">
              <Select
                className="m-1 w-40 my-2 min-h-[40px]"
                defaultValue=""
                onChange={(value) => handleTargetAmount(value)}
                optionLabelProp="label"
              >
                <Option value="" label="All target amount">
                  All target amount
                </Option>
                {targetAmountArray.map((amount, index) => (
                  <Option key={index} value={amount.label} label={amount.label}>
                    {amount.label}
                  </Option>
                ))}
              </Select>
              <Select
                className="m-1 w-40 my-2 min-h-[40px]"
                defaultValue=""
                onChange={handleRevenueRange}
                optionLabelProp="label"
              >
                <Option value="" label="All revenue range">
                  All revenue range
                </Option>
                {revenueRange.map((range, index) => (
                  <Option key={index} value={range} label={range}>
                    {range}
                  </Option>
                ))}
              </Select>
              <Select
                className="m-1 w-40 my-2 min-h-[40px]"
                defaultValue=""
                onChange={handleRound}
                optionLabelProp="label"
              >
                <Option value="" label="All round">
                  All round
                </Option>
                {[
                  "Pre-seed",
                  "Seed",
                  "Series A",
                  "Series B",
                  "Series C",
                  "Non-Profit",
                ].map((round, index) => (
                  <Option key={index} value={round} label={round}>
                    {round}
                  </Option>
                ))}
              </Select>
              {/* <Select
              className="m-1 w-40 my-2 min-h-[40px]"
              defaultValue=""
              onChange={handleCountry}
              optionLabelProp="label"
            >
              <Option value="" label="All countries">
                All countries
              </Option>
              {countries.map((country, index) => (
                <Option key={index} value={country} label={country}>
                  {country}
                </Option>
              ))}
            </Select> */}
              <Select
                className="m-1 w-40 my-2 min-h-[40px]"
                defaultValue=""
                onChange={handleRegion}
                optionLabelProp="label"
              >
                <Option value="" label="All region">
                  All region
                </Option>
                {regions.map((region, index) => (
                  <Option key={index} value={region.key} label={region.key}>
                    {region.key}
                  </Option>
                ))}
              </Select>
            </div>

            <div
              className="hidden sm:flex lg:hidden items-center justify-center"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircleOutlined style={{ fontSize: "20px" }} />
            </div>

            <div
              className="sm:hidden flex items-center justify-center"
              onClick={() => setIsOpen(true)}
              style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                zIndex: "100",
              }}
            >
              <PlusCircleOutlined style={{ fontSize: "30px" }} />
            </div>

            {isOpen && (
              <Modal
                title="Add filter criteria"
                open={isOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Apply"
                cancelText="Clear all"
                cancelButtonProps={{
                  style: {
                    borderRadius: "0.375rem",
                    cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
                  },
                }}
                okButtonProps={{
                  style: {
                    background: "#2563EB",
                    borderColor: "#2563EB",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
                  },
                }}
                centered={true}
              >
                <div className="flex flex-wrap items-stretch justify-around">
                  <Select
                    className="m-1 w-40 my-2 min-h-[40px]"
                    defaultValue=""
                    onChange={(value) => handleTargetAmount(value)}
                    optionLabelProp="label"
                  >
                    <Option value="" label="All target amount">
                      All target amount
                    </Option>
                    {targetAmountArray.map((amount, index) => (
                      <Option
                        key={index}
                        value={amount.label}
                        label={amount.label}
                      >
                        {amount.label}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    className="m-1 w-40 my-2 min-h-[40px]"
                    defaultValue=""
                    onChange={handleRevenueRange}
                    optionLabelProp="label"
                  >
                    <Option value="" label="All revenue range">
                      All revenue range
                    </Option>
                    {revenueRange.map((range, index) => (
                      <Option key={index} value={range} label={range}>
                        {range}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    className="m-1 w-40 my-2 min-h-[40px]"
                    defaultValue=""
                    onChange={handleRound}
                    optionLabelProp="label"
                  >
                    <Option value="" label="All round">
                      All round
                    </Option>
                    {[
                      "Pre-seed",
                      "Seed",
                      "Series A",
                      "Series B",
                      "Series C",
                      "Non-Profit",
                    ].map((round, index) => (
                      <Option key={index} value={round} label={round}>
                        {round}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    className="m-1 w-40 my-2 min-h-[40px]"
                    defaultValue=""
                    onChange={handleRegion}
                    optionLabelProp="label"
                  >
                    <Option value="" label="All region">
                      All region
                    </Option>
                    {regions.map((region, index) => (
                      <Option key={index} value={region.key} label={region.key}>
                        {region.key}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
