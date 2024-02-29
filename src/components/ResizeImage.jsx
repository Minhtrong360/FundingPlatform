import { useEffect, useState } from "react";

const ResizeImage = ({ className, imageUrl, width, height, onClick }) => {
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

      // Điền nền trắng (nếu bạn muốn giữ nền cho những phần không được lắp đầy)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Luôn sử dụng scaleX để lắp đầy chiều rộng
      const scale = canvas.width / image.width;
      const scaledHeight = image.height * scale;

      // Tính toán vị trí để căn giữa ảnh theo chiều dọc
      const offsetY = (canvas.height - scaledHeight) / 2;

      // Kiểm tra nếu ảnh sau khi scale vẫn nhỏ hơn chiều cao của canvas, cần căn giữa theo chiều dọc
      const drawOffsetY = scaledHeight < canvas.height ? offsetY : 0;

      // Áp dụng biến đổi để zoom in hoặc zoom out ảnh
      ctx.drawImage(image, 0, drawOffsetY, canvas.width, scaledHeight);

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
        style={{ width: "100%", objectFit: "cover", height: "100%" }} // Chỉnh sửa objectFit để ảnh lắp đầy
      />
    </div>
  );
};

export default ResizeImage;
