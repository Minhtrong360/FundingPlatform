import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import AnnouncePage from "../../components/AnnouncePage";
import ProfileInfo from "./ProfileInfo";
import Author from "./Components/Author";
import MyTab from "./Components/MyTab";
import { useParams } from "react-router";
import Header from "../Home/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";
import RightSideBar from "./Components/RightSideBar";

export default function NewDetailPage({ location }) {
  const [company, setCompany] = useState(
    JSON.parse(sessionStorage.getItem("companyDetailPage")) || []
  );
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(
    JSON.parse(sessionStorage.getItem("currentProjectDetailPage")) || []
  );
  const [blocks, setBlocks] = useState([]);
  const [fullScreen, setFullScreen] = useState(false);

  const params = useParams();
  const { user } = useAuth();

  const locationKey = JSON.parse(
    sessionStorage.getItem("locationKeyDetailPage")
  );

  useEffect(() => {
    if (locationKey !== location?.key || !company.length) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("companyDetailPage", JSON.stringify(company));
    sessionStorage.setItem(
      "locationKeyDetailPage",
      JSON.stringify(location.key)
    );
  }, [company, location.key]);

  useEffect(() => {
    sessionStorage.setItem(
      "currentProjectDetailPage",
      JSON.stringify(currentProject)
    );
  }, [currentProject]);

  const fetchData = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", params?.id)
        .single();

      if (projectError) {
        throw projectError;
      }
      setCurrentProject(projectData);

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single();

      if (
        (projectData.status === "private" ||
          projectData.status === "stealth") &&
        projectData.user_id !== user?.id &&
        !projectData.invited_user?.includes(user.email) &&
        !projectData.collabs?.includes(user.email) &&
        userData?.admin !== true
      ) {
        setViewError(true);
        setIsLoading(false);
      } else {
        setViewError(false);
        const { data: companyData, error: companyError } = await supabase
          .from("company")
          .select("*")
          .eq("project_id", params?.id)
          .single();

        if (companyError) {
          throw companyError;
        }

        setCompany(companyData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
      const removeBodyStyle = () => {
        document.body.removeAttribute("style");
      };

      // Initial check
      removeBodyStyle();
    }
  };
  const [isContentChanged, setIsContentChanged] = useState(false);

  if (viewError) {
    return (
      <div>
        <LoadingButtonClick isLoading={isLoading} />
        <AnnouncePage
          title="Permission Required"
          announce="This is a private project."
          describe="Send a request to the project owner to get access."
          sendRequest={true}
        />
      </div>
    );
  }

  if (company.length === 0 || !company) {
    return (
      <div>
        <LoadingButtonClick isLoading={isLoading} />
        <AnnouncePage
          title="Not found"
          announce="This project may be no longer exist."
          describe="This project may be deleted by its owner and no longer exist. Please choose another project."
        />
      </div>
    );
  }
  const noFixedHeader = "notFixed";

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <>
          <div>
            <HomeHeader
              noFixedHeader={noFixedHeader}
              isContentChanged={isContentChanged}
            />
            <div className="flex mt-16 space-x-6 justify-center items-start">
              {/* Left column */}
              <div className="w-full lg:w-8/12 px-4">
                <ProfileInfo
                  company={company}
                  currentProject={currentProject}
                  setCurrentProject={setCurrentProject}
                  blocks={blocks}
                  isContentChanged={isContentChanged}
                />
                <div className="flex-grow max-w-7xl mx-auto sm:mt-24 my-16 px-4 sm:px-6 lg:px-8">
                  <MyTab
                    blocks={blocks}
                    setBlocks={setBlocks}
                    company={company}
                    fullScreen={fullScreen}
                    currentProject={currentProject}
                    isContentChanged={isContentChanged}
                    setIsContentChanged={setIsContentChanged}
                  />
                </div>
              </div>

              {/* Right column - hidden on small screens, visible on lg screens */}
              <div
                className="!hidden lg:!block w-full lg:w-3/12 px-4"
                style={{ position: "sticky", top: "2px" }}
              >
                <RightSideBar
                  company={company}
                  currentProject={currentProject}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}