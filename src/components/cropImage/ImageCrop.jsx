import { useEffect, useState } from "react";

import Modal from "./Modal";
import { readFile } from "./cropImage";
import ImageCropModalContent from "./ImageCropModalContent";
import { useImageCropContext } from "./ImageDropProvider";
import { supabase } from "../../supabase";

const ImageCrop = ({
  previewWidth,
  previewHeight,
  initImage,
  cropWidth,
  cropHeight,
  formData,
  setFormData,
  name,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(initImage);

  const { getProcessedImage, setImage, resetStates } = useImageCropContext();

  const handleDone = async () => {
    try {
      const avatar = await getProcessedImage({ previewWidth, previewHeight });

      const filePath = `beekrowd_images/${avatar?.name}`;

      // Tải ảnh đã crop lên Supabase Storage
      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(filePath, avatar);

      if (error) {
        console.error("Error uploading image:", error.message);
        return;
      }

      // Lấy URL của ảnh đã lưu

      const imageUrl = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;

      // Lưu URL của ảnh vào cơ sở dữ liệu hoặc thực hiện các thao tác khác tùy theo yêu cầu của bạn

      // Đặt URL của ảnh vào state hoặc thực hiện các thao tác khác
      setPreview(imageUrl);

      // setPreview(window.URL.createObjectURL(avatar));

      resetStates();

      setOpenModal(false);
    } catch (error) {
      console.log("Lỗi xử lý ảnh:", error);
    }
  };

  useEffect(() => {
    setPreview(initImage);
  }, [initImage]);

  const handleFileChange = async ({ target: { files } }) => {
    try {
      console.log("name", name);
      const file = files && files[0];
      const imageDataUrl = await readFile(file);
      setImage(imageDataUrl);
      setOpenModal(true);
    } catch (error) {
      console.error("Lỗi khi đọc tệp hình ảnh:", error);
    }
  };

  // Kiểm tra xem croppedAreaPixels có tồn tại và có chứa thông tin về kích thước không

  useEffect(() => {
    if (name === "profileImage") {
      setFormData({
        ...formData,
        project_url: preview,
      });
    } else if (name === "cardImage") {
      setFormData({
        ...formData,
        card_url: preview,
      });
    }
  }, [preview]);

  return (
    <div className=" flex justify-center items-center z-50">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id={name}
        accept="image/*"
      />
      <label htmlFor={name} className="cursor-pointer">
        <img
          src={preview}
          width={previewWidth}
          height={previewHeight}
          className="object-cover"
          alt=""
        />
      </label>

      <Modal open={openModal} handleClose={() => setOpenModal(false)}>
        <ImageCropModalContent
          handleDone={handleDone}
          handleClose={() => setOpenModal(false)}
          cropWidth={cropWidth}
          cropHeight={cropHeight}
        />
      </Modal>
    </div>
  );
};

export default ImageCrop;
