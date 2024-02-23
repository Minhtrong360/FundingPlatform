export const readFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

const getCroppedImg = async (
  previewWidth,
  previewHeight,
  imageSrc,
  pixelCrop = { x: 0, y: 0, width: 1, height: 1 }, // Sửa đổi để mặc định pixelCrop là toàn bộ ảnh
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Tính toán kích thước mới cho vùng crop sao cho tỷ lệ là 7:8
  const targetWidth = previewWidth;
  const targetHeight = previewHeight;
  const targetRatio = targetWidth / targetHeight;

  let newWidth = pixelCrop.width;
  let newHeight = pixelCrop.height;

  if (pixelCrop.width / pixelCrop.height > targetRatio) {
    newWidth = pixelCrop.height * targetRatio;
  } else {
    newHeight = pixelCrop.width / targetRatio;
  }

  const newCrop = {
    x: pixelCrop.x + (pixelCrop.width - newWidth) / 2,
    y: pixelCrop.y + (pixelCrop.height - newHeight) / 2,
    width: newWidth,
    height: newHeight,
  };

  // Tiến hành crop ảnh với vùng crop mới tính toán được
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(
    image,
    newCrop.x,
    newCrop.y,
    newCrop.width,
    newCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  // Return ảnh đã crop
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve({ file, url: URL.createObjectURL(file) });
    }, "image/jpeg");
  });
};

export default getCroppedImg;
