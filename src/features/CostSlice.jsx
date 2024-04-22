import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  costInputs: [
    {
      id: 1,
      costName: "Website",
      costValue: 1000,
      growthPercentage: 5,
      beginMonth: 1,
      endMonth: 6,
      growthFrequency: "Monthly",
      costType: "Sales, Marketing Cost",
    },
    {
      id: 2,
      costName: "Marketing",
      costValue: 500,
      growthPercentage: 10,
      beginMonth: 1,
      endMonth: 36,
      growthFrequency: "Annually",
      costType: "Sales, Marketing Cost",
    },
    {
      id: 3,
      costName: "Rent",
      costValue: 1000,
      growthPercentage: 4,
      beginMonth: 1,
      endMonth: 36,
      growthFrequency: "Annually",
      costType: "General Administrative Cost",
    },
  ],
  costData: [],
  costTableData: [],
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
    setCostTableData(state, action) {
      state.costTableData = action.payload;
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
        if (costInput.growthFrequency === "Monthly") {
          monthlyCosts.push({ month: month, cost: currentCost });
          currentCost *= 1 + parseFloat(costInput.growthPercentage) / 100;
        } else if (
          costInput.growthFrequency === "Annually" ||
          costInput.growthFrequency === "Quarterly" ||
          costInput.growthFrequency === "Semi-Annually"
        ) {
          let frequency = 12;
          if (costInput.growthFrequency === "Quarterly") frequency = 3;
          else if (costInput.growthFrequency === "Semi-Annually") frequency = 6;

          if (
            month === costInput.beginMonth ||
            (month > costInput.beginMonth &&
              (month - costInput.beginMonth) % frequency === 0)
          ) {
            if (month !== costInput.beginMonth) {
              currentCost *= 1 + parseFloat(costInput.growthPercentage) / 100;
            }
          }
          monthlyCosts.push({ month: month, cost: currentCost });
        }
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

export const transformCostDataForTable = (tempCostInput, numberOfMonths) => {
  const transformedCustomerTableData = {};
  const calculatedCostData = calculateCostData(tempCostInput, numberOfMonths);

  calculatedCostData?.forEach((costItem) => {
    const rowKey = `${costItem.costName}`;
    costItem.monthlyCosts.forEach((monthData) => {
      if (!transformedCustomerTableData[rowKey]) {
        transformedCustomerTableData[rowKey] = {
          key: rowKey,
          costName: rowKey,
        };
      }
      transformedCustomerTableData[rowKey][`month${monthData.month}`] =
        formatNumber(parseFloat(monthData.cost)?.toFixed(0));
    });
  });

  return Object.values(transformedCustomerTableData);
};

export const { setCostInputs, setCostData, setIsSaved, setCostTableData } =
  costSlice.actions;

export default costSlice.reducer;
