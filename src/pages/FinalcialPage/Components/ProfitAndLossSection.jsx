import React, { useEffect } from "react";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card } from "antd";
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
    totalPrincipal,
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

  const totalAssetValue = investmentData[0]?.assetValue?.map((_, index) =>
    investmentData.reduce((acc, data) => acc + data?.assetValue[index], 0)
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
  }

  const cfLoanArray = [];

  if (loanTableData.length > 0) {
    const cfLoans = loanTableData.find((item) => item.key === "CF Loans");

    Object.keys(cfLoans).forEach((key) => {
      if (key.startsWith("Month ")) {
        cfLoanArray.push(parseNumber(cfLoans[key]));
      }
    });
  }

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

  const cashBeginBalances = [
    parseFloat(startingCashBalance),
    ...calculateCashBalances(startingCashBalance, netCashChanges)?.slice(0, -1),
  ];
  const cashEndBalances = calculateCashBalances(
    startingCashBalance,
    netCashChanges
  );

  const bsTotalDepreciation = [];
  const bsTotalNetFixedAssets = [];

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

  loanTableData.forEach((data) => {
    if (data.key === "Total Remaining Balance") {
      Object.keys(data).forEach((key) => {
        if (key.startsWith("Month ")) {
          bsTotalRemainingBalance.push(parseNumber(data[key]));
        }
      });
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
    (earnings, index) =>
      startingPaidInCapital +
      accumulatedCommonStockArr[index] +
      accumulatedPreferredStockArr[index] +
      accumulatedCapitalArr[index] +
      earnings // Placeholder values
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
        const currentValue = i === 0 ? startingPaidInCapital.toFixed(2) : "0";
        const currentValueFloat = parseFloat(currentValue);
        const capitalArrValue = capitalArr[i] || 0; // If capitalArr doesn't have value at index i, default to 0
        return (currentValueFloat + capitalArrValue).toFixed(2);
      }).map((value) => parseFloat(value)),
    },
    {
      key: "Common Stock", // Added Inventory row
      values: commonStockArr,
    },
    {
      key: "Preferred Stock", // Added Inventory row
      values: preferredStockArr,
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
      (acc, value, i) => ({
        ...acc,
        [`Month ${i + 1}`]: formatNumber(value?.toFixed(2)),
      }),
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
        children: (
          <div className={" md:whitespace-nowrap "}>
            <a
              style={{
                fontWeight:
                  record.metric === "CF Operations" ||
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
        props: {
          colSpan:
            record.metric === " Operating Activities " ||
            record.metric === " Investing Activities " ||
            record.metric === " Financing Activities "
              ? 36
              : 1,
          style:
            record.metric === " Operating Activities " ||
            record.metric === " Investing Activities " ||
            record.metric === " Financing Activities "
              ? {}
              : { borderRight: "1px solid #f0f0f0" },
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
        if (
          record.metric === " Operating Activities " ||
          record.metric === " Investing Activities " ||
          record.metric === " Financing Activities "
        ) {
          return {
            style: {
              borderRight: "1px solid #f0f0f0",
            },
            colSpan: 0,
          };
        } else if (
          record.metric === "CF Operations" ||
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
            <a
              style={{
                fontWeight:
                  record.metric === "Current Assets" ||
                  record.metric === "Long term assets" ||
                  record.metric === "Total Assets" ||
                  record.metric === "Total Liabilities" ||
                  record.metric === "Total Assets (Double Check)" ||
                  record.metric === "Total Shareholders Equity" ||
                  record.metric ===
                    "Total Liabilities and Shareholders Equity" ||
                  record.metric === "Assets" ||
                  record.metric === " Current Assets" ||
                  record.metric === "Long-Term Assets" ||
                  record.metric === "Liabilities & Equity" ||
                  record.metric === "Current Liabilities" ||
                  record.metric === "Long-Term Liabilities" ||
                  record.metric === "Shareholders Equity"
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
            record.metric === "Assets" ||
            record.metric === " Current Assets" ||
            record.metric === "Long-Term Assets" ||
            record.metric === "Liabilities & Equity" ||
            record.metric === "Current Liabilities" ||
            record.metric === "Long-Term Liabilities" ||
            record.metric === "Shareholders Equity"
              ? numberOfMonths
              : 1,
          style:
            record.metric === "Assets" ||
            record.metric === " Current Assets" ||
            record.metric === "Long-Term Assets" ||
            record.metric === "Liabilities & Equity" ||
            record.metric === "Current Liabilities" ||
            record.metric === "Long-Term Liabilities" ||
            record.metric === "Shareholders Equity"
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
          record.metric === "Assets" ||
          record.metric === " Current Assets" ||
          record.metric === "Long-Term Assets" ||
          record.metric === "Liabilities & Equity" ||
          record.metric === "Current Liabilities" ||
          record.metric === "Long-Term Liabilities" ||
          record.metric === "Shareholders Equity"
        ) {
          return {
            style: {
              borderRight: "1px solid #f0f0f0",
            },
            colSpan: 0,
          };
        } else if (
          record.metric === "Current Assets" ||
          record.metric === "Long term assets" ||
          record.metric === "Total Assets" ||
          record.metric === "Total Liabilities" ||
          record.metric === "Total Assets (Double Check)" ||
          record.metric === "Total Shareholders Equity" ||
          record.metric === "Total Liabilities and Shareholders Equity"
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

      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
      <Row gutter={[16, 16]} className="additional-charts">
        <Col span={24} md={12} className="md:mt-0 mt-5">
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
