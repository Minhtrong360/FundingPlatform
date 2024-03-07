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
import SelectField from "../../../components/SelectField";

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
  calculateChannelRevenue,
  setRevenueData,
  setrevenueDeductionData,
  setCogsData,
  setNetRevenueData,
  setGrossProfitData,
  customerGrowthData,
  revenueTableData,
}) => {
  //RevenueFunctions
  const addNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      {
        productName: "",
        price: 0,
        multiples: 0,
        deductionPercentage: 0,
        cogsPercentage: 0,
        selectedChannel: "",
      },
    ]);
  };

  // const removeChannelInput = (index) => {
  //   const newInputs = [...channelInputs];
  //   newInputs.splice(index, 1);
  //   setChannelInputs(newInputs);
  // };

  // const handleChannelInputChange = (index, field, value) => {
  //   const newInputs = [...channelInputs];
  //   newInputs[index][field] = value;
  //   setChannelInputs(newInputs);
  // };

  const removeChannelInput = (reder) => {
    const newInputs = channelInputs.filter(
      (input) =>
        `${input.productName} - ${input.selectedChannel}` !== renderChannelForm
    );
    setChannelInputs(newInputs);
  };

  const handleChannelInputChange = (channelName, field, value) => {
    const newInputs = customerInputs.map((input) => {
      if (input.channelName === channelName) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setChannelInputs(newInputs);
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
    setrevenueDeductionData(DeductionByChannelAndProduct);
    setCogsData(cogsByChannelAndProduct);
    setNetRevenueData(netRevenueByChannelAndProduct);
    setGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  //RevenueTable

  // console.log("channelInputs", channelInputs);
  channelInputs.forEach((channel) => {
    if (channel.selectedChannel && channel.productName) {
      const channelRevenue =
        revenueData[channel.selectedChannel + " - " + channel.productName] ||
        [];
      const channelrevenueDeduction =
        revenueDeductionData[
          channel.selectedChannel + " - " + channel.productName
        ] || [];
      const channelCOGS =
        cogsData[channel.selectedChannel + " - " + channel.productName] || [];

      const customerInput = customerInputs.find(
        (input) => input.channelName === channel.selectedChannel
      );
      const begin = customerInput ? customerInput.beginMonth : 1;
      const end = customerInput ? customerInput.endMonth : numberOfMonths;

      const revenueRow = {
        key:
          channel.selectedChannel + " - " + channel.productName + " - Revenue",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - Revenue",
      };
      const revenueDeductionRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - revenueDeduction",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - revenueDeduction",
      };
      const cogsRow = {
        key: channel.selectedChannel + " - " + channel.productName + " - COGS",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - COGS",
      };

      channelRevenue.forEach((value, index) => {
        if (index + 1 >= begin && index + 1 <= end) {
          revenueRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
          revenueDeductionRow[`month${index + 1}`] = parseFloat(
            channelrevenueDeduction[index]
          )?.toFixed(2);
          cogsRow[`month${index + 1}`] = parseFloat(channelCOGS[index]).toFixed(
            2
          );
        } else {
          revenueRow[`month${index + 1}`] = "0.00";
          revenueDeductionRow[`month${index + 1}`] = "0.00";
          cogsRow[`month${index + 1}`] = "0.00";
        }
      });

      const netRevenueRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Net Revenue",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Net Revenue",
      };

      const netRevenueArray =
        netRevenueData[channel.selectedChannel + " - " + channel.productName] ||
        [];
      netRevenueArray.forEach((value, index) => {
        // ...existing code...
        netRevenueRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
      });

      const grossProfitRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Gross Profit",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Gross Profit",
      };

      const grossProfitArray =
        grossProfitData[
          channel.selectedChannel + " - " + channel.productName
        ] || [];
      grossProfitArray.forEach((value, index) => {
        // ...existing code...
        grossProfitRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
      });

      revenueTableData.push(revenueRow);
      revenueTableData.push(revenueDeductionRow);
      revenueTableData.push(cogsRow);
      revenueTableData.push(netRevenueRow);
      revenueTableData.push(grossProfitRow);
    }
  });

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
  const [grossProfit, setgrossProfit] = useState({
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
    const seriesData = Object.entries(grossProfitData).map(([key, data]) => {
      return { name: key, data };
    });

    setgrossProfit((prevState) => ({ ...prevState, series: seriesData }));
  }, [grossProfitData, numberOfMonths]);

  const [renderChannelForm, setRenderChannelForm] = useState(
    `${channelInputs[0].productName} - ${channelInputs[0].selectedChannel}`
  );

  const handleChannelChange = (value) => {
    setRenderChannelForm(value);
  };

  console.log("channelInputs", channelInputs);
  console.log("renderChannelForm", renderChannelForm);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
        <section aria-labelledby="sales-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="sales-heading"
          >
            Sales Section
          </h2>

          <div className="my-4">
            <SelectField
              label="Selected channel name:"
              value={renderChannelForm}
              onChange={(e) => handleChannelChange(e.target.value)}
              required
              options={channelInputs.map(
                (channel) =>
                  `${channel.productName} - ${channel.selectedChannel}`
              )}
            />
          </div>

          {channelInputs
            .filter(
              (input) =>
                `${input.productName} - ${input.selectedChannel}` ===
                renderChannelForm
            )
            .map((input, index) => (
              <div key={index} className="bg-white rounded-md shadow p-6 my-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Product Name:</span>
                  <Input
                    className="col-start-2"
                    value={input.productName}
                    onChange={(e) =>
                      handleChannelInputChange(
                        index,
                        "productName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Price:</span>
                  <Input
                    className="col-start-2"
                    value={input.price}
                    onChange={(e) =>
                      handleChannelInputChange(index, "price", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Multiples:</span>
                  <Input
                    className="col-start-2"
                    value={input.multiples}
                    onChange={(e) =>
                      handleChannelInputChange(
                        index,
                        "multiples",
                        e.target.value
                      )
                    }
                  />
                </div>

                <Tooltip title="Revenue deductions like transaction fees, commission fee... ">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <span className=" flex items-center">
                      Rev. Deductions (%):
                    </span>
                    <Input
                      className="col-start-2"
                      value={input.deductionPercentage}
                      onChange={(e) =>
                        handleChannelInputChange(
                          index,
                          "deductionPercentage",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Tooltip>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">COGS (%):</span>
                  <Input
                    className="col-start-2"
                    value={input.cogsPercentage}
                    onChange={(e) =>
                      handleChannelInputChange(
                        index,
                        "cogsPercentage",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Sales Channel:</span>
                  <Select
                    onValueChange={(value) =>
                      handleChannelInputChange(index, "selectedChannel", value)
                    }
                    value={
                      input.selectedChannel !== null
                        ? input.selectedChannel
                        : ""
                    }
                  >
                    <SelectTrigger
                      id={`select-channel-${index}`}
                      className="border-solid border-[1px] border-gray-600"
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
                  <span className=" flex items-center">
                    Channel Allocation (%):
                  </span>
                  <Input
                    className="col-start-2"
                    type="number"
                    min={0}
                    max={100}
                    value={input.channelAllocation * 100} // Convert to percentage for display
                    onChange={(e) =>
                      handleChannelInputChange(
                        index,
                        "channelAllocation",
                        e.target.value / 100
                      )
                    } // Convert back to fraction
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-4 rounded"
                    onClick={() => removeChannelInput(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={addNewChannelInput}
          >
            Add New
          </button>
        </section>
      </div>
      <div className="w-full lg:w-2/3 p-4">
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
