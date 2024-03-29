import React, { useEffect, useState } from "react";

import AllInclusiveOutlinedIcon from "@mui/icons-material/AllInclusiveOutlined";
import industries from "../../../components/Industries";
import { Select } from "antd";

const Search = ({
  onSearch,
  onIndustryChange,
  companies,
  searchTerm,
  setSearchTerm,
  selectedIndustry,
  setSelectedIndustry,
  currentTab,
  setCurrentTab,
  setVisibleItemCount,
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setSuggestions([]);
  };

  const handleIndustryClick = (industry) => {
    setSelectedIndustry(industry);

    onIndustryChange(industry);
  };

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

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-1 mt-24">
        <div className="text-center">
          <h3
            id="profiles"
            className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray"
          >
            Business profiles
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-md shadow-lg shadow-gray-100 darkBgBlue darkBorderGray darkShadowGray">
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
              <ul className=" mt-2 top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
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

            <Select
              className="m-1 w-40 text-center my-2 min-h-[40px]"
              value={currentTab}
              onChange={handleChange}
            >
              <Option value="All">All profiles</Option>
              <Option value="verified">Verified profiles</Option>
              <Option value="unverified">Unverified profiles</Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

//////////////
