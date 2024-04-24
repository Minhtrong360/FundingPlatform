import React, { useEffect, useState } from "react";
import { Input, Button, Typography, Alert } from "antd";
import {
  calculateCustomerGrowth,
  generateCustomerTableData,
  setCustomerTableData,
  transformCustomerData,
} from "../../../features/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateChannelRevenue,
  setRevenueTableData,
  transformRevenueDataForTable,
} from "../../../features/SaleSlice";
import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostTableData,
  transformCostDataForTable,
} from "../../../features/CostSlice";
import {
  calculatePersonnelCostData,
  setPersonnelTableData,
  transformPersonnelCostDataForTable,
} from "../../../features/PersonnelSlice";
import {
  calculateInvestmentData,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import {
  calculateLoanData,
  setLoanTableData,
  transformLoanDataForTable,
} from "../../../features/LoanSlice";
import {
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";
import {
  calculateProfitAndLoss,
  setTransposedData,
} from "../../../features/ProfitAndLossSlice";
import { setPositionDataWithNetIncome } from "../../../features/CashFlowSlice";
import { setPositionDataWithNetIncome2 } from "../../../features/BalanceSheetSlice";

const { Text } = Typography;

const GPTAnalyzer = ({ numberOfMonths }) => {
  const [inputValue, setInputValue] = useState("");
  const [responseResult, setResponseResult] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { customerInputs, customerTableData } = useSelector(
    (state) => state.customer
  );
  const { channelInputs, revenueTableData } = useSelector(
    (state) => state.sales
  );
  const { costInputs, costTableData } = useSelector((state) => state.cost);
  const { personnelInputs, personnelTableData } = useSelector(
    (state) => state.personnel
  );
  const { investmentInputs, investmentTableData } = useSelector(
    (state) => state.investment
  );
  const { loanInputs, loanTableData } = useSelector((state) => state.loan);
  const { fundraisingInputs, fundraisingTableData } = useSelector(
    (state) => state.fundraising
  );

  const { incomeTax: incomeTaxRate, startingCashBalance } = useSelector(
    (state) => state.durationSelect
  );

  const { transposedData } = useSelector((state) => state.profitAndLoss);

  const { positionDataWithNetIncome } = useSelector((state) => state.cashFlow);

  const { positionDataWithNetIncome2 } = useSelector(
    (state) => state.balanceSheet
  );

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      numberOfMonths
    );

    const calculateTransformedCustomerTableData = transformCustomerData(
      calculatedData,
      customerInputs
    );

    const calculateCustomerTableData = generateCustomerTableData(
      calculateTransformedCustomerTableData,
      customerInputs,
      numberOfMonths,
      "all"
    );
    dispatch(setCustomerTableData(calculateCustomerTableData));

    const calculatedChannelRevenue = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        calculatedData,
        customerInputs,
        channelInputs
      )
    );
    const calculateRevenueTableData = transformRevenueDataForTable(
      calculatedChannelRevenue,
      channelInputs,
      "all"
    );
    dispatch(setRevenueTableData(calculateRevenueTableData));

    const calculateCostTableData = transformCostDataForTable(
      costInputs,
      numberOfMonths
    );
    dispatch(setCostTableData(calculateCostTableData));

    const calculatedPersonnelData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );

    const personnelCostTableData = transformPersonnelCostDataForTable(
      calculatedPersonnelData
    );

    dispatch(setPersonnelTableData(personnelCostTableData));

    const calculatedInvestmentData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    const investmentTableData = transformInvestmentDataForTable(
      investmentInputs,
      "all",
      calculatedInvestmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(investmentTableData));

    const calculateLoanTableData = transformLoanDataForTable(
      loanInputs,
      "all",
      numberOfMonths
    );

    dispatch(setLoanTableData(calculateLoanTableData));

    const calculateFundTableData = transformFundraisingDataForTable(
      fundraisingInputs,
      numberOfMonths
    );
    dispatch(setFundraisingTableData(calculateFundTableData));
    // Chỉ dành cho ProfitAndLoss
    const calculatedCostData = calculateCostData(costInputs, numberOfMonths);
    const calculatedLoanData = calculateLoanData(loanInputs);
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
      totalPrincipal,
    } = calculateProfitAndLoss(
      numberOfMonths,
      calculatedChannelRevenue.revenueByChannelAndProduct,
      calculatedChannelRevenue.DeductionByChannelAndProduct,
      calculatedChannelRevenue.cogsByChannelAndProduct,
      calculatedCostData,
      calculatedPersonnelData,
      calculatedInvestmentData,
      calculatedLoanData,
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
          [`Month ${i + 1}`]: formatNumber(value?.toFixed(0)),
        }),
        {}
      ),
    }));

    dispatch(setTransposedData(transposedData));

    // Chỉ dành cho Cash Flow

    const CFOperationsArray = netIncome.map(
      (value, index) =>
        value +
        totalInvestmentDepreciation[index] +
        0 /* Inventory */ +
        0 /* AR */ -
        0 /* AP */
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

    const calculateCashBalances = (startingCash, netCashChanges) => {
      const cashBalances = netCashChanges?.reduce(
        (acc, netCashChange, index) => {
          if (index === 0) {
            acc.push(parseFloat(startingCash) + netCashChange);
          } else {
            acc.push(acc[index - 1] + netCashChange);
          }
          return acc;
        },
        []
      );
      return cashBalances;
    };

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
      ...calculateCashBalances(startingCashBalance, netCashChanges)?.slice(
        0,
        -1
      ),
    ];

    const cashEndBalances = calculateCashBalances(
      startingCashBalance,
      netCashChanges
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
          [`Month ${i + 1}`]: formatNumber(value?.toFixed(0)),
        }),
        {}
      ),
    }));

    dispatch(setPositionDataWithNetIncome(positionDataWithNetIncome));

    // Chỉ dành cho BalanceSheet
    const currentAssets = cashEndBalances.map((cashEnd, index) => {
      const accountsReceivable = 0; // Placeholder value
      const inventory = 0; // Placeholder value
      return cashEnd + accountsReceivable + inventory; // Calculate Current Assets
    });

    let totalAssetValue = [];

    // Kiểm tra nếu investmentData không có giá trị hoặc investmentData[0]?.assetValue không tồn tại
    if (!calculatedInvestmentData || !calculatedInvestmentData[0]?.assetValue) {
      // Tạo một mảng mới với các phần tử có giá trị là 0
      // Ví dụ: Tạo một mảng gồm 12 phần tử có giá trị 0
      for (let i = 0; i < numberOfMonths; i++) {
        totalAssetValue.push(0);
      }
    } else {
      // Nếu calculatedInvestmentData có giá trị và calculatedInvestmentData[0]?.assetValue tồn tại
      // Thực hiện tính tổng của từng phần tử tại index trong mảng assetValue của mỗi phần tử trong calculatedInvestmentData
      totalAssetValue = calculatedInvestmentData[0]?.assetValue?.map(
        (_, index) =>
          calculatedInvestmentData.reduce(
            (acc, data) =>
              acc + (data?.assetValue ? data.assetValue[index] : 0),
            0
          )
      );
    }

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

    const totalAssets = currentAssets.map(
      (currentAsset, index) => currentAsset + bsTotalNetFixedAssets[index]
    );

    const bsTotalRemainingBalance = [];

    if (calculateLoanTableData.length === 0) {
      // Trường hợp không có dữ liệu trong calculateLoanTableData, tạo mảng mới với các phần tử có giá trị là 0
      // Giả sử bạn muốn tạo một mảng gồm 12 phần tử có giá trị 0
      for (let i = 0; i < numberOfMonths; i++) {
        bsTotalRemainingBalance.push(0);
      }
    } else {
      // Nếu có dữ liệu trong calculateLoanTableData, thực hiện vòng lặp để xử lý dữ liệu
      calculateLoanTableData.forEach((data) => {
        if (data.key === "Total Remaining Balance") {
          Object.keys(data).forEach((key) => {
            if (key.startsWith("Month ")) {
              bsTotalRemainingBalance.push(parseNumber(data[key]));
            }
          });
        }
      });
    }

    const totalLiabilities = bsTotalRemainingBalance.map(
      (remainingBalance, index) => remainingBalance + 0 // Placeholder value
    );

    const startingPaidInCapital = parseFloat(startingCashBalance);

    const accumulatedRetainEarnings = netIncome.reduce((acc, curr, index) => {
      if (index === 0) {
        return [curr];
      } else {
        return [...acc, curr + acc[index - 1]];
      }
    }, []);

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
      (totalLiability, index) => totalLiability + totalShareholdersEquity[index]
    );

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
          const currentValue = i === 0 ? startingPaidInCapital.toFixed(0) : "0";
          const currentValueFloat = parseFloat(currentValue);
          const capitalArrValue = capitalArr[i] || 0; // If capitalArr doesn't have value at index i, default to 0
          return (currentValueFloat + capitalArrValue).toFixed(0);
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
          [`Month ${i + 1}`]: formatNumber(value?.toFixed(0)),
        }),
        {}
      ),
    }));

    dispatch(setPositionDataWithNetIncome2(positionDataWithNetIncome2));
  }, [
    customerInputs,
    channelInputs,
    costInputs,
    personnelInputs,
    investmentInputs,
    loanInputs,
    numberOfMonths,
  ]);

  const handleAnalyze = async () => {
    try {
      console.log("customerTableData", customerTableData);
      console.log("revenueTableData", revenueTableData);
      console.log("costTableData", costTableData);
      console.log("personnelTableData", personnelTableData);
      console.log("investmentTableData", investmentTableData);
      console.log("loanTableData", loanTableData);
      console.log("fundraisingTableData", fundraisingTableData);
      console.log("transposedData", transposedData);
      console.log("positionDataWithNetIncome", positionDataWithNetIncome);
      console.log("positionDataWithNetIncome2", positionDataWithNetIncome2);

      const response = await fetch(
        "https://news-fetcher-8k6m.onrender.com/analyze", // Replace with actual backend URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_input: `${customerTableData}. Array "customerTableData" này nói về cái chi, hãy giải thích cho tôi với.`,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      const cleanedResponseText = data?.response?.replace(/json|`/g, "");
      setResponseResult(cleanedResponseText);

      setError(null);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-2xl font-semibold ">Financial Analysis</h2>

      <div>
        <div className="space-y-4">
          <div className="space-y-2">
            <input
              className=" m-2 px-4 block w-full h-full border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 "
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter text to analyze"
            />
          </div>
          <button
            className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
            type="primary"
            onClick={handleAnalyze}
          >
            Analyze
          </button>
          <div className="max-w-4xl mx-auto p-4 bg-white border rounded-md shadow-lg shadow-gray-100">
            {responseResult && (
              <div>
                <div>Analysis Result:</div>
                {responseResult.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
///////////////////

export default GPTAnalyzer;
