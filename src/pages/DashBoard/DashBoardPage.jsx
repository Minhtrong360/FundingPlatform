import React, { useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";
import Dashboard from "./DashBoard";

function DashBoardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className=" bg-white dark:bg-gray-900 antialiased !p-0">
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-4 sm:ml-64" onClick={() => setIsSidebarOpen(false)}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
