import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabase";
import apiService from "../../../app/apiService";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

const AnnounceFMPage = ({
  title,
  announce,
  describe,
  highlightedWord,
  sendRequest,
  button,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [firstPart, lastPart] = announce.split(highlightedWord);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        if (id) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("finance")
            .select("*")
            .match({ id: id })
            .single();

          if (error) {
            console.log(error.message);
          } else {
            setCurrentProject(data);
          }
        }
        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu
      } catch (error) {
        console.log(error.message);

        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (có lỗi)
      }
    }

    // Gọi hàm để lấy Markdown khi component được mount
    if (id) {
      fetchMarkdown();
    } else {
      setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (không có project)
    }
  }, [id]);

  const handleSendRequest = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      setIsLoading(true);
      const response = await apiService.post("/request/project", {
        user_email: user.email,
        owner_email: currentProject.user_email,
        project_name: currentProject.name,
      });
      if (response) {
        message.success(
          "The request was sent successfully. Please wait for the owner to accept."
        );
      }
    } catch (error) {
      console.log("error", error);
      message.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <section className={`bg-white  `}>
      <LoadingButtonClick isLoading={isLoading} />
      <div className="container flex items-center min-h-screen px-4 sm:px-6 py-12 mx-auto">
        <div className="w-full">
          <p className="text-3xl sm:text-5xl font-medium text-blue-600 ">
            {title}
          </p>
          <h1
            className={`mt-3 text-xl sm:text-2xl font-semibold text-gray-800  `}
          >
            {firstPart}
            <span className="text-blue-600">{highlightedWord}</span>
            {lastPart}
          </h1>
          <p className={`mt-4 text-sm sm:text-base text-gray-800 `}>
            {describe}
          </p>

          <div className="flex flex-col sm:flex-row items-center mt-6 gap-x-3 gap-y-2">
            {button ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 darkHoverBgBlue darkBgBlue"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 darkHoverBgBlue darkBgBlue"
              >
                Homepage
              </button>
            )}

            {sendRequest && (
              <button
                onClick={handleSendRequest}
                className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 darkHoverBgBlue darkBgBlue"
              >
                Send Request
              </button>
            )}
            {title === "Free trial" && (
              <button
                onClick={() => navigate("/pricing")}
                className="w-full sm:w-auto px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700 darkHoverBgBlue darkBgBlue"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnounceFMPage;
