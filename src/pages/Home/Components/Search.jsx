import React, { useEffect, useState } from "react";

import AllInclusiveOutlinedIcon from "@mui/icons-material/AllInclusiveOutlined";
import industries from "../../../components/Industries";

const Search = ({
  onSearch,
  onIndustryChange,
  companies,
  searchTerm,
  setSearchTerm,
  selectedIndustry,
  setSelectedIndustry,
  currentTab,
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

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
    } else {
      setSuggestions(companies);
    }
  }, [currentTab, companies, searchTerm]);

  console.log("suggestions", suggestions);

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-1 mt-24">
        <div className="text-center">
          <h3
            id="profiles"
            className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray"
          >
            New fundraising profiles
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 darkBgBlue darkBorderGray darkShadowGray">
                <div className="flex-[1_0_0%]">
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className=" px-4 block w-full h-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                    placeholder="Search profiles"
                    value={searchTerm}
                    onChange={handleSearchChange} // Thêm sự kiện onChange này
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <button
                    type="submit"
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
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
                    className="text-left px-4 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(company.name)}
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 sm:mt-4 hidden lg:flex flex-wrap justify-center">
            <button
              onClick={() => handleIndustryClick("")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                !selectedIndustry
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              All
              <AllInclusiveOutlinedIcon fontSize="small" />
            </button>
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => handleIndustryClick(industry)}
                className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                  selectedIndustry === industry
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                } shadow-sm hover:cursor-pointer`}
              >
                {industry}
              </button>
            ))}
          </div>
          <div className="mt-4 lg:hidden overflow-x-auto flex flex-nowrap">
            <button
              onClick={() => handleIndustryClick("")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                !selectedIndustry
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              All
              <AllInclusiveOutlinedIcon fontSize="small" />
            </button>
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => handleIndustryClick(industry)}
                className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                  selectedIndustry === industry
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-50"
                } shadow-sm hover:cursor-pointer flex-shrink-0`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
