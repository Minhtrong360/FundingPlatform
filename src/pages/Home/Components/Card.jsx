import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { Flex, Tag } from "antd";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,
  project_id,
  canClick,
  formData,
  setFormData,
}) => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!project_id) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", project_id)
          .single();

        if (error) {
          throw error;
        }

        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error.message);
      }
    };

    fetchProject();
  }, [project_id]);

  // Fallback project_id if not provided
  if (!project_id) {
    project_id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";
  }

  return (
    <div className="flex flex-col h-full max-w-sm bg-white border rounded-md shadow-md transition-all duration-300  hover:shadow-lg">
      <div className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <>
            {canClick !== false ? (
              <img
                className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
                src={imageUrl}
                alt="Company Description"
                onClick={() => navigate(`/founder/${project_id}`)}
              />
            ) : (
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
                src={imageUrl}
                alt="Company Description"
              />
            )}
          </>
        ) : (
          <div className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "></div>
        )}

        {project?.verified && (
          <span className="absolute top-0 right-0 bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-bl-lg">
            Verified
          </span>
        )}
      </div>

      <div className="flex-grow p-5">
        <h5
          className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 "
          onClick={() => navigate(`/founder/${project_id}`)}
        >
          {title}
        </h5>
        <p className="mb-2 font-normal text-gray-700  overflow-hidden text-ellipsis line-clamp-5">
          {description}
        </p>
      </div>

      <div className="px-5 pt-3 pb-5  rounded-b-lg">
        <div className="flex justify-between items-center">
          {canClick !== false ? (
            <button
              onClick={() => navigate(`/founder/${project_id}`)}
              className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 darkBgBlue darkHoverBgBlue darkFocus"
            >
              {buttonText}
            </button>
          ) : (
            <button
              className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-black bg-gray-100 rounded-md cursor-not-allowed darkBgBlue"
              disabled
            >
              {buttonText}
            </button>
          )}
          <Tag
            className={` ${
              project?.status === true
                ? "bg-green-600 text-white"
                : "bg-bg-gray-50 border border-gray-200 text-black"
            } mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center   rounded-3xl`}
            onClick={() => navigate(`/founder/${project_id}`)}
          >
            {project?.status === true ? "Public" : "Private"}
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default Card;
