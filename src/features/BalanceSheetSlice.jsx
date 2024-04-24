import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positionDataWithNetIncome2: [],
};

const balanceSheetSlice = createSlice({
  name: "balanceSheet",
  initialState,
  reducers: {
    setPositionDataWithNetIncome2(state, action) {
      state.positionDataWithNetIncome2 = action.payload;
    },
  },
});

export const { setPositionDataWithNetIncome2 } = balanceSheetSlice.actions;

export default balanceSheetSlice.reducer;
