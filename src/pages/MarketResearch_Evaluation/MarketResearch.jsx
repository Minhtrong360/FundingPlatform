import { Tabs, Tag } from "antd";
import { useState } from "react";
import Perflexity from "../FinalcialPage/Components/Perflexity";
const { TabPane } = Tabs;

export default function MarketResearch() {
  const [industry, setIndustry] = useState("");
  const [year, setYear] = useState("");
  const [region, setRegion] = useState("");
  const [specificPrompt, setSpecificPrompt] = useState("");

  const [industryV, setIndustryV] = useState("");
  const [yearV, setYearV] = useState("");
  const [bussinessmodel, setBussinessmodel] = useState("");
  const [ai, setAi] = useState("");
  const [arr, setArr] = useState("");
  const [teamsize, setTeamsize] = useState("");

  const generatePromptMK = () => {
    return `Market information for ${industry} ${year} ${region} ${specificPrompt}. Return only figures and quantitative data in bullet points. Include links for sources at the end.`;
  };
  const generatePromptV = () => {
    return `Search revenue multiples for ${industryV} ${yearV} ${bussinessmodel} ${ai} ${arr} ${teamsize} . Calculate the estimated valuation by using ${arr} and multiples. Return the final valuation and source links.`;
  };

  return (
    <div
      key="1"
      className="max-w-4xl mt-4 mb-4 mx-auto p-6 bg-white rounded-lg shadow-xl border"
    >
      <h1 className="text-2xl font-semibold mb-4">Market Research</h1>
      <Tabs defaultActiveKey="1" className="">
        <TabPane tab="Market Research" key="1">
          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="block mb-1">Industry</div>
                <input
                  placeholder="Agritech, Ecommerce, etc."
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />

                <div className="block mb-1">Year</div>
                <input
                  placeholder="2023, 2024, etc."
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
              <div>
                <div className="block mb-1">Region</div>
                <input
                  placeholder="United States, Russia, etc."
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
                <div className="block mb-1">Specific prompt</div>
                <input
                  placeholder="Specific prompt"
                  value={specificPrompt}
                  onChange={(e) => setSpecificPrompt(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
            </div>
            <div className="block mb-1">
              <Tag>{industry} </Tag>
              <Tag>{year}</Tag>
              <Tag>{region}</Tag>
              <Tag>{specificPrompt}</Tag>
            </div>
            <Perflexity prompt={generatePromptMK()} button={"Research"} />
            {/* <DF /> */}
          </div>
        </TabPane>
        <TabPane tab="Valuation" key="2">
          <div className="flex flex-col">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="block mb-1">Industry</div>
                <input
                  placeholder="Agritech, Ecommerce, etc."
                  value={industryV}
                  onChange={(e) => setIndustryV(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />

                <div className="block mb-1">Year</div>
                <input
                  placeholder="2023, 2024, etc."
                  value={yearV}
                  onChange={(e) => setYearV(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
              <div>
                <div className="block mb-1">Business Model</div>
                <input
                  placeholder="United States, Russia, etc."
                  value={bussinessmodel}
                  onChange={(e) => setBussinessmodel(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
                <div className="block mb-1">AI</div>
                <input
                  placeholder="Specific prompt"
                  value={ai}
                  onChange={(e) => setAi(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
              <div>
                <div className="block mb-1">Estimate Arr</div>
                <input
                  placeholder="United States, Russia, etc."
                  value={arr}
                  onChange={(e) => setArr(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
                <div className="block mb-1">Teamsize</div>
                <input
                  placeholder="Specific prompt"
                  value={teamsize}
                  onChange={(e) => setTeamsize(e.target.value)}
                  className="mt-4 mb-4 py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
            </div>

            <Perflexity prompt={generatePromptV()} button={"Valuation"} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
