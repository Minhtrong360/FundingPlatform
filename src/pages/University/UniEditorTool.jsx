import { useState, useEffect } from "react";
import {
  BlockNoteView,
  createReactBlockSpec,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import { defaultBlockSchema, defaultBlockSpecs } from "@blocknote/core";
import "@blocknote/core/style.css";
import { supabase } from "../../supabase";
import { YoutubeOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import ReactModal from "react-modal";
import axios from "axios";

// Create the YouTube Link block
const YouTubeLinkBlock = createReactBlockSpec(
  {
    type: "youtubeLink",
    propSchema: {
      videoId: {
        default: "",
      },
    },
    content: "none",
  },
  {
    render: ({ block }) => (
      <div
        className="flex justify-center relative w-full"
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
    ),
    toExternalHTML: ({ block }) =>
      block.props.videoId
        ? `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
        : "",
    parse: (element) => {
      const iframe = element.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src");
        const videoIdMatch = src.match(/embed\/([^?]+)/);
        if (videoIdMatch) {
          return { videoId: videoIdMatch[1] };
        }
      }
    },
  }
);

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

// Our block schema, which contains the configs for blocks that we want our editor to use.
const blockSchema = {
  ...defaultBlockSchema,
  youtubeLink: YouTubeLinkBlock.config,
};

// Our block specs, which contain the configs and implementations for blocks that we want our editor to use.
const blockSpecs = {
  ...defaultBlockSpecs,
  youtubeLink: YouTubeLinkBlock,
};

export default function UniEditorTool({
  selectedCode,
  setSelectedCode,
  unChange,
  handleUpdateRules,
}) {
  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const { data, error } = await supabase
          .from("code")
          .select("rules")
          .eq("id", selectedCode.id)
          .single();

        if (error) {
          throw error;
        }

        editor.replaceBlocks(editor.topLevelBlocks, JSON.parse(data?.rules));
      } catch (error) {
        console.error("Error fetching rules:", error);
      }
    };

    fetchMarkdown();
  }, [selectedCode?.id]);

  const insertYouTubeLink = {
    name: "Youtube",
    execute: (editor) => openModal(),
    aliases: ["youtube", "video", "link"],
    group: "Other",
    icon: <YoutubeOutlined />,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("Add wanted youtube url");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const uploadToCustomDatabase = async (file) => {
    try {
      const uniqueFileName = `profile_images/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(uniqueFileName, file);

      if (error) {
        throw error;
      }

      return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
    } catch (error) {
      message.error("Error uploading file:", error.message);
    }
  };

  const editor = useBlockNote({
    blockSpecs: blockSpecs,
    uploadFile: uploadToCustomDatabase,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertYouTubeLink,
    ],
    onEditorContentChange: async (editor) => {
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
      setSelectedCode((prevCode) => ({
        ...prevCode,
        rules: JSON.stringify(blocks),
      }));
    },
  });

  const handleInsertYouTubeLink = () => {
    const videoIdMatch = youtubeLink.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=player_embedded&v=|watch\?v=|watch\?v=))([^&?\s]+)/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (videoId) {
      editor.insertBlocks(
        [{ type: "youtubeLink", props: { videoId } }],
        editor.getTextCursorPosition().block,
        "after"
      );
      closeModal();
    } else {
      alert("Invalid YouTube video URL. Please provide a valid URL.");
    }
  };

  return (
    <>
      <div className="flex-grow items-center justify-center max-w-[85rem] py-10 ">
        <BlockNoteView
          editor={editor}
          theme={"light"}
          className={`${unChange ? "pointer-events-none" : ""}`}
        />

        {unChange && (
          <div
            className="absolute top-0 left-0 w-full h-full bg-transparent z-10"
            style={{ pointerEvents: "none" }}
          ></div>
        )}
        {unChange ? null : (
          <Button
            onClick={() => handleUpdateRules(selectedCode)}
            className="text-sm bg-blue-600 text-white ml-5 mt-5"
          >
            Update
          </Button>
        )}

        <ReactModal
          ariaHideApp={false}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="YouTube Link Modal"
          style={{
            overlay: {
              backgroundColor: "gray",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            },
            content: {
              border: "none",
              background: "none",
              margin: "auto",
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
        </ReactModal>
      </div>
    </>
  );
}
