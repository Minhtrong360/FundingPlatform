import { useState } from "react";
import { Tabs } from "antd";

import Flowise from "../FinalcialPage/Components/Flowise";
import Header2 from "../Home/Header2";
import Valuation from "../FinalcialPage/Components/Perflexity";

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

  return (
    <>
      {/* <Header /> */}
      <Header2 />

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
              <Flowise button={"Research"} />
            </div>
          </TabPane>
          <TabPane tab="Valuation" style={{ fontSize: "14px" }} key="2">
            <div className="flex flex-col">
              <Valuation button={"Valuation"} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
