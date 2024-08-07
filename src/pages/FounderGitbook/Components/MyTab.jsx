import { Badge, message, Button, Input, Modal } from "antd";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";
import FilesList from "../FilesList";

import axios from "axios";
import { useParams } from "react-router-dom";
import SpinnerBtn from "../../../components/SpinnerBtn";
import Sample from "./Sample";
// import * as Y from "yjs";
// import { WebsocketProvider } from "y-websocket";

const MyTab = ({ blocks, setBlocks, company, currentProject }) => {
  const [activeTab, setActiveTab] = useState("Your Profile");
  const [tabs, setTabs] = useState([
    { key: "Your Profile", title: "Your Profile", editable: false },
    { key: "Sample PitchDeck", title: "Sample PitchDeck", editable: false },
    { key: "Data Room", title: "Data Room", editable: false },
  ]);

  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [tabToDelete, setTabToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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

  // const doc = new Y.Doc();

  // const provider = new WebsocketProvider(
  //   "https://y-websocket-uznm.onrender.com",
  //   "my-roomname",
  //   doc
  // );

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

  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        setIsLoading(true);
        if (params) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .match({ id: params.id })
            .single();
          if (error) {
            throw error;
          } else {
            // Nếu có dữ liệu Markdown trong cơ sở dữ liệu, cập nhật giá trị của markdown
            if (data && data.markdown) {
              const updatedTabs = tabs.map((tab) => {
                if (tab.key === "Your Profile") {
                  return { ...tab, content: data.markdown };
                }
                return tab;
              });
              setTabs(updatedTabs);
            }
            if (data && data.tabs) {
              const customTabs = JSON.parse(data.tabs).map((tab) => ({
                ...tab,
                content: tab.content || JSON.stringify([]),
              }));
              setTabs((prevTabs) => {
                const defaultTabs = prevTabs.filter(
                  (tab) =>
                    tab.key === "Your Profile" ||
                    tab.key === "Sample PitchDeck" ||
                    tab.key === "Data Room"
                );
                return [...defaultTabs, ...customTabs];
              }); // Cập nhật tabs từ Supabase
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

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  useEffect(() => {
    if (
      !isLoading &&
      activeTab !== "Sample PitchDeck" &&
      activeTab !== "Data Room"
    ) {
      const tab = tabs.find((tab) => tab.key === activeTab);
      if (tab?.content) {
        editor.replaceBlocks(editor.topLevelBlocks, JSON.parse(tab.content));
      }
    }
  }, [activeTab, isLoading]);

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
        const tabsToSave = tabs.filter(
          (tab) =>
            tab.key !== "Your Profile" &&
            tab.key !== "Sample PitchDeck" &&
            tab.key !== "Data Room"
        );

        const { error } = await supabase
          .from("projects")
          .update({
            markdown: JSON.stringify(blocks),
            tabs: tabsToSave,
          })
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

  const addNewTab = () => {
    setIsModalVisible(true);
  };

  const deleteTab = () => {
    const filteredTabs = tabs.filter((tab) => tab.key !== tabToDelete.key);
    setTabs(filteredTabs);
    setActiveTab("Your Profile");
    setIsDeleteModalVisible(false);
    setTabToDelete(null);
  };

  const handleOk = () => {
    const newTabKey = `New Tab ${tabs.length - 2}`;
    setTabs([
      ...tabs,
      {
        key: newTabKey,
        title: newTabTitle,
        editable: true,
        content: JSON.stringify([]),
      },
    ]);
    setActiveTab(newTabKey);
    setIsModalVisible(false);
    setNewTabTitle("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewTabTitle("");
  };

  const tabContents = {
    ...(isDemo && user.email !== "ha.pham@beekrowd.com"
      ? {}
      : {
          "Your Profile": (
            <div className="relative">
              <BlockNoteView
                editor={editor}
                theme={"light"}
                className="w-full"
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
                        <SpinnerBtn isLoading={isLoading} />
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
        <FilesList />
      </div>
    ),
  };

  tabs.forEach((tab) => {
    if (!tabContents[tab.key]) {
      tabContents[tab.key] = (
        <div className="relative">
          <BlockNoteView
            editor={editor}
            theme={"light"}
            className="w-full"
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
                  if (videoElement && block.props.url.includes("youtube.com")) {
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

              // Update content of the current tab
              const updatedTabs = tabs.map((t) => {
                if (t.key === tab.key) {
                  return {
                    ...t,
                    content: JSON.stringify(blocks),
                  };
                }
                return t;
              });

              setTabs(updatedTabs);

              if (
                user?.id === currentProject?.user_id ||
                currentProject?.collabs?.includes(user.email)
              ) {
                setIsContentChanged(true); // Mark content as changed
              }
            }}
          />
          {company?.keyWords && (
            <div className="mt-28 px-5">
              <div className="text-black font-semibold">Keywords:</div>

              <div className="mt-2">
                {company.keyWords.split(",").map((keyWord, index) => {
                  const trimmedKeyword = keyWord.trim(); // Trim whitespace
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
                  return null; // Ignore empty keywords
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
                    <SpinnerBtn isLoading={isLoading} />
                  ) : (
                    "Save profile"
                  )}
                </button>
              </>
            ) : null}
          </div>
        </div>
      );
    }
  });

  const confirmDeleteTab = (tab) => {
    setTabToDelete(tab);
    setIsDeleteModalVisible(true);
  };
  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setTabToDelete(null);
  };

  return (
    <div className={`px-8  flex flex-col justify-center items-center`}>
      <>
        <aside className="w-full sticky z-20 top-0 bg-white">
          <div className="w-full  py-8 overflow-x-auto">
            <nav className="flex justify-between sm:space-x-4 sm:px-14">
              {/* Navbar */}
              {tabs.map((tab) => (
                <div
                  key={tab.key}
                  className={`cursor-pointer flex items-center sm:px-3 px-1 py-2 text-sm font-medium ${
                    activeTab === tab.key
                      ? "text-blue-600 bg-blue-100 rounded-md"
                      : "text-gray-600"
                  }`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.title}
                  {tab.editable && (
                    <button
                      className="ml-2 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteTab(tab);
                      }}
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md ml-4"
                onClick={addNewTab}
              >
                + Add Tab
              </button>
            </nav>
          </div>
        </aside>
        <div className="w-full py-8 px-0 md:px-8">
          {/* Content */}
          {tabContents[activeTab]}
        </div>
      </>
      <Modal
        title="Enter Tab Title"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Input
          value={newTabTitle}
          onChange={(e) => setNewTabTitle(e.target.value)}
        />
      </Modal>

      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={deleteTab}
        onCancel={handleDeleteCancel}
      >
        Are you sure you want to delete{" "}
        <span className="text-[#f5222d] font-semibold">
          {tabToDelete?.title}
        </span>
        ?
      </Modal>
    </div>
  );
};

export default MyTab;
