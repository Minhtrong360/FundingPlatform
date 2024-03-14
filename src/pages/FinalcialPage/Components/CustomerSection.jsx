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
} from "../../../features/CustomerSlice";

const CustomerSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  customerGrowthChart,
  setCustomerGrowthChart,
}) => {
  const dispatch = useDispatch();
  const { yearlyAverageCustomers, customerInputs, customerGrowthData } =
    useSelector((state) => state.customer);

  const [tempCustomerInputs, setTempCustomerInputs] = useState(
    customerInputs.map((input) => ({
      ...input,
      acquisitionCost: input.acquisitionCost || 0,
    }))
  );

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

  const calculateCustomerGrowth = (tempCustomerInputs) => {
    return tempCustomerInputs.map((channel) => {
      let customers = [];
      let currentCustomers = parseFloat(channel.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= channel.beginMonth && i <= channel.endMonth) {
          customers.push({
            month: i,
            customers: currentCustomers,
            channelName: channel.channelName,
          });
          currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
        } else {
          customers.push({
            month: i,
            customers: 0,
            channelName: channel.channelName,
          });
        }
      }
      return customers;
    });
  };

  //CustomerUseEffect
  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      numberOfMonths
    );
    dispatch(setCustomerGrowthData(calculatedData));
  }, [customerInputs, numberOfMonths]);

  //CustomerUseEffect
  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      tempCustomerInputs,
      numberOfMonths
    );
    setTempCustomerGrowthData(calculatedData);
  }, [tempCustomerInputs, numberOfMonths]);

  // CustomerTableData
  const transformedCustomerTableData = {};
  tempCustomerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === data.channelName
      );
      if (customerInput) {
        const beginCustomerValue = parseFloat(customerInput.beginCustomer) || 0;
        if (!transformedCustomerTableData[data.channelName]) {
          transformedCustomerTableData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        // Check if the month is within the range
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            parseFloat(data.customers)?.toFixed(2);
        } else {
          // Set value to 0 if outside the range
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            "0.00";
        }
      }
    });
  });

  const customerTableData = Object.values(transformedCustomerTableData).map(
    (row) => {
      for (let month = 1; month <= numberOfMonths; month++) {
        if (!row.hasOwnProperty(`month${month}`)) {
          row[`month${month}`] = "0.00";
        }
      }
      return row;
    }
  );

  // CustomerColumns
  const customerColumns = [
    {
      fixed: "left",
      title: "Channel Name",
      dataIndex: "channelName",
      key: "channelName",
    },

    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).map((month) => ({
      title: `Month_${month}`,
      dataIndex: `month${month}`,
      key: `month${month}`,
    })),
  ];

  //CustomerChart

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

  useEffect(() => {
    if (isSaved) {
      dispatch(setCustomerInputs(tempCustomerInputs));
      setIsSaved(false);
    }
  }, [isSaved]);

  // Generate ChannelDataTable for each selected channel
  const ChannelDataTables = {};
  tempCustomerInputs.forEach((input) => {
    const dataTable = {
      Begin: {
        channelName: "Begin",
        ...Array.from({ length: numberOfMonths }, (_, i) => ({
          [`month${i + 1}`]:
            i === 0
              ? (parseFloat(input.beginCustomer) || 0).toFixed(2)
              : "0.00",
        })),
      },
      Add: {
        channelName: "Add",
        ...customerTableData.find(
          (data) => data.channelName === input.channelName
        ),
      },
      Churn: {
        channelName: "Churn",
        ...Array.from({ length: numberOfMonths }, (_, i) => ({
          [`month${i + 1}`]: "0.00",
        })),
      },
      End: {
        channelName: "End",
        ...Array.from({ length: numberOfMonths }, (_, i) => ({
          [`month${i + 1}`]: "0.00",
        })),
      },
    };
    ChannelDataTables[`${input.channelName}DataTable`] = dataTable;
  });

  // Calculate monthly average of customers for each year
  const calculateYearlyAverage = (tempCustomerGrowthData, numberOfMonths) => {
    const yearlyAverages = [];
    for (let i = 0; i < numberOfMonths; i += 12) {
      let totalCustomers = 0;
      for (let j = i; j < i + 12 && j < numberOfMonths; j++) {
        tempCustomerGrowthData.forEach((channelData) => {
          totalCustomers += parseFloat(channelData[j]?.customers) || 0;
        });
      }
      const averageCustomers = totalCustomers / 12;
      yearlyAverages.push(averageCustomers.toFixed(2));
    }
    return yearlyAverages;
  };

  useEffect(() => {
    const averages = calculateYearlyAverage(
      tempCustomerGrowthData,
      numberOfMonths
    );
    dispatch(setYearlyAverageCustomers(averages));
  }, [tempCustomerGrowthData, numberOfMonths, isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="customers-heading" className="mb-8">
          <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
            <h2
              className="text-2xl font-semibold mb-4 flex items-center"
              id="customers-heading"
            >
              1. Customer channel{" "}
              <InfoCircleOutlined style={{ marginLeft: "0.5rem" }} />
            </h2>
            <p>
              Creating a customer channel is often considered the very first
              step in building a financial model.
            </p>
          </Tooltip>
          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                <div className="grid grid-cols-2 gap-4 mb-4">
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
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Customer/month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.customersPerMonth}
                    onChange={(e) =>
                      handleInputChange(
                        input?.id,
                        "customersPerMonth",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Growth/month (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.growthPerMonth}
                    onChange={(e) =>
                      handleInputChange(
                        input?.id,
                        "growthPerMonth",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Begin Month:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="1"
                    value={input.beginMonth}
                    onChange={(e) =>
                      handleInputChange(input?.id, "beginMonth", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">End Month:</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="1"
                    value={input.endMonth}
                    onChange={(e) =>
                      handleInputChange(input?.id, "endMonth", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Begin Customer:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="0"
                    value={input.beginCustomer}
                    onChange={(e) =>
                      handleInputChange(
                        input?.id,
                        "beginCustomer",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Churn rate (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="0"
                    value={input.churnRate}
                    onChange={(e) =>
                      handleInputChange(input?.id, "churnRate", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center text-sm">
                    Acquisition cost:
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="0"
                    value={input.acquisitionCost}
                    onChange={(e) =>
                      handleInputChange(
                        input?.id,
                        "acquisitionCost",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-4 rounded"
                    onClick={() => removeCustomerInput(renderCustomerForm)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4 mr-4"
            onClick={handleAddNewCustomer}
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
      <div className="w-full lg:w-3/4 p-4 ">
        {tempCustomerInputs
          .filter((input) => input?.id == renderCustomerForm)
          .map((input) => (
            <div key={input.id} className="mb-8">
              <h3 className="text-2xl font-semibold">
                {input.channelName} Table
              </h3>
              <Table
                className="overflow-auto my-8"
                size="small"
                dataSource={customerTableData.filter(
                  (data) => data.channelName === input.channelName
                )}
                columns={customerColumns}
                pagination={false}
              />
              {Object.entries(ChannelDataTables).map(
                ([tableName, dataTable]) => (
                  <div key={tableName}>
                    <h3 className="text-2xl font-semibold">{tableName}</h3>
                    <Table
                      className="overflow-auto my-8"
                      size="small"
                      dataSource={Object.values(dataTable)}
                      columns={customerColumns}
                      pagination={false}
                    />
                  </div>
                )
              )}
            </div>
          ))}
        <h3 className="text-2xl font-semibold my-8">Customer Chart</h3>
        <Chart
          options={customerGrowthChart.options}
          series={customerGrowthChart.series}
          type="bar"
          height={350}
        />

        <h3 className="text-2xl font-semibold my-8">
          Yearly Average Customers
        </h3>
        <div className="flex items-center">
          {yearlyAverageCustomers.map((average, index) => (
            <div key={index} className="mr-4">
              <span className="font-semibold">Year {index + 1}:</span> {average}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;
