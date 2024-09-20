import React, { useEffect, useState } from "react";

import { Card, Checkbox, Modal } from "antd";

import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateCostData,
  formatNumber,
  parseNumber,
  setCostData,
} from "../../../features/CostSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { calculateProfitAndLoss } from "../../../features/ProfitAndLossSlice";
import {
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";
import {
  calculateLoanData,
  setLoanData,
  setLoanTableData,
  transformLoanDataForTable,
} from "../../../features/LoanSlice";
import {
  calculateInvestmentData,
  setInvestmentData,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";
import {
  calculatePersonnelCostData,
  setPersonnelCostData,
} from "../../../features/PersonnelSlice";
import {
  calculateChannelRevenue,
  setCogsData,
  setRevenueData,
  setRevenueDeductionData,
} from "../../../features/SaleSlice";
import CustomChart from "./CustomChart";
import { getCurrencyLabelByKey } from "../../../features/DurationSlice";
import { FullscreenOutlined } from "@ant-design/icons";
import {
  Card as CardShadcn,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import ReusableChart from "./ReusableChart";
import {
  Search,
  MessageSquare,
  PhoneCall,
  Mail,
  Globe,
  CalendarIcon,
  Users,
  Clock,
  ThumbsUp,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";

const AllChartSections = ({
  yearlyAverageCustomers,
  customerGrowthChart,
  yearlySales,
  revenue,
  numberOfMonths,
}) => {
  function sumArray(arr) {
    return arr.reduce((total, num) => total + Number(num), 0);
  }

  const [selectedChart, setSelectedChart] = useState("total-revenue-chart"); // State để lưu trữ biểu đồ được chọn
  // Tính toán
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

  const {
    incomeTax: incomeTaxRate,
    startingCashBalance,
    startMonth,
    startYear,
  } = useSelector((state) => state.durationSelect);

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
    totalRevenue,
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
  const currentAssets = cashEndBalances.map((cashEnd, index) => {
    const accountsReceivable = 0; // Placeholder value
    const inventory = 0; // Placeholder value
    return cashEnd + accountsReceivable + inventory; // Calculate Current Assets
  });

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

  const totalAssets = currentAssets.map(
    (currentAsset, index) => currentAsset + bsTotalNetFixedAssets[index]
  );

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

  // Hàm xử lý sự kiện khi giá trị của dropdown thay đổi
  const handleChartSelect = (value) => {
    setSelectedChart(value);
  };

  const { currency } = useSelector((state) => state.durationSelect);
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

  const bsTotalInvestmentArray = investmentTableData?.find(
    (item) => item.key === "BS Total investment"
  );
  const bsTotalInvestmentValues = bsTotalInvestmentArray
    ? Object.values(bsTotalInvestmentArray)
        .slice(2)
        .map((value) => parseFloat(value.replace(",", "")))
    : [];

  const seriesData = calculateLoanData(loanInputs, numberOfMonths).map(
    (loan) => {
      // Khởi tạo mảng dữ liệu rỗng với giá trị là 0 cho mỗi tháng
      const data = Array(numberOfMonths).fill(0);
      const dataPayment = Array(numberOfMonths).fill(0);
      const dataPrincipal = Array(numberOfMonths).fill(0);
      const dataInterest = Array(numberOfMonths).fill(0);
      const dataRemainingBalance = Array(numberOfMonths).fill(0);

      // Cập nhật mảng dữ liệu với thông tin thực tế từ loanDataPerMonth
      loan?.loanDataPerMonth.forEach((monthData, index) => {
        data[index] = monthData.balance;
        dataPayment[index] = monthData.payment;
        dataPrincipal[index] = monthData.principal;
        dataInterest[index] = monthData.interest;
        dataRemainingBalance[index] = monthData.balance;
      });

      return {
        name: loan.loanName,
        data,
        dataPayment,
        dataPrincipal,
        dataInterest,
        dataRemainingBalance,
      };
    }
  );

  const totalLoanData = seriesData.reduce((acc, channel) => {
    channel.data.forEach((amount, index) => {
      acc[index] = (acc[index] || 0) + amount;
    });
    return acc;
  }, Array(numberOfMonths).fill(0));

  const totalFunding = fundraisingTableData.find(
    (item) => item.key === "Total funding"
  );

  const bsTotalFundingValues = totalFunding
    ? Object.values(totalFunding)
        .slice(2)
        .map((value) => parseNumber(value))
    : [];

  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [isChartModalVisibleVer2, setIsChartModalVisibleVer2] = useState(false); // New state for chart modal visibility
  const [selectedZoomChart, setSelectedZoomChart] = useState(null); // New state for selected chart
  const [selectedZoomChartVer2, setSelectedZoomChartVer2] = useState(null); // New state for selected chart
  const [chartType, setChartType] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedZoomChart(chart);
    setIsChartModalVisible(true);
  };
  const handleChartClickVer2 = (chart) => {
    setSelectedZoomChartVer2(chart);
    setIsChartModalVisibleVer2(true);
  };

  // useEffect(() => {
  //   setSelectedZoomChart(customerGrowthChart);
  //   setIsChartModalVisible(true);
  //   setTimeout(() => {
  //     setIsChartModalVisible(false);
  //   }, 100);
  // }, []);
  const [visibleMetrics, setVisibleMetrics] = useState({
    existingCustomers: false,
    numberOfChannels: false,
    previousMonthUsers: false,
    addedUsers: false,
    churnedUsers: false,
    totalUsers: false,
    customerSatisfaction: false,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const metrics = [
    {
      key: "existingCustomers",
      title: "Existing Customers",
      value: "1,234",
      change: "+10%",
      icon: Users,
    },
    {
      key: "numberOfChannels",
      title: "Number of Channels",
      value: "5",
      change: "+1",
      icon: MessageSquare,
    },
    {
      key: "previousMonthUsers",
      title: "Previous month users",
      value: "10,987",
      change: "-",
      icon: Users,
    },
    {
      key: "addedUsers",
      title: "Added Users",
      value: "1,345",
      change: "+22%",
      icon: UserPlus,
    },
    {
      key: "churnedUsers",
      title: "No. of User Churned",
      value: "201",
      change: "-5%",
      icon: UserMinus,
    },
    {
      key: "totalUsers",
      title: "No. of Users",
      value: "12,131",
      change: "+11%",
      icon: Users,
    },
    {
      key: "customerSatisfaction",
      title: "Customer Satisfaction",
      value: "92%",
      change: "+3%",
      icon: ThumbsUp,
    },
  ];

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);
  return (
    <>
      <section className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
          <h2 className="text-lg font-semibold">I. Metrics</h2>
          <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col">
            {/* Bộ chọn khoảng thời gian */}

            <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
              <div className="min-w-[10vw] w-full flex flex-row sm:!mr-0 !mr-1">
                <label
                  htmlFor="startMonthSelect"
                  className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                >
                  From:
                </label>
                <Select
                  value={chartStartMonth}
                  onValueChange={(value) => {
                    setChartStartMonth(
                      Math.max(1, Math.min(value, chartEndMonth))
                    );
                  }}
                >
                  <SelectTrigger className="w-full sm:!justify-between !justify-center">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startMonth + i - 1) % 12;
                      const year =
                        startYear + Math.floor((startMonth + i - 1) / 12);
                      return (
                        <SelectItem key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[10vw] w-full flex flex-row sm:!ml-0 !ml-1">
                <label
                  htmlFor="endMonthSelect"
                  className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                >
                  To:
                </label>
                <Select
                  value={chartEndMonth}
                  onValueChange={(value) => {
                    setChartEndMonth(
                      Math.max(chartStartMonth, Math.min(value, numberOfMonths))
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startMonth + i - 1) % 12;
                      const year =
                        startYear + Math.floor((startMonth + i - 1) / 12);
                      return (
                        <SelectItem key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Popover để chọn metrics hiển thị */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  Options
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="bg-white right-0 left-auto"
                align="end"
              >
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none">Visible Metrics</h4>
                  {metrics.map((metric) => (
                    <div
                      key={metric.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={metric.key}
                        checked={visibleMetrics[metric.key]}
                        onChange={() => toggleMetric(metric.key)}
                      />
                      <label
                        htmlFor={metric.key}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {metric.title}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Hiển thị các metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(
            (metric) =>
              visibleMetrics[metric.key] && (
                <CardShadcn key={metric.key}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.change} from last period
                    </p>
                  </CardContent>
                </CardShadcn>
              )
          )}
        </div>
      </section>
      <h2
        className="text-lg font-semibold flex items-center mb-8"
        id="duration-heading"
      >
        II. Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReusableChart
          title="Total User"
          description="Customers by channel"
          series={customerGrowthChart.series}
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          charttype="area"
          footerText=""
          footerSubText=""
        />

        <ReusableChart
          title="Total Revenue"
          description="Revenue by channel"
          series={revenue.series}
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          charttype="area"
          footerText=""
          footerSubText=""
        />

        <ReusableChart
          title="Operating Cost"
          description="Total Cost"
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          series={[{ data: totalCosts, name: "Total" }]} // Replace 'revenue.series' with appropriate data structure
          charttype="area"
          footerText=""
          footerSubText=""
        />

        <ReusableChart
          title="Personnel"
          description="Total Personnel"
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          series={[{ data: totalPersonnelCosts, name: "Total" }]} // Replace 'revenue.series' with appropriate data structure
          charttype="area"
          footerText=""
          footerSubText=""
        />

        <ReusableChart
          title="CapEx"
          description="Total Capital Expenditures"
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          series={[{ data: bsTotalInvestmentValues, name: "Total" }]} // Replace 'revenue.series' with appropriate data structure
          charttype="area"
          footerText=""
          footerSubText=""
        />

        <ReusableChart
          title="Loans"
          description="Total Loan"
          categories={Array.from({ length: numberOfMonths }, (_, i) => {
            const monthIndex = (startMonth + i - 1) % 12;
            const year = startYear + Math.floor((startMonth + i - 1) / 12);
            return `${months[monthIndex]}/${year}`;
          })}
          series={[{ data: totalLoanData, name: "Total" }]} // Replace 'revenue.series' with appropriate data structure
          charttype="area"
          footerText=""
          footerSubText=""
        />
      </div>

      {/* Các biểu đồ */}

      <div>
        <h3 className="text-lg font-semibold mb-4 mt-8">III. Relevant Chart</h3>
        <div className=" gap-4 mb-3">
          <Select
            onValueChange={(value) => handleChartSelect(value)}
            value={selectedChart}
            className="border-solid border-[1px] border-gray-200 bg-white"
          >
            <SelectTrigger className="bg-white border-solid border-[1px] border-gray-200 md:w-[20%] w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper" className="bg-white">
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
              <SelectItem
                value="cash-flow-chart"
                className="hover:cursor-pointer"
              >
                Cash Flow
              </SelectItem>
              <SelectItem
                value="cash-begin-balances-chart"
                className="hover:cursor-pointer"
              >
                Cash Begin
              </SelectItem>
              <SelectItem
                value="cash-end-balances-chart"
                className="hover:cursor-pointer"
              >
                Cash End
              </SelectItem>
              <SelectItem
                value="total-principal-chart"
                className="hover:cursor-pointer"
              >
                Total principal
              </SelectItem>
              <SelectItem
                value="total-assets-chart"
                className="hover:cursor-pointer"
              >
                Total Asset
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

        {/* Sử dụng selectedChart để render biểu đồ tương ứng */}
        {selectedChart === "total-revenue-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
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
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths={numberOfMonths}
            id="total-interest-payments-chart"
            yaxisTitle="TotalInterest Payments ($)"
            seriesTitle="Total Interest Payments"
            RenderData={totalInterestPayments}
            title="Total Interest Payments Over Time"
          />
        )}
        {selectedChart === "cash-flow-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="cash-flow-chart"
            yaxisTitle="Cash Flow ($)"
            seriesTitle="Net Cash Change"
            RenderData={netCashChanges}
            title="Cash Flow Overview"
          />
        )}

        {selectedChart === "total-principal-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="total-principal-chart"
            yaxisTitle="Total Principal ($)"
            seriesTitle="Total Principal"
            RenderData={totalPrincipal}
            title="Total Principal Over Time"
          />
        )}

        {selectedChart === "cash-begin-balances-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="cash-begin-balances-chart"
            yaxisTitle="Cash Begin Balances ($)"
            seriesTitle="Cash Begin"
            RenderData={cashBeginBalances}
            title="Cash Begin Balances Over Time"
          />
        )}

        {selectedChart === "cash-end-balances-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="cash-end-balances-chart"
            yaxisTitle="Cash End Balances ($)"
            seriesTitle="Cash End"
            RenderData={cashEndBalances}
            title="Cash End Balances Over Time"
          />
        )}

        {selectedChart === "total-assets-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="total-assets-chart"
            yaxisTitle="Total Assets ($)"
            seriesTitle="Total Assets"
            RenderData={totalAssets}
            title="Total Assets Over Time"
          />
        )}
        {selectedChart === "total-liabilities-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="total-liabilities-chart"
            yaxisTitle="Total Liabilities ($)"
            seriesTitle="Total Liabilities"
            RenderData={totalLiabilities}
            title="Total Liabilities Over Time"
          />
        )}
        {selectedChart === "total-shareholders-equity-chart" && (
          <CustomChart
            chartStartMonth={chartStartMonth}
            chartEndMonth={chartEndMonth}
            numberOfMonths
            id="total-shareholders-equity-chart"
            yaxisTitle="Total Shareholders Equity ($)"
            seriesTitle="Total Shareholders Equity"
            RenderData={totalShareholdersEquity}
            title="Total Shareholders Equity Over Time"
          />
        )}
      </div>
    </>
  );
};

export default AllChartSections;
