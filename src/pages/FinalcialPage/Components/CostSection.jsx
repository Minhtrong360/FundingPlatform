import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
  Checkbox,
  FloatButton,
  Modal,
  Table,
  message,
} from "antd";
import Chart from "react-apexcharts";
import {
  setCostInputs,
  setCostData,
  calculateCostData,
  transformCostDataForTable,
  setCostTableData,
} from "../../../features/CostSlice";

import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";
import TextArea from "antd/es/input/TextArea";
import { fetchGPTResponse } from "../../../features/CustomerSlice";

const CostInputForm = ({
  tempCostInput,
  renderCostForm,
  setRenderCostForm,
  handleCostInputChange,
  formatNumber,
  parseNumber,
  costGroupArray,
  revenueData,
  costTypeOptions,
  addNewCostInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
  handleCostTypeChange,
  showAdvancedInputs,
  setShowAdvancedInputs,
  handleFetchGPT,
}) => (
  <section aria-labelledby="costs-heading" className="mb-8 sticky top-8">
    <h2
      className="text-lg font-semibold mb-8 flex items-center"
      id="costs-heading"
    >
      Costs
    </h2>
    <div>
      <label
        htmlFor="selectedChannel"
        className="block my-4 text-base darkTextWhite"
      ></label>
      <select
        id="selectedChannel"
        className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
        value={renderCostForm}
        onChange={(e) => setRenderCostForm(e.target.value)}
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
        <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <span className="flex items-center text-sm">Cost dependence:</span>
            <Select
              className="border-gray-300"
              onValueChange={(value) => handleCostTypeChange(input?.id, value)}
              value={
                input.costType === "Based on Revenue"
                  ? "Based on Revenue"
                  : "Not related to revenue"
              }
            >
              <SelectTrigger
                id={`select-costCategory-${input?.id}`}
                className="border-solid border-[1px] border-gray-300"
              >
                <SelectValue placeholder="Select Cost Category" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Not related to revenue">
                  Not related to revenue
                </SelectItem>
                <SelectItem value="Based on Revenue">
                  Based on Revenue
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {input.costType === "Based on Revenue" && (
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Cost Group:</span>
              <Select
                className="border-gray-300"
                onValueChange={(value) =>
                  handleCostInputChange(input?.id, "costGroup", value)
                }
                value={input.costGroup}
              >
                <SelectTrigger
                  id={`select-costType-${input?.id}`}
                  className="border-solid border-[1px] border-gray-300"
                >
                  <SelectValue placeholder="Select Cost Type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {costGroupArray.map((cost) => (
                    <SelectItem value={cost} key={cost}>
                      {cost}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {input.costType === "Based on Revenue" ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Cost Name:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={input.costName}
                  onChange={(e) =>
                    handleCostInputChange(input?.id, "costName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Related Product:
                </span>
                <Select
                  className="mb-4"
                  placeholder="Select Related Revenue"
                  value={input.relatedRevenue}
                  onValueChange={(value) =>
                    handleCostInputChange(input.id, "relatedRevenue", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Related Revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(revenueData).map((revenueKey) => (
                      <SelectItem key={revenueKey} value={revenueKey}>
                        {revenueKey}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Cost Value (% Revenue):
                </span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="text"
                  value={formatNumber(input.salePercentage)}
                  onChange={(e) =>
                    handleCostInputChange(
                      input?.id,
                      "salePercentage",
                      parseNumber(e.target.value)
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Begin Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
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
                <span className="flex items-center text-sm">End Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
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
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Cost Name:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={input.costName}
                  onChange={(e) =>
                    handleCostInputChange(input?.id, "costName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Cost Value:</span>
                <Input
                  className="col-start-2 border-gray-300"
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
                <span className="flex items-center text-sm">
                  Growth Percentage (%):
                </span>
                <Input
                  className="col-start-2 border-gray-300"
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
                <span className="flex items-center text-sm">Frequency:</span>
                <Select
                  className="border-gray-300"
                  onValueChange={(value) =>
                    handleCostInputChange(input?.id, "growthFrequency", value)
                  }
                  value={input.growthFrequency}
                >
                  <SelectTrigger
                    id={`select-growthFrequency-${input?.id}`}
                    className="border-solid border-[1px] border-gray-300"
                  >
                    <SelectValue placeholder="Select Growth Frequency" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Begin Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
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
                <span className="flex items-center text-sm">End Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
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
            </>
          )}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Checkbox
              className="col-span-2"
              checked={showAdvancedInputs}
              onChange={(e) => setShowAdvancedInputs(e.target.checked)}
            >
              Show Advanced Inputs
            </Checkbox>
          </div>
          {showAdvancedInputs && (
            <Modal
              title="Advanced Inputs"
              visible={showAdvancedInputs}
              onOk={handleFetchGPT}
              onCancel={() => setShowAdvancedInputs(false)}
              okText={isLoading ? <SpinnerBtn /> : "Apply"}
              cancelText="Cancel"
              cancelButtonProps={{
                style: {
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  minWidth: "5vw",
                },
              }}
              okButtonProps={{
                style: {
                  background: "#2563EB",
                  borderColor: "#2563EB",
                  color: "#fff",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  minWidth: "5vw",
                },
              }}
              centered={true}
            >
              <div className="gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Additional Info:
                </span>
                <TextArea
                  className="col-start-2 border-gray-300"
                  value={input.additionalInfo}
                  onChange={(e) =>
                    handleCostInputChange(
                      input?.id,
                      "additionalInfo",
                      e.target.value
                    )
                  }
                  rows={10}
                />
              </div>
            </Modal>
          )}
        </div>
      ))}
    <div className="flex justify-between items-center">
      <button
        className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4 flex items-center"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <DeleteOutlined
          style={{ fontSize: "12px", color: "#FFFFFF", marginRight: "4px" }}
        />
        Remove
      </button>
      <button
        className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
        onClick={addNewCostInput}
      >
        <PlusOutlined
          style={{ fontSize: "12px", color: "#FFFFFF", marginRight: "4px" }}
        />
        Add
      </button>
      <button
        className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw]"
        onClick={handleSave}
      >
        {isLoading ? (
          <SpinnerBtn />
        ) : (
          <>
            <CheckCircleOutlined
              style={{ fontSize: "12px", color: "#FFFFFF", marginRight: "4px" }}
            />{" "}
            Save
          </>
        )}
      </button>
    </div>
  </section>
);

const CostSection = ({ numberOfMonths, isSaved, setIsSaved, handleSubmit }) => {
  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart
  

  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const { costInputs, costData, costTableData } = useSelector(
    (state) => state.cost
  );
  const { revenueData } = useSelector((state) => state.sales);

  const onDragEnd = useCallback((result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const reorderedData = Array.from(costTableData);
    const [removed] = reorderedData.splice(source.index, 1);
    reorderedData.splice(destination.index, 0, removed);

    dispatch(setCostTableData(reorderedData));
  }, [costTableData]);

  const dispatch = useDispatch();

  const [tempCostInput, setTempCostInput] = useState(costInputs);
  const [tempCostData, setTempCostData] = useState(costData);
  const [renderCostForm, setRenderCostForm] = useState(costInputs[0]?.id);

  const costGroupArray = [
    "Rent",
    "Utilities",
    "Insurance",
    "Office Supplies",
    "Travel Expenses",
    "Professional Fees",
  ];

  useEffect(() => {
    setTempCostInput(
      costInputs.map((input) => ({
        ...input,
        relatedRevenue: input.relatedRevenue || Object.keys(revenueData)[0],
        costGroup: input.costGroup || costGroupArray[0],
      }))
    );
  }, [costInputs, revenueData]);

  const addNewCostInput = () => {
    const maxId = Math.max(...tempCostInput.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      costName: "",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      growthFrequency: "Monthly",
      endMonth: 6,
      costType: "Sales, Marketing Cost",
      relatedRevenue: Object.keys(revenueData)[0],
      salePercentage: 0,
    };
    setTempCostInput([...tempCostInput, newCustomer]);
    setRenderCostForm(newId.toString());
  };

  const removeCostInput = (id) => {
    const indexToRemove = tempCostInput.findIndex((input) => input?.id == id);
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempCostInput.slice(0, indexToRemove),
        ...tempCostInput.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempCostInput(newInputs);
      setRenderCostForm(prevInputId);
    }
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

  const handleCostTypeChange = (id, value) => {
    const updatedInputs = tempCostInput.map((input) =>
      input.id === id
        ? { ...input, costType: value, relatedRevenue: "" }
        : input
    );
    setTempCostInput(updatedInputs);
  };

  useEffect(() => {
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculateCostData(
      tempCostInput,
      numberOfMonths,
      revenueData
    );
    setTempCostData(calculatedData);

    const costTableData = transformCostDataForTable(
      tempCostInput,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostTableData(costTableData));
  }, [tempCostInput, numberOfMonths]);

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth;
  const startingYear = startYear;

  const handleInputTable = (value, recordKey, monthKey) => {
    // Extract month number from the monthKey
    console.log("value", value);
    console.log("recordKey", recordKey);
    console.log("monthKey", monthKey);
    console.log("costTableData", costTableData);

    // Update gptResponseArray in tempCustomerInputs
    const monthIndex = parseInt(monthKey.replace("month", "")) - 1;

    const updatedData = costTableData.map((record) => {
      if (record.key === recordKey) {
        return {
          ...record,
          [monthKey]: value,
        };
      }
      return record;
    });

    dispatch(setCostTableData(updatedData));

    // const updatedTempCustomerInputs = tempCostInput.map((input) => {
    //   if (input.channelName === recordKey.split("-")[0]) {
    //     const updatedGPTResponseArray = [...input.gptResponseArray];
    //     updatedGPTResponseArray[monthIndex] = Number(value);
    //     if (monthKey == "month1") {
    //       return {
    //         ...input,
    //         gptResponseArray: updatedGPTResponseArray,
    //         customersPerMonth: Number(value),
    //       };
    //     }
    //     return {
    //       ...input,
    //       gptResponseArray: updatedGPTResponseArray,
    //     };
    //   }
    //   return input;
    // });

    // setTempCostInput(updatedTempCustomerInputs);
  };

  const costColumns = [
    {
      fixed: "left",
      title: <div>Cost name</div>,
      dataIndex: "costName",
      key: "costName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (startingMonth + i - 1) % 12;
      const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
      return {
        title: `${months[monthIndex]}/${year}`,
        dataIndex: `month${i + 1}`,
        key: `month${i + 1}`,
        align: "right",
        onCell: (record) => ({
          style: {
            borderRight: "1px solid #f0f0f0",
          },
        }),
        render: (text, record) => {
          if (!record.isHeader) {
            return (
              <div>
                <input
                  className="border-white p-0 text-xs text-right w-full h-full"
                  value={record[`month${i + 1}`]}
                  onChange={(e) =>
                    handleInputTable(
                      e.target.value,
                      record.key,
                      `month${i + 1}`
                    )
                  }
                />
              </div>
            );
          }

          return <div>{text}</div>;
        },
      };
    }),
  ];

  console.log("costTableData", costTableData);

  const [costChart, setCostChart] = useState({
    options: {
      chart: {
        fontFamily: "Sora, sans-serif",
        id: "cost-chart",
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        animations: {
          enabled: false,
        },
      },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      grid: { show: false },
      xaxis: {
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: 0,
          show: true,
          style: {
            fontFamily: "Sora, sans-serif",
          },
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
          style: {
            fontFamily: "Sora, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(val.toFixed(2));
          },
        },
        title: {
          text: "Cost ($)",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight", width: 1 },
    },
    series: [],
  });

  const handleSave = () => {
    setIsSaved(true);
  };

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saveData = async () => {
      try {
        setIsLoading(true);
        if (isSaved) {
          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);
          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
            const { user_email, collabs } = existingData[0];

            if (user.email !== user_email && !collabs?.includes(user.email)) {
              message.error(
                "You do not have permission to update this record."
              );
              return;
            }

            dispatch(setCostInputs(tempCostInput));

            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.costInputs = tempCostInput;

            const { error: updateError } = await supabase
              .from("finance")
              .update({ inputData: newInputData })
              .eq("id", existingData[0]?.id)
              .select();

            if (updateError) {
              throw updateError;
            } else {
              message.success("Data saved successfully!");
            }
          }
        }
      } catch (error) {
        message.error(error);
      } finally {
        setIsSaved(false);
        setIsLoading(false);
        setIsInputFormOpen(false);
      }
    };
    saveData();
  }, [isSaved]);

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);
  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  useEffect(() => {
    const seriesData = tempCostData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts
          .slice(chartStartMonth - 1, chartEndMonth)
          .map((cost) => cost.cost),
      };
    });

    const totalCostPerMonth = seriesData.reduce((acc, channel) => {
      channel.data.forEach((customers, index) => {
        if (!acc[index]) {
          acc[index] = 0;
        }
        acc[index] += customers;
      });
      return acc;
    }, []);

    setCostChart((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from(
            { length: chartEndMonth - chartStartMonth + 1 },
            (_, i) => {
              const monthIndex =
                (startingMonth + chartStartMonth - 1 + i - 1) % 12;
              const year =
                startingYear +
                Math.floor((startingMonth + chartStartMonth - 1 + i - 1) / 12);
              return `${months[monthIndex]}/${year}`;
            }
          ),
        },
      },
      series: [
        ...seriesData,
        {
          name: "Total",
          data: totalCostPerMonth,
        },
      ],
    }));
  }, [tempCostData, chartStartMonth, chartEndMonth]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeCostInput(renderCostForm);
    setIsDeleteModalOpen(false);
  };

  const handleFetchGPT = async () => {
    try {
      setIsLoading(true);
      const costSelected = tempCostInput.find(
        (input) => input.id == renderCostForm
      );
      let responseGPT;
      if (costSelected) {
        responseGPT = await dispatch(
          fetchGPTResponse(
            costSelected.id,
            costSelected.additionalInfo,
            costSelected
          )
        );
      }
      console.log("responseGPT", responseGPT);
      // Check if responseGPT is an object with a single key that holds an array
      let gptResponseArray = [];
      if (responseGPT && typeof responseGPT === "object") {
        const keys = Object.keys(responseGPT);
        if (keys.length === 1 && Array.isArray(responseGPT[keys[0]])) {
          gptResponseArray = responseGPT[keys[0]];
        } else {
          gptResponseArray = responseGPT;
        }
      } else {
        gptResponseArray = responseGPT;
      }
      console.log("gptResponseArray", gptResponseArray);

      const updatedTempCostInputs = tempCostInput.map((input) => {
        if (input.id === costSelected.id) {
          return {
            ...input,
            gptResponseArray: gptResponseArray, // assuming gptResponseArray contains the required data
          };
        }
        return input;
      });

      setTempCostInput(updatedTempCostInputs);
      setShowAdvancedInputs(false);
    } catch (error) {
      console.log("Fetching GPT error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("tempCostInput", tempCostInput);
  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Cost Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col transition duration-500 rounded-2xl">
            <div className="flex justify-between items-center">
              <div className="min-w-[10vw] mb-2">
                <label htmlFor="startMonthSelect">Start Month:</label>
                <select
                  id="startMonthSelect"
                  value={chartStartMonth}
                  onChange={(e) =>
                    setChartStartMonth(
                      Math.max(1, Math.min(e.target.value, chartEndMonth))
                    )
                  }
                  className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                >
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <option key={i + 1} value={i + 1}>
                        {`${months[monthIndex]}/${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="min-w-[10vw] mb-2">
                <label htmlFor="endMonthSelect">End Month:</label>
                <select
                  id="endMonthSelect"
                  value={chartEndMonth}
                  onChange={(e) =>
                    setChartEndMonth(
                      Math.max(
                        chartStartMonth,
                        Math.min(e.target.value, numberOfMonths)
                      )
                    )
                  }
                  className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                >
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <option key={i + 1} value={i + 1}>
                        {`${months[monthIndex]}/${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div onClick={() => handleChartClick(costChart)}>
              <Chart
                options={{
                  ...costChart.options,
                  xaxis: {
                    ...costChart.options.xaxis,
                  },
                  stroke: { width: 1, curve: "straight" },
                }}
                series={costChart.series}
                type="area"
                height={350}
              />
            </div>
          </Card>
        </div>
        <Modal
          centered
          visible={isChartModalVisible}
          footer={null}
          onCancel={() => setIsChartModalVisible(false)}
          width="90%"
          style={{ top: 20 }}
        >
          {selectedChart && (
            <Chart
              options={{
                ...selectedChart.options,
              }}
              series={selectedChart.series}
              type="area"
              height={500}
            />
          )}
        </Modal>
        <h3 className="text-lg font-semibold my-4">Cost Table</h3>
        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="costTable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Table
                className="overflow-auto my-8 rounded-md bg-white"
                size="small"
                dataSource={costTableData}
                columns={costColumns}
                pagination={false}
                bordered
                rowClassName={(record) =>
                  record.key === "Total" || record.isHeader ? "font-bold" : ""
                }
                components={{
                  body: {
                    row: (props) => {
                      const index = costTableData.findIndex(
                        (item) => item.key === props["data-row-key"]
                      );
                      return (
                        <Draggable
                          key={props["data-row-key"]}
                          draggableId={props["data-row-key"]}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              {...props}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={props.className}
                              style={{
                                ...props.style,
                                ...provided.draggableProps.style,
                              }}
                            />
                          )}
                        </Draggable>
                      );
                    },
                  },
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <CostInputForm
          tempCostInput={tempCostInput}
          renderCostForm={renderCostForm}
          setRenderCostForm={setRenderCostForm}
          handleCostInputChange={handleCostInputChange}
          formatNumber={formatNumber}
          parseNumber={parseNumber}
          costGroupArray={costGroupArray}
          revenueData={revenueData}
          addNewCostInput={addNewCostInput}
          handleSave={handleSave}
          isLoading={isLoading}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          handleCostTypeChange={handleCostTypeChange}
          showAdvancedInputs={showAdvancedInputs}
          setShowAdvancedInputs={setShowAdvancedInputs}
          handleFetchGPT={handleFetchGPT}
        />
      </div>

      <div className="xl:hidden block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
          }}
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal
          visible={isInputFormOpen}
          onOk={() => {
            handleSave();
            setIsInputFormOpen(false);
          }}
          onCancel={() => {
            setTempCostInput(costInputs);
            setIsInputFormOpen(false);
          }}
          okText={isLoading ? <SpinnerBtn /> : "Save Change"}
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
              minWidth: "5vw",
            },
          }}
          footer={null}
          centered={true}
          zIndex={50}
        >
          <CostInputForm
            tempCostInput={tempCostInput}
            renderCostForm={renderCostForm}
            setRenderCostForm={setRenderCostForm}
            handleCostInputChange={handleCostInputChange}
            formatNumber={formatNumber}
            parseNumber={parseNumber}
            costGroupArray={costGroupArray}
            revenueData={revenueData}
            addNewCostInput={addNewCostInput}
            handleSave={handleSave}
            isLoading={isLoading}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            handleCostTypeChange={handleCostTypeChange}
            showAdvancedInputs={showAdvancedInputs}
            setShowAdvancedInputs={setShowAdvancedInputs}
            handleFetchGPT={handleFetchGPT}
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalOpen}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Delete"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#f5222d",
              borderColor: "#f5222d",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          centered={true}
        >
          Are you sure you want to delete it?
        </Modal>
      )}
    </div>
  );
};

export default CostSection;
