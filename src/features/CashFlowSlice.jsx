import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  positionDataWithNetIncome: [],
};

const cashFlowSlice = createSlice({
  name: "cashFlow",
  initialState,
  reducers: {
    setPositionDataWithNetIncome(state, action) {
      state.positionDataWithNetIncome = action.payload;
    },
  },
});

export const { setPositionDataWithNetIncome } = cashFlowSlice.actions;

export default cashFlowSlice.reducer;
