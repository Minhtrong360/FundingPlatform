import React, { useEffect, useState } from "react";
import { Table } from "antd";

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

const ProfitAndLossSection = ({ numberOfMonths }) => {
  const dispatch = useDispatch();
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

  const columns = [
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
        props: {
          colSpan:
            record.metric === "Revenue" ||
            record.metric === "Cost of Revenue" ||
            record.metric === "Operating Expenses" ||
            record.metric === "Additional Expenses"
              ? numberOfMonths
              : 1,
          style:
            record.metric === "Revenue" ||
            record.metric === "Cost of Revenue" ||
            record.metric === "Operating Expenses" ||
            record.metric === "Additional Expenses"
              ? {}
              : { borderRight: "1px solid #f0f0f0" },
        },
      }),
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
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
            colSpan: 0,
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
    })),
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

  
  const [cutMonth, setCutMonth] = useState(4);
  const handleCutMonthChange = (value) => {
    setCutMonth(Number(value));
  };

  const divideMonthsIntoYears = () => {
    const years = [];
    if (cutMonth - 1 > 0) {
      years.push({
        year: "First Year",
        months: Array.from({ length: cutMonth - 1 }, (_, i) => i + 1),
      });
    }

    const remainingMonthsAfterFirstYear = numberOfMonths - (cutMonth - 1);
    const fullYearsCount = Math.floor(remainingMonthsAfterFirstYear / 12);
    const remainingMonthsInLastYear = remainingMonthsAfterFirstYear % 12;

    for (let i = 0; i < fullYearsCount; i++) {
      years.push({
        year: `Year ${i + 2}`,
        months: Array.from({ length: 12 }, (_, idx) => idx + 1 + (cutMonth - 1) + i * 12),
      });
    }

    if (remainingMonthsInLastYear > 0) {
      years.push({
        year: `Last Year`,
        months: Array.from({ length: remainingMonthsInLastYear }, (_, idx) => idx + 1 + (cutMonth - 1) + fullYearsCount * 12),
      });
    }

    return years;
  };



  const years = divideMonthsIntoYears();

  // Function to generate table columns dynamically based on months in a year
  const generateTableColumns = (months) => [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
    },
    ...months.map((month) => ({
      title: `Month ${month}`,
      dataIndex: `Month ${month}`,
      key: `Month ${month}`,
    })),
    {
      title: "Year Total",
      dataIndex: "yearTotal",
      key: "yearTotal",
      render: (text) => formatNumber(text?.toFixed(2)), // Optional: formatting the number if needed
    },
  ];
  
  function parseNumberInternal(value) {
    if (value === undefined || value === null) return 0;
    return Number(value.toString().replace(/,/g, ''));
  }
  
  const getDataSourceForYear = (months) => {
    const monthKeys = months.map(month => `Month ${month}`);
    
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
      const item = dataSource.find(data => data.metric === key);
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
    const grossProfitMargin = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0;
    const netProfitMargin = totalRevenue ? (netIncome / totalRevenue) * 100 : 0;
    const operatingMargin = totalRevenue ? (ebitda / totalRevenue) * 100 : 0;
    const interestCoverageRatio = ebitda ? ebitda / interestExpense : 0;
    const operatingExpenseRatio = totalRevenue ? (operatingCosts / totalRevenue) * 100 : 0;
    const cogsToRevenue = totalRevenue ? (totalCOGS / totalRevenue) * 100 : 0;
    const deductionToRevenue = totalRevenue ? (totalDeductions / totalRevenue) * 100 : 0;
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
    <div className="border-t-2">
      <h2 className="text-2xl font-semibold my-4">Profit and Loss Statement</h2>

      <Table
        className="overflow-auto my-8"
        size="small"
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
        <span className="flex items-center text-sm my-4">Select Chart :</span>
        <Select
          onValueChange={(value) => handleChartSelect(value)}
          value={selectedChart}
          className="border-solid border-[1px] border-gray-200"
        >
          <SelectTrigger className="border-solid border-[1px] border-gray-200 w-[20%]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem
              value="total-revenue-chart"
              className="hover:cursor-pointer"
            >
              Total Revenue
            </SelectItem>
            <SelectItem
              value="total-costs-chart"
              className="hover:cursor-pointer"
            >
              Total Costs
            </SelectItem>
            <SelectItem
              value="net-income-chart"
              className="hover:cursor-pointer"
            >
              Net Income
            </SelectItem>
            <SelectItem
              value="gross-profit-chart"
              className="hover:cursor-pointer"
            >
              Gross Profit
            </SelectItem>
            <SelectItem value="ebitda-chart" className="hover:cursor-pointer">
              EBITDA
            </SelectItem>
            <SelectItem
              value="earnings-before-tax-chart"
              className="hover:cursor-pointer"
            >
              Earnings Before Tax
            </SelectItem>
            <SelectItem
              value="income-tax-chart"
              className="hover:cursor-pointer"
            >
              Income Tax
            </SelectItem>
            <SelectItem
              value="total-investment-depreciation-chart"
              className="hover:cursor-pointer"
            >
              Total Investment Depreciation
            </SelectItem>
            <SelectItem
              value="total-interest-payments-chart"
              className="hover:cursor-pointer"
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

<div className="flex gap-4 mb-3">
        <span>Select Cut Month: </span>
        <select value={cutMonth} onChange={(e) => handleCutMonthChange(e.target.value)} className="border-solid border-[1px] border-gray-200">
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {years.map((year, index) => (
  <div key={index}>
    <h3>{year.year}</h3>
    <Table
      className="overflow-auto my-8"
      size="small"
      dataSource={getDataSourceForYear(year.months)}
      columns={generateTableColumns(year.months)}
      pagination={false}
    />
    {/* Expanded section to calculate and display financial ratios */}
    <div>
      <h4>Financial Ratios for {year.year}</h4>
      {(() => {
        const dataSourceForYear = getDataSourceForYear(year.months);
        const ratios = calculateFinancialRatios(dataSourceForYear);
        return (
          <ul>
            <li>Gross Profit Margin: {ratios.grossProfitMargin.toFixed(2)}%</li>
            <li>Net Profit Margin: {ratios.netProfitMargin.toFixed(2)}%</li>
            <li>Operating Margin: {ratios.operatingMargin.toFixed(2)}%</li>
            <li>Interest Coverage Ratio: {ratios.interestCoverageRatio.toFixed(2)}</li>
            <li>Operating Expense Ratio: {ratios.operatingExpenseRatio.toFixed(2)}%</li>
            <li>COGS to Revenue: {ratios.cogsToRevenue.toFixed(2)}%</li>
            <li>Deduction to Revenue: {ratios.deductionToRevenue.toFixed(2)}%</li>
            {/* Add more ratios as needed */}
          </ul>
        );
      })()}
    </div>
  </div>
))}


    </div>

    
  );
};

export default ProfitAndLossSection;
