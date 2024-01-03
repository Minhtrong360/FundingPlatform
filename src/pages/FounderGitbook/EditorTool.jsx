import { useState, useEffect } from "react";

import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { supabase } from "../../supabase";
import { useParams } from "react-router-dom";
import { CheckOutlined } from "@ant-design/icons";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [editorError, setEditorError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();

  useEffect(() => {
    // Hàm để lấy dữ liệu Markdown từ cơ sở dữ liệu
    async function fetchMarkdown() {
      try {
        if (params) {
          // Kiểm tra xem project có tồn tại không
          const { data, error } = await supabase
            .from("projects")
            .select("markdown")
            .match({ id: params.id })
            .single();

          if (error) {
            setEditorError(error);
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
        setEditorError(error);
        setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (có lỗi)
      }
    }

    // Gọi hàm để lấy Markdown khi component được mount
    if (params) {
      fetchMarkdown();
    } else {
      setIsLoading(false); // Đánh dấu là đã tải xong dữ liệu (không có project)
    }
  }, [params]);

  // Creates a new editor instance.

  const editor = useBlockNote({
    onEditorContentChange: function (editor) {
      setBlocks(editor.topLevelBlocks);
    },
  });

  const handleSave = async () => {
    try {
      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data, error } = await supabase
          .from("projects")
          .update({ markdown: blocks })
          .match({ id: params.id });

        if (error) {
          setEditorError(error);
        } else {
          setBlocks(data);

          // Set isSaved to true after a successful save
          setIsSaved(true);

          // Reset isLoading to false and enable the button
          setIsLoading(false);

          // Reset isSaved to false after 1 second
          setTimeout(() => {
            setIsSaved(false);
          }, 1000);
        }
      }
    } catch (error) {
      setEditorError(error);

      // Reset isLoading and isSaved to false in case of an error
      setIsLoading(false);
      setIsSaved(false);
    }
  };

  return (
    <div>
      <div>
      {isLoading ? ( // Hiển thị thông báo tải dữ liệu khi isLoading là true
        <div>Loading...</div>
      ) : (
        <BlockNoteView editor={editor} theme={"light"} style={{ width: "80%" }} />
      )}
      {editorError && <div> {editorError}</div>}
      </div>
      <div className="flex flex-col items-center justify-center">
        <button
          className={`flex justify-center mt-28 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
          onClick={handleSave}
          disabled={isLoading} // Disable the button when isLoading is true
        >
          {isLoading ? ( // Show loading indicator when isLoading is true
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-900 mr-2"></div>
              Saving...
            </div>
          ) : isSaved ? ( // Show green checkmark when isSaved is true
            <CheckOutlined style={{ fontSize: "24px" }} />
          ) : (
            // Show "Save" text when isLoading is false and isSaved is false
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}
