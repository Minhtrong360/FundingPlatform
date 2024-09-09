import React, { useEffect, useState } from "react";

import "@blocknote/core/style.css";

import ProjectList from "./ProjectList";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/SideBar";

import { message } from "antd";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

const FounderGitbook = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchProjects = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        setIsLoading(true);
        // Lấy các dự án có user_id = user.id
        let { data: projects1, error: error1 } = await supabase
          .from("projects")
          .select("*")
          .eq("user_id", user.id);

        if (error1) {
          console.log("error1", error1);
          throw error1;
        }

        // Lấy các dự án có user.email trong mảng collabs
        let { data: projects2, error: error2 } = await supabase
          .from("projects")
          .select("*")
          .contains("collabs", [user.email]);

        if (error2) {
          console.log("error2", error2);
          throw error2;
        }

        let { data: projects3, error: error3 } = await supabase
          .from("projects")
          .select("*")
          .contains("invited_user", [user.email]);

        if (error3) {
          console.log("error3", error3);
          throw error3;
        }

        // Kết hợp các dự án từ hai kết quả truy vấn trên
        const combinedProjects = [...projects1, ...projects2, ...projects3];

        // Sử dụng một set để loại bỏ các dự án trùng lặp
        const uniqueProjects = Array.from(
          new Set(combinedProjects.map((project) => project.id))
        ).map((id) => combinedProjects.find((project) => project.id === id));

        setProjects(uniqueProjects);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        message.error(error.message);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, []);

  return (
    <div className=" bg-white darkBg antialiased !p-0">
      <HomeHeader />
      <div className="mt-24 sm:p-4 p-0 border-gray-300 border-dashed rounded-md darkBorderGray">
        <ProjectList projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FounderGitbook;
