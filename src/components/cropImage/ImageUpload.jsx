import React, { useState } from "react";
import ImageCropper from "./ImageCropper";
import { supabase } from "../../supabase";

const ImageUpload = () => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState("");

  const getBlob = (blob) => {
    setBlob(blob);
  };

  const onInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setInputImg(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    if (!blob) {
      console.error("No image to upload.");
      return;
    }

    // Assuming the use of Supabase and a bucket named 'beekrowd_storage'
    const fileExt = blob.type.split("/")[1];
    const fileName = `image_${Date.now()}.${fileExt}`;
    const filePath = `beekrowd_images/${fileName}`;

    try {
      const { error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(filePath, blob, {
          cacheControl: "3600",
          upsert: false,
          contentType: blob.type,
        });

      if (error) {
        throw error;
      }

      // Handle success scenario (e.g., display a message or redirect the user)
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload error:", error.message);
      // Handle upload error here
    }
  };

  return (
    <form onSubmit={handleSubmitImage}>
      <input type="file" accept="image/*" onChange={onInputChange} />
      {inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} />}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ImageUpload;
