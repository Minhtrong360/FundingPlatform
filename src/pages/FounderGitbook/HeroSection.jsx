import { Tooltip } from "antd";
import ImageCrop from "../../components/cropImage/ImageCrop";
import ResizeImage from "../../components/ResizeImage";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Tag } from "antd";
function formatNumber(value) {
  // Kiểm tra xem value có phải là một chuỗi không
  if (typeof value !== "string") {
    // Nếu không phải chuỗi, chuyển đổi nó thành chuỗi
    value = String(value);
  }

  // Convert to number first to remove any non-numeric characters
  const number = Number(value.replace(/[^0-9]/g, ""));
  // Format the number with commas
  return number.toLocaleString();
}

const HeroSection = ({
  formData,
  title,
  description,
  button1Text,
  button2Text,
  button3Text,
  button4Text,
  button5Text,
  imageUrl,
  setFormData,
  canClick,
}) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!formData.id) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", formData.project_id)
          .single();

        if (error) {
          throw error;
        }

        setProject(data);
      } catch (error) {
        console.log("Error fetching project:", error.message);
      }
    };

    fetchProject();
  }, [formData]);

  console.log("imageUrl", imageUrl);

  return (
    <div className="max-w-[85rem] mx-auto mt-24 px-4 sm:px-6 lg:px-8 z-0">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-start">
        <div>
          <h1 className="block text-3xl font-semibold  sm:text-4xl lg:text-6xl lg:leading-tight darkTextWhite">
            {title}
          </h1>
          <div>
            <p className="mt-6 text-2xl font-semibold darkTextGray">
              Company description
            </p>
            <p className="mt-3 text-lg  darkTextGray">{description}</p>
          </div>

          <p className="mt-6 text-2xl font-semibold darkTextGray">
            Fundraising information
          </p>
          <div className=" gap-4 mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">Target:</span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                ${formatNumber(button1Text)}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600 ">
                No. tickets:
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {formatNumber(button2Text)}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">
                Min ticket size:
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                ${formatNumber(button3Text)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">
                Raised before:
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                ${formatNumber(formData?.amountRaised)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">
                Team size:
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                {formData?.teamSize}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">Round:</span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                {formData?.round?.join(", ")}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">
                Established:
              </span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                {formData?.operationTime}
              </span>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">Offer:</span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {" "}
                {button4Text}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">Type:</span>
              <span className="text-sm font-semibold text-gray-800 truncate pl-1">
                {button5Text}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-600">
                Website:
              </span>
              <a
                className="text-sm font-semibold text-blue-600 hover:underline truncate pl-1"
                href={formData?.website}
              >
                {formData?.website}
              </a>
            </div>
          </div>
          <div className=" mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            {formData?.industry?.map((industry, index) => (
              <Tag
                key={index}
                title={`Industry: ${industry}`}
                color={"geekblue"}
                className="  bg-gray-50 border border-gray-200 text-black mt-4  inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm  text-center   rounded-3xl "
              >
                {industry}
              </Tag>
            ))}
          </div>
        </div>

        <div className="relative mt-2">
          {/* <div class=" relative  pt-[50%] sm:pt-[70%] rounded-md overflow-hidden">
            <img
              class=" h-full w-full  absolute top-0 start-0 object-cover  transition-transform duration-500 ease-in-out "
              src={imageUrl}
              alt="Project Description"
            />
          </div> */}

          {/* {canClick === false ? (
            <ImageCrop
              initImage={imageUrl}
              previewWidth={600}
              previewHeight={700}
              cropWidth={245}
              cropHeight={280}
              name="profileImage"
              formData={formData}
              setFormData={setFormData}
            />
          ) : ( */}
          {imageUrl ? (
            <img
              src={imageUrl}
              width={700}
              height={800}
              className="object-cover"
              alt=""
            />
          ) : (
            <div className="w-[400px] h-[500px]"></div>
          )}

          {/* )} */}

          {project?.verified && (
            <span className="absolute top-0 right-0 bg-yellow-300 text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
              Verified profile
            </span>
          )}

          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 darkFromSlate"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
