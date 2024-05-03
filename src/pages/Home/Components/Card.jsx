import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { Tag } from "antd";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,
  project_id,
  canClick,
  verified,
  status,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full max-w-sm bg-white border rounded-md shadow-md transition-all duration-300  hover:shadow-lg cursor-pointer">
      <div className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <>
            {canClick !== false ? (
              <img
                className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
                src={imageUrl}
                alt="Company Avatar"
                onClick={() => navigate(`/founder/${project_id}`)}
              />
            ) : (
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
                src={imageUrl}
                alt="Company Avatar"
              />
            )}
          </>
        ) : (
          <div className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "></div>
        )}

        {verified && (
          <span className="absolute top-0 right-0 bg-yellow-300 text-gray-800 text-sm font-bold py-1.5 px-3 rounded-bl-lg">
            Verified profile
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
        <p className="mb-2 text-sm font-normal text-gray-700  overflow-hidden text-ellipsis line-clamp-6">
          {description}
        </p>
      </div>

      <div className="px-5 pb-5  rounded-b-lg">
        <div className="flex justify-between items-center">
          {canClick !== false ? (
            <button
              onClick={() => navigate(`/founder/${project_id}`)}
              className="mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 darkBgBlue darkHoverBgBlue darkFocus"
            >
              {buttonText}
            </button>
          ) : (
            <button
              className="mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-black bg-gray-100 rounded-md cursor-not-allowed darkBgBlue"
              disabled
            >
              {buttonText}
            </button>
          )}
          <Tag
            className={` ${
              status === "public"
                ? "bg-yellow-300 text-black"
                : "bg-bg-gray-50 border border-gray-300 text-black"
            } mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center   rounded-3xl`}
            onClick={() => navigate(`/founder/${project_id}`)}
          >
            {status === "public"
              ? "Public"
              : status === "private"
              ? "Private"
              : "Stealth"}
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default Card;
