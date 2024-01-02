import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import "@blocknote/core/style.css";

import "./custom-ant-design.css";
// import export icon from antd

import MarketDataAI from "../marketDataAI";
import SideBar from "../DashBoard/SideBar";
import EditorTool from "../FounderGitbook/EditorTool";
import { Progress } from "antd";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

function Header() {
  return (
    <div>
      <p className="inline-block text-md font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
        BeeKrowd: A featured profile for 2024
      </p>
      <div className="mt-4 md:mb-12 max-w-2xl">
        <h1 className="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl dark:text-gray-200">
          Santa Pocket
        </h1>
      </div>
      <div className="video-container flex justify-center">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/GP5jXj0O4OM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function SignupForm() {
  const [percentage, setPercentage] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Hàm để cập nhật phần trăm cho mỗi trường và tổng phần trăm
  const updatePercentage = (value) => {
    const newTotalPercentage = totalPercentage + value;
    setTotalPercentage(newTotalPercentage);
    setPercentage(newTotalPercentage / 6); // Chia đều thành 6 trường
  };

  return (
    <form>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <div className="p-4 sm:p-7 flex flex-col bg-white rounded-lg shadow-lg dark:bg-slate-900">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Fundraising info
            </h1>
            <Progress percent={percentage} />
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-2 gap-4 ">
              {/* Input fields go here */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                    onBlur={() => updatePercentage(1)}
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Target amount
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-last-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Doe"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-last-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Valuation
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="email"
                    id="hs-hero-signup-form-floating-input-email"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="you@email.com"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-email"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Min ticket
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-company-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Preline"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-company-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    % Equity
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Valuation
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Offering type
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5"></div>
          </div>
        </div>
      </div>
    </form>
  );
}

function YoutubeAndForm() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className=" grid items-end md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Header />
        </div>
        <div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid items-center lg:grid-cols-12 gap-6 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:pe-6 xl:pe-12">
            <p className="text-6xl font-bold leading-10 text-blue-600">
              92%
              <span className="ms-1 inline-flex items-center gap-x-1 bg-gray-200 font-medium text-gray-800 text-xs leading-4 rounded-full py-0.5 px-2 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                </svg>
                +7% this month
              </span>
            </p>
            <p className="mt-2 sm:mt-3 text-gray-500">
              of U.S. adults have bought from businesses using Space
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 relative lg:before:absolute lg:before:top-0 lg:before:-start-12 lg:before:w-px lg:before:h-full lg:before:bg-gray-200 lg:before:dark:bg-gray-700">
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-3xl font-semibold text-blue-600">99.95%</p>
              <p className="mt-1 text-gray-500">in fulfilling orders</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-blue-600">2,000+</p>
              <p className="mt-1 text-gray-500">partner with Preline</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-blue-600">85%</p>
              <p className="mt-1 text-gray-500">this year alone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChatBotTest = () => {
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
    <div className="shadow-sm bg-white pb-12">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col  w-[18%] max-md:w-full max-md:ml-0 mr-4">
          <SideBar />
        </div>
        <div className="flex flex-col items-stretch w-[82%] max-md:w-full max-md:ml-0 mt-10">
          <YoutubeAndForm />
          <Stats />

          {/* <EditorTool /> */}
          <EditorTool />
        </div>
        <div className="flex flex-col  w-[25%] max-md:w-full max-md:ml-0 mr-4">
          <MarketDataAI />
        </div>
      </div>
    </div>
  );
};

export default ChatBotTest;
