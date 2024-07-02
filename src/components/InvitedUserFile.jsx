import { useState } from "react";
import { supabase } from "../supabase";

import ReactModal from "react-modal";
import apiService from "../app/apiService";
import { message } from "antd";

const Modal = ({ isOpen, onClose, fileId }) => {
  const [email, setEmail] = useState("elonmusk@gmail.com");

  const handleInvite = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      // Truy vấn để tìm file có id = fileId trong bảng "files"
      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("*")
        .eq("id", fileId)
        .single();

      if (fileError) {
        console.log("Error fetching file data:", fileError);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else if (fileData) {
        // Lấy danh sách "invited_user" hiện tại từ file
        const currentInvitedUsers = fileData.invited_user || [];

        // Thêm email người dùng mới vào danh sách "invited_user"

        if (currentInvitedUsers.includes(email)) {
          message.warning(`User with email ${email} is already invited.`);
          return; // Ngắt nếu đã tồn tại
        }

        currentInvitedUsers.push(email);

        // Gửi email mời
        await apiService.post("/invite/file", {
          target_email: email,
          file_name: fileData.name,
          owner_email: fileData.owner_email,
          project_id: fileData.project_id,
        });
        console.log("currentInvitedUsers", currentInvitedUsers);
        // Tiến hành cập nhật trường "invited_user" của bảng "files" với danh sách mới
        const { error: updateError } = await supabase
          .from("files")
          .update({ invited_user: currentInvitedUsers })
          .eq("id", fileId);

        if (updateError) {
          console.log("Error updating file data:", updateError);
          message.error(updateError);
          // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
        } else {
          message.success("Invited successfully!");
          console.log(`Successfully invited user with email: ${email}`);
          onClose();
          // Xử lý khi mời thành công (ví dụ: hiển thị thông báo cho người dùng)
        }
      } else {
        console.log("File with ID not found.");
        message.error("File with ID not found.");
        // Xử lý trường hợp không tìm thấy file với ID cụ thể
      }
    } catch (error) {
      console.log("Error inviting user:", error);
      message.error(error.message);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
        <p className="mt-2 text-xl text-gray-500 ">
          Invite a user to see this file!
        </p>
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
              onClick={handleInvite}
              className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InvitedUser({ fileId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <button
        className={`text-white text-xs bg-blue-600 hover:bg-blue-700800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
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
          fileId={fileId}
          onClose={() => setIsModalOpen(false)}
        />
      </ReactModal>
    </div>
  );
}
