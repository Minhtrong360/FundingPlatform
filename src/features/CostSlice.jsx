import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  costInputs: [
    {
      id: 1,
      costName: "Website",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 36,
      costType: "Sales, Marketing Cost",
    },
    {
      id: 2,
      costName: "Marketing",
      costValue: 500,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 36,
      costType: "Sales, Marketing Cost",
    },
    {
      id: 3,
      costName: "Rent",
      costValue: 1000,
      growthPercentage: 2,
      beginMonth: 1,
      endMonth: 36,
      costType: "General Administrative Cost",
    },
  ],
  costData: [],
};

const costSlice = createSlice({
  name: "cost",
  initialState,
  reducers: {
    setCostInputs(state, action) {
      state.costInputs = action.payload;
    },
    setCostData(state, action) {
      state.costData = action.payload;
    },
  },
});

export const formatNumber = (value) => {
  try {
    const stringValue = value?.toString()?.replace(/,/g, "");
    // Sử dụng regex để thêm dấu phẩy mỗi 3 chữ số
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {}
};

export const parseNumber = (value) => {
  if (typeof value === "string") {
    // Xóa dấu phẩy trong chuỗi giá trị
    const numberString = value.replace(/,/g, "");
    // Chuyển đổi chuỗi thành số
    const parsedNumber = parseFloat(numberString);
    // Kiểm tra nếu giá trị không phải là một số hợp lệ, trả về 0
    if (isNaN(parsedNumber)) {
      return 0;
    }
    return parsedNumber;
  } else {
    return value;
  }
};

export const calculateCostData = (tempCostInput, numberOfMonths) => {
  let allCosts = [];
  tempCostInput?.forEach((costInput) => {
    let monthlyCosts = [];
    let currentCost = parseFloat(costInput.costValue);
    for (let month = 1; month <= numberOfMonths; month++) {
      if (month >= costInput.beginMonth && month <= costInput.endMonth) {
        monthlyCosts.push({ month: month, cost: currentCost });
        currentCost *= 1 + parseFloat(costInput.growthPercentage) / 100;
      } else {
        monthlyCosts.push({ month: month, cost: 0 });
      }
    }
    allCosts.push({
      costName: costInput.costName,
      monthlyCosts,
      costType: costInput.costType,
    });
  });
  return allCosts;
};

export const { setCostInputs, setCostData, setIsSaved } = costSlice.actions;

export default costSlice.reducer;
