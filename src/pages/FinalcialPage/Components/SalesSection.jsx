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
  FloatButton,
  Modal,
  Table,
  Tooltip,
  message,
} from "antd";
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
  FileOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

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
}) => {
  return (
    <section aria-labelledby="sales-heading" className="mb-8 sticky top-8">
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
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                <SelectContent position="popper">
                  {channelNames?.map((channelName) => (
                    <SelectItem key={channelName.id} value={channelName.id}>
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
                value={formatNumber(input.channelAllocation * 100)}
                onChange={(e) =>
                  handleChannelInputChange(
                    input.id,
                    "channelAllocation",
                    parseNumber(e.target.value) / 100
                  )
                }
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
                <SelectContent position="popper">
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

        const newInputData = JSON.parse(existingData[0].inputData);

        newInputData.channelInputs = updatedChannelInputs;
        newInputData.yearlySales = sales;

        const { error: updateError } = await supabase
          .from("finance")
          .update({ inputData: newInputData })
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
      selectedChannel: channelNames[0],
      channelAllocation: 0.8,
      daysGetPaid: 0, // Default to 0 day
    };
    setTempChannelInputs([...tempChannelInputs, newChannel]);
    setRenderChannelForm(newId.toString());
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
  const { startMonth, startYear } = useSelector(
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

      const totalSalesData = salesChartsData.reduce((acc, channel) => {
        channel.data.forEach((amount, index) => {
          if (!acc[index]) acc[index] = 0;
          acc[index] += amount;
        });
        return acc;
      }, Array(endIdx - startIdx).fill(0));

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
              title: { ...prevState.options.title, text: "All Channels" },
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
        onCell: (record) => ({
          style: {
            borderRight: "1px solid #f0f0f0",
          },
        }),
      };
    }),
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeChannelInput(renderChannelForm);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm sticky top-8 z-50">
        <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
              activeTab === "table&chart" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleTabChange("table&chart")}
          >
            Table and Chart
          </li>
          {/* Repeat for other tabs */}
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
              activeTab === "input" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleTabChange("input")}
          >
            Input
          </li>
        </ul>
      </div>

      <div className="w-full h-full flex flex-col lg:flex-row">
        {activeTab === "table&chart" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0">
              <h3 className="text-lg font-semibold mb-8">Revenue Chart</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {revenue.charts?.map((chart, index) => (
                  <Card
                    key={index}
                    className="flex flex-col transition duration-500  rounded-2xl"
                  >
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
                          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                    <div onClick={() => handleChartClick(chart)}>
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
                    </div>
                  </Card>
                ))}
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
                      // ... other options
                    }}
                    series={selectedChart.series}
                    type="area"
                    height={500}
                  />
                )}
              </Modal>

              <h3 className="text-lg font-semibold my-4">Revenue by Product</h3>
              <div>
                <label
                  htmlFor="renderChannelForm"
                  className="block my-4 text-base darkTextWhite"
                ></label>
                <select
                  id="renderChannelForm"
                  className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
              <Table
                className="overflow-auto my-8 rounded-md bg-white"
                size="small"
                dataSource={revenueTableData}
                columns={revenueColumns}
                pagination={false}
                bordered
                rowClassName={(record) =>
                  record.key === record.channelName ? "font-bold" : ""
                }
              />
            </div>

            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden ">
              <button
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] "
                style={{ bottom: "20px", right: "20px", position: "fixed" }}
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
              />
            </div>

            {/* <div className="xl:hidden block">
              <FloatButton
                tooltip={<div>Input values</div>}
                style={{ position: "fixed", bottom: "30px", right: "30px" }}
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
                    cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
                  },
                }}
                okButtonProps={{
                  style: {
                    background: "#f5222d",
                    borderColor: "#f5222d",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
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

export default SalesSection;
