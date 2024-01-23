import { useNavigate } from "react-router-dom";
import ResizeImage from "../../../components/ResizeImage";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,

  project_id,
}) => {
  const navigate = useNavigate();
  if (!project_id) {
    project_id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";
  }

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:border-transparent hover:shadow-lg transition-all duration-300">
      {/* <ResizeImage
        className="rounded-t-lg"
        imageUrl={imageUrl}
        width={900}
        height={384}
        onClick={() => navigate(`/founder/${project_id}`)}
      /> */}
      <img
        className="rounded-t-lg max-h-96"
        src={imageUrl}
        alt=""
        onClick={() => navigate(`/founder/${project_id}`)}
      />
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 overflow-ellipsis line-clamp-5">
          {description}
        </p>
        <button
          onClick={() => navigate(`/founder/${project_id}`)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
