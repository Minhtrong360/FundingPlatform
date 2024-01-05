import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Upload, Button } from "antd";

const props = {
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  onChange({ file, fileList }) {
    if (file.status !== "uploading") {
      console.log(file, fileList);
    }
  },
};

const UploadFile = () => (
  <Upload
    // className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
    {...props}
  >
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
);

export default UploadFile;