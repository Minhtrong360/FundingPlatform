import React, { useState, useEffect } from "react";

const ImageCropper = ({ className, imageUrl, width, height, onClick }) => {
  const [scaledImageUrl, setScaledImageUrl] = useState("");

  useEffect(() => {
    if (imageUrl) {
      scaleImage(imageUrl);
    }
  }, [imageUrl]);

  const scaleImage = (src) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Đảm bảo cho phép CORS
    image.src = src;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Điền nền trắng
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Tính toán tỷ lệ thu nhỏ hoặc phóng to
      const scaleX = canvas.width / image.width;
      const scaleY = canvas.height / image.height;
      const scale = Math.min(scaleX, scaleY);

      // Tính toán vị trí để căn giữa ảnh
      const offsetX = (canvas.width - image.width * scale) / 2;
      const offsetY = (canvas.height - image.height * scale) / 2;

      // Áp dụng biến đổi để zoom in hoặc zoom out ảnh
      ctx.drawImage(
        image,
        offsetX,
        offsetY,
        image.width * scale,
        image.height * scale
      );

      setScaledImageUrl(canvas.toDataURL("image/jpeg"));
    };
  };

  return (
    <div>
      <img
        onClick={onClick}
        className={className}
        src={scaledImageUrl}
        alt="Zoomed"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ImageCropper;
