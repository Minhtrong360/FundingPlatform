import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";

const CustomerSection = ({
  customerInputs,
  setCustomerInputs,
  numberOfMonths,
  customerGrowthData,
  setCustomerGrowthData,
  isSaved,
  setIsSaved,
}) => {
  const [customerGrowthChart, setCustomerGrowthChart] = useState({
    options: {
      chart: {
        id: "customer-growth-chart",
        type: "bar",
        height: 350,
      },

      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: { text: "Number of Customers" },
        style: {
          fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
          fontWeight: "600", // Cỡ chữ semibold
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "stepline" },
      markers: { size: 1 },
    },
    series: [],
  });

  const [tempCustomerInputs, setTempCustomerInputs] = useState(customerInputs);
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
      growthPerMonth: 10,
      channelName: "New channel",
      beginMonth: 1,
      endMonth: 15,
      beginCustomer: 0,
      churnRate: 0,
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
    setCustomerGrowthData(calculatedData);
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
  };

  useEffect(() => {
    if (isSaved) {
      setCustomerInputs(tempCustomerInputs);
      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
        <section aria-labelledby="customers-heading" className="mb-8">
          <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Here's a list of common customer channels that startups often utilize: Website, Social Media,Email Marketing, Referral Programs, Events and Networking, Direct Sales, Subscription.">
            <h2
              className="text-2xl font-semibold mb-4 flex items-center"
              id="customers-heading"
            >
              1. Identify your customer{" "}
              <InfoCircleOutlined style={{ marginLeft: "0.5rem" }} />
            </h2>
            <p>
              Creating a customer channel is often considered the very first
              step in building a financial model for several strategic reasons,
              especially in the context of new businesses or products. This
              approach is rooted in the Lean Startup methodology, which
              emphasizes the importance of understanding and engaging with your
              market as early as possible.
            </p>
          </Tooltip>
          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            >
              Selected channel name:
            </label>
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
                className="bg-white rounded-md shadow p-6 my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Channel Name:</span>
                  <Input
                    className="col-start-2"
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
                  <span className=" flex items-center">Begin Customer:</span>
                  <Input
                    className="col-start-2"
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
                  <span className=" flex items-center">Churn rate:</span>
                  <Input
                    className="col-start-2"
                    type="number"
                    min="0"
                    value={input.churnRate}
                    onChange={(e) =>
                      handleInputChange(input?.id, "churnRate", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Customer/month:</span>
                  <Input
                    className="col-start-2"
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
                  <span className=" flex items-center">Growth/month (%):</span>
                  <Input
                    className="col-start-2"
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
                  <span className=" flex items-center">Begin Month:</span>
                  <Input
                    className="col-start-2"
                    type="number"
                    min="1"
                    value={input.beginMonth}
                    onChange={(e) =>
                      handleInputChange(input?.id, "beginMonth", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">End Month:</span>
                  <Input
                    className="col-start-2"
                    type="number"
                    min="1"
                    value={input.endMonth}
                    onChange={(e) =>
                      handleInputChange(input?.id, "endMonth", e.target.value)
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
      <div className="w-full lg:w-2/3 p-4 ">
        <h3 className="text-2xl font-semibold ">Customer Table</h3>
        <Table
          className="overflow-auto my-8"
          dataSource={customerTableData}
          columns={customerColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Customer Chart</h3>
        <Chart
          options={customerGrowthChart.options}
          series={customerGrowthChart.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default CustomerSection;
