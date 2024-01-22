import React, { useEffect, useState } from "react";

import "@blocknote/core/style.css";

import "./custom-ant-design.css";

import EditorTool from "./EditorTool";

import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import FilesList from "./FilesList";
import SideBar from "../../components/SideBar";
import ResizeImage from "../../components/ResizeImage";
import Spinner from "../../components/Spinner";
import { Tooltip } from "antd";
import AlertMsg from "../../components/AlertMsg";
import AnnouncePage from "../../components/AnnouncePage";
import { toast } from "react-toastify";
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
  button3Text,
  button4Text,
  button5Text,
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
            <Tooltip
              title={`Target: ${formatNumber(button1Text)}`}
              color={"geekblue"}
            >
              <div className="truncate overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-400 text-gray-800 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate">
                  {" "}
                  Target: ${formatNumber(button1Text)}{" "}
                </p>
              </div>
            </Tooltip>
            <Tooltip
              title={` No. ticket: ${formatNumber(button2Text)}`}
              color={"geekblue"}
            >
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-green-400 hover:bg-green-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate">
                  {" "}
                  No. ticket: {formatNumber(button2Text)}{" "}
                </p>
              </div>
            </Tooltip>
            <Tooltip
              title={`Min ticket size: ${button3Text}`}
              color={"geekblue"}
            >
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Min ticket size: {button3Text} </p>
              </div>
            </Tooltip>
            <Tooltip title={` Offer: ${button4Text}`} color={"geekblue"}>
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-purple-400 hover:bg-purple-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Offer: {button4Text} </p>
              </div>
            </Tooltip>
            <Tooltip title={`Type: ${button5Text}`} color={"geekblue"}>
              <div className="  overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-pink-400 hover:bg-pink-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Type: {button5Text} </p>
              </div>
            </Tooltip>
          </div>
        </div>

        <div className="relative">
          <ResizeImage imageUrl={imageUrl} />
          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>
        </div>
      </div>
    </div>
  );
};

const DetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [company, setCompany] = useState([]);

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
          console.log("error", error);
          toast.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
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
  }, [id, user.email, user.id]);

  useEffect(() => {
    // Lấy dự án từ Supabase
    supabase
      .from("company")
      .select("*")
      .eq("project_id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
        if (error) {
          console.log("error", error);
          toast.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          setCompany(data);
        }
      });
  }, [id]);

  if (isLoading) {
    return <Spinner />; // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
  }

  if (viewError) {
    return (
      <AnnouncePage
        title="Permission Required"
        announce="This is a private project."
        describe="This is a private project and you must be invited to access and see it."
      />
    );
  }

  return (
    <div className=" bg-white dark:bg-gray-900 antialiased !p-0">
      <AlertMsg />
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-0 sm:p-4 sm:ml-64"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-0 sm:p-4 border-0 border-gray-200 border-dashed sm:border-2 rounded-lg dark:border-gray-700">
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
