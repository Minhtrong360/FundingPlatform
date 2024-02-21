import { useNavigate } from "react-router-dom";
import ResizeImage from "../../../components/ResizeImage";
import ImageCrop from "../../../components/cropImage/ImageCrop";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,
  project_id,
  canClick,
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
      {canClick !== false ? (
        <ResizeImage
          className="rounded-t-lg max-h-96"
          imageUrl={imageUrl}
          width={683}
          height={384}
          onClick={() => navigate(`/founder/${project_id}`)}
        />
      ) : (
        <ResizeImage
          className="rounded-t-lg max-h-96"
          imageUrl={imageUrl}
          width={683}
          height={384}
        />
      )}
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 darkTextWhite">
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
            } mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white  rounded-lg cursor-not-allowed darkBgBlue`}
          >
            {project?.status === true ? "Public deal" : "Private deal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
