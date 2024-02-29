import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { toast } from "react-toastify";
import PricingSection from "../Home/Pricing";
import ReactModal from "react-modal";
import Spinner from "../../components/Spinner";
import { Tooltip } from "antd";

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
  currentUser,
  setIsPricingOpen,
  isPrivateDisabled,
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
    setLink(""); // Đặt lại giá trị của link sau khi thêm
    setFileName("File 1"); // Đặt lại giá trị của fileName sau khi thêm
    onClose(); // Đóng modal sau khi thêm
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
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
              placeholder="upload your file's link"
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
              {isPrivateDisabled ? (
                <Tooltip
                  title={`You need to upgrade your plan to upload a private file`}
                  color="gray"
                  zIndex={20000}
                >
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="projectType"
                      value="private"
                      disabled={isPrivateDisabled}
                      className={`form-radio h-5 w-5 ${
                        isPrivateDisabled
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    />
                    <span className="ml-2 text-gray-300">Private</span>
                  </label>
                </Tooltip>
              ) : (
                <>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="projectType"
                      value="private"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      disabled={isPrivateDisabled}
                      className={`form-radio h-5 w-5 ${
                        isPrivateDisabled
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    />
                    <span className="ml-2 text-gray-700">Private</span>
                  </label>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addLink} // Sử dụng hàm addLink để thêm liên kết
              className="w-full px-4 py-1 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
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
  isPrivateDisabled,
}) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          toast.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")

          // Filters
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  const [link, setLink] = useState();
  const [fileName, setFileName] = useState("File 1");
  const [isPublic, setIsPublic] = useState(true); // Thêm trạng thái cho lựa chọn Public/Private

  if (isLoading) {
    return <Spinner />; // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
  }
  const closeModalPricing = () => {
    setIsPricingOpen(false);
  };

  return (
    <div className="App">
      {(user.id === currentProject.user_id ||
        currentProject.collabs?.includes(user.email)) && (
        <button
          className={`text-white bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
          onClick={() => setIsModalOpen(true)}
        >
          Add file
        </button>
      )}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "gray", // Màu nền overlay
            position: "fixed", // Để nền overlay cố định
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998, // Chỉ số z để đảm bảo nó hiển thị trên cùng
          },
          content: {
            border: "none", // Để ẩn border của nội dung Modal
            background: "none", // Để ẩn background của nội dung Modal
            // margin: "auto", // Để căn giữa
          },
        }}
      >
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
          currentUser={currentUser}
          setIsPricingOpen={setIsPricingOpen}
          isPrivateDisabled={isPrivateDisabled}
        />
      </ReactModal>

      <ReactModal
        isOpen={isPricingOpen}
        onRequestClose={closeModalPricing}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "gray", // Màu nền overlay
            position: "fixed", // Để nền overlay cố định
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998, // Chỉ số z để đảm bảo nó hiển thị trên cùng
          },
        }}
      >
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div className="relative p-8 bg-white w-full  m-auto flex-col flex rounded-lg">
            <PricingSection />
            <div className="mt-4 flex items-center gap-10">
              <button
                className="max-w-md px-4 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                onClick={closeModalPricing}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </div>
  );
}
