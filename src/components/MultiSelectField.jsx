import React from "react";
import { Select, message } from "antd";

const MultiSelectField = ({
  id,
  label,
  OPTIONS,
  selectedItems,
  setSelectedItems,
  required,
}) => {
  const filteredOptions = OPTIONS.filter((o) => !selectedItems?.includes(o));

  const handleSelectChange = (value) => {
    // Kiểm tra số lượng mục được chọn không vượt quá 8
    if (value && value.length <= 8) {
      setSelectedItems(value);
    } else {
      message.warning("Choose maximum 8 items.");
      return;
    }
  };

  return (
    <div aria-required>
      <label htmlFor={id} className="block mb-2 text-sm  darkTextWhite">
        {label}
      </label>
      <Select
        allowClear={true}
        maxLength={8}
        size="large"
        mode="multiple"
        placeholder="No item"
        value={selectedItems}
        onChange={handleSelectChange}
        style={{
          width: "100%",
          // height: "60px",
        }}
        options={filteredOptions.map((item) => ({
          value: item,
          label: item,
        }))}
        aria-required={required || false}
      />
    </div>
  );
};
export default MultiSelectField;
