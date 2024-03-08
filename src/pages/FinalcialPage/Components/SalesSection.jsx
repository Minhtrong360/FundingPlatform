import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const SalesSection = ({
  channelInputs,
  channelNames,
  setChannelInputs,
  revenueData,
  revenueDeductionData,
  cogsData,
  customerInputs,
  numberOfMonths,
  netRevenueData,
  grossProfitData,

  setRevenueData,
  setRevenueDeductionData,
  setCogsData,
  setNetRevenueData,
  setGrossProfitData,
  customerGrowthData,

  isSaved,
  setIsSaved,
}) => {
  const [tempChannelInputs, setTempChannelInputs] = useState(channelInputs);
  const [tempRevenueData, setTempRevenueData] = useState(revenueData);
  const [tempRevenueDeductionData, setTempRevenueDeductionData] =
    useState(revenueDeductionData);
  const [tempCogsData, setTempCogsData] = useState(cogsData);
  const [tempNetRevenueData, setTempNetRevenueData] = useState(netRevenueData);
  const [tempGrossProfitData, setTempGrossProfitData] =
    useState(grossProfitData);

  //RevenueFunctions

  const [renderChannelForm, setRenderChannelForm] = useState(
    channelInputs[0]?.id
  );
  const addNewChannelInput = () => {
    const maxId = Math.max(...tempChannelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newChannel = {
      id: newId,
      productName: "New channel",
      price: 0,
      multiples: 0,
      deductionPercentage: 0,
      cogsPercentage: 0,
      selectedChannel: channelNames[0],
      channelAllocation: 0,
    };
    setTempChannelInputs([...tempChannelInputs, newChannel]);
    setRenderChannelForm(newId.toString());
  };

  const removeChannelInput = (id) => {
    const newInputs = tempChannelInputs.filter((input) => input?.id != id);

    setTempChannelInputs(newInputs);
    setRenderChannelForm(newInputs[0]?.id);
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
    } = calculateChannelRevenue();
    setRevenueData(revenueByChannelAndProduct);
    setRevenueDeductionData(DeductionByChannelAndProduct);
    setCogsData(cogsByChannelAndProduct);
    setNetRevenueData(netRevenueByChannelAndProduct);
    setGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    } = calculateChannelRevenue();
    setTempRevenueData(revenueByChannelAndProduct);
    setTempRevenueDeductionData(DeductionByChannelAndProduct);
    setTempCogsData(cogsByChannelAndProduct);
    setTempNetRevenueData(netRevenueByChannelAndProduct);
    setTempGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, tempChannelInputs, numberOfMonths]);

  //RevenueTable

  const calculateChannelRevenue = () => {
    let revenueByChannelAndProduct = {};
    let DeductionByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};

    tempChannelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);
        const revenueDeductionArray = Array(numberOfMonths).fill(0);
        const cogsArray = Array(numberOfMonths).fill(0);
        const netRevenueArray = Array(numberOfMonths).fill(0);
        const grossProfitArray = Array(numberOfMonths).fill(0);

        // Calculate revenue, revenueDeduction, and COGS
        customerGrowthData.forEach((growthData) => {
          growthData.forEach((data) => {
            if (data.channelName === channel.selectedChannel) {
              const customerInput = customerInputs.find(
                (input) => input.channelName === channel.selectedChannel
              );
              if (customerInput) {
                const begin = customerInput.beginMonth;
                const end = customerInput.endMonth;

                if (data.month >= begin && data.month <= end) {
                  let revenue =
                    data.customers *
                    parseFloat(channel.price) *
                    parseFloat(channel.multiples) *
                    parseFloat(channel.channelAllocation);
                  revenueArray[data.month - 1] = revenue;

                  revenueDeductionArray[data.month - 1] =
                    (revenue * parseFloat(channel.deductionPercentage)) / 100;
                  cogsArray[data.month - 1] =
                    (revenue * parseFloat(channel.cogsPercentage)) / 100;
                }
              }
            }
          });
        });

        // Calculate net revenue and gross profit
        revenueByChannelAndProduct[channelProductKey] = revenueArray;
        DeductionByChannelAndProduct[channelProductKey] = revenueDeductionArray;
        cogsByChannelAndProduct[channelProductKey] = cogsArray;

        netRevenueArray.forEach((_, i) => {
          netRevenueArray[i] = revenueArray[i] - revenueDeductionArray[i];
        });
        netRevenueByChannelAndProduct[channelProductKey] = netRevenueArray;

        grossProfitArray.forEach((_, i) => {
          grossProfitArray[i] =
            netRevenueByChannelAndProduct[channelProductKey][i] -
            cogsByChannelAndProduct[channelProductKey][i];
        });
        grossProfitByChannelAndProduct[channelProductKey] = grossProfitArray;
      }
    });

    return {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    };
  };

  const transformRevenueDataForTable = () => {
    const transformedRevenueTableData = {};
    const calculatedChannelRevenue = calculateChannelRevenue();

    Object.keys(calculatedChannelRevenue.revenueByChannelAndProduct).forEach(
      (channelProductKey) => {
        const revenueRowKey = `${channelProductKey} - Revenue`;
        const revenueDeductionRowKey = `${channelProductKey} - Revenue Deduction`;
        const cogsRowKey = `${channelProductKey} - COGS`;
        const netRevenueRowKey = `${channelProductKey} - Net Revenue`;
        const grossProfitRowKey = `${channelProductKey} - Gross Profit`;

        transformedRevenueTableData[revenueRowKey] = {
          key: revenueRowKey,
          channelName: revenueRowKey,
        };
        transformedRevenueTableData[revenueDeductionRowKey] = {
          key: revenueDeductionRowKey,
          channelName: revenueDeductionRowKey,
        };
        transformedRevenueTableData[cogsRowKey] = {
          key: cogsRowKey,
          channelName: cogsRowKey,
        };
        transformedRevenueTableData[netRevenueRowKey] = {
          key: netRevenueRowKey,
          channelName: netRevenueRowKey,
        };
        transformedRevenueTableData[grossProfitRowKey] = {
          key: grossProfitRowKey,
          channelName: grossProfitRowKey,
        };

        calculatedChannelRevenue.revenueByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[revenueRowKey][`month${index + 1}`] =
            parseFloat(value)?.toFixed(2);
        });
        calculatedChannelRevenue.DeductionByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[revenueDeductionRowKey][
            `month${index + 1}`
          ] = parseFloat(value)?.toFixed(2);
        });
        calculatedChannelRevenue.cogsByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[cogsRowKey][`month${index + 1}`] =
            parseFloat(value)?.toFixed(2);
        });
        calculatedChannelRevenue.netRevenueByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[netRevenueRowKey][`month${index + 1}`] =
            parseFloat(value)?.toFixed(2);
        });
        calculatedChannelRevenue.grossProfitByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[grossProfitRowKey][`month${index + 1}`] =
            parseFloat(value)?.toFixed(2);
        });
      }
    );

    return Object.values(transformedRevenueTableData);
  };

  const revenueTableData = transformRevenueDataForTable();

  //RevenueColumns
  const revenueColumns = [
    {
      fixed: "left",
      title: "Channel_Product_Type",
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).map((month) => ({
      title: `Month_${month}`,
      dataIndex: `month${month}`,
      key: `month${month}`,
    })),
  ];

  //RevenueChart
  const [grossProfit, setGrossProfit] = useState({
    options: {
      chart: { id: "gross-profit-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Revenue Data by Channel and Product', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Profit ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      markers: { size: 1 },
    },

    series: [],
  });

  useEffect(() => {
    const seriesData = Object.entries(tempGrossProfitData).map(
      ([key, data]) => {
        return { name: key, data };
      }
    );

    setGrossProfit((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempGrossProfitData, numberOfMonths]);

  const handleChannelChange = (event) => {
    setRenderChannelForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  useEffect(() => {
    if (isSaved) {
      setChannelInputs(tempChannelInputs);
      setRevenueData(tempRevenueData);
      setRevenueDeductionData(tempRevenueDeductionData);
      setCogsData(tempCogsData);
      setNetRevenueData(tempNetRevenueData);
      setGrossProfitData(tempGrossProfitData);
      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="sales-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="sales-heading"
          >
            Sales Section
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            >
              Selected product:
            </label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderChannelForm}
              onChange={handleChannelChange}
            >
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
                className="bg-white rounded-md shadow p-6 my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Product Name:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">Price:</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.price}
                    onChange={(e) =>
                      handleChannelInputChange(
                        input.id,
                        "price",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">Multiples:</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.multiples}
                    onChange={(e) =>
                      handleChannelInputChange(
                        input.id,
                        "multiples",
                        e.target.value
                      )
                    }
                  />
                </div>

                <Tooltip title="Revenue deductions like transaction fees, commission fee... ">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <span className=" flex items-center text-sm">
                      Rev. Deductions (%):
                    </span>
                    <Input
                      className="col-start-2 border-gray-200"
                      value={input.deductionPercentage}
                      onChange={(e) =>
                        handleChannelInputChange(
                          `${input.productName} - ${input.selectedChannel}`,
                          "deductionPercentage",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Tooltip>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">COGS (%):</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.cogsPercentage}
                    onChange={(e) =>
                      handleChannelInputChange(
                        input.id,
                        "cogsPercentage",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Sales Channel:
                  </span>
                  <Select
                    className="border-gray-200"
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
                      className="border-solid border-[1px] border-gray-200"
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

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Channel Allocation (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min={0}
                    max={100}
                    value={input.channelAllocation * 100} // Convert to percentage for display
                    onChange={(e) =>
                      handleChannelInputChange(
                        input.id,
                        "channelAllocation",
                        e.target.value / 100
                      )
                    } // Convert back to fraction
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-4 rounded"
                    onClick={() => removeChannelInput(input.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4 mr-4"
            onClick={addNewChannelInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 p-4">
        <h3 className="text-2xl font-semibold mb-4">
          Revenue Data by Channel and Product
        </h3>
        <Table
          className="overflow-auto my-8"
          dataSource={revenueTableData}
          columns={revenueColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">
          Gross Profit Data by Channel and Product
        </h3>
        <Chart
          options={grossProfit.options}
          series={grossProfit.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default SalesSection;
