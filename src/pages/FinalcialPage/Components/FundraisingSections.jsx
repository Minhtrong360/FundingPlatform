import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";

const FundraisingSection = ({
  fundraisingInputs,
  setFundraisingInputs,
  numberOfMonths,

  isSaved,
  setIsSaved,
}) => {
  const [tempFundraisingInputs, setTempFundraisingInputs] =
    useState(fundraisingInputs);

  const [renderCostForm, setRenderCostForm] = useState(
    fundraisingInputs[0]?.id
  );

  useEffect(() => {
    setTempFundraisingInputs(fundraisingInputs);
    setRenderCostForm(fundraisingInputs[0]?.id);
  }, [fundraisingInputs]);

  const addNewCostInput = () => {
    const maxId = Math.max(...tempFundraisingInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      name: "",
      fundraisingAmount: 0,
      fundraisingType: "",
      fundraisingBeginMonth: 1,
    };
    setTempFundraisingInputs([...tempFundraisingInputs, newCustomer]);
    setRenderCostForm(newId.toString());
  };

  const removeCostInput = (id) => {
    const newInputs = tempFundraisingInputs.filter((input) => input?.id != id);

    setTempFundraisingInputs(newInputs);
    setRenderCostForm(newInputs[0]?.id);
  };

  const handleFundraisingInputChange = (id, field, value) => {
    const newInputs = tempFundraisingInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempFundraisingInputs(newInputs);
  };

  // Function to calculate cost data
  const calculateCostData = () => {
    let allCosts = [];
    tempFundraisingInputs.forEach((costInput) => {
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
        name: costInput.name,
        monthlyCosts,
        costType: costInput.costType,
      });
    });
    return allCosts;
  };

  // Function to transform cost data for table
  const transformCostDataForTable = () => {
    const transformedCustomerTableData = {};
    const calculatedCostData = calculateCostData();

    calculatedCostData.forEach((costItem) => {
      const rowKey = `${costItem.name}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedCustomerTableData[rowKey]) {
          transformedCustomerTableData[rowKey] = {
            key: rowKey,
            name: rowKey,
          };
        }
        transformedCustomerTableData[rowKey][`month${monthData.month}`] =
          parseFloat(monthData.cost)?.toFixed(2);
      });
    });

    return Object.values(transformedCustomerTableData);
  };

  // Function to generate columns for the cost table
  const costColumns = [
    {
      fixed: "left",
      title: "name",
      dataIndex: "name",
      key: "name",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  // State for cost chart
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
          text: "Cost ($)",
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

  // useEffect to update cost chart data

  // Function to handle select change
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedInput = tempFundraisingInputs.find(
      (input) => input.id.toString() === selectedId
    );

    if (
      selectedInput?.fundraisingType === "Paid in Capital" &&
      selectedInput.fundraisingBeginMonth < 2
    ) {
      const updatedInputs = tempFundraisingInputs.map((input) =>
        input.id.toString() === selectedId
          ? { ...input, fundraisingBeginMonth: 2 }
          : input
      );
      setTempFundraisingInputs(updatedInputs);
      message.warning(
        "Fundraising Begin Month should be greater or equal to 2 for Paid in Capital."
      );
    }

    setRenderCostForm(selectedId);
  };

  // Update useEffect to include fundraising amount, type, and begin month

  // Function to handle save
  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  useEffect(() => {
    const checkFundraisingBeginMonth = tempFundraisingInputs.some(
      (input) => input.fundraisingBeginMonth < 2
    );
    if (checkFundraisingBeginMonth) {
      message.warning(
        "Fundraising Begin Month should be greater or equal to 2."
      );
    }
  }, [
    tempFundraisingInputs.map((input) => input.fundraisingBeginMonth).join(""),
  ]);

  // useEffect to update cost inputs when data is saved
  useEffect(() => {
    if (isSaved) {
      setFundraisingInputs(tempFundraisingInputs);
      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="costs-heading"
          >
            Fundraising
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderCostForm}
              onChange={handleSelectChange}
            >
              {tempFundraisingInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.name}
                </option>
              ))}
            </select>
          </div>

          {tempFundraisingInputs
            .filter((input) => input?.id == renderCostForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4 "
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Name:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.name}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* New input fields */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Amount:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    value={input.fundraisingAmount}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingAmount",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Type:
                  </span>
                  <Select
                    className="border-gray-200"
                    onValueChange={(value) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingType",
                        value
                      )
                    }
                    value={input.fundraisingType}
                  >
                    <SelectTrigger
                      id={`select-fundraisingType-${input?.id}`}
                      className="border-solid border-[1px] border-gray-200"
                    >
                      <SelectValue placeholder="Select Fundraising Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Common Stock">Common Stock</SelectItem>
                      <SelectItem value="Preferred Stock">
                        Preferred Stock
                      </SelectItem>
                      <SelectItem value="Paid in Capital">
                        Paid in Capital
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Month Fundraising Begins:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="1"
                    max="12"
                    value={input.fundraisingBeginMonth}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingBeginMonth",
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </div>
                {/* End of new input fields */}
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => removeCostInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4 mr-4"
            onClick={addNewCostInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 p-4">
        <h3 className="text-2xl font-semibold mb-4">Cost Table</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={transformCostDataForTable()}
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

export default FundraisingSection;
