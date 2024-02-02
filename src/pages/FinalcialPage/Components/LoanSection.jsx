import { useEffect } from "react";
import { Input } from "../../../components/ui/Input";

const LoanSection = ({
  loanInputs,
  setLoanInputs,
  numberOfMonths,
  setLoanTableData,
  setLoanChart,
}) => {
  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "",
        interestRate: "",
        loanBeginMonth: "",
        loanEndMonth: "",
      },
    ]);
  };

  const removeLoanInput = (index) => {
    const newInputs = [...loanInputs];
    newInputs.splice(index, 1);
    setLoanInputs(newInputs);
  };

  const handleLoanInputChange = (index, field, value) => {
    const newInputs = [...loanInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };

    if (field === "beginMonth" || field === "endMonth") {
      const beginMonth = parseFloat(newInputs[index].beginMonth);
      const endMonth = parseFloat(newInputs[index].endMonth);

      if (field === "beginMonth" && beginMonth > endMonth) {
        newInputs[index].endMonth = value;
      } else if (field === "endMonth" && endMonth < beginMonth) {
        newInputs[index].beginMonth = value;
      }
    }
    setLoanInputs(newInputs);
  };

  const calculateLoanData = () => {
    return loanInputs.map((loan) => {
      const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
      const loanAmount = parseFloat(loan.loanAmount);
      const loanDuration =
        parseInt(loan.loanEndMonth, 10) - parseInt(loan.loanBeginMonth, 10) + 1;

      // Calculate monthly payment
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

  const TransformLoanDataForTable = () => {
    const loanTableData = [];

    calculateLoanData().forEach((loan, loanIndex) => {
      const loanName =
        loanInputs[loanIndex].loanName || `Loan ${loanIndex + 1}`;

      const loanAmountRow = {
        key: `${loanName} - Loan Amount`,
        type: `${loanName} - Loan Amount`,
      };
      const paymentRow = {
        key: `${loanName} - Payment`,
        type: `${loanName} - Payment`,
      };
      const principalRow = {
        key: `${loanName} - Principal`,
        type: `${loanName} - Principal`,
      };
      const interestRow = {
        key: `${loanName} - Interest`,
        type: `${loanName} - Interest`,
      };
      const balanceRow = {
        key: `${loanName} - Remaining Balance`,
        type: `${loanName} - Remaining Balance`,
      };

      // Initialize all rows with default values
      for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
        const monthKey = `Month ${monthIndex}`;
        loanAmountRow[monthKey] = "0.00";
        paymentRow[monthKey] = "0.00";
        principalRow[monthKey] = "0.00";
        interestRow[monthKey] = "0.00";
        balanceRow[monthKey] = "0.00";
      }

      loan.loanDataPerMonth.forEach((monthData) => {
        const monthKey = `Month ${monthData.month}`;
        loanAmountRow[monthKey] = monthData.loanAmount.toFixed(2);
        paymentRow[monthKey] = monthData.payment.toFixed(2);
        principalRow[monthKey] = monthData.principal.toFixed(2);
        interestRow[monthKey] = monthData.interest.toFixed(2);
        balanceRow[monthKey] = monthData.balance.toFixed(2);
      });

      loanTableData.push(
        loanAmountRow,
        paymentRow,
        principalRow,
        interestRow,
        balanceRow
      );
    });

    return loanTableData;
  };

  useEffect(() => {
    setLoanTableData(TransformLoanDataForTable());
  }, [loanInputs, numberOfMonths]);

  useEffect(() => {
    const seriesData = calculateLoanData().map((loan) => {
      return {
        name: loan.loanName,
        data: loan.loanDataPerMonth.map((month) => month.payment),
      };
    });

    setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [loanInputs]);

  return (
    <section aria-labelledby="loan-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="loan-heading"
      >
        Loan
      </h2>

      {loanInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Name:</span>
            <Input
              required
              className="border p-2 rounded"
              value={input.loanName}
              onChange={(e) =>
                handleLoanInputChange(index, "loanName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Amount:</span>
            <Input
              required
              type="number"
              className="border p-2 rounded"
              value={input.loanAmount}
              onChange={(e) =>
                handleLoanInputChange(index, "loanAmount", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Interest Rate (%):</span>
            <Input
              required
              type="number"
              className="border p-2 rounded"
              value={input.interestRate}
              onChange={(e) =>
                handleLoanInputChange(index, "interestRate", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Month Loan Begins:</span>
            <Input
              required
              type="number"
              className="border p-2 rounded"
              value={input.loanBeginMonth}
              onChange={(e) =>
                handleLoanInputChange(index, "loanBeginMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Month Loan Ends:</span>
            <Input
              required
              type="number"
              className="border p-2 rounded"
              value={input.loanEndMonth}
              onChange={(e) =>
                handleLoanInputChange(index, "loanEndMonth", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeLoanInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={addNewLoanInput}
      >
        Add New
      </button>
    </section>
  );
};

export default LoanSection;
