import { ExportOutlined } from "@ant-design/icons";

export default function ArticleBrief({ result }) {
  const handleExportClick = () => {
    // Mở result.url trong một cửa sổ mới
    window.open(result.url, "_blank");
  };
  return (
    <div className="flex items-start justify-center  px-4 pt-4  text-center sm:block sm:p-0">
      <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-md shadow-xl darkBg sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
          <div className="mt-4 text-left">
            <h3
              className="font-medium leading-6 text-gray-800 capitalize darkTextWhite"
              id="modal-title"
            >
              {result.title}
            </h3>
            {result.extractedInfo.map((item, index) => (
              <p key={index} className="text-sm text-gray-500 darkTextGray">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label
            className="text-sm text-gray-700 darkTextGray"
            htmlFor="share link"
          >
            Source
          </label>
          <div className="flex items-center mt-2 -mx-1">
            <input
              type="text"
              value={result.url}
              onChange="disabled"
              className="flex-1 block h-10 px-4 mx-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md darkBg darkTextGray darkBorderGray focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 darkFocusBorder focus:outline-none focus:ring"
            />
            <button
              onClick={handleExportClick}
              className="hidden mx-1 text-gray-600 transition-colors duration-300 sm:block darkTextGray hover:text-blue-500 darkHoverTextWhite"
            >
              <ExportOutlined />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
