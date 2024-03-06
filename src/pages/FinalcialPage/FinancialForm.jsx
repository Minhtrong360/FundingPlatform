import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";

import DurationSelect from "./Components/DurationSelect";
import CustomerSection from "./Components/CustomerSection";
import SalesSection from "./Components/SalesSection";
import CostSection from "./Components/CostSection";
import PersonnelSection from "./Components/PersonnelSection";
import InvestmentSection from "./Components/InvestmentSection";
import LoanSection from "./Components/LoanSection";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import ProgressBar from "../../components/ProgressBar";
import Gemini from "./Components/Gemini";
import MetricsFM from "../MetricsFM";
import ProfitAndLossSection from "./Components/ProfitAndLossSection";
import * as XLSX from "xlsx";

const FinancialForm = ({ currentUser, setCurrentUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  //DurationSection
  const [selectedDuration, setSelectedDuration] = useState("3 years");
  const [numberOfMonths, setNumberOfMonths] = useState(0);

  useEffect(() => {
    if (selectedDuration === "3 years") {
      setNumberOfMonths(36);
    }
    if (selectedDuration === "5 years") {
      setNumberOfMonths(60);
    }
  }, [selectedDuration]);

  const [startingCashBalance, setStartingCashBalance] = useState([]);
  const [status, setStatus] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [incomeTax, setIncomeTax] = useState(10);
  const [payrollTax, setPayrollTax] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [startMonth, setStartMonth] = useState([]);
  const [startYear, setStartYear] = useState(2024);
  const [financialProjectName, setFinancialProjectName] = useState([]);

  // Gemini
  const [chatbotResponse, setChatbotResponse] = useState("");
  // Gemini useEffect
  useEffect(() => {
    // Ensure chatbotResponse is only processed when it's a valid string
    if (!chatbotResponse || chatbotResponse.trim() === "") return;
    try {
      const data = JSON.parse(chatbotResponse);

      if (data.DurationSelect)
        setSelectedDuration(data.DurationSelect.selectedDuration);
      if (data.CustomerSection)
        setCustomerInputs(data.CustomerSection.customerInputs);
      if (data.SalesSection) setChannelInputs(data.SalesSection.channelInputs);
      if (data.CostSection) setCostInputs(data.CostSection.costInputs);
      if (data.PersonnelSection)
        setPersonnelInputs(data.PersonnelSection.personnelInputs);
      if (data.InvestmentSection)
        setInvestmentInputs(data.InvestmentSection.investmentInputs);
      if (data.LoanSection) setLoanInputs(data.LoanSection.loanInputs);
    } catch (error) {
      console.log("Error parsing JSON:", error);
    }
  }, [chatbotResponse]);

  //CustomerState
  const [customerInputs, setCustomerInputs] = useState([
    {
      customersPerMonth: 300,
      growthPerMonth: 10,
      channelName: "Online",
      beginMonth: 1,
      endMonth: 36,
    },
    {
      customersPerMonth: 400,
      growthPerMonth: 10,
      channelName: "Offline",
      beginMonth: 1,
      endMonth: 36,
    },
  ]);

  const [customerGrowthData, setCustomerGrowthData] = useState([]);

  //RevenueState
  const [channelInputs, setChannelInputs] = useState([
    {
      productName: "Coffee", // New field for product name
      price: 4,
      multiples: 1,
      deductionPercentage: 5,
      cogsPercentage: 30,
      selectedChannel: "Offline",
      channelAllocation: 0.4,
    },
    {
      productName: "Cake", // New field for product name
      price: 8,
      multiples: 1,
      deductionPercentage: 4,
      cogsPercentage: 35,
      selectedChannel: "Offline",
      channelAllocation: 0.3,
    },
    {
      productName: "Coffee Bag", // New field for product name
      price: 6,
      multiples: 1,
      deductionPercentage: 6,
      cogsPercentage: 25,
      selectedChannel: "Online",
      channelAllocation: 0.6,
    },
  ]);
  const [channelNames, setChannelNames] = useState([]);

  const [revenueData, setRevenueData] = useState([]);
  const [netRevenueData, setNetRevenueData] = useState([]);
  const [grossProfitData, setGrossProfitData] = useState([]);
  const [revenueDeductionData, setrevenueDeductionData] = useState([]);
  const [cogsData, setCogsData] = useState([]);

  let revenueTableData = [];
  const calculateChannelRevenue = () => {
    let revenueByChannelAndProduct = {};

    // New arrays for revenueDeduction and COGS
    let DeductionByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};

    channelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);

        // Initialize revenueDeduction and COGS arrays
        const revenueDeductionArray = Array(numberOfMonths).fill(0);
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

                  // Calculate revenueDeduction and COGS
                  revenueDeductionArray[data.month - 1] =
                    (revenue * parseFloat(channel.deductionPercentage)) / 100;
                  cogsArray[data.month - 1] =
                    (revenue * parseFloat(channel.cogsPercentage)) / 100;
                }
              }
            }
          });
        });

        revenueByChannelAndProduct[channelProductKey] = revenueArray;
        DeductionByChannelAndProduct[channelProductKey] = revenueDeductionArray;
        cogsByChannelAndProduct[channelProductKey] = cogsArray;

        netRevenueArray.forEach((_, i) => {
          netRevenueArray[i] = revenueArray[i] - revenueDeductionArray[i];
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
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    };
  };

  useEffect(() => {
    // Update channelNames based on current customerInputs
    const updatedChannelNames = customerInputs
      .map((input) => input.channelName)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    setChannelNames(updatedChannelNames);
  }, [customerInputs]);

  //CostState
  const [costInputs, setCostInputs] = useState([
    {
      costName: "Website",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 6,
      costType: "Sales, Marketing Cost",
    },
    {
      costName: "Marketing",
      costValue: 500,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 36,
      costType: "Sales, Marketing Cost",
    },
    {
      costName: "Rent",
      costValue: 1000,
      growthPercentage: 2,
      beginMonth: 1,
      endMonth: 36,
      costType: "General Administrative Cost",
    },
  ]);

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

  const transformCostDataForTable = () => {
    const transformedCustomerTableData = {};
    const calculatedCostData = calculateCostData();

    calculatedCostData.forEach((costItem) => {
      const rowKey = `${costItem.costType} - ${costItem.costName}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedCustomerTableData[rowKey]) {
          transformedCustomerTableData[rowKey] = {
            key: rowKey,
            costName: rowKey,
          };
        }
        transformedCustomerTableData[rowKey][`month${monthData.month}`] =
          parseFloat(monthData.cost)?.toFixed(2);
      });
    });

    return Object.values(transformedCustomerTableData);
  };

  //PersonnelState
  const [personnelInputs, setPersonnelInputs] = useState([
    {
      jobTitle: "Cashier",
      salaryPerMonth: 800,
      numberOfHires: 2,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    },
    {
      jobTitle: "Manager",
      salaryPerMonth: 2000,
      numberOfHires: 1,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    },
  ]);
  const [personnelCostData, setPersonnelCostData] = useState([]);
  const transformPersonnelCostDataForTable = () => {
    const transformedCustomerTableData = personnelCostData.map((item) => {
      const rowData = { key: item.jobTitle, jobTitle: item.jobTitle };
      item.monthlyCosts.forEach((monthData) => {
        rowData[`month${monthData.month}`] = monthData.cost?.toFixed(2); // Adjust formatting as needed
      });
      return rowData;
    });
    return transformedCustomerTableData;
  };

  //InvestmentState
  const [investmentInputs, setInvestmentInputs] = useState([
    {
      purchaseName: "Coffee machine",
      assetCost: 8000,
      quantity: 1,
      purchaseMonth: 2,
      residualValue: 10,
      usefulLifetime: 36,
    },
    {
      purchaseName: "Table",
      assetCost: 200,
      quantity: 10,
      purchaseMonth: 1,
      residualValue: 10,
      usefulLifetime: 36,
    },
  ]);
  //InvestmentTableData
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
          assetCostRow[`month${monthIndex + 1}`] = assetCost?.toFixed(2); // Using Asset Cost
          depreciationRow[`month${monthIndex + 1}`] =
            investment.depreciationArray[monthIndex]?.toFixed(2);
          accumulatedDepreciationRow[`month${monthIndex + 1}`] =
            investment.accumulatedDepreciation[monthIndex]?.toFixed(2);
          bookValueRow[`month${monthIndex + 1}`] = (
            assetCost - investment.accumulatedDepreciation[monthIndex]
          )?.toFixed(2);
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
  //LoanState
  const [loanInputs, setLoanInputs] = useState([
    {
      loanName: "Banking loan",
      loanAmount: "150000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "12",
    },
  ]);
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
        loanAmountRow[monthKey] = monthData.loanAmount?.toFixed(2);
        paymentRow[monthKey] = monthData.payment?.toFixed(2);
        principalRow[monthKey] = monthData.principal?.toFixed(2);
        interestRow[monthKey] = monthData.interest?.toFixed(2);
        balanceRow[monthKey] = monthData.balance?.toFixed(2);
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

  // Lưu vào DB

  // const { user } = useAuth();
  // const loadData = async (userId) => {
  //   setIsLoading(true);
  //   const { data, error } = await supabase
  //     .from("finance")
  //     .select("inputData")
  //     .eq("user_id", userId);
  //   if (error) {
  //     toast.error(error.message);
  //     console.error("Error fetching data", error);
  //     return null;
  //   }
  //   setIsLoading(false);
  //   return data.length > 0 ? JSON.parse(data[0]?.inputData) : null;
  // };

  // useEffect(() => {
  //   // Assuming `user` is your user object
  //   const userId = user?.id;
  //   if (userId) {
  //     loadData(userId).then((inputData) => {
  //       if (inputData) {
  //         // Set your state here
  //         setFinancialProjectName(inputData.financialProjectName);
  //         setSelectedDuration(inputData.selectedDuration);
  //         setCustomerInputs(inputData.customerInputs);
  //         setChannelInputs(inputData.channelInputs);
  //         setCostInputs(inputData.costInputs);
  //         setPersonnelInputs(inputData.personnelInputs);
  //         setInvestmentInputs(inputData.investmentInputs);
  //         setLoanInputs(inputData.loanInputs);
  //       }
  //     });
  //   }
  // }, [user?.id]);

  // const saveOrUpdateFinanceData = async (userId, inputData) => {
  //   setIsLoading(true);

  //   try {
  //     const { data: existingData, error: selectError } = await supabase
  //       .from("finance")
  //       .select("*")
  //       .eq("user_id", userId);

  //     if (selectError) throw selectError;

  //     if (existingData.length > 0) {
  //       const financeRecord = existingData[0];

  //       // Kiểm tra nếu tác giả của dữ liệu tài chính trùng với userId
  //       if (financeRecord.user_id === userId) {
  //         // Cập nhật bản ghi hiện có

  //         const { error: updateError } = await supabase
  //           .from("finance")
  //           .update({ name: financeName, inputData })
  //           .eq("id", financeRecord?.id)
  //           .select();

  //         if (updateError) {
  //           toast.error(updateError.message);
  //         } else {
  //           toast.success("Updated successfully.");
  //         }
  //       } else {
  //         toast.error("Bạn không có quyền cập nhật bản ghi này.");
  //       }
  //     } else {
  //       // Thêm bản ghi mới
  //       const { error: insertError } = await supabase.from("finance").insert([
  //         {
  //           user_id: userId,
  //           name: financeName,
  //           user_email: user.email,
  //           inputData,
  //         },
  //       ]);
  //       if (insertError) {
  //         toast.error(insertError.message);
  //       } else {
  //         toast.success("Inserted successfully.");
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //     console.error("Error in saveOrUpdateFinanceData", error);
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSubmit = async () => {
  //   const financeData = {
  //     financeName,
  //     selectedDuration,
  //     customerInputs,
  //     channelInputs,
  //     costInputs,
  //     personnelInputs,
  //     investmentInputs,
  //     loanInputs,
  //   };

  //   await saveOrUpdateFinanceData(user?.id, financeData);

  //   // Handle post-save actions
  // };

  // Download Excel
  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    const convertDataToWorksheet = (data) => {
      return XLSX.utils.json_to_sheet(data);
    };

    const addSheetToWorkbook = (sheet, sheetName) => {
      XLSX.utils.book_append_sheet(workBook, sheet, sheetName);
    };

    // Example data conversion and sheet addition
    addSheetToWorkbook(
      convertDataToWorksheet(transformCostDataForTable()),
      "Costs"
    );
    addSheetToWorkbook(
      convertDataToWorksheet(transformPersonnelCostDataForTable()),
      "Personnel Costs"
    );
    addSheetToWorkbook(
      convertDataToWorksheet(transformInvestmentDataForTable()),
      "Investments"
    );
    addSheetToWorkbook(
      convertDataToWorksheet(transformLoanDataForTable()),
      "Loans"
    );
    //addSheetToWorkbook(convertDataToWorksheet(transposedData), 'Profit and Loss');

    // Write the workbook and trigger download
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "financial-data.xlsx"
    );
  };

  return (
    <div>
      <AlertMsg />
      {isLoading ? (
        <ProgressBar isLoading={isLoading} />
      ) : (
        <>
          {/* Gemini */}
          <div className="w-full h-full flex flex-col lg:flex-row">
            <Gemini
              setIsLoading={setIsLoading}
              setChatbotResponse={setChatbotResponse}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>

          {/* DurationSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <DurationSelect
                selectedDuration={selectedDuration}
                setSelectedDuration={setSelectedDuration}
                startingCashBalance={startingCashBalance}
                setStartingCashBalance={setStartingCashBalance}
                status={status}
                setStatus={setStatus}
                industry={industry}
                setIndustry={setIndustry}
                incomeTax={incomeTax}
                setIncomeTax={setIncomeTax}
                payrollTax={payrollTax}
                setPayrollTax={setPayrollTax}
                currency={currency}
                setCurrency={setCurrency}
                startMonth={startMonth}
                setStartMonth={setStartMonth}
                startYear={startYear}
                setStartYear={setStartYear}
                financialProjectName={financialProjectName}
                setFinancialProjectName={setFinancialProjectName}
              />
            </div>

            <div className="w-full lg:w-2/3 p-4">
              <MetricsFM />
            </div>
          </div>

          {/* CustomerSection */}
          <CustomerSection
            customerInputs={customerInputs}
            setCustomerInputs={setCustomerInputs}
            numberOfMonths={numberOfMonths}
            customerGrowthData={customerGrowthData}
            setCustomerGrowthData={setCustomerGrowthData}
          />

          {/* RevenueSetion */}
          <SalesSection
            channelInputs={channelInputs}
            channelNames={channelNames}
            setChannelInputs={setChannelInputs}
            revenueData={revenueData}
            revenueDeductionData={revenueDeductionData}
            cogsData={cogsData}
            customerInputs={customerInputs}
            numberOfMonths={numberOfMonths}
            netRevenueData={netRevenueData}
            grossProfitData={grossProfitData}
            calculateChannelRevenue={calculateChannelRevenue}
            setRevenueData={setRevenueData}
            setrevenueDeductionData={setrevenueDeductionData}
            setCogsData={setCogsData}
            setNetRevenueData={setNetRevenueData}
            setGrossProfitData={setGrossProfitData}
            customerGrowthData={customerGrowthData}
            revenueTableData={revenueTableData}
          />

          {/* CostSection */}
          <CostSection
            costInputs={costInputs}
            setCostInputs={setCostInputs}
            numberOfMonths={numberOfMonths}
            calculateCostData={calculateCostData}
            transformCostDataForTable={transformCostDataForTable}
            costData={costData}
            setCostData={setCostData}
          />

          {/* PersonnelSection */}
          <PersonnelSection
            personnelInputs={personnelInputs}
            setPersonnelInputs={setPersonnelInputs}
            numberOfMonths={numberOfMonths}
            personnelCostData={personnelCostData}
            setPersonnelCostData={setPersonnelCostData}
            transformPersonnelCostDataForTable={
              transformPersonnelCostDataForTable
            }
          />

          {/* InvestmentSection */}
          <InvestmentSection
            investmentInputs={investmentInputs}
            setInvestmentInputs={setInvestmentInputs}
            numberOfMonths={numberOfMonths}
            calculateInvestmentData={calculateInvestmentData}
            transformInvestmentDataForTable={transformInvestmentDataForTable}
          />

          {/* LoanSection */}
          <LoanSection
            loanInputs={loanInputs}
            setLoanInputs={setLoanInputs}
            numberOfMonths={numberOfMonths}
            calculateLoanData={calculateLoanData}
            transformLoanDataForTable={transformLoanDataForTable}
          />

          {/* ProfitAndLossSection */}
          <ProfitAndLossSection
            revenueData={revenueTableData}
            costData={costData}
            personnelCostData={personnelCostData}
            investmentData={calculateInvestmentData()}
            loanData={calculateLoanData()}
            numberOfMonths={numberOfMonths}
            incomeTaxRate={incomeTax}
          />
        </>
      )}

      <button onClick={downloadExcel} className="download-excel-button">
        Download Excel
      </button>
    </div>
  );
};

export default FinancialForm;
