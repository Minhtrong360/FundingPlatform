import { useState } from "react";

import Modal from "./Modal";
import { readFile } from "./cropImage";
import ImageCropModalContent from "./ImageCropModalContent";
import { useImageCropContext } from "./ImageDropProvider";

const ImageCrop = ({ width, height, initImage }) => {
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(initImage);

  const { getProcessedImage, setImage, resetStates } = useImageCropContext();

  const handleDone = async () => {
    const avatar = await getProcessedImage();
    setPreview(window.URL.createObjectURL(avatar));
    resetStates();
    setOpenModal(false);
  };

  const handleFileChange = async ({ target: { files } }) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
    setOpenModal(true);
  };

  return (
    <div className=" flex justify-center items-center z-50">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="avatarInput"
        accept="image/*"
      />
      <label htmlFor="avatarInput" className="cursor-pointer">
        <img
          src={preview}
          height={height}
          width={width}
          className="object-cover"
          alt=""
        />
      </label>

      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <ImageCropModalContent
          handleDone={handleDone}
          handleClose={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ImageCrop;
