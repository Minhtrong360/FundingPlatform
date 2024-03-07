import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const CostSection = ({
  costInputs,
  setCostInputs,
  numberOfMonths,
  calculateCostData,
  transformCostDataForTable,
  costData,
  setCostData,
}) => {
  const addNewCostInput = (input) => {
    setCostInputs([...costInputs, input]);
  };

  const removeCostInput = (index) => {
    const newInputs = [...costInputs];
    newInputs.splice(index, 1);
    setCostInputs(newInputs);
  };

  const handleCostInputChange = (index, field, value) => {
    const newInputs = [...costInputs];
    newInputs[index][field] = value;
    setCostInputs(newInputs);
  };

  //CostUseEffect
  useEffect(() => {
    const calculatedData = calculateCostData();
    setCostData(calculatedData);
  }, [costInputs, numberOfMonths]);

  //CostTableData

  const costTableData = transformCostDataForTable();

  //CostColumns
  const costColumns = [
    {
      fixed: "left",
      title: "CostType_CostName",
      dataIndex: "costName",
      key: "costName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  //CostChart
  const [costChart, setCostChart] = useState({
    options: {
      chart: { id: "cost-chart", type: "bar", height: 350 },
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
      // title: { text: 'Cost Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Cost ($)",
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
    const seriesData = costData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [costData, numberOfMonths]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="costs-heading"
          >
            Costs
          </h2>

          {costInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4 ">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Cost Name:</span>
                <Input
                  className="col-start-2"
                  value={input.costName}
                  onChange={(e) =>
                    handleCostInputChange(index, "costName", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Cost Value:</span>
                <Input
                  className="col-start-2"
                  type="number"
                  value={input.costValue}
                  onChange={(e) =>
                    handleCostInputChange(
                      index,
                      "costValue",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Growth Percentage:</span>
                <Input
                  className="col-start-2"
                  type="number"
                  value={input.growthPercentage}
                  onChange={(e) =>
                    handleCostInputChange(
                      index,
                      "growthPercentage",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Begin Month:</span>
                <Input
                  className="col-start-2"
                  type="number"
                  min="1"
                  max="12"
                  value={input.beginMonth}
                  onChange={(e) =>
                    handleCostInputChange(
                      index,
                      "beginMonth",
                      parseInt(e.target.value, 10)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">End Month:</span>
                <Input
                  className="col-start-2"
                  type="number"
                  min="1"
                  max="12"
                  value={input.endMonth}
                  onChange={(e) =>
                    handleCostInputChange(
                      index,
                      "endMonth",
                      parseInt(e.target.value, 10)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Cost Type:</span>
                <Select
                  onValueChange={(value) =>
                    handleCostInputChange(index, "costType", value)
                  }
                  value={input.costType}
                >
                  <SelectTrigger
                    id={`select-costType-${index}`}
                    className="border-solid border-[1px] border-gray-600"
                  >
                    <SelectValue placeholder="Select Cost Type" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Sales, Marketing Cost">
                      Sales, Marketing Cost
                    </SelectItem>
                    <SelectItem value="General Administrative Cost">
                      General Administrative Cost
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end items-center">
                <button
                  className="bg-red-600 text-white py-1 px-4 rounded"
                  onClick={() => removeCostInput(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded"
            onClick={addNewCostInput}
          >
            Add New
          </button>
        </section>
      </div>
      <div className="w-full lg:w-2/3 p-4">
        <h3 className="text-2xl font-semibold mb-4">Cost Table</h3>
        <Table
          className="overflow-auto my-8"
          dataSource={costTableData}
          columns={costColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Cost Chart</h3>
        <Chart
          options={costChart.options}
          series={costChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default CostSection;
