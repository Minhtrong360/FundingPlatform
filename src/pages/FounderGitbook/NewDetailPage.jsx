import React, { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import AnnouncePage from "../../components/AnnouncePage";
import Header from "../Home/Header";
import ProfileInfo from "./ProfileInfo";

import Author from "./Components/Author";
import MyTab from "./Components/MyTab";
import { useParams } from "react-router";

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
      // Check if companies are already loaded
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("companyDetailPage", JSON.stringify(company)); // Cache companies data

    sessionStorage.setItem(
      "locationKeyDetailPage",
      JSON.stringify(location.key)
    );
  }, [company, location.key]);

  useEffect(() => {
    sessionStorage.setItem(
      "currentProjectDetailPage",
      JSON.stringify(currentProject)
    ); // Cache companies data
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
        .single(); // user.email là giá trị email của người dùng

      if (
        (projectData.status === "private" ||
          projectData.status === "stealth") &&
        projectData.user_id !== user?.id &&
        !projectData.invited_user?.includes(user.email) &&
        !projectData.collabs?.includes(user.email) &&
        userData?.admin !== true
      ) {
        setViewError(true);
        setIsLoading(false); // Người dùng không được phép xem, ngừng hiển thị loading
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
        setIsLoading(false); // Dữ liệu đã tải xong, ngừng hiển thị loading
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      setIsLoading(false); // Có lỗi xảy ra, ngừng hiển thị loading
    }
  };

  fetchData();

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
  const position = "notFixed";

  return (
    <div className="min-h-screen bg-white">
      <button
        className={`w-[100px] fixed bottom-5 lg:left-5 right-5 p-2 rounded-md ${
          fullScreen ? "bg-gray-300" : "bg-blue-600 text-white"
        } z-50 text-sm`}
        onClick={() => setFullScreen((prev) => !prev)}
      >
        Full screen
      </button>
      {fullScreen === false ? (
        <div>
          <Header position={position} />
          <ProfileInfo
            company={company}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
            blocks={blocks}
          />

          <div className="mt-4 xl:container w-full mx-auto sm:px-4 pl-8 flex flex-col lg:flex-row">
            <MyTab
              blocks={blocks}
              setBlocks={setBlocks}
              company={company}
              fullScreen={fullScreen}
              currentProject={currentProject}
            />

            <Author company={company} />
          </div>
        </div>
      ) : (
        <MyTab
          blocks={blocks}
          setBlocks={setBlocks}
          company={company}
          fullScreen={fullScreen}
          currentProject={currentProject}
        />
      )}
    </div>
  );
}
