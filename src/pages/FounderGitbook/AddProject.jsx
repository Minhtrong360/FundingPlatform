import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import ReactModal from "react-modal";
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
  const [projectStatus, setProjectStatus] = useState("public"); // Default to public
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false); // Disable private option by default
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // State to check if editing

  useEffect(() => {
    if (selectedProject) {
      setIsEditing(true); // If a project is selected, it's in edit mode
      setProjectName(selectedProject.name);
      setProjectStatus(selectedProject.status);
    }
  }, [selectedProject]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      // Check if it's a private project and the user doesn't meet the conditions
      if (projectStatus === "private" && isPrivateDisabled) {
        setIsPricingOpen(true);
        message.warning(
          "You need to upgrade your plan to save this project as private"
        );
        return;
      }

      const { error } = await supabase
        .from("projects")
        .update({
          name: projectName,
          status: projectStatus, // Update status
        })
        .eq("id", selectedProject.id);

      if (error) {
        message.error(error.message);
        console.error("Error saving project:", error);
      } else {
        message.success("Saved successfully.");
        onClose();

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
    setSelectedProject(null); // Reset selected project
    onClose(); // Close modal
  };

  useEffect(() => {
    if (
      currentUser?.plan === "Free" ||
      currentUser?.plan === null ||
      currentUser?.plan === undefined ||
      currentUser?.plan === ""
    ) {
      setIsPrivateDisabled(true);
    } else {
      setIsPrivateDisabled(false);
    }
  }, [currentUser]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (projectStatus === "private" && isPrivateDisabled) {
        setIsPricingOpen(true);
        message.warning(
          "You need to upgrade your plan to create a private project"
        );
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: projectName,
            user_id: user.id,
            status: projectStatus, // Set status
            user_email: user.email,
          },
        ])
        .select();

      if (error) {
        message.error(error.message);
        console.error("Error creating project:", error);
      } else {
        onClose();
        setUpdatedProjects([data[0], ...updatedProjects]);
        message.success("Project created successfully.");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error creating project:", error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-5 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <h3 className="text-md font-medium leading-6 text-gray-800 capitalize">
          Project Name
        </h3>
        <form className="mt-2" onSubmit={isEditing ? handleSave : handleCreate}>
          <label className="block mt-2">
            <input
              type="text"
              name="projectName"
              placeholder=""
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-800 border-gray-300 rounded-md"
              required
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
              className="w-20 text-black bg-white hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-md text-xs px-3 py-2 text-center border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`w-20 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
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
  const { currentUser: userFromDB } = useAuth();
  let currentUser = userFromDB[0];

  useEffect(() => {
    if (currentUser && updatedProjects) {
      const userProjects = updatedProjects.filter(
        (project) => project.user_id === currentUser?.id
      );

      const planLimits = {
        1: { maxProjects: 1, allowedStatus: ["public"] },
        2: { maxProjects: 5, allowedStatus: ["public", "private", "stealth"] },
        3: { maxProjects: 10, allowedStatus: ["public", "private", "stealth"] },
      };
      let userPlanType = 1;
      if (
        currentUser?.plan === "FundFlow Growth" &&
        (currentUser?.subscription_status?.toLowerCase() === "active" ||
          currentUser?.subscription_status?.toLowerCase() === "on_trial")
      ) {
        userPlanType = 2;
      } else if (
        currentUser?.plan === "FundFlow Premium" &&
        (currentUser?.subscription_status?.toLowerCase() === "active" ||
          currentUser?.subscription_status?.toLowerCase() === "on_trial")
      ) {
        userPlanType = 3;
      }

      const isButtonDisabled =
        userProjects.length >= planLimits[userPlanType].maxProjects;

      setIsButtonDisabled(isButtonDisabled);
      setAllowedStatus(planLimits[userPlanType].allowedStatus);
    }
  }, [currentUser, updatedProjects]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [allowedStatus, setAllowedStatus] = useState(["public"]);
  const [isPricingOpen, setIsPricingOpen] = useState(false); // State for pricing modal

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
            className={`text-white opacity-50 bg-gray-600  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
            onClick={handleClickAddNew}
          >
            <PlusOutlined className="mr-1" />
            Add new
          </button>
        </Tooltip>
      ) : (
        <>
          <button
            className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
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
          allowedStatus={allowedStatus} // Pass allowedStatus to Modal
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
