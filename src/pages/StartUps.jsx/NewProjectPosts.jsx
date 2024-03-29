import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";
// import { toast } from "react-toastify";
import Search from "../Home/Components/Search";

import { LinearProgress } from "@mui/material";
import Header from "../Home/Header";
import { message, Select } from "antd";
import HeroSection from "./HeroSection";

const NewProjectPosts = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("verified");

  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [verifiedCompanies, setVerifiedCompanies] = useState([]);
  const [unverifiedCompanies, setUnverifiedCompanies] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);

  const { Option } = Select;
  const handleChange = (value) => {
    setVisibleItemCount(itemsPerPage);
    setCurrentTab(value);
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let { data, error } = await supabase
          .from("company")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          message.error(error.message);
          console.error("Error fetching data from Supabase:", error);
        } else {
          setCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    setPage(1);
  };

  const fetchVerifiedStatus = async (companyId) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("verified")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching verified status:", error.message);
        return null;
      } else {
        return data.verified;
      }
    } catch (error) {
      console.log("Error fetching verified status:", error.message);
      return null;
    }
  };

  const divideCompaniesByVerifiedStatus = async (companies) => {
    const verifiedCompanies = [];
    const unverifiedCompanies = [];

    for (const company of companies) {
      const verifiedStatus = await fetchVerifiedStatus(company.project_id);

      if (verifiedStatus) {
        verifiedCompanies.push(company);
      } else {
        unverifiedCompanies.push(company);
      }
    }

    return { verifiedCompanies, unverifiedCompanies };
  };

  useEffect(() => {
    const divideCompanies = async () => {
      setIsLoading(true);
      try {
        const { verifiedCompanies, unverifiedCompanies } =
          await divideCompaniesByVerifiedStatus(companies);
        setVerifiedCompanies(verifiedCompanies);
        setUnverifiedCompanies(unverifiedCompanies);
      } catch (error) {
        console.log(
          "Error dividing companies by verified status:",
          error.message
        );
      } finally {
        setIsLoading(false);
      }
    };

    divideCompanies();
  }, [companies]);

  useEffect(() => {
    let data = [];
    if (currentTab === "verified") {
      data = verifiedCompanies;
    } else if (currentTab === "All") {
      data = companies;
    } else {
      data = unverifiedCompanies;
    }

    if (searchTerm) {
      data = data.filter((company) =>
        company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      data = data.filter((company) =>
        company?.industry?.some(
          (industry) =>
            industry.toLowerCase() === selectedIndustry.toLowerCase()
        )
      );
    }

    const visibleCompanies = data.slice(0, visibleItemCount);
    setCompaniesToRender(visibleCompanies);
  }, [
    currentTab,
    companies,
    page,
    searchTerm,
    selectedIndustry,
    verifiedCompanies,
    unverifiedCompanies,
    visibleItemCount,
  ]);

  // Function to handle scrolling to the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if (atBottom) {
        // Nếu người dùng cuộn đến cuối trang, tăng số lượng bài viết hiển thị thêm (ví dụ, thêm 5)
        setVisibleItemCount((prevVisible) => prevVisible + itemsPerPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-12">
      <Header />
      <div className="max-w-[85rem] px-3 py-2 sm:px-6 lg:px-8 lg:py-1 mx-auto">
        <HeroSection />
        <Search
          onSearch={handleSearch}
          onIndustryChange={handleIndustryChange}
          companies={companiesToRender}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          currentTab={currentTab}
        />

        <div className="mt-2 sm:mt-4 ml-4 md:mt-0 lg:flex flex-wrap justify-center">
              <Select
                className="m-1 w-40 text-center"
                value={currentTab}
                onChange={handleChange}
                
              >
                <Option value="All">All</Option>
                <Option value="verified">Verified</Option>
                <Option value="unverified">Unverified</Option>
              </Select>
            </div>

        {/* <div className="mt-10 flex justify-center">
          <button
            className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-md border ${
              currentTab === "All"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            } shadow-sm hover:cursor-pointer`}
            onClick={() => {
              setVisibleItemCount(itemsPerPage);
              setCurrentTab("All");
            }}
          >
            All
          </button>
          <button
            className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-md border ${
              currentTab === "verified"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            } shadow-sm hover:cursor-pointer`}
            onClick={() => {
              setVisibleItemCount(itemsPerPage);
              setCurrentTab("verified");
            }}
          >
            Verified
          </button>
          <button
            className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-md border ${
              currentTab === "unverified"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-50"
            } shadow-sm hover:cursor-pointer`}
            onClick={() => {
              setVisibleItemCount(itemsPerPage);
              setCurrentTab("unverified");
            }}
          >
            Unverified
          </button>
        </div> */}
        {isLoading ? (
          <LinearProgress className="my-20" />
        ) : (
          <>
            {companiesToRender.length === 0 ? (
              <div className="mt-20 text-center text-4xl font-semibold text-gray-800 darkTextGray">
                No result
              </div>
            ) : (
              <>
                <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
                  {companiesToRender.map((company, index) => (
                    <div key={index} className="group flex justify-center">
                      {company ? (
                        <Card
                          key={company.id}
                          title={company.name}
                          description={company.description}
                          imageUrl={company.card_url}
                          buttonText="More"
                          project_id={company.project_id}
                        />
                      ) : (
                        <div className="w-[30vw] h-[55vh]"></div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NewProjectPosts;
