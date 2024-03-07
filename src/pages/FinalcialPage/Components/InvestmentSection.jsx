import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const InvestmentSection = ({
  investmentInputs,
  setInvestmentInputs,
  numberOfMonths,
  calculateInvestmentData,
  transformInvestmentDataForTable,
}) => {
  //InvestmentFunctions
  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: 0,
        purchaseMonth: 0,
        residualValue: 0,
        usefulLifetime: 0,
      },
    ]);
  };

  const removeInvestmentInput = (index) => {
    const newInputs = [...investmentInputs];
    newInputs.splice(index, 1);
    setInvestmentInputs(newInputs);
  };

  const handleInvestmentInputChange = (index, field, value) => {
    const newInputs = [...investmentInputs];
    newInputs[index][field] = value;
    setInvestmentInputs(newInputs);
  };

  //InvestmentColumns
  const investmentColumns = [
    { fixed: "left", title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  //InvestmentChart
  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
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
      // title: { text: 'Investment Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Investment ($)",
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
    const seriesData = calculateInvestmentData().map((investment) => {
      return { name: investment.purchaseName, data: investment.assetValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [investmentInputs, numberOfMonths]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
        <section aria-labelledby="investment-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="investment-heading"
          >
            Investment
          </h2>
          {investmentInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Name of Purchase</span>
                <Input
                  className="col-start-2"
                  value={input.purchaseName}
                  onChange={(e) => {
                    const newInputs = [...investmentInputs];
                    newInputs[index].purchaseName = e.target.value;
                    setInvestmentInputs(newInputs);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Asset Cost</span>
                <Input
                  className="col-start-2"
                  value={input.assetCost}
                  onChange={(e) => {
                    const newInputs = [...investmentInputs];
                    newInputs[index].assetCost = e.target.value;
                    setInvestmentInputs(newInputs);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Quantity:</span>
                <Input
                  className="col-start-2"
                  type="number"
                  min="1"
                  value={input.quantity}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "quantity",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Purchase Month</span>
                <Input
                  className="col-start-2"
                  value={input.purchaseMonth}
                  onChange={(e) => {
                    const newInputs = [...investmentInputs];
                    newInputs[index].purchaseMonth = e.target.value;
                    setInvestmentInputs(newInputs);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Residual Value</span>
                <Input
                  className="col-start-2"
                  value={input.residualValue}
                  onChange={(e) => {
                    const newInputs = [...investmentInputs];
                    newInputs[index].residualValue = e.target.value;
                    setInvestmentInputs(newInputs);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">
                  Useful Lifetime (Months)
                </span>
                <Input
                  className="col-start-2"
                  value={input.usefulLifetime}
                  onChange={(e) => {
                    const newInputs = [...investmentInputs];
                    newInputs[index].usefulLifetime = e.target.value;
                    setInvestmentInputs(newInputs);
                  }}
                />
              </div>
              <div className="flex justify-end items-center">
                <button
                  className="bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => removeInvestmentInput(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={addNewInvestmentInput}
          >
            Add New
          </button>
        </section>
      </div>
      <div className="w-full lg:w-2/3 p-4">
        <h3 className="text-2xl font-semibold mb-4">Investment Table</h3>
        <Table
          className="overflow-auto my-8"
          dataSource={transformInvestmentDataForTable()}
          columns={investmentColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Investment Chart</h3>
        <Chart
          options={investmentChart.options}
          series={investmentChart.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default InvestmentSection;
