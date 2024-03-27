import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import PricingSection from "../Home/Pricing";
import ReactModal from "react-modal";
// import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import { Tooltip, message } from "antd";

const Modal = ({
  isOpen,
  onClose,
  currentUser,
  setIsPricingOpen,
  updatedProjects,
  setUpdatedProjects,
}) => {
  const [projectName, setProjectName] = useState("SpaceX");
  const [privateProject, setPrivateProject] = useState(false); // Use a flag to indicate private project
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false); // New state for disabling private option
  const { user } = useAuth();

  useEffect(() => {
    // Check if the user doesn't meet the conditions to create a private project
    if (
      currentUser.plan === "Free" ||
      currentUser.plan === null ||
      currentUser.plan === undefined ||
      currentUser.subscription_status !== "active"
    ) {
      setIsPrivateDisabled(true);
    } else {
      setIsPrivateDisabled(false);
    }
  }, [currentUser]);

  const handleCreate = async () => {
    try {
      // Check if it's a private project and the user doesn't meet the conditions
      if (privateProject && isPrivateDisabled) {
        setIsPricingOpen(true);
        message.warning(
          "You need to upgrade your plan to create a private project"
        );
        return;
      }
      // Tạo một dự án mới và lưu vào Supabase
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectName,
            user_id: user.id,
            status: !privateProject, // Invert the status for public/private
            user_email: user.email, // Thêm giá trị is_public
          },
        ])
        .select();

      if (error) {
        message.error(error.message);
        console.error("Error creating project:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Tạo dự án thành công, đóng modal sau khi tạo

        onClose();
        setUpdatedProjects([data[0], ...updatedProjects]);
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error creating project:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <AlertMsg />
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize">
          Project Name
        </h3>
        <p className="mt-2 text-sm text-gray-500 ">Create a new project</p>
        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="text"
              name="projectName"
              placeholder="SpaceX"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
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
                  checked={!privateProject} // Check if it's not a private project
                  onChange={() => setPrivateProject(false)} // Disable private when switching to public
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Public</span>
              </label>

              {isPrivateDisabled ? (
                <Tooltip
                  title={`You need to upgrade your plan to create a private project`}
                  color="gray"
                  zIndex={20000}
                >
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="projectType"
                      value="private"
                      checked={privateProject}
                      onChange={() => setPrivateProject(true)}
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
                      checked={privateProject}
                      onChange={() => setPrivateProject(true)}
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
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddProject({ updatedProjects, setUpdatedProjects }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  const [currentUser, setCurrentUser] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
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

  useEffect(() => {
    if (currentUser && updatedProjects) {
      const hasProjectWithCurrentUser = updatedProjects.some(
        (project) => project.user_id === currentUser.id
      );
      const isFreeUser =
        currentUser.plan === "Free" ||
        currentUser.plan === null ||
        currentUser.plan === undefined;
      const isSubscriptionInactive =
        currentUser.subscription_status !== "active";

      if (
        hasProjectWithCurrentUser &&
        updatedProjects.length > 1 &&
        isFreeUser &&
        isSubscriptionInactive
      ) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    }
  }, [currentUser, updatedProjects]);

  const handleClick = () => {
    if (!isButtonDisabled) {
      setIsModalOpen(true);
    } else {
      setIsPricingOpen(true);
    }
  };

  const closeModalPricing = () => {
    setIsPricingOpen(false);
  };

  return (
    <div className="App">
      {isButtonDisabled ? (
        <Tooltip
          title={`You need to upgrade your plan to create more projects. 'Click' to update your plan!`}
          color="gray"
          zIndex={20000}
        >
          <button
            className={`text-white opacity-50 bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
            onClick={handleClick}
          >
            Add new
          </button>
        </Tooltip>
      ) : (
        <>
          <button
            className={`text-white bg-blue-600 "hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
            onClick={handleClick}
          >
            Add new
          </button>
        </>
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
          onClose={() => setIsModalOpen(false)}
          currentUser={currentUser}
          setIsPricingOpen={setIsPricingOpen}
          updatedProjects={updatedProjects}
          setUpdatedProjects={setUpdatedProjects}
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
          content: {
            border: "none", // Để ẩn border của nội dung Modal
            background: "none", // Để ẩn background của nội dung Modal
            // margin: "auto", // Để căn giữa
          },
        }}
      >
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
          <div className="relative p-8 bg-white w-full  m-auto flex-col flex rounded-md">
            <PricingSection />
            <div className="mt-4 flex items-center gap-10">
              <button
                className="max-w-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
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
