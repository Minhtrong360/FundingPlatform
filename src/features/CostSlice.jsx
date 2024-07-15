import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  costInputs: [
    {
      id: 1,
      costName: "Website",
      costValue: 1000,
      growthPercentage: 5,
      beginMonth: 1,
      endMonth: 36,
      growthFrequency: "Monthly",
      costType: "Based on Revenue",
      costGroup: "Professional Fees",
      salePercentage: 5,
      relatedRevenue: "Offline - Cake",
      applyAdditionalInfo: false,
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
      costGroup: "Professional Fees",
      salePercentage: 0,
      relatedRevenue: "",
      applyAdditionalInfo: false,
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
      costGroup: "Rent",
      salePercentage: 0,
      relatedRevenue: "",
      applyAdditionalInfo: false,
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
    if (value == null) return "0";
    const stringValue = value.toString().replace(/,/g, "");
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    console.error("Error formatting number:", error);
    return value;
  }
};

export const parseNumber = (value) => {
  try {
    if (typeof value === "string") {
      const numberString = value.replace(/,/g, "");
      const parsedNumber = parseFloat(numberString);

      if (isNaN(parsedNumber)) {
        return 0;
      }

      return parsedNumber;
    } else {
      return value;
    }
  } catch (error) {
    console.error("Error parsing number:", error);
    return 0;
  }
};

export const calculateCostData = (
  tempCostInput,
  numberOfMonths,
  revenueData
) => {
  let allCosts = [];
  tempCostInput?.forEach((costInput) => {
    let monthlyCosts = [];
    let currentCost = parseFloat(costInput.costValue);
    for (let month = 1; month <= numberOfMonths; month++) {
      if (costInput.applyAdditionalInfo && costInput.gptResponseArray?.length) {
        // Use gptResponseArray if applyAdditionalInfo is true and gptResponseArray exists
        currentCost = costInput.gptResponseArray[month - 1] || 0;
        monthlyCosts.push({ month: month, cost: currentCost });
      } else if (
        costInput.costType === "Based on Revenue" &&
        month >= costInput.beginMonth &&
        month <= costInput.endMonth
      ) {
        const relatedRevenue = revenueData[costInput.relatedRevenue] || [];
        const revenueForMonth = relatedRevenue[month - 1] || 0;
        currentCost = (costInput.salePercentage / 100) * revenueForMonth;
        monthlyCosts.push({ month: month, cost: currentCost });
      } else {
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
            else if (costInput.growthFrequency === "Semi-Annually")
              frequency = 6;

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
    }
    allCosts.push({
      costName: costInput.costName,
      monthlyCosts,
      costType: costInput.costType,
      costGroup: costInput.costGroup?.toUpperCase(), // Include the cost group in the cost data
    });
  });
  return allCosts;
};

export const transformCostDataForTable = (
  tempCostInput,
  numberOfMonths,
  revenueData
) => {
  const transformedTableData = {};
  const calculatedCostData = calculateCostData(
    tempCostInput,
    numberOfMonths,
    revenueData
  );

  calculatedCostData?.forEach((costItem) => {
    const rowKey = `${costItem.costName}`;
    costItem.monthlyCosts.forEach((monthData) => {
      if (!transformedTableData[rowKey]) {
        transformedTableData[rowKey] = {
          key: rowKey,
          costName: rowKey,
          costGroup: costItem.costGroup?.toUpperCase(), // Include the cost group for grouping
        };
      }
      transformedTableData[rowKey][`month${monthData.month}`] = formatNumber(
        parseFloat(monthData.cost)?.toFixed(2)
      );
    });
  });

  // Group costs by costGroup
  const costGroups = [
    ...new Set(tempCostInput.map((input) => input.costGroup?.toUpperCase())),
  ];
  const categorizedTableData = [];

  costGroups.forEach((group) => {
    categorizedTableData.push({
      key: `${group}`,
      costName: `${group}`,
      isHeader: true,
    });

    const costsOfGroup = Object.values(transformedTableData).filter(
      (data) => data.costGroup?.toUpperCase() === group?.toUpperCase()
    );

    costsOfGroup.forEach((data) => categorizedTableData.push(data));
  });

  // Add total row
  const totalRow = { key: "Total", costName: "Total" };
  for (let month = 1; month <= numberOfMonths; month++) {
    let totalMonthlyCost = 0;
    calculatedCostData.forEach((costItem) => {
      const cost =
        costItem.monthlyCosts.find((data) => data.month === month)?.cost || 0;
      totalMonthlyCost += cost;
    });
    totalRow[`month${month}`] = formatNumber(totalMonthlyCost.toFixed(2));
  }
  categorizedTableData.push(totalRow);

  return categorizedTableData;
};

export const { setCostInputs, setCostData, setCostTableData } =
  costSlice.actions;

export default costSlice.reducer;
