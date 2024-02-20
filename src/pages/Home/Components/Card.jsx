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
    <div className="max-w-sm bg-white border  rounded-lg shadow darkBgBlue darkBorderGray  hover:border-transparent hover:shadow-lg transition-all duration-300">
      <ResizeImage
        className="rounded-t-lg max-h-96"
        imageUrl={imageUrl}
        width={683}
        height={384}
        onClick={() => navigate(`/founder/${project_id}`)}
      />
      {/* <img
        className="rounded-t-lg max-h-96 "
        src={imageUrl}
        alt=""
        onClick={() => navigate(`/founder/${project_id}`)}
      /> */}
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 darkTextWhite">
          {title}
        </h5>

        <p className="mb-3 font-normal text-gray-700 darkTextGray overflow-ellipsis line-clamp-5">
          {description}
        </p>
        <button
          onClick={() => navigate(`/founder/${project_id}`)}
          className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkHoverBgBlue darkFocus"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
