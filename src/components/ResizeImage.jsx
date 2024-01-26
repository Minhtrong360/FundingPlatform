import React, { useState, useEffect } from "react";

const ImageCropper = ({ className, imageUrl, width, height, onClick }) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState("");

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
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Tính toán tỷ lệ thu nhỏ hoặc phóng to
      const scaleX = canvas.width / image.width;
      const scaleY = canvas.height / image.height;
      const scale = Math.min(scaleX, scaleY);

      // Tính toán kích thước mới của ảnh sau khi thu nhỏ
      const newWidth = image.width * scale;
      const newHeight = image.height * scale;

      // Tính toán vị trí để căn giữa ảnh
      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      // Áp dụng biến đổi để thu nhỏ ảnh
      ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);

      // Tạo một canvas mới để cắt ảnh
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      const croppedCtx = croppedCanvas.getContext("2d");

      // Cắt ảnh từ canvas gốc
      croppedCtx.drawImage(
        canvas,
        offsetX,
        offsetY,
        newWidth,
        newHeight,
        0,
        0,
        width,
        height
      );

      setCroppedImageUrl(croppedCanvas.toDataURL("image/jpeg"));
    };
  };

  return (
    <div>
      <img
        onClick={onClick}
        className={className}
        src={croppedImageUrl}
        alt="Cropped"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ImageCropper;
