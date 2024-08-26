import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { LinearProgress } from "@mui/material";
import { message } from "antd";
import Header from "../Home/Header";
import UniSearch from "../University/UniSearch";
import Card from "../Home/Components/Card";
import CourseSearch from "./CourseSearch";

const CoursePosts = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);

  // Update fetchCompanies function
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);

      try {
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id, verified, status")
          .eq("stamp", "lesson");

        if (projectsError) {
          message.error(projectsError.message);
          return;
        }
        const projectIds = projects.map((project) => project.id);
        console.log("projectIds", projectIds);

        const { data: fetchedCompanies, error: companiesError } = await supabase
          .from("company")
          .select("*")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false });
        console.log("fetchedCompanies", fetchedCompanies);

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
    fetchCompanies();
  }, []);

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

  return (
    <div className="bg-white darkBg antialiased !p-0">
      <div id="exampleWrapper">
        <Header />
        <div className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0">
          <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto flex-grow">
            {/* <HeroCompetitions
              onSelectCode={handleSelectCode}
              setCompanies={setCompanies}
              selectedCode={selectedCodeFull}
              setSelectedCodeFull={setSelectedCodeFull}
              filteredProjectList={filteredProjectList}
              setFilteredProjectList={setFilteredProjectList}
              selectedRound={selectedRound}
              setSelectedRound={setSelectedRound}
              projectList={projectList}
              setProjectList={setProjectList}
            /> */}

            <>
              <CourseSearch
                onSearch={handleSearch}
                companies={companiesToRender}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />

              {isLoading ? (
                <LinearProgress className="my-20" />
              ) : (
                <>
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
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePosts;
