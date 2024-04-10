import { useState } from "react";
import { supabase } from "../supabase";
// import { toast } from "react-toastify";

import apiService from "../app/apiService";

import ReactModal from "react-modal";
import { message } from "antd";

const Modal = ({
  isOpen,
  onClose,
  projectId,
  updatedProjects,
  setUpdatedProjects,
}) => {
  const [email, setEmail] = useState("elonmusk@gmail.com");

  const handleAssign = async () => {
    try {
      // Kiểm tra kết nối internet
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      // Tìm id của user dựa trên email nhập vào
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email);

      if (userError) {
        console.log("Error fetching user data:", userError);
        message.error(userError.message);
        return;
      }

      if (!userData.length > 0) {
        message.error(`User with email ${email} not found.`);
        return;
      }

      const userId = userData[0].id;

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId);

      if (projectError) {
        console.log("Error fetching project data:", projectError);
        message.error(projectError.message);
        return;
      }

      if (!projectData.length > 0) {
        console.log("Project not found.");
        message.error("Project not found.");
        return;
      }

      const { error: updateError } = await supabase
        .from("projects")
        .update({ user_id: userId, user_email: email })
        .eq("id", projectId);

      if (updateError) {
        console.log("Error updating project data:", updateError);
        message.error(updateError.message);
        return;
      }

      console.log(`Successfully invited user with email: ${email}`);
      message.success("Assign project successfully");
      const updatedProjectsCopy = updatedProjects?.filter(
        (project) => project.id !== projectId
      );
      setUpdatedProjects(updatedProjectsCopy);
      onClose();
    } catch (error) {
      console.log("Error inviting user:", error);
      message.error(error.message);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <p className="mt-2 text-lg text-gray-800 ">Assign the admin role of this project to:</p>
        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="email"
              required
              name="email"
              placeholder="elonmusk@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <div className="mt-8 flex items-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ProjectGiven({
  projectId,
  updatedProjects,
  setUpdatedProjects,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <button
        // className={`text-black  focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-md text-sm px-3 py-2  darkBgBlue darkHoverBgBlue darkFocus `}
        onClick={() => setIsModalOpen(true)}
        style={{ fontSize: "12px" }}
      >
        Assign
      </button>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "gray",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          },
          content: {
            border: "none",
            background: "none",
          },
        }}
      >
        <Modal
          isOpen={isModalOpen}
          projectId={projectId}
          updatedProjects={updatedProjects}
          setUpdatedProjects={setUpdatedProjects}
          onClose={() => setIsModalOpen(false)}
        />
      </ReactModal>
    </div>
  );
}
