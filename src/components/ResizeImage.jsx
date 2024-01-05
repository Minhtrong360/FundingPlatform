import React, { useState, useEffect } from "react";

const ImageCropper = ({ imageUrl }) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  console.log("imageUrl", imageUrl);

  useEffect(() => {
    if (imageUrl) {
      cropImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageUrl) {
      cropImage(imageUrl);
    }
  }, [imageUrl]);

  const cropImage = (src) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Đảm bảo cho phép CORS
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 700;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      // Tính toán vị trí cắt và kích thước
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const cropWidth = Math.min(image.naturalWidth, 700 * scaleX);
      const cropHeight = Math.min(image.naturalHeight, 800 * scaleY);
      const startX = (image.naturalWidth - cropWidth) / 2;
      const startY = (image.naturalHeight - cropHeight) / 2;

      // Điền nền trắng
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vẽ hình ảnh đã cắt
      ctx.drawImage(
        image,
        startX,
        startY,
        cropWidth,
        cropHeight,
        (700 - cropWidth / scaleX) / 2,
        (800 - cropHeight / scaleY) / 2,
        cropWidth / scaleX,
        cropHeight / scaleY
      );

      setCroppedImageUrl(canvas.toDataURL("image/jpeg"));
    };
  };
  console.log("croppedImageUrl", croppedImageUrl);
  return (
    <div>
      <img src={croppedImageUrl} alt="Cropped" />
    </div>
  );
};

export default ImageCropper;
