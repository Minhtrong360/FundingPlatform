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
import SideBar from "../../components/SideBar";
import ResizeImage from "../../components/ResizeImage";
import Spinner from "../../components/Spiner";

function formatNumber(value) {
  // Kiểm tra xem value có phải là một chuỗi không
  if (typeof value !== "string") {
    // Nếu không phải chuỗi, chuyển đổi nó thành chuỗi
    value = String(value);
  }

  // Convert to number first to remove any non-numeric characters
  const number = Number(value.replace(/[^0-9]/g, ""));
  // Format the number with commas
  return number.toLocaleString();
}

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



const DetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

 

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
            data.user_id !== user?.id &&
            !data.invited_user?.includes(user.email)
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
    return (
      <div className="flex justify-center items-center top-1/2 left-1/2">
        <Spinner />
      </div>
    ); // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
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
        <SideBar
          id={id}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="p-4 sm:ml-64" onClick={toggleSidebar}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <HeroSection
              title={company.name}
              description={company.description}
              button1Text={company.target_amount}
              button2Text={company.ticket_size}
              button3Text={company.no_ticket}
              button4Text={company.offer}
              button5Text={company.offer_type}
              imageUrl={company.url}
            />
            <div className="flex justify-center">
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
