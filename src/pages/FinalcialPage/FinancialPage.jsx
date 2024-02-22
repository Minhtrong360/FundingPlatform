import React, { useEffect, useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";
import FinancialForm from "./FinancialForm";

import AnnouncePage from "../../components/AnnouncePage";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import Z from "../test03";

function FinancialPage({ subscribed }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-4 sm:ml-64" onClick={() => setIsSidebarOpen(false)}>
          {/* {subscribed ? ( */}
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg darkBorderGray">
            {/* <FinancialForm /> */}
            <Z />
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
