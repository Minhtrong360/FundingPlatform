import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import React, { useEffect, useState, useCallback } from "react";
import { Checkbox, FloatButton, Modal, Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  setChannelInputs,
  setRevenueData,
  setRevenueDeductionData,
  setCogsData,
  setNetRevenueData,
  setGrossProfitData,
  setYearlySales,
  calculateChannelRevenue,
  calculateYearlySales,
  transformRevenueDataForTable,
  setRevenueTableData,
} from "../../../features/SaleSlice";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { supabase } from "../../../supabase";

import { useParams } from "react-router-dom";
import { CheckCircleOutlined, FileOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";

import { Badge } from "../../../components/ui/badge";
import {
  Card as CardShadcn,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { Check, Download, Plus, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import {
  Search,
  MessageSquare,
  PhoneCall,
  Mail,
  Globe,
  CalendarIcon,
  Users,
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
import {
  DollarSign,
  MinusCircle,
  PieChart,
  TrendingUp,
  Package,
} from "lucide-react";

const ChannelInputForm = React.memo(
  ({
    tempChannelInputs,
    renderChannelForm,
    handleRenderFormChange,
    handleChannelInputChange,
    formatNumber,
    channelNames,
    daysOptions,
    addNewChannelInput,
    handleSave,
    isLoading,
    setIsDeleteModalOpen,
  }) => {
    const [debouncedInputs, setDebouncedInputs] = useState(tempChannelInputs);
    // Thêm useEffect để đồng bộ hóa debouncedInputs khi tempFundraisingInputs thay đổi
    useEffect(() => {
      setDebouncedInputs(tempChannelInputs);
    }, [tempChannelInputs]);
    // Debounced function to update state after 1 second
    const debouncedHandleInputChange = useCallback(
      debounce((id, field, value) => {
        handleChannelInputChange(id, field, value);
      }, 1000),
      [handleChannelInputChange]
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

    const getUnavailableChannels = (productName) => {
      return debouncedInputs
        .filter((input) => input.productName === productName)
        .map((input) => input.selectedChannel.id);
    };

    return (
      <section
        aria-labelledby="sales-heading"
        className="mb-8 NOsticky NOtop-8"
      >
        {/* <h2
          className="flex items-center mb-8 text-lg font-semibold"
          id="sales-heading"
        >
          Sales Section
        </h2> */}

        {debouncedInputs
          .filter((input) => input?.id == renderChannelForm)
          .map((input, index) => (
            <div key={input.id} className="p-6 mb-4 bg-white border rounded-md">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Product Name:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={input.productName}
                  onChange={(e) =>
                    handleInputChange(input.id, "productName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Price:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={formatNumber(input.price)}
                  onChange={(e) =>
                    handleInputChange(input.id, "price", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">Multiples:</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={formatNumber(input.multiples)}
                  onChange={(e) =>
                    handleInputChange(input.id, "multiples", e.target.value)
                  }
                />
              </div>

              <Tooltip title="Revenue deductions like transaction fees, commission fee... ">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Rev. Deductions (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={formatNumber(input.deductionPercentage)}
                    onChange={(e) =>
                      handleInputChange(
                        input.id,
                        "deductionPercentage",
                        e.target.value
                      )
                    }
                  />
                </div>
              </Tooltip>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">COGS (%):</span>
                <Input
                  className="col-start-2 border-gray-300"
                  value={formatNumber(input.cogsPercentage)}
                  onChange={(e) =>
                    handleInputChange(
                      input.id,
                      "cogsPercentage",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Sales Channel:
                </span>
                <Select
                  className="border-gray-300"
                  onValueChange={(value) =>
                    handleInputChange(input.id, "selectedChannel", value)
                  }
                  value={
                    input.selectedChannel.id !== null
                      ? input.selectedChannel.id
                      : ""
                  }
                >
                  <SelectTrigger
                    id={`select-channel-${index}`}
                    className="border-solid border-[1px] border-gray-300"
                  >
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white">
                    {channelNames?.map((channelName) => (
                      <SelectItem
                        key={channelName.id}
                        value={channelName.id}
                        disabled={getUnavailableChannels(
                          input.productName
                        ).includes(channelName.id)}
                      >
                        {channelName.channelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Channel Allocation (%):
                </span>
                <Input
                  className="col-start-2 border-gray-300"
                  type="number"
                  min={0}
                  max={100}
                  value={formatNumber(input.channelAllocation)}
                  onChange={(e) =>
                    handleInputChange(
                      input.id,
                      "channelAllocation",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <span className="flex items-center text-sm">
                  Days get paid:
                </span>
                <Select
                  className="z-50 border-gray-300"
                  onValueChange={(value) =>
                    handleInputChange(input.id, "daysGetPaid", value)
                  }
                  value={input.daysGetPaid !== null ? input.daysGetPaid : 0}
                  disabled
                >
                  <SelectTrigger
                    id={`select-days-get-paid-${index}`}
                    className="border-solid border-[1px] border-gray-300"
                  >
                    <SelectValue placeholder="Select Days" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-white">
                    {daysOptions.map((days) => (
                      <SelectItem key={days} value={days}>
                        {days} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            onClick={addNewChannelInput}
            style={{ backgroundColor: "#18181B", color: "white" }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ backgroundColor: "#EF4444", color: "white" }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
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
                <Check className="w-4 h-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </section>
    );
  }
);

const SalesSection = ({ numberOfMonths, revenue, setRevenue }) => {
  const dispatch = useDispatch();
  const {
    channelInputs,
    channelNames,
    revenueData,
    revenueDeductionData,
    cogsData,
    netRevenueData,
    grossProfitData,
    revenueTableData,
  } = useSelector((state) => state.sales);
  const { customerInputs, customerGrowthData } = useSelector(
    (state) => state.customer
  );

  const [tempChannelInputs, setTempChannelInputs] = useState(channelInputs);

  const [tempRevenueData, setTempRevenueData] = useState(revenueData);
  const [tempRevenueDeductionData, setTempRevenueDeductionData] =
    useState(revenueDeductionData);
  const [tempCogsData, setTempCogsData] = useState(cogsData);
  const [tempNetRevenueData, setTempNetRevenueData] = useState(netRevenueData);
  const [tempGrossProfitData, setTempGrossProfitData] =
    useState(grossProfitData);
  const [renderChannelForm, setRenderChannelForm] = useState(
    channelInputs[0]?.id
  );
  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const calculateAndDispatchRevenueData = useCallback(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
      cashInflowByChannelAndProduct,
      receivablesByChannelAndProduct,
    } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        tempChannelInputs
      )
    );

    setTempRevenueData(revenueByChannelAndProduct);
    setTempRevenueDeductionData(DeductionByChannelAndProduct);
    setTempCogsData(cogsByChannelAndProduct);
    setTempNetRevenueData(netRevenueByChannelAndProduct);
    setTempGrossProfitData(grossProfitByChannelAndProduct);

    const calculateRevenueTableData = transformRevenueDataForTable(
      {
        revenueByChannelAndProduct,
        DeductionByChannelAndProduct,
        cogsByChannelAndProduct,
        netRevenueByChannelAndProduct,
        grossProfitByChannelAndProduct,
        cashInflowByChannelAndProduct,
        receivablesByChannelAndProduct,
      },
      tempChannelInputs,
      renderChannelForm
    );
    dispatch(setRevenueTableData(calculateRevenueTableData));
  }, [
    numberOfMonths,
    customerGrowthData,
    customerInputs,
    tempChannelInputs,
    renderChannelForm,
    dispatch,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAndDispatchRevenueData();

      setIsLoading(false);
    }, 500);

    // Cleanup function để clear timeout khi component unmount
    return () => clearTimeout(timer);
  }, [tempChannelInputs, renderChannelForm]);

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Validation to check if any Sales Channel is empty
      for (const input of tempChannelInputs) {
        if (!input.selectedChannel.id) {
          message.error("Sales Channel cannot be empty.");
          setIsLoading(false);
          return;
        }
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

        // Check if user.email matches user_email or is included in collabs
        if (user.email !== user_email && !collabs?.includes(user.email)) {
          message.error("You do not have permission to update this record.");
          return;
        }

        const updatedChannelInputs = tempChannelInputs.map((input) => {
          if (!daysOptions.includes(input.daysGetPaid)) {
            input.daysGetPaid = daysOptions[0];
          }
          return input;
        });

        dispatch(setChannelInputs(updatedChannelInputs));
        dispatch(setRevenueData(tempRevenueData));
        dispatch(setRevenueDeductionData(tempRevenueDeductionData));
        dispatch(setCogsData(tempCogsData));
        dispatch(setNetRevenueData(tempNetRevenueData));
        dispatch(setGrossProfitData(tempGrossProfitData));

        const sales = calculateYearlySales(tempRevenueData);
        dispatch(setYearlySales(sales));

        const updatedInputData = {
          ...inputData,
          channelInputs: updatedChannelInputs,
          yearlySales: sales,
        };

        dispatch(setInputData(updatedInputData));

        const { error: updateError } = await supabase
          .from("finance")
          .update({ inputData: updatedInputData })
          .eq("id", existingData[0]?.id)
          .select();

        if (updateError) {
          throw updateError;
        }
      }
      message.success("Data saved successfully!");
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
      setIsInputFormOpen(false);
    }
  };

  const addNewChannelInput = () => {
    const maxId = Math.max(...tempChannelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newChannel = {
      id: newId,
      productName: `New product ${tempChannelInputs?.length + 1}`,
      price: 3,
      multiples: 1,
      deductionPercentage: 0,
      cogsPercentage: 30,
      selectedChannel: {
        id: channelNames[0]?.id,
        channelName: channelNames[0]?.channelName,
      }, // Reset selected channel
      channelAllocation: 80,
      daysGetPaid: 0, // Default to 0 day
    };
    setTempChannelInputs([...tempChannelInputs, newChannel]);
    setRenderChannelForm(newId.toString());
    message.success("Add new product successfully.");
  };

  const duplicateChannelInput = () => {
    const inputToDuplicate = tempChannelInputs.find(
      (input) => input?.id == renderChannelForm
    );
    if (inputToDuplicate) {
      const maxId = Math.max(...tempChannelInputs.map((input) => input?.id));
      const newId = maxId !== -Infinity ? maxId + 1 : 1;
      const duplicatedChannel = {
        ...inputToDuplicate,
        id: newId,
        selectedChannel: {
          id: channelNames[0]?.id,
          channelName: channelNames[0]?.channelName,
        }, // Reset selected channel
      };
      setTempChannelInputs([...tempChannelInputs, duplicatedChannel]);
      setRenderChannelForm(newId.toString());
    }
  };

  const removeChannelInput = (id) => {
    const indexToRemove = tempChannelInputs.findIndex(
      (input) => input?.id == id
    );
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempChannelInputs.slice(0, indexToRemove),
        ...tempChannelInputs.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;
      setTempChannelInputs(newInputs);
      setRenderChannelForm(prevInputId);
    }
  };

  const handleChannelInputChange = (id, field, value) => {
    const newInputs = tempChannelInputs.map((input) => {
      if (input?.id === id) {
        if (field === "selectedChannel") {
          return {
            ...input,
            selectedChannel: channelNames.find((name) => name.id === value),
          };
        }

        return { ...input, [field]: value };
      }
      return input;
    });

    setTempChannelInputs(newInputs);
  };

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(6);

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

  useEffect(() => {
    if (tempRevenueData) {
      const startIdx = chartStartMonth - 1;
      const endIdx = chartEndMonth;
      const filteredCategories = Array.from(
        { length: endIdx - startIdx },
        (_, i) => {
          const monthIndex = (startingMonth + startIdx + i - 1) % 12;
          const year =
            startingYear + Math.floor((startingMonth + startIdx + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }
      );

      const salesChartsData = Object.entries(tempRevenueData)
        .map(([key, data]) => {
          if (!data) return null;

          const dataDeductions = (tempRevenueDeductionData[key] || []).slice(
            startIdx,
            endIdx
          );
          const dataNetRevenue = (tempNetRevenueData[key] || []).slice(
            startIdx,
            endIdx
          );
          const dataCOGS = (tempCogsData[key] || []).slice(startIdx, endIdx);
          const dataGrossProfit = (tempGrossProfitData[key] || []).slice(
            startIdx,
            endIdx
          );
          return {
            name: key,
            data: data.slice(startIdx, endIdx),
            dataDeductions,
            dataNetRevenue,
            dataCOGS,
            dataGrossProfit,
          };
        })
        .filter((chart) => chart !== null);

      const totalSalesData = salesChartsData.reduce(
        (acc, channel) => {
          channel.data.forEach((amount, index) => {
            if (!acc[index]) acc[index] = 0;
            acc[index] += amount;
          });
          return acc;
        },
        Array(endIdx - startIdx).fill(0)
      );

      // Correctly filter the revenue data for the pie chart
      const revenueRows = filteredTableData.filter((row) =>
        row.key.startsWith("Revenue -")
      );

      // Generate pie chart data, sliced between chartStartMonth and chartEndMonth
      const pieChartData = revenueRows.map((row) => {
        // Slice the months according to chartStartMonth and chartEndMonth
        const slicedRevenue = Array.from({
          length: chartEndMonth - chartStartMonth + 1,
        }).reduce((sum, _, i) => {
          const monthKey = `month${chartStartMonth + i}`;
          return sum + parseNumber(row[monthKey] || 0); // Slicing between start and end months
        }, 0);

        return {
          name: row.key.split(" - ")[1], // Extract channel name after 'Revenue - '
          revenue: slicedRevenue, // Sum only the sliced range of months
        };
      });

      const pieChartLabels = pieChartData.map((channel) => channel.name);
      const pieChartSeries = pieChartData.map((channel) => channel.revenue);

      setRevenue((prevState) => ({
        ...prevState,
        series: [
          ...salesChartsData.map((channel) => ({
            name: channel.name,
            data: channel.data,
          })),
          { name: "Total", data: totalSalesData },
        ],
        charts: [
          {
            options: {
              ...prevState.options,
              chart: {
                ...prevState.options.chart,
                id: "allChannels",
                type: "area",
                stacked: false,
              },
              xaxis: {
                axisTicks: { show: false },
                labels: {
                  rotate: 0,
                  show: true,
                  style: { fontFamily: "Raleway Variable, sans-serif" },
                },
                categories: filteredCategories,
              },
              title: { ...prevState.options.title, text: "All Revenues" },
            },
            series: [
              ...salesChartsData.map((channel) => ({
                name: channel.name,
                data: channel.data,
              })),
              { name: "Total", data: totalSalesData },
            ],
          },
          {
            options: {
              chart: {
                type: "pie",
                toolbar: {
                  show: true,
                },
              },
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
              labels: pieChartLabels,
              title: {
                text: "Revenue Distribution",
              },

              yaxis: {
                min: 0, // Đặt giá trị tối thiểu của trục Oy là 0
                labels: {
                  formatter: (value) => `${formatNumber(value.toFixed(2))}`,
                  style: {
                    fontFamily: "Raleway Variable, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                  },
                },
              },
            },
            series: pieChartSeries,
          },
          ...salesChartsData.map((channelSeries) => ({
            options: {
              ...prevState.options,
              chart: {
                ...prevState.options.chart,
                id: channelSeries.name,
                type: "area",
              },
              xaxis: {
                axisTicks: { show: false },
                labels: {
                  rotate: 0,
                  show: true,
                  style: { fontFamily: "Raleway Variable, sans-serif" },
                },
                categories: filteredCategories,
              },
              title: { ...prevState.options.title, text: channelSeries.name },
            },
            series: [
              { name: "Revenue", data: channelSeries.data },
              { name: "Deductions", data: channelSeries.dataDeductions },
              { name: "Net Revenue", data: channelSeries.dataNetRevenue },
              { name: "COGS", data: channelSeries.dataCOGS },
              { name: "Gross Profit", data: channelSeries.dataGrossProfit },
            ],
          })),
        ],
      }));
    }
  }, [tempRevenueData, chartStartMonth, chartEndMonth]);

  const daysOptions = [0, 15, 30, 45, 60, 90];

  const revenueColumns = [
    {
      fixed: "left",
      title: <div>Revenue Table</div>,
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (startingMonth + i - 1) % 12;
      const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
      return {
        title: `${months[monthIndex]}/${year}`,
        dataIndex: `month${i + 1}`,
        key: `month${i + 1}`,
        align: "right",
      };
    }),
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeChannelInput(renderChannelForm);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    const worksheetData = [
      [
        "Revenue Table",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    revenueTableData.forEach((record) => {
      const row = [record.channelName];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workBook, worksheet, "Revenue Data");
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "revenue_data.xlsx"
    );
  };

  const downloadJSON = () => {
    const data = {
      tempChannelInputs,
      revenueTableData,
    };

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "revenue_data.json");
  };

  const filteredTableData =
    renderChannelForm !== "all"
      ? revenueTableData.filter(
          (record) =>
            record.key !== "Total" &&
            record.key !== "Total Cash Inflow" &&
            record.key !== "Total Receivables" &&
            record.channelName !== "Cash Inflow" &&
            record.channelName !== "Receivables" &&
            record.key !== ` ` &&
            record.key
        )
      : revenueTableData.filter((record) => record.key !== ` `);
  const handleRenderFormChange = (e) => {
    setIsLoading(true);
    setRenderChannelForm(e);
  };

  const [visibleMetrics, setVisibleMetrics] = useState({
    revenue: true,
    deductions: true,
    netRevenue: true,
    cogs: true,
    grossProfit: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const [metrics, setMetrics] = useState([
    {
      key: "revenue",
      title: "Revenue",
      value: "",
      change: "",
      icon: DollarSign,
    },
    {
      key: "deductions",
      title: "Deductions",
      value: "",
      change: "",
      icon: MinusCircle,
    },
    {
      key: "netRevenue",
      title: "Net Revenue",
      value: "",
      change: "",
      icon: TrendingUp,
    },
    { key: "cogs", title: "COGS", value: "", change: "", icon: Package },
    {
      key: "grossProfit",
      title: "Gross Profit",
      value: "",
      change: "",
      icon: PieChart,
    },
  ]);

  // Function to calculate change between two months
  const calculateChange = (startValue, endValue) => {
    if (startValue === 0) return 0;
    return ((endValue - startValue) / startValue) * 100;
  };

  // Extract and sum data for a particular key over a range of months
  const extractData = (data, keyPrefix, startMonth, endMonth) => {
    return Object.keys(data)
      .filter((key) => key.startsWith(keyPrefix))
      .slice(startMonth - 1, endMonth)
      .reduce(
        (sum, monthKey) => sum + parseNumber(data[monthKey].replace(",", "")),
        0
      );
  };

  useEffect(() => {
    if (revenueTableData.length > 0) {
      if (renderChannelForm === "all") {
        // Handle "all" case: sum values across all channels

        const filterByKeyPrefix = (prefix) => {
          return revenueTableData
            .filter((row) => row.key.startsWith(prefix))
            .reduce(
              (sum, data) =>
                sum +
                extractData(data, "month", chartStartMonth, chartEndMonth),
              0
            );
        };

        // Summing up data for each metric across all channels
        const totalRevenue = filterByKeyPrefix("Revenue");
        const totalDeductions = filterByKeyPrefix("Deductions");
        const totalNetRevenue = filterByKeyPrefix("Net Revenue");
        const totalCOGS = filterByKeyPrefix("COGS");
        const totalGrossProfit = filterByKeyPrefix("Gross Profit");

        // Calculate changes
        const calculateMetricChange = (prefix) => {
          return calculateChange(
            parseNumber(
              revenueTableData.find((row) => row.key.startsWith(prefix))?.[
                `month${chartStartMonth}`
              ] || 0
            ),
            revenueTableData
              .filter((row) => row.key.startsWith(prefix))
              .reduce(
                (sum, data) =>
                  sum +
                  parseNumber(data[`month${chartEndMonth}`]) -
                  parseNumber(data[`month${chartStartMonth}`]),
                0
              )
          );
        };

        const revenueChange = calculateMetricChange("Revenue");
        const deductionsChange = calculateMetricChange("Deductions");
        const netRevenueChange = calculateMetricChange("Net Revenue");
        const cogsChange = calculateMetricChange("COGS");
        const grossProfitChange = calculateMetricChange("Gross Profit");
        // Set metrics state
        setMetrics([
          {
            key: "revenue",
            title: "Revenue",
            value: formatNumber(totalRevenue.toFixed(2)),
            change: formatNumber(revenueChange.toFixed(2)),
            icon: DollarSign,
          },
          {
            key: "deductions",
            title: "Deductions",
            value: formatNumber(totalDeductions.toFixed(2)),
            change: formatNumber(deductionsChange.toFixed(2)),
            icon: MinusCircle,
          },
          {
            key: "netRevenue",
            title: "Net Revenue",
            value: formatNumber(totalNetRevenue.toFixed(2)),
            change: formatNumber(netRevenueChange.toFixed(2)),
            icon: TrendingUp,
          },
          {
            key: "cogs",
            title: "COGS",
            value: formatNumber(totalCOGS.toFixed(2)),
            change: formatNumber(cogsChange.toFixed(2)),
            icon: Package,
          },
          {
            key: "grossProfit",
            title: "Gross Profit",
            value: formatNumber(totalGrossProfit.toFixed(2)),
            change: formatNumber(grossProfitChange.toFixed(2)),
            icon: PieChart,
          },
        ]);
      } else {
        // Handle specific channel case as you originally did
        const revenueData = revenueTableData?.find((row) =>
          row.key.includes("Revenue")
        );
        const deductionsData = revenueTableData?.find((row) =>
          row.key.includes("Deductions")
        );
        const netRevenueData = revenueTableData?.find((row) =>
          row.key.includes("Net Revenue")
        );
        const cogsData = revenueTableData?.find((row) =>
          row.key.includes("COGS")
        );
        const grossProfitData = revenueTableData?.find((row) =>
          row.key.includes("Gross Profit")
        );

        // Calculate metrics values
        const totalRevenue = extractData(
          revenueData,
          "month",
          chartStartMonth,
          chartEndMonth
        );
        const totalDeductions = extractData(
          deductionsData,
          "month",
          chartStartMonth,
          chartEndMonth
        );
        const totalNetRevenue = extractData(
          netRevenueData,
          "month",
          chartStartMonth,
          chartEndMonth
        );
        const totalCOGS = extractData(
          cogsData,
          "month",
          chartStartMonth,
          chartEndMonth
        );
        const totalGrossProfit = extractData(
          grossProfitData,
          "month",
          chartStartMonth,
          chartEndMonth
        );

        // Calculate changes
        const revenueChange = calculateChange(
          parseNumber(revenueData[`month${chartStartMonth}`]),
          parseNumber(revenueData[`month${chartEndMonth}`])
        );
        const deductionsChange = calculateChange(
          parseNumber(deductionsData[`month${chartStartMonth}`]),
          parseNumber(deductionsData[`month${chartEndMonth}`])
        );
        const netRevenueChange = calculateChange(
          parseNumber(netRevenueData[`month${chartStartMonth}`]),
          parseNumber(netRevenueData[`month${chartEndMonth}`])
        );
        const cogsChange = calculateChange(
          parseNumber(cogsData[`month${chartStartMonth}`]),
          parseNumber(cogsData[`month${chartEndMonth}`])
        );
        const grossProfitChange = calculateChange(
          parseNumber(grossProfitData[`month${chartStartMonth}`]),
          parseNumber(grossProfitData[`month${chartEndMonth}`])
        );

        // Set metrics state
        setMetrics([
          {
            key: "revenue",
            title: "Revenue",
            value: formatNumber(totalRevenue.toFixed(2)),
            change: formatNumber(revenueChange.toFixed(2)),
            icon: DollarSign,
          },
          {
            key: "deductions",
            title: "Deductions",
            value: formatNumber(totalDeductions.toFixed(2)),
            change: formatNumber(deductionsChange.toFixed(2)),
            icon: MinusCircle,
          },
          {
            key: "netRevenue",
            title: "Net Revenue",
            value: formatNumber(totalNetRevenue.toFixed(2)),
            change: formatNumber(netRevenueChange.toFixed(2)),
            icon: TrendingUp,
          },
          {
            key: "cogs",
            title: "COGS",
            value: formatNumber(totalCOGS.toFixed(2)),
            change: formatNumber(cogsChange.toFixed(2)),
            icon: Package,
          },
          {
            key: "grossProfit",
            title: "Gross Profit",
            value: formatNumber(totalGrossProfit.toFixed(2)),
            change: formatNumber(grossProfitChange.toFixed(2)),
            icon: PieChart,
          },
        ]);
      }
    }
  }, [
    chartStartMonth,
    chartEndMonth,
    renderChannelForm,
    revenueTableData,
    tempChannelInputs,
  ]);

  const renderValue =
    tempChannelInputs.find((item) => item.id == renderChannelForm) || "all";

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
            {/* <h2 className="text-lg font-semibold">
              I. Metrics (Under Constructions)
            </h2> */}
            <Select
              value={renderValue.id ? renderValue.id : "all"}
              onValueChange={(e) => {
                handleRenderFormChange(e);
              }}
              className="w-full md:w-auto min-w-[10rem]"
            >
              <SelectTrigger className="w-full md:w-auto min-w-[10rem]">
                <SelectValue placeholder="Offline">
                  {renderValue?.productName
                    ? `${renderValue?.productName} - ${
                        channelNames?.find(
                          (channel) =>
                            channel?.id === renderValue?.selectedChannel?.id
                        )?.channelName
                      }`
                    : "All"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {tempChannelInputs.map((input) => {
                  const channelName = channelNames.find(
                    (channel) => channel.id === input.selectedChannel.id
                  )?.channelName;
                  return (
                    <SelectItem key={input.id} value={input.id}>
                      {`${input.productName} - ${channelName}`}
                    </SelectItem>
                  );
                })}
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
                        {metric.change
                          ? `${metric.change}% from last period`
                          : ""}
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>

        {/* <h3 className="text-lg font-semibold mb-4">II. Revenue Chart</h3> */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* <h4 className="text-base font-semibold mb-4">1. All revenue chart</h4> */}
          {renderChannelForm === "all" &&
            revenue.charts.map((chart, index) => (
              <div key={index} className="my-4">
                <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}</h5>

                <CardShadcn
                  key={index}
                  className="flex flex-col transition duration-500  !rounded-md relative"
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
                        chart: { animations: { enabled: false } },
                        ...chart.options,
                        xaxis: { ...chart.options.xaxis },
                        stroke: { width: 1, curve: "straight" },
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
          {/* <h4 className="text-base font-semibold mb-4">2. Component charts</h4> */}

          {revenue.charts
            ?.filter(
              (chart) =>
                chart.options.chart.id !== "allChannels" &&
                chart?.options?.title?.text ===
                  `${
                    channelNames?.find(
                      (channel) =>
                        channel?.id === renderValue?.selectedChannel?.id
                    )?.channelName
                  } - ${renderValue?.productName}`
            )
            .map((chart, index) => (
              <div key={index}>
                <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(
                  65 + index
                )}. ${chart.options.title.text}`}</h5>

                <CardShadcn
                  key={index}
                  className="flex flex-col transition duration-500  !rounded-md relative"
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
                        chart: { animations: { enabled: false } },
                        ...chart.options,
                        xaxis: { ...chart.options.xaxis },
                        stroke: { width: 1, curve: "straight" },
                      }}
                      series={chart.series}
                      type="area"
                      height={350}
                    />
                  </CardContent>
                </CardShadcn>
              </div>
            ))}
        </div>
        <Modal
          zIndex={42424244}
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
              type={
                selectedChart?.options?.chart?.type
                  ? selectedChart?.options?.chart?.type
                  : "area"
              }
              height={500}
              className="p-4"
            />
          )}
        </Modal>
        <span>
          <h3 className="text-lg font-semibold mt-20 my-8">
            {/* III. Revenue Table */}
          </h3>

          <div className="flex justify-between items-center mb-4">
            {/* <Select
              value={renderChannelForm}
              onValueChange={(e) => {
                handleRenderFormChange(e);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Offline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {tempChannelInputs.map((input) => {
                  const channelName = channelNames.find(
                    (channel) => channel.id === input.selectedChannel.id
                  )?.channelName;
                  return (
                    <SelectItem key={input.id} value={input.id}>
                      {`${input.productName} - ${channelName}`}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select> */}
            <ButtonV0 variant="outline" onClick={downloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </ButtonV0>
          </div>
        </span>
        <Table
          className="custom-table bg-white overflow-auto my-8 rounded-md"
          size="small"
          dataSource={filteredTableData}
          columns={revenueColumns}
          loading={isLoading}
          pagination={false}
          rowClassName={(record) =>
            record.key === record.channelName ? "font-bold" : ""
          }
        />
      </div>

      <div className="relative w-full xl:w-1/4">
        <div className="!py-4 xl:!block !hidden border-white !sticky !top-28">
          <ChannelInputForm
            tempChannelInputs={tempChannelInputs}
            renderChannelForm={renderChannelForm}
            handleRenderFormChange={handleRenderFormChange}
            handleChannelInputChange={handleChannelInputChange}
            formatNumber={formatNumber}
            parseNumber={parseNumber}
            channelNames={channelNames}
            daysOptions={daysOptions}
            addNewChannelInput={addNewChannelInput}
            handleSave={handleSave}
            isLoading={isLoading}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            duplicateChannelInput={duplicateChannelInput}
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
          zIndex={42424244}
          open={isInputFormOpen}
          onOk={() => {
            handleSave();
            setIsInputFormOpen(false);
          }}
          onCancel={() => {
            setTempChannelInputs(channelInputs);
            setIsInputFormOpen(false);
          }}
          okText={isLoading ? <SpinnerBtn /> : "Save Change"}
          cancelText="Cancel"
          cancelButtonProps={{
            style: { borderRadius: "0.375rem", cursor: "pointer" },
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
        >
          <ChannelInputForm
            tempChannelInputs={tempChannelInputs}
            renderChannelForm={renderChannelForm}
            handleRenderFormChange={handleRenderFormChange}
            handleChannelInputChange={handleChannelInputChange}
            formatNumber={formatNumber}
            parseNumber={parseNumber}
            channelNames={channelNames}
            daysOptions={daysOptions}
            addNewChannelInput={addNewChannelInput}
            handleSave={handleSave}
            isLoading={isLoading}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            duplicateChannelInput={duplicateChannelInput}
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
          <span className="text-[#f5222d]">
            {`${renderValue?.productName} -
              ${renderValue?.selectedChannel?.channelName}`}
          </span>
          ?
        </Modal>
      )}
    </div>
  );
};

export default SalesSection;
