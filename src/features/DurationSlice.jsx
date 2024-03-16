import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDuration: "3 years",
  startingCashBalance: 0,
  status: "active",
  industry: "",
  incomeTax: 0,
  payrollTax: 10,
  currency: "USD",
  startMonth: "",
  startYear: 2024,
  financialProjectName: "",
  numberOfMonths: 36,
};

const durationSelectSlice = createSlice({
  name: "durationSelect",
  initialState,
  reducers: {
    setSelectedDuration(state, action) {
      state.selectedDuration = action.payload;
    },
    setStartingCashBalance(state, action) {
      state.startingCashBalance = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setIndustry(state, action) {
      state.industry = action.payload;
    },
    setIncomeTax(state, action) {
      state.incomeTax = action.payload;
    },
    setPayrollTax(state, action) {
      state.payrollTax = action.payload;
    },
    setCurrency(state, action) {
      state.currency = action.payload;
    },
    setStartMonth(state, action) {
      state.startMonth = action.payload;
    },
    setStartYear(state, action) {
      state.startYear = action.payload;
    },
    setFinancialProjectName(state, action) {
      state.financialProjectName = action.payload;
    },
    // Thêm reducers khác nếu cần
  },
});

export const {
  setSelectedDuration,
  setStartingCashBalance,
  setStatus,
  setIndustry,
  setIncomeTax,
  setPayrollTax,
  setCurrency,
  setStartMonth,
  setStartYear,
  setFinancialProjectName,
} = durationSelectSlice.actions;

export default durationSelectSlice.reducer;
