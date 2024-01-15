import React, { useEffect, useState } from "react";

import "@blocknote/core/style.css";

import ProjectList from "./ProjectList";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/SideBar";
import { toast } from "react-toastify";

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
        toast.error(error.message);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div className=" bg-white dark:bg-gray-900 antialiased !p-0">
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-4 sm:ml-64" onClick={() => setIsSidebarOpen(false)}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <ProjectList projects={projects} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderGitbook;
