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
            parseFloat(fundraisingItem.fundraisingAmount)?.toFixed(0)
          );
      } else {
        transformedFundraisingTableData[rowKey][`month${monthData.month}`] =
          formatNumber(parseFloat(monthData.fundraising)?.toFixed(0));
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

    Object.values(transformedFundraisingTableData).forEach((item) => {
      const amount = parseNumber(item[`month${month}`]) || 0;
      totalFundingRow[`month${month}`] = formatNumber(
        (parseNumber(totalFundingRow[`month${month}`]) + amount).toFixed(0)
      );

      if (item.fundraisingType === "Common Stock") {
        increasedCommonStockRow[`month${month}`] = formatNumber(
          (
            parseFloat(increasedCommonStockRow[`month${month}`]) + amount
          ).toFixed(0)
        );
        accumulatedCommonStock += amount;
      } else if (item.fundraisingType === "Preferred Stock") {
        increasedPreferredStockRow[`month${month}`] = formatNumber(
          (
            parseFloat(increasedPreferredStockRow[`month${month}`]) + amount
          ).toFixed(0)
        );
        accumulatedPreferredStock += amount;
      } else if (item.fundraisingType === "Paid in Capital") {
        increasedPaidInCapitalRow[`month${month}`] = formatNumber(
          (
            parseFloat(increasedPaidInCapitalRow[`month${month}`]) + amount
          ).toFixed(0)
        );
        accumulatedPaidInCapital += amount;
      }
    });

    // Update accumulatedPreferredStockRow
    let accumulatedPreferredStockTotal = 0;
    for (let i = 1; i <= month; i++) {
      accumulatedPreferredStockTotal +=
        parseNumber(increasedPreferredStockRow[`month${i}`]) || 0;
    }
    accumulatedPreferredStockRow[`month${month}`] = formatNumber(
      accumulatedPreferredStockTotal.toFixed(0)
    );

    let accumulatedCommonStockTotal = 0;
    for (let i = 1; i <= month; i++) {
      accumulatedCommonStockTotal +=
        parseNumber(increasedCommonStockRow[`month${i}`]) || 0;
    }
    accumulatedCommonStockRow[`month${month}`] = formatNumber(
      accumulatedCommonStockTotal.toFixed(0)
    );

    let accumulatedPaidInCapitalTotal = 0;
    for (let i = 1; i <= month; i++) {
      accumulatedPaidInCapitalTotal +=
        parseNumber(increasedPaidInCapitalRow[`month${i}`]) || 0;
    }
    accumulatedPaidInCapitalRow[`month${month}`] = formatNumber(
      accumulatedPaidInCapitalTotal.toFixed(0)
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
