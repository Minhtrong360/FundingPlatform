import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table } from "antd";
import Chart from "react-apexcharts";

const CostSection = ({
  costInputs,
  setCostInputs,
  numberOfMonths,
  costData,
  setCostData,
  isSaved,
  setIsSaved,
}) => {
  const [tempCostInput, setTempCostInput] = useState(costInputs);

  const [tempCostData, setTempCostData] = useState(costData);

  const [renderCostForm, setRenderCostForm] = useState(costInputs[0]?.id);
  const addNewCostInput = () => {
    const maxId = Math.max(...tempCostInput.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      costName: "New cost name",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 6,
      costType: "Sales, Marketing Cost",
    };
    setTempCostInput([...tempCostInput, newCustomer]);
    setRenderCostForm(newId.toString());
  };

  const removeCostInput = (id) => {
    const newInputs = tempCostInput.filter((input) => input?.id != id);

    setTempCostInput(newInputs);
    setRenderCostForm(newInputs[0]?.id);
  };

  const handleCostInputChange = (id, field, value) => {
    const newInputs = tempCostInput.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempCostInput(newInputs);
  };

  const calculateCostData = () => {
    let allCosts = [];
    tempCostInput.forEach((costInput) => {
      let monthlyCosts = [];
      let currentCost = parseFloat(costInput.costValue);
      for (let month = 1; month <= numberOfMonths; month++) {
        if (month >= costInput.beginMonth && month <= costInput.endMonth) {
          monthlyCosts.push({ month: month, cost: currentCost });
          currentCost *= 1 + parseFloat(costInput.growthPercentage) / 100;
        } else {
          monthlyCosts.push({ month: month, cost: 0 });
        }
      }
      allCosts.push({
        costName: costInput.costName,
        monthlyCosts,
        costType: costInput.costType,
      });
    });
    return allCosts;
  };

  const transformCostDataForTable = () => {
    const transformedCustomerTableData = {};
    const calculatedCostData = calculateCostData();

    calculatedCostData.forEach((costItem) => {
      const rowKey = `${costItem.costType} - ${costItem.costName}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedCustomerTableData[rowKey]) {
          transformedCustomerTableData[rowKey] = {
            key: rowKey,
            costName: rowKey,
          };
        }
        transformedCustomerTableData[rowKey][`month${monthData.month}`] =
          parseFloat(monthData.cost)?.toFixed(2);
      });
    });

    return Object.values(transformedCustomerTableData);
  };

  //CostUseEffect
  useEffect(() => {
    const calculatedData = calculateCostData();
    setCostData(calculatedData);
  }, [costInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculateCostData();
    setTempCostData(calculatedData);
  }, [tempCostInput, numberOfMonths]);

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
    const seriesData = tempCostData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempCostData, numberOfMonths]);

  const handleSelectChange = (event) => {
    setRenderCostForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  useEffect(() => {
    if (isSaved) {
      setCostInputs(tempCostInput);
      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="costs-heading"
          >
            Costs
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            >
              Selected cost name:
            </label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderCostForm}
              onChange={handleSelectChange}
            >
              {tempCostInput.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.costName}
                </option>
              ))}
            </select>
          </div>

          {tempCostInput
            .filter((input) => input?.id == renderCostForm) // Sử dụng biến renderForm
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 my-4 "
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Cost Name:</span>
                  <Input
                    className="col-start-2"
                    value={input.costName}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "costName",
                        e.target.value
                      )
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
                        input?.id,
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
                        input?.id,
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
                        input?.id,
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
                        input?.id,
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
                      handleCostInputChange(input?.id, "costType", value)
                    }
                    value={input.costType}
                  >
                    <SelectTrigger
                      id={`select-costType-${input?.id}`}
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
                    onClick={() => removeCostInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4 mr-4"
            onClick={addNewCostInput}
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
