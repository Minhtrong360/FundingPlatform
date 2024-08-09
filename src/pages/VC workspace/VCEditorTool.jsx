import { useState, useEffect } from "react";
import { BlockNoteView } from "@blocknote/mantine";

import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { supabase } from "../../supabase";
import { Button, message } from "antd";
import axios from "axios";

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

export default function VCEditorTool({
  selectedCode,
  setSelectedCode,
  unChange,
  handleUpdateRules,
}) {
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
  });

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

  return (
    <>
      <div className="flex-grow items-center justify-center max-w-[85rem] py-10 ">
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

            setSelectedCode((prevCode) => ({
              ...prevCode,
              rules: JSON.stringify(blocks),
            }));
          }}
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
      </div>
    </>
  );
}
