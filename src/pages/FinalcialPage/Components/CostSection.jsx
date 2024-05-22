import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Button, Card, FloatButton, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import {
  setCostInputs,
  setCostData,
  calculateCostData,
  transformCostDataForTable,
} from "../../../features/CostSlice";

import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";

const CostSection = ({
  numberOfMonths,

  isSaved,
  setIsSaved,
  handleSubmit,
}) => {
  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const { costInputs, costData } = useSelector((state) => state.cost);
  const dispatch = useDispatch();

  const [tempCostInput, setTempCostInput] = useState(costInputs);

  const [tempCostData, setTempCostData] = useState(costData);

  const [renderCostForm, setRenderCostForm] = useState(costInputs[0]?.id);

  useEffect(() => {
    setTempCostInput(costInputs);
  }, [costInputs]);

  const addNewCostInput = () => {
    const maxId = Math.max(...tempCostInput.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      costName: "",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      growthFrequency: "Monthly",
      endMonth: 6,
      costType: "Sales, Marketing Cost",
    };
    setTempCostInput([...tempCostInput, newCustomer]);
    setRenderCostForm(newId.toString());
  };

  const removeCostInput = (id) => {
    const indexToRemove = tempCostInput.findIndex((input) => input?.id == id);
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempCostInput.slice(0, indexToRemove),
        ...tempCostInput.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempCostInput(newInputs);
      setRenderCostForm(prevInputId);
    }
  };

  const handleCostInputChange = (id, field, value) => {
    const newInputs = tempCostInput.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempCostInput(newInputs);
  };

  // Function to calculate cost data

  // Function to transform cost data for table

  // useEffect to update cost data when cost inputs or number of months change
  useEffect(() => {
    const calculatedData = calculateCostData(costInputs, numberOfMonths);
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths]);

  // useEffect to update temporary cost data when temp cost inputs or number of months change
  useEffect(() => {
    const calculatedData = calculateCostData(tempCostInput, numberOfMonths);
    setTempCostData(calculatedData);
  }, [tempCostInput, numberOfMonths]);

  // Function to generate columns for the cost table
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

  const costColumns = [
    {
      fixed: "left",
      title: <div>Cost name</div>,
      dataIndex: "costName",
      key: "costName",
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

  // State for cost chart
  const [costChart, setCostChart] = useState({
    options: {
      chart: {
        fontFamily: "Sora, sans-serif",
        id: "cost-chart",
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        },
        zoom: { enabled: false },
        animations: {
          enabled: false,
        },
        
      },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      grid: { show: false },
      xaxis: {
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: 0,
          show: true,
          style: {
            fontFamily: "Sora, sans-serif",
          },
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true, // Show y-axis line
        },

        labels: {
          show: true,
          style: {
            fontFamily: "Sora, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Cost ($)",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      // fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight", width: 1 },
    },
    series: [],
  });

  // Function to handle select change
  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedInput = tempCostInput.find(
      (input) => input.id.toString() === selectedId
    );

    if (
      selectedInput?.fundraisingType === "Paid in Capital" &&
      selectedInput.fundraisingBeginMonth < 2
    ) {
      const updatedInputs = tempCostInput.map((input) =>
        input.id.toString() === selectedId
          ? { ...input, fundraisingBeginMonth: 2 }
          : input
      );
      setTempCostInput(updatedInputs);
      message.warning(
        "Fundraising Begin Month should be greater or equal to 2 for Paid in Capital."
      );
    }

    setRenderCostForm(selectedId);
  };

  // Update useEffect to include fundraising amount, type, and begin month
  useEffect(() => {
    const calculatedData = calculateCostData(tempCostInput, numberOfMonths);
    setTempCostData(calculatedData);
  }, [tempCostInput, numberOfMonths]);

  // Function to handle save
  const handleSave = () => {
    setIsSaved(true);
  };

  // useEffect to update cost inputs when data is saved
  const { id } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isSaved) {
          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);
          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
            const { user_email, collabs } = existingData[0];

            // Check if user.email matches user_email or is included in collabs
            if (user.email !== user_email && !collabs?.includes(user.email)) {
              message.error(
                "You do not have permission to update this record."
              );
              return;
            }

            dispatch(setCostInputs(tempCostInput));

            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.costInputs = tempCostInput;

            const { error: updateError } = await supabase
              .from("finance")
              .update({ inputData: newInputData })
              .eq("id", existingData[0]?.id)
              .select();

            if (updateError) {
              throw updateError;
            } else {
              message.success("Data saved successfully!");
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

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);
  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(6);

  // useEffect to update cost chart data
  useEffect(() => {
    const seriesData = tempCostData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts
          .slice(chartStartMonth - 1, chartEndMonth)
          .map((cost) => cost.cost),
      };
    });

    const totalCostPerMonth = seriesData.reduce((acc, channel) => {
      channel.data.forEach((customers, index) => {
        if (!acc[index]) {
          acc[index] = 0;
        }
        acc[index] += customers;
      });
      return acc;
    }, []);

    setCostChart((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: Array.from(
            { length: chartEndMonth - chartStartMonth + 1 },
            (_, i) => {
              const monthIndex =
                (startingMonth + chartStartMonth - 1 + i - 1) % 12;
              const year =
                startingYear +
                Math.floor((startingMonth + chartStartMonth - 1 + i - 1) / 12);
              return `${months[monthIndex]}/${year}`;
            }
          ),
        },
      },
      series: [
        ...seriesData,
        {
          name: "Total",
          data: totalCostPerMonth,
        },
      ],
    }));
  }, [tempCostData, chartStartMonth, chartEndMonth]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeCostInput(renderCostForm);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Cost Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col transition duration-500   rounded-2xl">
            <div className="flex justify-between items-center">
              <div className="min-w-[10vw] mb-2">
                <label htmlFor="startMonthSelect">Start Month:</label>
                <select
                  id="startMonthSelect"
                  value={chartStartMonth}
                  onChange={(e) =>
                    setChartStartMonth(
                      Math.max(1, Math.min(e.target.value, chartEndMonth))
                    )
                  }
                  className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                >
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <option key={i + 1} value={i + 1}>
                        {`${months[monthIndex]}/${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="min-w-[10vw] mb-2">
                <label htmlFor="endMonthSelect">End Month:</label>
                <select
                  id="endMonthSelect"
                  value={chartEndMonth}
                  onChange={(e) =>
                    setChartEndMonth(
                      Math.max(
                        chartStartMonth,
                        Math.min(e.target.value, numberOfMonths)
                      )
                    )
                  }
                  className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                >
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <option key={i + 1} value={i + 1}>
                        {`${months[monthIndex]}/${year}`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div onClick={() => handleChartClick(costChart)}>
              <Chart
                options={{
                  ...costChart.options,
                  xaxis: {
                    ...costChart.options.xaxis,
                    // tickAmount: 6, // Set the number of ticks on the x-axis to 12
                  },
                  stroke: { width: 1, curve: "straight" }, // Set the stroke curve to straight
                }}
                series={costChart.series}
                type="area"
                height={350}
              />
            </div>
          </Card>
        </div>
        <Modal
          centered
          visible={isChartModalVisible}
          footer={null}
          onCancel={() => setIsChartModalVisible(false)}
          width="90%"
          style={{ top: 20 }}
        >
          {selectedChart && (
            <Chart
              options={{
                ...selectedChart.options,
                // ... other options
              }}
              series={selectedChart.series}
              type="area"
              height={500}
            />
          )}
        </Modal>
        <h3 className="text-lg font-semibold my-4">Cost Table</h3>
        <Table
          className="overflow-auto my-8 rounded-md bg-white"
          size="small"
          dataSource={transformCostDataForTable(tempCostInput, numberOfMonths)}
          columns={costColumns}
          pagination={false}
          bordered
          rowClassName={(record) => (record.key === "Total" ? "font-bold" : "")}
        />
      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <section aria-labelledby="costs-heading" className="mb-8 sticky top-8">
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="costs-heading"
          >
            Costs
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderCostForm}
              onChange={handleSelectChange}
            >
              {tempCostInput.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.costName}
                </option>
              ))}
            </select>
          </div>

          {tempCostInput
            .filter((input) => input?.id == renderCostForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-2xl p-6 border my-4 "
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Cost Name:</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={input.costName}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "costName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Cost Value:
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="text"
                    value={formatNumber(input.costValue)}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "costValue",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Growth Percentage (%):
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="text"
                    value={formatNumber(input.growthPercentage)}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "growthPercentage",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">Frequency:</span>
                  <Select
                    className="border-gray-300"
                    onValueChange={(value) =>
                      handleCostInputChange(input?.id, "growthFrequency", value)
                    }
                    value={input.growthFrequency}
                  >
                    <SelectTrigger
                      id={`select-growthFrequency-${input?.id}`}
                      className="border-solid border-[1px] border-gray-300"
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
                    className="col-start-2 border-gray-300"
                    type="number"
                    min="1"
                    max="12"
                    value={input.beginMonth}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "beginMonth",
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">End Month:</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="number"
                    min="1"
                    max="12"
                    value={input.endMonth}
                    onChange={(e) =>
                      handleCostInputChange(
                        input?.id,
                        "endMonth",
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Cost Type:</span>
                  <Select
                    className="border-gray-300"
                    onValueChange={(value) =>
                      handleCostInputChange(input?.id, "costType", value)
                    }
                    value={input.costType}
                  >
                    <SelectTrigger
                      id={`select-costType-${input?.id}`}
                      className="border-solid border-[1px] border-gray-300"
                    >
                      <SelectValue placeholder="Select Cost Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Sales, Marketing Cost">
                        Sales, Marketing
                      </SelectItem>
                      <SelectItem value="General Administrative Cost">
                        General Administrative
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

          <div className="flex justify-between items-center">
            <button
              className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4 flex items-center"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <DeleteOutlined
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  marginRight: "4px",
                }}
              />
              Remove
            </button>

            <button
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 "
              onClick={addNewCostInput}
            >
              <PlusOutlined
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  marginRight: "4px",
                }}
              />
              Add
            </button>

            <button
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 flex items-center"
              onClick={handleSave}
            >
              <CheckCircleOutlined
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  marginRight: "4px",
                }}
              />
              Save
            </button>
          </div>
        </section>
      </div>

      <div className="xl:hidden block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
          }}
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal
          // title="Customer channel"
          visible={isInputFormOpen}
          onOk={() => {
            handleSave();
            setIsInputFormOpen(false);
          }}
          onCancel={() => {
            setTempCostInput(costInputs);
            setIsInputFormOpen(false);
          }}
          okText="Save change"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          centered={true}
          zIndex={50}
        >
          <section
            aria-labelledby="costs-heading"
            className="mb-8 sticky top-8"
          >
            <h2
              className="text-lg font-semibold mb-8 flex items-center"
              id="costs-heading"
            >
              Costs
              <span className="flex justify-center items-center">
                <PlusCircleOutlined
                  className="ml-2 text-blue-500"
                  size="large"
                  style={{ fontSize: "24px" }}
                  onClick={addNewCostInput}
                />
              </span>
            </h2>

            <div>
              <label
                htmlFor="selectedChannel"
                className="block my-4 text-base  darkTextWhite"
              ></label>
              <select
                id="selectedChannel"
                className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                value={renderCostForm}
                onChange={handleSelectChange}
              >
                {tempCostInput.map((input) => (
                  <option key={input?.id} value={input?.id}>
                    {input.costName}
                  </option>
                ))}
              </select>
            </div>

            {tempCostInput
              .filter((input) => input?.id == renderCostForm)
              .map((input) => (
                <div
                  key={input?.id}
                  className="bg-white rounded-2xl p-6 border my-4 "
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Cost Name:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={input.costName}
                      onChange={(e) =>
                        handleCostInputChange(
                          input?.id,
                          "costName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Cost Value:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      type="text"
                      value={formatNumber(input.costValue)}
                      onChange={(e) =>
                        handleCostInputChange(
                          input?.id,
                          "costValue",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Growth Percentage (%):
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      type="text"
                      value={formatNumber(input.growthPercentage)}
                      onChange={(e) =>
                        handleCostInputChange(
                          input?.id,
                          "growthPercentage",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className="flex items-center text-sm">
                      Frequency:
                    </span>
                    <Select
                      className="border-gray-300"
                      onValueChange={(value) =>
                        handleCostInputChange(
                          input?.id,
                          "growthFrequency",
                          value
                        )
                      }
                      value={input.growthFrequency}
                    >
                      <SelectTrigger
                        id={`select-growthFrequency-${input?.id}`}
                        className="border-solid border-[1px] border-gray-300"
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
                      className="col-start-2 border-gray-300"
                      type="number"
                      min="1"
                      max="12"
                      value={input.beginMonth}
                      onChange={(e) =>
                        handleCostInputChange(
                          input?.id,
                          "beginMonth",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      End Month:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      type="number"
                      min="1"
                      max="12"
                      value={input.endMonth}
                      onChange={(e) =>
                        handleCostInputChange(
                          input?.id,
                          "endMonth",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Cost Type:
                    </span>
                    <Select
                      className="border-gray-300"
                      onValueChange={(value) =>
                        handleCostInputChange(input?.id, "costType", value)
                      }
                      value={input.costType}
                    >
                      <SelectTrigger
                        id={`select-costType-${input?.id}`}
                        className="border-solid border-[1px] border-gray-300"
                      >
                        <SelectValue placeholder="Select Cost Type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="Sales, Marketing Cost">
                          Sales, Marketing
                        </SelectItem>
                        <SelectItem value="General Administrative Cost">
                          General Administrative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end items-center">
                    <button
                      className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4"
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </section>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalOpen}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          okText="Delete"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          okButtonProps={{
            style: {
              background: "#f5222d",
              borderColor: "#f5222d",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          centered={true}
        >
          Are you sure you want to delete it?
        </Modal>
      )}
    </div>
  );
};

export default CostSection;
