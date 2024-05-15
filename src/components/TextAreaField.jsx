import React, { useEffect, useState } from "react";

export default function TextAreaField({ label, id, value, onChange, ...rest }) {
  const [characterCount, setCharacterCount] = useState(value.length); // State cho số ký tự

  useEffect(() => {
    setCharacterCount(value.length);
  }, [value]);

  // Hàm xử lý thay đổi trong textarea
  const handleTextAreaChange = (event) => {
    const inputValue = event.target.value;
    onChange(event); // Gọi hàm handleInputChange từ props để cập nhật giá trị vào formData

    // Kiểm tra độ dài của giá trị nhập vào

    // Cập nhật số ký tự
    setCharacterCount(inputValue.length);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows="10"
        minLength={50}
        maxLength={700}
        value={value}
        onChange={handleTextAreaChange} // Sử dụng hàm xử lý thay đổi mới
        className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
        {...rest}
      />

      <div className="text-sm text-gray-500 dark-text-gray-400 mt-1 text-right">
        {characterCount}/700
      </div>
    </div>
  );
}
