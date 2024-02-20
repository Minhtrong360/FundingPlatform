import { useNavigate } from "react-router-dom";
import ResizeImage from "../../../components/ResizeImage";
import ImageCrop from "../../../components/cropImage/ImageCrop";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,

  project_id,
  canClick,
}) => {
  const navigate = useNavigate();
  if (!project_id) {
    project_id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";
  }

  console.log("canClick", canClick);

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
      {/* <img
        className="rounded-t-lg max-h-96 "
        src={imageUrl}
        alt=""
        onClick={() => navigate(`/founder/${project_id}`)}
      /> */}
      {/* <ImageCrop width={680} height={384} initImage={imageUrl} /> */}
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 darkTextWhite">
          {title}
        </h5>

        <p className="mb-3 font-normal text-gray-700 darkTextGray overflow-ellipsis line-clamp-5">
          {description}
        </p>

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
      </div>
    </div>
  );
};

export default Card;
