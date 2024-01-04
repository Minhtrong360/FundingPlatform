import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import "@blocknote/core/style.css";

import "./custom-ant-design.css";
// import export icon from antd
import { YoutubeOutlined } from "@ant-design/icons";
import MarketDataAI from "../marketDataAI";
import SideBar from "../DashBoard/SideBar";
import EditorTool from "./EditorTool";
import { Progress } from "antd";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FilesList from "./FilesList";

const HeroSection = ({
  title,
  description,
  button1Text,
  button2Text,
  imageUrl,
}) => {
  return (
    <div className="max-w-[85rem] mx-auto mt-24 px-4 sm:px-6 lg:px-8 z-0">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              {button1Text}
              {/* Replace with actual SVG */}
              <span>→</span>
            </a>
            <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              {button2Text}
            </a>
            <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              {button2Text}
            </a>
            <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              {button2Text}
            </a>
          </div>
        </div>

        <div className="relative ms-4">
          <img
            className="w-full rounded-md"
            src={imageUrl}
            alt="Image Description"
          />
          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>
        </div>
      </div>
    </div>
  );
};

const VideoComponent = ({ videoUrl }) => {
  return (
    <div className="w-[100%] h-[100%]">
      <ReactPlayer
        url={videoUrl}
        controls={true} // Display video controls
        width="100%" // Set the width of the player
        height="100%" // Set the height of the player
      />
    </div>
  );
};

function ProgressBar({ progress }) {
  // Calculate the width based on the progress value
  const width = `${progress}%`;

  return (
    <div
      className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap dark:bg-blue-500 transition duration-500"
        style={{ width }}
      >
        {progress}%
      </div>
    </div>
  );
}

function InputField({ name, value, onChange, label }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
  );
}

const DetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("sizebarr", isSidebarOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { id } = useParams();
  const { user } = useAuth();
  const [viewError, setViewError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lấy dự án từ Supabase
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
        if (error) {
          console.error(error);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          console.log("user Id", user.id);
          console.log("data.user_id", data.user_id);

          // Kiểm tra quyền truy cập của người dùng
          if (
            data.status === false &&
            data.user_id !== user.id &&
            !data.invited_user?.includes(user.id)
          ) {
            // Kiểm tra xem dự án có trạng thái false, không thuộc về người dùng và không được mời tham gia
            // Hoặc có thể kiểm tra invited_user ở đây

            // Hiển thị thông báo hoặc thực hiện hành động tương ứng
            setViewError(true);
          } else {
            setViewError(false);
          }
        }
      });
  }, [id, user.id]);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
  }

  if (viewError) {
    return <div>You are not allowed to see it</div>;
  }

  return (
    <div
      style={{ height: "600px" }}
      className="p-5 bg-white dark:bg-gray-900 antialiased !p-0"
      onClick={toggleSidebar}
    >
      <div id="exampleWrapper" className="">
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <aside
          id="default-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
            isSidebarOpen ? "" : "-translate-x-full sm:translate-x-0"
          }`}
          aria-label="Sidebar"
          aria-hidden={!isSidebarOpen}
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"></path>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"></path>
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </a>
              </li>
              {/* Add more list items as needed */}
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64" onClick={toggleSidebar}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <HeroSection
              title="BeeKrowd"
              description="Fintech company the href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value."
              button1Text="Get started"
              button2Text="Contact sales team"
              imageUrl="https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />

            <div class="flex justify-center max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
              <EditorTool />
            </div>
            <FilesList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPage;
