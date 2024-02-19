import { useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-toastify";

import apiService from "../app/apiService";

import ReactModal from "react-modal";

const Modal = ({
  isOpen,
  onClose,
  projectId,
  updatedProjects,
  setUpdatedProjects,
}) => {
  const [email, setEmail] = useState("vidu@gmail.com");

  const handleAssign = async () => {
    try {
      // Kiểm tra kết nối internet
      if (!navigator.onLine) {
        toast.error("No internet access.");
        return;
      }

      // Tìm id của user dựa trên email nhập vào
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email);

      if (userError) {
        console.log("Error fetching user data:", userError);
        toast.error(userError.message);
        return;
      }

      if (!userData.length > 0) {
        toast.error(`User with email ${email} not found.`);
        return;
      }

      const userId = userData[0].id;

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId);

      if (projectError) {
        console.log("Error fetching project data:", projectError);
        toast.error(projectError.message);
        return;
      }

      if (!projectData.length > 0) {
        console.log("Project not found.");
        toast.error("Project not found.");
        return;
      }

      const { error: updateError } = await supabase
        .from("projects")
        .update({ user_id: userId, user_email: email })
        .eq("id", projectId);

      if (updateError) {
        console.log("Error updating project data:", updateError);
        toast.error(updateError.message);
        return;
      }

      console.log(`Successfully invited user with email: ${email}`);
      toast.success("Assign project successfully");
      const updatedProjectsCopy = updatedProjects?.filter(
        (project) => project.id !== projectId
      );
      setUpdatedProjects(updatedProjectsCopy);
      onClose();
    } catch (error) {
      console.log("Error inviting user:", error);
      toast.error(error.message);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <p className="mt-2 text-xl text-gray-500 ">Assign this project to:</p>
        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="email"
              required
              name="email"
              placeholder="vidu@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <div className="mt-8 flex items-center gap-10">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              className="w-full px-4 py-1 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
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
        className={`text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
        onClick={() => setIsModalOpen(true)}
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
