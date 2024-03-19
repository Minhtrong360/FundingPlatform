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
  },
});

export const { setInvestmentInputs, setInvestmentData, clearInvestmentData } =
  investmentSlice.actions;

export default investmentSlice.reducer;
