import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Card, Table, Tooltip, message } from "antd";
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
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

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

  useEffect(() => {
    setTempChannelInputs(channelInputs);
  }, [channelInputs]);

  //RevenueFunctions

  const [renderChannelForm, setRenderChannelForm] = useState("all");
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
      (input) => input?.id === id
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
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempChannelInputs(newInputs);
  };

  useEffect(() => {
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
        channelInputs
      )
    );

    dispatch(setRevenueData(revenueByChannelAndProduct));
    dispatch(setRevenueDeductionData(DeductionByChannelAndProduct));
    dispatch(setCogsData(cogsByChannelAndProduct));
    dispatch(setNetRevenueData(netRevenueByChannelAndProduct));
    dispatch(setGrossProfitData(grossProfitByChannelAndProduct));
    const sales = calculateYearlySales(tempRevenueData);
    dispatch(setYearlySales(sales));
    const calculatedChannelRevenue = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        channelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      calculatedChannelRevenue,
      channelInputs,
      renderChannelForm
    );

    dispatch(setRevenueTableData(calculateRevenueTableData));
  }, [customerGrowthData, channelInputs, numberOfMonths, renderChannelForm]);

  useEffect(() => {
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
    const calculatedChannelRevenue = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        tempChannelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      calculatedChannelRevenue,
      tempChannelInputs,
      renderChannelForm
    );

    dispatch(setRevenueTableData(calculateRevenueTableData));
  }, [
    customerGrowthData,
    tempChannelInputs,
    numberOfMonths,
    renderChannelForm,
  ]);

  //RevenueTable

  //RevenueColumns
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

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

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

  //RevenueChart

  useEffect(() => {
    if (tempRevenueData) {
      const salesChartsData = Object.entries(tempRevenueData)
        .map(([key, data]) => {
          if (!data) return null; // Ensure data is not undefined

          const dataDeductions = tempRevenueDeductionData[key] || [];
          const dataNetRevenue = tempNetRevenueData[key] || [];
          const dataCOGS = tempCogsData[key] || [];
          const dataGrossProfit = tempGrossProfitData[key] || [];
          return {
            name: key,
            data, // Ensure this is always an array
            dataDeductions,
            dataNetRevenue,
            dataCOGS,
            dataGrossProfit,
          };
        })
        .filter((chart) => chart !== null); // Remove any null entries

      const totalSalesData = salesChartsData.reduce((acc, channel) => {
        channel.data.forEach((amount, index) => {
          if (!acc[index]) acc[index] = 0;
          acc[index] += amount;
        });
        return acc;
      }, Array(numberOfMonths).fill(0));

      setRevenue((prevState) => ({
        ...prevState,
        series: salesChartsData,
        charts: [
          {
            options: {
              ...prevState.options,
              chart: {
                ...prevState.options.chart,
                id: "allChannels",
                stacked: false,
              },
              title: {
                ...prevState.options.title,
                text: "All Channels",
              },
            },
            series: [
              ...salesChartsData,
              {
                name: "Total",
                data: totalSalesData,
              },
            ],
          },
          ...salesChartsData.map((channelSeries) => ({
            options: {
              ...prevState.options,
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
                name: "Revenue",
                data: channelSeries.data,
              },
              {
                name: "Deductions",
                data: channelSeries.dataDeductions,
              },
              {
                name: "Net Revenue",
                data: channelSeries.dataNetRevenue,
              },
              {
                name: "COGS",
                data: channelSeries.dataCOGS,
              },
              {
                name: "Gross Profit",
                data: channelSeries.dataGrossProfit,
              },
            ],
          })),
        ],
      }));
    }
  }, [tempRevenueData, numberOfMonths]);

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };
  const { user } = useAuth();
  const { id } = useParams();
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isSaved) {
          dispatch(setChannelInputs(tempChannelInputs));

          dispatch(setRevenueData(tempRevenueData));

          dispatch(setRevenueDeductionData(tempRevenueDeductionData));

          dispatch(setCogsData(tempCogsData));

          dispatch(setNetRevenueData(tempNetRevenueData));

          dispatch(setGrossProfitData(tempGrossProfitData));

          const sales = calculateYearlySales(tempRevenueData);

          dispatch(setYearlySales(sales));

          const calculatedChannelRevenue = dispatch(
            calculateChannelRevenue(
              numberOfMonths,
              customerGrowthData,
              customerInputs,
              tempChannelInputs
            )
          );

          const calculateRevenueTableData = transformRevenueDataForTable(
            calculatedChannelRevenue,
            tempChannelInputs,
            renderChannelForm
          );
          dispatch(setRevenueTableData(calculateRevenueTableData));

          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);

          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
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
        }
      } catch (error) {
        message.error(error);
      } finally {
        setIsSaved(false);
      }
    };

    saveData();
  }, [isSaved]);

  useEffect(() => {
    const sales = calculateYearlySales(tempRevenueData);
    dispatch(setYearlySales(sales));
  }, [tempRevenueData, numberOfMonths, isSaved]);

  const handleChannelChange = (event) => {
    setRenderChannelForm(event.target.value);
  };

  console.log("revenue", revenue);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
        <section aria-labelledby="sales-heading" className="mb-8">
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
                className="bg-white rounded-md shadow-xl p-6 border my-4"
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
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded text-sm mt-4"
                    onClick={() => removeChannelInput(input.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4 mr-4"
              onClick={addNewChannelInput}
            >
              Add new
            </button>

            <button
              className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
        <Table
          className="overflow-auto my-8 rounded-md shadow-xl"
          size="small"
          dataSource={revenueTableData}
          columns={revenueColumns}
          pagination={false}
          bordered
          rowClassName={(record) =>
            record.key === record.channelName ? "font-bold" : ""
          }
        />
        <h3 className="text-lg font-semibold my-8">Revenue Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {revenue.charts?.map((chart, index) => (
            <Card
              key={index}
              className="flex flex-col shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105 border border-gray-300 rounded-md"
            >
              <Chart
                options={{
                  ...chart.options,

                  xaxis: {
                    ...chart.options.xaxis,
                    tickAmount: 12, // Ensure x-axis has 12 ticks
                  },
                  stroke: {
                    width: 2, // Set the stroke width to 1
                  },
                }}
                series={chart.series}
                type="area"
                height={350}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesSection;
