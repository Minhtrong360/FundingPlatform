import React, { useEffect, useState, useMemo } from "react";
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
  setYearlyAverageCustomers,
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
  FileOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const CustomerSection = React.memo(
  ({
    numberOfMonths,
    isSaved,
    setIsSaved,
    customerGrowthChart,
    setCustomerGrowthChart,
    handleSubmit,
  }) => {
    const dispatch = useDispatch();
    const { customerInputs, customerGrowthData, customerTableData } =
      useSelector((state) => state.customer);

    const { startMonth, startYear } = useSelector(
      (state) => state.durationSelect
    );
    const [tempCustomerInputs, setTempCustomerInputs] =
      useState(customerInputs);

    useEffect(() => {
      setTempCustomerInputs(customerInputs);
    }, [customerInputs]);

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

    const handleInputChange = (id, field, value) => {
      // Ensure churnRate value is within the range of 0 to 100
      if (field === "churnRate") {
        value = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100
      }

      const newInputs = tempCustomerInputs.map((input) => {
        if (input?.id === id) {
          return {
            ...input,
            [field]: value,
          };
        }
        return input;
      });
      setTempCustomerInputs(newInputs);
    };

    useEffect(() => {
      const calculatedData = calculateCustomerGrowth(
        customerInputs,
        numberOfMonths
      );
      dispatch(setCustomerGrowthData(calculatedData));
    }, [customerInputs, numberOfMonths]);

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
    }, [tempCustomerInputs, renderCustomerForm]);

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
          onCell: (record) => ({
            style: {
              borderRight: "1px solid #f0f0f0", // Add border right style
            },
          }),
        };
      }),
    ];

    const handleSelectChange = (event) => {
      setRenderCustomerForm(event.target.value);
    };

    const handleSave = () => {
      setIsSaved(true);
    };
    const channelInputs = useSelector((state) => state.sales.channelInputs);

    const { id } = useParams();

    // Define the useEffect hook
    useEffect(() => {
      const saveData = async () => {
        try {
          if (isSaved) {
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

            dispatch(setCustomerInputs(tempCustomerInputs));
            const { revenueByChannelAndProduct } = dispatch(
              calculateChannelRevenue(
                numberOfMonths,
                tempCustomerGrowthData,
                tempCustomerInputs,
                channelInputs
              )
            );

            const yearlySale = calculateYearlySales(revenueByChannelAndProduct);
            dispatch(setYearlySales(yearlySale));

            const { data: existingData, error: selectError } = await supabase
              .from("finance")
              .select("*")
              .eq("id", id);
            if (selectError) {
              throw selectError;
            }

            if (existingData && existingData.length > 0) {
              const newInputData = JSON.parse(existingData[0].inputData);

              const calculatedData = calculateCustomerGrowth(
                tempCustomerInputs,
                numberOfMonths
              );
              const averages = calculateYearlyAverage(
                calculatedData,
                numberOfMonths
              );

              newInputData.customerInputs = tempCustomerInputs;
              newInputData.yearlyAverageCustomers = averages;
              newInputData.yearlySales = yearlySale;

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
        }
      };

      // Call the saveData function
      saveData();
    }, [isSaved]);

    const [chartStartMonth, setChartStartMonth] = useState(1);
    const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

    useEffect(() => {
      const startIdx = chartStartMonth - 1; // Chỉ số bắt đầu cho mảng, dựa trên chartStartMonth
      const endIdx = chartEndMonth; // Chỉ số kết thúc cho mảng, dựa trên chartEndMonth

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

      // Calculate total customers per month for all channels
      const totalCustomersPerMonth = seriesData.reduce((acc, channel) => {
        channel.data.forEach((customers, index) => {
          if (!acc[index]) {
            acc[index] = 0;
          }
          acc[index] += customers;
        });
        return acc;
      }, []);

      const yearlyTotalData = [];
      let startIndex = 0; // Bắt đầu từ phần tử đầu tiên trong mảng
      const monthsInFirstYear = 12 - (startMonth - 1); // Số tháng còn lại trong năm đầu từ tháng bắt đầu

      // Tính tổng cho năm đầu tiên từ tháng bắt đầu đến hết năm
      const firstYearTotal = totalCustomersPerMonth
        .slice(startIndex, monthsInFirstYear)
        .reduce((sum, current) => sum + current, 0);
      yearlyTotalData.push(firstYearTotal);

      // Cập nhật startIndex cho năm tiếp theo
      startIndex += monthsInFirstYear;

      // Tính tổng cho các năm tiếp theo, mỗi lần tính cho 12 tháng
      while (startIndex < totalCustomersPerMonth.length) {
        const yearlyTotal = totalCustomersPerMonth
          .slice(startIndex, startIndex + 12)
          .reduce((sum, current) => sum + current, 0);
        yearlyTotalData.push(yearlyTotal);
        startIndex += 12;
      }

      const yearlyGrowthRates = yearlyTotalData.map((total, index, arr) => {
        if (index === 0) return 0; // Không có tỷ lệ tăng trưởng cho năm đầu tiên
        return ((total - arr[index - 1]) / arr[index - 1]) * 100; // Tính toán tỷ lệ tăng trưởng
      });

      const channelYearlyTotals = seriesData.map((channel) => ({
        name: channel.name,
        data: [],
      }));

      // Tính tổng cho năm đầu tiên từ tháng bắt đầu đến hết năm
      seriesData.forEach((channel, channelIndex) => {
        const firstYearTotal = channel.data
          .slice(startIndex, monthsInFirstYear)
          .reduce((sum, current) => sum + current, 0);
        channelYearlyTotals[channelIndex].data.push(firstYearTotal);
      });
      console.log("seriesData", seriesData);
      console.log("channelYearlyTotals 1", channelYearlyTotals);

      // Cập nhật startIndex cho năm tiếp theo
      startIndex += monthsInFirstYear;

      // Tính tổng cho các năm tiếp theo, mỗi lần tính cho 12 tháng
      while (startIndex < totalCustomersPerMonth.length) {
        seriesData.forEach((channel, channelIndex) => {
          const yearlyTotal = channel.data
            .slice(startIndex, startIndex + 12)
            .reduce((sum, current) => sum + current, 0);
          channelYearlyTotals[channelIndex].data.push(yearlyTotal);
        });
        startIndex += 12;
      }
      console.log("channelYearlyTotals", channelYearlyTotals);

      setCustomerGrowthChart((prevState) => {
        return {
          ...prevState,
          series: seriesData,
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

            // New chart for yearly total and growth rate with separate y-axes
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "yearlyTotal",
                  stacked: false, // Set as non-stacked for total visualization
                  toolbar: {
                    show: false,
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Yearly Total and Growth Rate",
                },
                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: yearlyTotalData.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ), // Creating categories for each year
                },
                yaxis: [
                  {
                    title: {
                      text: "Yearly Total",
                    },
                    seriesName: "Yearly Total",
                    labels: {
                      formatter: (value) => `${formatNumber(value.toFixed(0))}`, // No decimals for total
                    },
                  },
                  {
                    opposite: true,
                    title: {
                      text: "Yearly Growth Rate (%)",
                    },
                    seriesName: "Yearly Growth Rate (%)",
                    labels: {
                      formatter: (value) => `${value.toFixed(2)}%`,
                    },
                  },
                ],
              },
              series: [
                {
                  name: "Yearly Total",
                  data: yearlyTotalData, // Yearly total data
                },
                {
                  name: "Yearly Growth Rate (%)",
                  data: yearlyGrowthRates, // Yearly growth rates
                  type: "line", // Differentiating the chart type for growth rates
                },
              ],
            },
            // New chart for displaying total yearly sales per channel
            {
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: "channelYearlyTotals",
                  stacked: false, // Non-stacked visualization
                  toolbar: {
                    show: false,
                  },
                },
                title: {
                  ...prevState.options.title,
                  text: "Total Yearly Customers by Channel",
                },
                xaxis: {
                  ...prevState.options.xaxis,
                  categories: Array.from(
                    { length: yearlyTotalData.length },
                    (_, i) => {
                      const year = startYear + i;
                      return `${year}`;
                    }
                  ), // Creating categories for each year
                },
              },
              series: channelYearlyTotals, // Yearly totals per channel
            },
            // Individual charts for each channel
            ...seriesData.map((channelSeries) => ({
              options: {
                ...prevState.options,
                chart: {
                  ...prevState.options.chart,
                  id: channelSeries.name,
                },
                xaxis: {
                  axisTicks: {
                    show: false, // Hide x-axis ticks
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
                  data: channelSeries.dataBegin, // Yearly total data
                },
                {
                  name: "Add",
                  data: channelSeries.dataAdd, // Yearly total data
                },
                {
                  name: "Churn",
                  data: channelSeries.dataChurn, // Yearly total data
                },
                {
                  name: "End",
                  data: channelSeries.dataEnd, // Yearly total data
                },
              ],
            })),
          ],
        };
      });
    }, [tempCustomerGrowthData, chartStartMonth, chartEndMonth]);

    const [isInputFormOpen, setIsInputFormOpen] = useState(false);
    console.log("customerGrowthChart", customerGrowthChart);
    return (
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full xl:w-3/4 sm:p-4 p-0 ">
          <h3 className="text-lg font-semibold mb-8">Customer Chart</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {customerGrowthChart.charts?.map((chart, index) => (
              <Card
                key={index}
                className="flex flex-col transition duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105 border border-gray-300 rounded-md"
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-[10vw]">
                    <label htmlFor="startMonthSelect">Start Month:</label>
                    <select
                      id="startMonthSelect"
                      value={chartStartMonth}
                      onChange={(e) =>
                        setChartStartMonth(
                          Math.max(1, Math.min(e.target.value, chartEndMonth))
                        )
                      }
                      className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                  <div className="min-w-[10vw]">
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
                      className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                    xaxis: {
                      ...chart.options.xaxis,
                      // tickAmount: 12, // Set the number of ticks on the x-axis to 12
                    },
                    stroke: {
                      width: 1, // Set the stroke width to 1
                    },
                  }}
                  series={chart.series}
                  type="bar"
                  height={350}
                />
              </Card>
            ))}
          </div>

          <h3 className="text-lg font-semibold my-4">Customer Table</h3>
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

        <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
          <section
            aria-labelledby="customers-heading"
            className="mb-8 sticky top-8"
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
                className="block my-4 text-base  darkTextWhite"
              ></label>
              <select
                id="selectedChannel"
                className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                value={renderCustomerForm}
                onChange={handleSelectChange}
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
                  className="bg-white rounded-md p-6 border my-4"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Channel Name:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={input.channelName}
                      onChange={(e) =>
                        handleInputChange(
                          input?.id,
                          "channelName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
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
                    <span className=" flex items-center text-sm">
                      Growth rate (%):
                    </span>
                    <Input
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
                    <span className="flex items-center text-sm">
                      Frequency:
                    </span>
                    <Select
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
                        <SelectItem value="Semi-Annually">
                          Semi-Annually
                        </SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Begin Month:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      type="number"
                      min={1}
                      value={input.beginMonth}
                      onChange={(e) =>
                        handleInputChange(
                          input?.id,
                          "beginMonth",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      End Month:
                    </span>
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
                    <span className=" flex items-center text-sm">
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
                    <span className=" flex items-center text-sm">
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
                </div>
              ))}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="flex justify-center items-center">
                <button
                  className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
                  onClick={() => removeCustomerInput(renderCustomerForm)}
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
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
                onClick={handleAddNewCustomer}
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
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
                onClick={handleSave}
              >
                <CheckCircleOutlined
                  style={{
                    fontSize: "12px",
                    color: "#FFFFFF",
                    marginRight: "4px",
                  }}
                />
                Save
              </button>
            </div>
          </section>
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
            // title="Customer channel"
            visible={isInputFormOpen}
            onOk={() => {
              handleSave();
              setIsInputFormOpen(false);
            }}
            onCancel={() => {
              setTempCustomerInputs(customerInputs);
              setIsInputFormOpen(false);
            }}
            okText="Save change"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            okButtonProps={{
              style: {
                background: "#2563EB",
                borderColor: "#2563EB",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            centered={true}
            zIndex={50}
          >
            <section
              aria-labelledby="customers-heading"
              className="mb-8 sticky top-8"
            >
              <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
                <div className="flex items-center">
                  <h2
                    className="text-lg font-semibold mb-8 flex items-center"
                    id="customers-heading"
                  >
                    Customer channel
                    <span className="flex justify-center items-center">
                      <PlusCircleOutlined
                        className="ml-2 text-blue-500"
                        size="large"
                        style={{ fontSize: "24px" }}
                        onClick={handleAddNewCustomer}
                      />
                    </span>
                  </h2>
                </div>
              </Tooltip>

              <div>
                <label
                  htmlFor="selectedChannel"
                  className="block my-4 text-base  darkTextWhite"
                ></label>
                <Select
                  id="selectedChannel"
                  className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  value={renderCustomerForm}
                  onValueChange={(value) => handleSelectChange(value)}
                >
                  <SelectTrigger className="border-solid border-[1px] border-gray-300">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All</SelectItem>
                    {tempCustomerInputs.map((input) => (
                      <SelectItem key={input?.id} value={input?.id}>
                        {input.channelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {tempCustomerInputs
                .filter((input) => input?.id == renderCustomerForm)
                .map((input) => (
                  <div
                    key={input?.id}
                    className="bg-white rounded-md p-6 border my-4"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className=" flex items-center text-sm">
                        Channel Name:
                      </span>
                      <Input
                        className="col-start-2 border-gray-300"
                        value={input.channelName}
                        onChange={(e) =>
                          handleInputChange(
                            input?.id,
                            "channelName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className=" flex items-center text-sm">
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
                      <span className=" flex items-center text-sm">
                        Growth rate (%):
                      </span>
                      <Input
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
                      <span className="flex items-center text-sm">
                        Frequency:
                      </span>
                      <Select
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
                          <SelectItem value="Semi-Annually">
                            Semi-Annually
                          </SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className=" flex items-center text-sm">
                        Begin Month:
                      </span>
                      <Input
                        className="col-start-2 border-gray-300"
                        type="number"
                        min={1}
                        value={input.beginMonth}
                        onChange={(e) =>
                          handleInputChange(
                            input?.id,
                            "beginMonth",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className=" flex items-center text-sm">
                        End Month:
                      </span>
                      <Input
                        className="col-start-2 border-gray-300"
                        type="number"
                        min={1}
                        value={input.endMonth}
                        onChange={(e) =>
                          handleInputChange(
                            input?.id,
                            "endMonth",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className=" flex items-center text-sm">
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
                      <span className=" flex items-center text-sm">
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
                    <div className="flex justify-end items-center">
                      <button
                        className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
                        onClick={() => removeCustomerInput(input.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

              {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
                  onClick={handleAddNewCustomer}
                >
                  Add new
                </button>

                <button
                  className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div> */}
            </section>
          </Modal>
        )}
      </div>
    );
  }
);

export default CustomerSection;
