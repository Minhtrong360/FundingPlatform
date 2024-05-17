import React, { useEffect, useState } from "react";

import SideBar from "../../components/SideBar";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FinancialForm from "./FinancialForm";
import { useParams } from "react-router-dom";
import { message } from "antd";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import AnnounceFMPage from "./Components/AnnounceFMPage";

function FinancialPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState([]);

  const [viewError, setViewError] = useState(false);

  const checkPermission = (projectData, userData) => {
    if (
      projectData.user_id !== user?.id &&
      !projectData.invited_user?.includes(user.email) &&
      !projectData.collabs?.includes(user.email) &&
      userData?.admin !== true
    ) {
      setViewError(true);
    }
  };

  const { id } = useParams();

  useEffect(() => {
    // Tạo một async function để lấy thông tin người dùng từ Supabase
    async function fetchUserData() {
      try {
        setIsLoading(true);
        // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id) // Thay "id" bằng trường id thực tế trong cơ sở dữ liệu của bạn
          .single(); // Sử dụng .single() để lấy một bản ghi duy nhất

        if (error) {
          throw error;
        }

        // Cập nhật state userData với thông tin người dùng đã lấy được
        if (data) {
          setCurrentUser(data);

          const { data: FMData, error } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);

          if (error) {
            message.error(error.message);
            console.error("Error fetching data", error);
            return null;
          }
          // Check permissions after loading data
          const projectData = FMData[0];

          if (projectData) {
            checkPermission(projectData, data);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    // Gọi hàm fetchUserData khi component được mount
    fetchUserData();
  }, [user?.id]); // Sử dụng user.id làm phần tử phụ thuộc để useEffect được gọi lại khi user.id thay đổi

  if (viewError) {
    return (
      <div>
        <LoadingButtonClick isLoading={isLoading} />
        <AnnounceFMPage
          title="Permission Required"
          announce="This is a private project."
          describe="Send a request to the project owner to get access."
          sendRequest={true}
        />
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 darkBg antialiased !p-0">
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0  "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-4 border-gray-300 border-dashed rounded-md darkBorderGray">
            <FinancialForm
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialPage;
