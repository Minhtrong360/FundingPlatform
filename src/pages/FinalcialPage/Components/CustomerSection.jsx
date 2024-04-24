import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Card, Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerInputs,
  setYearlyAverageCustomers,
  setCustomerGrowthData,
  calculateYearlyAverage,
  calculateCustomerGrowth,
  transformCustomerData,
  generateCustomerTableData,
  setCustomerTableData,
} from "../../../features/CustomerSlice";
import {
  calculateChannelRevenue,
  calculateYearlySales,
  setYearlySales,
} from "../../../features/SaleSlice";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { supabase } from "../../../supabase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { useParams } from "react-router-dom";

const CustomerSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  customerGrowthChart,
  setCustomerGrowthChart,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const { customerInputs, customerGrowthData, customerTableData } = useSelector(
    (state) => state.customer
  );

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
  const [tempCustomerInputs, setTempCustomerInputs] = useState(customerInputs);

  useEffect(() => {
    setTempCustomerInputs(customerInputs);
    setRenderCustomerForm("all");
  }, [customerInputs]);

  const [tempCustomerGrowthData, setTempCustomerGrowthData] =
    useState(customerGrowthData);

  const [renderCustomerForm, setRenderCustomerForm] = useState("all");

  const handleAddNewCustomer = () => {
    const maxId = Math.max(...tempCustomerInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      customersPerMonth: 100,
      growthPerMonth: 2,
      customerGrowthFrequency: "Monthly",
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

    const calculateTransformedCustomerTableData = transformCustomerData(
      calculatedData,
      tempCustomerInputs
    );

    const calculateCustomerTableData = generateCustomerTableData(
      calculateTransformedCustomerTableData,
      tempCustomerInputs,
      numberOfMonths,
      renderCustomerForm
    );

    dispatch(setCustomerTableData(calculateCustomerTableData));

    setTempCustomerGrowthData(calculatedData);
  }, [tempCustomerInputs, numberOfMonths, renderCustomerForm]);

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

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const customerColumns = [
    {
      fixed: "left",
      title: <div>Channel Name</div>,
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
        align: "right",
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

  const { id } = useParams();
  useEffect(() => {
    const saveData = async () => {
      try {
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

          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);
          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
            const newInputData = JSON.parse(existingData[0].inputData);

            const calculatedData = calculateCustomerGrowth(
              tempCustomerInputs,
              numberOfMonths
            );
            const averages = calculateYearlyAverage(
              calculatedData,
              numberOfMonths
            );

            newInputData.customerInputs = tempCustomerInputs;
            newInputData.yearlyAverageCustomers = averages;
            newInputData.yearlySales = yearlySale;

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
    const averages = calculateYearlyAverage(
      tempCustomerGrowthData,
      numberOfMonths
    );
    dispatch(setYearlyAverageCustomers(averages));
  }, [tempCustomerGrowthData, numberOfMonths, isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
        <section aria-labelledby="customers-heading" className="mb-8">
          <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Examples:  Online, Offline, Social Media, Email Marketing, Referrals, Direct Sales, Subscription...">
            <h2
              className="text-2xl font-semibold mb-8 flex items-center"
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
              <option value="all">All</option>
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
                className="bg-white rounded-md shadow-xl p-6 border my-4"
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
                  <span className="flex items-center text-sm">
                    Adding (First month)
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
                    Growth rate (%):
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
                  <span className="flex items-center text-sm">Frequency:</span>
                  <Select
                    className="border-gray-200"
                    onValueChange={(value) =>
                      handleInputChange(
                        input?.id,
                        "customerGrowthFrequency",
                        value
                      )
                    }
                    value={input.customerGrowthFrequency}
                  >
                    <SelectTrigger
                      id={`select-customerGrowthFrequency-${input?.id}`}
                      className="border-solid border-[1px] border-gray-200"
                    >
                      <SelectValue placeholder="Select Growth Frequency" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Semi-Annually">
                        Semi-Annually
                      </SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
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

          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          </div>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0 ">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold">Customer Table</h3>
          <Table
            className="overflow-auto  my-8  shadow-xl rounded-md"
            size="small"
            dataSource={customerTableData}
            columns={customerColumns}
            pagination={false}
            bordered
            rowClassName={(record) =>
              record.key === record.channelName ? "font-bold" : ""
            }
          />
        </div>
        <h3 className="text-2xl font-semibold my-8">Customer Chart</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col shadow-xl">
            <Chart
              options={customerGrowthChart.options}
              series={customerGrowthChart.series}
              type="bar"
              height={350}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;

<div className="w-full h-full flex flex-col lg:flex-row">
  <div className="w-full lg:w-1/4 sm:p-4 p-0 "></div>
  <div className="w-full lg:w-3/4 sm:p-4 p-0 "></div>
</div>;
