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

  const [tableData, setTableData] = useState([
    {
      month: "",
      customers: "",
      revenue: "",
      txFee: "",
      netRevenue: "",
      cogs: "", // Add COGS to the data
      grossProfit: "", // Add Gross Profit to the data
      "Cost value": "", // Add Cost value column with conditions
      "Salary Expense": "", // Add Salary Expense to the data
      depreciation: "",
      accumulatedDepreciation: "",
      bookValue: "",
      loanAmount: "",
      principalPayment: "",

      interestPayment: "",
      loanBalance: "",
    },
  ]);
  const [chartData, setChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);

  // ... other similar states for different sections ...
  const [customerInputs, setCustomerInputs] = useState([
    { channelName: "Online", customersPerMonth: 100, growthPerMonth: 10 },
  ]);

  const addNewCustomerInput = () => {
    setCustomerInputs([
      ...customerInputs,
      { customersPerMonth: 0, growthPerMonth: 0, channelName: "" },
    ]);
  };

  const removeCustomerInput = (index) => {
    const newInputs = [...customerInputs];
    newInputs.splice(index, 1);
    setCustomerInputs(newInputs);
  };

  const handleCustomerInputChange = (index, field, value) => {
    const newInputs = [...customerInputs];
    newInputs[index][field] = value;
    setCustomerInputs(newInputs);
  };

  const [channelInputs, setChannelInputs] = useState([
    {
      price: 100,
      multiples: 2,
      txFeePercentage: 10,
      cogsPercentage: 30,
      selectedChannel: customerInputs[0].channelName, // Initialize with null or another default value
    },
  ]);

  const addNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      { price: "0", multiples: "0", txFeePercentage: "0", selectedChannel: "" },
    ]);
  };

  const removeChannelInput = (index) => {
    const newInputs = [...channelInputs];
    newInputs.splice(index, 1);
    setChannelInputs(newInputs);
  };

  const handleChannelInputChange = (index, field, value) => {
    const newInputs = [...channelInputs];
    newInputs[index][field] = value;
    setChannelInputs(newInputs);
  };

  const [costInputs, setCostInputs] = useState([
    {
      costName: "", // Initialize with an empty string or default value
      costValue: 0, // Initialize with a default value
      beginMonth: 1,
      endMonth: 10,
    },
  ]);
  const handleCostInputChange = (index, field, value) => {
    const newInputs = [...costInputs];
    newInputs[index][field] = value;
    setCostInputs(newInputs);
  };

  const addNewCostInput = () => {
    setCostInputs([
      ...costInputs,
      {
        costName: "", // Initialize with an empty string
        costValue: 0, // Initialize with a default value
        beginMonth: 1, // Set default or desired value
        endMonth: 10, // Set default or desired value
      },
    ]);
  };

  const removeCostInput = (index) => {
    const newInputs = [...costInputs];
    newInputs.splice(index, 1);
    setCostInputs(newInputs);
  };

  const [personnelInputs, setPersonnelInputs] = useState([
    {
      jobTitle: "",
      salaryPerMonth: 0,
      numberOfHires: 0,
      jobBeginMonth: 1,
      jobEndMonth: 8,
    },
  ]);

  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 0,
        jobBeginMonth: 1,
        jobEndMonth: 10,
      },
    ]);
  };

  const handlePersonnelInputChange = (index, field, value) => {
    const newInputs = [...personnelInputs];
    newInputs[index][field] = value;
    setPersonnelInputs(newInputs);
  };

  const removePersonnelInput = (index) => {
    const newInputs = [...personnelInputs];
    newInputs.splice(index, 1);
    setPersonnelInputs(newInputs);
  };

  const [investmentInputs, setInvestmentInputs] = useState([
    {
      purchaseName: "",
      assetCost: 1000,
      purchaseMonth: 2,
      residualValue: 10,
      usefulLifetime: 5,
    },
  ]);

  const handleInvestmentInputChange = (index, field, value) => {
    const newInputs = [...investmentInputs];
    newInputs[index][field] = value;
    setInvestmentInputs(newInputs);
  };

  // Function to add a new investment input
  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: 0,
        purchaseMonth: 2,
        residualValue: 0,
        usefulLifetime: 0,
      },
    ]);
  };

  // Function to remove an investment input
  const removeInvestmentInput = (index) => {
    const newInputs = [...investmentInputs];
    newInputs.splice(index, 1);
    setInvestmentInputs(newInputs);
  };

  const [loanInputs, setLoanInputs] = useState([
    {
      loanAmount: 500,
      interestRate: 10,
      loanBeginMonth: 1,
      loanLength: 6,
    },
  ]);

  const handleLoanInputChange = (index, field, value) => {
    const newInputs = [...loanInputs];
    newInputs[index][field] = value;
    setLoanInputs(newInputs);
  };

  // Function to add a new loan input
  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanAmount: "0",
        interestRate: "0",
        loanBeginMonth: "",
        loanLength: "0",
      },
    ]);
  };

  // Function to remove a loan input
  const removeLoanInput = (index) => {
    const newInputs = [...loanInputs];
    newInputs.splice(index, 1);
    setLoanInputs(newInputs);
  };

  useEffect(() => {
    const calculateTableData = () => {
      const months = selectedDuration === "3 years" ? 36 : 60;
      let data = [];

      for (let i = 1; i <= months; i++) {
        let monthData = {
          month: i.toString(),
          customers: 0,
          revenue: 0,
          txFee: 0,
          netRevenue: 0,
          cogs: 0,
          grossProfit: 0,
          "Cost value": 0,
          "Salary Expense": 0,
          depreciation: 0,
          accumulatedDepreciation: 0,
          bookValue: 0,
          loanAmount: 0,
          principalPayment: 0,
          interestPayment: 0,
          loanBalance: 0,
        };

        // Calculate values for each customer channel
        customerInputs.forEach((customer) => {
          let currentCustomers =
            customer.customersPerMonth *
            Math.pow(1 + customer.growthPerMonth / 100, i - 1);
          let channel = channelInputs.find(
            (channel) => channel.selectedChannel === customer.channelName
          );
          if (channel) {
            let revenue = currentCustomers * channel.price * channel.multiples;
            let txFee = (revenue * channel.txFeePercentage) / 100;
            let cogs = (revenue * channel.cogsPercentage) / 100;
            let netRevenue = revenue - txFee;
            let grossProfit = netRevenue - cogs;

            monthData.customers += currentCustomers;
            monthData.revenue += revenue;
            monthData.txFee += txFee;
            monthData.netRevenue += netRevenue;
            monthData.cogs += cogs;
            monthData.grossProfit += grossProfit;
          }
        });

        // Calculate values for costs
        costInputs.forEach((cost) => {
          if (i >= cost.beginMonth && i <= cost.endMonth) {
            monthData["Cost value"] += cost.costValue;
          }
        });

        // Calculate values for personnel
        personnelInputs.forEach((personnel) => {
          if (i >= personnel.jobBeginMonth && i <= personnel.jobEndMonth) {
            monthData["Salary Expense"] +=
              personnel.salaryPerMonth * personnel.numberOfHires;
          }
        });

        // Calculation for investmentInputs
        investmentInputs.forEach((investment) => {
          if (i === investment.purchaseMonth) {
            monthData.depreciation =
              (investment.assetCost - investment.residualValue) /
              investment.usefulLifetime;
            monthData.accumulatedDepreciation += monthData.depreciation;
            monthData.bookValue =
              investment.assetCost - monthData.accumulatedDepreciation;
          } else if (
            i > investment.purchaseMonth &&
            i <= investment.purchaseMonth + investment.usefulLifetime
          ) {
            monthData.depreciation =
              (investment.assetCost - investment.residualValue) /
              investment.usefulLifetime;
            monthData.accumulatedDepreciation += monthData.depreciation;
            monthData.bookValue -= monthData.depreciation;
          }
        });

        // Calculation for loanInputs
        loanInputs.forEach((loan) => {
          if (
            i >= parseInt(loan.loanBeginMonth) &&
            i < parseInt(loan.loanBeginMonth) + parseInt(loan.loanLength)
          ) {
            monthData.loanAmount = parseInt(loan.loanAmount);
            let monthlyInterestRate = parseFloat(loan.interestRate) / 100 / 12;
            let monthlyPrincipal =
              monthData.loanAmount / parseInt(loan.loanLength);
            monthData.interestPayment =
              monthData.loanAmount * monthlyInterestRate;
            monthData.principalPayment = monthlyPrincipal;
            monthData.loanBalance =
              monthData.loanAmount -
              monthlyPrincipal * (i - parseInt(loan.loanBeginMonth) + 1);
          }
        });

        // Add the month data to the table data array
        data.push(monthData);
      }

      setTableData(data);
    };

    calculateTableData();
  }, [
    customerInputs,
    channelInputs,
    investmentInputs,
    loanInputs,
    selectedDuration,
    personnelInputs,
    costInputs,
  ]);

  useEffect(() => {
    const chartData = tableData.map((item) => item.customers);
    setChartData(chartData);
  }, [tableData]);
  console.log("tableData", tableData);

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
      key: "CostValue", // Add Cost value row
      month: "Cost value",
      ...tableData.reduce((acc, data) => {
        acc[data.month] = data["Cost value"];
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
    // {
    //   key: "assetCost",
    //   month: "Asset Cost",
    //   ...tableData.reduce((acc, data) => {
    //     // Display the asset cost only in the purchase month
    //     acc[data.month] =
    //       data.month === parseInt(purchaseMonth)
    //         ? parseFloat(assetCost).toFixed(2)
    //         : "-";
    //     return acc;
    //   }, {}),
    // },
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
    // {
    //   key: "bookValue",
    //   month: "Book Value",
    //   ...tableData.reduce((acc, data) => {
    //     // Display the book value only from the purchase month to the end of useful life
    //     if (
    //       data.month >= parseInt(purchaseMonth) &&
    //       data.month < parseInt(purchaseMonth) + parseFloat(usefulLifetime)
    //     ) {
    //       acc[data.month] = data.bookValue;
    //     } else {
    //       acc[data.month] = "-";
    //     }
    //     return acc;
    //   }, {}),
    // },
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
            Basic Info
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
          </div>
        </section>

        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Customer
          </h2>
          {customerInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Customer per Month</span>
                <Input
                  className="col-start-2"
                  value={input.customersPerMonth}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "customersPerMonth",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Growth per Month</span>
                <Input
                  className="col-start-2"
                  value={input.growthPerMonth}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "growthPerMonth",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Channel Name</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Channel Name"
                  value={input.channelName}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "channelName",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeCustomerInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewCustomerInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Sales channel
          </h2>
          {channelInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Price</span>
                <Input
                  className="col-start-2"
                  placeholder="100"
                  value={input.price}
                  onChange={(e) =>
                    handleChannelInputChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Multiples</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.multiples}
                  onChange={(e) =>
                    handleChannelInputChange(index, "multiples", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Tx Fee (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.txFeePercentage}
                  onChange={(e) =>
                    handleChannelInputChange(
                      index,
                      "txFeePercentage",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">COGS (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.cogsPercentage}
                  onChange={(e) =>
                    handleChannelInputChange(
                      index,
                      "cogsPercentage",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Sales Channel</span>
                <Select
                  onValueChange={(value) => {
                    const newInputs = [...channelInputs];
                    newInputs[index].selectedChannel = value;
                    setChannelInputs(newInputs);
                  }}
                  value={
                    input.selectedChannel !== null ? input.selectedChannel : ""
                  }
                >
                  <SelectTrigger id={`select-channel-${index}`}>
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {customerInputs
                      .filter(
                        (input) =>
                          input.channelName && input.channelName.trim() !== ""
                      )
                      .map((input, index) => (
                        <SelectItem key={index} value={input.channelName}>
                          {input.channelName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeChannelInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewChannelInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="costs-heading"
          >
            Costs
          </h2>
          {costInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Cost name</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Cost Name"
                  value={input.costName}
                  onChange={(e) =>
                    handleCostInputChange(index, "costName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Cost Value</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.costValue}
                  onChange={(e) =>
                    handleCostInputChange(index, "costValue", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Begin Month</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.beginMonth}
                  onChange={(e) =>
                    handleCostInputChange(index, "beginMonth", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">End Month</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.endMonth}
                  onChange={(e) =>
                    handleCostInputChange(index, "endMonth", e.target.value)
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeCostInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewCostInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="personnel-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="personnel-heading"
          >
            Personnel
          </h2>
          {personnelInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Job Title</span>
                <Input
                  className="col-start-2"
                  placeholder="CFO"
                  value={input.jobTitle}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "jobTitle",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Salary/month</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.salaryPerMonth}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "salaryPerMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">No. of hires</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.numberOfHires}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "numberOfHires",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Job begin month</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.jobBeginMonth}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "jobBeginMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Job ending month</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.jobEndMonth}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "jobEndMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removePersonnelInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewPersonnelInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="investment-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="investment-heading"
          >
            Investment
          </h2>
          {investmentInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Name of Purchase</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Name of Purchase"
                  value={input.purchaseName}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "purchaseName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Asset Cost</span>
                <Input
                  className="col-start-2"
                  placeholder="1000"
                  value={input.assetCost}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "assetCost",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Purchase Month</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.purchaseMonth}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "purchaseMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Residual Value</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.residualValue}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "residualValue",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Useful Lifetime (Months)</span>
                <Input
                  className="col-start-2"
                  placeholder="5"
                  value={input.usefulLifetime}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "usefulLifetime",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeInvestmentInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewInvestmentInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="loan-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="loan-heading"
          >
            Loan
          </h2>
          {loanInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Loan Amount</span>
                <Input
                  className="col-start-2"
                  placeholder="500"
                  value={input.loanAmount}
                  onChange={(e) =>
                    handleLoanInputChange(index, "loanAmount", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Interest Rate (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.interestRate}
                  onChange={(e) =>
                    handleLoanInputChange(index, "interestRate", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Month Begin Loan</span>
                <Input
                  className="col-start-2"
                  placeholder="5"
                  value={input.loanBeginMonth}
                  onChange={(e) =>
                    handleLoanInputChange(
                      index,
                      "loanBeginMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Loan Length (Months)</span>
                <Input
                  className="col-start-2"
                  placeholder="6"
                  value={input.loanLength}
                  onChange={(e) =>
                    handleLoanInputChange(index, "loanLength", e.target.value)
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeLoanInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={addNewLoanInput}
          >
            Add New
          </button>
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

      {/* <h2
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
      </div> */}
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
