import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";

import { LinearProgress, Tab, Tabs } from "@mui/material";
import Header2 from "../Home/Header2";
import HeroCompetition from "./HeroCompetition";
import { message } from "antd";
import UniEditorTool from "./UniEditorTool";
import UniCard from "./UniCard";
import UniSearch from "./UniSearch";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const CompetitionPosts = ({ location }) => {
  const [companies, setCompanies] = useState([]);
  const [codes, setCodes] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

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
      fetchCompanies(data.id);

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

  // Update fetchCompanies function
  const fetchCompanies = async (codeId = "") => {
    setIsLoading(true);
    try {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, verified, status")
        .neq("status", "stealth")
        .contains("universityCode", [codeId]);

      if (projectsError) {
        message.error(projectsError.message);
        return;
      }

      const projectIds = projects.map((project) => project.id);

      const { data: fetchedCompanies, error: companiesError } = await supabase
        .from("company")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false });

      if (companiesError) {
        message.error(companiesError.message);
        return;
      }

      const verifiedStatusMap = new Map();
      const statusMap = new Map();

      projects.forEach((project) => {
        verifiedStatusMap.set(project.id, project.verified);
        statusMap.set(project.id, project.status);
      });

      fetchedCompanies.forEach((company) => {
        company.verifiedStatus =
          verifiedStatusMap.get(company.project_id) || false;
        company.status = statusMap.get(company.project_id) || "Unknown";
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

    const visibleCompanies = data.slice(0, visibleItemCount);
    setCompaniesToRender(visibleCompanies);
  }, [currentTab, companies, page, searchTerm, visibleItemCount]);

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

  const [selectedTab, setSelectedTab] = useState("Listing"); // New state for tab selection

  const [currentCodePage, setCurrentCodePage] = useState(0);
  const itemsCodePerPage = 2;

  const handleNext = () => {
    if ((currentCodePage + 1) * itemsCodePerPage < codes.length) {
      setCurrentCodePage(currentCodePage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCodePage > 0) {
      setCurrentCodePage(currentCodePage - 1);
    }
  };

  const startIndex = currentCodePage * itemsCodePerPage;
  const selectedCodes = codes.slice(startIndex, startIndex + itemsCodePerPage);

  return (
    <div className="lg:px-8 mx-auto my-12">
      <Header2 />
      <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto">
        <HeroCompetition />
        {codes.length > 0 && (
          <>
            <>
              <section className="container px-4 mx-auto mt-14 max-w-3xl">
                <div className="flex flex-col mb-5">
                  <h3 className="font-bold text-xl text-left">Code listing</h3>
                  <div className="mx-auto mt-5 grid sm:grid-cols-2 gap-32 transition-all duration-600 ease-out transform translate-x-0">
                    {selectedCodes.map((code, index) => (
                      <div
                        key={code.id}
                        className="group flex justify-center w-full"
                      >
                        {code ? (
                          <UniCard
                            data={code}
                            setSelectedCode={setSelectedCodeData}
                            codeInCompetition={setSelectedCode}
                            // onSelectCode={onSelectCode}
                            // filterProjectsByCode={filterProjectsByCode}
                            projectCounts={projectCounts}
                          />
                        ) : (
                          <div className="w-[30vw] h-[55vh]"></div>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between mt-5">
                      <button
                        onClick={handlePrevious}
                        disabled={currentCodePage === 0}
                        className={`bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] ${currentCodePage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <LeftOutlined /> Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={
                          (currentCodePage + 1) * itemsCodePerPage >=
                          codes.length
                        }
                        className={`bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] ${(currentCodePage + 1) * itemsCodePerPage >= codes.length ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Next
                        <RightOutlined className="ml-2" />
                      </button>
                    </div>
                  </div>{" "}
                </div>
              </section>
            </>

            <UniSearch
              onSearch={handleSearch}
              companies={companiesToRender}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              selectedCode={selectedCodeData}
            />

            <Tabs
              value={selectedTab}
              onChange={(event, newValue) => setSelectedTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Listing" value="Listing" />
              <Tab label="Rules" value="Rules" />
            </Tabs>

            {isLoading ? (
              <LinearProgress className="my-20" />
            ) : selectedTab === "Listing" ? (
              <>
                {companiesToRender.length === 0 ? (
                  <div className="mt-20 text-center text-4xl font-semibold text-gray-800 darkTextGray">
                    No result
                  </div>
                ) : (
                  <div className="mx-auto max-w-[85rem] mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
                    {companiesToRender.map((company, index) => (
                      <div
                        key={company.id}
                        className="group flex justify-center"
                      >
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
                )}
              </>
            ) : (
              <div className="flex justify-center items-center">
                <UniEditorTool
                  selectedCode={selectedCodeData}
                  setSelectedCode={setSelectedCodeData}
                  unChange={true}
                  // handleUpdateRules={handleUpdateRules}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompetitionPosts;
