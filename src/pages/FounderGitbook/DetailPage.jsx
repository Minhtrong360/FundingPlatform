import React, { useEffect, useState } from "react";

import "@blocknote/core/style.css";

import "./custom-ant-design.css";

import EditorTool from "./EditorTool";

import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FilesList from "./FilesList";
import SideBar from "../../components/SideBar";
import AlertMsg from "../../components/AlertMsg";
import AnnouncePage from "../../components/AnnouncePage";

import HeroSection from "./HeroSection";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import MyTabs from "../testseparated";


const DetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [company, setCompany] = useState([]);
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (
          projectData.status === false &&
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
            .eq("project_id", id)
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
  }, [id, user?.email, user?.id]);

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

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <AlertMsg />
      <LoadingButtonClick isLoading={isLoading} />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0 "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-0 sm:p-4 border-0 border-gray-300 border-dashed sm:border-2 rounded-md darkBorderGray">
            <HeroSection
              formData={company}
              title={company.name}
              description={company.description}
              button1Text={company.target_amount}
              button2Text={company.no_ticket}
              button3Text={company.ticket_size}
              button4Text={company.offer}
              button5Text={company.offer_type}
              imageUrl={company.project_url}
            />
            <div className="flex justify-center">
              <EditorTool />
            </div>
            {/* <div className="flex justify-center">
              <MyTabs />
            </div> */}
            <FilesList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
