import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";

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
    <div className="flex flex-col h-full max-w-sm bg-white border rounded-lg shadow-md transition-all duration-300  hover:shadow-lg">
      <div className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden">
        {canClick !== false ? (
          <img
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
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
        {project?.verified && (
          <span className="absolute top-0 right-0 bg-green-600 text-white text-sm font-medium py-1.5 px-3 rounded-bl-lg">
            Verified by BeeKrowd
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
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {buttonText}
            </button>
          ) : (
            <button
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg cursor-not-allowed opacity-50"
              disabled
            >
              {buttonText}
            </button>
          )}
          <button
            onClick={() => navigate(`/founder/${project_id}`)}
            className={`inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white rounded-lg ${
              project?.status === true ? "bg-blue-600" : "bg-red-600"
            }`}
          >
            {project?.status === true ? "Public deal" : "Private deal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
