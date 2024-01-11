import { useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-toastify";
import AlertMsg from "../components/AlertMsg";

const Modal = ({ isOpen, onClose, fileId }) => {
  const [email, setEmail] = useState("vidu@gmail.com");

  const handleInvite = async () => {
    try {
      // Truy vấn để tìm file có id = fileId trong bảng "files"
      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("invited_user")
        .eq("id", fileId)
        .single();

      if (fileError) {
        console.log("Error fetching file data:", fileError);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else if (fileData) {
        // Lấy danh sách "invited_user" hiện tại từ file
        const currentInvitedUsers = fileData.invited_user || [];

        // Thêm email người dùng mới vào danh sách "invited_user"
        currentInvitedUsers.push(email);

        // Tiến hành cập nhật trường "invited_user" của bảng "files" với danh sách mới
        const { error: updateError } = await supabase
          .from("files")
          .update({ invited_user: currentInvitedUsers })
          .eq("id", fileId);

        if (updateError) {
          console.log("Error updating file data:", updateError);
          // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
        } else {
          console.log(`Successfully invited user with email: ${email}`);
          onClose();
          // Xử lý khi mời thành công (ví dụ: hiển thị thông báo cho người dùng)
        }
      } else {
        console.log("File with ID not found.");
        toast.error("File with ID not found.");
        // Xử lý trường hợp không tìm thấy file với ID cụ thể
      }
    } catch (error) {
      console.log("Error inviting user:", error);
      toast.error(error.message);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <AlertMsg />
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
        <p className="mt-2 text-xl text-gray-500 ">
          Invite a user to see this file!
        </p>
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
              onClick={handleInvite}
              className="w-full px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-500"
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
        className={`text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 `}
        onClick={() => setIsModalOpen(true)}
      >
        Invite
      </button>
      <Modal
        isOpen={isModalOpen}
        fileId={fileId}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
