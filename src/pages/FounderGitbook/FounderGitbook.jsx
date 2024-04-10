import React, { useEffect, useState } from "react";

import chatbot from "./chatbot.png";

import "@blocknote/core/style.css";
import ChatgptClone from "../ChatGPT/chatgpt";

import EditorTool from "../FounderGitbook/EditorTool";
import ProjectList from "./ProjectList";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./SideBar";
import { message } from "antd";
// import { toast } from "react-toastify";

const FounderGitbook = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState();

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchProjects = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        let { data: projects, error } = await supabase
          .from("projects")
          .select("*");

        if (error) {
          console.log("error", error);
          throw error;
        }

        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error(error.message);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const [showChatbot, setShowChatbot] = useState(false);

  const handleChatbotClick = () => {
    setShowChatbot(!showChatbot); // Toggle the chatbot component
  };
  const handleClickProjectId = (projectId) => {
    // Xử lý projectId ở đây (ví dụ: hiển thị thông tin dự án hoặc thực hiện một hành động khác)
    console.log("Selected Project ID:", projectId);
    setProjectId(projectId);
  };

  return (
    <div className="mx-8 shadow-sm bg-white pb-12">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[18%] max-md:w-full max-md:ml-0">
          <Sidebar />
        </div>
        <div className="flex flex-col items-stretch w-[82%] max-md:w-full max-md:ml-0 mt-10">
          <div>
            <ProjectList
              projects={projects}
              handleClickProjectId={handleClickProjectId}
            />
            <br />

            <div className="text-left">
              <EditorTool projectId={projectId} />
            </div>

            <div className="hover:cursor-pointer fixed bottom-14 right-10">
              {/* Render the chatbot component based on showChatbot state */}
              {showChatbot && <ChatgptClone />}

              {/* Icon for the chatbot */}
              <img
                src={chatbot}
                alt=""
                className="chatbot-icon fixed bottom-4 right-4 hover:cursor-pointer w-14 h-14"
                onClick={handleChatbotClick}
              ></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderGitbook;
