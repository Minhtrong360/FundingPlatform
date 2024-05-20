import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Button, Card, FloatButton, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateInvestmentData,
  setInvestmentData,
  setInvestmentInputs,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { FileOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";

const InvestmentSection = ({ numberOfMonths, isSaved, setIsSaved }) => {
  const { investmentInputs, investmentData } = useSelector(
    (state) => state.investment
  );
  const dispatch = useDispatch();
  const [tempInvestmentInputs, setTempInvestmentInputs] =
    useState(investmentInputs);

  const [tempInvestmentData, setTempInvestmentData] = useState(investmentData);

  const [renderInvestmentForm, setRenderInvestmentForm] = useState(
    investmentInputs[0]?.id
  );

  useEffect(() => {
    setTempInvestmentInputs(investmentInputs);
  }, [investmentInputs]);

  const addNewInvestmentInput = () => {
    const maxId = Math.max(...tempInvestmentInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      purchaseName: "New investment",
      assetCost: 0,
      quantity: 1,
      purchaseMonth: 1,
      residualValue: 0,
      usefulLifetime: 1,
    };
    setTempInvestmentInputs([...tempInvestmentInputs, newCustomer]);
    setRenderInvestmentForm(newId.toString());
  };

  const removeInvestmentInput = (id) => {
    const indexToRemove = tempInvestmentInputs.findIndex(
      (input) => input?.id == id
    );
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempInvestmentInputs.slice(0, indexToRemove),
        ...tempInvestmentInputs.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempInvestmentInputs(newInputs);
      setRenderInvestmentForm(prevInputId);
    }
  };

  const handleInvestmentInputChange = (id, field, value) => {
    const newInputs = tempInvestmentInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempInvestmentInputs(newInputs);
  };

  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentInputs, numberOfMonths, renderInvestmentForm]);

  useEffect(() => {
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentInputs, numberOfMonths, investmentData]);

  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      tempInvestmentInputs,
      numberOfMonths
    );

    setTempInvestmentData(calculatedData);
    const tableData = transformInvestmentDataForTable(
      tempInvestmentInputs,
      renderInvestmentForm,
      tempInvestmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [tempInvestmentInputs, numberOfMonths, renderInvestmentForm]);

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

  const investmentColumns = [
    {
      fixed: "left",
      title: <div>Type</div>,
      dataIndex: "type",
      key: "key",
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

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: {
        id: "investment-chart",
        type: "area",
        height: 350,
        zoom: { enabled: false },
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        },
        fontFamily: "Sora, sans-serif",
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
          show: false, // Hide x-axis ticks
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          rotate: 0,
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: { fontFamily: "Sora, sans-serif", fontsize: "12px" },
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        labels: {
          show: true,
          style: { fontFamily: "Sora, sans-serif" },
          rotate: 0,
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Amount ($)",
          style: { fontFamily: "Sora, sans-serif", fontsize: "12px" },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "straight" },
      // markers: { size: 1 },
    },
    series: [],
  });

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(6);

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

    const seriesData = tempInvestmentData.map((investment) => {
      const filteredData = investment.bookValue.slice(
        chartStartMonth - 1,
        chartEndMonth
      );
      return {
        name: investment.purchaseName,
        data: filteredData,
        dataBookValue: filteredData,
        dataAccumulatedDepreciation: investment.accumulatedDepreciation.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
        dataAssetValue: investment.assetValue.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
        dataDepreciationArray: investment.depreciationArray.slice(
          chartStartMonth - 1,
          chartEndMonth
        ),
      };
    });

    const totalSalesData = seriesData.reduce((acc, channel) => {
      channel.data.forEach((amount, index) => {
        if (!acc[index]) acc[index] = 0;
        acc[index] += amount;
      });
      return acc;
    }, Array(chartEndMonth - chartStartMonth + 1).fill(0));

    setInvestmentChart((prevState) => ({
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
              id: "allInvestments",
              stacked: false,
            },
            title: {
              ...prevState.options.title,
              text: "All Investments",
            },
          },
          series: [
            ...seriesData,
            {
              name: "Total",
              data: totalSalesData,
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
              name: "Depreciation",
              data: channelSeries.dataDepreciationArray,
            },
            {
              name: "Accumulated Depre.",
              data: channelSeries.dataAccumulatedDepreciation,
            },
            {
              name: "Book Value",
              data: channelSeries.dataBookValue,
            },
          ],
        })),
      ],
    }));
  }, [
    tempInvestmentData,
    chartStartMonth,
    chartEndMonth,
    startingMonth,
    startingYear,
  ]);

  const handleSelectChange = (event) => {
    setRenderInvestmentForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
  };
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

            dispatch(setInvestmentInputs(tempInvestmentInputs));
            const tableData = transformInvestmentDataForTable(
              tempInvestmentInputs,
              renderInvestmentForm,
              tempInvestmentData,
              numberOfMonths
            );
            dispatch(setInvestmentTableData(tableData));

            const newInputData = JSON.parse(existingData[0].inputData);

            newInputData.investmentInputs = tempInvestmentInputs;

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

  useEffect(() => {
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, []);

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeInvestmentInput(renderInvestmentForm);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Investment Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {investmentChart?.charts?.map((series, index) => (
            <Card
              key={index}
              className="flex flex-col transition duration-500  rounded-2xl"
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

              <Chart
                options={{
                  ...series.options,

                  xaxis: {
                    ...series.options.xaxis,
                    // tickAmount: 6, // Ensure x-axis has 12 ticks
                  },
                  stroke: {
                    width: 1,
                    curve: "straight", // Set the stroke width to 1
                  },
                }}
                series={series.series}
                type="area"
                height={350}
              />
            </Card>
          ))}
        </div>

        <h3 className="text-lg font-semibold my-4">Investment Table</h3>
        <Table
          className="overflow-auto my-8 rounded-md bg-white"
          size="small"
          dataSource={transformInvestmentDataForTable(
            tempInvestmentInputs,
            renderInvestmentForm,
            tempInvestmentData,
            numberOfMonths
          )}
          columns={investmentColumns}
          pagination={false}
          bordered
          rowClassName={(record) =>
            record.key === record.type ? "font-bold" : ""
          }
        />
      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <section
          aria-labelledby="investment-heading"
          className="mb-8 sticky top-8"
        >
          <h2
            className="text-lg font-semibold mb-8 flex items-center"
            id="investment-heading"
          >
            Investment
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderInvestmentForm}
              onChange={handleSelectChange}
            >
              <option value="all">All</option>
              {tempInvestmentInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.purchaseName}
                </option>
              ))}
            </select>
          </div>

          {tempInvestmentInputs
            .filter((input) => input?.id == renderInvestmentForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-2xl p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Name of Purchase
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={input.purchaseName}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "purchaseName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Asset Cost</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={formatNumber(input.assetCost)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "assetCost",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Quantity:</span>
                  <Input
                    className="col-start-2 border-gray-300"
                    type="text"
                    min="1"
                    value={formatNumber(input.quantity)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "quantity",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Purchase Month
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={input.purchaseMonth}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "purchaseMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Residual Value
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={input.residualValue}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "residualValue",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Useful Lifetime (Months)
                  </span>
                  <Input
                    className="col-start-2 border-gray-300"
                    value={formatNumber(input.usefulLifetime)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "usefulLifetime",
                        parseNumber(e.target.value)
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
              onClick={addNewInvestmentInput}
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
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
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
            setTempInvestmentInputs(investmentInputs);
            setRenderInvestmentForm(investmentInputs[0]?.id);
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
            aria-labelledby="investment-heading"
            className="mb-8 sticky top-8"
          >
            <h2
              className="text-lg font-semibold mb-8 flex items-center"
              id="investment-heading"
            >
              Investment{" "}
              <span className="flex justify-center items-center">
                <PlusCircleOutlined
                  className="ml-2 text-blue-500"
                  size="large"
                  style={{ fontSize: "24px" }}
                  onClick={addNewInvestmentInput}
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
                value={renderInvestmentForm}
                onChange={handleSelectChange}
              >
                <option value="all">All</option>
                {tempInvestmentInputs.map((input) => (
                  <option key={input?.id} value={input?.id}>
                    {input.purchaseName}
                  </option>
                ))}
              </select>
            </div>

            {tempInvestmentInputs
              .filter((input) => input?.id == renderInvestmentForm)
              .map((input) => (
                <div
                  key={input?.id}
                  className="bg-white rounded-2xl p-6 border my-4"
                >
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Name of Purchase
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={input.purchaseName}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "purchaseName",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Asset Cost
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={formatNumber(input.assetCost)}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "assetCost",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Quantity:
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      type="text"
                      min="1"
                      value={formatNumber(input.quantity)}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "quantity",
                          parseNumber(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Purchase Month
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={input.purchaseMonth}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "purchaseMonth",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Residual Value
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={input.residualValue}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "residualValue",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <span className=" flex items-center text-sm">
                      Useful Lifetime (Months)
                    </span>
                    <Input
                      className="col-start-2 border-gray-300"
                      value={formatNumber(input.usefulLifetime)}
                      onChange={(e) =>
                        handleInvestmentInputChange(
                          input?.id,
                          "usefulLifetime",
                          parseNumber(e.target.value)
                        )
                      }
                    />
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

export default InvestmentSection;
