import { Tag, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const VCCard = ({
  data,
  codeInCompetition,
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
        if (setSelectedCodeFull) {
          setSelectedCodeFull(data);
        }
        if (onSelectCode) {
          onSelectCode(data.id);
        }
        if (filterProjectsByCode) {
          filterProjectsByCode(data.id);
        }
        if (codeInCompetition) {
          codeInCompetition(data.code);
        }
      }}
      className="flex flex-col h-full w-full bg-white border rounded-md shadow-md transition-all duration-300  hover:shadow-lg cursor-pointer"
    >
      <div className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden">
        {data?.avatar_url ? (
          <>
            <img
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
              src={data?.avatar_url}
              alt="Company Avatar"
            />
          </>
        ) : (
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
            src="https://media.istockphoto.com/id/1342229191/vi/anh/m%E1%BB%99t-h%E1%BB%93-n%C6%B0%E1%BB%9Bc-c%C3%B3-h%C3%ACnh-d%E1%BA%A1ng-c%E1%BB%A7a-c%C3%A1c-l%E1%BB%A5c-%C4%91%E1%BB%8Ba-tr%C3%AAn-th%E1%BA%BF-gi%E1%BB%9Bi-%E1%BB%9F-gi%E1%BB%AFa-thi%C3%AAn-nhi%C3%AAn-hoang-s%C6%A1-m%E1%BB%99t-ph%C3%A9p-%E1%BA%A9n.jpg?s=2048x2048&w=is&k=20&c=Yf6EtqbY4M9wanhrAhqFtyWXf1N0usDnSQXF8HUX3L0="
            alt="Company Avatar"
          />
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
        <p
          className={`mb-2 text-sm font-normal overflow-hidden text-ellipsis line-clamp-6 text-blue-600`}
        >
          Expired At:{" "}
          <span
            className={`${new Date() > new Date(data.expired_at) ? "text-red-600" : "text-blue-600"}`}
          >
            {data.expired_at}
          </span>
        </p>
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

export default VCCard;
