import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";
import { LinearProgress } from "@mui/material";
import { Dropdown, Menu, message, Tabs } from "antd";

import { useLocation, useNavigate } from "react-router-dom";
import UniSearch from "./UniSearch";
import UniEditorTool from "./UniEditorTool"; // Assuming this is the component for editing rules
import TabPane from "antd/es/tabs/TabPane";
import { useAuth } from "../../context/AuthContext";
import Header2 from "../Home/Header2";
import HeroCompetitions from "./HeroCompetitons";
import SubmitProjectModal from "./components/SubmitProjectComponent";

const CompetitionPost = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCodeFull, setSelectedCodeFull] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);
  const [selectedTab, setSelectedTab] = useState("Listing"); // New state for tab selection
  const [filteredProjectList, setFilteredProjectList] = useState([]);

  // Update fetchCompanies function
  const fetchCompanies = async (codeId) => {
    setIsLoading(true);
    if (codeId) {
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
    } else {
      setIsLoading(false);
    }
  };

  // Update handleSelectCode function
  const handleSelectCode = (codeId) => {
    fetchCompanies(codeId);
    handlePricingClick();
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };

  const [selectedRound, setSelectedRound] = useState(null); // New state for selected round from dropdown
  const [projectList, setProjectList] = useState([]);

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

    if (filteredProjectList) {
      data = data.filter((company) =>
        filteredProjectList.some(
          (project) => project?.id === company.project_id
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
    visibleItemCount,
    filteredProjectList,
    selectedRound,
    projectList,
  ]);

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

  const handleUpdateRules = async (updatedCode) => {
    try {
      const { error } = await supabase
        .from("code")
        .update({ rules: updatedCode.rules })
        .eq("id", updatedCode.id);

      if (error) {
        throw error;
      }

      message.success("Rules updated successfully");
    } catch (error) {
      message.error("Failed to update rules");
      console.error("Error updating rules:", error);
    }
  };

  const filterProjectsByRound = (round) => {
    if (!round) {
      setFilteredProjectList(projectList);
      return;
    }

    const selectedRoundIndex = selectedCodeFull?.rounds.findIndex(
      (r) => JSON.parse(r).id === round.id
    );

    const filteredProjects = projectList.filter((project) =>
      project.applyInfo.some((info) => {
        if (info.universityCode !== selectedCodeFull?.id) {
          return false;
        }
        if (!info.passRound) {
          return selectedRoundIndex === 0;
        }

        const passRoundIndex = selectedCodeFull?.rounds.findIndex(
          (r) => JSON.parse(r).id === info.passRound
        );

        return passRoundIndex >= selectedRoundIndex - 1;
      })
    );
    setFilteredProjectList(filteredProjects);
  };

  const handleRoundSelect = (round) => {
    setSelectedRound(round);
    filterProjectsByRound(round);
    setSelectedTab("Listing");
  };

  useEffect(() => {
    filterProjectsByRound(selectedRound);
  }, [projectList, selectedRound]);
  // Dropdown menu for rounds
  const roundsMenu = (
    <Menu>
      {selectedCodeFull?.rounds?.map((round, index) => (
        <Menu.Item
          key={index}
          onClick={() => handleRoundSelect(JSON.parse(round))}
          className={
            selectedRound && JSON.parse(round).id === selectedRound.id
              ? "bg-gray-300 text-white hover:bg-gray-300"
              : "hover:bg-gray-200"
          }
        >
          Round: {JSON.parse(round).name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const { user } = useAuth();
  // Check if the user is a judge
  const isJudge = selectedCodeFull?.judges?.some(
    (judge) => JSON.parse(judge)?.email === user?.email
  );

  const handlePricingClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const codeRef = document.getElementById("codeCompetition"); // Đặt ID tương ứng với ref của bạn

    if (codeRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = codeRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 90,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white darkBg antialiased !p-0">
      <div id="exampleWrapper">
        <Header2 />
        <div className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0">
          <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto flex-grow">
            <HeroCompetitions
              onSelectCode={handleSelectCode}
              setCompanies={setCompanies}
              selectedCode={selectedCodeFull}
              setSelectedCodeFull={setSelectedCodeFull}
              filteredProjectList={filteredProjectList}
              setFilteredProjectList={setFilteredProjectList}
              selectedRound={selectedRound}
              setSelectedRound={setSelectedRound}
              filterProjectsByRound={filterProjectsByRound}
              projectList={projectList}
              setProjectList={setProjectList}
            />

            <>
              <UniSearch
                onSearch={handleSearch}
                companies={companiesToRender}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                selectedCode={selectedCodeFull}
              />

              <Tabs
                activeKey={selectedTab}
                onChange={(key) => setSelectedTab(key)}
                centered
                id="codeCompetition"
              >
                <TabPane
                  tab={
                    <Dropdown overlay={roundsMenu} trigger={["hover"]}>
                      <span>Listing</span>
                    </Dropdown>
                  }
                  key="Listing"
                >
                  {isLoading ? (
                    <LinearProgress className="my-20" />
                  ) : (
                    <>
                      {selectedRound && (
                        <h2 className="text-center font-semibold text-lg">
                          Round: {selectedRound?.name}
                        </h2>
                      )}
                      <div className="mx-auto max-w-[85rem] my-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
                        {companiesToRender.length > 0 ? (
                          companiesToRender.map((company, index) => (
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
                                  selectedCodeFull={selectedCodeFull}
                                  projectList={projectList}
                                  selectedRound={selectedRound}
                                  setProjectList={setProjectList}
                                  isJudge={isJudge}
                                />
                              ) : (
                                <div className="w-[30vw] h-[55vh]"></div>
                              )}
                            </div>
                          ))
                        ) : (
                          <>
                            <div></div>
                            <div className="mx-auto my-20 text-center text-4xl font-semibold text-gray-800 darkTextGray">
                              No result
                            </div>
                          </>
                        )}
                      </div>
                      <div className="sticky bottom-8 left-8">
                        <SubmitProjectModal />
                      </div>
                    </>
                  )}
                </TabPane>
                <TabPane tab="Rules" key="Rules">
                  <div className="flex justify-center items-center">
                    <UniEditorTool
                      selectedCode={selectedCodeFull}
                      setSelectedCode={setSelectedCodeFull}
                      unChange={true}
                      handleUpdateRules={handleUpdateRules}
                    />
                  </div>
                  <div className="sticky bottom-8 left-8">
                    <SubmitProjectModal />
                  </div>
                </TabPane>
              </Tabs>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPost;
