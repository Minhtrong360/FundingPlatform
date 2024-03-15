import React from "react";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const ProfitAndLossSection = ({
  costData,
  personnelCostData,
  investmentData,
  loanData,
  numberOfMonths,

  investmentTableData,
  loanTableData,
}) => {
  const { revenueData, revenueDeductionData, cogsData } = useSelector(
    (state) => state.sales
  );
  const { incomeTax: incomeTaxRate, startingCashBalance } = useSelector(
    (state) => state.durationSelect
  );

  const calculateProfitAndLoss = () => {
    let totalRevenue = new Array(numberOfMonths).fill(0);
    let totalDeductions = new Array(numberOfMonths).fill(0);
    let totalCOGS = new Array(numberOfMonths).fill(0);
    let totalCosts = new Array(numberOfMonths).fill(0);
    let totalPersonnelCosts = new Array(numberOfMonths).fill(0);
    let totalInvestmentDepreciation = new Array(numberOfMonths).fill(0);
    let totalLoanPayments = new Array(numberOfMonths).fill(0);

    Object.entries(revenueData).forEach(([channelProductName, monthlyData]) => {
      monthlyData.forEach((deduction, index) => {
        totalRevenue[index] += parseFloat(deduction);
      });
    });

    Object.entries(revenueDeductionData).forEach(
      ([channelProductName, monthlyData]) => {
        monthlyData.forEach((deduction, index) => {
          totalDeductions[index] += parseFloat(deduction);
        });
      }
    );
    Object.entries(cogsData).forEach(([channelProductName, monthlyData]) => {
      monthlyData.forEach((deduction, index) => {
        totalCOGS[index] += parseFloat(deduction);
      });
    });

    costData.forEach((cost) => {
      cost.monthlyCosts.forEach((monthData) => {
        totalCosts[monthData.month - 1] += monthData.cost;
      });
    });

    personnelCostData.forEach((personnel) => {
      personnel.monthlyCosts.forEach((monthData) => {
        totalPersonnelCosts[monthData.month - 1] += monthData.cost;
      });
    });

    investmentData.forEach((investment) => {
      investment.depreciationArray.forEach((value, index) => {
        totalInvestmentDepreciation[index] += value;
      });
    });

    loanData.forEach((loan) => {
      loan.loanDataPerMonth.forEach((monthData) => {
        totalLoanPayments[monthData.month - 1] += monthData.payment;
      });
    });

    let netRevenue = totalRevenue.map(
      (revenue, index) => revenue - totalDeductions[index]
    );

    let grossProfit = netRevenue.map(
      (revenue, index) => revenue - totalCOGS[index]
    );

    let ebitda = grossProfit.map(
      (profit, index) =>
        profit - (totalCosts[index] + totalPersonnelCosts[index])
    );

    let totalInterestPayments = new Array(numberOfMonths).fill(0);
    loanData.forEach((loan) => {
      loan.loanDataPerMonth.forEach((monthData) => {
        totalInterestPayments[monthData.month - 1] += monthData.interest;
      });
    });

    let earningsBeforeTax = ebitda.map(
      (profit, index) =>
        profit -
        (totalInvestmentDepreciation[index] + totalInterestPayments[index])
    );

    let incomeTax = earningsBeforeTax.map((earnings) =>
      earnings > 0 ? earnings * (incomeTaxRate / 100) : 0
    );

    let netIncome = earningsBeforeTax.map(
      (earnings, index) => earnings - incomeTax[index]
    );

    const totalPrincipal = new Array(numberOfMonths).fill(0);
    loanData.forEach((loan) => {
      loan.loanDataPerMonth.forEach((monthData) => {
        totalPrincipal[monthData.month - 1] += monthData.principal;
      });
    });

    const totalRemainingBalance = new Array(numberOfMonths).fill(0);
    loanData.forEach((loan) => {
      loan.loanDataPerMonth.forEach((monthData) => {
        totalRemainingBalance[monthData.month - 1] +=
          monthData.remainingBalance;
      });
    });

    return {
      totalRevenue,
      totalDeductions,
      netRevenue,
      totalCOGS,
      grossProfit,
      totalCosts,
      totalPersonnelCosts,
      totalInvestmentDepreciation,
      totalInterestPayments,
      totalPrincipal,
      ebitda,
      earningsBeforeTax,
      incomeTax,
      netIncome,
      startingCashBalance,
      totalRemainingBalance,
    };
  };

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
    totalPrincipal,
    ebitda,
    earningsBeforeTax,
    incomeTax,
    netIncome,
    remainingBalance,
  } = calculateProfitAndLoss();

  const transposedData = [
    { key: "Total Revenue", values: totalRevenue },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "Costs", values: totalCosts },
    { key: "Personnel", values: totalPersonnelCosts },
    { key: "EBITDA", values: ebitda },
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values.reduce(
      (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
      {}
    ),
  }));

  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
      onCell: () => ({
        style: {
          borderRight: "1px solid #f0f0f0",
        },
      }),
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
      onCell: () => ({
        style: {
          borderRight: "1px solid #f0f0f0",
        },
      }),
      render: (text, record) => {
        if (
          record.metric === "Total Revenue" ||
          record.metric === "Gross Profit"
        ) {
          return (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>{text}</span>
          );
        } else if (record.metric === "EBITDA") {
          return parseFloat(text) > 0 ? (
            <span
              style={{ color: "green", fontWeight: "bold", fontSize: "16px" }}
            >
              {text}
            </span>
          ) : (
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              {text}
            </span>
          );
        } else if (record.metric === "Net Income") {
          return parseFloat(text) > 0 ? (
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: "green" }}
            >
              {text}
            </span>
          ) : (
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: "red" }}
            >
              {text}
            </span>
          );
        }
        return text;
      },
    })),
  ];

  const totalAssetValue = investmentData[0]?.assetValue?.map((_, index) =>
    investmentData.reduce((acc, data) => acc + data?.assetValue[index], 0)
  );

  const cfInvestmentsSum = investmentTableData.map(
    (investment) =>
      investment?.monthlyInvestments?.reduce((acc, curr) => acc + curr, 0) || 0
  );

  const totalLoanAmount = loanData[0]?.loanDataPerMonth?.map((_, index) =>
    loanData.reduce(
      (acc, loan) => acc + (loan.loanDataPerMonth[index]?.loanAmount || 0),
      0
    )
  );

  const maxLength = Math.max(
    totalLoanAmount?.length || 0,
    totalPrincipal?.length || 0,
    numberOfMonths
  );

  const fillWithZero = (arr) =>
    Array.from({ length: maxLength }, (_, i) => arr[i] || 0);

  const filledTotalLoanAmount = fillWithZero(totalLoanAmount);
  const filledTotalPrincipal = fillWithZero(totalPrincipal);

  const cfInvestments = investmentTableData.find(
    (item) => item.key === "CF Investments"
  );
  const cfInvestmentsArray = [];

  Object.keys(cfInvestments).forEach((key) => {
    if (key.startsWith("month")) {
      cfInvestmentsArray.push(parseFloat(cfInvestments[key]));
    }
  });

  const cfLoans = loanTableData.find((item) => item.key === "CF Loans");
  const cfLoanArray = [];

  Object.keys(cfLoans).forEach((key) => {
    if (key.startsWith("Month ")) {
      cfLoanArray.push(parseFloat(cfLoans[key]));
    }
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

  const netCashChanges = netIncome.map((_, index) => {
    const cfOperations =
      netIncome[index] + totalInvestmentDepreciation[index] + 0 - 0 - 0; // Placeholder values
    const increaseCommonStock = 0; // Placeholder value
    const increasePreferredStock = 0; // Placeholder value
    const increasePaidInCapital = 0; // Placeholder value
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

  const cashBeginBalances = [
    parseFloat(startingCashBalance),
    ...calculateCashBalances(startingCashBalance, netCashChanges)?.slice(0, -1),
  ];
  const cashEndBalances = calculateCashBalances(
    startingCashBalance,
    netCashChanges
  );

  const bsTotalDepreciation = [];

  Object.keys(investmentTableData[7]).forEach((key) => {
    if (key.startsWith("month")) {
      bsTotalDepreciation.push(parseFloat(investmentTableData[7][key]));
    }
  });
  const bsTotalNetFixedAssets = [];

  Object.keys(investmentTableData[8]).forEach((key) => {
    if (key.startsWith("month")) {
      bsTotalNetFixedAssets.push(parseFloat(investmentTableData[8][key]));
    }
  });

  const currentAssets = cashEndBalances.map((cashEnd, index) => {
    const accountsReceivable = 0; // Placeholder value
    const inventory = 0; // Placeholder value
    return cashEnd + accountsReceivable + inventory; // Calculate Current Assets
  });
  const totalAssets = currentAssets.map(
    (currentAsset, index) => currentAsset + bsTotalNetFixedAssets[index]
  );

  // calculate the total liabilities = remaining balance + account payable
  

  //calculate the total shareholders equity = paid in capital + common stock + preferred stock + retain earnings
  


  console.log("loanData", loanData);
  console.log("loanTableData", loanTableData);

  const bsTotalRemainingBalance = [];

  Object.keys(loanTableData[6]).forEach((key) => {
    if (key.startsWith("Month ")) {
      bsTotalRemainingBalance.push(parseFloat(loanTableData[6][key]));
    }
  });

  

  
  //calculate the accumulated retained earnings
  const accumulatedRetainEarnings = netIncome.reduce((acc, curr, index) => {
    if (index === 0) {
      return [curr];
    } else {
      return [...acc, curr + acc[index - 1]];
    }
  }, []);

  const totalLiabilities = bsTotalRemainingBalance.map(
    (remainingBalance, index) => remainingBalance + 0 // Placeholder value
  );

  const totalShareholdersEquity = accumulatedRetainEarnings.map(
    (earnings, index) =>
      0 + 0 + 0 + earnings // Placeholder values
  );


  //calculate the total liabilities and shareholders equity = total liabilities + total shareholders equity
  const totalLiabilitiesAndShareholdersEquity = totalLiabilities.map(
    (totalLiabilities, index) => totalLiabilities + totalShareholdersEquity[index]
  );

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
      values: netIncome.map(
        (value, index) =>
          value +
          totalInvestmentDepreciation[index] +
          0 /* Inventory */ +
          0 /* AR */ -
          0 /* AP */
      ),
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
      values: new Array(numberOfMonths).fill(0), // Placeholder values
    },
    {
      key: "Increase in Preferred Stock",
      values: new Array(numberOfMonths).fill(0), // Placeholder values
    },
    {
      key: "Increase in Paid in Capital",
      values: new Array(numberOfMonths).fill(0), // Placeholder values
    },
    {
      key: "CF Financing",
      values: netIncome.map((_, index) => {
        const cfLoan = cfLoanArray[index] || 0;
        const increaseCommonStock = 0; // Placeholder value
        const increasePreferredStock = 0; // Placeholder value
        const increasePaidInCapital = 0; // Placeholder value
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
        const increaseCommonStock = 0; // Placeholder value
        const increasePreferredStock = 0; // Placeholder value
        const increasePaidInCapital = 0; // Placeholder value
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
    }
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
      {}
    ),
  }));

  const positionDataWithNetIncome2 = [
  {
    key: "Accounts Receivable", // Added Accounts Receivable row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Inventory", // Added Inventory row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Current Assets", // Added Current Assets row
    values: currentAssets,
  },
  { key: "Long term assets (Heading)" },

  // insert BS Total investment here
  { key: "Total Investment", values: totalAssetValue }, // New row for total investment

  { key: "Total Accumulated Depreciation", values: bsTotalDepreciation },

  {
    key: "Net Fixed Assets = Same row in Investment Table",
    values: bsTotalNetFixedAssets,
  },

  {
    key: "Total Assets = Sum of Current Assets and Net Fixed Assets",
    values: totalAssets,
  },

  {
    key: "Account Payable", // Added Inventory row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Long term liabilities",
    values: bsTotalRemainingBalance, // New row for long term liabilities
  },
  
  {
    key: "Total Liabilities", // Added Inventory row
    values: totalLiabilities,
  },
  
  {
    key: "Paid in Capital", // Added Inventory row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Common Stock", // Added Inventory row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Preferred Stock", // Added Inventory row
    values: new Array(numberOfMonths).fill(0), // Set values to zero
  },
  {
    key: "Retain Earnings", // Added Inventory row
    values: netIncome,
  },

  // Calculated the accumulated retained earnings here

  {
    key: "Accumulated Retain Earnings",
    values: accumulatedRetainEarnings,
  },

  {
    key: "Total Shareholders Equity",
    values: totalShareholdersEquity,
  },

  // Add the Total Liabilities and Shareholders Equity here
  
  {
    key: "Total Liabilities and Shareholders Equity",
    values: totalLiabilitiesAndShareholdersEquity,
  },

  {
    key: "Total Assets = Sum of Current Assets and Net Fixed Assets",
    values: totalAssets,
  },

].map((item, index) => ({
  metric: item.key,
  ...item.values?.reduce(
    (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
    {}
  ),
}));

  const positionColumns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
      onCell: () => ({
        style: {
          borderRight: "1px solid #f0f0f0",
        },
      }),
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
      onCell: () => ({
        style: {
          borderRight: "1px solid #f0f0f0",
        },
      }),
    })),
  ];

  const chartSeries = [
    {
      name: "Total Revenue",
      data: totalRevenue.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Total Costs",
      data: totalCosts.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Personnel",
      data: totalPersonnelCosts.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Depreciation",
      data: totalInvestmentDepreciation.map((value) =>
        parseFloat(value?.toFixed(2))
      ),
    },
    {
      name: "Interest",
      data: totalInterestPayments.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Net Income",
      data: netIncome.map((value) => parseFloat(value?.toFixed(2))),
    },
  ];

  const chartOptions = {
    chart: { id: "profit-and-loss-chart", type: "line", height: 350 },
    xaxis: {
      categories: Array.from({ length: numberOfMonths }, (_, i) => `${i + 1}`),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
        minHeight: 100,
        style: {
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    yaxis: { title: { text: "Amount ($)" } },
    stroke: { curve: "smooth" },
    legend: { position: "top" },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `$${val?.toFixed(2)}`,
      },
    },
  };

  return (
    <div className="border-t-2">
      <h2 className="text-2xl font-semibold mb-4">Profit and Loss Statement</h2>
      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={transposedData}
        columns={columns}
        pagination={false}
      />
      <h2 className="text-2xl font-semibold mb-4">Cash Flow</h2>
      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={positionDataWithNetIncome}
        columns={positionColumns}
        pagination={false}
      />
      <h2 className="text-2xl font-semibold mb-4">Balance Sheet</h2>
      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={positionDataWithNetIncome2}
        columns={positionColumns}
        pagination={false}
      />
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ProfitAndLossSection;
