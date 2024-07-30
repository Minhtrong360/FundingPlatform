import { Badge, message, Button } from "antd";
import Modal from "react-modal";
import { useCreateBlockNote, createReactBlockSpec } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { YoutubeOutlined } from "@ant-design/icons";

import Sample from "./Sample";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";
import FilesList from "../FilesList";

import axios from "axios";
import { useParams } from "react-router-dom";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

const MyTab = ({ blocks, setBlocks, company, currentProject }) => {
  const [activeTab, setActiveTab] = useState("Your Profile");

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

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        // Tạo tên file độc đáo để tránh xung đột
        const uniqueFileName = `profile_images/${Date.now()}`;

        // Upload file lên Supabase Storage
        let { error, data } = await supabase.storage
          .from("beekrowd_storage")
          .upload(uniqueFileName, file);

        if (error) {
          console.log("error", error.message);

          throw error;
        }

        // Trả về URL của file
        return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
      } catch (error) {
        if (error.message === "The object exceeded the maximum allowed size") {
          message.error("The object exceeded the maximum allowed size (5MB).");
        } else message.error(error.message);

        // Xử lý lỗi tại đây
      }
    },
  });

  console.log("editor", editor);
  console.log("blocks", blocks);

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
              <BlockNoteView
                editor={editor}
                theme={"light"}
                className="w-full lg:w-8/12"
                onChange={async function (editor) {
                  const blocks = editor.topLevelBlocks;
                  for (const block of blocks) {
                    if (
                      block.type === "image" &&
                      block.props.url &&
                      !block.props.url.includes("beekrowd_storage")
                    ) {
                      const newUrl = await uploadImageFromURLToSupabase(
                        block.props.url
                      );
                      if (newUrl) {
                        block.props.url = newUrl;
                      }
                    }
                  }

                  // Handle video blocks
                  blocks.forEach((block) => {
                    if (block.type === "video") {
                      const videoElement = document.querySelector(
                        `video[src="${block.props.url}"]`
                      );
                      if (
                        videoElement &&
                        block.props.url.includes("youtube.com")
                      ) {
                        const videoId = block.props.url.split("v=")[1];
                        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                        const iframe = document.createElement("iframe");
                        iframe.width = block.props.previewWidth || "100%";
                        iframe.height = "315";
                        iframe.src = embedUrl;
                        iframe.frameBorder = "0";
                        iframe.allow =
                          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        iframe.allowFullscreen = true;
                        videoElement.replaceWith(iframe);
                      }
                    }
                  });

                  setBlocks(blocks);
                  if (
                    user?.id === currentProject?.user_id ||
                    currentProject?.collabs?.includes(user.email)
                  ) {
                    setIsContentChanged(true); // Đánh dấu nội dung đã thay đổi
                  }
                }}
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
                  <>
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
                        <LoadingButtonClick isLoading={isLoading} />
                      ) : (
                        "Save profile"
                      )}
                    </button>
                  </>
                ) : null}
              </div>
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
    <div className={`px-8  flex flex-col justify-center items-center`}>
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
    </div>
  );
};

export default MyTab;
