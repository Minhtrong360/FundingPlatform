import React from "react";
import { Table, Tooltip, message } from "antd";
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
  startingCashBalance,
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
    grossProfit,
    totalCosts,
    totalPersonnelCosts,
    totalInvestmentDepreciation,
    totalInterestPayments,
    ebitda,
    earningsBeforeTax,
    incomeTax,
    netIncome,
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

  const totalLoanAmount = loanData[0]?.loanDataPerMonth?.map((_, index) =>
    loanData.reduce(
      (acc, loan) => acc + (loan.loanDataPerMonth[index]?.loanAmount || 0),
      0
    )
  );

  const totalPrincipal = loanData[0]?.loanDataPerMonth?.map((_, index) =>
    loanData.reduce(
      (acc, loan) => acc + (loan.loanDataPerMonth[index]?.principal || 0),
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

  const positionDataWithNetIncome = [
    { key: "Net Income", values: netIncome },
    { key: "Costs", values: totalCosts },
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
      key: "Total Asset Value",
      values: totalAssetValue,
    },
    {
      key: "Total Loan Amount",
      values: filledTotalLoanAmount,
    },
    {
      key: "Total Principal",
      values: filledTotalPrincipal,
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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profit and Loss Statement</h2>
      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={transposedData}
        columns={columns}
        pagination={false}
      />
      <h2 className="text-2xl font-semibold mb-4">Position Statement</h2>
      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={positionDataWithNetIncome}
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
