import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table, Tooltip, message } from "antd";
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
} from "../../../features/SaleSlice";
import { formatNumber, parseNumber } from "../../../features/CostSlice";

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
    setRenderChannelForm(channelInputs[0]?.id);
  }, [channelInputs]);

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
  }, [customerGrowthData, channelInputs, numberOfMonths]);

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
  }, [customerGrowthData, tempChannelInputs, numberOfMonths]);

  //RevenueTable

  const transformRevenueDataForTable = () => {
    const transformedRevenueTableData = {};

    const calculatedChannelRevenue = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        tempChannelInputs
      )
    );

    Object.keys(calculatedChannelRevenue.revenueByChannelAndProduct).forEach(
      (channelProductKey) => {
        const [selectedChannel, selectedProduct] =
          channelProductKey.split(" - ");
        if (
          selectedChannel ==
            tempChannelInputs.find((input) => input.id == renderChannelForm)
              ?.selectedChannel &&
          selectedProduct ==
            tempChannelInputs.find((input) => input.id == renderChannelForm)
              ?.productName
        ) {
          const revenueRowKey = `Revenue`;
          const revenueDeductionRowKey = `Deductions`;
          const cogsRowKey = `COGS`;
          const netRevenueRowKey = `Net Revenue`;
          const grossProfitRowKey = `Gross Profit`;

          transformedRevenueTableData[revenueRowKey] = {
            key: revenueRowKey,
            channelName: revenueRowKey,
          };
          transformedRevenueTableData[revenueDeductionRowKey] = {
            key: revenueDeductionRowKey,
            channelName: revenueDeductionRowKey,
          };

          transformedRevenueTableData[netRevenueRowKey] = {
            key: netRevenueRowKey,
            channelName: netRevenueRowKey,
          };

          transformedRevenueTableData[cogsRowKey] = {
            key: cogsRowKey,
            channelName: cogsRowKey,
          };

          transformedRevenueTableData[grossProfitRowKey] = {
            key: grossProfitRowKey,
            channelName: grossProfitRowKey,
          };

          calculatedChannelRevenue.revenueByChannelAndProduct[
            channelProductKey
          ].forEach((value, index) => {
            transformedRevenueTableData[revenueRowKey][`month${index + 1}`] =
              formatNumber(parseFloat(value)?.toFixed(2));
          });
          calculatedChannelRevenue.DeductionByChannelAndProduct[
            channelProductKey
          ].forEach((value, index) => {
            transformedRevenueTableData[revenueDeductionRowKey][
              `month${index + 1}`
            ] = formatNumber(parseFloat(value)?.toFixed(2));
          });
          calculatedChannelRevenue.cogsByChannelAndProduct[
            channelProductKey
          ].forEach((value, index) => {
            transformedRevenueTableData[cogsRowKey][`month${index + 1}`] =
              formatNumber(parseFloat(value)?.toFixed(2));
          });
          calculatedChannelRevenue.netRevenueByChannelAndProduct[
            channelProductKey
          ].forEach((value, index) => {
            transformedRevenueTableData[netRevenueRowKey][`month${index + 1}`] =
              formatNumber(parseFloat(value)?.toFixed(2));
          });
          calculatedChannelRevenue.grossProfitByChannelAndProduct[
            channelProductKey
          ].forEach((value, index) => {
            transformedRevenueTableData[grossProfitRowKey][
              `month${index + 1}`
            ] = formatNumber(parseFloat(value)?.toFixed(2));
          });
        }
      }
    );

    return Object.values(transformedRevenueTableData);
  };

  const revenueTableData = transformRevenueDataForTable();

  const handleActualChange = (value, record, field) => {};

  //RevenueColumns
  const revenueColumns = [
    {
      fixed: "left",
      title: "Revenue_Table",
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).flatMap((month) => ([
      {
        title: `Month_${month} Forecast`,
        dataIndex: `month${month}`,
        key: `month${month}_forecast`,
      },
      {
        title: `Month_${month} Actual`,
        dataIndex: `month${month}_actual`,
        key: `month${month}_actual`,
        render: (text, record, index) => (
          <input 
            type="text" 
            className="py-1 px-2 block w-full border-gray-200 rounded-lg text-xs focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
            value={record[`month${month}`]} // Set value to corresponding forecast value
            onChange={e => handleActualChange(e.target.value, record, `month${month}_actual`)} 
          />
        )
      }
    ])),
  ];

  //RevenueChart

  useEffect(() => {
    const seriesData = Object.entries(tempRevenueData).map(([key, data]) => {
      return { name: key, data };
    });

    setRevenue((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempRevenueData, numberOfMonths]);

  const handleChannelChange = (event) => {
    setRenderChannelForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  useEffect(() => {
    if (isSaved) {
      dispatch(setChannelInputs(tempChannelInputs));

      dispatch(setRevenueData(tempRevenueData));

      dispatch(setRevenueDeductionData(tempRevenueDeductionData));

      dispatch(setCogsData(tempCogsData));

      dispatch(setNetRevenueData(tempNetRevenueData));

      dispatch(setGrossProfitData(tempGrossProfitData));

      const sales = calculateYearlySales(tempRevenueData);

      dispatch(setYearlySales(sales));

      setIsSaved(false);
    }
  }, [isSaved]);

  useEffect(() => {
    const sales = calculateYearlySales(tempRevenueData);
    dispatch(setYearlySales(sales));
  }, [tempRevenueData, numberOfMonths, isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 sm:border-r-2 border-r-0 sm:border-b-0 border-b-2">
        <section aria-labelledby="sales-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center mt-4"
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
                className="bg-white rounded-md shadow p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
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
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">Price:</span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                    className="col-start-2 border-gray-200"
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
                      className="col-start-2 border-gray-200"
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
                    className="col-start-2 border-gray-200"
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

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Channel Allocation (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                    className="border-gray-200"
                    onValueChange={(value) =>
                      handleChannelInputChange(input.id, "daysGetPaid", value)
                    }
                    value={input.daysGetPaid !== null ? input.daysGetPaid : ""}
                    disabled
                  >
                    <SelectTrigger
                      id={`select-days-get-paid-${index}`}
                      className="border-solid border-[1px] border-gray-200"
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
                    className="bg-red-600 text-white py-0.5 px-2 rounded"
                    onClick={() => removeChannelInput(input.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4 mr-4"
            onClick={addNewChannelInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4"
            onClick={handleSave}
          >
            Save changes
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-2xl font-semibold mb-4">Revenue by Product</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={revenueTableData}
          columns={revenueColumns}
          pagination={false}
          bordered
        />
        <h3 className="text-2xl font-semibold my-8">Revenue Chart</h3>
        <Chart
          options={revenue.options}
          series={revenue.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default SalesSection;
