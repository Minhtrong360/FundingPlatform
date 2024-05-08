import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Card, Table, message } from "antd";
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

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350, fontFamily: "Sora, sans-serif", toolbar: { show: false },zoom: { enabled: false } },
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
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
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
            return Math.floor(val);
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
      legend: { position: "bottom", horizontalAlign: "right", fontFamily: "Sora, sans-serif" },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.75,
          opacityFrom: 0.8,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { width: 1 },
      
    },
    series: [],
  });

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

  useEffect(() => {
    const seriesData = calculateLoanData(tempLoanInputs, numberOfMonths).reduce(
      (acc, loan) => {
        acc.push({
          name: loan.loanName,
          data: loan.loanDataPerMonth.map((month) => month.balance),
          dataPayment: loan.loanDataPerMonth.map((month) => month.payment),
          dataPrincipal: loan.loanDataPerMonth.map((month) => month.principal),
          dataInterest: loan.loanDataPerMonth.map((month) => month.interest),
          dataRemainingBalance: loan.loanDataPerMonth.map(
            (month) => month.balance
          ),
        });
        return acc;
      },
      []
    );
    const totalLoanData = seriesData.reduce((acc, channel) => {
      channel.data.forEach((amount, index) => {
        if (!acc[index]) acc[index] = 0;
        acc[index] += amount;
      });
      return acc;
    }, Array(numberOfMonths).fill(0));

    setLoanChart((prevState) => ({
      ...prevState,
      series: seriesData,
      charts: [
        {
          options: {
            ...prevState.options,
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
  }, [tempLoanInputs, numberOfMonths]);

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

  const { user } = useAuth();
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

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-8">Loan Chart</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {loanChart?.charts?.map((series, index) => (
            <Card
              key={index}
              className="flex flex-col shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-2 hover:scale-105 border border-gray-300 rounded-md"
            >
              <Chart
                options={{
                  ...series.options,

                  xaxis: {
                    ...series.options.xaxis,
                    tickAmount: 12, // Ensure x-axis has 12 ticks
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
          className="overflow-auto my-8 rounded-md"
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

      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4 mr-4"
              onClick={addNewLoanInput}
            >
              Add new
            </button>

            <button
              className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoanSection;
