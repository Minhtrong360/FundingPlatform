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
import { toast } from "react-toastify";
import HeroSection from "./HeroSection";
import LoadingButtonClick from "../../components/LoadingButtonClick";

const DetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [company, setCompany] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { id } = useParams();
  const { user } = useAuth();
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy dự án từ Supabase
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
        if (error) {
          console.log("error", error);
          toast.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          // Kiểm tra quyền truy cập của người dùng
          if (
            data.status === false &&
            data.user_id !== user?.id &&
            !data.invited_user?.includes(user.email) &&
            !data.collabs?.includes(user.email)
          ) {
            // Kiểm tra xem dự án có trạng thái false, không thuộc về người dùng và không được mời tham gia
            // Hoặc có thể kiểm tra invited_user ở đây

            // Hiển thị thông báo hoặc thực hiện hành động tương ứng
            setViewError(true);
          } else {
            setViewError(false);
          }
        }
      });
  }, [id, user.email, user.id]);

  useEffect(() => {
    // Lấy dự án từ Supabase
    supabase
      .from("company")
      .select("*")
      .eq("project_id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
        if (error) {
          console.log("error", error);
          toast.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          setCompany(data);
        }
      });
  }, [id]);

  if (viewError) {
    return (
      <AnnouncePage
        title="Permission Required"
        announce="This is a private project."
        describe="This is a private project and you must be invited to access and see it. You can send a request and wait for the owner to accept."
        sendRequest={true}
      />
    );
  }

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <AlertMsg />
      {<LoadingButtonClick isLoading={isLoading} />}
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-0 sm:p-4 sm:ml-64"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-0 sm:p-4 border-0 border-gray-200 border-dashed sm:border-2 rounded-lg darkBorderGray">
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

            <FilesList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
