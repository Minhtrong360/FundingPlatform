import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { Card, Checkbox, FloatButton, Modal, Table, message } from "antd";
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

import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DraggableChart from "./DraggableChart";
import { setInputData } from "../../../features/DurationSlice";

import { Badge } from "../../../components/ui/badge";
import {
  Card as CardShadcn,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";
import { Check, Download, Plus, Trash2 } from "lucide-react";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { debounce } from "lodash";
import { FileOutlined } from "@ant-design/icons";
import {
  Search,
  MessageSquare,
  PhoneCall,
  Mail,
  Globe,
  CalendarIcon,
  Users,
  Clock,
  ThumbsUp,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

const CostInputForm = ({
  tempCostInput,
  setTempCostInput,
  costChart,
  renderCostForm,
  setRenderCostForm,
  handleCostInputChange,
  formatNumber,
  parseNumber,
  costGroupArray,
  revenueData,
  addNewCostInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
  handleCostTypeChange,
}) => {
  const [isModalCustomOpen, setIsModalCustomOpen] = useState(false);
  const [temporaryData, setTemporaryData] = useState([]);
  const [temporaryBeginMonth, setTemporaryBeginMonth] = useState();
  const [temporaryEndMonth, setTemporaryEndMonth] = useState();

  useEffect(() => {
    const input = tempCostInput.find((input) => input?.id == renderCostForm);

    if (input) {
      const foundSeries = costChart?.series?.find(
        (data) => data?.name === input.costName
      )?.data;

      const gptResponseArray = input?.gptResponseArray?.length
        ? input?.gptResponseArray
        : foundSeries && Array.isArray(foundSeries)
          ? foundSeries
          : [];

      setTemporaryData(
        gptResponseArray.map((value, index) => ({
          month: `Month ${index + 1}`,
          customers: value,
        }))
      );

      handleCostInputChange(input?.id, "gptResponseArray", gptResponseArray);
      setTemporaryBeginMonth(input?.beginMonth);
      setTemporaryEndMonth(input?.endMonth);
    }
  }, [renderCostForm]);

  const handleApply = () => {
    const input = tempCostInput.find((input) => input?.id == renderCostForm);

    if (input) {
      // Update gptResponseArray and applyCustom first and ensure state update is completed before next update
      setTempCostInput((prevInputs) => {
        const newInputs = prevInputs.map((i) => {
          if (i?.id === input?.id) {
            return {
              ...i,
              gptResponseArray: temporaryData.map((item) => item.customers),
              applyAdditionalInfo: true,
            };
          }
          return i;
        });
        // After updating gptResponseArray and applyCustom, update customersPerMonth
        const updatedInputs = newInputs.map((i) => {
          if (i?.id === input?.id) {
            return {
              ...i,
              costValue: Number(temporaryData[0].customers.toFixed(0)),
            };
          }
          return i;
        });
        setTemporaryData(temporaryData);
        setIsModalCustomOpen(false);
        return updatedInputs;
      });
    }
  };

  const [debouncedInputs, setDebouncedInputs] = useState(tempCostInput);
  // Thêm useEffect để đồng bộ hóa debouncedInputs khi tempFundraisingInputs thay đổi
  useEffect(() => {
    setDebouncedInputs(tempCostInput);
  }, [tempCostInput]);
  // Debounced function to update state after 1 second
  const debouncedHandleInputChange = useCallback(
    debounce((id, field, value) => {
      handleCostInputChange(id, field, value);
    }, 1000),
    [handleCostInputChange]
  );

  const handleInputChange = (id, field, value) => {
    setDebouncedInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );

    // Call debounced state update
    debouncedHandleInputChange(id, field, value);
  };

  return (
    <section aria-labelledby="costs-heading" className="mb-8 NOsticky NOtop-8">
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="costs-heading"
      >
        Costs
      </h2>

      <Select
        value={renderCostForm}
        onValueChange={(e) => {
          setRenderCostForm(e);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Offline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {debouncedInputs.map((input) => (
            <SelectItem key={input?.id} value={input?.id}>
              {input?.costName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {debouncedInputs
        .filter((input) => input?.id == renderCostForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-md p-6 border my-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Cost dependence:
              </span>
              <Select
                className="border-gray-300"
                onValueChange={(value) =>
                  handleCostTypeChange(input?.id, value)
                }
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
                <SelectContent position="popper" className="bg-white">
                  <SelectItem value="Not related to revenue">
                    Not related to revenue
                  </SelectItem>
                  <SelectItem value="Based on Revenue">
                    Based on Revenue
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Cost Group:</span>

              <Input
                className="col-start-2 border-gray-300"
                value={input.costGroup}
                onChange={(e) =>
                  handleInputChange(input?.id, "costGroup", e.target.value)
                }
              />
            </div>
            {input.costType === "Based on Revenue" ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">Cost Name:</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={input.costName}
                    onChange={(e) =>
                      handleInputChange(input?.id, "costName", e.target.value)
                    }
                  />
                  {/* {!input.costName.trim() && (
                  <span className="text-red-500 italic col-span-2 text-sm">
                    * Cost name is required.
                  </span>
                )} */}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Related Product:
                  </span>
                  <Select
                    disabled={input.applyAdditionalInfo}
                    className="mb-4"
                    placeholder="Select Related Revenue"
                    value={input.relatedRevenue}
                    onValueChange={(value) =>
                      handleInputChange(input.id, "relatedRevenue", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Related Revenue" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Total Revenue">
                        Total Revenue
                      </SelectItem>
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
                    disabled={input.applyAdditionalInfo}
                    className="col-start-2 border-gray-300"
                    type="text"
                    value={formatNumber(input.salePercentage)}
                    onChange={(e) =>
                      handleInputChange(
                        input?.id,
                        "salePercentage",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Begin Month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="number"
                    value={input.beginMonth}
                    onChange={(e) => {
                      handleInputChange(
                        input?.id,
                        "beginMonth",
                        parseInt(e.target.value, 10)
                      );
                      setTemporaryBeginMonth(e.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">End Month:</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="number"
                    value={input.endMonth}
                    onChange={(e) => {
                      handleInputChange(
                        input?.id,
                        "endMonth",
                        parseInt(e.target.value, 10)
                      );
                      setTemporaryEndMonth(e.target.value);
                    }}
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
                      handleInputChange(input?.id, "costName", e.target.value)
                    }
                  />
                  {/* {!input.costName.trim() && (
                  <span className="text-red-500 italic col-span-2 text-sm">
                    * Cost name is required.
                  </span>
                )} */}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">Cost Value:</span>
                  <Input
                    disabled={input.applyAdditionalInfo}
                    className="col-start-2 border-gray-300"
                    type="text"
                    value={formatNumber(input.costValue)}
                    onChange={(e) =>
                      handleInputChange(
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
                    disabled={input.applyAdditionalInfo}
                    className="col-start-2 border-gray-300"
                    type="text"
                    value={formatNumber(input.growthPercentage)}
                    onChange={(e) =>
                      handleInputChange(
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
                    disabled={input.applyAdditionalInfo}
                    className="border-gray-300"
                    onValueChange={(value) =>
                      handleInputChange(input?.id, "growthFrequency", value)
                    }
                    value={input.growthFrequency}
                  >
                    <SelectTrigger
                      id={`select-growthFrequency-${input?.id}`}
                      className="border-solid border-[1px] border-gray-300"
                    >
                      <SelectValue placeholder="Select Growth Frequency" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white">
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Semi-Annually">
                        Semi-Annually
                      </SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Begin Month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="number"
                    value={input.beginMonth}
                    onChange={(e) => {
                      handleInputChange(
                        input?.id,
                        "beginMonth",
                        parseInt(e.target.value, 10)
                      );
                      setTemporaryBeginMonth(e.target.value);
                    }}
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
                    onChange={(e) => {
                      handleInputChange(
                        input?.id,
                        "endMonth",
                        parseInt(e.target.value, 10)
                      );
                      setTemporaryEndMonth(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox
                    checked={input.applyAdditionalInfo}
                    onChange={(e) => {
                      handleInputChange(
                        input?.id,
                        "applyAdditionalInfo",
                        e.target.checked
                      );
                    }}
                  ></Checkbox>
                  <span
                    className="text-sm hover:cursor-pointer"
                    onClick={() => setIsModalCustomOpen(true)}
                  >
                    Custom Input
                  </span>
                </div>
              </>
            )}

            {isModalCustomOpen && (
              <Modal
                title="Custom Inputs"
                open={isModalCustomOpen}
                onOk={handleApply}
                onCancel={() => {
                  setIsModalCustomOpen(false);
                }}
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
                width="90%"
                style={{ top: 20 }}
                zIndex={42424243}
              >
                <DraggableChart
                  data={temporaryData}
                  onDataChange={(newData) => setTemporaryData(newData)}
                  beginMonth={temporaryBeginMonth}
                  endMonth={temporaryEndMonth}
                />
              </Modal>
            )}
          </div>
        ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
          style={{ backgroundColor: "#EF4444", color: "white" }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>
        <Button
          variant="destructive"
          onClick={addNewCostInput}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
        <Button
          variant="destructive"
          onClick={handleSave}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

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

    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
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
        ? {
            ...input,
            costType: value,
            relatedRevenue: "",
            applyAdditionalInfo:
              value === "Based on Revenue" ? false : input.applyAdditionalInfo,
          }
        : input
    );
    setTempCostInput(updatedInputs);
  };

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
  const { startMonth, startYear, inputData } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth;
  const startingYear = startYear;

  const handleInputTable = (value, recordKey, monthKey) => {
    // Extract month number from the monthKey

    // Update gptResponseArray in tempCustomerInputs
    const monthIndex = parseInt(monthKey.replace("month", "")) - 1;

    const updatedData = costTableData.map((record) => {
      if (record.key === recordKey) {
        return {
          ...record,
          [monthKey]: formatNumber(value.toFixed(2)),
        };
      }
      return record;
    });

    dispatch(setCostTableData(updatedData));

    const updatedTempCostInputs = tempCostInput?.map((input) => {
      if (input.costName === recordKey.split(" -")[0]) {
        const updatedGPTResponseArray = input.gptResponseArray
          ? [...input.gptResponseArray]
          : [];
        updatedGPTResponseArray[monthIndex] = Number(value);

        return {
          ...input,
          gptResponseArray: updatedGPTResponseArray,
        };
      }
      return input;
    });

    setTempCostInput(updatedTempCostInputs);
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

        render: (text, record) => {
          if (!record.isHeader && record.key !== "Total") {
            return (
              <input
                className="border-transparent bg-transparent p-0 text-xs text-right w-full h-full rounded-none"
                value={record[`month${i + 1}`]}
                onChange={(e) =>
                  handleInputTable(
                    parseNumber(e.target.value),
                    record.key,
                    `month${i + 1}`
                  )
                }
              />
            );
          }

          return (
            <div style={{ width: "fit-content", padding: "2px" }}>{text}</div>
          );
        },
      };
    }),
  ];

  const [costChart, setCostChart] = useState({
    options: {
      chart: {
        fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(val.toFixed(2));
          },
        },
        title: {
          text: "Cost ($)",
          style: {
            fontFamily: "Raleway Variable, sans-serif",
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Raleway Variable, sans-serif",
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight", width: 1 },
    },
    series: [],
  });

  const handleSave = async () => {
    try {
      // Kiểm tra nếu bất kỳ costName nào bị để trống
      const isAnyCostNameEmpty = tempCostInput.some(
        (input) => !input.costName.trim()
      );

      if (isAnyCostNameEmpty) {
        message.error("Please enter all cost names before saving.");
        return;
      }

      setIsLoading(true);

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
          message.error("You do not have permission to update this record.");
          return;
        }

        dispatch(setCostInputs(tempCostInput));

        const updatedInputData = {
          ...inputData,
          costInputs: tempCostInput,
        };

        dispatch(setInputData(updatedInputData));

        const { error: updateError } = await supabase
          .from("finance")
          .update({ inputData: updatedInputData })
          .eq("id", existingData[0]?.id)
          .select();

        if (updateError) {
          throw updateError;
        } else {
          message.success("Data saved successfully!");
        }
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Cost Name",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    costTableData.forEach((record) => {
      const row = [record.costName];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Cost Data");

    // Write workbook and trigger download
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "cost_data.xlsx"
    );
  };

  const downloadJSON = () => {
    // Update personnel inputs with formatted job begin and end months
    const updateCostInputs = tempCostInput.map((input) => {
      const monthIndexStart =
        (Number(startingMonth) + Number(input.beginMonth) - 2) % 12;

      const yearStart =
        Number(startingYear) +
        Math.floor((Number(startingMonth) + Number(input.beginMonth) - 2) / 12);

      const monthIndexEnd =
        (Number(startingMonth) + Number(input.endMonth) - 2) % 12;
      const yearEnd =
        Number(startingYear) +
        Math.floor((Number(startingMonth) + Number(input.endMonth) - 2) / 12);

      return {
        ...input,
        beginMonth: `${months[monthIndexStart]}/${yearStart}`,
        endMonth: `${months[monthIndexEnd]}/${yearEnd}`,
      };
    });
    const data = {
      costInput: updateCostInputs,
      costTableData,
    };

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "cost_data.json");
  };

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [visibleMetrics, setVisibleMetrics] = useState({
    existingCustomers: true,
    numberOfChannels: true,
    previousMonthUsers: true,
    addedUsers: true,
    churnedUsers: true,
    totalUsers: true,
    customerSatisfaction: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const metrics = [
    {
      key: "existingCustomers",
      title: "Existing Customers",
      value: "1,234",
      change: "+10%",
      icon: Users,
    },
    {
      key: "numberOfChannels",
      title: "Number of Channels",
      value: "5",
      change: "+2",
      icon: MessageSquare,
    },
    {
      key: "previousMonthUsers",
      title: "Previous month users",
      value: "10,987",
      change: "-",
      icon: Users,
    },
    {
      key: "addedUsers",
      title: "Added Users",
      value: "1,345",
      change: "+22%",
      icon: UserPlus,
    },
    {
      key: "churnedUsers",
      title: "No. of User Churned",
      value: "201",
      change: "-5%",
      icon: UserMinus,
    },
    {
      key: "totalUsers",
      title: "No. of Users",
      value: "12,131",
      change: "+11%",
      icon: Users,
    },
    {
      key: "customerSatisfaction",
      title: "Customer Satisfaction",
      value: "92%",
      change: "+3%",
      icon: ThumbsUp,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
            <h2 className="text-lg font-semibold">
              I. Metrics (Under Constructions)
            </h2>
            <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col">
              {/* Bộ chọn khoảng thời gian */}

              <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                <div className="min-w-[10vw] w-full flex flex-row sm:!mr-0 !mr-1">
                  <label
                    htmlFor="startMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    From:
                  </label>
                  <Select
                    value={chartStartMonth}
                    onValueChange={(value) => {
                      setChartStartMonth(
                        Math.max(1, Math.min(value, chartEndMonth))
                      );
                    }}
                  >
                    <SelectTrigger className="w-full sm:!justify-between !justify-center">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[10vw] w-full flex flex-row sm:!ml-0 !ml-1">
                  <label
                    htmlFor="endMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    To:
                  </label>
                  <Select
                    value={chartEndMonth}
                    onValueChange={(value) => {
                      setChartEndMonth(
                        Math.max(
                          chartStartMonth,
                          Math.min(value, numberOfMonths)
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Popover để chọn metrics hiển thị */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="bg-white right-0 left-auto"
                  align="end"
                >
                  <div className="grid gap-4">
                    <h4 className="font-medium leading-none">
                      Visible Metrics
                    </h4>
                    {metrics.map((metric) => (
                      <div
                        key={metric.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={metric.key}
                          checked={visibleMetrics[metric.key]}
                          onChange={() => toggleMetric(metric.key)}
                        />
                        <label
                          htmlFor={metric.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {metric.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hiển thị các metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(
              (metric) =>
                visibleMetrics[metric.key] && (
                  <CardShadcn key={metric.key}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {metric.change} from last period
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>
        <h3 className="text-lg font-semibold mb-8">II. Cost Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <CardShadcn className="flex flex-col transition duration-500 !rounded-md relative">
            <CardHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50"
                onClick={(event) => handleChartClick(costChart, event)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                </svg>
                <span className="sr-only">Fullscreen</span>
              </Button>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </CardShadcn>
        </div>
        <Modal
          centered
          open={isChartModalVisible}
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
              className="p-4"
            />
          )}
        </Modal>
        <div className="flex justify-between items-center my-4 mt-20">
          <h3 className="text-lg font-semibold">III. Cost Table</h3>
          <ButtonV0 variant="outline" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </ButtonV0>
        </div>{" "}
        {/* <div>
                <label
                  htmlFor="selectedChannel"
                  className="block my-4 text-base darkTextWhite"
                ></label>
                <select
                  id="selectedChannel"
                  className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                  value={renderCostForm}
                  onChange={(e) => setRenderCostForm(e.target.value)}
                >
                  {tempCostInput.map((input) => (
                    <option key={input?.id} value={input?.id}>
                      {input.costName}
                    </option>
                  ))}
                </select>
              </div> */}
        <Table
          className="custom-table bg-white overflow-auto my-8 rounded-md"
          size="small"
          dataSource={costTableData}
          columns={costColumns}
          pagination={false}
          bordered={false} // Tắt border mặc định của antd
          rowClassName={(record) =>
            record.key === "Total" || record.isHeader ? "font-bold" : ""
          }
        />
        <Button
          variant="destructive"
          onClick={handleSave}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>

      <div className="relative w-full xl:w-1/4">
        <div className="!py-4 xl:!block !hidden border-white !sticky !top-28">
          <CostInputForm
            tempCostInput={tempCostInput}
            setTempCostInput={setTempCostInput}
            costChart={costChart}
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
          />
        </div>
      </div>

      <div className="xl:!hidden !block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "80px",
            width: "48px",
            height: "48px",
          }}
          className="!shadow-md !bg-[#f3f4f6]"
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal
          open={isInputFormOpen}
          onCancel={() => {
            setTempCostInput(costInputs);
            setIsInputFormOpen(false);
          }}
          centered={true}
          zIndex={42424243}
          footer={null}
        >
          <CostInputForm
            tempCostInput={tempCostInput}
            setTempCostInput={setTempCostInput}
            costChart={costChart}
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
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          open={isDeleteModalOpen}
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
