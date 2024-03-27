import React, { useEffect, useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";

import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

function FinancialList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [finances, setFinances] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    // Tải danh sách finance từ Supabase dựa trên user.id
    const loadFinances = async () => {
      const { data, error } = await supabase
        .from("finance")
        .select("*")
        .filter("user_id", "eq", user.id);

      if (error) {
        message.error(error.message);
        console.error("Lỗi khi tải danh sách finance:", error.message);
      } else {
        setFinances(data);
      }
    };

    loadFinances();
  }, [user.id]);

  const navigate = useNavigate();
  console.log("finance", finances);
  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="sm:ml-16 ml-0" onClick={() => setIsSidebarOpen(false)}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray">
            <div className="bg-white darkBg antialiased p-0">
              {/* Hiển thị danh sách các finance dưới dạng thẻ Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:ml-16 ml-0">
                {finances.map((finance) => (
                  <div
                    key={finance.id}
                    className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray"
                  >
                    <h2 className="text-xl font-semibold">{finance.name}</h2>
                    <p className="text-gray-600">{finance.email}</p>
                    <button onClick={() => navigate(finance.id)}>Select</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialList;
