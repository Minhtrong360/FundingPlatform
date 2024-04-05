import { createSlice } from "@reduxjs/toolkit";
import currencyLists from "../components/Currency";

const initialState = {
  selectedDuration: "3 years",
  startingCashBalance: 0,
  status: "active",
  industry: "Technology",
  incomeTax: 0,
  payrollTax: 0,
  currency: "USD",
  startMonth: new Date().getMonth(),
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

export function splitStringToArray(inputString) {
  // Tách chuỗi thành mảng các từ
  const wordsArray = inputString.split(/\s*,\s*/);
  // Loại bỏ tất cả các dấu chấm và dấu phẩy từ mỗi từ trong mảng
  const sanitizedArray = wordsArray.map((word) => word.replace(/[.,]/g, ""));
  return sanitizedArray;
}

export function joinArrayToString(array) {
  if (array && array.length > 0) {
    // Sử dụng phương thức join() để ghép các phần tử của mảng thành chuỗi
    // và phân cách bằng dấu phẩy và khoảng trắng
    return array.join(", ");
  }
}

export function getCurrencyLabelByKey(key) {
  const currencyObj = currencyLists.find((item) => item.key === key);
  return currencyObj ? currencyObj.label : null;
}

export default durationSelectSlice.reducer;
