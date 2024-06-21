import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";

import Search from "../Home/Components/Search";

import {
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Header2 from "../Home/Header2";
import HeroCompetition from "./HeroCompetition";
import { Button, Modal, Table, message } from "antd";
import regions from "../../components/Regions";
import { formatDate } from "../../features/DurationSlice";
import UniEditorTool from "./UniEditorTool";

const CompetitionPosts = ({ location }) => {
  const [companies, setCompanies] = useState([]);
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [revenueRange, setRevenueRange] = useState("");
  const [round, setRound] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("verified");

  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);

  const [selectedCodeData, setSelectedCodeData] = useState(null);
  const [projectCounts, setProjectCounts] = useState({});

  useEffect(() => {
    fetchCodes();
  }, []);

  useEffect(() => {
    if (selectedCode) {
      fetchCompanies();
      fetchSelectedCodeData();
    }
  }, [selectedCode]);

  const fetchSelectedCodeData = async () => {
    try {
      const { data, error } = await supabase
        .from("code")
        .select("*")
        .eq("code", selectedCode)
        .single();

      if (error) {
        message.error("Error fetching code data: " + error.message);
        return;
      }

      const projectCounts = await fetchProjectCounts(codes);

      setProjectCounts(projectCounts);

      setSelectedCodeData(data);
    } catch (error) {
      message.error("An error occurred while fetching code data.");
      console.error("Error fetching code data:", error);
    }
  };
  const fetchProjectCounts = async (codes) => {
    const counts = {};

    for (const code of codes) {
      const { count, error } = await supabase
        .from("projects")
        .select("id", { count: "exact" })
        .contains("universityCode", [code.code]);

      if (error) {
        console.error("Error fetching project count:", error);
        counts[code.id] = 0;
      } else {
        counts[code.id] = count;
      }
    }

    return counts;
  };

  const fetchCodes = async () => {
    setIsLoading(true);
    try {
      const { data: fetchedCodes, error } = await supabase
        .from("code")
        .select("*")
        .eq("publish", true);

      if (error) {
        message.error("Error fetching codes: " + error.message);
        return;
      }

      setCodes(fetchedCodes);
      setSelectedCode(fetchedCodes[0]?.code);
    } catch (error) {
      message.error("An error occurred while fetching codes.");
      console.error("Error fetching codes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      // Fetch projects including their verified status and status, avoiding stealth status projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, verified, status, universityCode") // Get verified status and status along with id
        .neq("status", "stealth")
        .contains("universityCode", [selectedCode]);

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
      return { min: 0, max: Infinity };
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

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false); // New state for rules modal

  const openRulesModal = (record) => {
    setSelectedCodeData(record);
    setIsRulesModalOpen(true);
  };

  const codeColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Competition Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => <span>{record.name}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => <span>{record.code}</span>,
    },
    {
      title: "Rules",
      dataIndex: "rules",
      key: "rules",
      align: "center",
      render: (text, record) => (
        <Button onClick={() => openRulesModal(record)} className="text-xs">
          {record.rules ? "View Rules" : "No Rules"}
        </Button>
      ),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (text, record) => <span>{formatDate(record.created_at)}</span>,
    },
    {
      title: "Expired at",
      dataIndex: "expired_at",
      key: "expired_at",
      align: "center",
      render: (text, record) => <span>{formatDate(record.expired_at)}</span>,
    },
    {
      title: "Number of Profiles",
      dataIndex: "number_of_used",
      key: "number_of_used",
      align: "center",

      render: (text, record) => (
        <span className="flex justify-center items-center">
          {projectCounts[record.id] || 0}
        </span>
      ),
    },
    {
      title: "Judges Name",
      dataIndex: "judges",
      key: "judges_name",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer truncate"
          style={{
            maxWidth: "150px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={record.judges
            ?.map((judge) => JSON.parse(judge).name)
            .join(", ")}
        >
          {record.judges?.map((judge) => JSON.parse(judge).name).join(", ")}
        </span>
      ),
    },
    {
      title: "Judges Email",
      dataIndex: "judges",
      key: "judges_email",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer truncate"
          style={{
            maxWidth: "200px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={record.judges
            ?.map((judge) => JSON.parse(judge).email)
            .join(", ")}
        >
          {record.judges?.map((judge) => JSON.parse(judge).email).join(", ")}
        </span>
      ),
    },
  ];

  return (
    <div className="lg:px-8 mx-auto my-12">
      <Header2 />
      <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto">
        <HeroCompetition />
        <div className="flex flex-col justify-center items-center">
          <div className="text-2xl sm:text-3xl font-semibold text-gray-800 darkTextGray mb-5">
            Select your favorite competition
          </div>
          <FormControl
            fullWidth
            className="max-w-3xl"
            variant="outlined"
            margin="normal"
          >
            <InputLabel id="code-select-label">Select Code</InputLabel>
            <Select
              labelId="code-select-label"
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              label="Select Code"
            >
              {codes.map((code) => (
                <MenuItem key={code.id} value={code.code}>
                  {code.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {selectedCodeData && (
          <section className="max-w-5xl px-4 mx-auto mt-14">
            <div className="flex flex-col mb-5">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 darkTextGray text-center">
                Competition information
              </h3>

              <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                <Table
                  columns={codeColumns}
                  dataSource={[selectedCodeData]}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  bordered
                />
              </div>
            </div>
          </section>
        )}

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
          selectedCode={selectedCode}
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
      </div>
      <Modal
        title={`Rules for ${selectedCodeData?.code}`}
        open={isRulesModalOpen}
        onCancel={() => setIsRulesModalOpen(false)}
        centered={true}
        footer={null}
      >
        <UniEditorTool selectedCode={selectedCodeData} unChange={true} />
      </Modal>
    </div>
  );
};

export default CompetitionPosts;
