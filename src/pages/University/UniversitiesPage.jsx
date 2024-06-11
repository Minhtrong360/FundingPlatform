import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";

import Search from "../Home/Components/Search";

import { LinearProgress } from "@mui/material";
import Header from "../Home/Header";
import { message } from "antd";
import regions from "../../components/Regions";
import Header2 from "../Home/Header2";
import HeroUniversities from "./HeroUniversities";
import CredentialModal from "./CredentialModal";
import { useNavigate } from "react-router-dom";

const predefinedCredentials = {
  // Example predefined credentials
  12345: { password: "password123", university: "University A" },
  67890: { password: "password456", university: "University B" },
};

const UniversitiesPage = ({ location }) => {
  const [companies, setCompanies] = useState(
    JSON.parse(sessionStorage.getItem("companies")) || []
  );

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [round, setRound] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [selectedCode, setSelectedCode] = useState("");

  const [university, setUniversity] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");

  const [companiesToRender, setCompaniesToRender] = useState(
    JSON.parse(sessionStorage.getItem("companiesToRender")) || []
  );

  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);

  const navigate = useNavigate();

  const locationKey = JSON.parse(sessionStorage.getItem("locationKey"));

  const handleCredentialSubmit = ({ id, password }) => {
    const credentials = predefinedCredentials[id];
    if (credentials && credentials.password === password) {
      setUniversity(credentials.university);
      setIsModalVisible(false);
      fetchCompanies(credentials.university);
      navigate(
        `/universities?university=${encodeURIComponent(credentials.university)}`
      );
    } else {
      message.error("Invalid ID or password.");
    }
  };

  useEffect(() => {
    if (locationKey !== location?.key || !companies.length) {
      // Check if companies are already loaded
      fetchCompanies();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("companies", JSON.stringify(companies)); // Cache companies data

    sessionStorage.setItem("locationKey", JSON.stringify(location.key));
  }, [companies, location.key]);

  useEffect(() => {
    if (companiesToRender.length > 0) {
      sessionStorage.setItem(
        "companiesToRender",
        JSON.stringify(companiesToRender)
      );
    }
  }, [companiesToRender]);

  const fetchCompanies = async (code = "") => {
    setIsLoading(true);
    try {
      // Fetch projects including their verified status and status, avoiding stealth status projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, verified, status") // Get verified status and status along with id
        .neq("status", "stealth")
        .contains("universityCode", [code]);

      if (projectsError) {
        message.error(projectsError.message);
        return;
      }

      const projectIds = projects.map((project) => project.id);

      // Fetch companies based on project ids
      const { data: fetchedCompanies, error: companiesError } = await supabase
        .from("company")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false });

      if (companiesError) {
        message.error(companiesError.message);
        return;
      }

      // Create maps to store verified status and status for quick lookup
      const verifiedStatusMap = new Map();
      const statusMap = new Map();

      projects.forEach((project) => {
        verifiedStatusMap.set(project.id, project.verified);
        statusMap.set(project.id, project.status);
      });

      // Attach verified status and status directly to each company object
      fetchedCompanies.forEach((company) => {
        company.verifiedStatus =
          verifiedStatusMap.get(company.project_id) || false;
        company.status = statusMap.get(company.project_id) || "Unknown"; // Default to "Unknown" if no status found
      });

      setCompanies(fetchedCompanies);
    } catch (error) {
      message.error("An error occurred while fetching companies.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    setPage(1);
  };

  const getMinMaxFromLabel = (label) => {
    const target = targetAmountArray.find((item) => item.label === label);
    if (target) {
      return { min: target.min, max: target.max };
    } else {
      // Trường hợp không tìm thấy nhãn tương ứng trong mảng
      return { min: 0, max: Infinity }; // Giả sử mặc định là từ 0 đến vô cùng
    }
  };

  const findCompaniesByRegion = (companies, region) => {
    const selectedRegion = regions.find((item) => item.key === region);
    if (selectedRegion) {
      const subCountries = selectedRegion.sub;
      return companies.filter((company) =>
        subCountries.includes(company.country)
      );
    } else {
      // Trường hợp không tìm thấy region tương ứng trong mảng
      return [];
    }
  };

  useEffect(() => {
    let data = companies;

    if (currentTab === "verified") {
      data = data.filter((company) => company?.verifiedStatus === true);
    }
    if (currentTab === "unverified") {
      data = data.filter((company) => company?.verifiedStatus === false);
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

    if (targetAmount) {
      const { min, max } = getMinMaxFromLabel(targetAmount);
      data = data.filter(
        (company) =>
          company.target_amount >= min && company.target_amount <= max
      );
    }

    if (revenueRange) {
      data = data.filter((company) => company?.revenueStatus === revenueRange);
    }

    if (round) {
      data = data.filter((company) => company?.round === round);
    }
    if (country) {
      data = data.filter((company) => company?.country === country);
    }
    if (region) {
      const filteredCompanies = findCompaniesByRegion(data, region);
      data = filteredCompanies;
    }

    const visibleCompanies = data.slice(0, visibleItemCount);
    setCompaniesToRender(visibleCompanies);
  }, [
    currentTab,
    companies,
    page,
    searchTerm,
    selectedIndustry,
    visibleItemCount,
    targetAmount,
    revenueRange,
    round,
    region,
    country,
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

  const targetAmountArray = [
    { min: 0, max: 100000, label: "$0 - $100k" },
    { min: 100001, max: 500000, label: "$100k - $500k" },
    { min: 500001, max: 1000000, label: "$500k - $1M" },
    { min: 1000001, max: 5000000, label: "$1M - $5M" },
    { min: 5000001, max: 10000000, label: "$5M - $10M" },
    { min: 10000001, max: 50000000, label: "$10M - $50M" },
    { min: 50000001, max: 100000000, label: "$50M - $100M" },
    { min: 100000001, max: 500000000, label: "$100M - $500M" },
    { min: 500000001, max: Infinity, label: ">$500M" },
    { min: Infinity, max: Infinity, label: "Non-Profit" },
  ];

  const handleSelectCode = (code) => {
    setSelectedCode(code);
    fetchCompanies(code);
  };

  return (
    <div className="lg:px-8 mx-auto my-12">
      {/* <Header /> */}
      <Header2 />
      <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto">
        <HeroUniversities
          university={university}
          onSelectCode={handleSelectCode}
        />
        <Search
          onSearch={handleSearch}
          onIndustryChange={handleIndustryChange}
          companies={companiesToRender}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setVisibleItemCount={setVisibleItemCount}
          setTargetAmount={setTargetAmount}
          setRevenueRange={setRevenueRange}
          setRound={setRound}
          setRegion={setRegion}
          targetAmountArray={targetAmountArray}
          setCountry={setCountry}
          selectedCode={selectedCode} // Pass selected code to Search component
        />

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
                <div className="mx-auto max-w-[85rem] mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
                  {companiesToRender.map((company, index) => (
                    <div key={company.id} className="group flex justify-center">
                      {company ? (
                        <Card
                          key={company.id}
                          title={company.name}
                          description={company.description}
                          imageUrl={company.card_url}
                          buttonText="More"
                          project_id={company.project_id}
                          verified={company.verifiedStatus}
                          status={company.status}
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

        <CredentialModal
          visible={isModalVisible}
          onSubmit={handleCredentialSubmit}
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
};
export default UniversitiesPage;
