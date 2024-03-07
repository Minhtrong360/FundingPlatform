import { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  BlockNoteView,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";

import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { YoutubeOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";

import LoadingButtonClick from "../../components/LoadingButtonClick";
import { Tooltip } from "antd";
import ReactModal from "react-modal";

// Create the YouTube Link block
const YouTubeLinkBlock = createReactBlockSpec(
  {
    type: "youtubeLink",
    propSchema: {
      ...defaultProps,
      videoId: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block }) => {
      return (
        <div
          className=" flex justify-center relative w-full"
          style={{ paddingBottom: "56.25%" }}
        >
          {block.props.videoId && (
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${block.props.videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      );
    },
    toExternalHTML: ({ block }) => {
      // Generate the HTML code for the YouTube video player
      if (block.props.videoId) {
        return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      return "";
    },
    parse: (element) => {
      // Parse the video ID from the HTML code if available
      const iframe = element.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src");
        const videoIdMatch = src.match(/embed\/([^?]+)/);
        if (videoIdMatch) {
          return {
            videoId: videoIdMatch[1],
          };
        }
      }
    },
  }
);

// Our block schema, which contains the configs for blocks that we want our
// editor to use.
const blockSchema = {
  // Adds all default blocks.
  ...defaultBlockSchema,
  // Adds the YouTube Link block.
  youtubeLink: YouTubeLinkBlock.config,
};

// Our block specs, which contain the configs and implementations for blocks
// that we want our editor to use.
const blockSpecs = {
  // Adds all default blocks.
  ...defaultBlockSpecs,
  // Adds the YouTube Link block.
  youtubeLink: YouTubeLinkBlock,
};

export default function EditorTool() {
  const [blocks, setBlocks] = useState([]);

  const [currentProject, setCurrentProject] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          toast.error("No internet access.");
          return;
        }
        if (params) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .match({ id: params.id })
            .single();
          setCurrentProject(data);
          if (error) {
            console.log(error.message);
          } else {
            // Nếu có dữ liệu Markdown trong cơ sở dữ liệu, cập nhật giá trị của markdown
            if (data && data.markdown) {
              editor.replaceBlocks(
                editor.topLevelBlocks,
                JSON.parse(data.markdown)
              );
            }
          }
        }
        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu
      } catch (error) {
        console.log(error.message);

        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (có lỗi)
      }
    }

    // Gọi hàm để lấy Markdown khi component được mount

    fetchMarkdown();
  }, []);
  // State to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url"); // State to store YouTube link
  const insertYouTubeLink = {
    name: "Youtube",
    execute: (editor) => {
      openModal(); // Open the Modal
    },
    aliases: ["youtube", "video", "link"],
    group: "Other",
    icon: <YoutubeOutlined />,
  };
  // Function to open the Modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Hàm để upload file lên database riêng của bạn
  async function uploadToCustomDatabase(file) {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }
      // Tạo tên file độc đáo để tránh xung đột
      const uniqueFileName = `profile_images/${Date.now()}-${file.name}`;

      // Upload file lên Supabase Storage
      let { error, data } = await supabase.storage
        .from("beekrowd_storage")
        .upload(uniqueFileName, file);

      if (error) {
        throw error;
      }

      // Trả về URL của file

      return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
    } catch (error) {
      toast.error(error.message);
      // Xử lý lỗi tại đây
    }
  }

  // Creates a new editor instance.

  const editor = useBlockNote({
    blockSpecs: blockSpecs,
    uploadFile: uploadToCustomDatabase,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertYouTubeLink,
    ],
    onEditorContentChange: function (editor) {
      setBlocks(editor.topLevelBlocks);
      // setIsSaved(false); // Đánh dấu là chưa lưu khi có sự thay đổi
    },
  });

  const handleSave = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }

      if (params) {
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params.id })
          .single();

        if (
          projectData &&
          (projectData.user_id === user.id ||
            projectData.collabs.includes(user.email))
        ) {
          const { error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });

          if (error) {
            toast.error(error.message);
          } else {
            setIsLoading(false);
            toast.success("Saved successfully.");
            // Reset isSaved to false after 1 second
          }
        } else {
          toast.error("You do not have permission to save this project.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      // Xử lý lỗi mạng
      if (!navigator.onLine) {
        toast.error("No internet access.");
      } else {
        toast.error(error.message);
      }
      setIsLoading(false);
    }
  };

  const handleCompanySettings = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }

      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params.id })
          .single();

        if (
          projectData &&
          (projectData.user_id === user.id ||
            projectData.collabs.includes(user.email))
        ) {
          // Only allow save if project.user_id matches user.id

          const { error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });

          if (error) {
            toast.error(error.message);
          } else {
            // Set isSaved to true after a successful save

            // Reset isLoading to false and enable the button
            setIsLoading(false);

            // Reset isSaved to false after 1 second
          }
        } else {
          // Handle the case where project.user_id doesn't match user.id
          toast.error("You do not have permission to save this project.");

          setIsLoading(false);
        }
      }
    } catch (error) {
      if (!navigator.onLine) {
        toast.error("No internet access.");
      } else {
        toast.error(error.message);
      }
      setIsLoading(false);
    }
    navigate(`/company/${params.id}`);
  };

  const handleDrawChart = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        return;
      }

      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params.id })
          .single();

        if (
          projectData &&
          (projectData.user_id === user.id ||
            projectData.collabs.includes(user.email))
        ) {
          // Only allow save if project.user_id matches user.id

          const { error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });

          if (error) {
            toast.error(error.message);
          } else {
            // Set isSaved to true after a successful save

            // Reset isLoading to false and enable the button
            setIsLoading(false);

            // Reset isSaved to false after 1 second
          }
        } else {
          // Handle the case where project.user_id doesn't match user.id
          toast.error("You do not have permission to save this project.");

          setIsLoading(false);
        }
      }
    } catch (error) {
      if (!navigator.onLine) {
        toast.error("No internet access.");
      } else {
        toast.error(error.message);
      }
      setIsLoading(false);
    }
    navigate(`/trials`);
  };

  // Function to handle inserting YouTube Link block
  const handleInsertYouTubeLink = () => {
    if (youtubeLink.trim() !== "") {
      // Parse the video ID from the YouTube link using a regular expression
      const videoIdMatch = youtubeLink.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=player_embedded&v=|watch\?v=|watch\?v=))([^&?\s]+)/
      );

      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId) {
        // Insert the YouTube Link block with the extracted video ID
        editor.insertBlocks(
          [
            {
              type: "youtubeLink",
              props: {
                videoId: videoId,
              },
            },
          ],
          editor.getTextCursorPosition().block,
          "after"
        );
        closeModal(); // Close the Modal
      } else {
        alert("Invalid YouTube video URL. Please provide a valid URL.");
      }
    }
  };
  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);

  //   const handleBeforeUnload = (e) => {
  //     if (!isSaved) {
  //       e.preventDefault();
  //       if (showConfirmation) {
  //         e.returnValue =
  //           "Dữ liệu chưa được lưu. Bạn có muốn lưu nó trước khi rời khỏi trang?";
  //         setShowConfirmation(true); // Đóng thông báo khi chuyển trang
  //       }
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [isSaved, showConfirmation]);

  const handleRequiredVerification = async () => {
    try {
      setIsLoading(true);

      // Tìm tất cả user có trường admin = true
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from("users")
        .select("email")
        .eq("admin", true);

      const adminEmails = [];

      adminUsers.map((user) => adminEmails.push(user.email));

      if (adminUsersError) {
        throw adminUsersError;
      }

      // Cập nhật trường required của dự án và lấy dự án hiện tại
      const { data, error } = await supabase
        .from("projects")
        .update({ required: true })
        .match({ id: params.id })
        .select();

      if (error) throw error;

      let updatedInvitedUser = data[0].invited_user || [];

      updatedInvitedUser = [...updatedInvitedUser, ...adminEmails];

      // Thêm danh sách email của user admin vào trường invited_user của dự án
      const updatedProject = await supabase
        .from("projects")
        .update({ invited_user: updatedInvitedUser })
        .match({ id: params.id })
        .select();

      setCurrentProject(updatedProject);
      window.location.reload();
      setShowConfirmation(false);

      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      toast.error(error.message);
    }
  };

  const handleRequired = async () => {
    setShowConfirmation(true);
  };

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <div className="flex-grow items-center justify-center max-w-[85rem] py-10 ">
          <ReactModal
            isOpen={showConfirmation}
            onRequestClose={() => setShowConfirmation(false)}
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
              <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
                <h2 className="mt-2 text-base text-gray-500 ">
                  {" "}
                  Our admins need to see all of your project, include your
                  content, your files,... If you agree, we will start to verify
                  as soon as possible.
                </h2>

                <div className="mt-4 flex items-center gap-10">
                  <button
                    type="button"
                    onClick={handleRequiredVerification}
                    className="w-full px-4 py-1 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
                  >
                    Agree and Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmation(false)} // Sử dụng hàm addLink để thêm liên kết
                    className="w-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                  >
                    Disagree
                  </button>
                </div>
              </div>
            </div>
          </ReactModal>
          <BlockNoteView
            editor={editor}
            theme={"light"}
            className="w-full lg:w-9/12"
          />
          <Modal
            ariaHideApp={false}
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="YouTube Link Modal"
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                margin: "auto", // Để căn giữa
              },
            }}
          >
            <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
              <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
                <h2 className="text-lg font-medium leading-6 text-gray-800 capitalize">
                  Enter YouTube Video URL
                </h2>
                <input
                  className="block w-full px-4 py-3 text-sm text-gray-700 border rounded-md"
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
                <div className="mt-4 flex items-center gap-10">
                  <button
                    className="w-full px-4 py-1 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full px-4 py-1 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
                    onClick={handleInsertYouTubeLink}
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          </Modal>

          {user?.id === currentProject?.user_id ||
          currentProject?.collabs?.includes(user.email) ? (
            <>
              <button
                className={`fixed top-[12px] right-[6.7em]   flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                onClick={handleDrawChart}
                disabled={isLoading}
              >
                Chart
              </button>

              <button
                className={`fixed top-[12px] right-[12.5em]  flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                onClick={handleCompanySettings}
                disabled={isLoading}
              >
                Settings
              </button>
              <button
                className={`fixed top-[12px] right-[1.2em] flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                onClick={handleSave}
                disabled={isLoading}
              >
                Save
              </button>

              <Tooltip
                title={`Required verification for increasing your trusted. 
          ${
            currentProject.required
              ? "Our admin are verifying your project."
              : ""
          }
          `}
                color="gray"
                zIndex={20000}
              >
                <button
                  className={`${
                    currentProject.required
                      ? "bg-gray-500 hover:cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } ${currentProject.verified ? "bg-green-600" : ""}
                  fixed top-[48px] right-[1.2em] flex justify-center text-white bg-blue-600  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                  onClick={handleRequired}
                  disabled={currentProject.required}
                >
                  {currentProject.required
                    ? currentProject.verified
                      ? "Verified"
                      : "Waiting for verification"
                    : "Required verification"}
                </button>
              </Tooltip>
            </>
          ) : null}
        </div>
      )}
    </>
  );
}
