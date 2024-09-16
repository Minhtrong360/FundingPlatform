import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Card, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateInvestmentData,
  setInvestmentData,
  setInvestmentInputs,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { DownloadOutlined, FullscreenOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
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
import { Check, Download, Plus, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
const InvestmentSection = ({ numberOfMonths, isSaved, setIsSaved }) => {
  const { investmentInputs, investmentData } = useSelector(
    (state) => state.investment
  );
  const dispatch = useDispatch();
  const [tempInvestmentInputs, setTempInvestmentInputs] =
    useState(investmentInputs);

  const [tempInvestmentData, setTempInvestmentData] = useState(investmentData);

  const [renderInvestmentForm, setRenderInvestmentForm] = useState(
    investmentInputs[0]?.id
  );

  const addNewInvestmentInput = () => {
    const maxId = Math.max(...tempInvestmentInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      purchaseName: "New investment",
      assetCost: 0,
      quantity: 1,
      purchaseMonth: 1,
      residualValue: 0,
      usefulLifetime: 1,
    };
    setTempInvestmentInputs([...tempInvestmentInputs, newCustomer]);
    setRenderInvestmentForm(newId.toString());
  };

  const removeInvestmentInput = (id) => {
    const indexToRemove = tempInvestmentInputs.findIndex(
      (input) => input?.id == id
    );
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempInvestmentInputs.slice(0, indexToRemove),
        ...tempInvestmentInputs.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempInvestmentInputs(newInputs);
      setRenderInvestmentForm(prevInputId);
    }
  };

  const handleInvestmentInputChange = (id, field, value) => {
    const newInputs = tempInvestmentInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempInvestmentInputs(newInputs);
  };

  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentInputs, numberOfMonths, renderInvestmentForm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const calculatedData = calculateInvestmentData(
        tempInvestmentInputs,
        numberOfMonths
      );

      setTempInvestmentData(calculatedData);
      const tableData = transformInvestmentDataForTable(
        tempInvestmentInputs,
        renderInvestmentForm,
        tempInvestmentData,
        numberOfMonths
      );
      dispatch(setInvestmentTableData(tableData));

      // Sử dụng setTimeout để setIsLoading(false) sau 2 giây

      setIsLoading(false);
    }, 500);

    // Cleanup function để clear timeout khi component unmount
    return () => clearTimeout(timer);
  }, [tempInvestmentInputs, numberOfMonths, renderInvestmentForm]);

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

  const investmentColumns = [
    {
      fixed: "left",
      title: <div>Type</div>,
      dataIndex: "type",
      key: "key",
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

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: {
        id: "investment-chart",
        type: "area",
        height: 350,
        zoom: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        fontFamily: "Sora, sans-serif",
      },
      grid: { show: false },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      xaxis: {
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          rotate: 0,
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: { fontFamily: "Sora, sans-serif", fontsize: "12px" },
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          rotate: 0,
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Amount ($)",
          style: { fontFamily: "Sora, sans-serif", fontsize: "12px" },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "straight" },
    },
    series: [],
  });

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  useEffect(() => {
    const filteredMonths = Array.from(
      { length: chartEndMonth - chartStartMonth + 1 },
      (_, i) => {
        const monthIndex = (startingMonth + chartStartMonth + i - 2) % 12;
        const year =
          startingYear +
          Math.floor((startingMonth + chartStartMonth + i - 2) / 12);
        return `${months[monthIndex]}/${year}`;
      }
    );

    const seriesData = tempInvestmentData.map((investment) => {
      const filteredData = investment.bookValue.slice(
        chartStartMonth - 1,
        chartEndMonth
      );
      return {
        name: investment.purchaseName,
        data: filteredData,
        dataBookValue: filteredData,
        dataAccumulatedDepreciation: investment.accumulatedDepreciation.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
        dataAssetValue: investment.assetValue.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
        dataDepreciationArray: investment.depreciationArray.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
      };
    });

    const totalSalesData = seriesData.reduce(
      (acc, channel) => {
        channel.data.forEach((amount, index) => {
          if (!acc[index]) acc[index] = 0;
          acc[index] += amount;
        });
        return acc;
      },
      Array(chartEndMonth - chartStartMonth + 1).fill(0)
    );

    setInvestmentChart((prevState) => ({
      ...prevState,
      series: seriesData,
      charts: [
        {
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: filteredMonths,
            },
            chart: {
              ...prevState.options.chart,
              id: "allInvestments",
              stacked: false,
            },
            title: {
              ...prevState.options.title,
              text: "Book values",
            },
          },
          series: [
            ...seriesData,
            {
              name: "Total",
              data: totalSalesData,
            },
          ],
        },
        ...seriesData.map((channelSeries) => ({
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: filteredMonths,
            },
            chart: {
              ...prevState.options.chart,
              id: channelSeries.name,
            },
            title: {
              ...prevState.options.title,
              text: channelSeries.name,
            },
          },
          series: [
            {
              name: "Depreciation",
              data: channelSeries.dataDepreciationArray,
            },
            {
              name: "Accumulated Depre.",
              data: channelSeries.dataAccumulatedDepreciation,
            },
            {
              name: "Book Value",
              data: channelSeries.dataBookValue,
            },
          ],
        })),
      ],
    }));
  }, [
    tempInvestmentData,
    chartStartMonth,
    chartEndMonth,
    startingMonth,
    startingYear,
  ]);

  const { id } = useParams();

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
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

        dispatch(setInvestmentInputs(tempInvestmentInputs));
        const tableData = transformInvestmentDataForTable(
          tempInvestmentInputs,
          renderInvestmentForm,
          tempInvestmentData,
          numberOfMonths
        );
        dispatch(setInvestmentTableData(tableData));

        const updatedInputData = {
          ...inputData,
          investmentInputs: tempInvestmentInputs,
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
      setIsSaved(false);
      setIsLoading(false);
      setIsInputFormOpen(false);
    }
  };

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeInvestmentInput(renderInvestmentForm);
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

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Type",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    transformInvestmentDataForTable(
      tempInvestmentInputs,
      renderInvestmentForm,
      tempInvestmentData,
      numberOfMonths
    ).forEach((record) => {
      const row = [record.type];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Investment Data");

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
      "investment_data.xlsx"
    );
  };

  const downloadJSON = () => {
    const investmentTableData = transformInvestmentDataForTable(
      tempInvestmentInputs,
      renderInvestmentForm,
      tempInvestmentData,
      numberOfMonths
    );

    // Update personnel inputs with formatted job begin and end months
    const updateInvestmentInputs = tempInvestmentInputs.map((input) => {
      const monthIndexStart =
        (Number(startingMonth) + Number(input.purchaseMonth) - 2) % 12;

      const yearStart =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.purchaseMonth) - 2) / 12
        );

      return {
        ...input,
        purchaseMonth: `${months[monthIndexStart]}/${yearStart}`,
        // jobEndMonth: `${months[monthIndexEnd]}/${yearEnd}`,
      };
    });

    const data = {
      investmentInputs: updateInvestmentInputs,
      investmentTableData,
    };

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "investment_data.json");
  };

  const filteredTableData =
    renderInvestmentForm !== "all"
      ? transformInvestmentDataForTable(
          tempInvestmentInputs,
          renderInvestmentForm,
          tempInvestmentData,
          numberOfMonths
        ).filter(
          (record) =>
            record.key !== "CF Investments" &&
            record.key !== "Total Depreciation" &&
            record.key !== "BS Total investment" &&
            record.key !== "BS Total Accumulated Depreciation" &&
            record.key !== "BS Total Net Fixed Assets"
        )
      : transformInvestmentDataForTable(
          tempInvestmentInputs,
          renderInvestmentForm,
          tempInvestmentData,
          numberOfMonths
        );

  const handleRenderFormChange = (e) => {
    setIsLoading(true);
    setRenderInvestmentForm(e);
  };

  return (
    <div>
      <div className="flex space-x-2 my-6 mx-auto justify-center item-center">
        <Badge
          variant="secondary"
          className={`bg-yellow-100 text-yellow-800 cursor-pointer text-sm ${activeTab === "input" ? "bg-yellow-500 text-white" : ""}`}
          onClick={() => handleTabChange("input")}
        >
          Inputs
        </Badge>
        <Badge
          variant="secondary"
          className={`bg-green-100 text-green-800 cursor-pointer text-sm ${activeTab === "table&chart" ? "bg-green-500 text-white" : ""}`}
          onClick={() => handleTabChange("table&chart")}
        >
          Tables and Charts
        </Badge>
      </div>
      <div className="w-full h-full flex flex-col lg:flex-row p-4">
        {activeTab === "table&chart" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0">
              <h3 className="text-lg font-semibold mb-8">
                I. Investment Chart
              </h3>
              <div className="sm:ml-4 ml-0 mt-20">
                <h4 className="text-base font-semibold mb-4">
                  1. All investments chart
                </h4>
                {investmentChart?.charts
                  ?.filter(
                    (chart) => chart.options.chart.id === "allInvestments"
                  )
                  .map((series, index) => (
                    <CardShadcn
                      key={index}
                      className="flex flex-col transition duration-500  rounded-2xl relative"
                    >
                      <CardHeader>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-50"
                          onClick={(event) => handleChartClick(series, event)}
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
                              className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                              className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                            ...series.options,
                            xaxis: {
                              ...series.options.xaxis,
                            },
                            stroke: {
                              width: 1,
                              curve: "straight",
                            },
                          }}
                          series={series.series}
                          type="area"
                          height={350}
                        />
                      </CardContent>
                    </CardShadcn>
                  ))}
              </div>
              <div className="sm:ml-4 ml-0 mt-20">
                <h4 className="text-base font-semibold mb-4">
                  2. Component charts
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {investmentChart?.charts
                    ?.filter(
                      (chart) => chart.options.chart.id !== "allInvestments"
                    )
                    .map((series, index) => (
                      <CardShadcn
                        key={index}
                        className="flex flex-col transition duration-500  rounded-2xl relative"
                      >
                        <CardHeader>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-50"
                            onClick={(event) => handleChartClick(series, event)}
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
                                className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                                className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
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
                              ...series.options,
                              xaxis: {
                                ...series.options.xaxis,
                              },
                              stroke: {
                                width: 1,
                                curve: "straight",
                              },
                            }}
                            series={series.series}
                            type="area"
                            height={350}
                          />
                        </CardContent>
                      </CardShadcn>
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
                  II. Investment Table
                </h3>

                <div className="flex justify-between items-center">
                  <Select
                    value={renderInvestmentForm}
                    onValueChange={(e) => {
                      handleRenderFormChange(e);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Offline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {tempInvestmentInputs.map((input) => (
                        <SelectItem key={input?.id} value={input?.id}>
                          {input.purchaseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={downloadExcel}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Excel
                  </Button>
                </div>
              </span>
              <Table
                className="custom-table bg-white overflow-auto my-8 rounded-md"
                size="small"
                dataSource={filteredTableData}
                columns={investmentColumns}
                pagination={false}
                loading={isLoading}
                bordered={false} // Tắt border mặc định của antd
                rowClassName={(record) =>
                  record.key === record.type ? "font-bold" : ""
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
              <InvestmentInputForm
                tempInvestmentInputs={tempInvestmentInputs}
                renderInvestmentForm={renderInvestmentForm}
                setRenderInvestmentForm={setRenderInvestmentForm}
                handleInvestmentInputChange={handleInvestmentInputChange}
                formatNumber={formatNumber}
                parseNumber={parseNumber}
                addNewInvestmentInput={addNewInvestmentInput}
                handleSave={handleSave}
                isLoading={isLoading}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
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
                <Button type="primary" shape="circle" icon={<FileOutlined />} />
              </FloatButton>
            </div> */}

            {isInputFormOpen && (
              <Modal
                open={isInputFormOpen}
                onOk={() => {
                  handleSave();
                  setIsInputFormOpen(false);
                }}
                onCancel={() => {
                  setTempInvestmentInputs(investmentInputs);
                  setRenderInvestmentForm(investmentInputs[0]?.id);
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
                <InvestmentInputForm
                  tempInvestmentInputs={tempInvestmentInputs}
                  renderInvestmentForm={renderInvestmentForm}
                  setRenderInvestmentForm={setRenderInvestmentForm}
                  handleInvestmentInputChange={handleInvestmentInputChange}
                  formatNumber={formatNumber}
                  parseNumber={parseNumber}
                  addNewInvestmentInput={addNewInvestmentInput}
                  handleSave={handleSave}
                  isLoading={isLoading}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
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
};

const InvestmentInputForm = ({
  tempInvestmentInputs,
  renderInvestmentForm,
  setRenderInvestmentForm,
  handleInvestmentInputChange,
  formatNumber,
  parseNumber,
  addNewInvestmentInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
}) => {
  return (
    <section
      aria-labelledby="investment-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="investment-heading"
      >
        Investment
      </h2>
      <div>
        <label
          htmlFor="selectedChannel"
          className="block my-4 text-base darkTextWhite"
        ></label>
        <select
          id="selectedChannel"
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
          value={renderInvestmentForm}
          onChange={(e) => setRenderInvestmentForm(e.target.value)}
        >
          <option value="all">All</option>
          {tempInvestmentInputs.map((input) => (
            <option key={input?.id} value={input?.id}>
              {input.purchaseName}
            </option>
          ))}
        </select>
      </div>

      {tempInvestmentInputs
        .filter((input) => input?.id == renderInvestmentForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Name of Purchase
              </span>
              <Input
                className="col-start-2 border-gray-300"
                value={input.purchaseName}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "purchaseName",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Asset Cost</span>
              <Input
                className="col-start-2 border-gray-300"
                value={formatNumber(input.assetCost)}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "assetCost",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Quantity:</span>
              <Input
                className="col-start-2 border-gray-300"
                type="text"
                min="1"
                value={formatNumber(input.quantity)}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "quantity",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Purchase Month</span>
              <Input
                className="col-start-2 border-gray-300"
                value={input.purchaseMonth}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "purchaseMonth",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Residual Value</span>
              <Input
                className="col-start-2 border-gray-300"
                value={input.residualValue}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "residualValue",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Useful Lifetime (Months)
              </span>
              <Input
                className="col-start-2 border-gray-300"
                value={formatNumber(input.usefulLifetime)}
                onChange={(e) =>
                  handleInvestmentInputChange(
                    input?.id,
                    "usefulLifetime",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
          </div>
        ))}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          onClick={addNewInvestmentInput}
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

export default InvestmentSection;
