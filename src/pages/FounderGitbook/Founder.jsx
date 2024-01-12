import React, { useEffect, useState } from "react";

import "@blocknote/core/style.css";

import ProjectList from "./ProjectList";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/SideBar";

const FounderGitbook = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchProjects = async () => {
      try {
        let { data: projects, error } = await supabase
          .from("projects")
          .select("*")
          .filter("user_id", "eq", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div className="mx-8 shadow-sm bg-white pb-12">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[18%] max-md:w-full max-md:ml-0">
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div
          className="flex flex-col items-stretch w-[82%] max-md:w-full max-md:ml-0 mt-10"
          onClick={() => setIsSidebarOpen(false)}
        >
          <ProjectList projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default FounderGitbook;
