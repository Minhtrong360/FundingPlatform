import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";

const LoanSection = ({
  loanInputs,
  setLoanInputs,
  numberOfMonths,
  loanData,
  setLoanData,
  isSaved,
  setIsSaved,
}) => {
  const [tempLoanInputs, setTempLoanInputs] = useState(loanInputs);

  const [tempLoanData, setTempLoanData] = useState(loanData);

  const [renderLoanForm, setRenderLoanForm] = useState(loanInputs[0]?.id);
  //LoanFunctions

  const addNewLoanInput = () => {
    const maxId = Math.max(...tempLoanInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newLoan = {
      id: newId,
      loanName: "New loan",
      loanAmount: "0",
      interestRate: "0",
      loanBeginMonth: "0",
      loanEndMonth: "0",
    };
    setTempLoanInputs([...tempLoanInputs, newLoan]);
    setRenderLoanForm(newId.toString());
  };

  const removeLoanInput = (id) => {
    const newInputs = tempLoanInputs.filter((input) => input?.id != id);

    setTempLoanInputs(newInputs);
    setRenderLoanForm(newInputs[0]?.id);
  };

  const handleLoanInputChange = (id, field, value) => {
    const newInputs = tempLoanInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempLoanInputs(newInputs);
  };

  const calculateLoanData = () => {
    return tempLoanInputs.map((loan) => {
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
  
  const transformLoanDataForTable = () => {
    const loanTableData = [];
    
    const selectedLoan = tempLoanInputs.find(input => input.id === parseInt(renderLoanForm));
    if (!selectedLoan) return loanTableData; // Return empty table data if no loan is selected
    
    const loanIndex = tempLoanInputs.findIndex(input => input.id === parseInt(renderLoanForm));
    const loanData = calculateLoanData()[loanIndex];
  
    const loanName = selectedLoan.loanName || `Loan ${loanIndex + 1}`;
    
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
  
    // Initialize all rows with default values
    for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
      const monthKey = `Month ${monthIndex}`;
      loanAmountRow[monthKey] = "0.00";
      paymentRow[monthKey] = "0.00";
      principalRow[monthKey] = "0.00";
      interestRow[monthKey] = "0.00";
      balanceRow[monthKey] = "0.00";
    }
  
    loanData.loanDataPerMonth.forEach((monthData) => {
      const monthKey = `Month ${monthData.month}`;
      loanAmountRow[monthKey] = monthData.loanAmount?.toFixed(2);
      paymentRow[monthKey] = monthData.payment?.toFixed(2);
      principalRow[monthKey] = monthData.principal?.toFixed(2);
      interestRow[monthKey] = monthData.interest?.toFixed(2);
      balanceRow[monthKey] = monthData.balance?.toFixed(2);
    });
  
    loanTableData.push(
      loanAmountRow,
      paymentRow,
      principalRow,
      interestRow,
      balanceRow
    );
  
    return loanTableData;
  };
  
  //LoanUseEffect
  useEffect(() => {
    const calculatedData = calculateLoanData();
    setLoanData(calculatedData);
  }, [loanInputs, numberOfMonths, renderLoanForm]);
  
  

  //LoanColumns
  const loanColumns = [
    { fixed: "left", title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
    })),
  ];

  //LoanChart
const [loanChart, setLoanChart] = useState({
  options: {
    chart: { id: "loan-chart", type: "line", height: 350 },
    xaxis: {
      categories: Array.from(
        { length: numberOfMonths },
        (_, i) => `${i + 1}`
      ),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return Math.floor(val);
        },
      },
      title: {
        text: "Amount ($)",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
    },
    legend: { position: "bottom", horizontalAlign: "right" },
    fill: { type: "solid" },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    markers: { size: 1 },
  },
  series: [],
});

useEffect(() => {
  const seriesData = calculateLoanData().flatMap((loan) => {
    return [
      {
        name: `${loan.loanName} - Payment`,
        data: loan.loanDataPerMonth.map((month) => month.payment),
      },
      {
        name: `${loan.loanName} - Principal`,
        data: loan.loanDataPerMonth.map((month) => month.principal),
      },
      {
        name: `${loan.loanName} - Interest`,
        data: loan.loanDataPerMonth.map((month) => month.interest),
      },
      {
        name: `${loan.loanName} - Remaining Balance`,
        data: loan.loanDataPerMonth.map((month) => month.balance),
      },
    ];
  });

  setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
}, [tempLoanInputs, numberOfMonths]);



  const handleSelectChange = (event) => {
    setRenderLoanForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  useEffect(() => {
    if (isSaved) {
      setLoanInputs(tempLoanInputs);
      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="loan-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="loan-heading"
          >
            Loan
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            >
            </label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderLoanForm}
              onChange={handleSelectChange}
            >
              {tempLoanInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.loanName}
                </option>
              ))}
            </select>
          </div>

          {tempLoanInputs
            .filter((input) => input?.id == renderLoanForm) // Sử dụng biến renderForm
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className="flex items-center text-sm">Loan Name:</span>
                  <Input
                    required
                    className="border p-2 rounded border-gray-200"
                    value={input.loanName}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "loanName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className="flex items-center text-sm">
                    Loan Amount:
                  </span>
                  <Input
                    required
                    type="number"
                    className="border p-2 rounded border-gray-200"
                    value={input.loanAmount}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "loanAmount",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className="flex items-center text-sm">
                    Interest Rate (%):
                  </span>
                  <Input
                    required
                    type="number"
                    className="border p-2 rounded border-gray-200"
                    value={input.interestRate}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "interestRate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className="flex items-center text-sm">
                    Month Loan Begins:
                  </span>
                  <Input
                    required
                    type="number"
                    className="border p-2 rounded border-gray-200"
                    value={input.loanBeginMonth}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "loanBeginMonth",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className="flex items-center text-sm">
                    Month Loan Ends:
                  </span>
                  <Input
                    required
                    type="number"
                    className="border p-2 rounded border-gray-200"
                    value={input.loanEndMonth}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "loanEndMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-500 text-white py-1 px-4 rounded"
                    onClick={() => removeLoanInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4 mr-4"
            onClick={addNewLoanInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 p-4">
        <h3 className="text-2xl font-semibold mb-4">Loan Data</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={transformLoanDataForTable()}
          columns={loanColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Loan Data</h3>
        <Chart
          options={loanChart.options}
          series={loanChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default LoanSection;
