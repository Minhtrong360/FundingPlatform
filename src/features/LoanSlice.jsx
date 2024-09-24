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

// export const calculateLoanData = (tempLoanInputs, numberOfMonths) => {
//   return tempLoanInputs?.map((loan) => {
//     const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
//     const loanBeginMonth = parseInt(loan.loanBeginMonth, 10);
//     const loanEndMonth = parseInt(loan.loanEndMonth, 10);

//     const loanDataPerMonth = [];

//     for (let month = 1; month <= numberOfMonths; month++) {
//       let payment = 0;
//       let principal = 0;
//       let interest = 0;
//       let balance = 0;
//       let loanAmount = 0;

//       if (month >= loanBeginMonth && month <= loanEndMonth) {
//         const monthInLoan = month - loanBeginMonth + 1;
//         loanAmount = parseFloat(loan.loanAmount);

//         payment =
//           (loanAmount * monthlyRate) /
//           (1 - Math.pow(1 + monthlyRate, -loanEndMonth + loanBeginMonth));

//         interest = (loanAmount - principal) * monthlyRate;
//         principal = payment - interest;
//         balance = loanAmount - principal;

//         if (balance < 0) {
//           balance = 0;
//         }
//       }

//       loanDataPerMonth.push({
//         month: month,
//         payment: payment,
//         principal: principal,
//         interest: interest,
//         balance: balance,
//         loanAmount: loanAmount,
//       });
//     }

//     return {
//       loanName: loan.loanName,
//       loanDataPerMonth,
//     };
//   });
// };

export const calculateLoanData = (tempLoanInputs, numberOfMonths) => {
  return tempLoanInputs?.map((loan) => {
    const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
    const loanAmount1 = parseFloat(loan.loanAmount);
    const loanBeginMonth = parseInt(loan.loanBeginMonth, 10);
    const loanEndMonth = parseInt(loan.loanEndMonth, 10);
    const loanDuration = loanEndMonth - loanBeginMonth + 1;

    const monthlyPayment =
      (loanAmount1 * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -loanDuration));

    let remainingBalance = loanAmount1;
    const loanDataPerMonth = [];
    for (let month = 1; month <= numberOfMonths; month++) {
      let principalForMonth = 0;
      let interestForMonth = 0;
      let balance = 0;
      let payment = 0;
      let loanAmount = 0;
      if (month >= loanBeginMonth && month <= loanEndMonth) {
        interestForMonth = remainingBalance * monthlyRate;
        principalForMonth = monthlyPayment - interestForMonth;
        remainingBalance -= principalForMonth;
        balance = remainingBalance;
        payment = monthlyPayment;
        loanAmount = loanAmount1;
        if (balance < 0) {
          balance = 0;
        }
      }
      loanDataPerMonth.push({
        month,
        payment,
        principal: principalForMonth,
        interest: interestForMonth,
        balance,
        loanAmount,
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
  let filteredLoans = [];

  if (renderLoanForm === "all") {
    filteredLoans = tempLoanInputs;
  } else {
    const selectedLoan = tempLoanInputs?.find(
      (input) => input.id === parseInt(renderLoanForm)
    );
    if (!selectedLoan) return loanTableData;
    filteredLoans.push(selectedLoan);
  }

  const loanDataArray = calculateLoanData(filteredLoans, numberOfMonths);

  filteredLoans?.forEach((loan, index) => {
    const loanData = loanDataArray[index];

    const loanNameRow = {
      key: loan.loanName || loan.id,
      type: loan.loanName || loan.id,
    };

    const loanAmountRow = {
      key: `Loan Amount - ${loan.loanName || loan.id}`,
      type: `Loan Amount`,
    };
    const paymentRow = {
      key: `Payment - ${loan.loanName || loan.id}`,
      type: `Payment`,
    };
    const principalRow = {
      key: `Principal - ${loan.loanName || loan.id}`,
      type: `Principal`,
    };
    const interestRow = {
      key: `Interest - ${loan.loanName || loan.id}`,
      type: `Interest`,
    };
    const balanceRow = {
      key: `Remaining Balance - ${loan.loanName || loan.id}`,
      type: `Remaining Balance`,
    };

    for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
      const monthKey = `month${monthIndex}`;
      loanAmountRow[monthKey] = "0";
      paymentRow[monthKey] = "0";
      principalRow[monthKey] = "0";
      interestRow[monthKey] = "0";
      balanceRow[monthKey] = "0";
    }

    loanData.loanDataPerMonth?.forEach((monthData) => {
      const monthKey = `month${monthData.month}`;
      loanAmountRow[monthKey] = formatNumber(monthData.loanAmount?.toFixed(2));
      paymentRow[monthKey] = formatNumber(monthData.payment?.toFixed(2));
      principalRow[monthKey] = formatNumber(monthData.principal?.toFixed(2));
      interestRow[monthKey] = formatNumber(monthData.interest?.toFixed(2));
      balanceRow[monthKey] = formatNumber(monthData.balance?.toFixed(2));
    });

    loanTableData.push(
      loanNameRow,
      loanAmountRow,
      paymentRow,
      principalRow,
      interestRow,
      balanceRow
    );
  });

  const cfLoansSum = Array(numberOfMonths).fill(0);
  tempLoanInputs?.forEach((input) => {
    const beginMonth = parseInt(input.loanBeginMonth, 10) - 1;
    const loanAmount = parseFloat(input.loanAmount);

    if (beginMonth >= 0 && beginMonth < numberOfMonths) {
      cfLoansSum[beginMonth] += loanAmount;
    }
  });

  const cfLoansRow = {
    key: `CF Loans`,
    type: `CF Loans`,
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    cfLoansRow[`month${monthIndex + 1}`] = formatNumber(
      cfLoansSum[monthIndex]?.toFixed(2)
    );
  }
  loanTableData.push(cfLoansRow);

  const totalRemainingBalanceRow = {
    key: `Total Remaining Balance`,
    type: `Total Remaining Balance`,
  };

  for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
    const monthKey = `month${monthIndex}`;
    const totalBalanceForMonth = tempLoanInputs?.reduce((total, input) => {
      const loanData = calculateLoanData(tempLoanInputs, numberOfMonths)?.find(
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
      totalBalanceForMonth?.toFixed(2)
    );
  }

  // Add the total remaining balance row to the table data
  loanTableData.push(totalRemainingBalanceRow);

  return loanTableData;
};

export const { setLoanInputs, setLoanData, setLoanTableData, setIsSaved } =
  loanSlice.actions;

export default loanSlice.reducer;
