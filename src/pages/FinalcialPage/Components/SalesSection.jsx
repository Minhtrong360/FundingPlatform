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

const SalesSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  revenue,
  setRevenue,
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

  // Avoid using unoptimized anonymous functions inside useEffect
  const calculateAndDispatchRevenueData = useCallback(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
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
    setTempChannelInputs(channelInputs);
  }, [channelInputs]);

  useEffect(() => {
    calculateAndDispatchRevenueData();
  }, [
    customerGrowthData,
    tempChannelInputs,
    numberOfMonths,
    renderChannelForm,
    calculateAndDispatchRevenueData,
  ]);

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (isSaved) {
      const saveData = async () => {
        try {
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
              message.error(
                "You do not have permission to update this record."
              );
              return;
            }

            dispatch(setChannelInputs(tempChannelInputs));
            dispatch(setRevenueData(tempRevenueData));
            dispatch(setRevenueDeductionData(tempRevenueDeductionData));
            dispatch(setCogsData(tempCogsData));
            dispatch(setNetRevenueData(tempNetRevenueData));
            dispatch(setGrossProfitData(tempGrossProfitData));

            const sales = calculateYearlySales(tempRevenueData);
            dispatch(setYearlySales(sales));

            const newInputData = JSON.parse(existingData[0].inputData);
            newInputData.channelInputs = tempChannelInputs;
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
          setIsSaved(false);
        }
      };

      saveData();
    }
  }, [
    isSaved,
    tempChannelInputs,
    tempRevenueData,
    tempRevenueDeductionData,
    tempCogsData,
    tempNetRevenueData,
    tempGrossProfitData,
    id,
    dispatch,
    setIsSaved,
  ]);

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
      daysGetPaid: 0,
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

      const salesChartsData2 = Object.entries(tempRevenueData)
        .map(([key, data]) => {
          if (!data) return null;

          const dataDeductions = tempRevenueDeductionData[key] || [];
          const dataNetRevenue = tempNetRevenueData[key] || [];
          const dataCOGS = tempCogsData[key] || [];
          const dataGrossProfit = tempGrossProfitData[key] || [];
          return {
            name: key,
            data: data,
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
      const totalSalesData2 = salesChartsData2.reduce((acc, channel) => {
        channel.data.forEach((amount, index) => {
          if (!acc[index]) acc[index] = 0;
          acc[index] += amount;
        });
        return acc;
      }, Array(numberOfMonths).fill(0));

      setRevenue((prevState) => ({
        ...prevState,
        series: [
          ...salesChartsData2.map((channel) => ({
            name: channel.name,
            data: channel.data,
          })),
          { name: "Total", data: totalSalesData2 },
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
  }, [
    tempRevenueData,
    numberOfMonths,
    chartStartMonth,
    chartEndMonth,
    startingMonth,
    startingYear,
    tempRevenueDeductionData,
    tempNetRevenueData,
    tempCogsData,
    tempGrossProfitData,
  ]);

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleChannelChange = (e) => {
    setRenderChannelForm(e.target.value);
  };

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
            borderRight: "1px solid #f0f0f0", // Add border right style
          },
        }),
      };
    }),
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Revenue Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {revenue.charts?.map((chart, index) => (
            <Card
              key={index}
              className="flex flex-col transition duration-500  rounded-2xl"
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
                        startingYear + Math.floor((startingMonth + i - 1) / 12);
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
            </Card>
          ))}
        </div>

        <h3 className="text-lg font-semibold my-4">Revenue by Product</h3>
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

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden border-r-8 border-l-8 border-white">
        <section aria-labelledby="sales-heading" className="mb-8 sticky top-8">
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="sales-heading"
          >
            Sales Section
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderChannelForm}
              onChange={handleChannelChange}
            >
              <option value="all">All</option>
              {tempChannelInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {`${input.productName} - ${input.selectedChannel}`}
                </option>
              ))}
            </select>
          </div>

          {tempChannelInputs
            .filter((input) => input?.id == renderChannelForm)
            .map((input, index) => (
              <div
                key={input.id}
                className="bg-white rounded-md p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Product Name:
                  </span>
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
                  <span className="flex items-center text-sm">
                    Sales Channel:
                  </span>
                  <Select
                    className="border-gray-300"
                    onValueChange={(value) =>
                      handleChannelInputChange(
                        input.id,
                        "selectedChannel",
                        value
                      )
                    }
                    value={
                      input.selectedChannel !== null
                        ? input.selectedChannel
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
                      {channelNames.map((channelName, channelIndex) => (
                        <SelectItem key={channelIndex} value={channelName}>
                          {channelName}
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
                  <span className="flex items-center text-sm">
                    Days get paid:
                  </span>
                  <Select
                    className="border-gray-300"
                    onValueChange={(value) =>
                      handleChannelInputChange(input.id, "daysGetPaid", value)
                    }
                    value={input.daysGetPaid !== null ? input.daysGetPaid : ""}
                    disabled
                  >
                    <SelectTrigger
                      id={`select-days-get-paid-${index}`}
                      className="border-solid border-[1px] border-gray-300"
                    >
                      <SelectValue placeholder="Select Days" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((days) => (
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
              className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
              onClick={() => removeChannelInput(renderChannelForm)}
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
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
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
          style={{ position: "fixed", bottom: "30px", right: "30px" }}
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
            setTempChannelInputs(channelInputs);
            setIsInputFormOpen(false);
          }}
          okText="Save change"
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
            },
          }}
          centered={true}
          zIndex={50}
        >
          <section
            aria-labelledby="sales-heading"
            className="mb-8 sticky top-8"
          >
            <h2
              className="text-lg font-semibold mb-8 flex items-center"
              id="sales-heading"
            >
              Sales Section{" "}
              <span className="flex justify-center items-center">
                <PlusCircleOutlined
                  className="ml-2 text-blue-500"
                  size="large"
                  style={{ fontSize: "24px" }}
                  onClick={addNewChannelInput}
                />
              </span>
            </h2>

            <div>
              <label
                htmlFor="selectedChannel"
                className="block my-4 text-base darkTextWhite"
              ></label>

              <Select
                id="selectedChannel"
                className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                value={renderChannelForm}
                onValueChange={(value) => handleChannelChange(value)}
              >
                <SelectTrigger className="border-solid border-[1px] border-gray-300">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">All</SelectItem>
                  {tempChannelInputs.map((input) => (
                    <SelectItem key={input?.id} value={input?.id}>
                      {`${input.productName} - ${input.selectedChannel}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tempChannelInputs.length > 0 &&
              tempChannelInputs
                .filter((input) => input?.id == renderChannelForm)
                .map((input, index) => (
                  <div
                    key={input.id}
                    className="bg-white rounded-md p-6 border my-4"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <span className="flex items-center text-sm">
                        Product Name:
                      </span>
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
                      <span className="flex items-center text-sm">
                        Multiples:
                      </span>
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
                      <span className="flex items-center text-sm">
                        COGS (%):
                      </span>
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
                      <span className="flex items-center text-sm">
                        Sales Channel:
                      </span>
                      <Select
                        className="border-gray-300"
                        onValueChange={(value) =>
                          handleChannelInputChange(
                            input.id,
                            "selectedChannel",
                            value
                          )
                        }
                        value={
                          input.selectedChannel !== null
                            ? input.selectedChannel
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
                          {channelNames.map((channelName, channelIndex) => (
                            <SelectItem key={channelIndex} value={channelName}>
                              {channelName}
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
                      <span className="flex items-center text-sm">
                        Days get paid:
                      </span>
                      <Select
                        className="border-gray-300"
                        onValueChange={(value) =>
                          handleChannelInputChange(
                            input.id,
                            "daysGetPaid",
                            value
                          )
                        }
                        value={
                          input.daysGetPaid !== null ? input.daysGetPaid : ""
                        }
                        disabled
                      >
                        <SelectTrigger
                          id={`select-days-get-paid-${index}`}
                          className="border-solid border-[1px] border-gray-300"
                        >
                          <SelectValue placeholder="Select Days" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {[0, 15, 30, 45, 60, 75, 90, 105, 120].map((days) => (
                            <SelectItem key={days} value={days}>
                              {days} days
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end items-center">
                      <button
                        className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
                        onClick={() => removeChannelInput(input.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
          </section>
        </Modal>
      )}
    </div>
  );
};

export default SalesSection;
