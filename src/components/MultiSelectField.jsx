import React from "react";
import { Select } from "antd";

const MultiSelectField = ({
  id,
  label,
  OPTIONS,
  selectedItems,
  setSelectedItems,
  required,
}) => {
  const filteredOptions = OPTIONS.filter((o) => !selectedItems?.includes(o));

  return (
    <div aria-required>
      <label
        htmlFor={id}
        className="block mb-2 text-sm text-gray-700 font-medium darkTextWhite"
      >
        {label}
      </label>
      <Select
        allowClear={true}
        size="large"
        mode="multiple"
        placeholder="No item"
        value={selectedItems}
        onChange={setSelectedItems}
        style={{
          width: "100%",
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
