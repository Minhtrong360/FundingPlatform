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

import { Card, CardContent } from "../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";

const MyTab = ({
  company,
  currentProject,
  isContentChanged,
  setIsContentChanged,
}) => {
  console.log("company", company);

  const [activeTab, setActiveTab] = useState("Your Profile");
  const [tabs, setTabs] = useState([
    { key: "Your Profile", title: "Your Profile", editable: false },
    { key: "Sample PitchDeck", title: "Sample PitchDeck", editable: false },
    { key: "Data Room", title: "Data Room", editable: false },
  ]);
  const { user } = useAuth();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const doc = useRef(new Y.Doc()).current;

  // Initialize the Yjs WebsocketProvider
  const provider = new WebsocketProvider(
    "https://ywss-collab.onrender.com",
    params?.id,
    doc
  );

  // Function to check if the document exists on the WebSocket server
  const checkIfDocExistsOnProvider = () => {
    return new Promise((resolve) => {
      const fragment = doc.getXmlFragment("document-store");
      if (fragment.length > 0) {
        resolve(true); // Document exists
      } else {
        provider.on("sync", () => {
          resolve(fragment.length > 0);
        });
      }
    });
  };

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
        const updatedTabs = tabs.map((tab) => {
          if (tab.key === "Your Profile") {
            return { ...tab, content: data.markdown };
          }
          return tab;
        });
        setTabs(updatedTabs);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initEditorContent = async () => {
      const docExists = await checkIfDocExistsOnProvider();
      if (!docExists) {
        await loadContentFromSupabase(); // Load from DB if document does not exist
      }
    };

    initEditorContent();
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
    onCommand: () => {
      if (unChange) {
        // Prevent any command that would modify content
        return false;
      }
      return true;
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
      if (tab?.content && tab?.content.length > 0) {
        const markdown = JSON.parse(tab?.content);
        const updatedBlocks = markdown.map((block) => {
          if (block.type === "youtubeLink") {
            return {
              ...block,
              type: "video",
            };
          }
          return block;
        });

        editor.replaceBlocks(editor.topLevelBlocks, updatedBlocks);

        // const fragment = doc.getXmlFragment("document-store");
        // if (fragment.length === 0) {
        //   // Only load content from Supabase if the document is empty
        //   fragment.push(JSON.stringify(markdown));
        // }
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

  const handleChange = useCallback(
    async (editor, tabKey) => {
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
          if (tab.key === tabKey) {
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
      uploadImageFromURLToSupabase,
      currentProject?.user_id,
      currentProject?.collabs,
      user?.email,
    ]
  );
  const [unChange, setUnChange] = useState(true);

  useEffect(() => {
    if (
      user?.id === currentProject?.user_id ||
      currentProject?.collabs?.includes(user.email)
    ) {
      setUnChange(false);
    }
  }, []);

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
                className={`w-full ${unChange ? "pointer-events-none" : ""} my-4`}
                onChange={(editor) =>
                  debouncedHandleChange(editor, "Your Profile")
                }
              />

              <div>
                {user?.id === currentProject?.user_id ||
                currentProject?.collabs?.includes(user.email) ? (
                  <>
                    <button
                      className={`min-w-[110px] mt-8 hover:cursor-pointer py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                        isLoading
                          ? "bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                          : "bg-slate-700 text-white hover:bg-slate-900"
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
        <Card>
          <Sample />
        </Card>
      </div>
    ),

    "Data Room": (
      <div>
        <FilesList />
      </div>
    ),
  };

  return (
    <Tabs defaultValue="Your Profile" className="w-full">
      <TabsList className="w-full justify-start mb-4 !bg-gray-100">
        <TabsTrigger
          value="Your Profile"
          onClick={() => handleTabChange("Your Profile")}
        >
          Your Profile
        </TabsTrigger>
        <TabsTrigger
          value="Sample PitchDeck"
          onClick={() => handleTabChange("Sample PitchDeck")}
        >
          Sample PitchDeck
        </TabsTrigger>
        <TabsTrigger
          value="Data Room"
          onClick={() => handleTabChange("Data Room")}
        >
          Data Room
        </TabsTrigger>
      </TabsList>
      {tabContents[activeTab]}
    </Tabs>
  );
};

export default MyTab;
