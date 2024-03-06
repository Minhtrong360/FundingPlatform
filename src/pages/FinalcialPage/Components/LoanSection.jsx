import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const LoanSection = ({
  loanInputs,
  setLoanInputs,
  numberOfMonths,
  calculateLoanData,
  transformLoanDataForTable,
}) => {
  //LoanFunctions
  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "0",
        interestRate: "0",
        loanBeginMonth: "0",
        loanEndMonth: "0",
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
    setLoanInputs(newInputs);
  };

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
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Loan Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Payment amount ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
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
    const seriesData = calculateLoanData().map((loan) => {
      return {
        name: loan.loanName,
        data: loan.loanDataPerMonth.map((month) => month.payment),
      };
    });

    setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [loanInputs, numberOfMonths]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
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
                    handleLoanInputChange(
                      index,
                      "loanBeginMonth",
                      e.target.value
                    )
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
                  className="bg-red-500 text-white py-1 px-4 rounded"
                  onClick={() => removeLoanInput(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={addNewLoanInput}
          >
            Add New
          </button>
        </section>
      </div>
      <div className="w-full lg:w-2/3 p-4">
        <h3 className="text-2xl font-semibold mb-4">Loan Data</h3>
        <Table
          className="overflow-auto my-8"
          dataSource={transformLoanDataForTable()}
          columns={loanColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Loan Data</h3>
        <Chart
          options={loanChart.options}
          series={loanChart.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default LoanSection;
