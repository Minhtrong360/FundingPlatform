import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Modal = ({
  isOpen,
  onClose,
  currentProject,
  handleAddLinks, // Sử dụng handleAddLinks truyền từ props
  link,
  setLink,
  fileName,
  setFileName,
  isPublic,
  setIsPublic,
}) => {
  if (!isOpen) {
    return null;
  }

  const addLink = () => {
    if (!link.trim() || !fileName.trim()) {
      alert("Please enter a valid link and file name.");
      return;
    }
    // Tạo một đối tượng mới và gọi handleAddLinks để thêm vào danh sách projectLinks
    const newLink = {
      name: fileName,
      link: link,
      status: isPublic,
    };
    handleAddLinks(newLink);
    setLink("https://drive.google.com/file/d/0By_3Hl5Rv7fAb3FZMGZJS01"); // Đặt lại giá trị của link sau khi thêm
    setFileName("File 1"); // Đặt lại giá trị của fileName sau khi thêm
    onClose(); // Đóng modal sau khi thêm
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto backdrop-contrast-50 flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize">
          Project Name: {currentProject.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 ">
          {" "}
          Please add public file link.{" "}
        </p>
        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="text"
              name="File_name"
              placeholder="File"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <label className="block mt-3">
            <input
              type="text"
              name="File_link"
              placeholder="https://drive.google.com/file/d/0By_3Hl5Rv7fAb3FZMGZJS01"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">Project Type:</label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="projectType"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Public</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="projectType"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Private</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addLink} // Sử dụng hàm addLink để thêm liên kết
              className="w-full px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddLinkFile({
  isLoading,
  currentProject,
  handleAddLinks,
}) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [link, setLink] = useState(
    "https://drive.google.com/file/d/0By_3Hl5Rv7fAb3FZMGZJS01"
  );
  const [fileName, setFileName] = useState("File 1");
  const [isPublic, setIsPublic] = useState(true); // Thêm trạng thái cho lựa chọn Public/Private

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
  }

  return (
    <div className="App">
      {user.id === currentProject.user_id && (
        <button
          className={`text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 `}
          onClick={() => setIsModalOpen(true)}
        >
          Add file
        </button>
      )}

      <Modal
        isOpen={isModalOpen}
        currentProject={currentProject}
        handleAddLinks={handleAddLinks} // Truyền hàm handleAddLinks
        link={link}
        setLink={setLink}
        fileName={fileName}
        setFileName={setFileName}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
