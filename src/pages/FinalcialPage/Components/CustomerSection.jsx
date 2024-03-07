import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import Chart from "react-apexcharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import SelectField from "../../../components/SelectField";

const CustomerSection = ({
  customerInputs,
  setCustomerInputs,
  numberOfMonths,
  customerGrowthData,
  setCustomerGrowthData,
  channelNames,
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

  const [renderCustomerForm, setRenderCustomerForm] = useState(
    customerInputs[0].channelName
  );

  const handleAddNewCustomer = (input) => {
    setCustomerInputs([
      ...customerInputs,
      {
        customersPerMonth: 100,
        growthPerMonth: 10,
        channelName: "New channel",
        beginMonth: 1,
        endMonth: 15,
      },
    ]);
  };

  const removeCustomerInput = (channelName) => {
    const newInputs = customerInputs.filter(
      (input) => input.channelName !== channelName
    );
    setCustomerInputs(newInputs);
  };

  const handleInputChange = (channelName, field, value) => {
    const newInputs = customerInputs.map((input) => {
      if (input.channelName === channelName) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setCustomerInputs(newInputs);
  };

  const calculateCustomerGrowth = (customerInputs) => {
    return customerInputs.map((channel) => {
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

  // CustomerTableData
  const transformedCustomerTableData = {};
  customerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = customerInputs.find(
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
    const seriesData = customerGrowthData.map((channelData) => {
      return {
        name: channelData[0]?.channelName || "Unknown Channel",
        data: channelData.map((data) => data.customers),
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));
  }, [customerGrowthData, numberOfMonths]);

  const handleChannelInputChange = (value) => {
    setRenderCustomerForm(value);
  };

  console.log("channelNames", channelNames);
  console.log("renderCustomerForm", renderCustomerForm);

  useEffect(() => {
    if (
      renderCustomerForm === "New channel" &&
      !customerInputs.some((input) => input.channelName === "New channel")
    ) {
      handleAddNewCustomer();
    }
  }, [renderCustomerForm, customerInputs]);

  console.log("customerInputs", customerInputs);

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
            Creating a customer channel is often considered the very first step in building a financial model for several strategic reasons, especially in the context of new businesses or products. This approach is rooted in the Lean Startup methodology, which emphasizes the importance of understanding and engaging with your market as early as possible.
            </p>
          </Tooltip>
          <div className="mt-4">
            <SelectField
              label="Selected channel name:"
              value={renderCustomerForm}
              onChange={(e) => handleChannelInputChange(e.target.value)}
              required
              options={[...channelNames, "New channel"]} // Thay thế bằng danh sách các tùy chọn bạn muốn
            />
          </div>

          {customerInputs
            .filter((input) => input.channelName === renderCustomerForm) // Sử dụng biến renderForm
            .map((input, index) => (
              <div
                key={renderCustomerForm}
                className="bg-white rounded-md shadow p-6 my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Channel Name:</span>
                  <Input
                    className="col-start-2"
                    value={input.channelName}
                    onChange={(e) =>
                      handleInputChange(
                        renderCustomerForm,
                        "channelName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">
                    Customers per month:
                  </span>
                  <Input
                    className="col-start-2"
                    value={input.customersPerMonth}
                    onChange={(e) =>
                      handleInputChange(
                        renderCustomerForm,
                        "customersPerMonth",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Growth Per Month:</span>
                  <Input
                    className="col-start-2"
                    value={input.growthPerMonth}
                    onChange={(e) =>
                      handleInputChange(
                        renderCustomerForm,
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
                      handleInputChange(
                        renderCustomerForm,
                        "beginMonth",
                        e.target.value
                      )
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
                      handleInputChange(
                        renderCustomerForm,
                        "endMonth",
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

          <button className="bg-blue-600 text-white py-1 px-4 rounded mt-4">
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
