import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Table } from "antd";
import Chart from "react-apexcharts";

const Alpha = () => {
  const [selectedDuration, setSelectedDuration] = useState("3 years");
  const [customersPerMonth, setCustomersPerMonth] = useState(100);
  const [growthPerMonth, setGrowthPerMonth] = useState(10);
  const [duration, setDuration] = useState(3);
  const [price, setPrice] = useState(2);
  const [multiples, setMultiples] = useState(1);
  const [txFeePercentage, setTxFeePercentage] = useState("0");
  const [cogsPercentage, setCogsPercentage] = useState("0"); // New state for COGS
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [websiteCost, setWebsiteCost] = useState("50"); // New state for Website cost
  const [beginMonth, setBeginMonth] = useState(2); // New state for Begin Month
  const [endMonth, setEndMonth] = useState(10); // New state for End Month
  const [jobTitle, setJobTitle] = useState(""); // New state for Job Title
  const [salaryPerMonth, setSalaryPerMonth] = useState("0"); // New state for Salary/month
  const [numberOfHires, setNumberOfHires] = useState("0"); // New state for No. of hires
  const [jobBeginMonth, setJobBeginMonth] = useState(2); // New state for Job begin month
  const [jobEndMonth, setJobEndMonth] = useState(10); // New state for Job ending month
  const [assetCost, setAssetCost] = useState("1000");
  const [purchaseMonth, setPurchaseMonth] = useState("2");
  const [residualValue, setResidualValue] = useState("0");
  const [usefulLifetime, setUsefulLifetime] = useState("5");
  const [loanAmount, setLoanAmount] = useState("500");
  const [interestRate, setInterestRate] = useState("10");
  const [loanBeginMonth, setLoanBeginMonth] = useState("5");
  const [loanLength, setLoanLength] = useState("6");

  useEffect(() => {
    const calculateTableData = () => {
      const months = selectedDuration === "3 years" ? 36 : 60;
      const data = [];
      const revenueData = [];

      let currentCustomers = parseFloat(customersPerMonth);
      const monthlyDepreciation =
        (parseFloat(assetCost) - parseFloat(residualValue)) /
        parseFloat(usefulLifetime);
      let accumulatedDepreciation = 0;
      let bookValue = parseFloat(assetCost);
      let remainingLoanBalance = parseFloat(loanAmount);
      const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;

      for (let i = 1; i <= months; i++) {
        const revenue = currentCustomers * price * multiples;
        const txFeePercentageFloat = parseFloat(txFeePercentage) / 100;
        const cogsPercentageFloat = parseFloat(cogsPercentage) / 100; // Parse cogsPercentage as a float
        const websiteCostFloat =
          i >= beginMonth && i <= endMonth ? parseFloat(websiteCost) : 0; // Check if i is within the specified range

        const txFee = revenue * txFeePercentageFloat;
        const cogs = revenue * cogsPercentageFloat; // Calculate COGS as a percentage of revenue
        const netRevenue = revenue - txFee;
        const grossProfit = netRevenue - cogs; // Calculate Gross Profit
        const salaryExpense =
          i >= jobBeginMonth && i <= jobEndMonth
            ? parseFloat(salaryPerMonth) * parseFloat(numberOfHires)
            : 0; // Calculate Salary Expense

        let depreciation = 0;
        if (
          i >= parseInt(purchaseMonth) &&
          i < parseInt(purchaseMonth) + parseFloat(usefulLifetime)
        ) {
          depreciation = monthlyDepreciation;
          accumulatedDepreciation += depreciation;
        }

        if (i >= parseInt(purchaseMonth)) {
          bookValue = parseFloat(assetCost) - accumulatedDepreciation; // Update book value starting at purchase month
        } else {
          bookValue = parseFloat(assetCost); // Before purchase month, book value remains as the asset cost
        }
        let interestPayment = 0;
        let principalPayment = 0;

        let loanBalanceDisplay = "-";
        if (
          i >= parseInt(loanBeginMonth) &&
          i < parseInt(loanBeginMonth) + parseInt(loanLength)
        ) {
          principalPayment = parseFloat(loanAmount) / parseInt(loanLength);
          interestPayment = remainingLoanBalance * monthlyInterestRate;
          remainingLoanBalance -= principalPayment;
          loanBalanceDisplay = remainingLoanBalance.toFixed(2);
        }

        data.push({
          month: i,
          customers: currentCustomers.toFixed(0),
          revenue: revenue.toFixed(0),
          txFee: txFee.toFixed(0),
          netRevenue: netRevenue.toFixed(0),
          cogs: cogs.toFixed(0), // Add COGS to the data
          grossProfit: grossProfit.toFixed(0), // Add Gross Profit to the data
          "Website cost":
            i >= beginMonth && i <= endMonth ? websiteCostFloat : 0, // Add Website cost column with conditions
          "Salary Expense": salaryExpense, // Add Salary Expense to the data
          depreciation: depreciation.toFixed(2),
          accumulatedDepreciation: accumulatedDepreciation.toFixed(2),
          bookValue: bookValue.toFixed(2),
          loanAmount:
            i === parseInt(loanBeginMonth)
              ? parseFloat(loanAmount).toFixed(2)
              : "-",
          principalPayment: principalPayment.toFixed(2),

          interestPayment: interestPayment.toFixed(2),
          loanBalance: loanBalanceDisplay,
        });

        revenueData.push(revenue);
        currentCustomers *= 1 + growthPerMonth / 100;
      }

      setTableData(data);
      setRevenueChartData(revenueData);
    };

    calculateTableData();
  }, [
    selectedDuration,
    customersPerMonth,
    growthPerMonth,
    price,
    multiples,
    txFeePercentage,
    cogsPercentage,
    websiteCost,
    beginMonth,
    endMonth,
    salaryPerMonth,
    numberOfHires,
    jobBeginMonth,
    jobEndMonth,
    assetCost,
    purchaseMonth,
    residualValue,
    usefulLifetime,
    loanAmount,
    interestRate,
    loanBeginMonth,
    loanLength,
  ]);

  useEffect(() => {
    const chartData = tableData.map((item) => item.customers);
    setChartData(chartData);
  }, [tableData]);

  const dataSource = [
    {
      key: "customers",
      month: "Customer",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.customers;
        return acc;
      }, {}),
    },
    {
      key: "revenue",
      month: "Revenue",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.revenue;
        return acc;
      }, {}),
    },
    {
      key: "txFee",
      month: "Tx fee",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.txFee;
        return acc;
      }, {}),
    },
    {
      key: "cogs", // Add COGS row
      month: "COGS",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.cogs;
        return acc;
      }, {}),
    },
    {
      key: "grossProfit", // Add Gross Profit row
      month: "Gross Profit",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.grossProfit;
        return acc;
      }, {}),
    },
    {
      key: "websiteCost", // Add Website Cost row
      month: "Website Cost",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data["Website cost"];
        return acc;
      }, {}),
    },
    {
      key: "salaryExpense", // Add Salary Expense row
      month: "Salary Expense",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data["Salary Expense"];
        return acc;
      }, {}),
    },
    {
      key: "assetCost",
      month: "Asset Cost",
      ...tableData.reduce((acc, data) => {
        // Display the asset cost only in the purchase month
        acc[data.month] =
          data.month === parseInt(purchaseMonth)
            ? parseFloat(assetCost).toFixed(2)
            : "-";
        return acc;
      }, {}),
    },
    {
      key: "depreciation",
      month: "Depreciation",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.depreciation;
        return acc;
      }, {}),
    },
    {
      key: "accumulatedDepreciation",
      month: "Accumulated Depreciation",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.accumulatedDepreciation;
        return acc;
      }, {}),
    },
    {
      key: "bookValue",
      month: "Book Value",
      ...tableData.reduce((acc, data) => {
        // Display the book value only from the purchase month to the end of useful life
        if (
          data.month >= parseInt(purchaseMonth) &&
          data.month < parseInt(purchaseMonth) + parseFloat(usefulLifetime)
        ) {
          acc[data.month] = data.bookValue;
        } else {
          acc[data.month] = "-";
        }
        return acc;
      }, {}),
    },
    {
      key: "loanAmount",
      month: "Loan Amount",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.loanAmount;
        return acc;
      }, {}),
    },
    {
      key: "interestPayment",
      month: "Interest Payment",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.interestPayment;
        return acc;
      }, {}),
    },
    {
      key: "principalPayment",
      month: "Principal Payment",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.principalPayment;
        return acc;
      }, {}),
    },
    {
      key: "loanBalance",
      month: "Loan Balance",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data.loanBalance;
        return acc;
      }, {}),
    },
  ];

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    ...tableData.map((data) => ({
      title: `${data.month}`,
      dataIndex: data.month,
      key: `month_${data.month}`,
    })),
  ];

  const filteredColumns = columns.filter((col) => col.key !== "revenue");

  const chartOptions = {
    chart: {
      type: "area",
    },
    xaxis: {
      categories: tableData.map((item) => item.month),
    },
    yaxis: {
      title: {
        text: "Customers",
      },
    },
  };

  const revenueChartOptions = {
    chart: {
      type: "line",
    },
    xaxis: {
      categories: tableData.map((item) => item.month),
    },
    yaxis: {
      title: {
        text: "Revenue",
      },
    },
  };

  return (
    <div className="mx-auto" style={{ width: "80%" }}>
      <div className="max-w-md mx-auto">
        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Customer
          </h2>
          <div className="bg-white rounded-md shadow p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Duration</span>
              <Select onValueChange={(value) => setSelectedDuration(value)}>
                <SelectTrigger id="start-date-year">
                  <SelectValue placeholder="3 years" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Customer per Month</span>
              <Input
                className="col-start-2"
                placeholder="950"
                value={customersPerMonth}
                onChange={(e) => setCustomersPerMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Growth per Month</span>
              <Input
                className="col-start-2"
                placeholder="5.00 %"
                value={growthPerMonth}
                onChange={(e) => setGrowthPerMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Price</span>
              <Input
                className="col-start-2"
                placeholder="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Multiples</span>
              <Input
                className="col-start-2"
                placeholder="2"
                value={multiples}
                onChange={(e) => setMultiples(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Tx Fee (%)</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={txFeePercentage}
                onChange={(e) => setTxFeePercentage(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">COGS (%)</span>
              <Input
                className="col-start-2"
                placeholder="0" // Initial placeholder value
                value={cogsPercentage}
                onChange={(e) => setCogsPercentage(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Website Cost</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={websiteCost}
                onChange={(e) => setWebsiteCost(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Begin Month</span>
              <Input
                className="col-start-2"
                placeholder="2"
                value={beginMonth}
                onChange={(e) => setBeginMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">End Month</span>
              <Input
                className="col-start-2"
                placeholder="10"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Job Title</span>
              <Input
                className="col-start-2"
                placeholder="Enter Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Salary/month</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={salaryPerMonth}
                onChange={(e) => setSalaryPerMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">No. of hires</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={numberOfHires}
                onChange={(e) => setNumberOfHires(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Job begin month</span>
              <Input
                className="col-start-2"
                placeholder="2"
                value={jobBeginMonth}
                onChange={(e) => setJobBeginMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Job ending month</span>
              <Input
                className="col-start-2"
                placeholder="10"
                value={jobEndMonth}
                onChange={(e) => setJobEndMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Asset Cost</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={assetCost}
                onChange={(e) => setAssetCost(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Purchase Month</span>
              <Input
                className="col-start-2"
                placeholder="1"
                value={purchaseMonth}
                onChange={(e) => setPurchaseMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Residual Ending Value</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={residualValue}
                onChange={(e) => setResidualValue(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Useful Lifetime (Months)</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={usefulLifetime}
                onChange={(e) => setUsefulLifetime(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Loan Amount</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Interest Rate (%)</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Month Begin Loan</span>
              <Input
                className="col-start-2"
                placeholder="1"
                value={loanBeginMonth}
                onChange={(e) => setLoanBeginMonth(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Loan Length (Months)</span>
              <Input
                className="col-start-2"
                placeholder="0"
                value={loanLength}
                onChange={(e) => setLoanLength(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="chart-heading"
      >
        Table
      </h2>
      <div className="w-full overflow-auto mx-auto">
        <Table
          dataSource={dataSource}
          columns={filteredColumns}
          pagination={false}
        />
      </div>

      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="chart-heading"
      >
        Customer Chart
      </h2>

      <div className="w-full mx-auto">
        <Chart
          options={chartOptions}
          series={[{ name: "Customers", data: chartData }]}
          type="bar"
          height={300}
        />
      </div>

      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="chart-heading"
      >
        Revenue Chart
      </h2>

      <div className="w-full mx-auto">
        <Chart
          options={revenueChartOptions}
          series={[{ name: "Revenue", data: revenueChartData }]}
          type="area"
          height={300}
        />
      </div>
    </div>
  );
};

const X = () => {
  return (
    <div>
      <Alpha />
    </div>
  );
};

export default X;
