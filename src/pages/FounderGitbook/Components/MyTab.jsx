import { Badge, message, Button, Input, Modal } from "antd";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase";
import { useAuth } from "../../../context/AuthContext";
import FilesList from "../FilesList";

import axios from "axios";
import { useParams } from "react-router-dom";
import SpinnerBtn from "../../../components/SpinnerBtn";
import Sample from "./Sample";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import debounce from "lodash.debounce";

const MyTab = ({ company, currentProject }) => {
  const [activeTab, setActiveTab] = useState("Your Profile");
  const [tabs, setTabs] = useState([
    { key: "Your Profile", title: "Your Profile", editable: false },
    { key: "Sample PitchDeck", title: "Sample PitchDeck", editable: false },
    { key: "Data Room", title: "Data Room", editable: false },
  ]);

  const { user } = useAuth();
  const params = useParams();

  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [tabToDelete, setTabToDelete] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const doc = useRef(new Y.Doc()).current;

  // Initialize the Yjs WebsocketProvider
  const provider = new WebsocketProvider(
    "https://ywss-collab.onrender.com",
    params?.id,
    doc
  );

  const loadContentFromSupabase = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .match({ id: params.id })
        .single();

      if (error) {
        throw error;
      }

      if (data && data.markdown) {
        const initialContent = JSON.parse(data.markdown);
        const fragment = doc.getXmlFragment("document-store");
        if (fragment.length === 0) {
          // Only load content from Supabase if the document is empty
          fragment.push(JSON.stringify(initialContent));
        }
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
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load content from Supabase if the Yjs document is empty
    if (doc.getXmlFragment("document-store").length === 0) {
      loadContentFromSupabase();
    }
  }, [doc]);

  const colors = [
    "#958DF1",
    "#F98181",
    "#FBBC88",
    "#FAF594",
    "#70CFF8",
    "#94FADB",
    "#B9F18D",
    "#FACF5A",
    "#F29E4A",
    "#E2717D",
    "#C94C4C",
  ];

  const getRandomElement = (list) =>
    list[Math.floor(Math.random() * list.length)];

  const getRandomColor = () => getRandomElement(colors);

  // Initialize the BlockNote editor with the collaboration provider
  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        const uniqueFileName = `profile_images/${Date.now()}`;
        let { error, data } = await supabase.storage
          .from("beekrowd_storage")
          .upload(uniqueFileName, file);

        if (error) {
          throw error;
        }

        return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
      } catch (error) {
        if (error.message === "The object exceeded the maximum allowed size") {
          message.error("The object exceeded the maximum allowed size (5MB).");
        } else message.error(error.message);
      }
    },
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: user?.email,
        color: getRandomColor(),
      },
    },
  });

  const uploadImageFromURLToSupabase = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const timestamp = Date.now();

      const file = new File([blob], `img-${timestamp}`, {
        type: response.headers["content-type"],
      });

      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(`beekrowd_images/${file.name}`, file);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      const imageUrlFromSupabase = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;
      return imageUrlFromSupabase;
    } catch (error) {
      console.error("Error uploading image from URL to Supabase:", error);
      return null;
    }
  };

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

  useEffect(() => {
    if (doc.getXmlFragment("document-store").length === 0) {
      loadContentFromSupabase();
    }
  }, []);

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
            markdown: tabs.find((tab) => tab.key === "Your Profile")?.content,
            tabs: tabsToSave,
          })
          .match({ id: params.id });

        if (error) {
          message.error(error.message);
        } else {
          setIsLoading(false);
          message.success("Saved successfully.");
          setIsContentChanged(false);
        }
      } else {
        message.error("You do not have permission to save this project.");
        setIsLoading(false);
      }
    } catch (error) {
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

  const handleChange = useCallback(
    async (editor) => {
      const blocks = editor.topLevelBlocks;
      const updatedBlocks = [...blocks];

      const imagePromises = updatedBlocks.map(async (block) => {
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
      });

      await Promise.all(imagePromises);

      updatedBlocks.forEach((block) => {
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

      setTabs((prevTabs) => {
        return prevTabs.map((tab) => {
          if (tab.key === "Your Profile") {
            return {
              ...tab,
              content: JSON.stringify(updatedBlocks),
            };
          }
          return tab;
        });
      });
      if (
        user?.id === currentProject?.user_id ||
        currentProject?.collabs?.includes(user.email)
      ) {
        setIsContentChanged(true);
      }
    },
    [
      user?.id,
      currentProject?.user_id,
      currentProject?.collabs,
      setIsContentChanged,
      uploadImageFromURLToSupabase,
    ]
  );

  const debouncedHandleChange = useRef(debounce(handleChange, 300)).current;

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
                onChange={debouncedHandleChange}
              />
              {company?.keyWords && (
                <div className="mt-28 px-5">
                  <div className="text-black font-semibold">Keywords:</div>

                  <div className="mt-2">
                    {company.keyWords.split(",").map((keyWord, index) => {
                      const trimmedKeyword = keyWord.trim();
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
                      return null;
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
                setIsContentChanged(true);
              }
            }}
          />
          {company?.keyWords && (
            <div className="mt-28 px-5">
              <div className="text-black font-semibold">Keywords:</div>

              <div className="mt-2">
                {company.keyWords.split(",").map((keyWord, index) => {
                  const trimmedKeyword = keyWord.trim();
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
                  return null;
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
