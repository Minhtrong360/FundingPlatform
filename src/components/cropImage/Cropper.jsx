import EasyCropper from "react-easy-crop";
import { useImageCropContext } from "./ImageDropProvider";

const Cropper = ({ cropWidth, cropHeight }) => {
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
      aspect={cropWidth / cropHeight}
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
      setRotation={setRotation}
      showGrid={true}
      cropSize={{ width: cropWidth, height: cropHeight }}
      style={{
        containerStyle: {
          width: 270,
          height: 320,
          top: 16,
          bottom: 16,
          left: 8,
          right: 8,
        },
      }}
    />
  );
};

export default Cropper;
