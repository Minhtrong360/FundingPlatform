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
import {
  setCostInputs,
  setCostData,
  calculateCostData,
} from "../../../features/CostSlice";

import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";

const CostSection = ({
  numberOfMonths,

  isSaved,
  setIsSaved,
  handleSubmit,
}) => {
  const { costInputs, costData } = useSelector((state) => state.cost);
  const dispatch = useDispatch();

  const [tempCostInput, setTempCostInput] = useState(costInputs);

  const [tempCostData, setTempCostData] = useState(costData);

  const [renderCostForm, setRenderCostForm] = useState(costInputs[0]?.id);

  useEffect(() => {
    setTempCostInput(costInputs);
    setRenderCostForm(costInputs[0]?.id);
  }, [costInputs]);

  const addNewCostInput = () => {
    const maxId = Math.max(...tempCostInput.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      costName: "",
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

  // Function to calculate cost data

  // Function to transform cost data for table
  const transformCostDataForTable = () => {
    const transformedCustomerTableData = {};
    const calculatedCostData = calculateCostData(tempCostInput, numberOfMonths);

    calculatedCostData?.forEach((costItem) => {
      const rowKey = `${costItem.costName}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedCustomerTableData[rowKey]) {
          transformedCustomerTableData[rowKey] = {
            key: rowKey,
            costName: rowKey,
          };
        }
        transformedCustomerTableData[rowKey][`month${monthData.month}`] =
          formatNumber(parseFloat(monthData.cost)?.toFixed(2));
      });
    });

    return Object.values(transformedCustomerTableData);
  };

  // useEffect to update cost data when cost inputs or number of months change
  useEffect(() => {
    const calculatedData = calculateCostData(costInputs, numberOfMonths);
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths]);

  // useEffect to update temporary cost data when temp cost inputs or number of months change
  useEffect(() => {
    const calculatedData = calculateCostData(tempCostInput, numberOfMonths);
    setTempCostData(calculatedData);
  }, [tempCostInput, numberOfMonths]);
 
  const [showActualInput, setShowActualInput] = useState(false);

const handleCheckboxChange = (e) => {
  setShowActualInput(e.target.checked);
};

  // Function to generate columns for the cost table
  const costColumns = [
    {
      fixed: "left",
      title: "CostName",
      dataIndex: "costName",
      key: "costName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).flatMap((month) => [
      {
        title: `Month_${month} Forecast`,
        dataIndex: `month${month}`,
        key: `month${month}_forecast`,
      },
      ...(showActualInput ? [
        {
          title: `Month_${month} Actual`,
          dataIndex: `month${month}_actual`,
          key: `month${month}_actual`,
          render: (text, record) => (
            <input 
              type="number" 
              className="py-1 px-2 block w-full border-gray-200 rounded-md text-xs focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
              defaultValue={text || record[`month${month}`]} // Ensure defaultValue is set correctly
              onChange={e => handleActualChange(e.target.value, record, month)} 
            />
          )
        }
      ] : []),
    ]),
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
  useEffect(() => {
    const seriesData = tempCostData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempCostData, numberOfMonths]);

  const [selectedCostForComparison, setSelectedCostForComparison] = useState(null);

  // Function to handle select change
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedCostName = tempCostInput.find((input) => input.id.toString() === selectedId)?.costName;
    setSelectedCostForComparison(selectedCostName);
  
    // Existing code for handling select change...
    const selectedInput = tempCostInput.find((input) => input.id.toString() === selectedId);
    if (selectedInput?.costType === "Paid in Capital" && selectedInput.beginMonth < 2) {
      const updatedInputs = tempCostInput.map((input) =>
        input.id.toString() === selectedId ? { ...input, beginMonth: 2 } : input
      );
      setTempCostInput(updatedInputs);
      message.warning("Begin Month should be greater or equal to 2 for Paid in Capital.");
    }
    setRenderCostForm(selectedId);
  };
  

  // Update useEffect to include fundraising amount, type, and begin month
  useEffect(() => {
    const calculatedData = calculateCostData(tempCostInput, numberOfMonths);
    setTempCostData(calculatedData);
  }, [tempCostInput, numberOfMonths]);

  // Function to handle save
  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  // useEffect to update cost inputs when data is saved
  useEffect(() => {
    if (isSaved) {
      dispatch(setCostInputs(tempCostInput));
      setIsSaved(false);
    }
  }, [isSaved]);


  const [comparisonChart, setComparisonChart] = useState({
    options: {
      chart: { id: "comparison-chart", type: "bar", height: 350, stacked: false },
      xaxis: {
        categories: Array.from({ length: numberOfMonths }, (_, i) => `Month ${i + 1}`),
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
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            enabled: false,
            position: 'top',
          },
        }
      },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      markers: { size: 1 },
      legend: { position: "bottom", horizontalAlign: "right" },
    },
    series: [
      {
        name: 'Forecast',
        data: [], // This will be updated with forecast data
      },
      {
        name: 'Actual',
        data: [], // This will be updated with actual data input by user
      },
    ],
  });

  const handleActualChange = (value, record, monthIndex) => {
    const updatedTempCostData = tempCostData.map((item) => {
      if (item.costName === record.costName) {
        const updatedMonthlyCosts = item.monthlyCosts.map((month) => {
          if (month.month === monthIndex) {
            return { ...month, actual: parseFloat(value) || 0 };
          }
          return month;
        });
        return { ...item, monthlyCosts: updatedMonthlyCosts };
      }
      return item;
    });
  
    setTempCostData(updatedTempCostData);
  };
  
  useEffect(() => {
    if (!selectedCostForComparison) return;
  
    const selectedCostData = tempCostData.find(data => data.costName === selectedCostForComparison);
    if (!selectedCostData) return;
  
    const forecastData = selectedCostData.monthlyCosts.map(month => month.cost);
    const actualData = selectedCostData.monthlyCosts.map(month => month.actual || month.cost);
  
    setComparisonChart(prevState => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from({ length: numberOfMonths }, (_, i) => `Month ${i + 1}`),
        },
      },
      series: [
        { name: 'Forecast', data: forecastData },
        { name: 'Actual', data: actualData },
      ],
    }));
  }, [selectedCostForComparison, tempCostData, numberOfMonths]);
  

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 sm:border-r-2 border-r-0 sm:border-b-0 border-b-2">
        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center mt-4"
            id="costs-heading"
          >
            Costs
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
              {tempCostInput.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.costName}
                </option>
              ))}
            </select>
          </div>

          {tempCostInput
            .filter((input) => input?.id == renderCostForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4 "
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Cost Name:</span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Cost Value:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="text"
                    value={formatNumber(input.costValue)}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "costValue",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Growth Percentage (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="text"
                    value={formatNumber(input.growthPercentage)}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "growthPercentage",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Begin Month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">End Month:</span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Cost Type:</span>
                  <Select
                    className="border-gray-200"
                    onValueChange={(value) =>
                      handleCostInputChange(input?.id, "costType", value)
                    }
                    value={input.costType}
                  >
                    <SelectTrigger
                      id={`select-costType-${input?.id}`}
                      className="border-solid border-[1px] border-gray-200"
                    >
                      <SelectValue placeholder="Select Cost Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Sales, Marketing Cost">
                        Sales, Marketing
                      </SelectItem>
                      <SelectItem value="General Administrative Cost">
                        General Administrative
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
            Save changes
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-2xl font-semibold mb-4">Cost Table</h3>
        <div className="mb-4">
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          className="form-checkbox"
          onChange={handleCheckboxChange}
        />
        <span className="ml-2">Actual input</span>
      </label>
    </div>
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

<Chart
  options={comparisonChart.options}
  series={comparisonChart.series}
  type="bar"
  height={350}
/>

      </div>
    </div>
  );
};

export default CostSection;
