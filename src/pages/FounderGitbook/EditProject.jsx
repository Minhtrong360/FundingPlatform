import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Radio, Tooltip, message } from "antd";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

const Modal = ({ isOpen, onClose, setIsPricingOpen }) => {
  const [projectName, setProjectName] = useState("");
  const [privateProject, setPrivateProject] = useState(false); // Use a flag to indicate private project
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false); // New state for disabling private option

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
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
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
              className="block w-full px-4 py-3 text-sm text-gray-200 border-gray-200 rounded-md"
            />
          </label>

          <div className="mt-4">
            <div className="mt-4">
              <Radio.Group
                onChange={(e) =>
                  setPrivateProject(e.target.value === "private")
                }
                value={privateProject ? "private" : "public"}
              >
                <Tooltip
                  title="This project will be visible to everyone"
                  zIndex={20000}
                >
                  <Radio value="public">Public</Radio>
                </Tooltip>
                {isPrivateDisabled ? (
                  <Tooltip
                    title={`You need to upgrade your plan to create a private project`}
                    color="gray"
                    zIndex={20000}
                  >
                    <Radio value="private" disabled>
                      Private
                    </Radio>
                  </Tooltip>
                ) : (
                  <Radio value="private">Private</Radio>
                )}
              </Radio.Group>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-sm px-3 py-2 text-center border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              // onClick={handleCreate}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function EditProject(isEditModalOpen, setIsEditModalOpen) {
  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing

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

  const handleClickAddNew = () => {
    if (!isButtonDisabled) {
      setIsModalOpen(true);
    } else {
      setIsPricingOpen(true);
    }
  };

  return (
    <ReactModal
      isOpen={isEditModalOpen}
      onRequestClose={() => setIsEditModalOpen(false)}
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
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        setIsPricingOpen={setIsPricingOpen}
      />
    </ReactModal>
  );
}

export default EditProject;
