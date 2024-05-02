import { configureStore } from "@reduxjs/toolkit";
import DurationSlice from "../features/DurationSlice";
import CustomerSlice from "../features/CustomerSlice";
import SaleSlice from "../features/SaleSlice";
import CostSlice from "../features/CostSlice";
import PersonnelSlice from "../features/PersonnelSlice";
import InvestmentSlice from "../features/InvestmentSlice";
import LoanSlice from "../features/LoanSlice";
import FundraisingSlice from "../features/FundraisingSlice";
import ProfitAndLossSlice from "../features/ProfitAndLossSlice";
import CashFlowSlice from "../features/CashFlowSlice";
import BalanceSheetSlice from "../features/BalanceSheetSlice";

const rootReducer = {
  durationSelect: DurationSlice,
  customer: CustomerSlice,
  sales: SaleSlice,
  cost: CostSlice,
  personnel: PersonnelSlice,
  investment: InvestmentSlice,
  loan: LoanSlice,
  fundraising: FundraisingSlice,
  profitAndLoss: ProfitAndLossSlice,
  cashFlow: CashFlowSlice,
  balanceSheet: BalanceSheetSlice,
};
const store = configureStore({
  reducer: rootReducer,
});

export default store;
