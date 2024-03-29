import React, { useState } from "react";

import SideBar from "../../components/SideBar";
// import UserInfoSettings from "./UserProfile";
import NewUserPage from "./NewUserPage";

const UserPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0 "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-md darkBorderGray">
            {/* <UserInfoSettings /> */}
            <NewUserPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
