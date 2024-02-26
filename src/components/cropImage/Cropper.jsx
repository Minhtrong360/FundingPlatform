import EasyCropper from "react-easy-crop";
import { useImageCropContext } from "./ImageDropProvider";

const Cropper = () => {
  const {
    image,
    zoom,
    setZoom,
    rotation,
    setRotation,
    crop,
    setCrop,
    onCropComplete,
  } = useImageCropContext();

  return (
    <EasyCropper
      image={image || undefined}
      crop={crop}
      zoom={zoom}
      rotation={rotation}
      cropShape="rect"
      aspect={6 / 7} // Set the aspect ratio to 6/7
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
      onRotationChange={setRotation} // Corrected to onRotationChange for consistency with react-easy-crop API, if applicable
      showGrid={true}
      cropSize={{ width: 240, height: 280 }} // Set the crop frame to 240x280
      style={{
        containerStyle: {
          width: "300px", // Set the outer container width to 300
          height: "350px", // Set the outer container height to 350
          position: "relative", // Ensure the container is positioned relatively for internal positioning
        },
        cropAreaStyle: {
          width: "240px", // Optional: Style adjustments if needed for the crop area specifically
          height: "280px",
        },
      }}
    />
  );
};

export default Cropper;
