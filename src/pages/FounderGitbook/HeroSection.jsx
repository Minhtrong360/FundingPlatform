import ResizeImage from "../../components/ResizeImage";
import { Tooltip } from "antd";

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
}) => {
  return (
    <div className="max-w-[85rem] mx-auto mt-24 px-4 sm:px-6 lg:px-8 z-0">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            <Tooltip
              title={`Target: ${formatNumber(button1Text)}`}
              color={"geekblue"}
            >
              <div className="truncate overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-400 text-gray-800 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate">
                  {" "}
                  Target: ${formatNumber(button1Text)}{" "}
                </p>
              </div>
            </Tooltip>
            <Tooltip
              title={` No. ticket: ${formatNumber(button2Text)}`}
              color={"geekblue"}
            >
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-green-400 hover:bg-green-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate">
                  {" "}
                  No. ticket: {formatNumber(button2Text)}{" "}
                </p>
              </div>
            </Tooltip>
            <Tooltip
              title={`Min ticket size: ${button3Text}`}
              color={"geekblue"}
            >
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Min ticket size: {button3Text} </p>
              </div>
            </Tooltip>
            <Tooltip title={` Offer: ${button4Text}`} color={"geekblue"}>
              <div className=" overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-purple-400 hover:bg-purple-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Offer: {button4Text} </p>
              </div>
            </Tooltip>
            <Tooltip title={`Type: ${button5Text}`} color={"geekblue"}>
              <div className="  overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-pink-400 hover:bg-pink-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Type: {button5Text} </p>
              </div>
            </Tooltip>
            <Tooltip title={`Website: ${formData?.website}`} color={"geekblue"}>
              <div className="  overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-amber-400 hover:bg-pink-500 text-gray-800 shadow-sm  disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                <p className="truncate"> Website: {formData?.website} </p>
              </div>
            </Tooltip>
          </div>
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            {formData?.industry?.map((industry, index) => (
              <Tooltip
                key={index}
                title={`Industry: ${industry}`}
                color={"geekblue"}
              >
                <div className="truncate overflow-hidden py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-orange-400 text-gray-800 hover:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                  <p className="truncate">{industry}</p>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="relative">
          <ResizeImage imageUrl={imageUrl} width={700} height={800} />
          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
