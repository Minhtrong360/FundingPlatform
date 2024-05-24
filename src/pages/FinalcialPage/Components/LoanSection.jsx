import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button, Card, FloatButton, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateLoanData,
  setLoanData,
  setLoanInputs,
  setLoanTableData,
  transformLoanDataForTable,
} from "../../../features/LoanSlice";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

const LoanInputForm = ({
  tempLoanInputs,
  renderLoanForm,
  setRenderLoanForm,
  handleLoanInputChange,
  addNewLoanInput,
  confirmDelete,
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  handleSave,
  isLoading,
}) => {
  return (
    <section aria-labelledby="loan-heading" className="mb-8 sticky top-8">
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="loan-heading"
      >
        Loan
      </h2>

      <div>
        <label
          htmlFor="selectedChannel"
          className="block my-4 text-base  darkTextWhite"
        ></label>
        <select
          id="selectedChannel"
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
          value={renderLoanForm}
          onChange={(e) => setRenderLoanForm(e.target.value)}
        >
          <option value="all">All</option>
          {tempLoanInputs.map((input) => (
            <option key={input?.id} value={input?.id}>
              {input.loanName}
            </option>
          ))}
        </select>
      </div>

      {tempLoanInputs
        .filter((input) => input?.id == renderLoanForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Loan Name:</span>
              <Input
                required
                className="border p-2 rounded-2xl border-gray-300"
                value={input.loanName}
                onChange={(e) =>
                  handleLoanInputChange(input?.id, "loanName", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Loan Amount:</span>
              <Input
                required
                className="border p-2 rounded-2xl border-gray-300"
                value={formatNumber(input.loanAmount)}
                onChange={(e) =>
                  handleLoanInputChange(
                    input?.id,
                    "loanAmount",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Interest Rate (%):
              </span>
              <Input
                required
                className="border p-2 rounded-2xl border-gray-300"
                value={formatNumber(input.interestRate)}
                onChange={(e) =>
                  handleLoanInputChange(
                    input?.id,
                    "interestRate",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Month Loan Begins:
              </span>
              <Input
                required
                type="number"
                className="border p-2 rounded-2xl border-gray-300"
                value={input.loanBeginMonth}
                onChange={(e) =>
                  handleLoanInputChange(
                    input?.id,
                    "loanBeginMonth",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Month Loan Ends:
              </span>
              <Input
                required
                type="number"
                className="border p-2 rounded-2xl border-gray-300"
                value={input.loanEndMonth}
                onChange={(e) =>
                  handleLoanInputChange(
                    input?.id,
                    "loanEndMonth",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="flex justify-center items-center"></div>
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
          onClick={addNewLoanInput}
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

const LoanSection = ({ numberOfMonths, isSaved, setIsSaved }) => {
  const dispatch = useDispatch();
  const { loanInputs } = useSelector((state) => state.loan);
  const [tempLoanInputs, setTempLoanInputs] = useState(loanInputs);
  const [renderLoanForm, setRenderLoanForm] = useState(loanInputs[0]?.id);

  useEffect(() => {
    setTempLoanInputs(loanInputs);
  }, [loanInputs]);

  const addNewLoanInput = () => {
    const maxId = Math.max(...tempLoanInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newLoan = {
      id: newId,
      loanName: "New loan",
      loanAmount: "0",
      interestRate: "0",
      loanBeginMonth: "0",
      loanEndMonth: "0",
    };
    setTempLoanInputs([...tempLoanInputs, newLoan]);
    setRenderLoanForm(newId.toString());
  };

  const removeLoanInput = (id) => {
    const indexToRemove = tempLoanInputs.findIndex((input) => input?.id == id);
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempLoanInputs.slice(0, indexToRemove),
        ...tempLoanInputs.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempLoanInputs(newInputs);
      setRenderLoanForm(prevInputId);
    }
  };

  const handleLoanInputChange = (id, field, value) => {
    const newInputs = tempLoanInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempLoanInputs(newInputs);
  };

  useEffect(() => {
    const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
    dispatch(setLoanData(calculatedData));
    const tableData = transformLoanDataForTable(
      loanInputs,
      renderLoanForm,
      numberOfMonths
    );
    dispatch(setLoanTableData(tableData));
  }, [loanInputs, numberOfMonths, renderLoanForm]);

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

  const loanColumns = [
    {
      fixed: "left",
      title: <div>Type</div>,
      dataIndex: "type",
      key: "type",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (startingMonth + i - 1) % 12;
      const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
      return {
        title: `${months[monthIndex]}/${year}`,
        dataIndex: `Month ${i + 1}`,
        key: `Month ${i + 1}`,
        align: "right",
        onCell: (record) => ({
          style: {
            borderRight: "1px solid #f0f0f0",
          },
        }),
      };
    }),
  ];

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: {
        id: "loan-chart",
        type: "line",
        height: 350,
        fontFamily: "Sora, sans-serif",
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        animations: { enabled: false },
      },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      xaxis: {
        labels: {
          show: true,
          rotate: 0,
          style: {
            fontFamily: "Sora, sans-serif",
          },
        },
        axisTicks: {
          show: false,
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
          show: true,
        },
        labels: {
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Amount ($)",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      grid: { show: false },
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

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  useEffect(() => {
    const filteredMonths = Array.from(
      { length: chartEndMonth - chartStartMonth + 1 },
      (_, i) => {
        const monthIndex = (startingMonth + chartStartMonth + i - 2) % 12;
        const year =
          startingYear +
          Math.floor((startingMonth + chartStartMonth + i - 2) / 12);
        return `${months[monthIndex]}/${year}`;
      }
    );

    const seriesData = calculateLoanData(tempLoanInputs, numberOfMonths).map(
      (loan) => {
        const data = Array(filteredMonths.length).fill(0);
        const dataPayment = Array(filteredMonths.length).fill(0);
        const dataPrincipal = Array(filteredMonths.length).fill(0);
        const dataInterest = Array(filteredMonths.length).fill(0);
        const dataRemainingBalance = Array(filteredMonths.length).fill(0);

        loan.loanDataPerMonth
          .slice(chartStartMonth - 1, chartEndMonth)
          .forEach((monthData, index) => {
            data[index] = monthData.balance;
            dataPayment[index] = monthData.payment;
            dataPrincipal[index] = monthData.principal;
            dataInterest[index] = monthData.interest;
            dataRemainingBalance[index] = monthData.balance;
          });

        return {
          name: loan.loanName,
          data,
          dataPayment,
          dataPrincipal,
          dataInterest,
          dataRemainingBalance,
        };
      }
    );

    const totalLoanData = seriesData.reduce((acc, channel) => {
      channel.data.forEach((amount, index) => {
        acc[index] = (acc[index] || 0) + amount;
      });
      return acc;
    }, Array(filteredMonths.length).fill(0));

    setLoanChart((prevState) => ({
      ...prevState,
      series: seriesData,
      charts: [
        {
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: filteredMonths,
            },
            chart: {
              ...prevState.options.chart,
              id: "allLoans",
              stacked: false,
            },
            title: {
              ...prevState.options.title,
              text: "All Remaining Loans",
            },
          },
          series: [
            ...seriesData,
            {
              name: "Total",
              data: totalLoanData,
            },
          ],
        },
        ...seriesData.map((channelSeries) => ({
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: filteredMonths,
            },
            chart: {
              ...prevState.options.chart,
              id: channelSeries.name,
            },
            title: {
              ...prevState.options.title,
              text: channelSeries.name,
            },
          },
          series: [
            {
              name: "Payment",
              data: channelSeries.dataPayment,
            },
            {
              name: "Principal",
              data: channelSeries.dataPrincipal,
            },
            {
              name: "Interest",
              data: channelSeries.dataInterest,
            },
            {
              name: "Remaining Balance",
              data: channelSeries.dataRemainingBalance,
            },
          ],
        })),
      ],
    }));
  }, [
    tempLoanInputs,
    chartStartMonth,
    chartEndMonth,
    startingMonth,
    startingYear,
    numberOfMonths,
  ]);

  const handleSave = () => {
    setIsSaved(true);
  };

  const tableData = transformLoanDataForTable(
    tempLoanInputs,
    renderLoanForm,
    numberOfMonths
  );

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isSaved) {
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
              message.error(
                "You do not have permission to update this record."
              );
              return;
            }

            dispatch(setLoanInputs(tempLoanInputs));
            dispatch(setLoanTableData(tableData));
            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.loanInputs = tempLoanInputs;

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
        setIsLoading(false);
        setIsInputFormOpen(false);
      }
    };
    saveData();
  }, [isSaved]);

  useEffect(() => {
    dispatch(setLoanTableData(tableData));
  }, []);

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeLoanInput(renderLoanForm);
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
      <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm">
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
              <h3 className="text-lg font-semibold mb-8">Loan Chart</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {loanChart?.charts?.map((series, index) => (
                  <Card
                    key={index}
                    className="flex flex-col transition duration-500 rounded-2xl"
                  >
                    <div className="flex justify-between items-center">
                      <div className="min-w-[10vw] mb-2">
                        <label htmlFor="startMonthSelect">Start Month:</label>
                        <select
                          id="startMonthSelect"
                          value={chartStartMonth}
                          onChange={(e) =>
                            setChartStartMonth(
                              Math.max(
                                1,
                                Math.min(e.target.value, chartEndMonth)
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
                    <div onClick={() => handleChartClick(series)}>
                      <Chart
                        options={{
                          ...series.options,

                          xaxis: {
                            ...series.options.xaxis,
                          },
                          stroke: {
                            width: 1,
                            curve: "straight",
                          },
                        }}
                        series={series.series}
                        type="area"
                        height={350}
                      />
                    </div>
                  </Card>
                ))}
              </div>
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
              <h3 className="text-lg font-semibold my-4">Loan Data</h3>
              <Table
                className="overflow-auto my-8 rounded-md bg-white"
                size="small"
                dataSource={transformLoanDataForTable(
                  tempLoanInputs,
                  renderLoanForm,
                  numberOfMonths
                )}
                columns={loanColumns}
                pagination={false}
                bordered
                rowClassName={(record) =>
                  record.key === record.type ? "font-bold" : ""
                }
              />
            </div>
            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden "></div>
          </>
        )}
        {activeTab === "input" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0 "> </div>

            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
              <LoanInputForm
                tempLoanInputs={tempLoanInputs}
                renderLoanForm={renderLoanForm}
                setRenderLoanForm={setRenderLoanForm}
                handleLoanInputChange={handleLoanInputChange}
                addNewLoanInput={addNewLoanInput}
                confirmDelete={confirmDelete}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                handleSave={handleSave}
                isLoading={isLoading}
              />
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
                open={isInputFormOpen}
                onOk={() => {
                  handleSave();
                  setIsInputFormOpen(false);
                }}
                onCancel={() => {
                  setTempLoanInputs(loanInputs);
                  setRenderLoanForm(loanInputs[0]?.id);
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
                <LoanInputForm
                  tempLoanInputs={tempLoanInputs}
                  renderLoanForm={renderLoanForm}
                  setRenderLoanForm={setRenderLoanForm}
                  handleLoanInputChange={handleLoanInputChange}
                  addNewLoanInput={addNewLoanInput}
                  confirmDelete={confirmDelete}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  isDeleteModalOpen={isDeleteModalOpen}
                  handleSave={handleSave}
                  isLoading={isLoading}
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

export default LoanSection;
