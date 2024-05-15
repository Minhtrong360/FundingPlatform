import React, { useState, useEffect } from "react";

import apiService from "../../app/apiService";
import StatBadge from "./components/StatBadge";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

// import FinanceStatBadge from "./components/FinanceStatBadge";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import StatBadgeByDay from "./components/StatBadgeByDay";
import { message } from "antd";

const FundraisingRecords = () => {
  const [ggData, setGgData] = useState([]);
  // const [financeGoogleData, setFinanceGoogleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const { user } = useAuth();

  const [ggDataByDay, setGgDataByDay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true

      const { data: projects, error } = await supabase
        .from("projects")
        .select("id")
        .eq("user_id", user.id);

      if (error) {
        message.error(error.message);
        console.error("Error fetching projects from Supabase:", error.message);
        // setIsLoading(false); // Set loading state to false
        return;
      }

      const ids = projects.map((project) => project.id);

      const response = await apiService.post("googleAnalytics/runReport", {
        ids,
      });
      const response2 = await apiService.post(
        "googleAnalytics/trackUserAndEvent",
        {
          ids,
        }
      );

      setGgData(response.data);
      setGgDataByDay(response2.data);
      // setIsLoading(false); // Set loading state to false once data is fetched
    };

    fetchData();
  }, [user.id]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true); // Set loading state to true

  //     const { data: finance, error } = await supabase
  //       .from("finance")
  //       .select("id")
  //       .eq("user_id", user.id);

  //     if (error) {
  //       message.error(error.message);
  //       console.error("Error fetching finances from Supabase:", error.message);
  //       setIsLoading(false); // Set loading state to false
  //       return;
  //     }

  //     const ids = finance.map((finance) => finance.id);

  //     const response = await apiService.post("googleAnalytics/runReport", {
  //       ids,
  //     });
  //     console.log("response", response);
  //     setFinanceGoogleData(response.data);
  //     setIsLoading(false); // Set loading state to false once data is fetched
  //   };

  //   fetchData();
  // }, [user.id]);

  return (
    <div className="shadow-sm bg-white">
      <LoadingButtonClick isLoading={isLoading} />
      <div className="flex flex-col gap-5 max-md:flex-col max-md:items-stretch max-md:gap-0">
        <h2 className="ml-5 text-left text-2xl font-semibold md:text-4xl md:leading-tight darkTextWhite text-black-500 my-12">
          Dashboard Records
        </h2>
        <div className="items-stretch max-md:w-full max-md:ml-0 mx-auto">
          <div className="flex justify-end text-lg font-semibold my-4 mx-4">
            Project dashboard
          </div>
          <StatBadge ggData={ggData} setIsLoading={setIsLoading} />
        </div>
        <div className="items-stretch max-md:w-full max-md:ml-0 mx-auto">
          <div className="flex justify-end text-lg font-semibold my-4 mx-4">
            Tracking by days
          </div>
          <StatBadgeByDay ggData={ggDataByDay} setIsLoading={setIsLoading} />
        </div>
        {/* <div className="items-stretch max-md:w-full max-md:ml-0  mx-auto">
          <div className="flex justify-end text-lg font-semibold my-4">
            Financial dashboard
          </div>
          <FinanceStatBadge ggData={financeGoogleData} />
        </div> */}
      </div>
    </div>
  );
};

export default FundraisingRecords;
