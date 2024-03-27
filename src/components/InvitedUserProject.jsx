import { useState } from "react";
import { supabase } from "../supabase";
// import { toast } from "react-toastify";

import apiService from "../app/apiService";
import { useAuth } from "../context/AuthContext";
import ReactModal from "react-modal";
import { message } from "antd";

const Modal = ({ isOpen, onClose, projectId }) => {
  const [email, setEmail] = useState("email@gmail.com");
  const [invited_type, setInvited_type] = useState("View only"); // Thay đổi giá trị state để phản ánh "View only" thay vì "public" và "Collaborate" thay vì "private"
  const { user } = useAuth();

  const handleInvite = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: projectData, error: fileError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (fileError) {
        console.log("Error fetching project data:", fileError);
        message.error(fileError);
        return;
      }

      if (!projectData) {
        console.log("File with ID not found.");
        message.error("File with ID not found.");
        return;
      }

      const currentInvitedUsers = projectData.invited_user || [];
      const currentCollabs = projectData.collabs || [];

      if (invited_type === "View only" && currentInvitedUsers.includes(email)) {
        message.warning(`User with email ${email} is already invited.`);
        return;
      }

      if (invited_type === "Collaborate" && currentCollabs.includes(email)) {
        message.warning(
          `User with email ${email} is already invited as collaborator.`
        );
        return;
      }

      if (invited_type === "View only") {
        currentInvitedUsers.push(email);
      } else if (invited_type === "Collaborate") {
        currentCollabs.push(email);
      }

      await apiService.post("/invite/project", {
        target_email: email,
        project_name: projectData.name,
        owner_email: user.email,
        project_id: projectData.id,
        invited_type: invited_type,
      });

      const updateData =
        invited_type === "View only"
          ? { invited_user: currentInvitedUsers }
          : { collabs: currentCollabs };

      const { error: updateError } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId);

      if (updateError) {
        console.log("Error updating file data:", updateError);
        message.error(updateError);
      } else {
        console.log(`Successfully invited user with email: ${email}`);
        message.success("Invited user successfully");
        onClose();
      }
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
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <p className="mt-2 text-xl text-gray-500 ">
          Invite a user to see this project!
        </p>
        <form className="mt-4">
          <label className="block mt-3">
            <input
              type="email"
              required
              name="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
            />
          </label>

          <div className="mt-5">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="invitedType"
                value="View only"
                checked={invited_type === "View only"} // Cập nhật giá trị checked dựa trên giá trị state
                onChange={() => setInvited_type("View only")} // Cập nhật loại dự án khi người dùng thay đổi lựa chọn
                className="form-radio text-blue-600 h-5 w-5"
              />
              <span className="ml-2 text-gray-700 text-base">View only</span>
            </label>

            <>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="invitedType"
                  value="Collaborate"
                  checked={invited_type === "Collaborate"} // Cập nhật giá trị checked dựa trên giá trị state
                  onChange={() => setInvited_type("Collaborate")} // Cập nhật loại dự án khi người dùng thay đổi lựa chọn
                />
                <span className="ml-2 text-gray-700 text-base">
                  Collaborate
                </span>
              </label>
            </>
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
              onClick={handleInvite}
              className="w-full px-4 py-1 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InvitedUserProject({ projectId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <button
        className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
        onClick={() => setIsModalOpen(true)}
      >
        Invite
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
          onClose={() => setIsModalOpen(false)}
        />
      </ReactModal>
    </div>
  );
}
