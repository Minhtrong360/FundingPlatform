import React, { useEffect, useState, useCallback } from "react";
import { Input } from "../../../components/ui/Input";
import {
  Button,
  Card,
  FloatButton,
  Modal,
  Table,
  Tooltip,
  message,
} from "antd";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerInputs,
  setCustomerGrowthData,
  calculateYearlyAverage,
  calculateCustomerGrowth,
  transformCustomerData,
  generateCustomerTableData,
  setCustomerTableData,
  fetchGPTResponse,
} from "../../../features/CustomerSlice";
import {
  calculateChannelRevenue,
  calculateYearlySales,
  setChannelInputs,
  setRevenueData,
  setYearlySales,
} from "../../../features/SaleSlice";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { supabase } from "../../../supabase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
  FullscreenOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import { Checkbox } from "antd";
import {
  Modal as AntdModal, // Add AntdModal for larger mode view
} from "antd";
import TextArea from "antd/es/input/TextArea";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Flowise from "./Flowise";

const CustomerInputsForm = React.memo(
  ({
    tempCustomerInputs,
    renderCustomerForm,
    setRenderCustomerForm,
    handleSelectChange,
    handleInputChange,
    formatNumber,
    parseNumber,
    handleAddNewCustomer,
    handleSave,
    handleFetchGPT,
    isLoading,
    showAdvancedInputs,
    setShowAdvancedInputs,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
  }) => {
    return (
      <section
        aria-labelledby="customers-heading"
        className="mb-8 NOsticky NOtop-8"
      >
        <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="customers-heading"
          >
            Customer channel{" "}
          </h2>
        </Tooltip>

        <div>
          <label
            htmlFor="selectedChannel"
            className="block my-4 text-base darkTextWhite"
          ></label>
          <select
            id="selectedChannel"
            className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
            value={renderCustomerForm}
            onChange={(e) => setRenderCustomerForm(e.target.value)}
          >
            <option value="all">All</option>
            {tempCustomerInputs.map((input) => (
              <option key={input?.id} value={input?.id}>
                {input?.channelName}
              </option>
            ))}
          </select>
        </div>

        {tempCustomerInputs
          .filter((input) => input?.id == renderCustomerForm)
          .map((input) => (
            <div
              key={input?.id}
              className="bg-white rounded-2xl p-6 border my-4"
            >
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Channel Name:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={input.channelName}
                  onChange={(e) =>
                    handleInputChange(input?.id, "channelName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Existing Customer:
                </span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="text"
                  value={formatNumber(input.beginCustomer)}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "beginCustomer",
                      parseNumber(e.target.value)
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Adding (First month)
                </span>
                <Input
                  disabled={input.applyAdditionalInfo}
                  className="col-start-2 border-gray-300"
                  value={formatNumber(input.customersPerMonth)}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "customersPerMonth",
                      parseNumber(e.target.value)
                    )
                  }
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Growth rate (%):
                </span>
                <Input
                  disabled={input.applyAdditionalInfo}
                  className="col-start-2 border-gray-300"
                  value={formatNumber(input.growthPerMonth)}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "growthPerMonth",
                      parseNumber(e.target.value)
                    )
                  }
                  type="text"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Frequency:</span>
                <Select
                  disabled={input.applyAdditionalInfo}
                  className="border-gray-300"
                  onValueChange={(value) =>
                    handleInputChange(
                      input?.id,
                      "customerGrowthFrequency",
                      value
                    )
                  }
                  value={input.customerGrowthFrequency}
                >
                  <SelectTrigger
                    id={`select-customerGrowthFrequency-${input?.id}`}
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
                  min={1}
                  value={input.beginMonth}
                  onChange={(e) =>
                    handleInputChange(input?.id, "beginMonth", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">End Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="number"
                  min={1}
                  value={input.endMonth}
                  onChange={(e) =>
                    handleInputChange(input?.id, "endMonth", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Churn rate (%):
                </span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="text"
                  value={formatNumber(input.churnRate)}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "churnRate",
                      parseNumber(e.target.value)
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Acquisition cost:
                </span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="text"
                  value={input.acquisitionCost}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "acquisitionCost",
                      e.target.value
                    )
                  }
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <Checkbox
                  className="col-span-2"
                  checked={input.applyAdditionalInfo}
                  onChange={(e) =>
                    handleInputChange(
                      input?.id,
                      "applyAdditionalInfo",
                      e.target.checked
                    )
                  }
                >
                  Apply Additional Info
                </Checkbox>
              </div>
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
                  open={showAdvancedInputs}
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
                      className="col-start-2 border-gray-300 text-sm"
                      value={input.additionalInfo}
                      onChange={(e) =>
                        handleInputChange(
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

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="flex justify-center items-center">
            <button
              className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <DeleteOutlined
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  marginRight: "4px",
                }}
              />
              Remove
            </button>
          </div>
          <button
            className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
            onClick={handleAddNewCustomer}
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
                  style={{
                    fontSize: "12px",
                    color: "#FFFFFF",
                    marginRight: "4px",
                  }}
                />
                Save
              </>
            )}
          </button>
        </div>
      </section>
    );
  }
);

const CustomerSection = React.memo(
  ({
    numberOfMonths,
    isSaved,
    setIsSaved,
    customerGrowthChart,
    setCustomerGrowthChart,
  }) => {
    const [functionType, setFunctionType] = useState("linear"); // New state for function type
    const [chartNotes, setChartNotes] = useState(""); // New state for chart notes

    const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
    const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

    const chartFunctions = [
      { value: "linear", label: "Linear" },
      { value: "exponential", label: "Exponential" },
      { value: "logarithmic", label: "Logarithmic" },
    ];

    const handleChartClick = (chart, event) => {
      console.log("event", event);
      const toolbar = document.querySelector(".apexcharts-toolbar");
      if (toolbar && toolbar.contains(event.target)) {
        console.log("Toolbar button clicked, modal will not open");
        // Click was on the toolbar, so don't open the modal
        return;
      }

      setSelectedChart(chart);
      setIsChartModalVisible(true);
    };
    const dispatch = useDispatch();
    const { customerInputs, customerGrowthData, customerTableData } =
      useSelector((state) => state.customer);
    const generatePromptC = () => {
      return ` ${JSON.stringify(customerTableData)}`;
    };
    const { startMonth, startYear } = useSelector(
      (state) => state.durationSelect
    );
    const [tempCustomerInputs, setTempCustomerInputs] =
      useState(customerInputs);

    const [tempCustomerGrowthData, setTempCustomerGrowthData] =
      useState(customerGrowthData);

    const [renderCustomerForm, setRenderCustomerForm] = useState(
      tempCustomerInputs[0]?.id
    );

    const handleAddNewCustomer = () => {
      const channelNames = tempCustomerInputs.map((input) => input.channelName);
      if (channelNames.includes("New channel")) {
        message.warning("Please input another channel name.");
        return;
      }

      const maxId = Math.max(...tempCustomerInputs.map((input) => input?.id));
      const newId = maxId !== -Infinity ? maxId + 1 : 1;

      const newCustomer = {
        id: newId,
        customersPerMonth: 100,
        growthPerMonth: 2,
        customerGrowthFrequency: "Monthly",
        channelName: "New channel",
        beginMonth: 1,
        endMonth: 15,
        beginCustomer: 0,
        churnRate: 0,
        acquisitionCost: 0, // Default value for acquisition cost
        adjustmentFactor: 1, // Default value for adjustment factor
        eventName: "", // Default value for event name
        additionalInfo: "", // Default value for additional info
      };

      setTempCustomerInputs([...tempCustomerInputs, newCustomer]);
      setRenderCustomerForm(newId.toString());
    };

    const removeCustomerInput = (id) => {
      const indexToRemove = tempCustomerInputs.findIndex(
        (input) => input?.id == id
      );
      if (indexToRemove !== -1) {
        const newInputs = [
          ...tempCustomerInputs.slice(0, indexToRemove),
          ...tempCustomerInputs.slice(indexToRemove + 1),
        ];
        const prevInputId =
          indexToRemove === 0
            ? newInputs[0]?.id
            : newInputs[indexToRemove - 1]?.id;

        setTempCustomerInputs(newInputs);
        setRenderCustomerForm(prevInputId);
      }
    };

    // Update handleInputChange to handle advanced inputs
    const handleInputChange = (id, field, value, advancedIndex = null) => {
      if (field === "churnRate") {
        value = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100
      }

      const newInputs = tempCustomerInputs.map((input) => {
        if (input?.id === id) {
          if (advancedIndex !== null) {
            const newAdvancedInputs = input.advancedInputs.map(
              (advInput, index) => {
                if (index === advancedIndex) {
                  return { ...advInput, [field]: value };
                }
                return advInput;
              }
            );
            return { ...input, advancedInputs: newAdvancedInputs };
          }
          return { ...input, [field]: value };
        }
        return input;
      });
      setTempCustomerInputs(newInputs);
    };

    const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

    useEffect(() => {
      const calculatedData = calculateCustomerGrowth(
        tempCustomerInputs,
        numberOfMonths
      );

      const calculateTransformedCustomerTableData = transformCustomerData(
        calculatedData,
        tempCustomerInputs
      );

      const calculateCustomerTableData = generateCustomerTableData(
        calculateTransformedCustomerTableData,
        tempCustomerInputs,
        numberOfMonths,
        renderCustomerForm
      );

      dispatch(setCustomerTableData(calculateCustomerTableData));

      setTempCustomerGrowthData(calculatedData);
    }, [tempCustomerInputs, renderCustomerForm, showAdvancedInputs]); // Include showAdvancedInputs as a dependency

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

    const startingMonth = startMonth; // Tháng bắt đầu từ 1
    const startingYear = startYear; // Năm bắt đầu từ 24

    const handleInputTable = (value, recordKey, monthKey) => {
      // Extract month number from the monthKey
      const monthIndex = parseInt(monthKey.replace("month", "")) - 1;

      const updatedData = customerTableData.map((record) => {
        if (record.key === recordKey) {
          return {
            ...record,
            [monthKey]: formatNumber(value),
          };
        }
        return record;
      });

      dispatch(setCustomerTableData(updatedData));

      // Update gptResponseArray in tempCustomerInputs

      const updatedTempCustomerInputs = tempCustomerInputs.map((input) => {
        if (input.channelName === recordKey.split("-")[0]) {
          const updatedGPTResponseArray = input.gptResponseArray
            ? [...input.gptResponseArray]
            : [];
          updatedGPTResponseArray[monthIndex] = Number(value);
          if (monthKey == "month1") {
            return {
              ...input,
              gptResponseArray: updatedGPTResponseArray,
              customersPerMonth: Number(value),
            };
          }
          return {
            ...input,
            gptResponseArray: updatedGPTResponseArray,
          };
        }
        return input;
      });

      setTempCustomerInputs(updatedTempCustomerInputs);
    };

    const customerColumns = [
      {
        fixed: "left",
        title: <div>Channel Name</div>,
        dataIndex: "channelName",
        key: "channelName",
        width: 500,
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
            const channel = tempCustomerInputs.find(
              (input) => input.channelName === record.channelName
            );
            const month = i + 1;
            const isInEvent =
              month >= channel?.eventBeginMonth &&
              month <= channel?.eventEndMonth;
            const growthRate = isInEvent
              ? channel?.localGrowthRate
              : channel?.growthPerMonth;
            const eventName = channel?.eventName || "";

            const tooltipTitle = isInEvent
              ? `Local Growth Rate: ${growthRate}%\nEvent: ${eventName}`
              : "";

            const cellStyle = isInEvent ? { backgroundColor: "yellow" } : {};

            if (record.key.includes("-add")) {
              return (
                <Tooltip title={tooltipTitle} placement="topLeft">
                  <div style={cellStyle}>
                    <input
                      className="border-white p-0 text-xs text-right w-full h-full"
                      value={record[`month${i + 1}`]}
                      onChange={(e) =>
                        handleInputTable(
                          parseNumber(e.target.value),
                          record.key,
                          `month${i + 1}`
                        )
                      }
                    />
                  </div>
                </Tooltip>
              );
            }

            return (
              <Tooltip title={tooltipTitle} placement="topLeft">
                <div style={cellStyle}>{text}</div>
              </Tooltip>
            );
          },
        };
      }),
    ];

    const handleSelectChange = (event) => {
      setRenderCustomerForm(event.target.value);
    };

    const handleSave = () => {
      saveData();
    };
    const channelInputs = useSelector((state) => state.sales.channelInputs);

    const { id } = useParams();
    const { user } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const saveData = async () => {
      try {
        setIsLoading(true);
        // Check if there are duplicate channel names
        const channelNames = tempCustomerInputs.map(
          (input) => input.channelName
        );
        const duplicateChannel = channelNames.find(
          (name, index) => channelNames.indexOf(name) !== index
        );

        if (duplicateChannel) {
          message.warning(
            `Please change the channel name: "${duplicateChannel}" before saving.`
          );
          return;
        }

        const { data: existingData, error: selectError } = await supabase
          .from("finance")
          .select("*")
          .eq("id", id);
        if (selectError) {
          throw selectError;
        }

        if (existingData && existingData.length > 0) {
          const { user_email, collabs, inputData } = existingData[0];

          // Check if user.email matches user_email or is included in collabs
          if (user.email !== user_email && !collabs?.includes(user.email)) {
            message.error("You do not have permission to update this record.");
            return;
          }

          const updatedChannelInputs = channelInputs.map((input) => {
            const matchedChannel = tempCustomerInputs.find(
              (customer) => customer.id === input.selectedChannel.id
            );
            if (matchedChannel) {
              return {
                ...input,
                selectedChannel: {
                  ...input.selectedChannel,
                  channelName: matchedChannel.channelName,
                },
              };
            }
            return input;
          });

          dispatch(setCustomerInputs(tempCustomerInputs));
          const { revenueByChannelAndProduct } = dispatch(
            calculateChannelRevenue(
              numberOfMonths,
              tempCustomerGrowthData,
              tempCustomerInputs,
              updatedChannelInputs
            )
          );

          const yearlySale = calculateYearlySales(revenueByChannelAndProduct);
          dispatch(setYearlySales(yearlySale));
          dispatch(setRevenueData(revenueByChannelAndProduct));

          const newInputData = JSON.parse(inputData);

          const calculatedData = calculateCustomerGrowth(
            tempCustomerInputs,
            numberOfMonths
          );
          dispatch(setCustomerGrowthData(calculatedData));

          const averages = calculateYearlyAverage(
            calculatedData,
            numberOfMonths
          );

          dispatch(setChannelInputs(updatedChannelInputs));
          newInputData.customerInputs = tempCustomerInputs;
          newInputData.yearlyAverageCustomers = averages;
          newInputData.yearlySales = yearlySale;
          newInputData.channelInputs = updatedChannelInputs;

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
      } catch (error) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
        setIsInputFormOpen(false);
      }
    };

    const [chartStartMonth, setChartStartMonth] = useState(1);
    const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

    useEffect(() => {
      const startIdx = chartStartMonth - 1;
      const endIdx = chartEndMonth;

      const filteredCategories = Array.from(
        { length: endIdx - startIdx },
        (_, i) => {
          const monthIndex = (startMonth + startIdx + i - 1) % 12;
          const year =
            startYear + Math.floor((startMonth + startIdx + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }
      );

      const seriesData = tempCustomerGrowthData.map((channelData) => {
        return {
          name: channelData[0]?.channelName || "Unknown Channel",
          dataBegin: channelData
            .slice(startIdx, endIdx)
            .map((data) => parseInt(data.begin, 10)),
          dataAdd: channelData
            .slice(startIdx, endIdx)
            .map((data) => parseInt(data.add, 10)),
          dataChurn: channelData
            .slice(startIdx, endIdx)
            .map((data) => parseInt(data.churn, 10)),
          dataEnd: channelData
            .slice(startIdx, endIdx)
            .map((data) => parseInt(data.end, 10)),
          data: channelData
            .slice(startIdx, endIdx)
            .map((data) => parseInt(data.customers, 10)),
        };
      });
      const seriesData2 = tempCustomerGrowthData.map((channelData) => {
        return {
          name: channelData[0]?.channelName || "Unknown Channel",
          dataBegin: channelData.map((data) => parseInt(data.begin, 10)),
          dataAdd: channelData.map((data) => parseInt(data.add, 10)),
          dataChurn: channelData.map((data) => parseInt(data.churn, 10)),
          dataEnd: channelData.map((data) => parseInt(data.end, 10)),
          data: channelData.map((data) => parseInt(data.customers, 10)),
        };
      });

      const totalCustomersPerMonth = seriesData.reduce((acc, channel) => {
        channel.data.forEach((customers, index) => {
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += customers;
        });
        return acc;
      }, []);

      const totalCustomersPerMonth2 = seriesData2.reduce((acc, channel) => {
        channel.data.forEach((customers, index) => {
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += customers;
        });
        return acc;
      }, []);

      const yearlyTotalData = [];
      let startIndex = 0;
      const monthsInFirstYear = 12 - (startMonth - 1);

      const channelYearlyTotals = seriesData2.map((channel) => ({
        name: channel.name,
        data: [],
      }));

      const firstYearTotal = totalCustomersPerMonth2
        .slice(startIndex, monthsInFirstYear)
        .reduce((sum, current) => sum + current, 0);
      yearlyTotalData.push(firstYearTotal);

      seriesData2.forEach((channel, index) => {
        const firstYearTotal = channel.data
          .slice(startIndex, monthsInFirstYear)
          .reduce((sum, current) => sum + current, 0);
        channelYearlyTotals[index].data.push(firstYearTotal);
      });

      startIndex += monthsInFirstYear;

      while (startIndex < totalCustomersPerMonth2.length) {
        const yearlyTotal = totalCustomersPerMonth2
          .slice(startIndex, startIndex + 12)
          .reduce((sum, current) => sum + current, 0);
        yearlyTotalData.push(yearlyTotal);

        seriesData2.forEach((channel, index) => {
          const yearlyTotal = channel.data
            .slice(startIndex, startIndex + 12)
            .reduce((sum, current) => sum + current, 0);
          channelYearlyTotals[index].data.push(yearlyTotal);
        });

        startIndex += 12;
      }

      const yearlyGrowthRates = yearlyTotalData.map((total, index, arr) => {
        if (index === 0) return 0;
        return ((total - arr[index - 1]) / arr[index - 1]) * 100;
      });

      setCustomerGrowthChart((prevState) => {
        return {
          ...prevState,
          series: [
            ...seriesData2,
            {
              name: "Total",
              data: totalCustomersPerMonth2,
            },
          ],
          charts: [
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "allChannels",
                  stacked: false,
                  animated: false,
                },

                xaxis: {
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: true,
                    rotate: 0,
                    style: {
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                  categories: filteredCategories,
                  title: {
                    text: "Month",
                    style: {
                      fontSize: "12px",
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "All Channels",
                  style: {
                    fontSize: "12px",
                    fontFamily: "Sora, sans-serif",
                  },
                },
              },
              series: [
                ...seriesData,
                {
                  name: "Total",
                  data: totalCustomersPerMonth,
                },
              ],
            },
            ...seriesData.map((channelSeries) => ({
              options: {
                ...prevState.options,
                // chart: {
                //   ...prevState.options.chart,
                //   id: channelSeries.name,
                // },
                xaxis: {
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: true,
                    rotate: 0,
                    style: {
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                  categories: filteredCategories,
                  title: {
                    text: "Month",
                    style: {
                      fontSize: "12px",
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: channelSeries.name,
                },
              },
              series: [
                {
                  name: "Begin",
                  data: channelSeries.dataBegin,
                },
                {
                  name: "Add",
                  data: channelSeries.dataAdd,
                },
                {
                  name: "Churn",
                  data: channelSeries.dataChurn,
                },
                {
                  name: "End",
                  data: channelSeries.dataEnd,
                },
              ],
            })),
          ],
          chartsNoFilter: [
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "yearlyTotal",
                  stacked: false,
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Yearly Total",
                },
                //
                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: yearlyTotalData.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ),
                },
                yaxis: {
                  title: {
                    text: "Yearly Total",
                  },
                  labels: {
                    formatter: (value) => `${formatNumber(value.toFixed(0))}`,
                  },
                },
              },
              series: [
                {
                  name: "Yearly Total",
                  data: yearlyTotalData,
                },
              ],
            },
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "yearlyGrowthRate",
                  stacked: false,
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Yearly Growth Rate",
                },

                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: yearlyGrowthRates.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ),
                },
                yaxis: {
                  title: {
                    text: "Yearly Growth Rate (%)",
                  },
                  labels: {
                    formatter: (value) => `${value.toFixed(2)}%`,
                  },
                },
              },
              series: [
                {
                  name: "Yearly Growth Rate (%)",
                  data: yearlyGrowthRates,
                  type: "line",
                },
              ],
            },
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "channelYearlyTotals",
                  stacked: false,
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Total Yearly Customers by Channel",
                },

                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: channelYearlyTotals[0]?.data.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ),
                },
              },
              series: channelYearlyTotals,
            },
          ],
        };
      });
    }, [tempCustomerGrowthData, chartStartMonth, chartEndMonth]);

    const [isInputFormOpen, setIsInputFormOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const confirmDelete = () => {
      removeCustomerInput(renderCustomerForm);
      setIsDeleteModalOpen(false);
    };

    const handleFetchGPT = async () => {
      try {
        setIsLoading(true);
        const customer = tempCustomerInputs.find(
          (input) => input.id == renderCustomerForm
        );
        let responseGPT;
        if (customer) {
          responseGPT = await dispatch(
            fetchGPTResponse(customer.id, customer.additionalInfo, customer)
          );
        }

        console.log("responseGPT", responseGPT);
        // Check if responseGPT is an object with multiple keys
        let gptResponseArray = [];
        if (responseGPT) {
          if (Array.isArray(responseGPT)) {
            // If responseGPT is already an array, use it directly
            gptResponseArray = responseGPT;
          } else if (typeof responseGPT === "object") {
            // If responseGPT is an object with multiple keys, get the first array found
            const keys = Object.keys(responseGPT);
            if (keys.length > 0 && Array.isArray(responseGPT[keys[0]])) {
              gptResponseArray = responseGPT[keys[0]];
            }
          }
        }
        console.log("gptResponseArray", gptResponseArray);

        const updatedTempCustomerInputs = tempCustomerInputs.map((input) => {
          if (input.id === customer.id) {
            return {
              ...input,
              customersPerMonth: gptResponseArray[0] || [], // assuming the first element is needed
              gptResponseArray: gptResponseArray || [], // assuming gptResponseArray contains the required data
            };
          }
          return input;
        });

        setTempCustomerInputs(updatedTempCustomerInputs);
        setShowAdvancedInputs(false);
      } catch (error) {
        console.log("Fetching GPT error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleAddAdvancedInput = (id) => {
      const newInputs = tempCustomerInputs.map((input) => {
        if (input?.id === id) {
          const newAdvancedInputs = [
            ...input.advancedInputs,
            {
              localGrowthRate: "",
              eventBeginMonth: "",
              eventEndMonth: "",
              eventName: "",
            },
          ];
          return { ...input, advancedInputs: newAdvancedInputs };
        }
        return input;
      });
      setTempCustomerInputs(newInputs);
    };

    const handleRemoveAdvancedInput = (id, index) => {
      const newInputs = tempCustomerInputs.map((input) => {
        if (input?.id === id) {
          const newAdvancedInputs = input.advancedInputs.filter(
            (advInput, advIndex) => advIndex !== index
          );
          return { ...input, advancedInputs: newAdvancedInputs };
        }
        return input;
      });
      setTempCustomerInputs(newInputs);
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
          "Channel Name",
          ...Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startingMonth + i - 1) % 12;
            const year =
              startingYear + Math.floor((startingMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          }),
        ],
      ];

      // Add rows for each channel
      customerTableData.forEach((record) => {
        const row = [record.channelName];
        for (let i = 1; i <= numberOfMonths; i++) {
          row.push(record[`month${i}`] || "");
        }
        worksheetData.push(row);
      });

      // Convert data to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      console.log("worksheetData", worksheetData);
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workBook, worksheet, "Customer Data");

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
        "customer_data.xlsx"
      );
    };

    const downloadJSON = () => {
      const updateCustomerInputs = tempCustomerInputs.map((input) => {
        const monthIndexStart =
          (Number(startingMonth) + Number(input.beginMonth) - 2) % 12;

        const yearStart =
          Number(startingYear) +
          Math.floor(
            (Number(startingMonth) + Number(input.beginMonth) - 2) / 12
          );

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
        customerInputs: updateCustomerInputs,
        customerTableData,
      };

      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      saveAs(jsonBlob, "customer_data.json");
    };

    return (
      <div>
        <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm NOsticky NOtop-8 z-50">
          <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
            <li
              className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                activeTab === "table&chart" ? "bg-yellow-300 font-bold" : ""
              } `}
              onClick={() => handleTabChange("table&chart")}
            >
              Table and Chart
            </li>
            {/* Repeat for other tabs */}
            <li
              className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                activeTab === "input" ? "bg-yellow-300 font-bold" : ""
              } `}
              onClick={() => handleTabChange("input")}
            >
              Input
            </li>
          </ul>
        </div>
        <div className="w-full h-full flex flex-col lg:flex-row">
          {activeTab === "table&chart" && (
            <>
              <div className="w-full xl:w-3/4 sm:p-4 p-0 ">
                <h3 className="text-lg font-semibold mb-8">Customer Chart</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {customerGrowthChart.charts?.map((chart, index) => (
                    <Card
                      key={index}
                      className="flex flex-col transition duration-500 rounded-2xl relative"
                    >
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(event) => handleChartClick(chart, event)}
                          className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                        >
                          <FullscreenOutlined />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="min-w-[10vw] mb-2">
                          <label htmlFor="startMonthSelect">Start Month:</label>
                          <select
                            id="startMonthSelect"
                            value={chartStartMonth}
                            onChange={(e) =>
                              setChartStartMonth(
                                Math.max(
                                  1,
                                  Math.min(e.target.value, chartEndMonth)
                                )
                              )
                            }
                            className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                          >
                            {Array.from({ length: numberOfMonths }, (_, i) => {
                              const monthIndex = (startingMonth + i - 1) % 12;
                              const year =
                                startingYear +
                                Math.floor((startingMonth + i - 1) / 12);
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
                            className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                          >
                            {Array.from({ length: numberOfMonths }, (_, i) => {
                              const monthIndex = (startingMonth + i - 1) % 12;
                              const year =
                                startingYear +
                                Math.floor((startingMonth + i - 1) / 12);
                              return (
                                <option key={i + 1} value={i + 1}>
                                  {`${months[monthIndex]}/${year}`}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <Chart
                        options={{
                          ...chart.options,
                          fill: {
                            type: "gradient",
                            gradient: {
                              shade: "light",
                              shadeIntensity: 0.5,
                              opacityFrom: 0.75,
                              opacityTo: 0.65,
                              stops: [0, 90, 100],
                            },
                          },
                          xaxis: {
                            ...chart.options.xaxis,
                            // tickAmount: 12, // Set the number of ticks on the x-axis to 12
                          },
                          stroke: {
                            width: 1,
                            curve: "straight", // Set the stroke width to 1
                          },
                        }}
                        series={chart.series}
                        type="area"
                        height={350}
                      />
                    </Card>
                  ))}

                  {customerGrowthChart.chartsNoFilter?.map((chart, index) => (
                    <Card
                      key={index}
                      className="flex flex-col transition duration-500 rounded-2xl"
                    >
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(event) => handleChartClick(chart, event)}
                          className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                        >
                          <FullscreenOutlined />
                        </button>
                      </div>
                      <Chart
                        options={{
                          ...chart.options,
                          chart: {
                            ...customerGrowthChart.options.chart,
                          },
                          xaxis: {
                            ...chart.options.xaxis,
                            // tickAmount: 12, // Set the number of ticks on the x-axis to 12
                          },
                          stroke: {
                            width: 1, // Set the stroke width to 1
                          },
                        }}
                        series={chart.series}
                        type="area"
                        height={350}
                        // onClick={(event) => handleChartClick(chart, event)}
                      />
                    </Card>
                  ))}
                </div>
                <AntdModal
                  open={isChartModalVisible}
                  footer={null}
                  centered
                  onCancel={() => setIsChartModalVisible(false)}
                  width="90%"
                  style={{ top: 20 }}
                >
                  {selectedChart && (
                    <Chart
                      options={{
                        ...selectedChart.options,
                        // ... other options
                      }}
                      className="p-4"
                      series={selectedChart.series}
                      type="area"
                      height={500}
                    />
                  )}
                </AntdModal>
                <span>
                  <div className="flex justify-between items-center my-4">
                    <h3 className="text-lg font-semibold">Customer Table</h3>
                    <button
                      onClick={downloadExcel}
                      className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl min-w-[6vw] "
                    >
                      <DownloadOutlined className="mr-1" />
                      Download Excel
                    </button>
                    <button
                      onClick={downloadJSON}
                      className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl min-w-[6vw] "
                    >
                      <DownloadOutlined className="mr-1" />
                      Download JSON
                    </button>
                  </div>
                  <div>
                    <label
                      htmlFor="selectedChannel"
                      className="block my-4 text-base darkTextWhite"
                    ></label>
                    <select
                      id="selectedChannel"
                      className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                      value={renderCustomerForm}
                      onChange={(e) => setRenderCustomerForm(e.target.value)}
                    >
                      <option value="all">All</option>
                      {tempCustomerInputs.map((input) => (
                        <option key={input?.id} value={input?.id}>
                          {input?.channelName}
                        </option>
                      ))}
                    </select>
                  </div>
                </span>

                <Table
                  className="bg-white overflow-auto  my-8 rounded-md"
                  size="small"
                  dataSource={customerTableData}
                  columns={customerColumns}
                  pagination={false}
                  bordered
                  rowClassName={(record) =>
                    record.key === record.channelName ? "font-bold" : ""
                  }
                />
              </div>
              <div className="w-full xl:w-1/4 sm:p-4 p-0   ">
                {/* <Flowise prompt={generatePromptC()} button={"Send"} /> */}
                <button
                  className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] "
                  style={{ bottom: "20px", right: "80px", position: "fixed" }}
                  onClick={handleSave}
                >
                  {isLoading ? (
                    <SpinnerBtn />
                  ) : (
                    <>
                      <CheckCircleOutlined
                        style={{
                          fontSize: "12px",
                          color: "#FFFFFF",
                          marginRight: "4px",
                        }}
                      />
                      Save
                    </>
                  )}
                </button>
              </div>
            </>
          )}
          {activeTab === "input" && (
            <>
              <div className="w-full xl:w-3/4 sm:p-4 p-0 "> </div>

              <div className="w-full xl:w-1/4 sm:p-4 p-0   ">
                <CustomerInputsForm
                  tempCustomerInputs={tempCustomerInputs}
                  renderCustomerForm={renderCustomerForm}
                  setRenderCustomerForm={setRenderCustomerForm}
                  handleInputChange={handleInputChange}
                  formatNumber={formatNumber}
                  parseNumber={parseNumber}
                  handleAddNewCustomer={handleAddNewCustomer}
                  handleSave={handleSave}
                  handleFetchGPT={handleFetchGPT}
                  isLoading={isLoading}
                  showAdvancedInputs={showAdvancedInputs}
                  setShowAdvancedInputs={setShowAdvancedInputs}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  confirmDelete={confirmDelete}
                />
              </div>

              {/* <div className="xl:hidden block">
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
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FileOutlined />}
                  />
                </FloatButton>
              </div> */}

              {isInputFormOpen && (
                <Modal
                  open={isInputFormOpen}
                  onCancel={() => {
                    setTempCustomerInputs(customerInputs);
                    setIsInputFormOpen(false);
                  }}
                  centered={true}
                  zIndex={50}
                  footer={null}
                >
                  <CustomerInputsForm
                    tempCustomerInputs={tempCustomerInputs}
                    renderCustomerForm={renderCustomerForm}
                    setRenderCustomerForm={setRenderCustomerForm}
                    formatNumber={formatNumber}
                    parseNumber={parseNumber}
                    handleAddNewCustomer={handleAddNewCustomer}
                    handleSave={handleSave}
                    handleFetchGPT={handleFetchGPT}
                    isLoading={isLoading}
                    showAdvancedInputs={showAdvancedInputs}
                    setShowAdvancedInputs={setShowAdvancedInputs}
                    isDeleteModalOpen={isDeleteModalOpen}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    confirmDelete={confirmDelete}
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
            </>
          )}
        </div>
      </div>
    );
  }
);

export default CustomerSection;
