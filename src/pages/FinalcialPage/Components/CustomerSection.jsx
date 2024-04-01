import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip, message } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerInputs,
  setYearlyAverageCustomers,
  setCustomerGrowthData,
  calculateYearlyAverage,
  calculateCustomerGrowth,
} from "../../../features/CustomerSlice";
import {
  calculateChannelRevenue,
  calculateYearlySales,
  setYearlySales,
} from "../../../features/SaleSlice";
import { formatNumber, parseNumber } from "../../../features/CostSlice";

const CustomerSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  customerGrowthChart,
  setCustomerGrowthChart,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const { customerInputs, customerGrowthData } = useSelector(
    (state) => state.customer
  );

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
  const [tempCustomerInputs, setTempCustomerInputs] = useState(customerInputs);

  useEffect(() => {
    setTempCustomerInputs(customerInputs);
    setRenderCustomerForm(customerInputs[0]?.id);
  }, [customerInputs]);

  const [tempCustomerGrowthData, setTempCustomerGrowthData] =
    useState(customerGrowthData);

  const [renderCustomerForm, setRenderCustomerForm] = useState(
    tempCustomerInputs[0]?.id
  );

  const handleAddNewCustomer = () => {
    const maxId = Math.max(...tempCustomerInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      customersPerMonth: 100,
      growthPerMonth: 2,
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
    const newInputs = tempCustomerInputs.filter((input) => input?.id != id);

    setTempCustomerInputs(newInputs);
    setRenderCustomerForm(newInputs[0]?.id);
  };

  const handleInputChange = (id, field, value) => {
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
    setTempCustomerGrowthData(calculatedData);
  }, [tempCustomerInputs, numberOfMonths]);

  const transformedCustomerTableData = {};
  tempCustomerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === data.channelName
      );
      if (customerInput) {
        if (!transformedCustomerTableData[data.channelName]) {
          transformedCustomerTableData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            parseFloat(data.customers)?.toFixed(2);
        } else {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            "0.00";
        }
      }
    });
  });

  const customerTableData = Object.values(transformedCustomerTableData)
    .filter((data) =>
      tempCustomerInputs.find(
        (input) =>
          input.id == renderCustomerForm &&
          input.channelName === data.channelName
      )
    )
    .map((curr) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === curr.channelName
      );

      const startRow = {
        key: `${curr.channelName}-start`,
        channelName: `${curr.channelName} (Existing)`,
      };
      const beginRow = {
        key: `${curr.channelName}-begin`,
        channelName: `${curr.channelName} (Begin)`,
      };
      const churnRow = {
        key: `${curr.channelName}-churn`,
        channelName: `${curr.channelName} (Churn)`,
      };
      const endRow = {
        ...curr,
        key: `${curr.channelName}-end`,
        channelName: `${curr.channelName} (End)`,
      };
      const channelAddRow = {
        key: `${curr.channelName}-add`,
        channelName: `${curr.channelName} (Add)`,
      }; // Update the current channel row to Channel (Add)

      let currentCustomers = parseFloat(customerInput.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= customerInput.beginMonth && i <= customerInput.endMonth) {
          const channelValue = currentCustomers.toFixed(2); // Calculate channel value
          channelAddRow[`month${i}`] = formatNumber(channelValue); // Assign channel value to Channel (Add) row of the current month
          currentCustomers *=
            1 + parseFloat(customerInput.growthPerMonth) / 100;
        } else {
          channelAddRow[`month${i}`] = "0.00"; // Set to 0 for months outside the channel's active period
        }
        startRow[`month${i}`] = "0.00";
        beginRow[`month${i}`] = "0.00";
        churnRow[`month${i}`] = "0.00";
      }

      if (customerInput) {
        startRow[`month${customerInput.beginMonth}`] = formatNumber(
          parseFloat(customerInput.beginCustomer).toFixed(2)
        );
        beginRow[`month${customerInput.beginMonth}`] =
          startRow[`month${customerInput.beginMonth}`];

        for (let i = customerInput.beginMonth; i <= numberOfMonths; i++) {
          if (i > customerInput.beginMonth) {
            beginRow[`month${i}`] = formatNumber(endRow[`month${i - 1}`]); // Set Begin row of month i to End row of month i-1
          }
          endRow[`month${i}`] = formatNumber(endRow[`month${i}`]);
          const beginValue = parseFloat(beginRow[`month${i}`]) || 0; // Begin value for the current month

          const churnValue = (
            beginValue *
            (customerInput.churnRate / 100)
          ).toFixed(2); // Calculate churn value
          churnRow[`month${i}`] = churnValue; // Assign churn value to Churn row of the current month
        }
      }

      return [startRow, beginRow, channelAddRow, churnRow, endRow];
    })
    .flat(); // Flatten the array of arrays to a single array

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const customerColumns = [
    {
      fixed: "left",
      title: <div>Channel_Name</div>,
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
        onCell: (record) => ({
          style: {
            borderRight: "1px solid #f0f0f0", // Add border right style
          },
        }),
      };
    }),
  ];

  useEffect(() => {
    const seriesData = tempCustomerGrowthData.map((channelData) => {
      return {
        name: channelData[0]?.channelName || "Unknown Channel",
        data: channelData.map((data) => data.customers),
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));
  }, [tempCustomerGrowthData, numberOfMonths]);

  const handleSelectChange = (event) => {
    setRenderCustomerForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };
  const channelInputs = useSelector((state) => state.sales.channelInputs);

  useEffect(() => {
    if (isSaved) {
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
      setIsSaved(false);
    }
  }, [isSaved]);

  useEffect(() => {
    const averages = calculateYearlyAverage(
      tempCustomerGrowthData,
      numberOfMonths
    );
    dispatch(setYearlyAverageCustomers(averages));
  }, [tempCustomerGrowthData, numberOfMonths, isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 lg:border-r-2 border-r-0 lg:border-b-0 border-b-2">
        <section aria-labelledby="customers-heading" className="mb-8">
          <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
            <h2
              className="text-2xl font-semibold mb-4 flex items-center mt-4"
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
              className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderCustomerForm}
              onChange={handleSelectChange}
            >
              {tempCustomerInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.channelName}
                </option>
              ))}
            </select>
          </div>

          {tempCustomerInputs
            .filter((input) => input?.id == renderCustomerForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Channel Name:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                    className="col-start-2 border-gray-200"
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
                  <span className=" flex items-center text-sm">
                    New Customer /month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                    Growth/month (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                  <span className=" flex items-center text-sm">
                    Begin Month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min={1}
                    value={input.beginMonth}
                    onChange={(e) =>
                      handleInputChange(input?.id, "beginMonth", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">End Month:</span>
                  <Input
                    className="col-start-2 border-gray-200"
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
                    className="col-start-2 border-gray-200"
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
                    className="col-start-2 border-gray-200"
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
                    className="bg-red-600 text-white py-2 px-4 rounded text-sm mt-4"
                    onClick={() => removeCustomerInput(input.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4 mr-4"
            onClick={handleAddNewCustomer}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4"
            onClick={handleSave}
          >
            Save changes
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0 ">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold">Customer Table</h3>
          <Table
            className="overflow-auto  my-8"
            size="small"
            dataSource={customerTableData}
            columns={customerColumns}
            pagination={false}
            bordered
          />
        </div>
        <h3 className="text-2xl font-semibold my-8">Customer Chart</h3>
        <Chart
          options={customerGrowthChart.options}
          series={customerGrowthChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default CustomerSection;
