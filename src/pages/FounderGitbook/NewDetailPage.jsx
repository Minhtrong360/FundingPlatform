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

export default function NewDetailPage() {
  const [company, setCompany] = useState([]);
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState("");
  const [blocks, setBlocks] = useState([]);

  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
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
        if (
          projectData.status === "private" &&
          projectData.user_id !== user?.id &&
          !projectData.invited_user?.includes(user.email) &&
          !projectData.collabs?.includes(user.email)
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
  }, [params?.id, user?.email, user?.id]);

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
      <Header position={position} />
      <ProfileInfo
        company={company}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        blocks={blocks}
      />

      <div className="mt-4 xl:container w-full mx-auto px-4 flex flex-col lg:flex-row">
        <MyTab blocks={blocks} setBlocks={setBlocks} company={company} />

        <Author company={company} />
      </div>
    </div>
  );
}
