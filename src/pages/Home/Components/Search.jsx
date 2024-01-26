import React, { useEffect, useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import AllInclusiveOutlinedIcon from "@mui/icons-material/AllInclusiveOutlined";
import industries from "../../../components/Industries";
import { Dropdown } from "@mui/base/Dropdown";
import { MenuButton } from "@mui/base/MenuButton";
import { Menu } from "@mui/base/Menu";
import { MenuItem } from "@mui/base/MenuItem";

const Search = ({ onSearch, onIndustryChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleIndustryClick = (industry) => {
    setSelectedIndustry(industry);

    onIndustryChange(industry);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-2">
        <div className="text-center">
          <h3
            id="profiles"
            className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200"
          >
            New fundraising profiles
          </h3>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-slate-900 dark:border-gray-700 dark:shadow-gray-900/[.2]">
                <div className="flex-[1_0_0%]">
                  <input
                    type="text"
                    name="hs-search-article-1"
                    id="hs-search-article-1"
                    className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-transparent dark:text-gray-400 dark:focus:ring-gray-600"
                    placeholder="Search profiles"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex-[0_0_auto]">
                  <button
                    type="submit"
                    className="w-[46px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
          </div>
          <div className="mt-2 sm:mt-4">
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
            <button
              onClick={() => handleIndustryClick("Finance and Banking")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                selectedIndustry === "Finance and Banking"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              Finance and Banking
              <AccountBalanceOutlinedIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleIndustryClick("Fintech")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                selectedIndustry === "Fintech"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              Fintech
              <DesktopWindowsOutlinedIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleIndustryClick("Edtech")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                selectedIndustry === "Edtech"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              Edtech
              <SchoolOutlinedIcon fontSize="small" />
            </button>
            <button
              onClick={() => handleIndustryClick("Biotech")}
              className={`m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
                selectedIndustry === "Biotech"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              } shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
            >
              Biotech
              <BiotechOutlinedIcon fontSize="small" />
            </button>
            <Dropdown>
              <MenuButton
                className={` m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border shadow-sm  disabled:opacity-50 hover:cursor-pointer`}
              >
                More <ArrowDropDownOutlinedIcon />
              </MenuButton>
              <Menu className="bg-white max-h-60 overflow-y-auto px-2 py-2 z-1000 border">
                {industries.map((industry, index) => (
                  <MenuItem
                    className={`mx-2 my-2 px-4 py-4 border rounded-2xl hover:cursor-pointer ${
                      selectedIndustry === industry
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                    key={index}
                    onClick={() => handleIndustryClick(industry)}
                  >
                    {industry}
                  </MenuItem>
                ))}
              </Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
