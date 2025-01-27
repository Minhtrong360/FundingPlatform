import React, { useCallback, useEffect, useState } from "react";

import { Input } from "../../../components/ui/input";
import {
  Card,
  Modal,
  Table,
  Tooltip,
  message,
  Checkbox,
  FloatButton,
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
import { FileOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DraggableChart from "./DraggableChart";
import { setInputData } from "../../../features/DurationSlice";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { Check, Download, Plus, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import {
  Card as CardShadcn,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";
import { debounce } from "lodash";
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
import { ItemIndicator } from "@radix-ui/react-select";

const CustomerInputsForm = React.memo(
  ({
    tempCustomerInputs,
    setTempCustomerInputs,
    renderCustomerForm,
    handleCustomerInputChange,
    formatNumber,
    parseNumber,
    handleAddNewCustomer,
    handleSave,
    isLoading,
    setIsDeleteModalOpen,
    tempCustomerGrowthData,
    numberOfMonths,
  }) => {
    const [isModalCustomOpen, setIsModalCustomOpen] = useState(false);
    const [temporaryData, setTemporaryData] = useState([]);
    const [temporaryBeginMonth, setTemporaryBeginMonth] = useState([]);
    const [temporaryEndMonth, setTemporaryEndMonth] = useState([]);
    useEffect(() => {
      const input = tempCustomerInputs.find(
        (input) => input?.id == renderCustomerForm
      );

      if (input && isModalCustomOpen) {
        setTemporaryData(
          tempCustomerGrowthData
            .find((data) => data[0]?.channelName === input.channelName)
            ?.map((monthData, index) => ({
              month: `Month ${index + 1}`,
              customers: monthData.add,
            })) || []
        );
        handleCustomerInputChange(
          input?.id,
          "gptResponseArray",
          tempCustomerGrowthData
            .find((data) => data[0]?.channelName === input.channelName)
            ?.map((monthData) => monthData.add) || []
        );
        setTemporaryBeginMonth(input?.beginMonth);
        setTemporaryEndMonth(input?.endMonth);
      }
    }, [renderCustomerForm, isModalCustomOpen]);

    const handleApply = () => {
      const input = tempCustomerInputs.find(
        (input) => input?.id == renderCustomerForm
      );
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
          const updatedInputs = newInputs?.map((i) => {
            if (i?.id === input?.id) {
              return {
                ...i,
                customersPerMonth: Number(temporaryData[0]?.customers)?.toFixed(
                  0
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

    const [debouncedInputs, setDebouncedInputs] = useState(tempCustomerInputs);
    // Thêm useEffect để đồng bộ hóa debouncedInputs khi tempFundraisingInputs thay đổi
    useEffect(() => {
      setDebouncedInputs(tempCustomerInputs);
    }, [tempCustomerInputs]);
    // Debounced function to update state after 1 second
    const debouncedHandleInputChange = useCallback(
      debounce((id, field, value) => {
        handleCustomerInputChange(id, field, value);
      }, 1000),
      [handleCustomerInputChange]
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

    return (
      <section
        aria-labelledby="customers-heading"
        className="mb-8 NOsticky NOtop-8"
      >
        {/* <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="customers-heading"
          >
            Customer channel
          </h2>
        </Tooltip> */}

        {debouncedInputs
          .filter((input) => input?.id == renderCustomerForm)
          .map((input) => (
            <div
              key={input?.id}
              className="bg-white rounded-md p-6 border mb-4"
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
                  <SelectContent position="popper" className="bg-white">
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Begin Month:</span>
                <Select
                  value={input.beginMonth}
                  onValueChange={(value) => {
                    handleInputChange(input?.id, "beginMonth", value);
                    setTemporaryBeginMonth(value);
                  }}
                >
                  <SelectTrigger className="col-start-2 border-gray-300 w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startingMonth + i - 1) % 12;
                      const year =
                        startingYear + Math.floor((startingMonth + i - 1) / 12);
                      return (
                        <SelectItem key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">End Month:</span>
                <Select
                  value={input.endMonth}
                  onValueChange={(value) => {
                    handleInputChange(input?.id, "endMonth", value);
                    setTemporaryEndMonth(value);
                  }}
                >
                  <SelectTrigger className="col-start-2 border-gray-300 w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startingMonth + i - 1) % 12;
                      const year =
                        startingYear + Math.floor((startingMonth + i - 1) / 12);
                      return (
                        <SelectItem key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
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
              {/* <div className="grid grid-cols-2 gap-4 mb-3">
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
              </div> */}

              <div className="flex items-center gap-2 mb-3">
                <Checkbox
                  checked={input.applyCustom}
                  onChange={(e) => {
                    handleCustomerInputChange(
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
                  Custom Input
                </span>
              </div>
              {isModalCustomOpen && (
                <Modal
                  zIndex={42424244}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="destructive"
            onClick={handleAddNewCustomer}
            style={{ backgroundColor: "#18181B", color: "white" }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
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
  }
);

const CustomerSection = React.memo(
  ({ numberOfMonths, customerGrowthChart, setCustomerGrowthChart }) => {
    const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
    const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart
    const [chartStartMonth, setChartStartMonth] = useState(1);
    const [chartEndMonth, setChartEndMonth] = useState(6);

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
        channelName: `New channel ${tempCustomerInputs?.length + 1}`,
        beginMonth: 1,
        endMonth: 15,
        beginCustomer: 0,
        churnRate: 0,
        acquisitionCost: 0,
        adjustmentFactor: 1,
        eventName: "",
        additionalInfo: "",
        applyCustom: false,
      };

      setTempCustomerInputs((prevInputs) => {
        const updatedInputs = [...prevInputs, newCustomer];
        setRenderCustomerForm(newId.toString()); // Cập nhật renderCustomerForm ngay sau khi inputs được cập nhật
        return updatedInputs;
      });
      message.success("Add new customer successfully.");
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

    const handleCustomerInputChange = (
      id,
      field,
      value,
      advancedIndex = null
    ) => {
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
      const timer = setTimeout(() => {
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

        // Sử dụng setTimeout để setIsLoading(false) sau 2 giây

        setIsLoading(false);
      }, 500);

      // Cleanup function để clear timeout khi component unmount
      return () => clearTimeout(timer);
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
          dataIndex: `month${chartStartMonth + i}`,
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
              ? `Local Growth Rate: ${growthRate}\nEvent: ${eventName}`
              : "";

            const cellStyle = isInEvent ? { backgroundColor: "yellow" } : {};

            if (record.key.includes("-add")) {
              return (
                <Tooltip title={tooltipTitle} placement="topLeft">
                  <div style={cellStyle}>
                    <input
                      className="border-white p-0 text-sm text-right w-full h-full rounded-none"
                      value={record[`month${i + 1}`]}
                      onChange={(e) => {
                        handleCustomerInputChange(
                          record?.id,
                          "applyCustom",
                          true
                        );
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
        const netCustomerAdd = channelData
          .slice(startIdx, endIdx)
          .map((data) => parseInt(data.add, 10) - parseInt(data.churn, 10));

        return {
          name: channelData[0]?.channelName || "Unknown Channel",
          dataNetAdd: netCustomerAdd,
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
        console.log("yearlyTotalData", yearlyTotalData);
        console.log("total", total);
        console.log("arr[index - 1]", arr[index - 1]);
        if (index === 0) return 0;
        return ((total - arr[index - 1]) / arr[index - 1]) * 100;
      });

      const totalNetCustomerPerMonth = seriesData.reduce((acc, channel) => {
        channel.dataNetAdd.forEach((netAdd, index) => {
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += netAdd;
        });
        return acc;
      }, []);

      // Calculate pie chart data (dạng quạt)
      const totalEndCustomersByChannel = seriesData.map((channel) => ({
        name: channel.name,
        value: channel.dataEnd.reduce((sum, endVal) => sum + endVal, 0),
      }));

      const pieChartSeries = totalEndCustomersByChannel.map(
        (channel) => channel.value
      );
      const pieChartLabels = totalEndCustomersByChannel.map(
        (channel) => channel.name
      );

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
                  type: "area",

                  legend: {
                    show: false,
                  },
                },

                xaxis: {
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: false,
                    rotate: 0,
                    style: {
                      fontFamily: "Raleway Variable, sans-serif",
                      fontWeight: 500,
                    },
                  },
                  categories: filteredCategories,
                },
                title: {
                  ...prevState.options.title,
                  text: "All Channels",
                  style: {
                    fontSize: "14px",
                    fontFamily: "Raleway Variable, sans-serif",
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
            {
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
                      fontFamily: "Raleway Variable, sans-serif",
                      fontWeight: 500,
                    },
                  },
                  categories: filteredCategories,
                },
                title: {
                  ...prevState.options.title,
                  text: "All Channels - Net Customers",
                  style: {
                    fontSize: "14px",
                    fontFamily: "Raleway Variable, sans-serif",
                  },
                },
              },
              series: [
                {
                  name: "Net Customers",
                  data: totalNetCustomerPerMonth,
                },
              ],
            },
            ...seriesData.flatMap((channelSeries) => [
              {
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
                        fontFamily: "Raleway Variable, sans-serif",
                        fontWeight: 500,
                      },
                    },
                    categories: filteredCategories,
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
              },
              {
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
                        fontFamily: "Raleway Variable, sans-serif",
                        fontWeight: 500,
                      },
                    },
                    categories: filteredCategories,
                  },
                  title: {
                    ...prevState.options.title,
                    text: `${channelSeries.name} - Net Customers`,
                  },
                },
                series: [
                  {
                    name: "Net Customers",
                    data: channelSeries.dataNetAdd,
                  },
                ],
              },
            ]),
          ],
          chartsNoFilter: [
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "yearlyTotal",
                  type: "bar",

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
                  text: "Total Customers",
                  style: {
                    fontFamily: "Raleway Variable, sans-serif",
                    fontSize: "13px",
                  },
                },
                xaxis: {
                  ...prevState.options.xaxis,
                  labels: {
                    show: true,
                    rotate: 0,
                    style: {
                      fontFamily: "Raleway Variable, sans-serif",
                      fontWeight: 500,
                    },
                  },
                  categories: Array.from(
                    { length: yearlyTotalData.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ),
                },
                yaxis: {
                  min: 0, // Đặt giá trị tối thiểu của trục Oy là 0
                  labels: {
                    formatter: (value) => `${formatNumber(value.toFixed(0))}`,
                    style: {
                      fontFamily: "Raleway Variable, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                    },
                  },
                },
              },
              series: [
                {
                  name: "Total Customers",
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
                  type: "bar",

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
                  text: "Growth Rate",
                  style: {
                    fontFamily: "Raleway Variable, sans-serif",
                    fontSize: "13px",
                  },
                },
                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: yearlyGrowthRates.length - 1 },
                    (_, i) => {
                      const year = startYear + i + 1;
                      return `${year}`;
                    }
                  ),
                },
                yaxis: {
                  min: 0, // Đặt giá trị tối thiểu của trục Oy là 0
                  labels: {
                    formatter: (value) => `${formatNumber(value.toFixed(0))}`,
                    style: {
                      fontFamily: "Raleway Variable, sans-serif",
                      fontWeight: 500,
                      fontSize: "13px",
                    },
                  },
                },
              },
              series: [
                {
                  name: "Growth Rate (%)",
                  data: yearlyGrowthRates?.slice(1, yearlyGrowthRates.length),
                },
              ],
            },
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "channelYearlyTotals",
                  type: "bar",
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
                  text: "Customers By Channel",
                  style: {
                    fontSize: "13px",
                    fontFamily: "Raleway Variable, sans-serif",
                  },
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
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "distribution",
                  stacked: false,
                  type: "pie",
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                    },
                  },
                },
                labels: pieChartLabels, // Labels for pie chart
                title: {
                  text: "Distribution",
                  style: {
                    fontSize: "13px",
                    fontFamily: "Raleway Variable, sans-serif",
                  },
                },
                legend: {
                  position: "bottom",
                  horizontalAlign: "right",
                  fontFamily: "Raleway Variable, sans-serif",
                  fontWeight: 500,
                  fontSize: "13px",
                },
              },
              series: pieChartSeries, // Series (data) for pie chart
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

    const downloadExcel = () => {
      const workBook = XLSX.utils.book_new();

      const worksheetData = [
        [
          "Channel Name",
          ...Array.from(
            { length: chartEndMonth - chartStartMonth + 1 },
            (_, i) => {
              const monthIndex =
                (chartStartMonth - 1 + startingMonth + i - 1) % 12;
              const year =
                startingYear +
                Math.floor((chartStartMonth - 1 + startingMonth + i - 1) / 12);
              return `${months[monthIndex]}/${year}`;
            }
          ),
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

    const handleRenderFormChange = (e) => {
      setIsLoading(true);
      setRenderCustomerForm(e);
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
    const [metrics, setMetrics] = useState([
      {
        key: "existingCustomers",
        title: "Existing Customers",
        value: "",
        change: "",
        icon: Users,
      },
      {
        key: "numberOfChannels",
        title: "Number of Channels",
        value: "",
        change: "",
        icon: MessageSquare,
      },
      {
        key: "previousMonthUsers",
        title: "First Month Users",
        value: "",
        change: "",
        icon: Users,
      },
      {
        key: "addedUsers",
        title: "Added Users",
        value: "",
        change: "",
        icon: UserPlus,
      },
      {
        key: "churnedUsers",
        title: "Churned Users",
        value: "",
        change: "",
        icon: UserMinus,
      },
      {
        key: "totalUsers",
        title: "Total Users",
        value: "",
        change: "",
        icon: Users,
      },
    ]);

    // Function to simplify data extraction
    const extractData = (data, keyPrefix, startMonth, endMonth) => {
      return Object.keys(data)
        .filter((key) => key.startsWith(keyPrefix))
        .slice(startMonth - 1, endMonth)
        .reduce((sum, monthKey) => sum + parseNumber(data[monthKey]), 0);
    };

    // Function to calculate metric changes
    const calculateChange = (startValue, endValue) => {
      if (startValue === 0) return 0;
      return ((endValue - startValue) / startValue) * 100;
    };

    // Simplified useEffect for calculating metrics and filtering data
    useEffect(() => {
      if (renderCustomerForm === "all") {
        // Handle "all" case: sum values across all channels
        const filtered = customerTableData?.filter(
          (data) =>
            data.key.includes("-start") ||
            data.key.includes("-add") ||
            data.key.includes("-begin") ||
            data.key.includes("-churn") ||
            data.key.includes("-end")
        );

        let existingCustomersTotal = 0;
        let addedUsersTotal = 0;
        let beginUsersTotal = 0; // Initialize beginUsersTotal
        let churnedUsersTotal = 0;
        let totalUsersTotal = 0;

        // Loop through filtered data to calculate totals
        filtered.forEach((row) => {
          const value = parseNumber(row[`month${chartEndMonth}`] || 0);
          if (row.key.includes("-start")) {
            existingCustomersTotal += extractData(
              row,
              "month",
              chartStartMonth,
              chartEndMonth
            );
          } else if (row.key.includes("-add")) {
            addedUsersTotal += extractData(
              row,
              "month",
              chartStartMonth,
              chartEndMonth
            );
          } else if (row.key.includes("-begin")) {
            beginUsersTotal += parseNumber(row[`month${chartStartMonth}`] || 0); // Calculate beginUsersTotal
          } else if (row.key.includes("-churn")) {
            churnedUsersTotal += extractData(
              row,
              "month",
              chartStartMonth,
              chartEndMonth
            );
          } else if (row.key.includes("-end")) {
            totalUsersTotal += value;
          }
        });

        const addedUsersChange = calculateChange(
          filtered
            .filter((row) => row.key.includes("-add"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartStartMonth}`]),
              0
            ),
          filtered
            .filter((row) => row.key.includes("-add"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartEndMonth}`]),
              0
            )
        );

        const churnedUsersChange = calculateChange(
          filtered
            .filter((row) => row.key.includes("-churn"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartStartMonth}`]),
              0
            ),
          filtered
            .filter((row) => row.key.includes("-churn"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartEndMonth}`]),
              0
            )
        );

        const totalUsersChange = calculateChange(
          filtered
            .filter((row) => row.key.includes("-end"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartStartMonth}`]),
              0
            ),
          filtered
            .filter((row) => row.key.includes("-end"))
            .reduce(
              (acc, curr) => acc + parseNumber(curr[`month${chartEndMonth}`]),
              0
            )
        );

        setMetrics((prevMetrics) => [
          {
            ...prevMetrics[0],
            value: formatNumber(existingCustomersTotal),
            change: `+0%`,
          },
          { ...prevMetrics[1], value: tempCustomerInputs.length, change: "" },
          { ...prevMetrics[2], value: beginUsersTotal, change: "" }, // Update beginUsersTotal
          {
            ...prevMetrics[3],
            value: formatNumber(addedUsersTotal),
            change: `${addedUsersChange.toFixed(2)}`,
          },
          {
            ...prevMetrics[4],
            value: formatNumber(churnedUsersTotal),
            change: `${churnedUsersChange.toFixed(2)}`,
          },
          {
            ...prevMetrics[5],
            value: formatNumber(totalUsersTotal),
            change: `${totalUsersChange.toFixed(2)}`,
          },
        ]);
      } else {
        // Handle specific channel case (based on ID)
        const selectedData = tempCustomerInputs.find(
          (input) => input.id == renderCustomerForm
        );

        const filtered = customerTableData?.filter((data) =>
          data?.channelName?.includes(selectedData?.channelName)
        );

        if (filtered.length > 0 && customerTableData.length > 0) {
          const existingCustomersData = filtered.find((row) =>
            row.key.includes("-start")
          );
          const addedUsersData = filtered.find((row) =>
            row.key.includes("-add")
          );
          const beginUsersData = filtered.find((row) =>
            row.key.includes("-begin")
          );

          const churnedUsersData = filtered.find((row) =>
            row.key.includes("-churn")
          );
          const totalUsersData = filtered.find((row) =>
            row.key.includes("-end")
          );
          const existingCustomers = extractData(
            existingCustomersData,
            "month",
            chartStartMonth,
            chartEndMonth
          );

          const addedUsers = extractData(
            addedUsersData,
            "month",
            chartStartMonth,
            chartEndMonth
          );
          const beginUsers = beginUsersData[`month${chartStartMonth}`];

          const churnedUsers = extractData(
            churnedUsersData,
            "month",
            chartStartMonth,
            chartEndMonth
          );
          const totalUsers = parseNumber(
            totalUsersData[`month${chartEndMonth}`] || 0
          );

          const addedUsersChange = calculateChange(
            parseNumber(addedUsersData[`month${chartStartMonth}`]),
            parseNumber(addedUsersData[`month${chartEndMonth}`])
          );
          const churnedUsersChange = calculateChange(
            parseNumber(churnedUsersData[`month${chartStartMonth}`]),
            parseNumber(churnedUsersData[`month${chartEndMonth}`])
          );
          const totalUsersChange = calculateChange(
            parseNumber(totalUsersData[`month${chartStartMonth}`]),
            parseNumber(totalUsersData[`month${chartEndMonth}`])
          );

          setMetrics((prevMetrics) => [
            {
              ...prevMetrics[0],
              value: formatNumber(existingCustomers),
              change: 0,
            },
            { ...prevMetrics[1], value: tempCustomerInputs.length, change: "" },
            { ...prevMetrics[2], value: beginUsers, change: "" },
            {
              ...prevMetrics[3],
              value: formatNumber(addedUsers),
              change: `${addedUsersChange.toFixed(2)}`,
            },
            {
              ...prevMetrics[4],
              value: formatNumber(churnedUsers),
              change: `${churnedUsersChange.toFixed(2)}`,
            },
            {
              ...prevMetrics[5],
              value: formatNumber(totalUsers),
              change: `${formatNumber(totalUsersChange.toFixed(2))}`,
            },
          ]);
        }
      }
    }, [
      chartStartMonth,
      chartEndMonth,
      renderCustomerForm,
      tempCustomerInputs,
      customerTableData,
    ]);

    const renderValue =
      tempCustomerInputs.find((item) => item.id == renderCustomerForm) || "all";

    return (
      <div className="w-full h-full flex flex-col lg:flex-row p-4">
        <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
          {/* Phần Metrics được thêm vào đây */}
          {/* <h2 className="text-lg font-semibold">
            I. Metrics (Under Constructions)
          </h2> */}

          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
              <Select
                value={renderValue.id ? renderValue.id : "all"}
                onValueChange={(e) => {
                  handleRenderFormChange(e);
                }}
                className="w-full md:w-auto min-w-[10rem]"
              >
                <SelectTrigger className="w-full md:w-auto min-w-[10rem]">
                  <SelectValue placeholder="Offline">
                    {renderValue?.channelName}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full md:w-auto min-w-[10rem]">
                  <SelectItem value="all">All</SelectItem>
                  {tempCustomerInputs.map((input) => (
                    <SelectItem key={input?.id} value={input?.id}>
                      {input?.channelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col md:!mt-0 !mt-2">
                {/* Bộ chọn khoảng thời gian */}

                <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                  <div className="min-w-[9vw] w-full flex flex-row sm:!mr-0 !mr-1">
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
                  <label
                    htmlFor="endMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    -
                  </label>
                  <div className="min-w-[9vw] w-full flex flex-row sm:!ml-0 !ml-1">
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
                      {metrics.map((metric, index) => (
                        <div
                          key={index}
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
                          {metric.change
                            ? `${
                                metric.change
                                  ? `${metric.change}% from last period`
                                  : ""
                              }`
                            : ""}
                        </p>
                      </CardContent>
                    </CardShadcn>
                  )
              )}
            </div>
          </section>

          {/* <h3 className="text-lg font-semibold mb-4">II. Customer Chart</h3> */}
          <div className="grid md:grid-cols-2 gap-6">
            {renderCustomerForm === "all" &&
              customerGrowthChart?.charts.map((chart, index) => (
                <div key={index} className="my-4">
                  <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>

                  <CardShadcn
                    key={index}
                    className="flex flex-col transition duration-500 !rounded-md relative"
                  >
                    <CardHeader>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-50"
                        onClick={(event) => handleChartClick(chart, event)}
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
                        type={
                          chart?.options?.chart?.type
                            ? chart?.options?.chart?.type
                            : "area"
                        }
                        height={350}
                      />
                    </CardContent>
                  </CardShadcn>
                </div>
              ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {customerGrowthChart?.charts
              ?.filter(
                (chart) =>
                  chart?.options?.chart?.id !== "allChannels" &&
                  chart?.options?.title?.text
                    ?.toLowerCase()
                    ?.includes(
                      tempCustomerInputs
                        .find((input) => input.id == renderCustomerForm)
                        ?.channelName?.toLowerCase()
                    )
              )
              .map((chart, index) => (
                <div key={index}>
                  <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>
                  <CardShadcn
                    key={index}
                    className="flex flex-col transition duration-500 !rounded-md relative"
                  >
                    <CardHeader>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-50"
                        onClick={(event) => handleChartClick(chart, event)}
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
                        type={
                          chart?.options?.chart?.type
                            ? chart?.options?.chart?.type
                            : "area"
                        }
                        height={350}
                      />
                    </CardContent>
                  </CardShadcn>
                </div>
              ))}
          </div>

          <h4 className="text-base font-semibold my-8">Advanced charts</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {customerGrowthChart?.chartsNoFilter?.map((chart, index) => (
              <div key={index}>
                <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>
                <CardShadcn
                  key={index}
                  className="flex flex-col transition duration-500 !rounded-md relative"
                >
                  <CardHeader>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-50"
                      onClick={(event) => handleChartClick(chart, event)}
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
                      type={
                        chart?.options?.chart?.type
                          ? chart?.options?.chart?.type
                          : "area"
                      }
                      height={chart?.options?.chart?.type === "pie" ? 395 : 350}
                    />
                  </CardContent>
                </CardShadcn>
              </div>
            ))}
          </div>
          <Modal
            zIndex={42424244}
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
                    ...selectedChart.options.xaxis,
                  },

                  stroke: {
                    width: 1,
                    curve: "straight",
                  },
                }}
                series={selectedChart.series}
                type={
                  selectedChart?.options?.chart?.type
                    ? selectedChart?.options?.chart?.type
                    : "area"
                }
                height={500}
              />
            )}
          </Modal>
          <span>
            <h3 className="text-lg font-semibold mt-20 my-8">
              {/* III. Customer Table */}
            </h3>
            <div className="flex justify-between items-center mb-4">
              <ButtonV0 variant="outline" onClick={downloadExcel}>
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </ButtonV0>
            </div>
          </span>

          <Table
            className="custom-table bg-white overflow-auto  my-8 rounded-md"
            size="small"
            dataSource={filteredTableData}
            columns={customerColumns}
            pagination={false}
            rowClassName={(record) =>
              record.key === record.channelName ? "font-bold" : ""
            }
            loading={isLoading}
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
            <CustomerInputsForm
              tempCustomerInputs={tempCustomerInputs}
              setTempCustomerInputs={setTempCustomerInputs}
              renderCustomerForm={renderCustomerForm}
              handleRenderFormChange={handleRenderFormChange}
              handleCustomerInputChange={handleCustomerInputChange}
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
              numberOfMonths={numberOfMonths}
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
              backgroundColor: "#F3f4f6 !important",
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
            zIndex={42424244}
            open={isInputFormOpen}
            onCancel={() => {
              setTempCustomerInputs(customerInputs);
              setIsInputFormOpen(false);
            }}
            centered={true}
            footer={null}
          >
            <CustomerInputsForm
              tempCustomerInputs={tempCustomerInputs}
              setTempCustomerInputs={setTempCustomerInputs}
              renderCustomerForm={renderCustomerForm}
              handleRenderFormChange={handleRenderFormChange}
              handleCustomerInputChange={handleCustomerInputChange}
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
          </Modal>
        )}

        {isDeleteModalOpen && (
          <Modal
            zIndex={42424244}
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
            Are you sure you want to delete{" "}
            <span className="text-[#f5222d]">{renderValue?.channelName}</span>?
          </Modal>
        )}
      </div>
    );
  }
);

export default CustomerSection;
