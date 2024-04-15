import { createSlice } from "@reduxjs/toolkit";
import { formatNumber } from "./CostSlice";

const initialState = {
  loanInputs: [
    {
      id: 1,
      loanName: "Banking loan",
      loanAmount: "30000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "36",
    },
    {
      id: 2,
      loanName: "Startup loan",
      loanAmount: "20000",
      interestRate: "3",
      loanBeginMonth: "1",
      loanEndMonth: "36",
    },
  ],
  loanData: [],
  loanTableData: [],
  isSaved: false,
};

const loanSlice = createSlice({
  name: "loan",
  initialState,
  reducers: {
    setLoanInputs(state, action) {
      state.loanInputs = action.payload;
    },
    setLoanData(state, action) {
      state.loanData = action.payload;
    },
    setLoanTableData(state, action) {
      state.loanTableData = action.payload;
    },
  },
});

export const calculateLoanData = (tempLoanInputs) => {
  return tempLoanInputs?.map((loan) => {
    const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
    const loanAmount = parseFloat(loan.loanAmount);
    const loanDuration =
      parseInt(loan.loanEndMonth, 10) - parseInt(loan.loanBeginMonth, 10) + 1;

    const monthlyPayment =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -loanDuration));

    let remainingBalance = loanAmount;
    const loanDataPerMonth = [];

    for (let month = 1; month <= loanDuration; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      remainingBalance -= principalForMonth;

      loanDataPerMonth.push({
        month: month + parseInt(loan.loanBeginMonth, 10) - 1,
        payment: monthlyPayment,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: remainingBalance,
        loanAmount: loanAmount,
      });
    }

    return {
      loanName: loan.loanName,
      loanDataPerMonth,
    };
  });
};

export const transformLoanDataForTable = (
  tempLoanInputs,
  renderLoanForm,
  numberOfMonths
) => {
  const loanTableData = [];

  const selectedLoan = tempLoanInputs.find(
    (input) => input.id == parseInt(renderLoanForm)
  );
  if (!selectedLoan) return loanTableData;

  const loanIndex = tempLoanInputs.findIndex(
    (input) => input.id == parseInt(renderLoanForm)
  );
  const loanData = calculateLoanData(tempLoanInputs)[loanIndex];

  const loanAmountRow = {
    key: `Loan Amount`,
    type: `Loan Amount`,
  };
  const paymentRow = {
    key: `Payment`,
    type: `Payment`,
  };
  const principalRow = {
    key: `Principal`,
    type: `Principal`,
  };
  const interestRow = {
    key: `Interest`,
    type: `Interest`,
  };
  const balanceRow = {
    key: `Remaining Balance`,
    type: `Remaining Balance`,
  };

  for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
    const monthKey = `Month ${monthIndex}`;
    loanAmountRow[monthKey] = "0";
    paymentRow[monthKey] = "0";
    principalRow[monthKey] = "0";
    interestRow[monthKey] = "0";
    balanceRow[monthKey] = "0";
  }

  loanData.loanDataPerMonth.forEach((monthData) => {
    const monthKey = `Month ${monthData.month}`;
    loanAmountRow[monthKey] = formatNumber(monthData.loanAmount?.toFixed(0));
    paymentRow[monthKey] = formatNumber(monthData.payment?.toFixed(0));
    principalRow[monthKey] = formatNumber(monthData.principal?.toFixed(0));
    interestRow[monthKey] = formatNumber(monthData.interest?.toFixed(0));
    balanceRow[monthKey] = formatNumber(monthData.balance?.toFixed(0));
  });

  loanTableData.push(
    loanAmountRow,
    paymentRow,
    principalRow,
    interestRow,
    balanceRow
  );

  const cfLoansSum = Array(numberOfMonths).fill(0);
  tempLoanInputs.forEach((input) => {
    const beginMonth = parseInt(input.loanBeginMonth, 10);
    const loanAmount = parseFloat(input.loanAmount);

    cfLoansSum[beginMonth - 1] += loanAmount;
  });

  const cfLoansRow = {
    key: `CF Loans`,
    type: `CF Loans`,
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    cfLoansRow[`Month ${monthIndex + 1}`] = formatNumber(
      cfLoansSum[monthIndex]?.toFixed(0)
    );
  }
  loanTableData.push(cfLoansRow);

  const totalRemainingBalanceRow = {
    key: `Total Remaining Balance`,
    type: `Total Remaining Balance`,
  };

  for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
    const monthKey = `Month ${monthIndex}`;
    const totalBalanceForMonth = tempLoanInputs.reduce((total, input) => {
      const loanData = calculateLoanData(tempLoanInputs)?.find(
        (loan) => loan.loanName === input.loanName
      );
      const monthData = loanData?.loanDataPerMonth.find(
        (data) => data.month === monthIndex
      );
      // Add a check for monthData being defined before accessing balance property
      if (monthData) {
        total += monthData.balance;
      }
      return total;
    }, 0);
    totalRemainingBalanceRow[monthKey] = formatNumber(
      totalBalanceForMonth.toFixed(0)
    );
  }

  // Add the total remaining balance row to the table data
  loanTableData.push(totalRemainingBalanceRow);

  return loanTableData;
};

export const { setLoanInputs, setLoanData, setLoanTableData, setIsSaved } =
  loanSlice.actions;

export default loanSlice.reducer;
