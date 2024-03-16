import { configureStore } from "@reduxjs/toolkit";
import DurationSlice from "../features/DurationSlice";
import CustomerSlice from "../features/CustomerSlice";
import SaleSlice from "../features/SaleSlice";

const rootReducer = {
  durationSelect: DurationSlice,
  customer: CustomerSlice,
  sales: SaleSlice,
  cost: 0,
  personnel: 0,
  investment: 0,
  loan: 0,
  profitAndLoss: 0,
};
const store = configureStore({
  reducer: rootReducer,
});

export default store;
