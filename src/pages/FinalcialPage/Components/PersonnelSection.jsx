import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import {
  Button,
  Card,
  FloatButton,
  Modal,
  Table,
  Tooltip,
  message,
} from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import {
  setPersonnelInputs,
  setPersonnelCostData,
  calculatePersonnelCostData,
  transformPersonnelCostDataForTable,
} from "../../../features/PersonnelSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { useParams } from "react-router-dom";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";

const PersonnelSection = ({
  numberOfMonths,

  isSaved,
  setIsSaved,
  handleSubmit,
}) => {
  //PersonnelFunctions

  const { personnelInputs, personnelCostData } = useSelector(
    (state) => state.personnel
  );
  const dispatch = useDispatch();

  const [tempPersonnelInputs, setTempPersonnelInputs] =
    useState(personnelInputs);

  const [tempPersonnelCostData, setTempPersonnelCostData] =
    useState(personnelCostData);

  const [renderPersonnelForm, setRenderPersonnelForm] = useState(
    personnelInputs[0]?.id
  );

  useEffect(() => {
    setTempPersonnelInputs(personnelInputs);
    setRenderPersonnelForm(personnelInputs[0]?.id);
  }, [personnelInputs]);

  // Add state for the increase per year

  const addNewPersonnelInput = () => {
    const maxId = Math.max(...tempPersonnelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newPersonnel = {
      id: newId,
      jobTitle: "New position",
      salaryPerMonth: 0,
      increasePerYear: 10,
      growthSalaryFrequency: "Annually",
      numberOfHires: 1,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    };
    setTempPersonnelInputs([...tempPersonnelInputs, newPersonnel]);
    setRenderPersonnelForm(newId.toString());
  };

  const removePersonnelInput = (id) => {
    const newInputs = tempPersonnelInputs.filter((input) => input?.id != id);

    setTempPersonnelInputs(newInputs);
    setRenderPersonnelForm(newInputs[0]?.id);
  };

  const handlePersonnelInputChange = (id, field, value) => {
    const newInputs = tempPersonnelInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempPersonnelInputs(newInputs);
  };

  //PersonnelUseEffect
  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );
    dispatch(setPersonnelCostData(calculatedData));
  }, [personnelInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      tempPersonnelInputs,
      numberOfMonths
    );
    setTempPersonnelCostData(calculatedData);
  }, [tempPersonnelInputs, numberOfMonths]);

  //PersonnelCostTableData

  const personnelCostTableData = transformPersonnelCostDataForTable(
    tempPersonnelCostData
  );

  //PersonnelColumns
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

  const personnelCostColumns = [
    {
      fixed: "left",
      title: <div>Personnel</div>,
      dataIndex: "jobTitle",
      key: "jobTitle",
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

  //PersonnelChart
  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: {
        id: "personnel-chart",
        type: "bar",
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "Sora, sans-serif",
        animations: {
          enabled: false,
        }
      },
      grid: { show: false },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      xaxis: {
        range: 5,
        axisTicks: {
          show: false, // Hide x-axis ticks
        },
        labels: {
          show: true,
          rotate: 0,
          style: { fontFamily: "Sora, sans-serif" },
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontFamily: "Sora, sans-serif", // Sử dụng font chữ Inter
            fontsize: "12px",
          },
        },
      },
      // title: { text: 'Personnel Cost Data', align: 'left' },
      yaxis: {
        axisboder: {
          show: true, // Hide y-axis border
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          formatter: function (val) {
            return formatNumber(Math.floor(val)); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Salary ($)",
          style: {
            fontFamily: "Sora, sans-serif", // Sử dụng font chữ Inter
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      type: 'gradient',
      // gradient: {
      //     shadeIntensity: 1,
      //     inverseColors: false,
      //     opacityFrom: 0.45,
      //     opacityTo: 0.05,
      //     stops: [20, 100, 100, 100]
      //   },
      dataLabels: { enabled: false },
      stroke: { width: 1 },
      // markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = tempPersonnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    // Calculate total personnel cost per month for all channels
    const totalPersonnelCostPerMonth = seriesData.reduce((acc, channel) => {
      channel.data.forEach((customers, index) => {
        if (!acc[index]) {
          acc[index] = 0;
        }
        acc[index] += customers;
      });
      return acc;
    }, []);

    setPersonnelChart((prevState) => ({
      ...prevState,
      series: [
        ...seriesData,
        {
          name: "Total",
          data: totalPersonnelCostPerMonth,
        },
      ],
    }));
  }, [tempPersonnelCostData, numberOfMonths]);

  const handleSelectChange = (event) => {
    setRenderPersonnelForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };
  const { user } = useAuth();
  const { id } = useParams();
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isSaved) {
          dispatch(setPersonnelInputs(tempPersonnelInputs));

          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);
          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.personnelInputs = tempPersonnelInputs;

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

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  useEffect(() => {
    const filteredSeries = tempPersonnelCostData.map((personnel) => ({
      name: personnel.jobTitle,
      data: personnel.monthlyCosts
        .slice(chartStartMonth - 1, chartEndMonth)
        .map((month) => month.cost),
    }));

    const totalPersonnelCostPerMonth = filteredSeries.reduce((acc, channel) => {
      channel.data.forEach((cost, index) => {
        if (!acc[index]) acc[index] = 0;
        acc[index] += cost;
      });
      return acc;
    }, []);

    setPersonnelChart((prevState) => ({
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
        ...filteredSeries,
        { name: "Total", data: totalPersonnelCostPerMonth },
      ],
    }));
  }, [tempPersonnelCostData, chartStartMonth, chartEndMonth]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Personnel Cost Chart</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col shadow-xl">
            <div className="flex justify-between items-center my-4">
              <div className="min-w-[10vw]">
                <label htmlFor="startMonthSelect">Start Month:</label>
                <select
                  id="startMonthSelect"
                  value={chartStartMonth}
                  onChange={(e) =>
                    setChartStartMonth(
                      Math.max(1, Math.min(e.target.value, chartEndMonth))
                    )
                  }
                  className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
              <div className="min-w-[10vw]">
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
                  className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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

            <Chart
              options={{
                ...personnelChart.options,
                stroke: {
                  width: 1, // Set the stroke width to 2
                },
                xaxis: {
                  ...personnelChart.options.xaxis,
                  // tickAmount: 12, // Set the number of ticks on the x-axis to 12
                },
              }}
              series={personnelChart.series}
              type="area"
              height={350}
            />
          </Card>
        </div>
        <h3 className="text-lg font-semibold my-4">Personnel Cost Table</h3>
        <Table
          className="overflow-auto my-8 rounded-md bg-white"
          size="small"
          dataSource={personnelCostTableData}
          columns={personnelCostColumns}
          pagination={false}
          bordered
        />
      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <section
          aria-labelledby="personnel-heading"
          className="mb-8 sticky top-8"
        >
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="personnel-heading"
          >
            Personnel
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderPersonnelForm}
              onChange={handleSelectChange}
            >
              {tempPersonnelInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.jobTitle}
                </option>
              ))}
            </select>
          </div>

          {tempPersonnelInputs
            .filter((input) => input?.id == renderPersonnelForm) // Sử dụng biến renderForm
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Job Title</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Enter Job Title"
                    value={input.jobTitle}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobTitle",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Salary/month
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Enter Salary per Month"
                    value={formatNumber(input.salaryPerMonth)}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "salaryPerMonth",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Growth rate (%)
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Growth rate"
                    value={formatNumber(input.increasePerYear)}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "increasePerYear",
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
                      handlePersonnelInputChange(
                        input?.id,
                        "growthSalaryFrequency",
                        value
                      )
                    }
                    value={input.growthSalaryFrequency}
                  >
                    <SelectTrigger
                      id={`select-growthSalaryFrequency-${input?.id}`}
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
                    No. of hires
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Enter Number of Hires"
                    value={formatNumber(input.numberOfHires)}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "numberOfHires",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Job begin month
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Enter Job Begin Month"
                    value={input.jobBeginMonth}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobBeginMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Job ending month
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    placeholder="Enter Job Ending Month"
                    value={input.jobEndMonth}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobEndMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
              onClick={() => removePersonnelInput(renderPersonnelForm)}
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
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
              onClick={addNewPersonnelInput}
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
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded mt-4"
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
            setTempPersonnelInputs(personnelInputs);
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
            aria-labelledby="personnel-heading"
            className="mb-8 sticky top-8"
          >
            <h2
              className="text-lg font-semibold mb-8 flex items-center"
              id="personnel-heading"
            >
              Personnel
              <span className="flex justify-center items-center">
                <PlusCircleOutlined
                  className="ml-2 text-blue-500"
                  size="large"
                  style={{ fontSize: "24px" }}
                  onClick={addNewPersonnelInput}
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
                className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                value={renderPersonnelForm}
                onChange={handleSelectChange}
              >
                {tempPersonnelInputs.map((input) => (
                  <option key={input?.id} value={input?.id}>
                    {input.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            {tempPersonnelInputs
              .filter((input) => input?.id == renderPersonnelForm) // Sử dụng biến renderForm
              .map((input) => (
                <div
                  key={input?.id}
                  className="bg-white rounded-md p-6 border my-4"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Job Title
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Enter Job Title"
                      value={input.jobTitle}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "jobTitle",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Salary/month
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Enter Salary per Month"
                      value={formatNumber(input.salaryPerMonth)}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "salaryPerMonth",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Growth rate (%)
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Growth rate"
                      value={formatNumber(input.increasePerYear)}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "increasePerYear",
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
                        handlePersonnelInputChange(
                          input?.id,
                          "growthSalaryFrequency",
                          value
                        )
                      }
                      value={input.growthSalaryFrequency}
                    >
                      <SelectTrigger
                        id={`select-growthSalaryFrequency-${input?.id}`}
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
                      No. of hires
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Enter Number of Hires"
                      value={formatNumber(input.numberOfHires)}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "numberOfHires",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Job begin month
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Enter Job Begin Month"
                      value={input.jobBeginMonth}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "jobBeginMonth",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Job ending month
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      placeholder="Enter Job Ending Month"
                      value={input.jobEndMonth}
                      onChange={(e) =>
                        handlePersonnelInputChange(
                          input.id,
                          "jobEndMonth",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    <button
                      className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4"
                      onClick={() => removePersonnelInput(input.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </section>
        </Modal>
      )}
    </div>
  );
};

export default PersonnelSection;
