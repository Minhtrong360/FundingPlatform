import { useState, useEffect } from "react";

import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { supabase } from "../../supabase";
import { useParams } from "react-router-dom";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [editorError, setEditorError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái isLoading
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
        // Kiểm tra xem project có tồn tại không
        const { data, error } = await supabase
          .from("projects")
          .update({ markdown: blocks })
          .match({ id: params.id });
        if (error) {
          setEditorError(error);
        } else {
          setBlocks(data);
        }
      }
    } catch (error) {
      setEditorError(error);
    }
  };

  return (
    <div>
      {isLoading ? ( // Hiển thị thông báo tải dữ liệu khi isLoading là true
        <div>Loading...</div>
      ) : (
        <BlockNoteView editor={editor} theme="light" />
      )}
      {editorError && <div> {editorError}</div>}

      <div className="flex flex-col items-center justify-center">
        <button
          className={`flex justify-center mt-28 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
