import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import PricingSection from "../Home/Pricing";
import ReactModal from "react-modal";
// import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import { Tooltip, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import PricingWithLemon from "../Home/Components/PricingWithLemon";

const Modal = ({
  isOpen,
  onClose,
  currentUser,
  setIsPricingOpen,
  updatedProjects,
  setUpdatedProjects,
  selectedProject,
  setSelectedProject,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("public"); // Use a flag to indicate private project
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false); // New state for disabling private option
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false); // Thêm state để kiểm tra xem có đang chỉnh sửa hay không

  useEffect(() => {
    if (selectedProject) {
      setIsEditing(true); // Nếu có dự án được chọn, đang chỉnh sửa
      setProjectName(selectedProject.name);
      setProjectStatus(selectedProject.status);
    }
  }, [selectedProject]);

  const handleSave = async () => {
    try {
      // Kiểm tra nếu là dự án riêng tư và người dùng không đáp ứng điều kiện
      if (projectStatus === "private" && isPrivateDisabled) {
        setIsPricingOpen(true);
        message.warning(
          "You need to upgrade your plan to save this project as private"
        );
        return;
      }

      // Cập nhật dự án trong cơ sở dữ liệu
      const { data, error } = await supabase
        .from("projects")
        .update({
          name: projectName,
          status: projectStatus, // Invert lại trạng thái cho công khai/riêng tư
        })
        .eq("id", selectedProject.id);

      if (error) {
        message.error(error.message);
        console.error("Error saving project:", error);
      } else {
        // Cập nhật dự án thành công, đóng modal
        message.success("Saved successfully.");
        onClose();

        // Cập nhật dự án đã chỉnh sửa vào updatedProjects
        const updatedProjectIndex = updatedProjects.findIndex(
          (project) => project.id === selectedProject.id
        );
        if (updatedProjectIndex !== -1) {
          const updatedProjectsCopy = [...updatedProjects];
          updatedProjectsCopy[updatedProjectIndex] = {
            ...updatedProjectsCopy[updatedProjectIndex],
            name: projectName,
            status: projectStatus,
          };
          setUpdatedProjects(updatedProjectsCopy);
        }
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error saving project:", error);
    }
  };

  const handleCancel = () => {
    setSelectedProject(null); // Đặt selectedProject thành null để hủy bỏ chỉnh sửa
    onClose(); // Đóng modal
  };

  useEffect(() => {
    // Check if the user doesn't meet the conditions to create a private project
    if (
      currentUser.plan === "Free" ||
      currentUser.plan === null ||
      currentUser.plan === undefined ||
      currentUser.subscription_status === "canceled" ||
      currentUser.subscription_status === "cancelled"
    ) {
      setIsPrivateDisabled(true);
    } else {
      setIsPrivateDisabled(false);
    }
  }, [currentUser]);

  const handleCreate = async () => {
    try {
      // Check if it's a private project and the user doesn't meet the conditions
      if (projectStatus === "private" && isPrivateDisabled) {
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
            status: projectStatus, // Invert the status for public/private
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
        message.success("Created project successfully.");
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
      <div className="relative p-5 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <h3 className="text-md font-medium leading-6 text-gray-800 capitalize">
          Project Name
        </h3>
        <form className="mt-2">
          <label className="block mt-2">
            <input
              type="text"
              name="projectName"
              placeholder=""
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-800 border-gray-200 rounded-md"
            />
          </label>

          <div className="mt-4">
            <div className="mt-4">
              <Radio.Group
                onChange={(e) => setProjectStatus(e.target.value)}
                value={projectStatus}
              >
                <Tooltip
                  title="This project will be visible to everyone."
                  zIndex={20000}
                >
                  <Radio value="public">Public</Radio>
                </Tooltip>
                {!isPrivateDisabled ? (
                  <Tooltip
                    title={`This project will be visible to everyone but they can't access the project.`}
                    color="gray"
                    zIndex={20000}
                  >
                    <Radio value="private">Private</Radio>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={`You need to upgrade your plan to create a private project.`}
                    color="gray"
                    zIndex={20000}
                  >
                    <Radio disabled value="private">
                      Private
                    </Radio>
                  </Tooltip>
                )}
                {!isPrivateDisabled ? (
                  <Tooltip
                    title={`This project will be invisible to everyone.`}
                    color="gray"
                    zIndex={20000}
                  >
                    <Radio value="stealth">Stealth</Radio>
                  </Tooltip>
                ) : (
                  <Tooltip
                    title={`You need to upgrade your plan to create a stealth project.`}
                    color="gray"
                    zIndex={20000}
                  >
                    <Radio disabled value="stealth">
                      Stealth
                    </Radio>
                  </Tooltip>
                )}
              </Radio.Group>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-20 text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={isEditing ? handleSave : handleCreate}
              className={`w-20 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddProject({
  updatedProjects,
  setUpdatedProjects,
  isModalOpen,
  setIsModalOpen,
  selectedProject,
  setSelectedProject,
  myProjects,
}) {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

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
        currentUser.subscription_status === "canceled" ||
        currentUser.subscription_status === "cancelled";

      if (
        hasProjectWithCurrentUser &&
        myProjects.length >= 1 &&
        (isFreeUser || isSubscriptionInactive)
      ) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    }
  }, [currentUser, updatedProjects]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing

  const handleClickAddNew = () => {
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
            onClick={handleClickAddNew}
          >
            <PlusOutlined className="mr-1" />
            Add new
          </button>
        </Tooltip>
      ) : (
        <>
          <button
            className={`text-white bg-blue-600 "hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
            onClick={handleClickAddNew}
          >
            <PlusOutlined className="mr-1" />
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
            backdropFilter: "blur(0.5px)", // Add backdrop filter for blur effect
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Adjust background color with transparency
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
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
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
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
          <div className="relative p-5 bg-white w-full  m-auto flex-col flex rounded-md">
            <PricingWithLemon />
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
