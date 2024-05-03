import { createSlice } from "@reduxjs/toolkit";
import { formatNumber, parseNumber } from "./CostSlice";

const initialState = {
  fundraisingInputs: [
    {
      id: 1,
      name: "",
      fundraisingAmount: 0,
      fundraisingType: "Common Stock",
      fundraisingBeginMonth: 1,
      equityOffered: 0,
    },
  ],
  fundraisingTableData: [],
};

const fundraisingSlice = createSlice({
  name: "fundraising",
  initialState,
  reducers: {
    setFundraisingInputs(state, action) {
      state.fundraisingInputs = action.payload;
    },
    setFundraisingTableData(state, action) {
      state.fundraisingTableData = action.payload;
    },
  },
});

const calculateFundraisingData = (tempFundraisingInputs, numberOfMonths) => {
  let allFundraising = [];
  tempFundraisingInputs.forEach((fundraisingInput) => {
    let monthlyFundraising = [];
    let currentFundraising = parseFloat(fundraisingInput.fundraisingAmount);
    for (let month = 1; month <= numberOfMonths; month++) {
      if (
        month >= fundraisingInput.beginMonth &&
        month <= fundraisingInput.endMonth
      ) {
        monthlyFundraising.push({
          month: month,
          fundraising: currentFundraising,
        });
        currentFundraising *=
          1 + parseFloat(fundraisingInput.growthPercentage) / 100;
      } else {
        monthlyFundraising.push({ month: month, fundraising: 0 });
      }
    }
    allFundraising.push({
      name: fundraisingInput.name,
      monthlyFundraising,
      fundraisingType: fundraisingInput.fundraisingType,
      fundraisingBeginMonth: fundraisingInput.fundraisingBeginMonth,
      fundraisingAmount: fundraisingInput.fundraisingAmount,
    });
  });
  return allFundraising;
};

export const transformFundraisingDataForTable = (
  tempFundraisingInputs,
  numberOfMonths
) => {
  const transformedFundraisingTableData = {};
  const calculatedFundraisingData = calculateFundraisingData(
    tempFundraisingInputs,
    numberOfMonths
  );

  calculatedFundraisingData.forEach((fundraisingItem) => {
    const rowKey = `${fundraisingItem.name}`;
    fundraisingItem.monthlyFundraising.forEach((monthData) => {
      if (!transformedFundraisingTableData[rowKey]) {
        transformedFundraisingTableData[rowKey] = {
          key: rowKey,
          name: rowKey,
          fundraisingType: fundraisingItem.fundraisingType,
        };
      }
      if (monthData.month === fundraisingItem.fundraisingBeginMonth) {
        transformedFundraisingTableData[rowKey][`month${monthData.month}`] =
          formatNumber(
            parseFloat(fundraisingItem.fundraisingAmount)?.toFixed(2)
          );
      } else {
        transformedFundraisingTableData[rowKey][`month${monthData.month}`] =
          formatNumber(parseFloat(monthData.fundraising)?.toFixed(2));
      }
    });
  });

  const initRow = (keyName) => {
    const row = { key: keyName, name: keyName };
    for (let month = 1; month <= numberOfMonths; month++) {
      row[`month${month}`] = "0";
    }
    return row;
  };

  const totalFundingRow = initRow("Total funding");
  const increasedCommonStockRow = initRow("Increased in Common Stock");
  const increasedPreferredStockRow = initRow("Increased in Preferred Stock");
  const increasedPaidInCapitalRow = initRow("Increased in Paid in Capital");
  const accumulatedCommonStockRow = initRow("Accumulated Common Stock");
  const accumulatedPreferredStockRow = initRow("Accumulated Preferred Stock");
  const accumulatedPaidInCapitalRow = initRow("Accumulated Paid in Capital");

  for (let month = 1; month <= numberOfMonths; month++) {
    let accumulatedCommonStock = 0;
    let accumulatedPreferredStock = 0;
    let accumulatedPaidInCapital = 0;

    const monthDataMap = new Map(); // Use a map to store month data for each fundraising type

    Object.values(transformedFundraisingTableData).forEach((item) => {
      const amount = parseNumber(item[`month${month}`]) || 0;
      totalFundingRow[`month${month}`] = formatNumber(
        (parseNumber(totalFundingRow[`month${month}`]) + amount).toFixed(2)
      );

      if (!monthDataMap.has(item.fundraisingType)) {
        monthDataMap.set(item.fundraisingType, 0);
      }
      monthDataMap.set(
        item.fundraisingType,
        monthDataMap.get(item.fundraisingType) + amount
      );
    });

    // Update rows for each fundraising type
    monthDataMap.forEach((amount, fundraisingType) => {
      if (fundraisingType === "Common Stock") {
        increasedCommonStockRow[`month${month}`] = formatNumber(
          (
            parseNumber(increasedCommonStockRow[`month${month}`]) + amount
          ).toFixed(2)
        );
        accumulatedCommonStock += amount;
      } else if (fundraisingType === "Preferred Stock") {
        increasedPreferredStockRow[`month${month}`] = formatNumber(
          (
            parseNumber(increasedPreferredStockRow[`month${month}`]) + amount
          ).toFixed(2)
        );
        accumulatedPreferredStock += amount;
      } else if (fundraisingType === "Paid in Capital") {
        increasedPaidInCapitalRow[`month${month}`] = formatNumber(
          (
            parseNumber(increasedPaidInCapitalRow[`month${month}`]) + amount
          ).toFixed(2)
        );
        accumulatedPaidInCapital += amount;
      }
    });

    // Update accumulated rows
    let accumulatedPreferredStockTotal = 0;
    let accumulatedCommonStockTotal = 0;
    let accumulatedPaidInCapitalTotal = 0;
    for (let i = 1; i <= month; i++) {
      accumulatedPreferredStockTotal +=
        parseNumber(increasedPreferredStockRow[`month${i}`]) || 0;
      accumulatedCommonStockTotal +=
        parseNumber(increasedCommonStockRow[`month${i}`]) || 0;
      accumulatedPaidInCapitalTotal +=
        parseNumber(increasedPaidInCapitalRow[`month${i}`]) || 0;
    }
    accumulatedPreferredStockRow[`month${month}`] = formatNumber(
      accumulatedPreferredStockTotal.toFixed(2)
    );
    accumulatedCommonStockRow[`month${month}`] = formatNumber(
      accumulatedCommonStockTotal.toFixed(2)
    );
    accumulatedPaidInCapitalRow[`month${month}`] = formatNumber(
      accumulatedPaidInCapitalTotal.toFixed(2)
    );
  }

  transformedFundraisingTableData["Increased in Common Stock"] =
    increasedCommonStockRow;
  transformedFundraisingTableData["Increased in Preferred Stock"] =
    increasedPreferredStockRow;
  transformedFundraisingTableData["Increased in Paid in Capital"] =
    increasedPaidInCapitalRow;
  transformedFundraisingTableData["Accumulated Common Stock"] =
    accumulatedCommonStockRow;
  transformedFundraisingTableData["Accumulated Preferred Stock"] =
    accumulatedPreferredStockRow;
  transformedFundraisingTableData["Accumulated Paid in Capital"] =
    accumulatedPaidInCapitalRow;
  transformedFundraisingTableData["Total funding"] = totalFundingRow;

  return Object.values(transformedFundraisingTableData);
};

export const { setFundraisingInputs, setFundraisingTableData } =
  fundraisingSlice.actions;

export default fundraisingSlice.reducer;
