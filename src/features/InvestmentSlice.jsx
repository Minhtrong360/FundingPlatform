import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  investmentInputs: [
    {
      id: 1,
      purchaseName: "Coffee machine",
      assetCost: 8000,
      quantity: 1,
      purchaseMonth: 2,
      residualValue: 0,
      usefulLifetime: 36,
    },

    {
      id: 2,
      purchaseName: "Table",
      assetCost: 200,
      quantity: 10,
      purchaseMonth: 1,
      residualValue: 0,
      usefulLifetime: 36,
    },
  ],
  investmentData: [],
  investmentTableData: [],
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    setInvestmentInputs(state, action) {
      state.investmentInputs = action.payload;
    },
    setInvestmentData(state, action) {
      state.investmentData = action.payload;
    },
    setInvestmentTableData(state, action) {
      state.investmentTableData = action.payload;
    },
  },
});

export const calculateInvestmentData = (
  tempInvestmentInputs,
  numberOfMonths
) => {
  return tempInvestmentInputs.map((investment) => {
    const quantity = parseInt(investment.quantity, 10) || 1;
    const assetCost = parseFloat(investment.assetCost) * quantity;
    const residualValue = parseFloat(investment.residualValue) * quantity;
    const usefulLifetime = parseFloat(investment.usefulLifetime);
    const purchaseMonth = parseInt(investment.purchaseMonth, 10);

    const depreciationPerMonth = (assetCost - residualValue) / usefulLifetime;
    const depreciationArray = new Array(numberOfMonths).fill(0);

    for (let i = 0; i < numberOfMonths; i++) {
      if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
        depreciationArray[i] = depreciationPerMonth;
      }
    }

    const accumulatedDepreciation = depreciationArray.reduce(
      (acc, val, index) => {
        acc[index] = (acc[index - 1] || 0) + val;
        return acc;
      },
      []
    );

    const assetValue = new Array(numberOfMonths).fill(0);
    const bookValue = new Array(numberOfMonths).fill(0);
    for (let i = 0; i < numberOfMonths; i++) {
      if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
        assetValue[i] = assetCost;
        bookValue[i] = assetValue[i] - accumulatedDepreciation[i];
      }
    }

    return {
      assetValue,
      depreciationArray,
      accumulatedDepreciation,
      bookValue,
    };
  });
};

export const {
  setInvestmentInputs,
  setInvestmentData,
  setInvestmentTableData,
} = investmentSlice.actions;

export default investmentSlice.reducer;
