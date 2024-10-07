import { useCallback, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Card, Checkbox, FloatButton, Modal, Table, message } from "antd";
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
import { FileOutlined } from "@ant-design/icons";

import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";
import {
  CardContent,
  CardHeader,
  Card as CardShadcn,
  CardTitle,
} from "../../../components/ui/card";
import {
  Archive,
  Check,
  DollarSign,
  Download,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { debounce } from "lodash";
import { Settings } from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

const LoanInputForm = ({
  tempLoanInputs,
  renderLoanForm,
  handleLoanInputChange,
  addNewLoanInput,
  setIsDeleteModalOpen,
  handleSave,
  isLoading,
  numberOfMonths,
}) => {
  const [debouncedInputs, setDebouncedInputs] = useState(tempLoanInputs);
  useEffect(() => {
    setDebouncedInputs(tempLoanInputs);
  }, [tempLoanInputs]);
  // Debounced function to update state after 1 second
  const debouncedHandleInputChange = useCallback(
    debounce((id, field, value) => {
      handleLoanInputChange(id, field, value);
    }, 1000),
    [handleLoanInputChange]
  );

  const handleInputChange = (id, field, value) => {
    setDebouncedInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );

    // Call debounced state update
    debouncedHandleInputChange(id, field, value);
  };

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

  return (
    <section aria-labelledby="loan-heading" className="mb-8 NOsticky NOtop-8">
      {/* <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="loan-heading"
      >
        Loan
      </h2> */}

      {/* <div>
        <label
          htmlFor="selectedChannel"
          className="block my-4 text-base  darkTextWhite"
        ></label>
        
      </div> */}

      {debouncedInputs
        .filter((input) => input?.id == renderLoanForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-md p-6 border mb-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Loan Name:</span>
              <Input
                required
                className="border p-2 rounded-2xl border-gray-300"
                value={input.loanName}
                onChange={(e) =>
                  handleInputChange(input?.id, "loanName", e.target.value)
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
                  handleInputChange(
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
                  handleInputChange(
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
              <Select
                value={String(input.loanBeginMonth)} // Convert the value to string to handle both types
                onValueChange={
                  (value) =>
                    handleInputChange(
                      input?.id,
                      "loanBeginMonth",
                      Number(value)
                    ) // Ensure the value is stored as a number
                }
              >
                <SelectTrigger className="col-start-2 border-gray-300 w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {" "}
                        {/* Store as string */}
                        {`${months[monthIndex]}/${year}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Month Loan Ends:
              </span>
              <Select
                value={String(input.loanEndMonth)} // Convert the value to string to handle both types
                onValueChange={
                  (value) =>
                    handleInputChange(input?.id, "loanEndMonth", Number(value)) // Ensure the value is stored as a number
                }
              >
                <SelectTrigger className="col-start-2 border-gray-300 w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {" "}
                        {/* Store as string */}
                        {`${months[monthIndex]}/${year}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center items-center"></div>
          </div>
        ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="destructive"
          onClick={addNewLoanInput}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
          style={{ backgroundColor: "#EF4444", color: "white" }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>
        <Button
          variant="destructive"
          onClick={handleSave}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

const LoanSection = ({ numberOfMonths, isSaved, setIsSaved }) => {
  const dispatch = useDispatch();
  const { loanInputs } = useSelector((state) => state.loan);
  const [tempLoanInputs, setTempLoanInputs] = useState(loanInputs);
  const [renderLoanForm, setRenderLoanForm] = useState(loanInputs[0]?.id);

  const addNewLoanInput = () => {
    const maxId = Math.max(...tempLoanInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newLoan = {
      id: newId,
      loanName: `New loan ${tempLoanInputs?.length + 1}`,
      loanAmount: "0",
      interestRate: "0",
      loanBeginMonth: 1,
      loanEndMonth: 36,
    };
    setTempLoanInputs([...tempLoanInputs, newLoan]);
    setRenderLoanForm(newId.toString());
    message.success("Add new loan successfully.");
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
    const timer = setTimeout(() => {
      const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
      dispatch(setLoanData(calculatedData));
      const tableData = transformLoanDataForTable(
        loanInputs,
        renderLoanForm,
        numberOfMonths
      );
      dispatch(setLoanTableData(tableData));

      // Sử dụng setTimeout để setIsLoading(false) sau 2 giây

      setIsLoading(false);
    }, 500);

    // Cleanup function để clear timeout khi component unmount
    return () => clearTimeout(timer);
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
  const { startMonth, startYear, inputData } = useSelector(
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
        dataIndex: `month${i + 1}`,
        key: `month${i + 1}`,
        align: "right",
      };
    }),
  ];

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: {
        id: "loan-chart",
        type: "line",
        height: 350,
        fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
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
        // title: {
        //   text: "Month",
        //   style: {
        //     fontFamily: "Raleway Variable, sans-serif",
        //     fontSize: "13px",
        //   },
        // },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        min: 0, // Đặt giá trị tối thiểu của trục Oy là 0
        labels: {
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
          style: {
            fontFamily: "Raleway Variable, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
          },
        },
        // title: {
        //   text: "Amount ($)",
        //   style: {
        //     fontFamily: "Raleway Variable, sans-serif",
        //     fontSize: "13px",
        //   },
        // },
      },
      grid: { show: false },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Raleway Variable, sans-serif",
        fontSize: "13px",
        fontWeight: 500,
      },
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "straight" },
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

  const tableData = transformLoanDataForTable(
    tempLoanInputs,
    renderLoanForm,
    numberOfMonths
  );

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

        dispatch(setLoanInputs(tempLoanInputs));
        dispatch(setLoanTableData(tableData));

        const updatedInputData = {
          ...inputData,
          loanInputs: tempLoanInputs,
        };

        dispatch(setInputData(updatedInputData));

        const { error: updateError } = await supabase
          .from("finance")
          .update({ inputData: updatedInputData })
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
      setIsSaved(false);
      setIsLoading(false);
      setIsInputFormOpen(false);
    }
  };

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

  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Channel Name",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    transformLoanDataForTable(
      tempLoanInputs,
      renderLoanForm,
      numberOfMonths
    ).forEach((record) => {
      const row = [record.type];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Loan Data");

    // Write workbook and trigger download
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "loan_data.xlsx"
    );
  };

  const downloadJSON = () => {
    const loanTableData = transformLoanDataForTable(
      tempLoanInputs,
      renderLoanForm,
      numberOfMonths
    );

    // Update personnel inputs with formatted job begin and end months
    const updateLoanInputs = tempLoanInputs.map((input) => {
      const monthIndexStart =
        (Number(startingMonth) + Number(input.loanBeginMonth) - 2) % 12;

      const yearStart =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.loanBeginMonth) - 2) / 12
        );

      const monthIndexEnd =
        (Number(startingMonth) + Number(input.loanEndMonth) - 2) % 12;
      const yearEnd =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.loanEndMonth) - 2) / 12
        );

      return {
        ...input,
        loanBeginMonth: `${months[monthIndexStart]}/${yearStart}`,
        loanEndMonth: `${months[monthIndexEnd]}/${yearEnd}`,
      };
    });
    const data = {
      loanInputs: updateLoanInputs,
      loanTableData,
    };

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "loan_data.json");
  };

  const filteredTableData =
    renderLoanForm !== "all"
      ? transformLoanDataForTable(
          tempLoanInputs,
          renderLoanForm,
          numberOfMonths
        ).filter(
          (record) =>
            record.key !== "CF Loans" &&
            record.key !== "Total Remaining Balance"
        )
      : transformLoanDataForTable(
          tempLoanInputs,
          renderLoanForm,
          numberOfMonths
        );

  const handleRenderFormChange = (e) => {
    setIsLoading(true);
    setRenderLoanForm(e);
  };

  const [visibleCharts, setVisibleCharts] = useState({
    allLoanChart: true,
    componentCharts: {}, // Để lưu trạng thái của các component chart
  });

  // Cập nhật visibleCharts với tất cả các chart thành phần ban đầu được hiển thị
  useEffect(() => {
    const initialVisibleComponentCharts = {};
    loanChart?.charts
      ?.filter((chart) => chart.options.chart.id !== "allLoans")
      .forEach((chart) => {
        initialVisibleComponentCharts[chart.options.chart.id] = true;
      });
    setVisibleCharts((prev) => ({
      ...prev,
      componentCharts: initialVisibleComponentCharts,
    }));
  }, [loanChart]);

  // Metrics visibility state
  const [visibleMetrics, setVisibleMetrics] = useState({
    totalLoans: true,
    totalPayment: true,
    totalPrincipalPaid: true,
    totalInterestPaid: true,
    remainingBalance: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };
  const [metrics, setMetrics] = useState([
    {
      key: "totalLoans",
      title: "Total Loans",
      value: "",
      change: "",
      icon: DollarSign,
    },
    {
      key: "totalPayment",
      title: "Total Payment",
      value: "",
      change: "",
      icon: DollarSign,
    },
    {
      key: "totalPrincipalPaid",
      title: "Total Principal Paid",
      value: "",
      change: "",
      icon: Archive,
    },
    {
      key: "totalInterestPaid",
      title: "Total Interest Paid",
      value: "",
      change: "",
      icon: DollarSign,
    },
    {
      key: "remainingBalance",
      title: "Remaining Balance",
      value: "",
      change: "",
      icon: Layers,
    },
  ]);

  // Function to simplify data extraction
  const extractData = (data, keyPrefix, startMonth, endMonth) => {
    return Object.keys(data)
      .filter((key) => key.startsWith(keyPrefix))
      .slice(startMonth - 1, endMonth)
      .reduce((sum, monthKey) => sum + parseNumber(data[monthKey]), 0);
  };

  // Function to calculate metric changes
  const calculateChange = (startValue, endValue) => {
    if (startValue === 0) return 0;
    return ((endValue - startValue) / startValue) * 100;
  };

  // Simplified useEffect for calculating metrics and filtering data

  useEffect(() => {
    if (renderLoanForm === "all") {
      // New logic to calculate metrics for all loans
      let totalLoans = 0;
      let totalPayment = 0;
      let totalPrincipalPaid = 0;
      let totalInterestPaid = 0;
      let remainingBalance = 0;

      // Sum up totalLoans based on loanAmount for each loan input
      tempLoanInputs.forEach((loan) => {
        totalLoans += Number(loan.loanAmount);
        const filtered = filteredTableData?.filter((data) =>
          data?.key?.includes(loan.loanName)
        );

        const paymentRow = filtered.find((row) =>
          row.key.includes("Payment -")
        );
        if (paymentRow) {
          totalPayment += extractData(
            paymentRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const principalRow = filtered.find((row) =>
          row.key.includes("Principal -")
        );
        if (principalRow) {
          totalPrincipalPaid += extractData(
            principalRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const interestRow = filtered.find((row) =>
          row.key.includes("Interest -")
        );
        if (interestRow) {
          totalInterestPaid += extractData(
            interestRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const remainingBalanceRow = filtered.find((row) =>
          row.key.includes("Remaining Balance -")
        );
        if (remainingBalanceRow) {
          remainingBalance += parseNumber(
            remainingBalanceRow[`month${chartEndMonth}`]
          );
        }
      });

      setMetrics((prevMetrics) => [
        { ...prevMetrics[0], value: formatNumber(totalLoans) },
        { ...prevMetrics[1], value: formatNumber(totalPayment?.toFixed(2)) },
        {
          ...prevMetrics[2],
          value: formatNumber(totalPrincipalPaid.toFixed(2)),
        },
        {
          ...prevMetrics[3],
          value: formatNumber(totalInterestPaid.toFixed(2)),
        },
        { ...prevMetrics[4], value: formatNumber(remainingBalance.toFixed(2)) },
      ]);
    } else {
      // Case when a specific loan is selected
      const selectedLoan = tempLoanInputs.find(
        (input) => input.id == renderLoanForm
      );
      if (selectedLoan) {
        const filtered = filteredTableData?.filter((data) =>
          data?.key?.includes(selectedLoan.loanName)
        );

        let totalPayment = 0;
        let totalPrincipalPaid = 0;
        let totalInterestPaid = 0;
        let remainingBalance = 0;

        const paymentRow = filtered.find((row) =>
          row.key.includes("Payment -")
        );
        if (paymentRow) {
          totalPayment = extractData(
            paymentRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const principalRow = filtered.find((row) =>
          row.key.includes("Principal -")
        );
        if (principalRow) {
          totalPrincipalPaid = extractData(
            principalRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const interestRow = filtered.find((row) =>
          row.key.includes("Interest -")
        );
        if (interestRow) {
          totalInterestPaid = extractData(
            interestRow,
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        const remainingBalanceRow = filtered.find((row) =>
          row.key.includes("Remaining Balance -")
        );
        if (remainingBalanceRow) {
          remainingBalance = parseNumber(
            remainingBalanceRow[`month${chartEndMonth}`]
          );
        }

        setMetrics((prevMetrics) => [
          { ...prevMetrics[0], value: formatNumber(selectedLoan.loanAmount) },
          { ...prevMetrics[1], value: formatNumber(totalPayment?.toFixed(2)) },
          {
            ...prevMetrics[2],
            value: formatNumber(totalPrincipalPaid.toFixed(2)),
          },
          {
            ...prevMetrics[3],
            value: formatNumber(totalInterestPaid.toFixed(2)),
          },
          {
            ...prevMetrics[4],
            value: formatNumber(remainingBalance.toFixed(2)),
          },
        ]);
      }
    }
  }, [chartStartMonth, chartEndMonth, renderLoanForm, tempLoanInputs]);

  const renderValue =
    tempLoanInputs.find((item) => item.id == renderLoanForm) || "all";

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
            {/* <h2 className="text-lg font-semibold">
              I. Metrics (Under Constructions)
            </h2> */}

            <Select
              value={renderValue.id ? renderValue.id : "all"}
              onValueChange={(e) => {
                handleRenderFormChange(e);
              }}
              className="w-full md:w-auto min-w-[10rem]"
            >
              <SelectTrigger className="w-full md:w-auto min-w-[10rem]">
                <SelectValue placeholder="Offline">
                  {renderValue.loanName ? renderValue.loanName : "All"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full md:w-auto min-w-[10rem]">
                <SelectItem value="all">All</SelectItem>
                {tempLoanInputs.map((input) => (
                  <SelectItem key={input?.id} value={input?.id}>
                    {input.loanName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col md:!mt-0 !mt-2">
              {/* Bộ chọn khoảng thời gian */}

              <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                <div className="min-w-[9vw] w-full flex flex-row sm:!mr-0 !mr-1">
                  <Select
                    value={chartStartMonth}
                    onValueChange={(value) => {
                      setChartStartMonth(
                        Math.max(1, Math.min(value, chartEndMonth))
                      );
                    }}
                  >
                    <SelectTrigger className="w-full sm:!justify-between !justify-center">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <label
                  htmlFor="endMonthSelect"
                  className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                >
                  -
                </label>
                <div className="min-w-[9vw] w-full flex flex-row sm:!ml-0 !ml-1">
                  <Select
                    value={chartEndMonth}
                    onValueChange={(value) => {
                      setChartEndMonth(
                        Math.max(
                          chartStartMonth,
                          Math.min(value, numberOfMonths)
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Popover để chọn metrics hiển thị */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="bg-white right-0 left-auto"
                  align="end"
                  style={{
                    maxHeight: "300px", // Giới hạn chiều cao tối đa của PopoverContent
                    overflowY: "auto", // Cho phép cuộn theo chiều dọc khi vượt quá chiều cao
                    paddingRight: "1rem", // Tạo khoảng trống cho thanh cuộn
                  }}
                >
                  <div className="grid gap-4">
                    <h4 className="font-medium leading-none">
                      Visible Metrics
                    </h4>
                    {metrics.map((metric) => (
                      <div
                        key={metric.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={metric.key}
                          checked={visibleMetrics[metric.key]}
                          onChange={() => toggleMetric(metric.key)}
                        />
                        <label
                          htmlFor={metric.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {metric.title}
                        </label>
                      </div>
                    ))}

                    {/* Thêm phần Visible Charts */}
                    {/* <h4 className="font-medium leading-none mt-4">
                      Visible Charts
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allLoanChart"
                        checked={visibleCharts.allLoanChart}
                        onChange={() =>
                          setVisibleCharts((prev) => ({
                            ...prev,
                            allLoanChart: !prev.allLoanChart,
                          }))
                        }
                      />
                      <label
                        htmlFor="allLoanChart"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        All Remaining Loans
                      </label>
                    </div> */}

                    {/* Hiển thị danh sách các component charts */}
                    {/* {loanChart?.charts
                      ?.filter((chart) => chart.options.chart.id !== "allLoans")
                      .map((chart, index) => (
                        <div
                          key={chart.options.chart.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={chart.options.chart.id}
                            checked={
                              visibleCharts.componentCharts[
                                chart.options.chart.id
                              ]
                            }
                            onChange={() =>
                              setVisibleCharts((prev) => ({
                                ...prev,
                                componentCharts: {
                                  ...prev.componentCharts,
                                  [chart.options.chart.id]:
                                    !prev.componentCharts[
                                      chart.options.chart.id
                                    ],
                                },
                              }))
                            }
                          />
                          <label
                            htmlFor={chart.options.chart.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {`${String.fromCharCode(65 + index)}. ${chart.options.title.text}`}
                          </label>
                        </div>
                      ))} */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hiển thị các metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(
              (metric) =>
                visibleMetrics[metric.key] && (
                  <CardShadcn key={metric.key}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {metric.change
                          ? `${metric.change}% from last period`
                          : ""}
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>
        {/* <h3 className="text-lg font-semibold mb-8">II. Loan Chart</h3> */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* <h4 className="text-base font-semibold mb-4">1. All loan chart</h4> */}
          {/* All loan chart */}
          {!visibleCharts.allLoanChart ? (
            <div className="flex justify-center items-center h-[350px]">
              <p className="animate-blink text-center text-lg font-semibold text-gray-500">
                Temporarily Disabled
              </p>
            </div>
          ) : (
            renderLoanForm === "all" &&
            loanChart?.charts?.map((series, index) => (
              <div key={index} className="my-4">
                <h5 className="font-semibold text-sm mb-2">{`${String.fromCharCode(65 + index)}. ${series.options.title.text}`}</h5>

                <CardShadcn
                  key={index}
                  className="flex flex-col transition duration-500 !rounded-md relative"
                >
                  <CardHeader>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-50"
                      onClick={(event) => handleChartClick(series, event)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                      </svg>
                      <span className="sr-only">Fullscreen</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Chart
                      options={{
                        ...series.options,
                        xaxis: { ...series.options.xaxis },
                        stroke: { width: 1, curve: "straight" },
                      }}
                      series={series.series}
                      type="area"
                      height={350}
                    />
                  </CardContent>
                </CardShadcn>
              </div>
            ))
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* <h4 className="text-base font-semibold mb-4">2. Component charts</h4> */}
          {/* Component charts */}
          <div className="">
            {loanChart?.charts
              ?.filter(
                (chart) =>
                  chart.options.chart.id !== "allLoans" &&
                  chart?.options?.title?.text?.toLowerCase() ===
                    tempLoanInputs
                      .find((input) => input.id == renderLoanForm)
                      ?.loanName?.toLowerCase()
              )
              .map((series, index) =>
                !visibleCharts.componentCharts[series.options.chart.id] ? (
                  <div
                    key={series.options.chart.id}
                    className="flex justify-center items-center h-[350px] bg-gray-100 rounded-md"
                  >
                    <p className="animate-blink text-center text-lg font-semibold text-gray-500">
                      Temporarily Disabled
                    </p>
                  </div>
                ) : (
                  <div className="ml-2">
                    <h5 className="font-semibold text-sm mb-2">
                      {`${String.fromCharCode(65 + index)}. ${series.options.title.text}`}
                    </h5>

                    <CardShadcn
                      key={series.options.chart.id}
                      className="flex flex-col transition duration-500 !rounded-md relative"
                    >
                      <CardHeader>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-50"
                          onClick={(event) => handleChartClick(series, event)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M15 3h6v6" />
                            <path d="M10 14 21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                          </svg>
                          <span className="sr-only">Fullscreen</span>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <Chart
                          options={{
                            ...series.options,
                            xaxis: { ...series.options.xaxis },
                            stroke: { width: 1, curve: "straight" },
                          }}
                          series={series.series}
                          type="area"
                          height={350}
                        />
                      </CardContent>
                    </CardShadcn>
                  </div>
                )
              )}
          </div>
        </div>
        <Modal
          zIndex={42424244}
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
              className="p-4"
            />
          )}
        </Modal>
        <span>
          <h3 className="text-lg font-semibold mt-20 my-8">
            {/* III. Loan Table */}
          </h3>

          <div className="flex justify-between items-center">
            <ButtonV0 variant="outline" onClick={downloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </ButtonV0>
          </div>
        </span>
        <Table
          className="custom-table bg-white overflow-auto my-8 rounded-md"
          size="small"
          dataSource={filteredTableData}
          columns={loanColumns}
          pagination={false}
          loading={isLoading}
          bordered={false} // Tắt border mặc định của antd
          rowClassName={(record) =>
            record.key === record.type ? "font-bold" : ""
          }
        />
      </div>

      <div className="relative w-full xl:w-1/4">
        <div className="!py-4 xl:!block !hidden border-white !sticky !top-28">
          <LoanInputForm
            tempLoanInputs={tempLoanInputs}
            renderLoanForm={renderLoanForm}
            handleRenderFormChange={handleRenderFormChange}
            handleLoanInputChange={handleLoanInputChange}
            addNewLoanInput={addNewLoanInput}
            confirmDelete={confirmDelete}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            isDeleteModalOpen={isDeleteModalOpen}
            handleSave={handleSave}
            isLoading={isLoading}
            numberOfMonths={numberOfMonths}
          />
        </div>
      </div>

      <div className="xl:!hidden !block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "80px",
            width: "48px",
            height: "48px",
          }}
          className="!shadow-md !bg-[#f3f4f6]"
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal zIndex={42424244} open={isInputFormOpen} centered={true}>
          <LoanInputForm
            tempLoanInputs={tempLoanInputs}
            renderLoanForm={renderLoanForm}
            handleRenderFormChange={handleRenderFormChange}
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
          zIndex={42424244}
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
          Are you sure you want to delete{" "}
          <span className="text-[#f5222d]">{renderValue?.loanName}</span>?
        </Modal>
      )}
    </div>
  );
};

export default LoanSection;
