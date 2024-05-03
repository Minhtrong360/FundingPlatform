import { Row, Table, Tooltip, message } from "antd";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
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
import CustomChart from "./CustomerChart";
import SelectField from "../../../components/SelectField";
import { setCutMonth } from "../../../features/DurationSlice";
import { InfoCircleOutlined } from "@ant-design/icons";

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

  const positionDataWithNetIncome = [
    { key: " Operating Activities " },
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
    { key: " Investing Activities " },
    {
      key: "CF Investments",
      values: cfInvestmentsArray,
    },
    { key: " Financing Activities " },
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
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const positionColumns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
      render: (text, record) => ({
        children: (
          <div className={" md:whitespace-nowrap "}>
            <a
              style={{
                fontWeight:
                  record.metric === "CF Operations" ||
                  record.metric === "CF Investments" ||
                  record.metric === "CF Investments" ||
                  record.metric === "CF Financing" ||
                  record.metric === "Net +/- in Cash" ||
                  record.metric === "Cash Begin" ||
                  record.metric === "Cash End" ||
                  record.metric === " Operating Activities " ||
                  record.metric === " Investing Activities " ||
                  record.metric === " Financing Activities "
                    ? "bold"
                    : "normal",
              }}
            >
              {text}
            </a>
          </div>
        ),
      }),

      // onCell: (_, index)  => ({
      //   style: {
      //     // borderRight: "1px solid #f0f0f0",
      //     props: {
      //       colSpan: (index === 0 || index === 7 || index === 9) ? 36 : 1,
      //     },
      //   },
      // }),
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
            record.metric === " Operating Activities " ||
            record.metric === " Investing Activities " ||
            record.metric === " Financing Activities "
          ) {
            return {
              style: {
                borderRight: "1px solid #f0f0f0",
              },
            };
          } else if (
            record.metric === "CF Operations" ||
            record.metric === " Operating Activities " ||
            record.metric === "CF Investments" ||
            record.metric === "CF Financing" ||
            record.metric === "Net +/- in Cash" ||
            record.metric === "Cash Begin" ||
            record.metric === "Cash End"
          ) {
            return {
              style: {
                borderRight: "1px solid #f0f0f0",
                fontWeight: "bold",
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
        render: (text) => <strong>{formatNumber(text)}</strong>, // Assuming formatNumber is a utility function to format numbers
      },
    ];
    return columns;
  };

  const calculateCashFlowRatios = (dataSource) => {
    const findYearTotalByKey = (key) => {
      const item = dataSource.find((data) => data.metric === key);
      return item ? item.yearTotal : 0;
    };

    // Assuming Operating Cash Flow (OCF), Capital Expenditure (CAPEX), and Net Income are available from the data source
    const operatingCashFlow = findYearTotalByKey("CF Operations");
    const capitalExpenditure = Math.abs(findYearTotalByKey("CF Investments")); // CAPEX is expected to be a negative number, so we take its absolute
    const netIncome = findYearTotalByKey("Net Income");

    // Operating Cash Flow Ratio = OCF / Current Liabilities
    // Note: Current Liabilities value would need to be available; placeholder value used here
    const currentLiabilities = findYearTotalByKey("Decrease (Increase) in AP"); // Assuming this as a proxy for current liabilities

    const operatingCashFlowRatio = currentLiabilities
      ? operatingCashFlow / currentLiabilities
      : 0;

    // Free Cash Flow (FCF) = Operating Cash Flow - Capital Expenditures
    const freeCashFlow = operatingCashFlow - capitalExpenditure;

    // Cash Conversion Cycle (CCC) is a more complex calculation involving Receivables Turnover, Payables Turnover, and Inventory Turnover
    // Placeholder values for demonstration; actual calculation would require detailed data
    const cashConversionCycle = 0; // Placeholder for Cash Conversion Cycle calculation

    // Cash Flow to Debt Ratio = Operating Cash Flow / Total Debt
    // Note: Total Debt value would need to be available; placeholder value used here
    const totalDebt = findYearTotalByKey("Total Principal"); // Assuming this as a proxy for total debt

    const cashFlowToDebtRatio = totalDebt ? operatingCashFlow / totalDebt : 0;

    // Cash Flow Margin = Free Cash Flow / Net Sales
    // Note: Net Sales value would need to be available; placeholder value used here
    const netSales = findYearTotalByKey("Net +/- in Cash"); // Assuming this as a proxy for net sales
    const cashFlowMargin = netSales ? freeCashFlow / netSales : 0;

    return {
      operatingCashFlowRatio: formatNumber(operatingCashFlowRatio.toFixed(2)),
      freeCashFlow: formatNumber(freeCashFlow.toFixed(2)),
      cashConversionCycle: formatNumber(cashConversionCycle.toFixed(2)), // This is a placeholder; actual calculation would differ
      cashFlowToDebtRatio: formatNumber(cashFlowToDebtRatio.toFixed(2)),
      cashFlowMargin: formatNumber(cashFlowMargin.toFixed(2)),
    };
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
        <h2 className="text-lg font-semibold my-4">Analysis</h2>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0 ">
        <div className="">
          <h2 className="text-lg font-semibold my-4">Cash Flow</h2>

          <Table
            className="overflow-x-auto my-8 rounded-md shadow-xl"
            size="small"
            dataSource={positionDataWithNetIncome}
            columns={positionColumns}
            pagination={false}
            bordered
          />

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
              numberOfMonths={numberOfMonths}
              id="cash-end-balances-chart"
              yaxisTitle="Cash End Balances ($)"
              seriesTitle="Cash End"
              RenderData={cashEndBalances}
              title="Cash End Balances Over Time"
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

          {divideMonthsIntoYearsForCashFlow().map((year, index) => (
            <div key={index}>
              <h3>{year.year}</h3>
              <Table
                className="overflow-auto my-8 rounded-md shadow-xl"
                size="small"
                dataSource={getDataSourceForYearCashFlow(year.months)}
                columns={generateCashFlowTableColumns(year)}
                pagination={false}
                bordered
              />
              <div>
                <h4>Financial Ratios for {year.year}</h4>
                <ul>
                  {/* Assuming calculateCashFlowRatios returns ratios for the specific year */}
                  {(() => {
                    const dataSourceForYear = getDataSourceForYearCashFlow(
                      year.months
                    );
                    const ratios = calculateCashFlowRatios(dataSourceForYear);
                    return (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Operating Cash Flow Ratio:
                              </p>
                              <Tooltip
                                title={`This is the Operating Cash Flow Ratio.`}
                              >
                                <InfoCircleOutlined />
                              </Tooltip>
                            </div>

                            <div className="mt-1">
                              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                                  {ratios.operatingCashFlowRatio}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Free Cash Flow:
                              </p>
                              <Tooltip title={`This is the Free Cash Flow.`}>
                                <InfoCircleOutlined />
                              </Tooltip>
                            </div>

                            <div className="mt-1">
                              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                                  {ratios.freeCashFlow}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Cash Conversion Cycle:
                              </p>
                              <Tooltip
                                title={`This is the Cash Conversion Cycle.`}
                              >
                                <InfoCircleOutlined />
                              </Tooltip>
                            </div>

                            <div className="mt-1">
                              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                                  {ratios.cashConversionCycle}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Cash Flow to Debt Ratio:
                              </p>
                              <Tooltip
                                title={`This is the Cash Flow to Debt Ratio.`}
                              >
                                <InfoCircleOutlined />
                              </Tooltip>
                            </div>

                            <div className="mt-1">
                              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                                  {ratios.cashFlowToDebtRatio}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                          <div className="p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                              <p className="text-xs uppercase tracking-wide text-gray-500">
                                Cash Flow Margin:
                              </p>
                              <Tooltip title={`This is the Cash Flow Margin.`}>
                                <InfoCircleOutlined />
                              </Tooltip>
                            </div>

                            <div className="mt-1">
                              <div className="flex flex-col xl:flex-row xl:items-center items-start gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 my-2">
                                  {ratios.cashFlowMargin}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CashFlowSection;
