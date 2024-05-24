import { Button, FloatButton, Modal, Table, Tabs, message } from "antd";
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
import CustomChart from "./CustomChart";
import SelectField from "../../../components/SelectField";
import { setCutMonth } from "../../../features/DurationSlice";
import { FileOutlined } from "@ant-design/icons";
import GroqJS from "./GroqJson";

import Chart from 'react-apexcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import { grid2Classes } from "@mui/material";

const { RangePicker } = DatePicker;

const BalanceSheetChart = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [dateRange, setDateRange] = useState([null, null]);

  // Define the chart options
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
        }
      },
      zoom: {
        autoScaleYaxis: true
      }
    },
    grid: {
      show: false
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      labels: {
        
      }
    },
    tooltip: {
      x: {
        format: 'MM-yyyy',
      },
    },
  };

  // Prepare the series data
  const getSeriesData = (data) => data.map(item => {
    const seriesData = Object.entries(item)
      .filter(([key]) => key !== 'metric')
      .map(([key, value]) => {
        const [month, year] = key.split('-');
        // Create a Date object with year and month (months are 0-based in JavaScript)
        const date = new Date(year, month );
        // Get the time in milliseconds for the date
        const timeInMillis = date.getTime();
        // Return an array with the time in milliseconds and the parsed value
        return [timeInMillis, parseFloat(value.replace(/,/g, ''))];
      });
  
    return {
      name: item.metric,
      // Sort the series data based on the timestamp
      data: seriesData.sort((a, b) => a[0] - b[0]),
    };
  });
  
  
  const handleDateChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([start, end]);

      const filtered = data.map(item => {
        const filteredValues = Object.entries(item)
          .filter(([key]) => key !== 'metric')
          .filter(([key]) => {
            const [month, year] = key.split('-');
            const date = new Date(year, month - 1);
            const startDate = start.toDate();
            const endDate = end.toDate();
            const selectedStartDate = new Date(startDate.getFullYear(), startDate.getMonth());
            const selectedEndDate = new Date(endDate.getFullYear(), endDate.getMonth());
            return date >= selectedStartDate && date <= selectedEndDate;
          })
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        return { metric: item.metric, ...filteredValues };
      });

      setFilteredData(filtered);
    } else {
      setDateRange([null, null]);
      setFilteredData(data);
    }
  };
  console.log("filteredData",filteredData)
  const series = getSeriesData(filteredData);
  console.log("series",series)

  return (
    <div>
      <RangePicker 
        onChange={handleDateChange} 
        format="MM-YYYY" 
        picker="month" 
        value={dateRange} 
      />
      <Chart options={chartOptions} series={series} type="bar" height={350} />
    </div>
  );
};






function BalanceSheetSection({ numberOfMonths }) {
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
    const calculatedData = calculateCostData(
      costInputs,
      numberOfMonths,
      revenueData
    );
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
    const calculatedData = calculateLoanData(loanInputs, numberOfMonths);
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

  const warningMessages = cashEndBalances.reduce((acc, value, index) => {
    if (value < 0) {
      acc.push(
        `CF Operations of month ${
          index + 1
        } < 0. You need to more capital injection by increase beginning cash or fundraising.`
      );
    }
    return acc;
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (warningMessages.length > 0 && isMounted) {
      message.warning(warningMessages[0]);
    }
  }, [isMounted]);

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
  
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );
  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

// const realDate = [];

// for (let i = 0; i < numberOfMonths; i++) {
//     const monthIndex = (startingMonth + i - 1) % 12;
//     const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
//     const title = `${monthIndex + 1}/${year}`;
//     realDate.push(title);
// }
const realDate = Array.from({ length: numberOfMonths }, (_, i) => {
  const monthIndex = (startingMonth + i - 1) % 12;
  const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
  return `${monthIndex + 1}-${year}`;
});


console.log(realDate);
const BalenceSheetData = [
  // {
  //   key: "Assets",
  // },
  // {
  //   key: " Current Assets",
  // },
  // {
  //   key: "Cash",
  //   values: cashEndBalances, // Set values to zero
  // },
  // {
  //   key: "Accounts Receivable", // Added Accounts Receivable row
  //   values: new Array(numberOfMonths).fill(0), // Set values to zero
  // },
  // {
  //   key: "Inventory", // Added Inventory row
  //   values: new Array(numberOfMonths).fill(0), // Set values to zero
  // },
  // {
  //   key: "Current Assets", // Added Current Assets row
  //   values: currentAssets,
  // },
  // {
  //   key: "Long-Term Assets",
  // },
  // // insert BS Total investment here
  // { key: "Total Investment", values: totalAssetValue }, // New row for total investment

  // { key: "Total Accumulated Depreciation", values: bsTotalDepreciation },

  // {
  //   key: "Net Fixed Assets",
  //   values: bsTotalNetFixedAssets,
  // },

  // {
  //   key: "Long term assets",
  //   values: bsTotalNetFixedAssets,
  // },

  // {
  //   key: "Total Assets",
  //   values: totalAssets,
  // },

  // {
  //   key: "Liabilities & Equity",
  // },
  // {
  //   key: "Current Liabilities",
  // },
  // {
  //   key: "Account Payable", // Added Inventory row
  //   values: new Array(numberOfMonths).fill(0), // Set values to zero
  // },

  // {
  //   key: "Long-Term Liabilities",
  // },
  // {
  //   key: "Long term liabilities",
  //   values: bsTotalRemainingBalance, // New row for long term liabilities
  // },

  // {
  //   key: "Total Liabilities", // Added Inventory row
  //   values: totalLiabilities,
  // },

  // {
  //   key: "Shareholders Equity",
  // },
  // {
  //   key: "Paid in Capital",
  //   values: Array.from({ length: numberOfMonths }, (_, i) => {
  //     const currentValue = i === 0 ? startingPaidInCapital.toFixed(2) : "0";
  //     const currentValueFloat = parseFloat(currentValue);
  //     const capitalArrValue = capitalArr[i] || 0; // If capitalArr doesn't have value at index i, default to 0
  //     return (currentValueFloat + capitalArrValue).toFixed(2);
  //   }).map((value) => parseFloat(value)),
  // },
  // {
  //   key: "Common Stock", // Added Inventory row
  //   values: commonStockArr,
  // },
  // {
  //   key: "Preferred Stock", // Added Inventory row
  //   values: preferredStockArr,
  // },
  // {
  //   key: "Retain Earnings", // Added Inventory row
  //   values: netIncome,
  // },

  // // Calculated the accumulated retained earnings here

  // {
  //   key: "Accumulated Retain Earnings",
  //   values: accumulatedRetainEarnings,
  // },

  // {
  //   key: "Total Shareholders Equity",
  //   values: totalShareholdersEquity,
  // },

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
      [realDate[i]]: formatNumber(value?.toFixed(2)),
    }),
    {}
  ),
}));

console.log("BalenceSheetData",BalenceSheetData);

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
  // console.log("BLS", positionDataWithNetIncome2)
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
  // const { startMonth, startYear } = useSelector(
  //   (state) => state.durationSelect
  // );

  // const startingMonth = startMonth; // Tháng bắt đầu từ 1
  // const startingYear = startYear; // Năm bắt đầu từ 24

  const positionColumns1 = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      fixed: "left",

      render: (text, record) => ({
        children: (
          <div className={" md:whitespace-nowrap "}>
            <div
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
            </div>
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
        style: { borderRight: "1px solid #f0f0f0" },
        align: "right",
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
      };
    }),
  ];

  const [selectedChart, setSelectedChart] = useState("total-assets-chart"); // State để lưu trữ biểu đồ được chọn

  // Các useEffect và mã khác ở đây không thay đổi

  // Hàm xử lý sự kiện khi giá trị của dropdown thay đổi
  const handleChartSelect = (value) => {
    setSelectedChart(value);
  };

  const handleCutMonthChange = (e) => {
    dispatch(setCutMonth(Number(e.target.value)));
  };

  const divideMonthsIntoYearsForBalanceSheet = () => {
    const years = [];
    const startingMonthIndex = startMonth - 1;
    const startingYear = startYear;

    if (cutMonth > 0) {
      const firstYearMonths = Array.from({ length: cutMonth }, (_, i) => i + 1);
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

    const remainingMonthsAfterFirstYear = numberOfMonths - cutMonth;
    const fullYearsCount = Math.floor(remainingMonthsAfterFirstYear / 12);
    const remainingMonthsInLastYear = remainingMonthsAfterFirstYear % 12;

    for (let i = 0; i < fullYearsCount; i++) {
      const yearMonths = Array.from(
        { length: 12 },
        (_, idx) => idx + 1 + cutMonth + i * 12
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
        (_, idx) => idx + 1 + cutMonth + fullYearsCount * 12
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

  // Generate table columns including Year Total column for Balance Sheet
  const generateBalanceSheetTableColumns = (year) => [
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
      // Add any formatting if needed
    },
  ];

  const getDataSourceForYearBalanceSheet = (months) => {
    const monthKeys = months.map((month) => `Month ${month}`);

    return positionDataWithNetIncome2.map((data) => {
      const filteredData = monthKeys.reduce((acc, monthKey) => {
        acc[monthKey] = data[monthKey]; // keep original formatted value
        return acc;
      }, {});

      const yearTotal = monthKeys.reduce(
        (sum, key) =>
          sum + (data[key] ? parseFloat(data[key].replace(/,/g, "")) : 0),
        0
      );

      return {
        metric: data.metric,
        ...filteredData,
        yearTotal: formatNumber(yearTotal.toFixed(2)), // Adding Year Total to each row
      };
    });
  };

  const [activeTab, setActiveTab] = useState(0); // State to track active tab
  const { TabPane } = Tabs; // Destructure TabPane from Tabs
  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full xl:w-3/4 sm:p-4 p-0 ">
        <div className="">
          <div className=" gap-4 mb-3">
            <Select
              onValueChange={(value) => handleChartSelect(value)}
              value={selectedChart}
              className="border-solid border-[1px] border-gray-300 "
            >
              <SelectTrigger className="bg-white border-solid border-[1px] border-gray-300 w-full lg:w-[20%]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-assets-chart"
                >
                  Total Asset
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="cash-flow-chart"
                >
                  Cash
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-liabilities-chart"
                >
                  Total Liabilities
                </SelectItem>
                <SelectItem
                  className="hover:cursor-pointer"
                  value="total-shareholders-equity-chart"
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

          <h2 className="text-lg font-semibold my-8">Balance Sheet</h2>

          <Table
            className="overflow-auto my-8 rounded-md bg-white"
            size="small"
            dataSource={positionDataWithNetIncome2}
            columns={positionColumns1}
            pagination={false}
            bordered
          />

          <div className="w-full lg:w-[20%] md:w-[50%] my-5">
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
          <Tabs
            activeKey={activeTab.toString()}
            onChange={(key) => setActiveTab(parseInt(key))}
          >
            {divideMonthsIntoYearsForBalanceSheet().map((year, index) => (
              <TabPane tab={year.year} key={index.toString()}>
                <Table
                  className="bg-white overflow-auto my-8 rounded-md shadow-xl"
                  size="small"
                  dataSource={getDataSourceForYearBalanceSheet(year.months)}
                  columns={generateBalanceSheetTableColumns(year)}
                  pagination={false}
                />
              </TabPane>
            ))}
          </Tabs>
        </div>

        {/* <div>
      <h1>Balance Sheet Data</h1>
      <BalanceSheetChart data={BalenceSheetData} />
    </div> */}
      </div>

      <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden">
        <section className="mb-8 sticky top-8 bg-white">
          <GroqJS datasrc={positionDataWithNetIncome2} />
        </section>
      </div>

      <div className="xl:hidden block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
          }}
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal
          // title="Customer channel"
          open={isInputFormOpen}
          onCancel={() => {
            setIsInputFormOpen(false);
          }}
          cancelText="Close"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          okButtonProps={{
            style: {
              display: "none",
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          centered={true}
          zIndex={50}
        >
          <GroqJS datasrc={positionDataWithNetIncome2} />
        </Modal>
      )}
    </div>
  );
}

export default BalanceSheetSection;
