import { Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import {
  calculateChannelRevenue,
  setCogsData,
  setRevenueData,
  setRevenueDeductionData,
} from "../../../features/SaleSlice";
import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
} from "../../../features/CostSlice";
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

function BalanceSheetSection({ numberOfMonths }) {
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

  const cashEndBalances = calculateCashBalances(
    startingCashBalance,
    netCashChanges
  );

  const currentAssets = cashEndBalances.map((cashEnd, index) => {
    const accountsReceivable = 0; // Placeholder value
    const inventory = 0; // Placeholder value
    return cashEnd + accountsReceivable + inventory; // Calculate Current Assets
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

  const totalAssets = currentAssets.map(
    (currentAsset, index) => currentAsset + bsTotalNetFixedAssets[index]
  );

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
      style: { borderRight: "1px solid #f0f0f0" },
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

  const [selectedChart, setSelectedChart] = useState("total-assets-chart"); // State để lưu trữ biểu đồ được chọn

  // Các useEffect và mã khác ở đây không thay đổi

  // Hàm xử lý sự kiện khi giá trị của dropdown thay đổi
  const handleChartSelect = (value) => {
    setSelectedChart(value);
  };

  const [cutMonth, setCutMonth] = useState(4);
  const handleCutMonthChange = (e) => {
    setCutMonth(Number(e.target.value));
  };


   const divideMonthsIntoYearsForBalanceSheet = () => {
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
  
  // Generate table columns including Year Total column for Balance Sheet
  const generateBalanceSheetTableColumns = (months) => [
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
      // Add any formatting if needed
    },
  ];

  const getDataSourceForYearBalanceSheet = (months) => {
    const monthKeys = months.map(month => `Month ${month}`);
  
    return positionDataWithNetIncome2.map((data) => {
      const filteredData = monthKeys.reduce((acc, monthKey) => {
        acc[monthKey] = data[monthKey]; // keep original formatted value
        return acc;
      }, {});
  
      const yearTotal = monthKeys.reduce((sum, key) => sum + (data[key] ? parseFloat(data[key].replace(/,/g, '')) : 0), 0);
  
      return {
        metric: data.metric,
        ...filteredData,
        yearTotal, // Adding Year Total to each row
      };
    });
  };

  const calculateBalanceSheetRatios = (dataSource) => {
    const findYearTotalByKey = (key) => {
      const item = dataSource.find(data => data.metric === key);
      return item ? item.yearTotal : 0;
    };
  
    const totalAssets = findYearTotalByKey("Total Assets");
    const totalLiabilities = findYearTotalByKey("Total Liabilities");
    const currentAssets = findYearTotalByKey("Current Assets");
    const currentLiabilities = findYearTotalByKey("Current Liabilities");
    const totalEquity = findYearTotalByKey("Total Shareholders Equity");
  
    // Basic financial ratios from balance sheet
    const currentRatio = currentAssets / currentLiabilities; // Measures liquidity
    const debtToEquityRatio = totalLiabilities / totalEquity; // Measures financial leverage
    const assetToEquityRatio = totalAssets / totalEquity; // Measures how much assets are financed by owners' interests
  
    // Additional ratios for a deeper financial analysis
    const quickRatio = (currentAssets - findYearTotalByKey("Inventory")) / currentLiabilities; // Measures immediate liquidity
    const liabilitiesToAssetsRatio = totalLiabilities / totalAssets; // Measures the percentage of assets financed by liabilities
    const equityRatio = totalEquity / totalAssets; // Measures the proportion of total assets financed by shareholders
    const fixedAssetTurnoverRatio = findYearTotalByKey("Net Fixed Assets") / totalAssets; // Efficiency ratio for fixed assets usage
  
    return {
      currentRatio: currentRatio.toFixed(2),
      debtToEquityRatio: debtToEquityRatio.toFixed(2),
      assetToEquityRatio: assetToEquityRatio.toFixed(2),
      quickRatio: quickRatio.toFixed(2),
      liabilitiesToAssetsRatio: liabilitiesToAssetsRatio.toFixed(2),
      equityRatio: equityRatio.toFixed(2),
      fixedAssetTurnoverRatio: fixedAssetTurnoverRatio.toFixed(2),
    };
  };
  


  return (
    <div className="border-t-2">
      <h2 className="text-2xl font-semibold my-4">Balance Sheet</h2>

      <Table
        className="overflow-auto my-8"
        size="small"
        dataSource={positionDataWithNetIncome2}
        columns={positionColumns1}
        pagination={false}
      />

      <div className=" gap-4 mb-3">
        <span className="flex items-center text-sm my-4">Select Chart :</span>
        <Select
          onValueChange={(value) => handleChartSelect(value)}
          value={selectedChart}
          className="border-solid border-[1px] border-gray-200 "
        >
          <SelectTrigger className="border-solid border-[1px] border-gray-200 w-[20%]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent position="popper">
            <SelectItem
              value="total-assets-chart"
              className="hover:cursor-pointer"
            >
              Total Asset
            </SelectItem>
            <SelectItem
              value="cash-flow-chart"
              className="hover:cursor-pointer"
            >
              Cash
            </SelectItem>
            <SelectItem
              value="total-liabilities-chart"
              className="hover:cursor-pointer"
            >
              Total Liabilities
            </SelectItem>
            <SelectItem
              value="total-shareholders-equity-chart"
              className="hover:cursor-pointer"
            >
              Total Shareholders Equity
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
      {selectedChart === "total-assets-chart" && (
        <CustomChart
          numberOfMonths={numberOfMonths}
          id="total-assets-chart"
          yaxisTitle="Total Assets ($)"
          seriesTitle="Total Assets"
          RenderData={totalAssets}
          title="Total Assets Over Time"
        />
      )}
      {selectedChart === "total-liabilities-chart" && (
        <CustomChart
          numberOfMonths={numberOfMonths}
          id="total-liabilities-chart"
          yaxisTitle="Total Liabilities ($)"
          seriesTitle="Total Liabilities"
          RenderData={totalLiabilities}
          title="Total Liabilities Over Time"
        />
      )}
      {selectedChart === "total-shareholders-equity-chart" && (
        <CustomChart
          numberOfMonths={numberOfMonths}
          id="total-shareholders-equity-chart"
          yaxisTitle="Total Shareholders Equity ($)"
          seriesTitle="Total Shareholders Equity"
          RenderData={totalShareholdersEquity}
          title="Total Shareholders Equity Over Time"
        />
      )}

<div className="my-4">
        <label htmlFor="cutMonthSelect" className="mr-2">Select Cut Month:</label>
        <select
          id="cutMonthSelect"
          value={cutMonth}
          onChange={handleCutMonthChange}
          className="border px-2 py-1"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

{divideMonthsIntoYearsForBalanceSheet().map((year, index) => (
  <div key={index}>
    <h3>{year.year}</h3>
    <Table
      className="overflow-auto my-8"
      size="small"
      dataSource={getDataSourceForYearBalanceSheet(year.months)}
      columns={generateBalanceSheetTableColumns(year.months)}
      pagination={false}
    />
    <div>
      <h4>Financial Ratios for {year.year}</h4>
      {(() => {
        const dataSourceForYear = getDataSourceForYearBalanceSheet(year.months);
        const ratios = calculateBalanceSheetRatios(dataSourceForYear);
        return (
          <ul>
            <li>Current Ratio: {ratios.currentRatio}</li>
            <li>Debt to Equity Ratio: {ratios.debtToEquityRatio}</li>
            <li>Asset to Equity Ratio: {ratios.assetToEquityRatio}</li>
            <li>Quick Ratio: {ratios.quickRatio}</li>
            <li>Liabilities to Assets Ratio: {ratios.liabilitiesToAssetsRatio}</li>
            <li>Equity Ratio: {ratios.equityRatio}</li>
            <li>Fixed Asset Turnover Ratio: {ratios.fixedAssetTurnoverRatio}</li>
          </ul>
        );
      })()}
    </div>
  </div>
))}

    </div>
  );
}

export default BalanceSheetSection;
