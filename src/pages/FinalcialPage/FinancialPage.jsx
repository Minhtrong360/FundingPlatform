import React, { useEffect, useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FinancialForm from "./FinancialForm";

function FinancialPage({ subscribed }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    // Tạo một async function để lấy thông tin người dùng từ Supabase
    async function fetchUserData() {
      try {
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
        }
      } catch (error) {}
    }

    // Gọi hàm fetchUserData khi component được mount
    fetchUserData();
  }, [user?.id]); // Sử dụng user.id làm phần tử phụ thuộc để useEffect được gọi lại khi user.id thay đổi

// 1
  
  return (
    <div className=" bg-white darkBg antialiased !p-0">
       {/* {subscribed ? ( */}
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
         {/* {subscribed ? ( */}
        <div className="p-4 ml-24" onClick={() => setIsSidebarOpen(false)}>
          {/* {subscribed ? ( */}
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray">
             {/* {subscribed ? ( */}
            <FinancialForm
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
             {/* {subscribed ? ( */}
          </div>
          {/* ) : (
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray">
              <AnnouncePage
                title="Subscription Required"
                announce="Financial model helps you build your business plan and you need to subscribe."
                describe="This is our special feature that helps startups or new businesses build their business plans. We provide tools with AI to build your BS, IS, FS... Please upgrade your plan to experience this exciting feature"
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default FinancialPage;
