import { createSlice } from "@reduxjs/toolkit";
import { formatNumber, parseNumber } from "./CostSlice";

const initialState = {};

const profitAndLossSlice = createSlice({
  name: "profitAndLoss",
  initialState,
  reducers: {
    setFundraisingTableData(state, action) {
      state.fundraisingTableData = action.payload;
    },
  },
});

export const calculateProfitAndLoss = (
  numberOfMonths,
  revenueData,
  revenueDeductionData,
  cogsData,
  costData,
  personnelCostData,
  investmentData,
  loanData,
  incomeTaxRate,
  startingCashBalance
) => {
  let totalRevenue = new Array(numberOfMonths).fill(0);
  let totalDeductions = new Array(numberOfMonths).fill(0);
  let totalCOGS = new Array(numberOfMonths).fill(0);
  let totalCosts = new Array(numberOfMonths).fill(0);
  let totalPersonnelCosts = new Array(numberOfMonths).fill(0);
  let totalInvestmentDepreciation = new Array(numberOfMonths).fill(0);
  let totalLoanPayments = new Array(numberOfMonths).fill(0);

  Object.entries(revenueData).forEach(([channelProductName, monthlyData]) => {
    monthlyData.forEach((deduction, index) => {
      totalRevenue[index] += parseFloat(deduction);
    });
  });

  Object.entries(revenueDeductionData).forEach(
    ([channelProductName, monthlyData]) => {
      monthlyData.forEach((deduction, index) => {
        totalDeductions[index] += parseFloat(deduction);
      });
    }
  );
  Object.entries(cogsData).forEach(([channelProductName, monthlyData]) => {
    monthlyData.forEach((deduction, index) => {
      totalCOGS[index] += parseFloat(deduction);
    });
  });

  costData.forEach((cost) => {
    cost.monthlyCosts.forEach((monthData) => {
      totalCosts[monthData.month - 1] += monthData.cost;
    });
  });

  personnelCostData.forEach((personnel) => {
    personnel.monthlyCosts.forEach((monthData) => {
      totalPersonnelCosts[monthData.month - 1] += monthData.cost;
    });
  });

  investmentData.forEach((investment) => {
    investment.depreciationArray.forEach((value, index) => {
      totalInvestmentDepreciation[index] += value;
    });
  });

  loanData.forEach((loan) => {
    loan.loanDataPerMonth.forEach((monthData) => {
      totalLoanPayments[monthData.month - 1] += monthData.payment;
    });
  });

  let netRevenue = totalRevenue.map(
    (revenue, index) => revenue - totalDeductions[index]
  );

  let grossProfit = netRevenue.map(
    (revenue, index) => revenue - totalCOGS[index]
  );

  let ebitda = grossProfit.map(
    (profit, index) => profit - (totalCosts[index] + totalPersonnelCosts[index])
  );

  let totalInterestPayments = new Array(numberOfMonths).fill(0);
  loanData.forEach((loan) => {
    loan.loanDataPerMonth.forEach((monthData) => {
      totalInterestPayments[monthData.month - 1] += monthData.interest;
    });
  });

  let earningsBeforeTax = ebitda.map(
    (profit, index) =>
      profit -
      (totalInvestmentDepreciation[index] + totalInterestPayments[index])
  );

  let incomeTax = earningsBeforeTax.map((earnings) =>
    earnings > 0 ? earnings * (incomeTaxRate / 100) : 0
  );

  let netIncome = earningsBeforeTax.map(
    (earnings, index) => earnings - incomeTax[index]
  );

  const totalPrincipal = new Array(numberOfMonths).fill(0);
  loanData.forEach((loan) => {
    loan.loanDataPerMonth.forEach((monthData) => {
      totalPrincipal[monthData.month - 1] += monthData.principal;
    });
  });

  const totalRemainingBalance = new Array(numberOfMonths).fill(0);
  loanData.forEach((loan) => {
    loan.loanDataPerMonth.forEach((monthData) => {
      totalRemainingBalance[monthData.month - 1] += monthData.remainingBalance;
    });
  });

  return {
    totalRevenue,
    totalDeductions,
    netRevenue,
    totalCOGS,
    grossProfit,
    totalCosts,
    totalPersonnelCosts,
    totalInvestmentDepreciation,
    totalInterestPayments,
    totalPrincipal,
    ebitda,
    earningsBeforeTax,
    incomeTax,
    netIncome,
    startingCashBalance,
    totalRemainingBalance,
  };
};

export const { setFundraisingTableData } = profitAndLossSlice.actions;

export default profitAndLossSlice.reducer;
