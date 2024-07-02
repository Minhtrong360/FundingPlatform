import { Tabs } from "antd";
import { useState } from "react";

import Flowise from "../FinalcialPage/Components/Flowise";
import Header2 from "../Home/Header2";
import FWStream from "../FinalcialPage/Components/FlowiseStream";
import Valuation from "../FinalcialPage/Components/Perflexity";

const { TabPane } = Tabs;

export default function MarketResearch() {
  const [specificPrompt, setSpecificPrompt] = useState("");

  const [industryV, setIndustryV] = useState("");
  const [yearV, setYearV] = useState("");
  const [bussinessmodel, setBussinessmodel] = useState("");
  const [ai, setAi] = useState("");
  const [arr, setArr] = useState("");
  const [teamsize, setTeamsize] = useState("");

  const generatePromptMK = () => {
    return `${specificPrompt}`;
  };
  const generatePromptV = () => {
    return `Search revenue multiples for ${industryV} ${yearV} ${bussinessmodel} ${ai} ${arr} ${teamsize} . Calculate the estimated valuation by using ${arr} and multiples. Return the final valuation and source links.`;
  };
  let text = "Hello world!";
  let FoldString = text.repeat(500);
  return (
    <>
      {/* <Header /> */}
      <Header2 />

      <div
        key="1"
        className="max-w-4xl mt-24 mb-4 mx-auto p-6 bg-white rounded-lg  "
      >
        <h1 className="text-2xl font-semibold mb-4">Market Research</h1>
        <Tabs defaultActiveKey="1" className="">
          <TabPane tab="Market Research" key="1">
            <div className="flex flex-col">
            
          
              {/* <FWStream /> */}
              {/* <div className="block mb-1">  
                {FoldString}
                </div> */}
              <Flowise  button={"Research"} />
              {/* <DF /> */}
            </div>
          </TabPane>
          <TabPane tab="Valuation" key="2">
            <div className="flex flex-col">
              
              <Valuation  button={"Valuation"} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
