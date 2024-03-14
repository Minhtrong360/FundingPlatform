import { configureStore } from "@reduxjs/toolkit";
import DurationSlice from "../features/DurationSlice";

const rootReducer = {
  durationSelect: DurationSlice,
  customer: 0,
  revenue: 0,
  cost: 0,
  personnel: 0,
  investment: 0,
  loan: 0,
  profitAndLoss: 0,
};
const store = configureStore({
  reducer: rootReducer,
});

console.log("rootReducer", rootReducer);

export default store;
