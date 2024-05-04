import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Tooltip } from "antd";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";

import { useDispatch, useSelector } from "react-redux";

import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
} from "../../../features/CostSlice";
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
import { calculateProfitAndLoss } from "../../../features/ProfitAndLossSlice";
import CustomChart from "./CustomerChart";
import SelectField from "../../../components/SelectField";
import { setCutMonth } from "../../../features/DurationSlice";
import GroqJS from "./GroqJson";

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
    const calculatedData = calculateCostData(costInputs, numberOfMonths);
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
    const calculatedData = calculateLoanData(loanInputs);
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

  const transposedData = [
    { key: "Revenue" },
    { key: "Total Revenue", values: totalRevenue },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "Cost of Revenue" },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "Operating Expenses" },
    { key: "Operating Costs", values: totalCosts },
    { key: "Personnel", values: totalPersonnelCosts },
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
  }));

  console.log("transposedData", transposedData);

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

  const columns = [
    {
      fixed: "left",
      title: <div>Metric</div>,
      dataIndex: "metric",
      key: "metric",

      render: (text, record) => ({
        children: (
          <div className={"md:whitespace-nowrap"}>
            <a
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
              {text}
            </a>
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
            record.metric === "Revenue" ||
            record.metric === "Cost of Revenue" ||
            record.metric === "Operating Expenses" ||
            record.metric === "Additional expenses"
          ) {
            return {
              style: {
                borderRight: "1px solid #f0f0f0",
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
                borderRight: "1px solid #f0f0f0",
                fontWeight: "bold", // Add bold styling for Total Revenue
              },
            };
          } else {
            return {
              style: {
                borderRight: "1px solid #f0f0f0",
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

    if (cutMonth - 1 > 0) {
      const firstYearMonths = Array.from(
        { length: cutMonth - 1 },
        (_, i) => i + 1
      );
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

    const remainingMonthsAfterFirstYear = numberOfMonths - (cutMonth - 1);
    const fullYearsCount = Math.floor(remainingMonthsAfterFirstYear / 12);
    const remainingMonthsInLastYear = remainingMonthsAfterFirstYear % 12;

    for (let i = 0; i < fullYearsCount; i++) {
      const yearMonths = Array.from(
        { length: 12 },
        (_, idx) => idx + 1 + (cutMonth - 1) + i * 12
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
        (_, idx) => idx + 1 + (cutMonth - 1) + fullYearsCount * 12
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

  const calculateFinancialRatios = (dataSource) => {
    const findValueByKey = (key) => {
      const item = dataSource.find((data) => data.metric === key);
      return item ? parseNumberInternal(item.yearTotal) : 0;
    };

    const totalRevenue = findValueByKey("Total Revenue");
    const netIncome = findValueByKey("Net Income");
    const grossProfit = findValueByKey("Gross Profit");
    const operatingCosts = findValueByKey("Operating Costs");
    const ebitda = findValueByKey("EBITDA");
    const interestExpense = findValueByKey("Interest");
    const totalCOGS = findValueByKey("Total COGS");
    const totalDeductions = findValueByKey("Deductions");

    // Calculate ratios
    const grossProfitMargin = totalRevenue
      ? (grossProfit / totalRevenue) * 100
      : 0;
    const netProfitMargin = totalRevenue ? (netIncome / totalRevenue) * 100 : 0;
    const operatingMargin = totalRevenue ? (ebitda / totalRevenue) * 100 : 0;
    const interestCoverageRatio = ebitda ? ebitda / interestExpense : 0;
    const operatingExpenseRatio = totalRevenue
      ? (operatingCosts / totalRevenue) * 100
      : 0;
    const cogsToRevenue = totalRevenue ? (totalCOGS / totalRevenue) * 100 : 0;
    const deductionToRevenue = totalRevenue
      ? (totalDeductions / totalRevenue) * 100
      : 0;
    // Add any other ratios here, making sure you're not dividing by zero

    return {
      grossProfitMargin,
      netProfitMargin,
      operatingMargin,
      interestCoverageRatio,
      operatingExpenseRatio,
      cogsToRevenue,
      deductionToRevenue,
      // List other calculated ratios here
    };
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
      <GroqJS datasrc={transposedData} />
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0 ">
        <div className="">
          <h2 className="text-lg font-semibold my-4">
            Profit and Loss Statement
          </h2>
          {/* <pre>{JSON.stringify(tableData, null, 2)}</pre> */}
          <Table
            className="overflow-auto my-8 rounded-md shadow-xl"
            size="small"
            bordered
            dataSource={transposedData}
            columns={columns}
            pagination={false}
          />

          
          {/* <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      /> */}

          <div className=" gap-4 mb-3">
            <Select
              onValueChange={(value) => handleChartSelect(value)}
              value={selectedChart}
              className="border-solid border-[1px] border-gray-300"
            >
              <SelectTrigger className="border-solid border-[1px] border-gray-300 w-full lg:w-[20%]">
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
          

          <div className="w-full md:w-[20%] my-5">
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
          

          {years.map((year, index) => (
            <div key={index}>
              <h3>{year.year}</h3>
              <Table
                className="overflow-auto my-8 rounded-md shadow-xl"
                size="small"
                dataSource={getDataSourceForYear(year.months)}
                columns={generateTableColumns(year)}
                pagination={false}
              />
              {/* Expanded section to calculate and display financial ratios */}
              {/* <div>
            <h4>Financial Ratios for {year.year}</h4>
            {(() => {
              const dataSourceForYear = getDataSourceForYear(year.months);
              const ratios = calculateFinancialRatios(dataSourceForYear);
              return (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Object.keys(ratios).map((key) => (
                    <div
                      className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      key={key}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex items-center gap-x-2">
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {key.toUpperCase().replace(/_/g, " ")}
                          </p>
                          <Tooltip
                            title={`${key.replace(/_/g, " ")}.`}
                          >
                            <InfoCircleOutlined />
                          </Tooltip>
                        </div>

                        <div className="mt-1">
                          <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                              {ratios[key].toFixed(2)}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-4">
                            {(() => {
                              switch (key) {
                                case "grossProfitMargin":
                                  return "Gross Profit Margin = (Gross Profit / Total Revenue) * 100. It measures the percentage of revenue that exceeds the cost of goods sold.";
                                case "netProfitMargin":
                                  return "Net Profit Margin = (Net Income / Total Revenue) * 100. It indicates how much profit a company makes for every dollar of its revenue.";
                                case "operatingMargin":
                                  return "Operating Margin = (EBITDA / Total Revenue) * 100. This ratio shows the percentage of revenue left after paying variable production costs.";
                                case "interestCoverageRatio":
                                  return "Interest Coverage Ratio = EBITDA / Interest Expenses. It measures how easily a company can pay interest expenses on outstanding debt.";
                                case "operatingExpenseRatio":
                                  return "Operating Expense Ratio = (Operating Costs / Total Revenue) * 100. It assesses what percentage of revenue is consumed by operating expenses.";
                                case "cogsToRevenue":
                                  return "COGS to Revenue = (Total COGS / Total Revenue) * 100. This ratio shows the cost of goods sold as a percentage of revenue.";
                                case "deductionToRevenue":
                                  return "Deduction to Revenue = (Total Deductions / Total Revenue) * 100. It measures the deductions as a percentage of total revenue.";
                                default:
                                  return "";
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div> */}
            </div>
          ))}
          
        </div>
        
      </div>
    </div>
  );
};

export default ProfitAndLossSection;
