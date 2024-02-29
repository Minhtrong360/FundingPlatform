import { useNavigate } from "react-router-dom";

import ImageCrop from "../../../components/cropImage/ImageCrop";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import ResizeImage from "../../../components/ResizeImage";

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
      try {
        if (!project_id) return;

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

  if (!project_id) {
    project_id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";
  }

  return (
    <div className="max-w-sm bg-white border  rounded-lg shadow darkBgBlue darkBorderGray  hover:border-transparent hover:shadow-lg transition-all duration-300">
      <div className=" relative  pt-[50%] sm:pt-[70%] rounded-lg overflow-hidden">
        {canClick !== false ? (
          <img
            className=" h-full w-full  absolute top-0 start-0 object-cover transition-transform duration-500 ease-in-out "
            src={imageUrl}
            alt="Company Description"
            onClick={() => navigate(`/founder/${project_id}`)}
          />
        ) : (
          <img
            className=" h-full w-full  absolute top-0 start-0 object-cover transition-transform duration-500 ease-in-out "
            src={imageUrl}
            alt="Company Description"
          />
        )}
        {project?.verified && (
          <span className="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-sm font-medium bg-green-700 text-white py-1.5 px-3 dark:bg-gray-900">
            Verified by BeeKrowd
          </span>
        )}
      </div>

      <div className="p-5">
        <h5
          className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 darkTextWhite"
          onClick={() => navigate(`/founder/${project_id}`)}
        >
          {title}
        </h5>

        <p className="mb-3 font-normal text-gray-700 darkTextGray overflow-ellipsis line-clamp-5">
          {description}
        </p>
        <div className="flex justify-between">
          {canClick !== false ? (
            <button
              onClick={() => navigate(`/founder/${project_id}`)}
              className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 darkBgBlue darkHoverBgBlue darkFocus"
            >
              {buttonText}
            </button>
          ) : (
            <button
              className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg cursor-not-allowed opacity-50 darkBgBlue"
              disabled
            >
              {buttonText}
            </button>
          )}
          <button
            className={` ${
              project?.status === true ? "bg-blue-600" : "bg-red-600"
            } mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white  rounded-lg  darkBgBlue`}
            onClick={() => navigate(`/founder/${project_id}`)}
          >
            {project?.status === true ? "Public deal" : "Private deal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
