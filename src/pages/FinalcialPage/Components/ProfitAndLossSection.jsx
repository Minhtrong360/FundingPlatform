import React from "react";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import { Row, Col, Card } from "antd";

const ProfitAndLossSection = ({
  costData,
  personnelCostData,
  investmentData,
  loanData,
  numberOfMonths,
  investmentTableData,
  loanTableData,
  fundraisingInputs,
  fundraisingTableData,
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
    { key: "Revenue"},
    { key: "Total Revenue", values: totalRevenue },
    { key: "Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "Cost of Revenue"},
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "Operating Expenses"},
    { key: "Operating Costs", values: totalCosts },
    { key: "Personnel", values: totalPersonnelCosts },
    { key: "EBITDA", values: ebitda },
    { key: "Additional Expenses"},
    { key: "Depreciation", values: totalInvestmentDepreciation },
    { key: "Interest", values: totalInterestPayments },
    { key: "EBT", values: earningsBeforeTax },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
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
      width: 200,
      render: (text, record) => ({
        children:
        <div className={" md:whitespace-nowrap "}>
        <a style={{ fontWeight: (record.metric === "Total Revenue"|| record.metric === "Total COGS" || record.metric === "Net Revenue" || record.metric === "Gross Profit" || record.metric === "EBITDA" || record.metric === "Operating Costs" || record.metric === "Net Income"||record.metric === "Revenue" || record.metric === "Cost of Revenue" || record.metric === "Operating Expenses" || record.metric === "Additional Expenses") ? 'bold' : 'normal' }}>{text}</a>
        </div>,
        props: {
          colSpan: (record.metric === "Revenue" || record.metric === "Cost of Revenue" || record.metric === "Operating Expenses" || record.metric === "Additional Expenses" ) ? 36 : 1,
          style: (record.metric === "Revenue" || record.metric === "Cost of Revenue" || record.metric === "Operating Expenses" || record.metric === "Additional Expenses" ) ? {} : { borderRight: "1px solid #f0f0f0" }
        },
      }),
      
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
      onCell: (record) => {
        if (record.metric === "Revenue" || record.metric === "Cost of Revenue" || record.metric === "Operating Expenses" || record.metric === "Additional expenses") {
          return {
            style: {
              borderRight: "1px solid #f0f0f0",
            },
            colSpan: 0,
          };
        } else if (record.metric === "Total Revenue"|| record.metric === "Total COGS" || record.metric === "Net Revenue" || record.metric === "Gross Profit" || record.metric === "EBITDA" || record.metric === "Operating Costs" || record.metric === "Net Income") {
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

  const bsTotalRemainingBalance = [];

  Object.keys(loanTableData[6]).forEach((key) => {
    if (key.startsWith("Month ")) {
      bsTotalRemainingBalance.push(parseFloat(loanTableData[6][key]));
    }
  });

  const startingPaidInCapital = parseFloat(startingCashBalance);

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
    (earnings, index) => startingPaidInCapital + 0 + 0 + earnings // Placeholder values
  );

  //calculate the total liabilities and shareholders equity = total liabilities + total shareholders equity
  const totalLiabilitiesAndShareholdersEquity = totalLiabilities.map(
    (totalLiabilities, index) =>
      totalLiabilities + totalShareholdersEquity[index]
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
      values: netIncome.map(
        (value, index) =>
          value +
          totalInvestmentDepreciation[index] +
          0 /* Inventory */ +
          0 /* AR */ -
          0 /* AP */
      ),
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
    },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values?.reduce(
      (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
      {}
    ),
  }));

  const positionDataWithNetIncome2 = [
    {
      key: "Assets", 
    },
    {
      key: " Current Assets", 
    },
    {
      key: "Cash",
      values: cashEndBalances, // Set values to zero
    },
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
    {
      key: "Long-Term Assets", 
    },
    // insert BS Total investment here
    { key: "Total Investment", values: totalAssetValue }, // New row for total investment

    { key: "Total Accumulated Depreciation", values: bsTotalDepreciation },

    {
      key: "Net Fixed Assets",
      values: bsTotalNetFixedAssets,
    },

    {
      key: "Long term assets",
      values: bsTotalNetFixedAssets,
    },

    {
      key: "Total Assets",
      values: totalAssets,
    },

    {
      key: "Liabilities & Equity",
    
    },
    {
      key: "Current Liabilities",
     
    },
    {
      key: "Account Payable", // Added Inventory row
      values: new Array(numberOfMonths).fill(0), // Set values to zero
    },
   
    {
      key: "Long-Term Liabilities", 
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
      key: "Shareholders Equity",
    },
    {
      key: "Paid in Capital",
      values: Array.from({ length: numberOfMonths }, (_, i) => {
        return i === 0 ? startingPaidInCapital.toFixed(2) : "0";
      }).map((value) => parseFloat(value)),
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
      key: "Total Assets (Double Check)",
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
      render: (text, record) => ({
        children: 
        <div className={" md:whitespace-nowrap "}>
        <a style={{ fontWeight: (record.metric === "CF Operations" || record.metric === "CF Investments" || record.metric === "CF Financing" || record.metric === "Net +/- in Cash" || record.metric === "Cash Begin" || record.metric === "Cash End" || record.metric === " Operating Activities " || record.metric === " Investing Activities " || record.metric === " Financing Activities ") ? 'bold' : 'normal' }}>{text}</a>
        </div>,
        props: {
          colSpan: (record.metric === " Operating Activities " || record.metric === " Investing Activities " || record.metric === " Financing Activities ") ? 36 : 1,
          style: (record.metric === " Operating Activities " || record.metric === " Investing Activities " || record.metric === " Financing Activities ") ? {} : { borderRight: "1px solid #f0f0f0" }
        },
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
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
      onCell: (record) => {
        if (record.metric === " Operating Activities " || record.metric === " Investing Activities " || record.metric === " Financing Activities ") {
          return {
            style: {
              borderRight: "1px solid #f0f0f0",
            },
            colSpan: 0,
          };
        } else if (record.metric === "CF Operations" || record.metric === "CF Investments" || record.metric === "CF Financing" || record.metric === "Net +/- in Cash" || record.metric === "Cash Begin" || record.metric === "Cash End") {
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
    })),
  ];

  const positionColumns1 = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
      
      render: (text, record) => ({
        children: (
          <div className={" md:whitespace-nowrap "}>
            <a style={{ fontWeight: (record.metric === "Current Assets" || record.metric === "Long term assets" || record.metric === "Total Assets" || record.metric === "Total Liabilities" || record.metric === "Total Assets (Double Check)" || record.metric === "Total Shareholders Equity" || record.metric === "Total Liabilities and Shareholders Equity" ||record.metric === "Assets" || record.metric === " Current Assets" || record.metric === "Long-Term Assets" || record.metric === "Liabilities & Equity" || record.metric === "Current Liabilities" || record.metric === "Long-Term Liabilities" || record.metric === "Shareholders Equity") ? 'bold' : 'normal' }}>
              {text}
            </a>
          </div>
        ),
        props: {
          colSpan: (record.metric === "Assets" || record.metric === " Current Assets" || record.metric === "Long-Term Assets" || record.metric === "Liabilities & Equity" || record.metric === "Current Liabilities" || record.metric === "Long-Term Liabilities" || record.metric === "Shareholders Equity") ? 36 : 1,
          style: (record.metric === "Assets" || record.metric === " Current Assets" || record.metric === "Long-Term Assets" || record.metric === "Liabilities & Equity" || record.metric === "Current Liabilities" || record.metric === "Long-Term Liabilities" || record.metric === "Shareholders Equity") ? {} : { borderRight: "1px solid #f0f0f0" }
        }
      })
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
      onCell: (record) => {
        if (record.metric === "Assets" || record.metric === " Current Assets" || record.metric ===  "Long-Term Assets" || record.metric === "Liabilities & Equity" || record.metric === "Current Liabilities" || record.metric === "Long-Term Liabilities" || record.metric ===  "Shareholders Equity") {
          return {
            style: {
              borderRight: "1px solid #f0f0f0",
            },
            colSpan: 0
          };
        } else if (record.metric === "Current Assets" || record.metric === "Long term assets" || record.metric === "Total Assets" || record.metric === "Total Liabilities" || record.metric === "Total Assets (Double Check)" || record.metric === "Total Shareholders Equity" || record.metric === "Total Liabilities and Shareholders Equity") {
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
            }
          };
        }
      }
      
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
        columns={positionColumns1}
        pagination={false}
      />
      {/* <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      /> */}

      <Row gutter={16} className="additional-charts">
        <Col span={12}>
          <Card title="Total Revenue Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "total-revenue-chart" },
                yaxis: { title: { text: "Total Revenue ($)" } },
              }}
              series={[
                {
                  name: "Total Revenue",
                  data: totalRevenue.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Costs Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "total-costs-chart" },
                yaxis: { title: { text: "Total Costs ($)" } },
              }}
              series={[
                {
                  name: "Total Costs",
                  data: totalCosts.map((value) => parseFloat(value.toFixed(2))),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Net Income Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "net-income-chart" },
                yaxis: { title: { text: "Net Income ($)" } },
              }}
              series={[
                {
                  name: "Net Income",
                  data: netIncome.map((value) => parseFloat(value.toFixed(2))),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cash Flow Overview">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "cash-flow-chart" },
                yaxis: { title: { text: "Cash Flow ($)" } },
              }}
              series={[
                {
                  name: "Net Cash Change",
                  data: netCashChanges.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Total Assets Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "total-assets-chart" },
                yaxis: { title: { text: "Total Assets ($)" } },
              }}
              series={[
                {
                  name: "Total Assets",
                  data: totalAssets.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Liabilities Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "total-liabilities-chart" },
                yaxis: { title: { text: "Total Liabilities ($)" } },
              }}
              series={[
                {
                  name: "Total Liabilities",
                  data: totalLiabilities.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Total Shareholders Equity Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  id: "total-shareholders-equity-chart",
                },
                yaxis: { title: { text: "Total Shareholders Equity ($)" } },
              }}
              series={[
                {
                  name: "Total Shareholders Equity",
                  data: totalShareholdersEquity.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Gross Profit Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "gross-profit-chart" },
                yaxis: { title: { text: "Gross Profit ($)" } },
              }}
              series={[
                {
                  name: "Gross Profit",
                  data: grossProfit.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="EBITDA Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "ebitda-chart" },
                yaxis: { title: { text: "EBITDA ($)" } },
              }}
              series={[
                {
                  name: "EBITDA",
                  data: ebitda.map((value) => parseFloat(value.toFixed(2))),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Earnings Before Tax Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  id: "earnings-before-tax-chart",
                },
                yaxis: { title: { text: "Earnings Before Tax ($)" } },
              }}
              series={[
                {
                  name: "Earnings Before Tax",
                  data: earningsBeforeTax.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Income Tax Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "income-tax-chart" },
                yaxis: { title: { text: "Income Tax ($)" } },
              }}
              series={[
                {
                  name: "Income Tax",
                  data: incomeTax.map((value) => parseFloat(value.toFixed(2))),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Investment Depreciation Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  id: "total-investment-depreciation-chart",
                },
                yaxis: { title: { text: "Total Investment Depreciation ($)" } },
              }}
              series={[
                {
                  name: "Total Investment Depreciation",
                  data: totalInvestmentDepreciation.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Total Interest Payments Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  id: "total-interest-payments-chart",
                },
                yaxis: { title: { text: "Total Interest Payments ($)" } },
              }}
              series={[
                {
                  name: "Total Interest Payments",
                  data: totalInterestPayments.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Principal Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: { ...chartOptions.chart, id: "total-principal-chart" },
                yaxis: { title: { text: "Total Principal ($)" } },
              }}
              series={[
                {
                  name: "Total Principal",
                  data: totalPrincipal.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row
        gutter={16}
        className="additional-charts"
        style={{ marginTop: "20px" }}
      >
        <Col span={12}>
          <Card title="Cash Begin Balances Over Time">
            <Chart
              options={{
                ...chartOptions,
                chart: {
                  ...chartOptions.chart,
                  id: "cash-begin-balances-chart",
                },
                yaxis: { title: { text: "Cash Begin Balances ($)" } },
              }}
              series={[
                {
                  name: "Cash Begin",
                  data: cashBeginBalances.map((value) =>
                    parseFloat(value.toFixed(2))
                  ),
                },
              ]}
              type="area"
              height={300}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitAndLossSection;
