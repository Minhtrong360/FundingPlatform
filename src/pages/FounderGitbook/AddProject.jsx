import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import PricingSection from "../Home/Pricing";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";

const Modal = ({ isOpen, onClose, currentUser, setIsPricingOpen }) => {
  const [projectName, setProjectName] = useState("SpaceX");
  const [isPublic, setIsPublic] = useState(true); // Thêm trạng thái cho lựa chọn Public/Private
  const { user } = useAuth();

  const handleCreate = async () => {
    try {
      if (
        (currentUser.plan === "Free" ||
          currentUser.plan === null ||
          currentUser.plan === undefined) &&
        !isPublic &&
        currentUser.subscription_status !== "active"
      ) {
        setIsPricingOpen(true);
        toast.warning(
          "You need to upgrade your plan to create a private project"
        );
        return; // Ngăn chặn tiếp tục thực hiện
      }
      // Tạo một dự án mới và lưu vào Supabase
      const { error } = await supabase.from("projects").insert([
        {
          name: projectName,
          user_id: user.id,
          status: isPublic, // Thêm giá trị is_public
        },
      ]);

      if (error) {
        console.error("Error creating project:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Tạo dự án thành công, đóng modal sau khi tạo

        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
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
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Public</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="projectType"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="form-radio text-blue-600 h-5 w-5"
                />
                <span className="ml-2 text-gray-700">Private</span>
              </label>
            </div>
          </div>

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
              onClick={handleCreate}
              className="w-full px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddProject({ updatedProjects }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  const [currentUser, setCurrentUser] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchCurrentUser = async () => {
      try {
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
    if (currentUser) {
      if (
        updatedProjects &&
        updatedProjects.length >= 1 &&
        (currentUser.plan === "Free" ||
          currentUser.plan === null ||
          currentUser.plan === undefined) &&
        currentUser.subscription_status !== "active"
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
      <button
        className={`text-white bg-blue-600 ${
          isButtonDisabled ? "opacity-50 bg-gray-600" : "hover:bg-blue-800"
        } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:focus:ring-blue-800`}
        onClick={handleClick}
      >
        Add new
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        setIsPricingOpen={setIsPricingOpen}
      />

      <ReactModal
        isOpen={isPricingOpen}
        onRequestClose={closeModalPricing}
        contentLabel="YouTube Link Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền overlay
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
          <div className="relative p-8 bg-white w-full  m-auto flex-col flex rounded-lg">
            <PricingSection />
            <div className="mt-4 flex items-center gap-10">
              <button
                className="max-w-md px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
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
