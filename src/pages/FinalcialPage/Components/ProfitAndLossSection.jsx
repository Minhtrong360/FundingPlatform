import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FloatButton,
  Modal,
  Table,
  Tabs,
  Tooltip,
} from "antd";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

import { useDispatch, useSelector } from "react-redux";

import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
  setCostTableData,
  transformCostDataForTable,
} from "../../../features/CostSlice";
import {
  calculateChannelRevenue,
  setCogsData,
  setRevenueData,
  setRevenueDeductionData,
  setRevenueTableData,
  transformRevenueDataForTable,
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
import { calculateProfitAndLoss } from "../../../features/ProfitAndLossSlice";
import CustomChart from "./CustomChart";
import SelectField from "../../../components/SelectField";
import { setCutMonth } from "../../../features/DurationSlice";
import GroqJS from "./GroqJson";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Card as CardShadcn } from "../../../components/ui/card";

const ProfitAndLossSection = ({ numberOfMonths }) => {
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
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
      cashInflowByChannelAndProduct,
      receivablesByChannelAndProduct,
    } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        customerGrowthData,
        customerInputs,
        channelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      {
        revenueByChannelAndProduct,
        DeductionByChannelAndProduct,
        cogsByChannelAndProduct,
        netRevenueByChannelAndProduct,
        grossProfitByChannelAndProduct,
        cashInflowByChannelAndProduct,
        receivablesByChannelAndProduct,
      },
      channelInputs,
      "all"
    );
    dispatch(setRevenueTableData(calculateRevenueTableData));

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
    const costTableData = transformCostDataForTable(
      costInputs,
      numberOfMonths,
      revenueData
    );

    dispatch(setCostTableData(costTableData));
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
    totalRevenue,
    totalDeductions,
    netRevenue,
    totalCOGS,
    grossProfit,
    totalCosts,
    totalPersonnelCosts,
    detailedPersonnelCosts, // Added detailed personnel costs
    totalInvestmentDepreciation,
    totalInterestPayments,
    ebitda,
    earningsBeforeTax,
    incomeTax,
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

  const profitAndLossData = [
    { key: "Revenue" },
    { key: "Total Revenue", values: totalRevenue },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "Cost of Revenue" },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "Operating Expenses" },
    // { key: "Operating Costs", values: totalCosts },
    {
      key: "Operating Costs",
      values: totalCosts,
    },
    {
      key: "Personnel",
      values: totalPersonnelCosts,
      children: Object.keys(detailedPersonnelCosts).map((jobTitle) => ({
        key: jobTitle,
        values: detailedPersonnelCosts[jobTitle],
      })),
    },
    { key: "EBITDA", values: ebitda },
    { key: "Additional Expenses" },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
      }),
      {}
    ),
    children: item.children?.map((child) => ({
      metric: child.key,
      ...child.values.reduce(
        (acc, value, i) => ({
          ...acc,
          [realDate[i]]: formatNumber(value?.toFixed(2)),
        }),
        {}
      ),
    })),
  }));

  const { costTableData } = useSelector((state) => state.cost);
  const { revenueTableData } = useSelector((state) => state.sales);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const transposedData = [
    { key: "Revenue" },
    // { key: "Total Revenue", values: totalRevenue },
    {
      key: "Total Revenue",
      values: totalRevenue,
      children: revenueTableData
        .filter(
          (item) =>
            item.key.includes("Revenue - ") &&
            !item.key.includes("Net Revenue -")
        )
        .map((item) => ({
          key: item.key,
          metric: item.key,
          ...Object.keys(item).reduce((acc, key) => {
            if (key.startsWith("month")) {
              const monthIndex = key.replace("month", "").trim();
              acc[`Month ${monthIndex}`] = item[key];
            }
            return acc;
          }, {}),
        })),
    },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "" },
    { key: "Cost of Revenue" },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "" },
    { key: "Operating Expenses" },

    // { key: "Operating Costs", values: totalCosts },
    {
      key: "Operating Costs",
      values: totalCosts,
      children: costTableData.map((item) => ({
        key: item.key,
        metric: item.costName,
        ...Object.keys(item).reduce((acc, key) => {
          if (key.startsWith("month")) {
            const monthIndex = key.replace("month", "").trim();
            acc[`Month ${monthIndex}`] = item[key];
          }
          return acc;
        }, {}),
      })),
    },
    {
      key: "Personnel",
      values: totalPersonnelCosts,
      children: Object.keys(detailedPersonnelCosts).map((jobTitle) => ({
        key: jobTitle,
        values: detailedPersonnelCosts[jobTitle],
        metric: jobTitle,
        ...detailedPersonnelCosts[jobTitle].reduce(
          (acc, value, i) => ({
            ...acc,
            [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
          }),
          {}
        ),
      })),
    },
    { key: "EBITDA", values: ebitda },
    { key: "" },
    { key: "Additional Expenses" },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
    { key: "" },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({
        ...acc,
        [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
      }),
      {}
    ),
    children: item.children?.map((child) => ({
      metric: child.metric,
      ...child.values?.reduce(
        (acc, value, i) => ({
          ...acc,
          [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
        }),
        {}
      ),
      ...Object.keys(child).reduce((acc, key) => {
        if (key.startsWith("Month")) {
          acc[key] = child[key];
        }
        return acc;
      }, {}),
    })),
  }));

  ////////
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

  const columns = [
    {
      fixed: "left",
      title: <div>Metric</div>,
      dataIndex: "metric",
      key: "metric",
      render: (text, record) => {
        const isTotalRevenueChild = record.metric.startsWith("Revenue - ");
        const maxLength = isTotalRevenueChild ? 15 : 50; // Set the max length for truncation
        const displayText = truncateText(text, maxLength);

        return {
          children: (
            <div className={"md:whitespace-nowrap "}>
              <Tooltip title={text}>
                <div
                  style={{
                    fontWeight:
                      record.metric === "Total Revenue" ||
                      record.metric === "Total COGS" ||
                      record.metric === "Net Revenue" ||
                      record.metric === "Gross Profit" ||
                      record.metric === "EBITDA" ||
                      record.metric === "Operating Costs" ||
                      record.metric === "Net Income" ||
                      record.metric === "Revenue" ||
                      record.metric === "Cost of Revenue" ||
                      record.metric === "Operating Expenses" ||
                      record.metric === "Additional Expenses"
                        ? "bold"
                        : "normal",
                  }}
                >
                  {displayText}
                </div>
              </Tooltip>
            </div>
          ),
        };
      },
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
            record.metric === "Revenue" ||
            record.metric === "Cost of Revenue" ||
            record.metric === "Operating Expenses" ||
            record.metric === "Additional expenses"
          ) {
            return {
              style: {
                // borderRight: "1px solid #f0f0f0",
              },
            };
          } else if (
            // record.metric === "Total Revenue" ||
            // record.metric === "Total COGS" ||
            record.metric === "Net Revenue" ||
            record.metric === "Gross Profit" ||
            record.metric === "EBITDA" ||
            // record.metric === "Operating Costs" ||
            record.metric === "Net Income"
          ) {
            return {
              style: {
                borderTop: "2px solid #000000",

                fontWeight: "bold", // Add bold styling for Total Revenue
              },
            };
          } else if (
            record.metric === "Total Revenue" ||
            record.metric === "Total COGS" ||
            record.metric === "Net Revenue" ||
            record.metric === "Gross Profit" ||
            record.metric === "EBITDA" ||
            record.metric === "Operating Costs" ||
            record.metric === "Net Income"
          ) {
            return {
              style: {
                fontWeight: "bold", // Add bold styling for Total Revenue
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

  let totalAssetValue = [];

  // Kiểm tra nếu investmentData không có giá trị hoặc investmentData[0]?.assetValue không tồn tại
  if (!investmentData || !investmentData[0]?.assetValue) {
    // Tạo một mảng mới với các phần tử có giá trị là 0
    // Ví dụ: Tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      totalAssetValue.push(0);
    }
  } else {
    // Nếu investmentData có giá trị và investmentData[0]?.assetValue tồn tại
    // Thực hiện tính tổng của từng phần tử tại index trong mảng assetValue của mỗi phần tử trong investmentData
    totalAssetValue = investmentData[0]?.assetValue?.map((_, index) =>
      investmentData.reduce(
        (acc, data) => acc + (data?.assetValue ? data.assetValue[index] : 0),
        0
      )
    );
  }

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

  const bsTotalDepreciation = [];
  const bsTotalNetFixedAssets = [];

  if (investmentTableData.length === 0) {
    // Trường hợp không có dữ liệu trong investmentTableData, tạo mảng mới với các phần tử có giá trị là 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalDepreciation.push(0);
      bsTotalNetFixedAssets.push(0);
    }
  } else {
    // Nếu có dữ liệu trong investmentTableData, thực hiện vòng lặp để xử lý dữ liệu
    investmentTableData.forEach((data) => {
      if (data.key === "BS Total Accumulated Depreciation") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("month")) {
            bsTotalDepreciation.push(parseNumber(data[key]));
          }
        });
      } else if (data.key === "BS Total Net Fixed Assets") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("month")) {
            bsTotalNetFixedAssets.push(parseNumber(data[key]));
          }
        });
      }
    });
  }

  // calculate the total liabilities = remaining balance + account payable

  //calculate the total shareholders equity = paid in capital + common stock + preferred stock + retain earnings

  const bsTotalRemainingBalance = [];

  if (loanTableData.length === 0) {
    // Trường hợp không có dữ liệu trong loanTableData, tạo mảng mới với các phần tử có giá trị là 0
    // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
    for (let i = 0; i < numberOfMonths; i++) {
      bsTotalRemainingBalance.push(0);
    }
  } else {
    // Nếu có dữ liệu trong loanTableData, thực hiện vòng lặp để xử lý dữ liệu
    loanTableData.forEach((data) => {
      if (data.key === "Total Remaining Balance") {
        Object.keys(data).forEach((key) => {
          if (key.startsWith("Month ")) {
            bsTotalRemainingBalance.push(parseNumber(data[key]));
          }
        });
      }
    });
  }

  const [selectedChart, setSelectedChart] = useState("total-revenue-chart"); // State để lưu trữ biểu đồ được chọn

  // Các useEffect và mã khác ở đây không thay đổi

  // Hàm xử lý sự kiện khi giá trị của dropdown thay đổi
  const handleChartSelect = (value) => {
    setSelectedChart(value);
  };

  const handleCutMonthChange = (e) => {
    dispatch(setCutMonth(Number(e.target.value)));
  };

  const divideMonthsIntoYears = () => {
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

  const years = divideMonthsIntoYears();

  // Function to generate table columns dynamically based on months in a year

  const generateTableColumns = (year) => {
    const columns = [
      {
        title: "Metric",
        dataIndex: "metric",
        key: "metric",
        fixed: "left",
      },
      ...year.textMonth.map((textMonth, index) => ({
        title: textMonth,
        dataIndex: `Month ${year.months[index]}`,
        key: `Month ${year.months[index]}`,
      })),
      {
        title: "Year Total",
        dataIndex: "yearTotal",
        key: "yearTotal",
        render: (text) => formatNumber(text?.toFixed(2)), // Optional: formatting the number if needed
      },
    ];

    return columns;
  };

  function parseNumberInternal(value) {
    if (value === undefined || value === null) return 0;
    return Number(value.toString().replace(/,/g, ""));
  }

  const getDataSourceForYear = (months) => {
    const monthKeys = months.map((month) => `Month ${month}`);

    return transposedData.map((data) => {
      const filteredData = monthKeys.reduce((acc, monthKey) => {
        acc[monthKey] = data[monthKey]; // keep original formatted value
        return acc;
      }, {});

      // Calculate Year Total for each row, ensuring values are defined before parsing with the parseNumberInternal function
      const yearTotal = monthKeys.reduce((sum, key) => {
        const value = data[key];
        return sum + (value ? parseNumberInternal(value) : 0);
      }, 0);

      return {
        metric: data.metric,
        ...filteredData,
        yearTotal, // Adding Year Total to each row
      };
    });
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
    transposedData.forEach((record) => {
      const row = [record.metric];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`Month ${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Profit And Loss Data");

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
      "profitAndLoss_data.xlsx"
    );
  };

  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  return (
    <CardShadcn className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:p-4 p-0 ">
        <div>
          <h3 className="text-lg font-semibold mb-4">I. Relevant Chart</h3>

          <div className=" gap-4 mb-3">
            <Select
              onValueChange={(value) => handleChartSelect(value)}
              value={selectedChart}
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectTrigger className="bg-white border-solid border-[1px] border-gray-300 w-full lg:w-[20%]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-revenue-chart"
                >
                  Total Revenue
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-costs-chart"
                >
                  Total Costs
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="net-income-chart"
                >
                  Net Income
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="gross-profit-chart"
                >
                  Gross Profit
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="ebitda-chart"
                >
                  EBITDA
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="earnings-before-tax-chart"
                >
                  Earnings Before Tax
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="income-tax-chart"
                >
                  Income Tax
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-investment-depreciation-chart"
                >
                  Total Investment Depreciation
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-interest-payments-chart"
                >
                  Total Interest Payments
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Các biểu đồ */}

          {/* Sử dụng selectedChart để render biểu đồ tương ứng */}
          {selectedChart === "total-revenue-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="total-revenue-chart"
              yaxisTitle="Total Revenue ($)"
              seriesTitle="Total Revenue"
              RenderData={totalRevenue}
              title="Total Revenue Over Time"
            />
          )}
          {selectedChart === "total-costs-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="total-costs-chart"
              yaxisTitle="Total Costs ($)"
              seriesTitle="Total Costs"
              RenderData={totalCosts}
              title="Total Costs Over Time"
            />
          )}
          {selectedChart === "net-income-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="net-income-chart"
              yaxisTitle="Net Income ($)"
              seriesTitle="Net Income"
              RenderData={netIncome}
              title="Net Income Over Time"
            />
          )}
          {selectedChart === "gross-profit-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="gross-profit-chart"
              yaxisTitle="Gross Profit ($)"
              seriesTitle="Gross Profit"
              RenderData={grossProfit}
              title="Gross Profit Over Time"
            />
          )}
          {selectedChart === "ebitda-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="ebitda-chart"
              yaxisTitle="EBITDA ($)"
              seriesTitle="EBITDA"
              RenderData={ebitda}
              title="EBITDA Over Time"
            />
          )}
          {selectedChart === "earnings-before-tax-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="earnings-before-tax-chart"
              yaxisTitle="Earnings Before Tax ($)"
              seriesTitle="Earnings Before Tax"
              RenderData={earningsBeforeTax}
              title="Earnings Before Tax Over Time"
            />
          )}
          {selectedChart === "income-tax-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="income-tax-chart"
              yaxisTitle="Income Tax ($)"
              seriesTitle="Income Tax"
              RenderData={incomeTax}
              title="Income Tax Over Time"
            />
          )}
          {selectedChart === "total-investment-depreciation-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="total-investment-depreciation-chart"
              yaxisTitle="Total Investment Depreciation ($)"
              seriesTitle="Total Investment Depreciation"
              RenderData={totalInvestmentDepreciation}
              title="Total Investment Depreciation Over Time"
            />
          )}
          {selectedChart === "total-interest-payments-chart" && (
            <CustomChart
              numberOfMonths={numberOfMonths}
              id="total-interest-payments-chart"
              yaxisTitle="TotalInterest Payments ($)"
              seriesTitle="Total Interest Payments"
              RenderData={totalInterestPayments}
              title="Total Interest Payments Over Time"
            />
          )}

          <div className="flex justify-between items-center my-4 mt-20">
            <h3 className="text-lg font-semibold">
              II. Profit and Loss Statement
            </h3>
            <button
              onClick={downloadExcel}
              className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl min-w-[6vw] "
            >
              <DownloadOutlined className="mr-1" />
              Download Excel
            </button>
          </div>

          <Table
            className="overflow-auto my-8 rounded-md bg-white"
            size="small"
            dataSource={transposedData}
            columns={columns}
            pagination={false}
          />

          <div className="grid grid-cols-2 gap-4 mb-3">
            <Checkbox
              className="col-span-2"
              checked={showAdvancedInputs}
              onChange={(e) => setShowAdvancedInputs(e.target.checked)}
            >
              Show More Detail Result
            </Checkbox>
          </div>
          {showAdvancedInputs && (
            <>
              <h3 className="text-lg font-semibold my-5 mt-20">
                III. Profit and Loss By Years
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
                {/* Mapping over years to create TabPanes */}
                {years.map((year, index) => (
                  <TabPane tab={year.year} key={index.toString()}>
                    {/* Display table for the selected year */}
                    <Table
                      className="bg-white overflow-auto my-8 rounded-md shadow-xl"
                      size="small"
                      dataSource={getDataSourceForYear(year.months)}
                      columns={generateTableColumns(year)}
                      pagination={false}
                    />
                  </TabPane>
                ))}
              </Tabs>
            </>
          )}
        </div>
      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <section className="mb-8 NOsticky NOtop-8">
          <GroqJS
            datasrc={profitAndLossData}
            inputUrl="urlPNL"
            numberOfMonths={numberOfMonths}
          />
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
          zIndex={50}
        >
          <GroqJS datasrc={profitAndLossData} inputUrl="urlPNL" />
        </Modal>
      )}
    </CardShadcn>
  );
};

export default ProfitAndLossSection;
