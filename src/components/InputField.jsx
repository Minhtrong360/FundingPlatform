import { Tooltip } from "antd";
import React from "react";

// Hàm format số với định dạng 100,000
const formatNumber = (value) => {
  // Chuyển đổi giá trị thành chuỗi và loại bỏ tất cả các dấu phẩy
  const stringValue = value.toString().replace(/,/g, "");
  // Sử dụng regex để thêm dấu phẩy mỗi 3 chữ số
  return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function InputField({
  label,
  id,
  title,
  changePassword,
  setIsChangePasswordModalOpen,
  ...rest
}) {
  // Kiểm tra nếu 'name' là 'targetAmount', 'typeOffering' hoặc 'minTicketSize'
  if (
    rest.name === "targetAmount" ||
    rest.name === "noTicket" ||
    rest.name === "minTicketSize"
  ) {
    // Chuyển đổi type thành text
    rest.type = "text";
    // Format giá trị nếu có
    if (rest.value) {
      rest.value = formatNumber(rest.value);
    }
  }

  return (
    <div>
      <Tooltip title={title}>
        {changePassword ? (
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor={id} className="block mb-2 text-sm darkTextWhite">
                {label}
              </label>
            </div>
            <div>
              <label
                className="block mb-2 text-xs darkTextWhite italic text-blue-600 hover:cursor-pointer"
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                * Change password
              </label>
            </div>
          </div>
        ) : (
          <label htmlFor={id} className="block mb-2 text-sm darkTextWhite">
            {label.split("*")[0]}
            <span className="font-extrabold">{label.includes("*") && "*"}</span>
          </label>
        )}
      </Tooltip>

      <input
        id={id}
        className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  darkTextGray400 "
        {...rest}
      />
    </div>
  );
}
