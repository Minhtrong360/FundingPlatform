import { Button, Checkbox, FloatButton, Modal, Table, Tabs } from "antd";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import React, { useEffect, useState } from "react";
import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
} from "../../../features/CostSlice";
import { calculateProfitAndLoss } from "../../../features/ProfitAndLossSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateChannelRevenue,
  setCogsData,
  setRevenueData,
  setRevenueDeductionData,
} from "../../../features/SaleSlice";
import {
  calculatePersonnelCostData,
  setPersonnelCostData,
} from "../../../features/PersonnelSlice";
import {
  calculateInvestmentData,
  setInvestmentData,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import {
  calculateLoanData,
  setLoanData,
  setLoanTableData,
  transformLoanDataForTable,
} from "../../../features/LoanSlice";
import {
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";
import CustomChart from "./CustomChart";
import SelectField from "../../../components/SelectField";
import { setCutMonth } from "../../../features/DurationSlice";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";
import GroqJS from "./GroqJson";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  CardContent,
  CardHeader,
  Card as CardShadcn,
  CardTitle,
} from "../../../components/ui/card";
import { Download } from "lucide-react";
import { Button as ButtonV0 } from "../../../components/ui/button";
import {
  Search,
  MessageSquare,
  PhoneCall,
  Mail,
  Globe,
  CalendarIcon,
  Users,
  Clock,
  ThumbsUp,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

function CashFlowSection({ numberOfMonths }) {
  const dispatch = useDispatch();
  const { cutMonth } = useSelector((state) => state.durationSelect);

  const { customerGrowthData, customerInputs } = useSelector(
    (state) => state.customer
  );

  const { channelInputs, revenueData, revenueDeductionData, cogsData } =
    useSelector((state) => state.sales);

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
    } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        channelInputs
      )
    );

    dispatch(setRevenueData(revenueByChannelAndProduct));
    dispatch(setRevenueDeductionData(DeductionByChannelAndProduct));
    dispatch(setCogsData(cogsByChannelAndProduct));
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  const { incomeTax: incomeTaxRate, startingCashBalance } = useSelector(
    (state) => state.durationSelect
  );

  const { costData, costInputs } = useSelector((state) => state.cost);

  useEffect(() => {
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
    dispatch(setCostData(calculatedData));
  }, [costInputs, numberOfMonths]);

  const { personnelCostData, personnelInputs } = useSelector(
    (state) => state.personnel
  );

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );
    dispatch(setPersonnelCostData(calculatedData));
  }, [personnelInputs, numberOfMonths]);

  const { investmentData, investmentTableData, investmentInputs } = useSelector(
    (state) => state.investment
  );
  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
  }, [investmentInputs, numberOfMonths]);

  useEffect(() => {
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      investmentInputs[0]?.id,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentData, investmentInputs, numberOfMonths]);

  const { loanInputs, loanData, loanTableData } = useSelector(
    (state) => state.loan
  );

  useEffect(() => {
    const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
    dispatch(setLoanData(calculatedData));
  }, [loanInputs, numberOfMonths]);

  useEffect(() => {
    const tableData = transformLoanDataForTable(
      loanInputs,
      loanInputs[0]?.id,
      numberOfMonths
    );
    dispatch(setLoanTableData(tableData));
  }, [loanInputs, numberOfMonths]);

  const { fundraisingInputs, fundraisingTableData } = useSelector(
    (state) => state.fundraising
  );

  useEffect(() => {
    const tableData = transformFundraisingDataForTable(
      fundraisingInputs,
      numberOfMonths
    );

    dispatch(setFundraisingTableData(tableData));
  }, [fundraisingInputs, numberOfMonths]);

  const {
    totalInvestmentDepreciation,

    totalPrincipal,

    netIncome,
  } = calculateProfitAndLoss(
    numberOfMonths,
    revenueData,
    revenueDeductionData,
    cogsData,
    costData,
    personnelCostData,
    investmentData,
    loanData,
    incomeTaxRate,
    startingCashBalance
  );

  const cfInvestmentsArray = [];
  if (investmentTableData.length > 0) {
    const cfInvestments = investmentTableData.find(
      (item) => item.key === "CF Investments"
    );

    Object.keys(cfInvestments).forEach((key) => {
      if (key.startsWith("month")) {
        cfInvestmentsArray.push(parseNumber(cfInvestments[key]));
      }
    });
  } else {
    // Trường hợp investmentTableData.length = 0, tạo mảng với giá trị 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      cfInvestmentsArray.push(0);
    }
  }

  const cfLoanArray = [];

  if (loanTableData.length > 0) {
    const cfLoans = loanTableData.find((item) => item.key === "CF Loans");

    Object.keys(cfLoans).forEach((key) => {
      if (key.startsWith("Month ")) {
        cfLoanArray.push(parseNumber(cfLoans[key]));
      }
    });
  } else {
    // Trường hợp investmentTableData.length = 0, tạo mảng với giá trị 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      cfLoanArray.push(0);
    }
  }

  const commonStockArr = [];
  const preferredStockArr = [];
  const capitalArr = [];
  const accumulatedCommonStockArr = [];
  const accumulatedPreferredStockArr = [];
  const accumulatedCapitalArr = [];

  fundraisingTableData.forEach((data) => {
    if (data.key === "Increased in Common Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          commonStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Increased in Preferred Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          preferredStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Increased in Paid in Capital") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          capitalArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Common Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedCommonStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Preferred Stock") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedPreferredStockArr.push(parseNumber(data[key]));
        }
      });
    } else if (data.key === "Accumulated Paid in Capital") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("month")) {
          accumulatedCapitalArr.push(parseNumber(data[key]));
        }
      });
    }
  });

  const netCashChanges = netIncome.map((_, index) => {
    const cfOperations =
      netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
    const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
    const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
    const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
    const cfLoan = cfLoanArray[index] || 0;
    const cfInvestment = cfInvestmentsArray[index] || 0;
    const cfFinancing =
      cfLoan -
      totalPrincipal[index] +
      increaseCommonStock +
      increasePreferredStock +
      increasePaidInCapital; // Calculate CF Financing directly
    const netCash = cfOperations - cfInvestment + cfFinancing;
    return netCash;
  });

  const calculateCashBalances = (startingCash, netCashChanges) => {
    const cashBalances = netCashChanges?.reduce((acc, netCashChange, index) => {
      if (index === 0) {
        acc.push(parseFloat(startingCash) + netCashChange);
      } else {
        acc.push(acc[index - 1] + netCashChange);
      }
      return acc;
    }, []);
    return cashBalances;
  };
  const cashBeginBalances = [
    parseFloat(startingCashBalance),
    ...calculateCashBalances(startingCashBalance, netCashChanges)?.slice(0, -1),
  ];

  const cashEndBalances = calculateCashBalances(
    startingCashBalance,
    netCashChanges
  );

  const CFOperationsArray = netIncome.map(
    (value, index) =>
      value +
      totalInvestmentDepreciation[index] +
      0 /* Inventory */ +
      0 /* AR */ -
      0 /* AP */
  );

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const realDate = Array.from({ length: numberOfMonths }, (_, i) => {
    const monthIndex = (startingMonth + i - 1) % 12;
    const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
    return `${monthIndex + 1}-${year}`;
  });
  const cashFlowData = [
    { key: "Operating Activities" },
    { key: "Net Income", values: netIncome },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    {
      key: "Decrease (Increase) in Inventory",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AR",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AP",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "CF Operations",
      values: CFOperationsArray,
    },
    { key: "Investing Activities" },
    {
      key: "CF Investments",
      values: cfInvestmentsArray,
    },
    { key: "Financing Activities" },
    {
      key: "CF Loans",
      values: cfLoanArray,
    },
    {
      key: "Total Principal", // Updated key to Total Principal
      values: totalPrincipal, // Updated values with totalPrincipal
    },
    {
      key: "Increase in Common Stock",
      values: commonStockArr, // Placeholder values
    },
    {
      key: "Increase in Preferred Stock",
      values: preferredStockArr, // Placeholder values
    },
    {
      key: "Increase in Paid in Capital",
      values: capitalArr, // Placeholder values
    },
    {
      key: "CF Financing",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        return (
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital
        );
      }),
    },
    {
      key: "Net +/- in Cash",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        const cfOperations =
          netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
        const cfInvestment = cfInvestmentsArray[index] || 0;
        const cfFinancing =
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital;
        return cfOperations - cfInvestment + cfFinancing;
      }),
    },
    {
      key: "Cash Begin",
      values: cashBeginBalances,
    },
    {
      key: "Cash End",
      values: cashEndBalances,
    },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [realDate[i]]: formatNumber(value?.toFixed(2)),
      }),
      {}
    ),
  }));

  const positionDataWithNetIncome = [
    { key: "Operating Activities" },
    { key: "Net Income", values: netIncome },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    {
      key: "Decrease (Increase) in Inventory",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AR",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "Decrease (Increase) in AP",
      values: new Array(numberOfMonths).fill(0),
    },
    {
      key: "CF Operations",
      values: CFOperationsArray,
    },
    { key: "1" },
    { key: "Investing Activities" },
    {
      key: "CF Investments",
      values: cfInvestmentsArray,
    },
    { key: "1" },
    { key: "Financing Activities" },
    {
      key: "CF Loans",
      values: cfLoanArray,
    },
    {
      key: "Total Principal", // Updated key to Total Principal
      values: totalPrincipal, // Updated values with totalPrincipal
    },
    {
      key: "Increase in Common Stock",
      values: commonStockArr, // Placeholder values
    },
    {
      key: "Increase in Preferred Stock",
      values: preferredStockArr, // Placeholder values
    },
    {
      key: "Increase in Paid in Capital",
      values: capitalArr, // Placeholder values
    },
    {
      key: "CF Financing",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        return (
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital
        );
      }),
    },
    { key: "1" },
    {
      key: "Net +/- in Cash",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = commonStockArr[index] || 0; // Placeholder value
        const increasePreferredStock = preferredStockArr[index] || 0; // Placeholder value
        const increasePaidInCapital = capitalArr[index] || 0; // Placeholder value
        const cfOperations =
          netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
        const cfInvestment = cfInvestmentsArray[index] || 0;
        const cfFinancing =
          cfLoan -
          totalPrincipal[index] +
          increaseCommonStock +
          increasePreferredStock +
          increasePaidInCapital;
        return cfOperations - cfInvestment + cfFinancing;
      }),
    },
    {
      key: "Cash Begin",
      values: cashBeginBalances,
    },
    {
      key: "Cash End",
      values: cashEndBalances,
    },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
      }),
      {}
    ),
  }));

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

  const positionColumns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
      render: (text, record) => ({
        children: (
          <div
            className={" md:whitespace-nowrap "}
            style={{ visibility: record.metric === "1" ? "hidden" : "visible" }}
          >
            <div
              style={{
                fontWeight:
                  record.metric === "CF Operations" ||
                  record.metric === "CF Investments" ||
                  record.metric === "CF Investments" ||
                  record.metric === "CF Financing" ||
                  record.metric === "Net +/- in Cash" ||
                  record.metric === "Cash Begin" ||
                  record.metric === "Cash End" ||
                  record.metric === "Operating Activities" ||
                  record.metric === "Investing Activities" ||
                  record.metric === "Financing Activities"
                    ? "bold"
                    : "normal",
              }}
            >
              {text}
            </div>
          </div>
        ),
      }),
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (startingMonth + i - 1) % 12;
      const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
      return {
        title: `${months[monthIndex]}/${year}`,
        dataIndex: `Month ${i + 1}`,
        key: `Month ${i + 1}`,
        align: "right",
        onCell: (record) => {
          if (
            record.metric === "Operating Activities" ||
            record.metric === "Investing Activities" ||
            record.metric === "Financing Activities"
          ) {
            return {
              style: {
                // borderRight: "1px solid #f0f0f0",
              },
            };
          } else if (
            record.metric === "CF Operations" ||
            record.metric === "Operating Activities" ||
            record.metric === "CF Investments" ||
            record.metric === "CF Financing" ||
            record.metric === "Net +/- in Cash" ||
            record.metric === "Cash Begin" ||
            record.metric === "Cash End"
          ) {
            return {
              style: {
                borderTop: "2px solid #000000",
                fontWeight: "bold",
              },
            };
          } else if (
            record.metric === "CF Operations" ||
            record.metric === "Operating Activities" ||
            record.metric === "CF Investments" ||
            record.metric === "CF Financing" ||
            record.metric === "Net +/- in Cash" ||
            record.metric === "Cash Begin" ||
            record.metric === "Cash End"
          ) {
            return {
              style: {
                fontWeight: "bold",
              },
            };
          } else {
            return {
              style: {
                // borderRight: "1px solid #f0f0f0",
              },
            };
          }
        },
      };
    }),
  ];

  const [selectedChart, setSelectedChart] = useState("cash-flow-chart"); // State để lưu trữ biểu đồ được chọn

  // Các useEffect và mã khác ở đây không thay đổi

  // Hàm xử lý sự kiện khi giá trị của dropdown thay đổi
  const handleChartSelect = (value) => {
    setSelectedChart(value);
  };

  const handleCutMonthChange = (e) => {
    dispatch(setCutMonth(Number(e.target.value)));
  };

  const divideMonthsIntoYearsForCashFlow = () => {
    const years = [];
    const startingMonthIndex = startMonth - 1;
    const startingYear = startYear;

    if (cutMonth > 0) {
      const firstYearMonths = Array.from({ length: cutMonth }, (_, i) => i + 1);
      const firstYearTextMonths = firstYearMonths.map((month) => {
        const monthIndex = (startingMonthIndex + month - 1) % 12;
        const year =
          startingYear + Math.floor((startingMonthIndex + month - 1) / 12);
        return `${months[monthIndex]}/${year}`;
      });
      years.push({
        year: "First Year",
        months: firstYearMonths,
        textMonth: firstYearTextMonths,
      });
    }

    const remainingMonthsAfterFirstYear = numberOfMonths - cutMonth;
    const fullYearsCount = Math.floor(remainingMonthsAfterFirstYear / 12);
    const remainingMonthsInLastYear = remainingMonthsAfterFirstYear % 12;

    for (let i = 0; i < fullYearsCount; i++) {
      const yearMonths = Array.from(
        { length: 12 },
        (_, idx) => idx + 1 + cutMonth + i * 12
      );
      const yearTextMonths = yearMonths.map((month) => {
        const monthIndex = (startingMonthIndex + month - 1) % 12;
        const year =
          startingYear + Math.floor((startingMonthIndex + month - 1) / 12);
        return `${months[monthIndex]}/${year}`;
      });
      years.push({
        year: `Year ${i + 2}`,
        months: yearMonths,
        textMonth: yearTextMonths,
      });
    }

    if (remainingMonthsInLastYear > 0) {
      const lastYearMonths = Array.from(
        { length: remainingMonthsInLastYear },
        (_, idx) => idx + 1 + cutMonth + fullYearsCount * 12
      );
      const lastYearTextMonths = lastYearMonths.map((month) => {
        const monthIndex = (startingMonthIndex + month - 1) % 12;
        const year =
          startingYear + Math.floor((startingMonthIndex + month - 1) / 12);
        return `${months[monthIndex]}/${year}`;
      });
      years.push({
        year: `Last Year`,
        months: lastYearMonths,
        textMonth: lastYearTextMonths,
      });
    }

    return years;
  };

  const getDataSourceForYearCashFlow = (months) => {
    const monthKeys = months.map((month) => `Month ${month}`);

    return positionDataWithNetIncome.map((data) => {
      const filteredData = monthKeys.reduce((acc, monthKey) => {
        acc[monthKey] = data[monthKey]; // Extracts the value for each month
        return acc;
      }, {});

      // Calculate the Year Total for each cash flow component
      const yearTotal = monthKeys.reduce(
        (sum, key) =>
          sum + (data[key] ? parseFloat(data[key].replace(/,/g, "")) : 0),
        0
      );

      return {
        metric: data.metric,
        ...filteredData,
        yearTotal: yearTotal.toFixed(2), // Add the Year Total to the data object
      };
    });
  };

  const generateCashFlowTableColumns = (year) => {
    const columns = [
      {
        title: "Metric",
        dataIndex: "metric",
        key: "metric",
        fixed: "left",
        render: (text, record) => ({
          children: (
            <div
              className={"md:whitespace-nowrap"}
              style={{
                visibility: record.metric === "1" ? "hidden" : "visible",
              }}
            >
              <div>{text}</div>
            </div>
          ),
        }),
      },
      ...year.textMonth.map((textMonth, index) => ({
        title: textMonth,
        dataIndex: `Month ${year.months[index]}`,
        key: `Month ${year.months[index]}`,
        render: (text, record) => (
          <div
            style={{
              visibility: record.metric === "1" ? "hidden" : "visible",
            }}
          >
            {text}
          </div>
        ),
      })),
      {
        title: "Year Total",
        dataIndex: "yearTotal",
        key: "yearTotal",
        render: (text) => <strong>{formatNumber(text)}</strong>,
      },
    ];
    return columns;
  };

  const [activeTab, setActiveTab] = useState(0); // State to track active tab
  const { TabPane } = Tabs; // Destructure TabPane from Tabs
  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Metric",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    positionDataWithNetIncome.forEach((record) => {
      const row = [record.metric];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`Month ${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Cash Flow Data");

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
      "cashflow_data.xlsx"
    );
  };
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  const [visibleMetrics, setVisibleMetrics] = useState({
    existingCustomers: true,
    numberOfChannels: true,
    previousMonthUsers: true,
    addedUsers: true,
    churnedUsers: true,
    totalUsers: true,
    customerSatisfaction: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const metrics = [
    {
      key: "existingCustomers",
      title: "Existing Customers",
      value: "1,234",
      change: "+10%",
      icon: Users,
    },
    {
      key: "numberOfChannels",
      title: "Number of Channels",
      value: "5",
      change: "+1",
      icon: MessageSquare,
    },
    {
      key: "previousMonthUsers",
      title: "Previous month users",
      value: "10,987",
      change: "-",
      icon: Users,
    },
    {
      key: "addedUsers",
      title: "Added Users",
      value: "1,345",
      change: "+22%",
      icon: UserPlus,
    },
    {
      key: "churnedUsers",
      title: "No. of User Churned",
      value: "201",
      change: "-5%",
      icon: UserMinus,
    },
    {
      key: "totalUsers",
      title: "No. of Users",
      value: "12,131",
      change: "+11%",
      icon: Users,
    },
    {
      key: "customerSatisfaction",
      title: "Customer Satisfaction",
      value: "92%",
      change: "+3%",
      icon: ThumbsUp,
    },
  ];

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
            <h2 className="text-lg font-semibold">
              I. Metrics (Under Constructions)
            </h2>
            <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col">
              {/* Bộ chọn khoảng thời gian */}

              <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                <div className="min-w-[10vw] w-full flex flex-row sm:!mr-0 !mr-1">
                  <label
                    htmlFor="startMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    From:
                  </label>
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
                <div className="min-w-[10vw] w-full flex flex-row sm:!ml-0 !ml-1">
                  <label
                    htmlFor="endMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    To:
                  </label>
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
                  <ButtonV0 variant="outline" className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Options
                  </ButtonV0>
                </PopoverTrigger>
                <PopoverContent
                  className="bg-white right-0 left-auto"
                  align="end"
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
                        {metric.change} from last period
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>

        <div className="">
          <h3 className="text-lg font-semibold mb-4">II. Relevant Chart</h3>

          <div className=" gap-4 mb-3">
            <Select
              onValueChange={(value) => handleChartSelect(value)}
              value={selectedChart}
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectTrigger className="bg-white border-solid border-[1px] border-gray-300 w-full lg:w-[20%]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent position="popper" className="bg-white">
                <SelectItem
                  className="hover:cursor-pointer"
                  value="cash-flow-chart"
                >
                  Cash Flow
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="cash-begin-balances-chart"
                >
                  Cash Begin
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="cash-end-balances-chart"
                >
                  Cash End
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-principal-chart"
                >
                  Total principal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedChart === "cash-flow-chart" && (
            <CustomChart
              chartStartMonth={chartStartMonth}
              chartEndMonth={chartEndMonth}
              numberOfMonths={numberOfMonths}
              id="cash-flow-chart"
              yaxisTitle="Cash Flow ($)"
              seriesTitle="Net Cash Change"
              RenderData={netCashChanges}
              title="Cash Flow Overview"
            />
          )}

          {selectedChart === "total-principal-chart" && (
            <CustomChart
              chartStartMonth={chartStartMonth}
              chartEndMonth={chartEndMonth}
              numberOfMonths={numberOfMonths}
              id="total-principal-chart"
              yaxisTitle="Total Principal ($)"
              seriesTitle="Total Principal"
              RenderData={totalPrincipal}
              title="Total Principal Over Time"
            />
          )}

          {selectedChart === "cash-begin-balances-chart" && (
            <CustomChart
              chartStartMonth={chartStartMonth}
              chartEndMonth={chartEndMonth}
              numberOfMonths={numberOfMonths}
              id="cash-begin-balances-chart"
              yaxisTitle="Cash Begin Balances ($)"
              seriesTitle="Cash Begin"
              RenderData={cashBeginBalances}
              title="Cash Begin Balances Over Time"
            />
          )}

          {selectedChart === "cash-end-balances-chart" && (
            <CustomChart
              chartStartMonth={chartStartMonth}
              chartEndMonth={chartEndMonth}
              numberOfMonths={numberOfMonths}
              id="cash-end-balances-chart"
              yaxisTitle="Cash End Balances ($)"
              seriesTitle="Cash End"
              RenderData={cashEndBalances}
              title="Cash End Balances Over Time"
            />
          )}

          <div className="flex justify-between items-center my-4 mt-20">
            <h3 className="text-lg font-semibold">III. Cash Flow</h3>
            <ButtonV0 variant="outline" onClick={downloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </ButtonV0>
          </div>
          <Table
            className="bg-white overflow-auto my-8 rounded-md "
            size="small"
            dataSource={positionDataWithNetIncome}
            columns={positionColumns}
            pagination={false}
          />
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Checkbox
              className="col-span-2"
              checked={showAdvancedInputs}
              onChange={(e) => setShowAdvancedInputs(e.target.checked)}
            >
              Advanced
            </Checkbox>
          </div>

          {showAdvancedInputs && (
            <>
              <h3 className="text-lg font-semibold my-5 mt-20">
                IV. Cash Flow By Years
              </h3>

              <div className="w-full lg:w-[20%] md:w-[50%] my-5">
                <SelectField
                  label="Select Cut Month:"
                  id="Select Cut Month:"
                  name="Select Cut Month:"
                  value={cutMonth}
                  onChange={handleCutMonthChange}
                  options={Array.from({ length: 12 }, (_, index) => ({
                    label: `${index + 1}`,
                    value: `${index + 1}`,
                  })).map((option) => option.label)} // Chỉ trả về mảng các label
                />
              </div>

              <Tabs
                activeKey={activeTab.toString()}
                onChange={(key) => setActiveTab(parseInt(key))}
              >
                {divideMonthsIntoYearsForCashFlow().map((year, index) => (
                  <TabPane tab={year.year} key={index}>
                    <Table
                      className="bg-white overflow-auto my-8 rounded-md "
                      size="small"
                      dataSource={getDataSourceForYearCashFlow(year.months)}
                      columns={generateCashFlowTableColumns(year)}
                      pagination={false}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </>
          )}
        </div>
      </div>

      <div className="w-full xl:w-1/4 sm:!p-4 !p-0 xl:!block !hidden">
        <section className="mb-8 NOsticky NOtop-8 ">
          <GroqJS
            datasrc={cashFlowData}
            inputUrl="urlBS"
            numberOfMonths={numberOfMonths}
          />
        </section>
      </div>

      <div className="xl:!hidden !block">
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
          open={isInputFormOpen}
          onCancel={() => {
            setIsInputFormOpen(false);
          }}
          cancelText="Close"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          okButtonProps={{
            style: {
              display: "none",
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          centered={true}
          zIndex={42424243}
        >
          <GroqJS datasrc={cashFlowData} inputUrl="urlCF" />
        </Modal>
      )}
    </div>
  );
}

export default CashFlowSection;