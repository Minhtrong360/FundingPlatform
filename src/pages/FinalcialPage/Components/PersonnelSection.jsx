import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button, Card, FloatButton, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import {
  setPersonnelInputs,
  setPersonnelCostData,
  calculatePersonnelCostData,
  transformPersonnelCostDataForTable,
} from "../../../features/PersonnelSlice";
import { useDispatch, useSelector } from "react-redux";
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
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

const PersonnelInputForm = ({
  tempPersonnelInputs,
  renderPersonnelForm,
  setRenderPersonnelForm,
  handlePersonnelInputChange,
  formatNumber,
  parseNumber,
  addNewPersonnelInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
}) => {
  return (
    <section aria-labelledby="personnel-heading" className="mb-8 sticky top-8">
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="personnel-heading"
      >
        Personnel
      </h2>

      <div>
        <label
          htmlFor="selectedChannel"
          className="block my-4 text-base darkTextWhite"
        ></label>
        <select
          id="selectedChannel"
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
          value={renderPersonnelForm}
          onChange={(e) => setRenderPersonnelForm(e.target.value)}
        >
          {tempPersonnelInputs.map((input) => (
            <option key={input?.id} value={input?.id}>
              {input.jobTitle}
            </option>
          ))}
        </select>
      </div>

      {tempPersonnelInputs
        .filter((input) => input?.id == renderPersonnelForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
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
              <span className=" flex items-center text-sm">Department</span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Department"
                value={input.department}
                onChange={(e) =>
                  handlePersonnelInputChange(
                    input.id,
                    "department",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">Salary/month</span>
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
                  <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">No. of hires</span>
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
          className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4"
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
          className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
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
          className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw]"
          onClick={handleSave}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <CheckCircleOutlined
                style={{
                  fontSize: "12px",
                  color: "#FFFFFF",
                  marginRight: "4px",
                }}
              />
              Save
            </>
          )}
        </button>
      </div>
    </section>
  );
};

const PersonnelSection = ({ numberOfMonths }) => {
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

  const addNewPersonnelInput = () => {
    const maxId = Math.max(...tempPersonnelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newPersonnel = {
      id: newId,
      jobTitle: "New position",
      department: "General",
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

  const personnelCostTableData = transformPersonnelCostDataForTable(
    tempPersonnelCostData
  );

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
  const startingMonth = startMonth;
  const startingYear = startYear;

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
            borderRight: "1px solid #f0f0f0",
          },
        }),
      };
    }),
  ];

  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: {
        id: "personnel-chart",
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        fontFamily: "Sora, sans-serif",
        animations: {
          enabled: false,
        },
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
        axisTicks: {
          show: false,
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
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      yaxis: {
        min: 0,
        axisboder: {
          show: true,
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Salary ($)",
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
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "straight" },
    },
    series: [],
  });

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const { data: existingData, error: selectError } = await supabase
        .from("finance")
        .select("*")
        .eq("id", id);
      if (selectError) {
        throw selectError;
      }

      if (existingData && existingData.length > 0) {
        const { user_email, collabs } = existingData[0];
        if (user.email !== user_email && !collabs?.includes(user.email)) {
          message.error("You do not have permission to update this record.");
          return;
        }

        dispatch(setPersonnelInputs(tempPersonnelInputs));

        const newInputData = JSON.parse(existingData[0].inputData);
        newInputData.personnelInputs = tempPersonnelInputs;

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
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
      setIsInputFormOpen(false);
    }
  };

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removePersonnelInput(renderPersonnelForm);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm sticky top-8 z-50">
        <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
              activeTab === "table&chart" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleTabChange("table&chart")}
          >
            Table and Chart
          </li>
          {/* Repeat for other tabs */}
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
              activeTab === "input" ? "bg-yellow-300 font-bold" : ""
            }`}
            onClick={() => handleTabChange("input")}
          >
            Input
          </li>
        </ul>
      </div>
      <div className="w-full h-full flex flex-col lg:flex-row">
        {activeTab === "table&chart" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0">
              <h3 className="text-lg font-semibold mb-8">
                Personnel Cost Chart
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex flex-col transition duration-500 rounded-2xl">
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
                            startingYear +
                            Math.floor((startingMonth + i - 1) / 12);
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
                            startingYear +
                            Math.floor((startingMonth + i - 1) / 12);
                          return (
                            <option key={i + 1} value={i + 1}>
                              {`${months[monthIndex]}/${year}`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div onClick={() => handleChartClick(personnelChart)}>
                    <Chart
                      options={{
                        ...personnelChart.options,
                        stroke: {
                          width: 1,
                          curve: "straight",
                        },
                        xaxis: {
                          ...personnelChart.options.xaxis,
                        },
                      }}
                      series={personnelChart.series}
                      type="area"
                      height={350}
                    />
                  </div>
                </Card>
                <Modal
                  centered
                  open={isChartModalVisible}
                  footer={null}
                  onCancel={() => setIsChartModalVisible(false)}
                  width="90%"
                  style={{ top: 20 }}
                >
                  {selectedChart && (
                    <Chart
                      options={{
                        ...selectedChart.options,
                      }}
                      series={selectedChart.series}
                      type="area"
                      height={500}
                    />
                  )}
                </Modal>
              </div>
              <h3 className="text-lg font-semibold my-4">
                Personnel Cost Table
              </h3>
              <Table
                className="overflow-auto my-8 rounded-md bg-white"
                size="small"
                dataSource={personnelCostTableData}
                columns={personnelCostColumns}
                pagination={false}
                bordered
                rowClassName={(record) =>
                  record.key === "Total" || record.isDepartment === true
                    ? "font-bold"
                    : ""
                }
              />
            </div>
            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden ">
              <button
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] "
                style={{ bottom: "20px", right: "20px", position: "fixed" }}
                onClick={handleSave}
              >
                {isLoading ? (
                  <SpinnerBtn />
                ) : (
                  <>
                    <CheckCircleOutlined
                      style={{
                        fontSize: "12px",
                        color: "#FFFFFF",
                        marginRight: "4px",
                      }}
                    />
                    Save
                  </>
                )}
              </button>
            </div>
          </>
        )}
        {activeTab === "input" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0 "> </div>

            <div className="w-full xl:w-1/4 sm:p-4 p-0">
              <PersonnelInputForm
                tempPersonnelInputs={tempPersonnelInputs}
                renderPersonnelForm={renderPersonnelForm}
                setRenderPersonnelForm={setRenderPersonnelForm}
                handlePersonnelInputChange={handlePersonnelInputChange}
                formatNumber={formatNumber}
                parseNumber={parseNumber}
                addNewPersonnelInput={addNewPersonnelInput}
                handleSave={handleSave}
                isLoading={isLoading}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            </div>
            {/* <div className="xl:hidden block">
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
            </div> */}
            {isInputFormOpen && (
              <Modal
                open={isInputFormOpen}
                onOk={() => {
                  handleSave();
                  setIsInputFormOpen(false);
                }}
                onCancel={() => {
                  setTempPersonnelInputs(personnelInputs);
                  setIsInputFormOpen(false);
                }}
                okText={isLoading ? <SpinnerBtn /> : "Save Change"}
                cancelText="Cancel"
                cancelButtonProps={{
                  style: {
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  },
                }}
                okButtonProps={{
                  style: {
                    background: "#2563EB",
                    borderColor: "#2563EB",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    minWidth: "5vw",
                  },
                }}
                footer={null}
                centered={true}
                zIndex={50}
              >
                <PersonnelInputForm
                  tempPersonnelInputs={tempPersonnelInputs}
                  renderPersonnelForm={renderPersonnelForm}
                  setRenderPersonnelForm={setRenderPersonnelForm}
                  handlePersonnelInputChange={handlePersonnelInputChange}
                  formatNumber={formatNumber}
                  parseNumber={parseNumber}
                  addNewPersonnelInput={addNewPersonnelInput}
                  handleSave={handleSave}
                  isLoading={isLoading}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                />
              </Modal>
            )}
            {isDeleteModalOpen && (
              <Modal
                title="Confirm Delete"
                open={isDeleteModalOpen}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Delete"
                cancelText="Cancel"
                cancelButtonProps={{
                  style: {
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  },
                }}
                okButtonProps={{
                  style: {
                    background: "#f5222d",
                    borderColor: "#f5222d",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  },
                }}
                centered={true}
              >
                Are you sure you want to delete it?
              </Modal>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PersonnelSection;
