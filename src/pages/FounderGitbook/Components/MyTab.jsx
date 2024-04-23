import { Badge, message } from "antd";
import Modal from "react-modal";
import {
  BlockNoteView,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";

import { useParams } from "react-router-dom";
import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import { YoutubeOutlined } from "@ant-design/icons";

import Sample from "./Sample";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";
import LoadingButtonClick from "../../../components/LoadingButtonClick";
import FilesList from "../FilesList";

const MyTab = ({ blocks, setBlocks, company, fullScreen, currentProject }) => {
  const [activeTab, setActiveTab] = useState("Your Profile");
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const closeModal = () => {
    setIsModalOpen(false);
  };

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

  // Hàm để upload file lên database riêng của bạn
  async function uploadToCustomDatabase(file) {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
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
      message.error(error.message);
      // Xử lý lỗi tại đây
    }
  }

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
  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu

    // Nếu có dữ liệu Markdown trong cơ sở dữ liệu, cập nhật giá trị của markdown
    if (currentProject && currentProject.markdown) {
      editor.replaceBlocks(
        editor.topLevelBlocks,
        JSON.parse(currentProject.markdown)
      );
    }

    // Gọi hàm để lấy Markdown khi component được mount
  }, [currentProject]);

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading
  const params = useParams();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleSave = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
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
            message.error(error.message);
          } else {
            setIsLoading(false);
            message.success("Saved successfully.");
            // Reset isSaved to false after 1 second
          }
        } else {
          message.error("You do not have permission to save this project.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      // Xử lý lỗi mạng
      if (!navigator.onLine) {
        message.error("No internet access.");
      } else {
        message.error(error.message);
      }
      setIsLoading(false);
    }
  };

  const isOwner =
    user?.id === currentProject?.user_id ||
    currentProject?.collabs?.includes(user.email);

  const isDemo =
    params.id === "3ec3f142-f33c-4977-befd-30d4ce2b764d" ? true : false;

  useEffect(() => {
    if (isDemo) {
      setActiveTab("Sample PitchDeck");
    } else {
      setActiveTab("Your Profile");
    }
  }, [isDemo]);

  const tabContents = {
    ...(isDemo && user.email !== "ha.pham@beekrowd.com"
      ? {}
      : {
          "Your Profile": (
            <div>
              {" "}
              <BlockNoteView
                editor={editor}
                theme={"light"}
                className="w-full lg:w-12/12"
              />
              <div className="mt-28">
                <div className="text-black font-semibold">Keywords:</div>

                <div className="mt-2">
                  {company?.keyWords &&
                    company.keyWords.split(",").map((keyWord, index) => (
                      <Badge
                        key={index}
                        className="mx-2 bg-yellow-300 border border-gray-200 truncate text-black mt-4 inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm text-center rounded-3xl"
                      >
                        {keyWord.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
              {user?.id === currentProject?.user_id ||
              currentProject?.collabs?.includes(user.email) ? (
                <button
                  className="mt-8 hover:cursor-pointer py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleSave}
                >
                  Save profile
                </button>
              ) : null}
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
                  <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
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
                        className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
                        onClick={handleInsertYouTubeLink}
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          ),
        }),

    "Sample PitchDeck": (
      <div>
        <Sample />
      </div>
    ),

    "Data Room": (
      <div>
        {" "}
        <FilesList />
      </div>
    ),
  };

  return (
    <div
      className={`container mx-auto px-4 flex flex-col lg:flex-row ${
        fullScreen === true ? "justify-center items-center" : ""
      }`}
    >
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <>
          {fullScreen === false && (
            <>
              <aside className="w-full md:max-w-[200px] py-8">
                <div className="sticky top-8 space-y-4">
                  <nav className="space-y-1">
                    {/* Navbar */}
                    {Object.keys(tabContents).map((tab) => (
                      <div
                        key={tab}
                        className={` cursor-pointer ${
                          activeTab === tab
                            ? "flex items-left px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md"
                            : "flex items-left px-3 py-2 text-gray-600"
                        }`}
                        onClick={() => handleTabChange(tab)}
                      >
                        {tab}
                      </div>
                    ))}
                  </nav>
                </div>
              </aside>
              <div className="w-full  py-8 px-0 md:pl-8">
                {/* Content */}
                {tabContents[activeTab]}
              </div>
            </>
          )}
          {fullScreen === true && (
            <BlockNoteView
              editor={editor}
              theme={"light"}
              className="w-full lg:w-8/12 my-12"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyTab;
