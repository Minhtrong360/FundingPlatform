import React, { useState, useEffect } from "react";

import apiService from "../../app/apiService";
import StatBadge from "./components/StatBadge";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

const FundraisingRecords = () => {
  const [ggData, setGgData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách các dự án từ Supabase dựa trên user_id
      const { data: projects, error } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching projects from Supabase:", error.message);
        return;
      }

      // Lấy danh sách project.id và lưu vào mảng id
      const id = projects.map((project) => project.id);

      // Gọi API Google Analytics với danh sách id
      const response = await apiService.post("googleAnalytics/runReport", {
        id,
      });
      console.log("response", response);
      setGgData(response.data);
    };

    fetchData();
  }, [user.id]);

  return (
    <div className="shadow-sm bg-white pb-12">
      <div className="flex flex-col gap-5  max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className=" items-stretch max-md:w-full max-md:ml-0 mt-10 justify-left">
          <h2 className="ml-5 text-left text-2xl font-semibold md:text-4xl md:leading-tight dark:text-white text-black-500">
            Dashboard Records
          </h2>
          <StatBadge ggData={ggData} />
        </div>
      </div>
    </div>
  );
};

export default FundraisingRecords;
