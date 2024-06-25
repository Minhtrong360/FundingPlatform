import { useNavigate } from "react-router-dom";

import { Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const UniCard = ({
  data,
  codeInCompetition,
  setSelectedCode,
  setSelectedCodeFull,
  onSelectCode,
  filterProjectsByCode,
  projectCounts,
}) => {
  const [universityInfo, setUniversityInfo] = useState("");
  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data: uniInfo, error } = await supabase
          .from("workspace")
          .select("*")
          .eq("UniID", data?.UniID);

        if (error) {
          throw error;
        }

        setUniversityInfo(uniInfo[0]);
      } catch (error) {
        console.error("Error fetching code data:", error);
      }
    };

    fetchCodeData();
  }, [data]);

  return (
    <div
      onClick={() => {
        setSelectedCode(data);
        if (setSelectedCodeFull) {
          setSelectedCodeFull(data);
        }
        if (onSelectCode) {
          onSelectCode(data.code);
        }
        if (filterProjectsByCode) {
          filterProjectsByCode(data.code);
        }
        if (codeInCompetition) {
          codeInCompetition(data.code);
        }
      }}
      className="flex flex-col h-full w-full bg-white border rounded-md shadow-md transition-all duration-300  hover:shadow-lg cursor-pointer"
    >
      <div className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden">
        {universityInfo?.avatar_url ? (
          <>
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
              src="https://images.unsplash.com/photo-1603612692333-7bac35e43500?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Company Avatar"
            />
          </>
        ) : (
          <div className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "></div>
        )}
      </div>
      <div className="flex-grow p-5">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 ">
          {data.name}
        </h5>
        <p className="mb-2 text-sm text-blue-600 font-normal  overflow-hidden text-ellipsis line-clamp-6">
          {data.code}
        </p>
        <Tooltip title={data.description}>
          <p className="mb-2 text-sm text-left font-normal text-gray-700  overflow-hidden text-ellipsis line-clamp-6">
            {data.description}
          </p>
        </Tooltip>
      </div>

      <div className="px-5 pb-5  rounded-b-lg">
        <p className="mb-2 text-sm text-blue-600 font-normal  overflow-hidden text-ellipsis line-clamp-6">
          Number candidate: {projectCounts[data.id] || 0}
        </p>
        <div className="flex justify-between items-center">
          <Tooltip title={universityInfo?.university}>
            <Tag
              className={`max-w-32 mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center   rounded-3xl truncate`}
            >
              {universityInfo?.university}
            </Tag>
          </Tooltip>

          <Tag
            className={` ${
              data.publish
                ? "bg-yellow-300 text-black"
                : "bg-bg-gray-50 border border-gray-300 text-black"
            } mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center   rounded-3xl`}
          >
            {data.publish ? "Published" : "Not public"}
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default UniCard;
