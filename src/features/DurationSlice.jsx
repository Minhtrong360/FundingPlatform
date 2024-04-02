import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDuration: "3 years",
  startingCashBalance: 0,
  status: "active",
  industry: "",
  incomeTax: 0,
  payrollTax: 0,
  currency: "USD",
  startMonth: 1,
  startYear: new Date().getFullYear(),
  financialProjectName: "",
  numberOfMonths: 36,
  cutMonth: 4,
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
    setNumberOfMonths(state, action) {
      state.numberOfMonths = action.payload;
    },
    setCutMonth(state, action) {
      state.cutMonth = action.payload;
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
  setNumberOfMonths,
  setCutMonth,
} = durationSelectSlice.actions;

export function formatDate(inputDateString) {
  const dateObject = new Date(inputDateString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export default durationSelectSlice.reducer;
