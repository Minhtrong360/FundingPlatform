import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { Card, Modal, Table, Tooltip, message } from "antd";
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
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  CopyOutlined,
} from "@ant-design/icons";
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
} from "../../../components/ui/card";
import { Button as ButtonV0 } from "../../../components/ui/button";
import { Download } from "lucide-react";

const ChannelInputForm = ({
  tempChannelInputs,
  renderChannelForm,
  setRenderChannelForm,
  handleChannelInputChange,
  formatNumber,
  parseNumber,
  channelNames,
  daysOptions,
  addNewChannelInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
  duplicateChannelInput,
}) => {
  const getUnavailableChannels = (productName) => {
    return tempChannelInputs
      .filter((input) => input.productName === productName)
      .map((input) => input.selectedChannel.id);
  };

  return (
    <section aria-labelledby="sales-heading" className="mb-8 NOsticky NOtop-8">
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="sales-heading"
      >
        Sales Section
      </h2>

      <div>
        <label
          htmlFor="renderChannelForm"
          className="block my-4 text-base darkTextWhite"
        ></label>
        <select
          id="renderChannelForm"
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
          value={renderChannelForm}
          onChange={(e) => setRenderChannelForm(e.target.value)}
        >
          <option value="all">All</option>
          {tempChannelInputs.map((input) => {
            const channelName = channelNames.find(
              (channel) => channel.id === input.selectedChannel.id
            )?.channelName;
            return (
              <option key={input.id} value={input.id}>
                {`${input.productName} - ${channelName}`}
              </option>
            );
          })}
        </select>
      </div>

      {tempChannelInputs
        .filter((input) => input?.id == renderChannelForm)
        .map((input, index) => (
          <div key={input.id} className="bg-white rounded-2xl p-6 border my-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Product Name:</span>
              <Input
                className="col-start-2 border-gray-300"
                value={input.productName}
                onChange={(e) =>
                  handleChannelInputChange(
                    input.id,
                    "productName",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Price:</span>
              <Input
                className="col-start-2 border-gray-300"
                value={formatNumber(input.price)}
                onChange={(e) =>
                  handleChannelInputChange(
                    input.id,
                    "price",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Multiples:</span>
              <Input
                className="col-start-2 border-gray-300"
                value={formatNumber(input.multiples)}
                onChange={(e) =>
                  handleChannelInputChange(
                    input.id,
                    "multiples",
                    parseNumber(e.target.value)
                  )
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
                    handleChannelInputChange(
                      input.id,
                      "deductionPercentage",
                      parseNumber(e.target.value)
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
                  handleChannelInputChange(
                    input.id,
                    "cogsPercentage",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Sales Channel:</span>
              <Select
                className="border-gray-300"
                onValueChange={(value) =>
                  handleChannelInputChange(input.id, "selectedChannel", value)
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
                onChange={(e) => {
                  handleChannelInputChange(
                    input.id,
                    "channelAllocation",
                    parseNumber(e.target.value)
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Days get paid:</span>
              <Select
                className="border-gray-300 z-50"
                onValueChange={(value) =>
                  handleChannelInputChange(input.id, "daysGetPaid", value)
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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

        <button
          className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
          onClick={addNewChannelInput}
        >
          <PlusOutlined
            style={{
              fontSize: "12px",
              color: "#FFFFFF",
              marginRight: "4px",
            }}
          />
          Add
        </button>

        <button
          className="bg-green-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
          onClick={duplicateChannelInput}
        >
          <CopyOutlined
            style={{
              fontSize: "12px",
              color: "#FFFFFF",
              marginRight: "4px",
            }}
          />
          Dupl.
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
};

const SalesSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  revenue,
  setRevenue,
  handleSubmit,
}) => {
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
    calculateAndDispatchRevenueData();
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
      productName: "New channel",
      price: 3,
      multiples: 1,
      deductionPercentage: 0,
      cogsPercentage: 30,
      selectedChannel: { id: null }, // Reset selected channel
      channelAllocation: 0.8,
      daysGetPaid: 0, // Default to 0 day
    };
    setTempChannelInputs([...tempChannelInputs, newChannel]);
    setRenderChannelForm(newId.toString());
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
        selectedChannel: { id: null },
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
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

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
                stacked: false,
              },
              xaxis: {
                axisTicks: { show: false },
                labels: {
                  rotate: 0,
                  show: true,
                  style: { fontFamily: "Sora, sans-serif" },
                },
                categories: filteredCategories,
                title: {
                  text: "Month",
                  style: { fontSize: "12px", fontFamily: "Sora, sans-serif" },
                },
              },
              title: { ...prevState.options.title, text: "Revenues" },
            },
            series: [
              ...salesChartsData.map((channel) => ({
                name: channel.name,
                data: channel.data,
              })),
              { name: "Total", data: totalSalesData },
            ],
          },
          ...salesChartsData.map((channelSeries) => ({
            options: {
              ...prevState.options,
              chart: { ...prevState.options.chart, id: channelSeries.name },
              xaxis: {
                axisTicks: { show: false },
                labels: {
                  rotate: 0,
                  show: true,
                  style: { fontFamily: "Sora, sans-serif" },
                },
                categories: filteredCategories,
                title: {
                  text: "Month",
                  style: { fontSize: "12px", fontFamily: "Sora, sans-serif" },
                },
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

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
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
            record.key !== " "
        )
      : revenueTableData;

  return (
    <div>
      <div className="flex space-x-2 my-6 mx-auto">
        <Badge
          variant="secondary"
          className={`bg-yellow-100 text-yellow-800 cursor-pointer ${activeTab === "input" ? "bg-yellow-500 text-white" : ""}`}
          onClick={() => handleTabChange("input")}
        >
          Inputs
        </Badge>
        <Badge
          variant="secondary"
          className={`bg-green-100 text-green-800 cursor-pointer ${activeTab === "table&chart" ? "bg-green-500 text-white" : ""}`}
          onClick={() => handleTabChange("table&chart")}
        >
          Tables and Charts
        </Badge>
      </div>
      <CardShadcn className="w-full h-full flex flex-col lg:flex-row p-4">
        {activeTab === "table&chart" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0">
              <h3 className="text-lg font-semibold mb-4">I. Revenue Chart</h3>
              <div className="ml-4 mt-20">
                <h4 className="text-base font-semibold mb-4">
                  1. All revenue chart
                </h4>
                {revenue.charts
                  ?.filter((chart) => chart.options.chart.id === "allChannels")
                  .map((chart, index) => (
                    <CardShadcn
                      key={index}
                      className="flex flex-col transition duration-500  rounded-2xl relative"
                    >
                      <CardHeader>
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
                              className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                            >
                              {Array.from(
                                { length: numberOfMonths },
                                (_, i) => {
                                  const monthIndex =
                                    (startingMonth + i - 1) % 12;
                                  const year =
                                    startingYear +
                                    Math.floor((startingMonth + i - 1) / 12);
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
                            <label htmlFor="endMonthSelect" className="text-sm">
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
                              className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                            >
                              {Array.from(
                                { length: numberOfMonths },
                                (_, i) => {
                                  const monthIndex =
                                    (startingMonth + i - 1) % 12;
                                  const year =
                                    startingYear +
                                    Math.floor((startingMonth + i - 1) / 12);
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
                  ))}
              </div>
              <div className="ml-4 mt-20">
                <h4 className="text-base font-semibold mb-4">
                  2. Component charts
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {revenue.charts
                    ?.filter(
                      (chart) => chart.options.chart.id !== "allChannels"
                    )
                    .map((chart, index) => (
                      <div className="ml-2" key={index}>
                        <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(
                          65 + index
                        )}. ${chart.options.title.text}`}</h5>

                        <CardShadcn
                          key={index}
                          className="flex flex-col transition duration-500  rounded-2xl relative"
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
                                  className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                                  className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
              <span>
                <h3 className="text-lg font-semibold mt-20 my-4">
                  II. Revenue Table
                </h3>

                <div className="flex justify-between items-center mb-4">
                  <Select
                    value={renderChannelForm}
                    onValueChange={(e) => {
                      setRenderChannelForm(e);
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
                  </Select>
                  <ButtonV0 variant="outline" onClick={downloadExcel}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel
                  </ButtonV0>
                </div>
              </span>
              <Table
                className="bg-white overflow-auto my-8 rounded-md shadow-xl"
                size="small"
                dataSource={filteredTableData}
                columns={revenueColumns}
                pagination={false}
                rowClassName={(record) =>
                  record.key === record.channelName ? "font-bold" : ""
                }
              />
            </div>

            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden ">
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

            <div className="w-full xl:w-1/4 sm:p-4 p-0">
              <ChannelInputForm
                tempChannelInputs={tempChannelInputs}
                renderChannelForm={renderChannelForm}
                setRenderChannelForm={setRenderChannelForm}
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

            {isInputFormOpen && (
              <Modal
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
                zIndex={50}
              >
                <ChannelInputForm
                  tempChannelInputs={tempChannelInputs}
                  renderChannelForm={renderChannelForm}
                  setRenderChannelForm={setRenderChannelForm}
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
      </CardShadcn>
    </div>
  );
};

export default SalesSection;
