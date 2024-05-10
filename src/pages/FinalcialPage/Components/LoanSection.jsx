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
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";

const LoanSection = ({
  numberOfMonths,

  isSaved,
  setIsSaved,

  handleSubmit,
}) => {
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
    const indexToRemove = tempLoanInputs.findIndex((input) => input?.id === id);
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

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

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
            borderRight: "1px solid #f0f0f0", // Add border right style
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
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: false,
        }
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
          show: false, // Hide x-axis ticks
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
      // fill: {
      //   type: "gradient",
      //   gradient: {
      //     shade: "light",
      //     shadeIntensity: 0.5,
      //     opacityFrom: 0.85,
      //     opacityTo: 0.65,
      //     stops: [0, 90, 100],
      //   },
      // },
      dataLabels: { enabled: false },
      stroke: { width: 1 },
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
        // Khởi tạo mảng dữ liệu rỗng với giá trị là 0 cho mỗi tháng
        const data = Array(filteredMonths.length).fill(0);
        const dataPayment = Array(filteredMonths.length).fill(0);
        const dataPrincipal = Array(filteredMonths.length).fill(0);
        const dataInterest = Array(filteredMonths.length).fill(0);
        const dataRemainingBalance = Array(filteredMonths.length).fill(0);

        // Cập nhật mảng dữ liệu với thông tin thực tế từ loanDataPerMonth
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

    // Tính toán tổng số liệu cho tất cả các khoản vay
    const totalLoanData = seriesData.reduce((acc, channel) => {
      channel.data.forEach((amount, index) => {
        acc[index] = (acc[index] || 0) + amount;
      });
      return acc;
    }, Array(filteredMonths.length).fill(0));

    // Cập nhật state của biểu đồ với dữ liệu mới
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
  const handleSelectChange = (event) => {
    setRenderLoanForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  const tableData = transformLoanDataForTable(
    tempLoanInputs,
    renderLoanForm,
    numberOfMonths
  );

  const { id } = useParams();
  useEffect(() => {
    const saveData = async () => {
      try {
        if (isSaved) {
          dispatch(setLoanInputs(tempLoanInputs));
          dispatch(setLoanTableData(tableData));

          const { data: existingData, error: selectError } = await supabase
            .from("finance")
            .select("*")
            .eq("id", id);
          if (selectError) {
            throw selectError;
          }

          if (existingData && existingData.length > 0) {
            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.loanInputs = tempLoanInputs;

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
    dispatch(setLoanTableData(tableData));
  }, []);

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Loan Chart</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {loanChart?.charts?.map((series, index) => (
            <Card
              key={index}
              className="flex flex-col shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105 border border-gray-300 rounded-md"
            >
              <div className="flex justify-between items-center">
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
                  ...series.options,

                  xaxis: {
                    ...series.options.xaxis,
                    // tickAmount: 6, // Ensure x-axis has 6 ticks
                  },
                  stroke: {
                    width: 1, // Set the stroke width to 1
                  },
                }}
                series={series.series}
                type="area"
                height={350}
              />
            </Card>
          ))}
        </div>

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

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden border-r-8 border-l-8 border-white">
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
              className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderLoanForm}
              onChange={handleSelectChange}
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
              <div
                key={input?.id}
                className="bg-white rounded-md p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">Loan Name:</span>
                  <Input
                    required
                    className="border p-2 rounded border-gray-300"
                    value={input.loanName}
                    onChange={(e) =>
                      handleLoanInputChange(
                        input?.id,
                        "loanName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className="flex items-center text-sm">
                    Loan Amount:
                  </span>
                  <Input
                    required
                    className="border p-2 rounded border-gray-300"
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
                    className="border p-2 rounded border-gray-300"
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
                    className="border p-2 rounded border-gray-300"
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
                    className="border p-2 rounded border-gray-300"
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
              className="bg-red-600 text-white py-2 px-2 rounded text-sm mt-4 flex items-center"
              onClick={() => removeLoanInput(renderLoanForm)}
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
            setTempLoanInputs(loanInputs);
            setRenderLoanForm(loanInputs[0]?.id);
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
          <section aria-labelledby="loan-heading" className="mb-8 sticky top-8">
            <h2
              className="text-lg font-semibold mb-8 flex items-center"
              id="loan-heading"
            >
              Loan{" "}
              <span className="flex justify-center items-center">
                <PlusCircleOutlined
                  className="ml-2 text-blue-500"
                  size="large"
                  style={{ fontSize: "24px" }}
                  onClick={addNewLoanInput}
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
                value={renderLoanForm}
                onChange={handleSelectChange}
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
                <div
                  key={input?.id}
                  className="bg-white rounded-md p-6 border my-4"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className="flex items-center text-sm">
                      Loan Name:
                    </span>
                    <Input
                      required
                      className="border p-2 rounded border-gray-300"
                      value={input.loanName}
                      onChange={(e) =>
                        handleLoanInputChange(
                          input?.id,
                          "loanName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className="flex items-center text-sm">
                      Loan Amount:
                    </span>
                    <Input
                      required
                      className="border p-2 rounded border-gray-300"
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
                      className="border p-2 rounded border-gray-300"
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
                      className="border p-2 rounded border-gray-300"
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
                      className="border p-2 rounded border-gray-300"
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
                  <div className="flex justify-end items-center">
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded"
                      onClick={() => removeLoanInput(input?.id)}
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

export default LoanSection;
