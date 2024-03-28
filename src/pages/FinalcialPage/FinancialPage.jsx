import React, { useEffect, useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FinancialForm from "./FinancialForm";

function FinancialPage() {
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
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0 "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-md darkBorderGray">
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
