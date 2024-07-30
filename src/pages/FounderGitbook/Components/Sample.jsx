import { useState, useEffect } from "react";
import {
  BlockNoteViewRaw,
  createReactBlockSpec,
  useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";

import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";

import { message } from "antd";
import { supabase } from "../../../supabase";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

export default function Sample() {
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading

  const id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";

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
          return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
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

  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }

        // Kiểm tra xem project có tồn tại không
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .match({ id: id })
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

  // Function to open the Modal

  // Function to close the Modal

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

  // Creates a new editor instance.

  const editor = useCreateBlockNote({
    blockSpecs: blockSpecs,
    uploadFile: uploadToCustomDatabase,
  });

  // Function to handle inserting YouTube Link block

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <div className="flex-grow items-center justify-center pb-10 ">
          <BlockNoteViewRaw
            editor={editor}
            theme={"light"}
            className="w-full "
          />
        </div>
      )}
    </>
  );
}
