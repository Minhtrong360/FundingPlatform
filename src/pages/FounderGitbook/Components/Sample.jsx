import { useState, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";

import { BlockNoteView } from "@blocknote/mantine";

import { message } from "antd";
import { supabase } from "../../../supabase";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

export default function Sample() {
  const [isLoading, setIsLoading] = useState(false);

  const id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }

        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .match({ id: id })
          .single();

        if (error) {
          throw error;
        } else {
          if (data && data.markdown) {
            const markdown = JSON.parse(data.markdown);
            const updatedBlocks = markdown.map((block) => {
              if (block.type === "youtubeLink") {
                const videoIdMatch = block.props.videoId
                  ? block.props.videoId.match(/([^?&/]+)$/)
                  : null;
                const videoId = videoIdMatch ? videoIdMatch[0] : null;

                if (videoId) {
                  return {
                    ...block,
                    type: "video",
                    props: {
                      ...block.props,
                      url: `https://www.youtube.com/embed/${videoId}`,
                      previewWidth: "100%",
                    },
                  };
                }
              }
              return block;
            });
            editor.replaceBlocks(editor.topLevelBlocks, updatedBlocks);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
        setIsLoading(false);
      }
    }

    fetchMarkdown();
  }, []);

  const editor = useCreateBlockNote();

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <div className="flex-grow items-center justify-center pb-10 my-4 max-w-[80vw]">
          <BlockNoteView
            editor={editor}
            theme={"light"}
            className="w-full max-w-full "
            onChange={async function (editor) {
              const blocks = editor.topLevelBlocks;

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
            }}
          />
        </div>
      )}
    </>
  );
}
