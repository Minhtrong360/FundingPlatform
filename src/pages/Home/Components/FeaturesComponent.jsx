import {
  NoteOutlined,
  PhotoOutlined,
  YouTube,
  TimelineOutlined,
  LockOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import { useState } from "react";
const FeaturesComponent = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className=" max-w-[85rem] px-3 py-20 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <h3 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray text-center p-4 mb-10">
        Features
      </h3>
      {/* Tab Nav */}
      <nav
        className="grid sm:grid-cols-2 lg:grid-cols-3 items-center   gap-6 md:gap-10"
        aria-label="Tabs"
        role="tablist"
      >
        {/* Tab 1 */}
        <button
          type="button"
          className={`text-left  size-full bg-white shadow-lg rounded-md p-5 darkBgSlate ${
            activeTab === 1 ? "hs-tab-active:bg-gray-100" : ""
          }`}
          onClick={() => handleTabClick(1)}
          id="tabs-with-card-item-1"
          data-hs-tab="#tabs-with-card-1"
          aria-controls="tabs-with-card-1"
          role="tab"
        >
          {/* <svg className="mb-3 flex-shrink-0 hidden sm:block size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/></svg>
           */}
          <TimelineOutlined
            style={{ fontSize: 30 }}
            className="flex-shrink-0 size-7 p-1 mb-3"
          />
          <span className="mt-5">
            <span
              className={`block text-xl font-semibold text-gray-800 darkTextWhite ${
                activeTab === 1
                  ? "hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-500"
                  : "dark:text-gray-200"
              }`}
            >
              Financial Model
            </span>
            <span className="hidden lg:block mt-2 text-gray-800 dark:text-gray-200">
              Create a business, whether you’ve got a fresh idea.
            </span>
          </span>
        </button>

        {/* Tab 2 */}
        <button
          type="button"
          className={`text-left  size-full bg-white shadow-lg rounded-md p-5 darkBgSlate ${
            activeTab === 2 ? "hs-tab-active:bg-gray-100" : ""
          }`}
          onClick={() => handleTabClick(2)}
          id="tabs-with-card-item-2"
          data-hs-tab="#tabs-with-card-2"
          aria-controls="tabs-with-card-2"
          role="tab"
        >
          {/* <svg className="mb-3 flex-shrink-0 hidden sm:block size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
           */}
          <LockOutlined
            style={{ fontSize: 30 }}
            className="flex-shrink-0 size-7 p-1 mb-3"
          />
          <span className="mt-5">
            <span
              className={`block text-xl font-semibold text-gray-800 darkTextWhite ${
                activeTab === 2
                  ? "hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-500"
                  : "dark:text-gray-200"
              }`}
            >
              Automation on a whole new level
            </span>
            <span className="hidden lg:block mt-2 text-gray-800 dark:text-gray-200">
              Use automation to scale campaigns profitably and save time doing
              it.
            </span>
          </span>
        </button>

        {/* Tab 3 */}
        <button
          type="button"
          className={`text-left  size-full bg-white shadow-lg rounded-md p-5 darkBgSlate ${
            activeTab === 3 ? "hs-tab-active:bg-gray-100" : ""
          }`}
          onClick={() => handleTabClick(3)}
          id="tabs-with-card-item-3"
          data-hs-tab="#tabs-with-card-3"
          aria-controls="tabs-with-card-3"
          role="tab"
        >
          {/* <svg className="mb-3 flex-shrink-0 hidden sm:block size-7 hs-tab-active:text-blue-600 text-gray-800 dark:hs-tab-active:text-blue-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
           */}
          <NoteOutlined
            style={{ fontSize: 30 }}
            className="flex-shrink-0 size-7 p-1 mb-3"
          />
          <span className="mt-5">
            <span
              className={`block text-xl font-semibold text-gray-800 darkTextWhite ${
                activeTab === 3
                  ? "hs-tab-active:text-blue-600 dark:hs-tab-active:text-blue-500"
                  : "dark:text-gray-200"
              }`}
            >
              Solving problems for every team
            </span>
            <span className="hidden lg:block mt-2 text-gray-800 dark:text-gray-200">
              One tool for your company to share knowledge and ship projects.
            </span>
          </span>
        </button>
      </nav>
      {/* End Tab Nav */}

      {/* Tab Content */}
      <div className="mt-12 md:mt-16">
        <div
          id="tabs-with-card-1"
          className={activeTab === 1 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="tabs-with-card-item-1"
        >
          {/* Devices */}
          <div className="max-w-5xl px-2 sm:px-6 lg:px-24  mx-auto">
            {/* Browser Device */}
            <figure className=" ml-auto mr-auto relative z-10 max-w-full w-2xl h-auto rounded-b-lg shadow-lg dark:shadow-lg-lg dark:shadow-lg-xl">
              <div className="relative flex items-center md:max-w-3xl bg-white border-b border-gray-100 rounded-t-lg py-2 px-6 sm:px-24 ">
                <div className="flex space-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                </div>
                <a
                  href="https:www.beekrowd.com"
                  className="flex justify-center items-center w-full bg-gray-200 text-xs text-gray-600 rounded-sm sm:text-sm "
                >
                  www.beekrowd.com
                </a>
              </div>

              <div className="w-full min-w-400px max-w-800px rounded-b-lg">
                <div
                  className="relative w-full overflow-hidden rounded-b-lg"
                  style={{ paddingTop: "56.25%" }}
                >
                  <p>
                    <iframe
                      title="YouTube video player"
                      className="absolute top-0 left-0 right-0 w-full h-full rounded-b-lg"
                      src="https://www.youtube.com/embed/56lpx33qSpI?si=CaJKbilv0ghPwRLC&autoplay=1&mute=1&loop=1&playlist=56lpx33qSpI"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </p>
                </div>
              </div>
            </figure>
            {/* End Browser Device */}
          </div>
        </div>

        <div
          id="tabs-with-card-2"
          className={activeTab === 2 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="tabs-with-card-item-2"
        >
          {/* Content for Tab 2 */}
          {/* Devices */}
          <div className="max-w-5xl px-2 sm:px-6 lg:px-24  mx-auto">
            {/* Browser Device */}
            <figure className=" ml-auto mr-auto relative z-10 max-w-full w-2xl h-auto rounded-b-lg shadow-lg dark:shadow-lg-lg dark:shadow-lg-xl">
              <div className="relative flex items-center md:max-w-3xl bg-white border-b border-gray-100 rounded-t-lg py-2 px-6 sm:px-24 ">
                <div className="flex space-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                </div>
                <a
                  href="https:www.beekrowd.com"
                  className="flex justify-center items-center w-full bg-gray-200 text-xs text-gray-600 rounded-sm sm:text-sm "
                >
                  www.beekrowd.com
                </a>
              </div>

              <div className="w-full min-w-400px max-w-800px rounded-b-lg">
                <div
                  className="relative w-full overflow-hidden rounded-b-lg"
                  style={{ paddingTop: "56.25%" }}
                >
                  <p>
                    <iframe
                      title="YouTube video player"
                      className="absolute top-0 left-0 right-0 w-full h-full rounded-b-lg"
                      src="https:www.youtube.com/embed/5Eg5xvAoooM?si=hjh5CGAuu4pANs6J"
                      width="560"
                      height="315"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </p>
                </div>
              </div>
            </figure>
            {/* End Browser Device */}
          </div>
        </div>

        <div
          id="tabs-with-card-3"
          className={activeTab === 3 ? "block" : "hidden"}
          role="tabpanel"
          aria-labelledby="tabs-with-card-item-3"
        >
          {/* Content for Tab 3 */}
          {/* Devices */}
          <div className="max-w-5xl px-2 sm:px-6 lg:px-24  mx-auto">
            {/* Browser Device */}
            <figure className=" ml-auto mr-auto relative z-10 max-w-full w-2xl h-auto rounded-b-lg shadow-lg dark:shadow-lg-lg dark:shadow-lg-xl">
              <div className="relative flex items-center md:max-w-3xl bg-white border-b border-gray-100 rounded-t-lg py-2 px-6 sm:px-24 ">
                <div className="flex space-x-1 absolute top-1/2 left-4 -translate-y-1/2">
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                  <span className="w-2 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></span>
                </div>
                <a
                  href="https:www.beekrowd.com"
                  className="flex justify-center items-center w-full bg-gray-200 text-xs text-gray-600 rounded-sm sm:text-sm "
                >
                  www.beekrowd.com
                </a>
              </div>

              <div className="w-full min-w-400px max-w-800px rounded-b-lg">
                <div
                  className="relative w-full overflow-hidden rounded-b-lg"
                  style={{ paddingTop: "56.25%" }}
                >
                  <p>
                    <iframe
                      title="YouTube video player"
                      className="absolute top-0 left-0 right-0 w-full h-full rounded-b-lg"
                      src="https:www.youtube.com/embed/MYPVQccHhAQ?si=7cwoVCXBEWRqKSbk"
                      width="560"
                      height="315"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </p>
                </div>
              </div>
            </figure>
            {/* End Browser Device */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesComponent;
