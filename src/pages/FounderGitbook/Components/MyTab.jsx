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
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";
import FilesList from "../FilesList";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import YPartyKitProvider from "y-partykit/provider";
import axios from "axios";

function LoaderIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="6" />
      <line x1="12" x2="12" y1="18" y2="22" />
      <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
      <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
      <line x1="2" x2="6" y1="12" y2="12" />
      <line x1="18" x2="22" y1="12" y2="12" />
      <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
      <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
    </svg>
  );
}

const MyTab = ({ blocks, setBlocks, company, fullScreen, currentProject }) => {
  const [activeTab, setActiveTab] = useState("Your Profile");
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const handleBeforeUnload = useCallback(
    (event) => {
      if (isContentChanged) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; // Gecko, Trident, Chrome 34+
        return message; // Gecko, WebKit, Chrome <34
      }
    },
    [isContentChanged]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handlePopState = (event) => {
      if (isContentChanged) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        if (!window.confirm(confirmationMessage)) {
          // Ngăn người dùng quay lại trang trước đó
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleBeforeUnload, isContentChanged]);

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
                frameborder="0"
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

  // const doc = new Y.Doc();

  // const provider = new YPartyKitProvider(
  //   "blocknote-dev.yousefed.partykit.dev",
  //   // use a unique name as a "room" for your application:
  //   "your-project-name",
  //   doc
  // );
  // console.log("provider", provider);
  const editor = useBlockNote({
    blockSpecs: blockSpecs,
    uploadFile: uploadToCustomDatabase,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertYouTubeLink,
    ],

    // collaboration: {
    //   // The Yjs Provider responsible for transporting updates:
    //   provider,
    //   // Where to store BlockNote data in the Y.Doc:
    //   fragment: doc.getXmlFragment("document-store"),
    //   // Information (name and color) for this user:
    //   user: {
    //     name: "My Username",
    //     color: "#ff0000",
    //   },
    // },

    onEditorContentChange: async function (editor) {
      const blocks = editor.topLevelBlocks;
      for (const block of blocks) {
        if (
          block.type === "image" &&
          block.props.url &&
          !block.props.url.includes("beekrowd_storage")
        ) {
          const newUrl = await uploadImageFromURLToSupabase(block.props.url);
          if (newUrl) {
            block.props.url = newUrl;
          }
        }
      }

      setBlocks(blocks);
      if (
        user?.id === currentProject?.user_id ||
        currentProject?.collabs?.includes(user.email)
      ) {
        setIsContentChanged(true); // Đánh dấu nội dung đã thay đổi
      }
    },
  });

  // Function to upload image to Supabase from URL
  const uploadImageFromURLToSupabase = async (imageUrl) => {
    try {
      // Download image from URL
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      // Create Blob from downloaded image data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Get current timestamp
      const timestamp = Date.now();

      // Create File object from Blob with filename as "img-{timestamp}"
      const file = new File([blob], `img-${timestamp}`, {
        type: response.headers["content-type"],
      });

      // Upload image file to Supabase storage
      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(`beekrowd_images/${file.name}`, file);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Return Supabase URL of the uploaded image
      const imageUrlFromSupabase = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;
      return imageUrlFromSupabase;
    } catch (error) {
      console.error("Error uploading image from URL to Supabase:", error);
      return null;
    }
  };

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
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        if (params) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("projects")
            .select("markdown")
            .match({ id: params.id })
            .single();
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
          setIsContentChanged(false); // Đánh dấu nội dung đã được lưu

          // Reset isSaved to false after 1 second
        }
      } else {
        message.error("You do not have permission to save this project.");
        setIsLoading(false);
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
            <div className="relative">
              {" "}
              <BlockNoteView
                editor={editor}
                theme={"light"}
                className="w-full lg:w-12/12"
              />
              {company?.keyWords && (
                <div className="mt-28 px-5">
                  <div className="text-black font-semibold">Keywords:</div>

                  <div className="mt-2">
                    {company.keyWords.split(",").map((keyWord, index) => {
                      const trimmedKeyword = keyWord.trim(); // Loại bỏ khoảng trắng ở đầu và cuối
                      if (trimmedKeyword) {
                        return (
                          <Badge
                            key={index}
                            className="mx-2 bg-yellow-300 border border-gray-300 truncate text-black mt-4 inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm text-center rounded-3xl"
                          >
                            {trimmedKeyword}
                          </Badge>
                        );
                      }
                      return null; // Loại bỏ từ khóa nếu chỉ còn khoảng trắng
                    })}
                  </div>
                </div>
              )}
              <div className="sm:px-5 sticky bottom-5 left-5">
                {user?.id === currentProject?.user_id ||
                currentProject?.collabs?.includes(user.email) ? (
                  <button
                    className={`min-w-[110px] mt-8 hover:cursor-pointer py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                      isLoading
                        ? "bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }  `}
                    onClick={handleSave}
                    type="button"
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 text-white">
                        <LoaderIcon className="h-full w-full" />
                      </div>
                    ) : (
                      "Save profile"
                    )}
                  </button>
                ) : null}
              </div>
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
      className={`px-8  flex flex-col  ${
        fullScreen === true ? "justify-center items-center" : ""
      }`}
    >
      {fullScreen === false && (
        <>
          <aside className="sticky z-20 top-0 bg-white">
            <div className="w-full  py-8 overflow-x-auto">
              <nav className="flex justify-between sm:space-x-4 sm:px-14">
                {/* Navbar */}
                {Object.keys(tabContents).map((tab) => (
                  <div
                    key={tab}
                    className={`cursor-pointer flex items-center sm:px-3 px-1 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? "text-blue-600 bg-blue-100 rounded-md"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab}
                  </div>
                ))}
              </nav>
            </div>
          </aside>
          <div className="w-full py-8 px-0 md:px-8">
            {/* Content */}
            {tabContents[activeTab]}
          </div>
        </>
      )}
      {fullScreen === true && (
        <BlockNoteView
          editor={editor}
          theme={"light"}
          className="w-full my-12"
        />
      )}
    </div>
  );
};

export default MyTab;
