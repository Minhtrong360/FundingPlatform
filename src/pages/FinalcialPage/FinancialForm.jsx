import React, { useState, useEffect } from "react";

import { Table } from "antd";
import Chart from "react-apexcharts";
import DurationSelect from "./Components/DurationSelect";
import CustomerSection from "./Components/CustomerSection";
import SalesSection from "./Components/SalesSection";
import CostSection from "./Components/CostSection";
import PersonnelSection from "./Components/PersonnelSection";
import InvestmentSection from "./Components/InvestmentSection";
import LoanSection from "./Components/LoanSection";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import LoadingButtonClick from "../../components/LoadingButtonClick";
import { toast } from "react-toastify";

const FinancialForm = () => {
  //DurationSection
  const [financeName, setFinanceName] = useState("");

  const [selectedDuration, setSelectedDuration] = useState("3 years");

  //CustomerSection
  const [customerInputs, setCustomerInputs] = useState([
    {
      customersPerMonth: 100,
      growthPerMonth: 10,
      channelName: "",
      beginMonth: 1,
      endMonth: 12,
    },
  ]);

  const [channelInputs, setChannelInputs] = useState([
    {
      productName: "", // New field for product name
      price: 0,
      multiples: 0,
      txFeePercentage: 0,
      cogsPercentage: 0,
      selectedChannel: "",
      channelAllocation: 1,
    },
  ]);

  const [channelNames, setChannelNames] = useState([]);

  useEffect(() => {
    // Update channelNames based on current customerInputs
    const updatedChannelNames = customerInputs
      .map((input) => input.channelName)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    setChannelNames(updatedChannelNames);
  }, [customerInputs]); // Update channelNames when customerInputs changes

  const addNewCustomerInput = (input) => {
    setCustomerInputs([...customerInputs, input]);
  };

  const removeCustomerInput = (index) => {
    const newInputs = [...customerInputs];
    newInputs.splice(index, 1);
    setCustomerInputs(newInputs);
  };

  const handleInputChange = (index, field, value) => {
    const newInputs = [...customerInputs];
    newInputs[index][field] = value;
    setCustomerInputs(newInputs);
  };

  const [customerGrowthData, setCustomerGrowthData] = useState([]);

  //SalesSection
  const addNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      {
        productName: "",
        price: 0,
        multiples: 0,
        txFeePercentage: 0,
        cogsPercentage: 0,
        selectedChannel: "",
      },
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

  const [revenueData, setRevenueData] = useState([]);
  const [netRevenueData, setNetRevenueData] = useState([]);
  const [grossProfitData, setGrossProfitData] = useState([]);

  const calculateCustomerGrowth = (customerInputs, selectedDuration) => {
    const months = selectedDuration === "3 years" ? 36 : 60;
    return customerInputs.map((channel) => {
      let customers = [];
      let currentCustomers = parseFloat(channel.customersPerMonth);
      for (let i = channel.beginMonth; i <= months; i++) {
        customers.push({
          month: i,
          customers: currentCustomers,
          channelName: channel.channelName,
        });
        currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
      }
      return customers;
    });
  };

  const [txFeeData, setTxFeeData] = useState([]);
  const [cogsData, setCogsData] = useState([]);

  const calculateChannelRevenue = () => {
    let revenueByChannelAndProduct = {};

    // New arrays for txFee and COGS
    let txFeeByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};

    channelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);

        // Initialize txFee and COGS arrays
        const txFeeArray = Array(numberOfMonths).fill(0);
        const cogsArray = Array(numberOfMonths).fill(0);
        const netRevenueArray = Array(numberOfMonths).fill(0);
        const grossProfitArray = Array(numberOfMonths).fill(0);

        customerGrowthData.forEach((growthData) => {
          growthData.forEach((data) => {
            if (data.channelName === channel.selectedChannel) {
              const customerInput = customerInputs.find(
                (input) => input.channelName === channel.selectedChannel
              );
              if (customerInput) {
                const begin = customerInput.beginMonth;
                const end = customerInput.endMonth;

                if (data.month >= begin && data.month <= end) {
                  let revenue =
                    data.customers *
                    parseFloat(channel.price) *
                    parseFloat(channel.multiples) *
                    parseFloat(channel.channelAllocation);
                  revenueArray[data.month - 1] = revenue;

                  // Calculate txFee and COGS
                  txFeeArray[data.month - 1] =
                    (revenue * parseFloat(channel.txFeePercentage)) / 100;
                  cogsArray[data.month - 1] =
                    (revenue * parseFloat(channel.cogsPercentage)) / 100;
                }
              }
            }
          });
        });

        revenueByChannelAndProduct[channelProductKey] = revenueArray;
        txFeeByChannelAndProduct[channelProductKey] = txFeeArray;
        cogsByChannelAndProduct[channelProductKey] = cogsArray;

        netRevenueArray.forEach((_, i) => {
          netRevenueArray[i] = revenueArray[i] - txFeeArray[i];
        });
        netRevenueByChannelAndProduct[channelProductKey] = netRevenueArray;

        grossProfitArray.forEach((_, i) => {
          grossProfitArray[i] =
            netRevenueByChannelAndProduct[channelProductKey][i] -
            cogsByChannelAndProduct[channelProductKey][i];
        });
        grossProfitByChannelAndProduct[channelProductKey] = grossProfitArray;
      }
    });

    return {
      revenueByChannelAndProduct,
      txFeeByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    };
  };

  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      txFeeByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    } = calculateChannelRevenue();
    setRevenueData(revenueByChannelAndProduct);
    setTxFeeData(txFeeByChannelAndProduct);
    setCogsData(cogsByChannelAndProduct);
    setNetRevenueData(netRevenueByChannelAndProduct);
    setGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, channelInputs]);

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      selectedDuration
    );
    setCustomerGrowthData(calculatedData);
  }, [customerInputs, selectedDuration]);

  // Cost inputs handle
  const [costInputs, setCostInputs] = useState([
    {
      costName: "",
      costValue: 0,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 12,
      costType: "Operating Cost",
    },
  ]);

  // ...other existing code...

  const addNewCostInput = (input) => {
    setCostInputs([...costInputs, input]);
  };

  const removeCostInput = (index) => {
    const newInputs = [...costInputs];
    newInputs.splice(index, 1);
    setCostInputs(newInputs);
  };

  const handleCostInputChange = (index, field, value) => {
    const newInputs = [...costInputs];
    newInputs[index][field] = value;
    setCostInputs(newInputs);
  };

  // State management cho Personnel
  const [personnelInputs, setPersonnelInputs] = useState([
    {
      jobTitle: "",
      salaryPerMonth: 0,
      numberOfHires: 0,
      jobBeginMonth: 1,
      jobEndMonth: 8,
    },
  ]);

  // Function to add a new personnel input
  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 0,
        jobBeginMonth: 1,
        jobEndMonth: 8,
      },
    ]);
  };

  // Function to remove a personnel input
  const removePersonnelInput = (index) => {
    const newInputs = [...personnelInputs];
    newInputs.splice(index, 1);
    setPersonnelInputs(newInputs);
  };

  // Function to update a personnel input
  const handlePersonnelInputChange = (index, field, value) => {
    const newInputs = [...personnelInputs];
    newInputs[index][field] = value;
    setPersonnelInputs(newInputs);
  };

  const [personnelCostData, setPersonnelCostData] = useState([]);

  const calculatePersonnelCostData = () => {
    let allPersonnelCosts = [];
    personnelInputs.forEach((personnelInput) => {
      let monthlyCosts = [];
      // Determine the number of months based on the selected duration
      const totalMonths = selectedDuration === "3 years" ? 36 : 60;

      for (let month = 1; month <= totalMonths; month++) {
        if (
          month >= personnelInput.jobBeginMonth &&
          month <= personnelInput.jobEndMonth
        ) {
          const monthlyCost =
            parseFloat(personnelInput.salaryPerMonth) *
            parseFloat(personnelInput.numberOfHires);
          monthlyCosts.push({ month: month, cost: monthlyCost });
        } else {
          monthlyCosts.push({ month: month, cost: 0 });
        }
      }
      allPersonnelCosts.push({
        jobTitle: personnelInput.jobTitle,
        monthlyCosts,
      });
    });
    return allPersonnelCosts;
  };

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setPersonnelCostData(calculatedData);
  }, [personnelInputs]);

  //Investment Inputs
  const [investmentInputs, setInvestmentInputs] = useState([
    {
      purchaseName: "",
      assetCost: "1000",
      quantity: 1,
      purchaseMonth: "2",
      residualValue: "10",
      usefulLifetime: "5",
    },
  ]);

  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: "0",
        purchaseMonth: "2",
        residualValue: "10",
        usefulLifetime: "5",
      },
    ]);
  };

  const removeInvestmentInput = (index) => {
    const newInputs = [...investmentInputs];
    newInputs.splice(index, 1);
    setInvestmentInputs(newInputs);
  };

  // Function to update an investment input
  const handleInvestmentInputChange = (index, field, value) => {
    const newInputs = [...investmentInputs];
    newInputs[index][field] = value;
    setInvestmentInputs(newInputs);
  };

  const calculateInvestmentData = () => {
    return investmentInputs.map((investment) => {
      const quantity = parseInt(investment.quantity, 10) || 1; // Ensuring there is a default value of 1

      const assetCost = parseFloat(investment.assetCost) * quantity;

      const residualValue = parseFloat(investment.residualValue) * quantity;
      const usefulLifetime = parseFloat(investment.usefulLifetime);
      const purchaseMonth = parseInt(investment.purchaseMonth, 10);

      const depreciationPerMonth = (assetCost - residualValue) / usefulLifetime;
      const depreciationArray = new Array(numberOfMonths).fill(0);

      // Calculate depreciation and accumulated depreciation
      for (let i = 0; i < numberOfMonths; i++) {
        if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
          depreciationArray[i] = depreciationPerMonth;
        }
      }

      const accumulatedDepreciation = depreciationArray.reduce(
        (acc, val, index) => {
          acc[index] = (acc[index - 1] || 0) + val;
          return acc;
        },
        []
      );

      // Calculate asset value and book value
      const assetValue = new Array(numberOfMonths).fill(0);
      const bookValue = new Array(numberOfMonths).fill(0);
      for (let i = 0; i < numberOfMonths; i++) {
        if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
          assetValue[i] = assetCost;

          bookValue[i] = assetValue[i] - accumulatedDepreciation[i];
        }
      }

      return {
        assetValue,
        depreciationArray,
        accumulatedDepreciation,
        bookValue,
      };
    });
  };

  //Loan part

  const [loanInputs, setLoanInputs] = useState([
    {
      loanName: "",
      loanAmount: "",
      interestRate: "",
      loanBeginMonth: "",
      loanEndMonth: "",
    },
  ]);

  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "",
        interestRate: "",
        loanBeginMonth: "",
        loanEndMonth: "",
      },
    ]);
  };

  const removeLoanInput = (index) => {
    const newInputs = [...loanInputs];
    newInputs.splice(index, 1);
    setLoanInputs(newInputs);
  };

  const handleLoanInputChange = (index, field, value) => {
    const newInputs = [...loanInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setLoanInputs(newInputs);
  };

  const calculateLoanData = () => {
    return loanInputs.map((loan) => {
      const monthlyRate = parseFloat(loan.interestRate) / 100 / 12;
      const loanAmount = parseFloat(loan.loanAmount);
      const loanDuration =
        parseInt(loan.loanEndMonth, 10) - parseInt(loan.loanBeginMonth, 10) + 1;

      // Calculate monthly payment
      const monthlyPayment =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -loanDuration));

      let remainingBalance = loanAmount;
      const loanDataPerMonth = [];

      for (let month = 1; month <= loanDuration; month++) {
        const interestForMonth = remainingBalance * monthlyRate;
        const principalForMonth = monthlyPayment - interestForMonth;
        remainingBalance -= principalForMonth;

        loanDataPerMonth.push({
          month: month + parseInt(loan.loanBeginMonth, 10) - 1,
          payment: monthlyPayment,
          principal: principalForMonth,
          interest: interestForMonth,
          balance: remainingBalance,
          loanAmount: loanAmount,
        });
      }

      return {
        loanName: loan.loanName,
        loanDataPerMonth,
      };
    });
  };

  const transformLoanDataForTable = () => {
    const loanTableData = [];

    calculateLoanData().forEach((loan, loanIndex) => {
      const loanName =
        loanInputs[loanIndex].loanName || `Loan ${loanIndex + 1}`;

      const loanAmountRow = {
        key: `${loanName} - Loan Amount`,
        type: `${loanName} - Loan Amount`,
      };
      const paymentRow = {
        key: `${loanName} - Payment`,
        type: `${loanName} - Payment`,
      };
      const principalRow = {
        key: `${loanName} - Principal`,
        type: `${loanName} - Principal`,
      };
      const interestRow = {
        key: `${loanName} - Interest`,
        type: `${loanName} - Interest`,
      };
      const balanceRow = {
        key: `${loanName} - Remaining Balance`,
        type: `${loanName} - Remaining Balance`,
      };

      // Initialize all rows with default values
      for (let monthIndex = 1; monthIndex <= numberOfMonths; monthIndex++) {
        const monthKey = `Month ${monthIndex}`;
        loanAmountRow[monthKey] = "0.00";
        paymentRow[monthKey] = "0.00";
        principalRow[monthKey] = "0.00";
        interestRow[monthKey] = "0.00";
        balanceRow[monthKey] = "0.00";
      }

      loan.loanDataPerMonth.forEach((monthData) => {
        const monthKey = `Month ${monthData.month}`;
        loanAmountRow[monthKey] = monthData.loanAmount.toFixed(2);
        paymentRow[monthKey] = monthData.payment.toFixed(2);
        principalRow[monthKey] = monthData.principal.toFixed(2);
        interestRow[monthKey] = monthData.interest.toFixed(2);
        balanceRow[monthKey] = monthData.balance.toFixed(2);
      });

      loanTableData.push(
        loanAmountRow,
        paymentRow,
        principalRow,
        interestRow,
        balanceRow
      );
    });

    return loanTableData;
  };

  const numberOfMonths = selectedDuration === "3 years" ? 36 : 60;

  // Data Transformation with rounding to 2 decimal places
  const transformedData = {};
  customerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = customerInputs.find(
        (input) => input.channelName === data.channelName
      );
      if (customerInput) {
        if (!transformedData[data.channelName]) {
          transformedData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        // Check if the month is within the range
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedData[data.channelName][`month${data.month}`] = parseFloat(
            data.customers
          ).toFixed(2);
        } else {
          // Set value to 0 if outside the range
          transformedData[data.channelName][`month${data.month}`] = "0.00";
        }
      }
    });
  });

  const tableData = Object.values(transformedData).map((row) => {
    for (let month = 1; month <= numberOfMonths; month++) {
      if (!row.hasOwnProperty(`month${month}`)) {
        row[`month${month}`] = "0.00";
      }
    }
    return row;
  });

  // Dynamic Column Creation
  const columns = [
    {
      title: "Channel Name",
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).map((month) => ({
      title: `Month ${month}`,
      dataIndex: `month${month}`,
      key: `month${month}`,
    })),
  ];

  const revenueTableData = [];

  channelInputs.forEach((channel) => {
    if (channel.selectedChannel && channel.productName) {
      const channelRevenue =
        revenueData[channel.selectedChannel + " - " + channel.productName] ||
        [];
      const channelTxFee =
        txFeeData[channel.selectedChannel + " - " + channel.productName] || [];
      const channelCOGS =
        cogsData[channel.selectedChannel + " - " + channel.productName] || [];

      const customerInput = customerInputs.find(
        (input) => input.channelName === channel.selectedChannel
      );
      const begin = customerInput ? customerInput.beginMonth : 1;
      const end = customerInput ? customerInput.endMonth : numberOfMonths;

      const revenueRow = {
        key:
          channel.selectedChannel + " - " + channel.productName + " - Revenue",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - Revenue",
      };
      const txFeeRow = {
        key: channel.selectedChannel + " - " + channel.productName + " - Txfee",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - Txfee",
      };
      const cogsRow = {
        key: channel.selectedChannel + " - " + channel.productName + " - COGS",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - COGS",
      };

      channelRevenue.forEach((value, index) => {
        if (index + 1 >= begin && index + 1 <= end) {
          revenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
          txFeeRow[`month${index + 1}`] = parseFloat(
            channelTxFee[index]
          ).toFixed(2);
          cogsRow[`month${index + 1}`] = parseFloat(channelCOGS[index]).toFixed(
            2
          );
        } else {
          revenueRow[`month${index + 1}`] = "0.00";
          txFeeRow[`month${index + 1}`] = "0.00";
          cogsRow[`month${index + 1}`] = "0.00";
        }
      });

      const netRevenueRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Net Revenue",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Net Revenue",
      };

      const netRevenueArray =
        netRevenueData[channel.selectedChannel + " - " + channel.productName] ||
        [];
      netRevenueArray.forEach((value, index) => {
        // ...existing code...
        netRevenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
      });

      const grossProfitRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Gross Profit",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - Gross Profit",
      };

      const grossProfitArray =
        grossProfitData[
          channel.selectedChannel + " - " + channel.productName
        ] || [];
      grossProfitArray.forEach((value, index) => {
        // ...existing code...
        grossProfitRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
      });

      revenueTableData.push(revenueRow);
      revenueTableData.push(txFeeRow);
      revenueTableData.push(cogsRow);
      revenueTableData.push(netRevenueRow);
      revenueTableData.push(grossProfitRow);
    }
  });

  // Costs Calculation
  const [costData, setCostData] = useState([]);

  const calculateCostData = () => {
    let allCosts = [];
    costInputs.forEach((costInput) => {
      let monthlyCosts = [];
      let currentCost = parseFloat(costInput.costValue);
      for (let month = 1; month <= numberOfMonths; month++) {
        if (month >= costInput.beginMonth && month <= costInput.endMonth) {
          monthlyCosts.push({ month: month, cost: currentCost });
          currentCost *= 1 + parseFloat(costInput.growthPercentage) / 100;
        } else {
          monthlyCosts.push({ month: month, cost: 0 });
        }
      }
      allCosts.push({
        costName: costInput.costName,
        monthlyCosts,
        costType: costInput.costType,
      });
    });
    return allCosts;
  };

  useEffect(() => {
    const calculatedData = calculateCostData();
    setCostData(calculatedData);
  }, [costInputs]);

  const transformCostDataForTable = () => {
    const transformedData = {};
    const calculatedCostData = calculateCostData();
    calculatedCostData.forEach((costItem) => {
      const rowKey = `${costItem.costType} - ${costItem.costName}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedData[rowKey]) {
          transformedData[rowKey] = { key: rowKey, costName: rowKey };
        }
        transformedData[rowKey][`month${monthData.month}`] = parseFloat(
          monthData.cost
        ).toFixed(2);
      });
    });

    return Object.values(transformedData);
  };

  // In your render method or return statement
  const costTableData = transformCostDataForTable();

  //Personel cost
  const transformPersonnelCostDataForTable = () => {
    const transformedData = personnelCostData.map((item) => {
      const rowData = { key: item.jobTitle, jobTitle: item.jobTitle };
      item.monthlyCosts.forEach((monthData) => {
        rowData[`month${monthData.month}`] = monthData.cost.toFixed(2); // Adjust formatting as needed
      });
      return rowData;
    });
    return transformedData;
  };

  const personnelCostTableData = transformPersonnelCostDataForTable();

  const transformInvestmentDataForTable = () => {
    const investmentTableData = [];

    calculateInvestmentData().forEach((investment, investmentIndex) => {
      const purchaseName =
        investmentInputs[investmentIndex].purchaseName ||
        `Investment ${investmentIndex + 1}`;
      const assetCostRow = {
        key: `${purchaseName} - Asset Cost`,
        type: `${purchaseName}`,
      };
      const depreciationRow = {
        key: `${purchaseName} - Depreciation`,
        type: "Depreciation",
      };
      const accumulatedDepreciationRow = {
        key: `${purchaseName} - Accumulated Depreciation`,
        type: "Accumulated Depreciation",
      };
      const bookValueRow = {
        key: `${purchaseName} - Book Value`,
        type: "Book Value",
      };

      const purchaseMonth = parseInt(
        investmentInputs[investmentIndex].purchaseMonth,
        10
      );
      const usefulLife = parseInt(
        investmentInputs[investmentIndex].usefulLifetime,
        10
      );
      const endMonth = purchaseMonth + usefulLife - 1;
      const assetCost =
        parseFloat(investmentInputs[investmentIndex].assetCost) *
        parseInt(investmentInputs[investmentIndex].quantity, 10);

      for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
        if (monthIndex >= purchaseMonth - 1 && monthIndex < endMonth) {
          assetCostRow[`month${monthIndex + 1}`] = assetCost.toFixed(2); // Using Asset Cost
          depreciationRow[`month${monthIndex + 1}`] =
            investment.depreciationArray[monthIndex].toFixed(2);
          accumulatedDepreciationRow[`month${monthIndex + 1}`] =
            investment.accumulatedDepreciation[monthIndex].toFixed(2);
          bookValueRow[`month${monthIndex + 1}`] = (
            assetCost - investment.accumulatedDepreciation[monthIndex]
          ).toFixed(2);
        } else {
          assetCostRow[`month${monthIndex + 1}`] = "0.00";
          depreciationRow[`month${monthIndex + 1}`] = "0.00";
          accumulatedDepreciationRow[`month${monthIndex + 1}`] = "0.00";
          bookValueRow[`month${monthIndex + 1}`] = "0.00";
        }
      }

      investmentTableData.push(
        assetCostRow,
        depreciationRow,
        accumulatedDepreciationRow,
        bookValueRow
      );
    });

    return investmentTableData;
  };

  const revenueColumns = [
    {
      title: "Channel - Product - Type",
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).map((month) => ({
      title: `Month ${month}`,
      dataIndex: `month${month}`,
      key: `month${month}`,
    })),
  ];

  const costColumns = [
    {
      title: "Cost Type - Cost Name",
      dataIndex: "costName",
      key: "costName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month ${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const personnelCostColumns = [
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month ${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const investmentColumns = [
    { title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month ${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const loanColumns = [
    { title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month ${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
    })),
  ];

  const [customerGrowthChart, setCustomerGrowthChart] = useState({
    options: {
      chart: {
        id: "customer-growth-chart",
        type: "line",
        height: 350,
      },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = customerGrowthData.map((channelData) => {
      return {
        name: channelData[0]?.channelName || "Unknown Channel",
        data: channelData.map((data) => data.customers),
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));
  }, [customerGrowthData]);

  const [revenueChart, setRevenueChart] = useState({
    options: {
      chart: { id: "revenue-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      title: { text: "Revenue Data by Channel and Product", align: "left" },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },

    series: [],
  });

  useEffect(() => {
    const seriesData = Object.entries(revenueData).map(([key, data]) => {
      return { name: key, data };
    });

    setRevenueChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [revenueData]);

  const [costChart, setCostChart] = useState({
    options: {
      chart: { id: "cost-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      title: { text: "Cost Data", align: "left" },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = costData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [costData]);

  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: { id: "personnel-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      title: { text: "Personnel Cost Data", align: "left" },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = personnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    setPersonnelChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [personnelCostData]);

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      title: { text: "Investment Data", align: "left" },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = calculateInvestmentData().map((investment) => {
      return { name: investment.purchaseName, data: investment.assetValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [investmentInputs]);

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      title: { text: "Loan Data", align: "left" },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = calculateLoanData().map((loan) => {
      return {
        name: loan.loanName,
        data: loan.loanDataPerMonth.map((month) => month.payment),
      };
    });

    setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [loanInputs]);

  // Lưu vào DB

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const loadData = async (userId) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("finance")
      .select("inputData")
      .eq("user_id", userId);
    if (error) {
      toast.error(error.message);
      console.error("Error fetching data", error);
      return null;
    }
    setIsLoading(false);
    return data.length > 0 ? JSON.parse(data[0]?.inputData) : null;
  };

  useEffect(() => {
    // Assuming `user` is your user object
    const userId = user.id;
    loadData(userId).then((inputData) => {
      if (inputData) {
        // Set your state here
        setFinanceName(inputData.financeName);
        setSelectedDuration(inputData.selectedDuration);
        setCustomerInputs(inputData.customerInputs);
        setChannelInputs(inputData.channelInputs);
        setCostInputs(inputData.costInputs);
        setPersonnelInputs(inputData.personnelInputs);
        setInvestmentInputs(inputData.investmentInputs);
        setLoanInputs(inputData.loanInputs);
      }
    });
  }, [user.id]);

  const saveOrUpdateFinanceData = async (userId, financeName, inputData) => {
    setIsLoading(true);

    try {
      const { data: existingData, error: selectError } = await supabase
        .from("finance")
        .select("*")
        .eq("user_id", userId);

      if (selectError) throw selectError;

      if (existingData.length > 0) {
        const financeRecord = existingData[0];

        // Kiểm tra nếu tác giả của dữ liệu tài chính trùng với userId
        if (financeRecord.user_id === userId) {
          console.log("existingData", existingData);
          // Cập nhật bản ghi hiện có
          const { data, error: updateError } = await supabase
            .from("finance")
            .update({ name: financeName, inputData })
            .eq("id", financeRecord.id)
            .select();
          console.log("Updated", data);
          if (updateError) {
            toast.error(updateError.message);
          } else {
            toast.success("Updated successfully.");
          }
        } else {
          toast.error("Bạn không có quyền cập nhật bản ghi này.");
        }
      } else {
        // Thêm bản ghi mới
        const { error: insertError } = await supabase
          .from("finance")
          .insert([{ user_id: userId, name: financeName, inputData }]);
        if (insertError) {
          toast.error(insertError.message);
        } else {
          toast.success("Inserted successfully.");
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error in saveOrUpdateFinanceData", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const financeData = {
      financeName,
      selectedDuration,
      customerInputs,
      channelInputs,
      costInputs,
      personnelInputs,
      investmentInputs,
      loanInputs,
    };

    await saveOrUpdateFinanceData(user.id, financeData);

    // Handle post-save actions
  };

  return (
    <div>
      <LoadingButtonClick isLoading={isLoading} />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <DurationSelect
            financeName={financeName}
            setFinanceName={setFinanceName}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4"></div>
      </div>
      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <CustomerSection
            customerInputs={customerInputs}
            addNewCustomerInput={addNewCustomerInput}
            removeCustomerInput={removeCustomerInput}
            handleInputChange={handleInputChange}
          />
        </div>

        <div className="w-full lg:w-2/3 p-4 ">
          <h3 className="text-lg font-semibold my-8">
            Customer Growth Data by Channel
          </h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />
          <h3 className="text-lg font-semibold my-8">
            {" "}
            Customer Growth Data by Channel
          </h3>
          <Chart
            options={customerGrowthChart.options}
            series={customerGrowthChart.series}
            type="line"
            height={350}
          />
        </div>
      </div>
      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2 border-e-2">
          <SalesSection
            channelInputs={channelInputs}
            channelNames={channelNames}
            addNewChannelInput={addNewChannelInput}
            removeChannelInput={removeChannelInput}
            handleChannelInputChange={handleChannelInputChange}
          />
        </div>

        <div className="w-full lg:w-2/3 p-4 relative">
          <h3 className="text-lg font-semibold my-8">
            {" "}
            Revenue Data by Channel and Product
          </h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={revenueTableData}
            columns={revenueColumns}
            pagination={false}
          />

          <Chart
            options={revenueChart.options}
            series={revenueChart.series}
            type="line"
            height={350}
          />
        </div>
      </div>

      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <CostSection
            costInputs={costInputs}
            addNewCostInput={addNewCostInput}
            removeCostInput={removeCostInput}
            handleCostInputChange={handleCostInputChange}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Cost Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={costTableData}
            columns={costColumns}
            pagination={false}
          />
          <Chart
            options={costChart.options}
            series={costChart.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <PersonnelSection
            personnelInputs={personnelInputs}
            addNewPersonnelInput={addNewPersonnelInput}
            removePersonnelInput={removePersonnelInput}
            handlePersonnelInputChange={handlePersonnelInputChange}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Personnel Cost Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={personnelCostTableData}
            columns={personnelCostColumns}
            pagination={false}
          />
          <Chart
            options={personnelChart.options}
            series={personnelChart.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <InvestmentSection
            investmentInputs={investmentInputs}
            setInvestmentInputs={setInvestmentInputs}
            addNewInvestmentInput={addNewInvestmentInput}
            removeInvestmentInput={removeInvestmentInput}
            handleInvestmentInputChange={handleInvestmentInputChange}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Investment Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={transformInvestmentDataForTable()}
            columns={investmentColumns}
            pagination={false}
          />
          <Chart
            options={investmentChart.options}
            series={investmentChart.series}
            type="area"
            height={350}
          />
        </div>
      </div>
      <hr className="border border-dashed my-8" />
      <div className="w-full h-full flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <LoanSection
            loanInputs={loanInputs}
            addNewLoanInput={addNewLoanInput}
            removeLoanInput={removeLoanInput}
            handleLoanInputChange={handleLoanInputChange}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Loan Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={transformLoanDataForTable()}
            columns={loanColumns}
            pagination={false}
          />
          <Chart
            options={loanChart.options}
            series={loanChart.series}
            type="line"
            height={350}
          />
        </div>
      </div>

      <button
        className="fixed bottom-8 left-30 bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-500"
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        Save
      </button>
    </div>
  );
};

export default FinancialForm;
