import React from "react";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const ProfitAndLossSection = ({
  revenueData,
  revenueDeductionData,
  cogsData,
  costData,
  personnelCostData,
  investmentData,
  loanData,
  numberOfMonths,
  incomeTaxRate,
}) => {
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

    // Feb29
    let netRevenue = totalRevenue.map(
      (revenue, index) => revenue - totalDeductions[index]
    ); // Net Revenue calculation

    let grossProfit = netRevenue.map(
      (revenue, index) => revenue - totalCOGS[index]
    ); // Gross Profit calculation

    let ebitda = grossProfit.map(
      (profit, index) =>
        profit - (totalCosts[index] + totalPersonnelCosts[index])
    ); // Adjust EBITDA calculation to use grossProfit

    let totalInterestPayments = new Array(numberOfMonths).fill(0);
    loanData.forEach((loan) => {
      loan.loanDataPerMonth.forEach((monthData) => {
        totalInterestPayments[monthData.month - 1] += monthData.interest;
      });
    });

    // Adjust earningsBeforeTax calculation to use ebitda
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

    return {
      totalRevenue,
      totalDeductions,
      netRevenue,
      totalCOGS,
      grossProfit, // Include Gross Profit in the returned object
      totalCosts,
      totalPersonnelCosts,
      totalInvestmentDepreciation,
      totalInterestPayments,
      ebitda,
      earningsBeforeTax,
      incomeTax,
      netIncome,
    };
  };

  const {
    totalRevenue,
    totalDeductions,
    netRevenue,
    totalCOGS,
    grossProfit, // Destructure Gross Profit
    totalCosts,
    totalPersonnelCosts,
    totalInvestmentDepreciation,
    totalInterestPayments,
    ebitda,
    earningsBeforeTax,
    incomeTax,
    netIncome,
  } = calculateProfitAndLoss();

  console.log("totalRevenue", totalRevenue);
  console.log("totalCosts", totalCosts);

  const transposedData = [
    { key: "Total Revenue", values: totalRevenue },
    { key: "Total Deductions", values: totalDeductions },
    { key: "Net Revenue", values: netRevenue },
    { key: "Total COGS", values: totalCOGS },
    { key: "Gross Profit", values: grossProfit },
    { key: "Total Operating Expenses", values: totalCosts },
    { key: "Total Personnel Costs", values: totalPersonnelCosts },
    { key: "EBITDA", values: ebitda }, // Add EBITDA row
    {
      key: "Total Investment Depreciation",
      values: totalInvestmentDepreciation,
    },
    { key: "Total Interest Payments", values: totalInterestPayments },
    { key: "Earnings Before Tax", values: earningsBeforeTax },
    { key: "Income Tax", values: incomeTax },
    { key: "Net Income", values: netIncome },
  ].map((item, index) => ({
    metric: item.key,
    ...item.values.reduce(
      (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
      {}
    ),
  }));

  // Adjust columns for the transposed table
  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
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
      name: "Total Personnel Costs",
      data: totalPersonnelCosts.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Total Investment Depreciation",
      data: totalInvestmentDepreciation.map((value) =>
        parseFloat(value?.toFixed(2))
      ),
    },
    {
      name: "Total Interest Payments",
      data: totalInterestPayments.map((value) => parseFloat(value?.toFixed(2))),
    },
    {
      name: "Net Income",
      data: netIncome.map((value) => parseFloat(value.toFixed(2))),
    },
  ];

  const chartOptions = {
    chart: { id: "profit-and-loss-chart", type: "line", height: 350 },
    xaxis: {
      categories: Array.from({ length: numberOfMonths }, (_, i) => `${i + 1}`),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
          fontWeight: "600", // Cỡ chữ semibold
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
        minHeight: 100, // Adjust as needed to ensure labels do not overlap or take up too much space
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

  // Transposed table data preparation remains unchanged

  // Table columns definition remains unchanged

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profit and Loss Statement</h2>
      <Table
        className="overflow-auto mb-4"
        dataSource={transposedData}
        columns={columns}
        pagination={false}
      />
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default ProfitAndLossSection;
