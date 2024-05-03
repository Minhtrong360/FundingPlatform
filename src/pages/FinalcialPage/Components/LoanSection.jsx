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
  const [renderLoanForm, setRenderLoanForm] = useState("all");

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: {
          text: "Amount ($)",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.5,
         
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 2, // Set the border radius to 10
        },
      },
      stroke: { width: 1 },
      colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
      dataLabels: { enabled: false },
     
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    setTempLoanInputs(loanInputs);
    setRenderLoanForm("all");
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
    const newInputs = tempLoanInputs.filter((input) => input?.id != id);
    setTempLoanInputs(newInputs);
    setRenderLoanForm(newInputs[0]?.id);
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
    const calculatedData = calculateLoanData(loanInputs);
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
    const seriesData = calculateLoanData(tempLoanInputs).flatMap((loan) => {
      return [
        {
          name: `${loan.loanName} - Payment`,
          data: loan.loanDataPerMonth.map((month) => month.payment),
        },
        {
          name: `${loan.loanName} - Principal`,
          data: loan.loanDataPerMonth.map((month) => month.principal),
        },
        {
          name: `${loan.loanName} - Interest`,
          data: loan.loanDataPerMonth.map((month) => month.interest),
        },
        {
          name: `${loan.loanName} - Remaining Balance`,
          data: loan.loanDataPerMonth.map((month) => month.balance),
        },
      ];
    });

    setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
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
      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
        <section aria-labelledby="loan-heading" className="mb-8">
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
                className="bg-white rounded-md shadow-xl p-6 border my-4"
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
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-lg font-semibold mb-4">Loan Data</h3>
        <Table
          className="overflow-auto my-8 rounded-md shadow-xl"
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
        <h3 className="text-lg font-semibold my-8">Loan Chart</h3>

        <div className="grid md:grid-cols-2 gap-6">
         <Card className="flex flex-col shadow-xl">
  <Chart
    options={{
      ...loanChart.options,
      xaxis: {
        ...loanChart.options.xaxis,
        tickAmount: 12, // Set the number of ticks on the x-axis to 12
      },
    }}
    series={loanChart.series}
    type="area"
    height={350}
  />
</Card>



        </div>
      </div>
    </div>
  );
};

export default LoanSection;
