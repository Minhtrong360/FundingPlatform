import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";
import { LinearProgress, Tabs, Tab } from "@mui/material";
import { message } from "antd";
import HeroUniversities from "./HeroUniversities";
import CredentialModal from "./CredentialModal";
import { useLocation, useNavigate } from "react-router-dom";
import SideBarWorkSpace from "./SideBarWorkSpace";
import UniSearch from "./UniSearch";
import UniEditorTool from "./UniEditorTool"; // Assuming this is the component for editing rules

const UniversitiesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCodeFull, setSelectedCodeFull] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [currentItem, setCurrentItem] = useState("View");
  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);
  const [selectedTab, setSelectedTab] = useState("Listing"); // New state for tab selection
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    const fetchAndSetCredentials = async (id) => {
      const credentials = await fetchCredentials(id);
      if (credentials) {
        setCredentials(credentials);
      }
    };

    if (id) {
      fetchAndSetCredentials(id);
    }
    if (!id) {
      setIsModalVisible(true);
    }
  }, [location]);

  const fetchCredentials = async (id) => {
    const { data, error } = await supabase
      .from("workspace")
      .select("*")
      .eq("UniID", id)
      .single();

    if (error) {
      console.error("Error fetching credentials:", error);
      message.error("Error fetching credentials.");
      return null;
    }

    return data;
  };

  const handleCredentialSubmit = async ({ id, password }) => {
    const credentials = await fetchCredentials(id);
    if (credentials && credentials.password === password) {
      setIsModalVisible(false);
      fetchCompanies(credentials.university);
      setCredentials(credentials);
      navigate(`/workspace?workspace=${credentials.university}&id=${id}`);
    } else {
      message.error("Invalid ID or password.");
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

  // Update handleSelectCode function
  const handleSelectCode = (codeId) => {
    fetchCompanies(codeId);
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

  return (
    <div className="lg:px-8 mx-auto mb-16 flex">
      <SideBarWorkSpace
        setCurrentTab={setCurrentItem}
        isSidebarOpen={true}
        currentTab={currentItem}
      />

      <div className="px-3 py-2 lg:px-8 lg:py-1 mx-auto flex-grow">
        <HeroUniversities
          onSelectCode={handleSelectCode}
          setCompanies={setCompanies}
          credentials={credentials}
          currentTab={currentItem}
          selectedCode={selectedCodeFull}
          setSelectedCodeFull={setSelectedCodeFull}
        />
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
            )}
          </>
        ) : (
          <div className="flex justify-center items-center">
            <UniEditorTool
              selectedCode={selectedCodeFull}
              setSelectedCode={setSelectedCodeFull}
              unChange={currentItem === "View" ? true : false}
              handleUpdateRules={handleUpdateRules}
            />
          </div>
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
