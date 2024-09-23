import React, { useState } from "react";

import SideBar from "../../components/SideBar";
import NewUserPage from "./NewUserPage";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

const UserPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <HomeHeader />

      <NewUserPage />
    </div>
  );
};

export default UserPage;
