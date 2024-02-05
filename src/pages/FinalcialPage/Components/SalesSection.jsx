import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect } from "react";

const SalesSection = ({
  channelInputs,
  channelNames,
  setChannelInputs,
  revenueData,
  txFeeData,
  cogsData,
  netRevenueData,
  grossProfitData,
  setRevenueData,
  setNetRevenueData,
  setGrossProfitData,
  setTxFeeData,
  setCogsData,
  customerGrowthData,
  numberOfMonths,
  customerInputs,
  setRevenueTableData,
  setRevenueChart,
}) => {
  const handleAddNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      {
        productName: "", // New field for product name
        price: 0,
        multiples: 0,
        txFeePercentage: 0,
        cogsPercentage: 0,
        selectedChannel: "",
        channelAllocation: 1,
      },
    ]);
  };

  const removeChannelInput = (index) => {
    const newInputs = [...channelInputs];
    newInputs.splice(index, 1);
    setChannelInputs(newInputs);
  };

  const handleChannelInputChange = (index, field, value) => {
    const newInputs = [...channelInputs];
    newInputs[index][field] = value;
    setChannelInputs(newInputs);
  };

  const calculateChannelRevenue = () => {
    let revenueByChannelAndProduct = {};

    // New arrays for txFee and COGS
    let txFeeByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};

    channelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);

        // Initialize txFee and COGS arrays
        const txFeeArray = Array(numberOfMonths).fill(0);
        const cogsArray = Array(numberOfMonths).fill(0);
        const netRevenueArray = Array(numberOfMonths).fill(0);
        const grossProfitArray = Array(numberOfMonths).fill(0);

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

                  // Calculate txFee and COGS
                  txFeeArray[data.month - 1] =
                    (revenue * parseFloat(channel.txFeePercentage)) / 100;
                  cogsArray[data.month - 1] =
                    (revenue * parseFloat(channel.cogsPercentage)) / 100;
                }
              }
            }
          });
        });

        revenueByChannelAndProduct[channelProductKey] = revenueArray;
        txFeeByChannelAndProduct[channelProductKey] = txFeeArray;
        cogsByChannelAndProduct[channelProductKey] = cogsArray;

        netRevenueArray.forEach((_, i) => {
          netRevenueArray[i] = revenueArray[i] - txFeeArray[i];
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
      txFeeByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    };
  };

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      txFeeByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    } = calculateChannelRevenue();
    setRevenueData(revenueByChannelAndProduct);
    setTxFeeData(txFeeByChannelAndProduct);
    setCogsData(cogsByChannelAndProduct);
    setNetRevenueData(netRevenueByChannelAndProduct);
    setGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, channelInputs]);

  useEffect(() => {
    const newRevenueTableData = [];

    channelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelRevenue =
          revenueData[channel.selectedChannel + " - " + channel.productName] ||
          [];
        const channelTxFee =
          txFeeData[channel.selectedChannel + " - " + channel.productName] ||
          [];
        const channelCOGS =
          cogsData[channel.selectedChannel + " - " + channel.productName] || [];

        const customerInput = customerInputs.find(
          (input) => input.channelName === channel.selectedChannel
        );
        const begin = customerInput ? customerInput.beginMonth : 1;
        const end = customerInput ? customerInput.endMonth : numberOfMonths;

        const revenueRow = {
          key:
            channel.selectedChannel +
            " - " +
            channel.productName +
            " - Revenue",
          channelName:
            channel.selectedChannel +
            " - " +
            channel.productName +
            " - Revenue",
        };
        const txFeeRow = {
          key:
            channel.selectedChannel + " - " + channel.productName + " - Txfee",
          channelName:
            channel.selectedChannel + " - " + channel.productName + " - Txfee",
        };
        const cogsRow = {
          key:
            channel.selectedChannel + " - " + channel.productName + " - COGS",
          channelName:
            channel.selectedChannel + " - " + channel.productName + " - COGS",
        };

        channelRevenue.forEach((value, index) => {
          if (index + 1 >= begin && index + 1 <= end) {
            revenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
            txFeeRow[`month${index + 1}`] = parseFloat(
              channelTxFee[index]
            ).toFixed(2);
            cogsRow[`month${index + 1}`] = parseFloat(
              channelCOGS[index]
            ).toFixed(2);
          } else {
            revenueRow[`month${index + 1}`] = "0.00";
            txFeeRow[`month${index + 1}`] = "0.00";
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
          netRevenueData[
            channel.selectedChannel + " - " + channel.productName
          ] || [];
        netRevenueArray.forEach((value, index) => {
          // ...existing code...
          netRevenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
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
          grossProfitRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
        });

        newRevenueTableData.push(revenueRow);
        newRevenueTableData.push(txFeeRow);
        newRevenueTableData.push(cogsRow);
        newRevenueTableData.push(netRevenueRow);
        newRevenueTableData.push(grossProfitRow);
      }
    });

    setRevenueTableData(newRevenueTableData);
  }, [
    channelInputs,
    revenueData,
    txFeeData,
    cogsData,
    customerInputs,
    numberOfMonths,
    netRevenueData,
    grossProfitData,
  ]);

  useEffect(() => {
    const seriesData = Object.entries(revenueData).map(([key, data]) => {
      return { name: key, data };
    });

    setRevenueChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [revenueData]);
  return (
    <section aria-labelledby="sales-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="sales-heading"
      >
        Sales Section
      </h2>

      {channelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Product Name:</span>
            <Input
              required
              className="col-start-2"
              value={input.productName}
              onChange={(e) =>
                handleChannelInputChange(index, "productName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Price:</span>
            <Input
              required
              className="col-start-2"
              value={input.price}
              onChange={(e) =>
                handleChannelInputChange(index, "price", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Multiples:</span>
            <Input
              required
              className="col-start-2"
              value={input.multiples}
              onChange={(e) =>
                handleChannelInputChange(index, "multiples", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Tx Fee (%):</span>
            <Input
              required
              className="col-start-2"
              value={input.txFeePercentage}
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "txFeePercentage",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">COGS (%):</span>
            <Input
              required
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
            <span className="font-medium">Sales Channel:</span>
            <Select
              onValueChange={(value) =>
                handleChannelInputChange(index, "selectedChannel", value)
              }
              value={
                input.selectedChannel !== null ? input.selectedChannel : ""
              }
            >
              <SelectTrigger id={`select-channel-${index}`}>
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
            <span className="font-medium">Channel Allocation (%):</span>
            <Input
              required
              className="col-start-2"
              type="number"
              min="0"
              max="100"
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
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeChannelInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleAddNewChannelInput}
      >
        Add New
      </button>
    </section>
  );
};

export default SalesSection;
