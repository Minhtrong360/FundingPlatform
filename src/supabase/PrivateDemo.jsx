import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from ".";

// Khởi tạo client Supabase

function App() {
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const uploadFile = async (event) => {
    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const randomFileName = `${Math.random()}.${fileExt}`;
    const filePath = `profile_dataroom/${randomFileName}`;

    // Reset trạng thái
    setFileUrl("");
    setFileName("");

    // Upload file lên Supabase Storage trong bucket beekrowd_storage
    let { error: uploadError } = await supabase.storage
      .from("beekrowd_storage")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error", uploadError);
      return;
    }

    // Tạo Signed URL
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("beekrowd_storage")
        .createSignedUrl(filePath, 60 * 60); // URL có thời hạn 1 giờ

    if (signedUrlError) {
      console.error("Error creating signed URL", signedUrlError);
      return;
    }

    setFileUrl(signedUrlData.signedUrl);
    setFileName(file.name);
  };

  return (
    <div>
      <input type="file" accept=".doc,.docx,.pdf" onChange={uploadFile} />
      {fileUrl && (
        <div>
          <p>
            File "{fileName}" đã được upload thành công! Bạn có thể truy cập
            file qua link dưới đây (link có thời hạn 1 giờ):
          </p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
