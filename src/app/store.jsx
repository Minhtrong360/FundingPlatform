import { configureStore } from "@reduxjs/toolkit";
import DurationSlice from "../features/DurationSlice";
import CustomerSlice from "../features/CustomerSlice";
import SaleSlice from "../features/SaleSlice";
import CostSlice from "../features/CostSlice";
import personnelSlice from "../features/PersonnelSlice";
import InvestmentSlice from "../features/InvestmentSlice";

const rootReducer = {
  durationSelect: DurationSlice,
  customer: CustomerSlice,
  sales: SaleSlice,
  cost: CostSlice,
  personnel: personnelSlice,
  investment: InvestmentSlice,
  loan: 0,
  profitAndLoss: 0,
};
const store = configureStore({
  reducer: rootReducer,
});

export default store;
