import { useEffect, useState } from "react";
import { Tabs } from "antd";

import Flowise from "../FinalcialPage/Components/Flowise";
import Header from "../Home/Header";
import Valuation from "../FinalcialPage/Components/Perflexity";
import { useAuth } from "../../context/AuthContext";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

const { TabPane } = Tabs;

export default function MarketResearch() {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const getTabTitle = (key) => {
    switch (key) {
      case "1":
        return "Market Research";
      case "2":
        return "Valuation";
      default:
        return "Market Research";
    }
  };

  const { currentUser } = useAuth();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (
      !currentUser[0]?.plan ||
      currentUser[0]?.plan === "Free" ||
      currentUser[0]?.plan === null ||
      currentUser[0]?.plan === undefined ||
      currentUser[0]?.subscription_status === "canceled" ||
      currentUser[0]?.subscription_status === "cancelled"
    ) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [currentUser[0]?.plan, currentUser[0]?.subscription_status]);

  return (
    <>
      {/* <HomeHeader /> */}
      <HomeHeader />

      <div
        key="1"
        className="max-w-4xl mt-24 mb-4 mx-auto p-6 bg-white rounded-lg"
      >
        <h1 className="text-2xl font-semibold mb-4">
          {getTabTitle(activeTab)}
        </h1>
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          <TabPane tab="Market Research" style={{ fontSize: "14px" }} key="1">
            <div className="flex flex-col">
              <Flowise
                button={"Research"}
                isButtonDisabled={isButtonDisabled}
              />
            </div>
          </TabPane>
          <TabPane tab="Valuation" style={{ fontSize: "14px" }} key="2">
            <div className="flex flex-col">
              <Valuation
                button={"Valuation"}
                isButtonDisabled={isButtonDisabled}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
