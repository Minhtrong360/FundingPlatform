import React, { useEffect, useState } from "react";

import { Input } from "../../../components/ui/input";
import { Modal, Table, Tooltip, message, Checkbox } from "antd";
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
} from "../../../components/ui/select";
import { useParams } from "react-router-dom";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DraggableChart from "./DraggableChart";
import { setInputData } from "../../../features/DurationSlice";

import { Badge } from "../../../components/ui/badge";

import {
  Card,
  CardContent, CardHeader
} from "../../../components/ui/card";

const CustomerInputsForm = React.memo(
  ({
    tempCustomerInputs,
    setTempCustomerInputs,
    renderCustomerForm,
    setRenderCustomerForm,
    handleInputChange,
    formatNumber,
    parseNumber,
    handleAddNewCustomer,
    handleSave,
    isLoading,
    setIsDeleteModalOpen,
    tempCustomerGrowthData,
  }) => {
    const [isModalCustomOpen, setIsModalCustomOpen] = useState(false);
    const [temporaryData, setTemporaryData] = useState([]);
    const [temporaryBeginMonth, setTemporaryBeginMonth] = useState([]);
    const [temporaryEndMonth, setTemporaryEndMonth] = useState([]);

    useEffect(() => {
      const input = tempCustomerInputs.find(
        (input) => input?.id == renderCustomerForm
      );

      if (input) {
        setTemporaryData(
          input?.gptResponseArray?.length
            ? input?.gptResponseArray.map((value, index) => ({
                month: `Month ${index + 1}`,
                customers: value,
              }))
            : tempCustomerGrowthData
                .find((data) => data[0]?.channelName === input.channelName)
                ?.map((monthData, index) => ({
                  month: `Month ${index + 1}`,
                  customers: monthData.add,
                })) || []
        );
        handleInputChange(
          input?.id,
          "gptResponseArray",
          input?.gptResponseArray?.length
            ? input?.gptResponseArray
            : tempCustomerGrowthData
                .find((data) => data[0]?.channelName === input.channelName)
                ?.map((monthData) => monthData.add) || []
        );
        setTemporaryBeginMonth(input?.beginMonth);
        setTemporaryEndMonth(input?.endMonth);
      }
    }, [renderCustomerForm]);

    const handleApply = () => {
      const input = tempCustomerInputs.find(
        (input) => input?.id == renderCustomerForm
      );
      console.log("temporaryData", temporaryData);
      if (input) {
        // Update gptResponseArray and applyCustom first and ensure state update is completed before next update
        setTempCustomerInputs((prevInputs) => {
          const newInputs = prevInputs.map((i) => {
            if (i?.id === input?.id) {
              return {
                ...i,
                gptResponseArray: temporaryData.map((item) => item.customers),
                applyCustom: true,
              };
            }
            return i;
          });
          // After updating gptResponseArray and applyCustom, update customersPerMonth
          const updatedInputs = newInputs.map((i) => {
            if (i?.id === input?.id) {
              return {
                ...i,
                customersPerMonth: Number(
                  temporaryData[0]?.customers?.toFixed(0)
                ),
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
            className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
                  disabled={input.applyCustom}
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
                  disabled={input.applyCustom}
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
                  disabled={input.applyCustom}
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
                  onChange={(e) => {
                    handleInputChange(input?.id, "beginMonth", e.target.value);
                    setTemporaryBeginMonth(e.target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">End Month:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="number"
                  min={1}
                  value={input.endMonth}
                  onChange={(e) => {
                    handleInputChange(input?.id, "endMonth", e.target.value);
                    setTemporaryEndMonth(e.target.value);
                  }}
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

              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={input.applyCustom}
                  onChange={(e) => {
                    handleInputChange(
                      input?.id,
                      "applyCustom",
                      e.target.checked
                    );
                  }}
                ></Checkbox>
                <span
                  className="text-sm hover:cursor-pointer"
                  onClick={() => setIsModalCustomOpen(true)}
                >
                  Apply Custom
                </span>
              </div>
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
  ({ numberOfMonths, customerGrowthChart, setCustomerGrowthChart }) => {
    const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
    const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

    const handleChartClick = (chart, event) => {
      const toolbar = document.querySelector(".apexcharts-toolbar");
      if (toolbar && toolbar.contains(event.target)) {
        return;
      }

      setSelectedChart(chart);
      setIsChartModalVisible(true);
    };
    const dispatch = useDispatch();
    const { customerInputs, customerGrowthData, customerTableData } =
      useSelector((state) => state.customer);

    const { startMonth, startYear, inputData } = useSelector(
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
        acquisitionCost: 0,
        adjustmentFactor: 1,
        eventName: "",
        additionalInfo: "",
        applyCustom: false, // Add this field
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

    const handleInputChange = (id, field, value, advancedIndex = null) => {
      if (field === "churnRate") {
        value = Math.max(0, Math.min(100, value));
      }

      const newInputs = tempCustomerInputs.map((input) => {
        if (input?.id === id) {
          if (field === "applyCustom" && value) {
            return { ...input, [field]: value }; // Initialize gptResponseArray
          }
          return { ...input, [field]: value };
        }
        return input;
      });
      setTempCustomerInputs(newInputs);
    };

    const [showCustomInputs, setShowCustomInputs] = useState(false);

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
    }, [tempCustomerInputs, renderCustomerForm, showCustomInputs]);

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

    const startingMonth = startMonth;
    const startingYear = startYear;

    const handleInputTable = (value, recordKey, monthKey) => {
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
                      onChange={(e) => {
                        handleInputChange(record?.id, "applyCustom", true);
                        handleInputTable(
                          parseNumber(e.target.value),
                          record.key,
                          `month${i + 1}`
                        );
                      }}
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
          const { user_email, collabs } = existingData[0];

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

          const updatedInputData = {
            ...inputData,
            channelInputs: updatedChannelInputs,
            customerInputs: tempCustomerInputs,
            yearlyAverageCustomers: averages,
            yearlySales: yearlySale,
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
        message.error(error.message);
      } finally {
        setIsLoading(false);
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
                                  
                  legend: {
                    show: false
                  }
  
                },

                xaxis: {
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: false,
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
                    fontSize: "14px",
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
                xaxis: {
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: false,
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
                    show: false,
                    tools: {
                      download: false,
                    },
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Yearly Total",
                },
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

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const confirmDelete = () => {
      removeCustomerInput(renderCustomerForm);
      setIsDeleteModalOpen(false);
    };

    const [activeTab, setActiveTab] = useState("table&chart");

    const handleTabChange = (tabName) => {
      setActiveTab(tabName);
    };

    const downloadExcel = () => {
      const workBook = XLSX.utils.book_new();

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

      customerTableData.forEach((record) => {
        const row = [record.channelName];
        for (let i = 1; i <= numberOfMonths; i++) {
          row.push(record[`month${i}`] || "");
        }
        worksheetData.push(row);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      XLSX.utils.book_append_sheet(workBook, worksheet, "Customer Data");

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

    const filteredTableData =
      renderCustomerForm !== "all"
        ? customerTableData.filter((record) => record.key !== "Total")
        : customerTableData;

    return (
      <div>
        <div className="flex space-x-2 my-6 mx-auto justify-center">
        <Badge
            variant="secondary"
            className={`bg-green-100 text-green-800 cursor-pointer ${activeTab === "table&chart" ? "bg-green-500 text-white" : ""}`}
            onClick={() => handleTabChange("table&chart")}
          >
            Tables and Charts
          </Badge>
          <Badge
            variant="secondary"
            className={`bg-yellow-100 text-yellow-800 cursor-pointer ${activeTab === "input" ? "bg-yellow-500 text-white" : ""}`}
            onClick={() => handleTabChange("input")}
          >
            Inputs
          </Badge>
          
        </div>
        <section className="w-full h-full flex flex-col lg:flex-row p-0 sm:p-4">
          {activeTab === "table&chart" && (
            <>
              <div className="w-full xl:w-3/4 sm:p-4 p-0 ">
                <h3 className="text-lg font-semibold mb-4">
                  I. Customer Chart
                </h3>

                <div className="ml-0 sm:ml-4 mb-20">
                  <h4 className="text-base font-semibold mb-4">
                    1. All channels chart
                  </h4>
                  {customerGrowthChart?.charts
                    ?.filter(
                      (chart) => chart?.options?.chart?.id === "allChannels"
                    )
                    .map((chart, index) => (
                      <>
                        <Card
                          key={index}
                          className="flex flex-col transition duration-500 rounded-2xl relative"
                        >
                          <CardHeader>
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={(event) =>
                                  handleChartClick(chart, event)
                                }
                                className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                              >
                                <FullscreenOutlined />
                              </button>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="min-w-[10vw] mb-2">
                                <label
                                  htmlFor="startMonthSelect"
                                  className="text-sm"
                                >
                                  Start Month:
                                </label>
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
                                  className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                >
                                  {Array.from(
                                    { length: numberOfMonths },
                                    (_, i) => {
                                      const monthIndex =
                                        (startingMonth + i - 1) % 12;
                                      const year =
                                        startingYear +
                                        Math.floor(
                                          (startingMonth + i - 1) / 12
                                        );
                                      return (
                                        <option key={i + 1} value={i + 1}>
                                          {`${months[monthIndex]}/${year}`}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                              <div className="min-w-[10vw] mb-2">
                                <label
                                  htmlFor="endMonthSelect"
                                  className="text-sm"
                                >
                                  End Month:
                                </label>
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
                                  className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                >
                                  {Array.from(
                                    { length: numberOfMonths },
                                    (_, i) => {
                                      const monthIndex =
                                        (startingMonth + i - 1) % 12;
                                      const year =
                                        startingYear +
                                        Math.floor(
                                          (startingMonth + i - 1) / 12
                                        );
                                      return (
                                        <option key={i + 1} value={i + 1}>
                                          {`${months[monthIndex]}/${year}`}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
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
                                },
                                stroke: {
                                  width: 1,
                                  curve: "straight",
                                },
                              }}
                              series={chart.series}
                              type="area"
                              height={350}
                            />
                          </CardContent>
                        </Card>
                      </>
                    ))}
                </div>
                <div className="ml-0 sm:ml-4 mb-20">
                  <h4 className="text-base font-semibold mb-4">
                    2. Component charts
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {customerGrowthChart?.charts
                      ?.filter(
                        (chart) => chart?.options?.chart?.id !== "allChannels"
                      )
                      .map((chart, index) => (
                        <div className="ml-2">
                          <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>
                          <Card
                            key={index}
                            className="flex flex-col transition duration-500 rounded-2xl relative"
                          >
                            <CardHeader>
                              <div className="absolute top-2 right-2">
                                <button
                                  onClick={(event) =>
                                    handleChartClick(chart, event)
                                  }
                                  className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                                >
                                  <FullscreenOutlined />
                                </button>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="min-w-[10vw] mb-2">
                                  <label
                                    htmlFor="startMonthSelect"
                                    className="text-sm"
                                  >
                                    Start Month:
                                  </label>
                                  <select
                                    id="startMonthSelect"
                                    value={chartStartMonth}
                                    onChange={(e) =>
                                      setChartStartMonth(
                                        Math.max(
                                          1,
                                          Math.min(
                                            e.target.value,
                                            chartEndMonth
                                          )
                                        )
                                      )
                                    }
                                    className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                  >
                                    {Array.from(
                                      { length: numberOfMonths },
                                      (_, i) => {
                                        const monthIndex =
                                          (startingMonth + i - 1) % 12;
                                        const year =
                                          startingYear +
                                          Math.floor(
                                            (startingMonth + i - 1) / 12
                                          );
                                        return (
                                          <option key={i + 1} value={i + 1}>
                                            {`${months[monthIndex]}/${year}`}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="min-w-[10vw] mb-2">
                                  <label
                                    htmlFor="endMonthSelect"
                                    className="text-sm"
                                  >
                                    End Month:
                                  </label>
                                  <select
                                    id="endMonthSelect"
                                    value={chartEndMonth}
                                    onChange={(e) =>
                                      setChartEndMonth(
                                        Math.max(
                                          chartStartMonth,
                                          Math.min(
                                            e.target.value,
                                            numberOfMonths
                                          )
                                        )
                                      )
                                    }
                                    className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                  >
                                    {Array.from(
                                      { length: numberOfMonths },
                                      (_, i) => {
                                        const monthIndex =
                                          (startingMonth + i - 1) % 12;
                                        const year =
                                          startingYear +
                                          Math.floor(
                                            (startingMonth + i - 1) / 12
                                          );
                                        return (
                                          <option key={i + 1} value={i + 1}>
                                            {`${months[monthIndex]}/${year}`}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
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
                                  },
                                  stroke: {
                                    width: 1,
                                    curve: "straight",
                                  },
                                }}
                                series={chart.series}
                                type="area"
                                height={350}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="ml-0 sm:ml-4 mb-20">
                  <h4 className="text-base font-semibold mb-4">
                    3. Advanced charts
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {customerGrowthChart?.chartsNoFilter?.map(
                      (chart, index) => (
                        <div className="ml-2">
                          <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>
                          <Card
                            key={index}
                            className="flex flex-col transition duration-500 rounded-2xl relative"
                          >
                            <CardHeader>
                              <div className="absolute top-2 right-2">
                                <button
                                  onClick={(event) =>
                                    handleChartClick(chart, event)
                                  }
                                  className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                                >
                                  <FullscreenOutlined />
                                </button>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="min-w-[10vw] mb-2">
                                  <label
                                    htmlFor="startMonthSelect"
                                    className="text-sm"
                                  >
                                    Start Month:
                                  </label>
                                  <select
                                    id="startMonthSelect"
                                    value={chartStartMonth}
                                    onChange={(e) =>
                                      setChartStartMonth(
                                        Math.max(
                                          1,
                                          Math.min(
                                            e.target.value,
                                            chartEndMonth
                                          )
                                        )
                                      )
                                    }
                                    className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                  >
                                    {Array.from(
                                      { length: numberOfMonths },
                                      (_, i) => {
                                        const monthIndex =
                                          (startingMonth + i - 1) % 12;
                                        const year =
                                          startingYear +
                                          Math.floor(
                                            (startingMonth + i - 1) / 12
                                          );
                                        return (
                                          <option key={i + 1} value={i + 1}>
                                            {`${months[monthIndex]}/${year}`}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                                <div className="min-w-[10vw] mb-2">
                                  <label
                                    htmlFor="endMonthSelect"
                                    className="text-sm"
                                  >
                                    End Month:
                                  </label>
                                  <select
                                    id="endMonthSelect"
                                    value={chartEndMonth}
                                    onChange={(e) =>
                                      setChartEndMonth(
                                        Math.max(
                                          chartStartMonth,
                                          Math.min(
                                            e.target.value,
                                            numberOfMonths
                                          )
                                        )
                                      )
                                    }
                                    className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark1:bg-slate-900 dark1:border-gray-700 dark1:text-gray-400 dark1:focus:ring-gray-600"
                                  >
                                    {Array.from(
                                      { length: numberOfMonths },
                                      (_, i) => {
                                        const monthIndex =
                                          (startingMonth + i - 1) % 12;
                                        const year =
                                          startingYear +
                                          Math.floor(
                                            (startingMonth + i - 1) / 12
                                          );
                                        return (
                                          <option key={i + 1} value={i + 1}>
                                            {`${months[monthIndex]}/${year}`}
                                          </option>
                                        );
                                      }
                                    )}
                                  </select>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
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
                                  },
                                  stroke: {
                                    width: 1,
                                    curve: "straight",
                                  },
                                }}
                                series={chart.series}
                                type="area"
                                height={350}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Modal
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
                      }}
                      className="p-4"
                      series={selectedChart.series}
                      type="area"
                      height={500}
                    />
                  )}
                </Modal>
                <span>
                  <h3 className="text-lg font-semibold mt-20 my-4">
                    II. Customer Table
                  </h3>

                  <div className="flex justify-between items-center">
                    <select
                      id="selectedChannel"
                      className="py-2 px-4 block w-80 border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                    <button
                      onClick={downloadExcel}
                      className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl min-w-[6vw] "
                    >
                      <DownloadOutlined className="mr-1" />
                      Download Excel
                    </button>
                  </div>
                </span>

                <Table
                  className="custom-table bg-white overflow-auto my-8 rounded-md"
                  size="small"
                  dataSource={filteredTableData}
                  columns={customerColumns}
                  pagination={false}
                  bordered={false} // Tắt border mặc định của antd
                  rowClassName={(record) =>
                    record.key === record.channelName ? "font-bold" : ""
                  }
                />
              </div>
              <div className="w-full xl:w-1/4 sm:p-4 p-0   ">
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
              <div className="w-full xl:w-3/4 sm:p-4 p-0 "></div>

              <div className="w-full xl:w-1/4 sm:p-4 p-0   ">
                <CustomerInputsForm
                  tempCustomerInputs={tempCustomerInputs}
                  setTempCustomerInputs={setTempCustomerInputs}
                  renderCustomerForm={renderCustomerForm}
                  setRenderCustomerForm={setRenderCustomerForm}
                  handleInputChange={handleInputChange}
                  formatNumber={formatNumber}
                  parseNumber={parseNumber}
                  handleAddNewCustomer={handleAddNewCustomer}
                  handleSave={handleSave}
                  isLoading={isLoading}
                  showCustomInputs={showCustomInputs}
                  setShowCustomInputs={setShowCustomInputs}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  confirmDelete={confirmDelete}
                  tempCustomerGrowthData={tempCustomerGrowthData}
                />
              </div>

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
        </section>
      </div>
    );
  }
);

export default CustomerSection;
