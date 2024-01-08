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
import Spinner from "../../components/Spiner";
import ErrorMessage from "../../components/ErrorMessage";

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
  const [editorError, setEditorError] = useState("");
  const [currentProject, setCurrentProject] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (params) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .match({ id: params.id })
            .single();
          setCurrentProject(data);
          if (error) {
            setEditorError(error);
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
        setEditorError(error);
        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (có lỗi)
      }
    }

    // Gọi hàm để lấy Markdown khi component được mount
    if (params) {
      fetchMarkdown();
    } else {
      setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (không có project)
    }
  }, [params]);
  // State to control Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState(""); // State to store YouTube link
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
      console.log("data", data);
      return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
    } catch (error) {
      console.error("Lỗi khi upload file:", error.message);
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
    },
  });

  const handleSave = async () => {
    try {
      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params.id })
          .single();

        if (projectData && projectData.user_id === user.id) {
          // Only allow save if project.user_id matches user.id

          const { data, error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });
          setEditorError("");
          if (error) {
            setEditorError(error);
          } else {
            setBlocks(data);

            // Set isSaved to true after a successful save

            // Reset isLoading to false and enable the button
            setIsLoading(false);

            // Reset isSaved to false after 1 second
          }
        } else {
          // Handle the case where project.user_id doesn't match user.id
          setEditorError("You do not have permission to save this project.");
          openModal();
          setIsLoading(false);
        }
      }
    } catch (error) {
      setEditorError(error);

      // Reset isLoading and isSaved to false in case of an error
      setIsLoading(false);
    }
  };

  // Function to handle inserting YouTube Link block
  const handleInsertYouTubeLink = () => {
    closeModal(); // Close the Modal

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
      } else {
        alert("Invalid YouTube video URL. Please provide a valid URL.");
      }
    }
  };
  const navigate = useNavigate();
  return (
    <div className="flex-grow justify-center max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {isLoading ? ( // Hiển thị thông báo tải dữ liệu khi isLoading là true
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
          role="status"
          aria-label="loading"
        ></div>
      ) : (
        <BlockNoteView
          editor={editor}
          theme={"light"}
          style={{ width: "80%" }}
          // className="sm:w-full"
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="YouTube Link Modal"
        style={{
          overlay: {
            backgroundColor: "none", // Để ẩn background overlay
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
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="w-full px-4 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-500"
                onClick={handleInsertYouTubeLink}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {editorError && (
        <ErrorMessage
          message={editorError}
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          onCancel={closeModal}
        />
      )}
      {user.id === currentProject.user_id && (
        <>
          <div style={{ position: "fixed", top: "20px", right: "1.2em" }}>
            <button
              className={`flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Save"}
            </button>
          </div>
          <div style={{ position: "fixed", top: "20px", right: "6em" }}>
            <button
              className={`flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              onClick={() => navigate(`/company/${params.id}`)}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Company Setting"}
            </button>
          </div>{" "}
          <div style={{ position: "fixed", top: "20px", right: "16em" }}>
            <button
              className={`flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
              onClick={() => navigate(`/trials`)}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Draw chart"}
            </button>
          </div>{" "}
        </>
      )}
    </div>
  );
}
