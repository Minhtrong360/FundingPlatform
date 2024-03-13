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
import BalanceSheetSection from "./Components/BalanceSheetSection";
import LoadingButtonClick from "../../components/LoadingButtonClick";

const FinancialForm = ({ currentUser, setCurrentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
  const [industry, setIndustry] = useState("Technology");
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
    console.log("first");
    // Ensure chatbotResponse is only processed when it's a valid string
    if (!chatbotResponse || chatbotResponse.trim() === "") return;
    try {
      const data = JSON.parse(chatbotResponse);

      if (data.DurationSelect)
        setSelectedDuration(data.DurationSelect.selectedDuration);
      setStartingCashBalance(data.DurationSelect.startingCashBalance);
      setStatus(data.DurationSelect.status);
      setIndustry(data.DurationSelect.industry);
      setIncomeTax(data.DurationSelect.incomeTax);
      setPayrollTax(data.DurationSelect.payrollTax);
      setCurrency(data.DurationSelect.currency);
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
      id: 1,
      customersPerMonth: 300,
      growthPerMonth: 1,
      channelName: "Online",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
    },
    {
      id: 2,
      customersPerMonth: 400,
      growthPerMonth: 2,
      channelName: "Offline",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
    },
  ]);

  const [customerGrowthData, setCustomerGrowthData] = useState([]);
  const [yearlyAverageCustomers, setYearlyAverageCustomers] = useState([]);
  const [customerGrowthChart, setCustomerGrowthChart] = useState({
    options: {
      chart: {
        id: "customer-growth-chart",
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: { text: "Number of Customers" },
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "stepline" },
      markers: { size: 1 },
    },
    series: [],
  });

  //RevenueState
  const [channelInputs, setChannelInputs] = useState([
    {
      id: 1,
      productName: "Coffee", // New field for product name
      price: 4,
      multiples: 1,
      deductionPercentage: 5,
      cogsPercentage: 30,
      selectedChannel: "Offline",
      channelAllocation: 0.4,
    },
    {
      id: 2,
      productName: "Cake", // New field for product name
      price: 8,
      multiples: 1,
      deductionPercentage: 4,
      cogsPercentage: 35,
      selectedChannel: "Offline",
      channelAllocation: 0.3,
    },
    {
      id: 3,
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
  const [revenueDeductionData, setRevenueDeductionData] = useState([]);
  const [cogsData, setCogsData] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [revenue, setRevenue] = useState({
    options: {
      chart: { id: "revenue-chart", type: "bar", height: 350, stacked: true }, // Set type to "bar" and stacked to true
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: {
          text: "Amount ($)",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: { horizontal: false },
      },
    },
    series: [],
  });

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
      id: 1,
      costName: "Website",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 6,
      costType: "Sales, Marketing Cost",
    },
    {
      id: 2,
      costName: "Marketing",
      costValue: 500,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 36,
      costType: "Sales, Marketing Cost",
    },
    {
      id: 3,
      costName: "Rent",
      costValue: 1000,
      growthPercentage: 2,
      beginMonth: 1,
      endMonth: 36,
      costType: "General Administrative Cost",
    },
  ]);

  const [costData, setCostData] = useState([]);

  //PersonnelState
  const [personnelInputs, setPersonnelInputs] = useState([
    {
      id: 1,
      jobTitle: "Cashier",
      salaryPerMonth: 800,
      increasePerYear: 10,
      numberOfHires: 2,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    },
    {
      id: 2,
      jobTitle: "Manager",
      salaryPerMonth: 2000,
      increasePerYear: 10,
      numberOfHires: 1,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    },
  ]);
  const [personnelCostData, setPersonnelCostData] = useState([]);

  //InvestmentState
  const [investmentInputs, setInvestmentInputs] = useState([
    {
      id: 1,
      purchaseName: "Coffee machine",
      assetCost: 8000,
      quantity: 1,
      purchaseMonth: 2,
      residualValue: 10,
      usefulLifetime: 36,
    },

    {
      id: 2,
      purchaseName: "Table",
      assetCost: 200,
      quantity: 10,
      purchaseMonth: 1,
      residualValue: 10,
      usefulLifetime: 36,
    },
  ]);
  const [investmentData, setInvestmentData] = useState([]);
  const [investmentTableData, setInvestmentTableData] = useState([]);

  //LoanState

  const [loanInputs, setLoanInputs] = useState([
    {
      id: 1,
      loanName: "Banking loan",
      loanAmount: "150000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "12",
    },
  ]);

  const [loanData, setLoanData] = useState([]);

  const [loanTableData, setLoanTableData] = useState([]);

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
  // const downloadExcel = () => {
  //   const workBook = XLSX.utils.book_new();

  //   const convertDataToWorksheet = (data) => {
  //     return XLSX.utils.json_to_sheet(data);
  //   };

  //   const addSheetToWorkbook = (sheet, sheetName) => {
  //     XLSX.utils.book_append_sheet(workBook, sheet, sheetName);
  //   };

  //   // Example data conversion and sheet addition
  //   addSheetToWorkbook(
  //     convertDataToWorksheet(transformCostDataForTable()),
  //     "Costs"
  //   );
  //   addSheetToWorkbook(
  //     convertDataToWorksheet(transformPersonnelCostDataForTable()),
  //     "Personnel Costs"
  //   );
  //   addSheetToWorkbook(
  //     convertDataToWorksheet(transformInvestmentDataForTable()),
  //     "Investments"
  //   );
  //   addSheetToWorkbook(
  //     convertDataToWorksheet(transformLoanDataForTable()),
  //     "Loans"
  //   );
  //   //addSheetToWorkbook(convertDataToWorksheet(transposedData), 'Profit and Loss');

  //   // Write the workbook and trigger download
  //   const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

  //   function s2ab(s) {
  //     const buf = new ArrayBuffer(s.length);
  //     const view = new Uint8Array(buf);
  //     for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  //     return buf;
  //   }

  //   saveAs(
  //     new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
  //     "financial-data.xlsx"
  //   );
  // };

  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [temIsLoading, setTemIsLoading] = useState(true);

  useEffect(() => {
    setTemIsLoading(true);

    const tabs = [
      { tab: "customer", delay: 50 },
      { tab: "sales", delay: 50 },
      { tab: "cost", delay: 50 },
      { tab: "personnel", delay: 50 },
      { tab: "investment", delay: 50 },
      { tab: "loan", delay: 50 },
      { tab: "investment", delay: 50 },
      { tab: "overview", delay: 50 },
    ];

    let currentIndex = 0;

    const switchTabs = () => {
      setTimeout(() => {
        setActiveTab(tabs[currentIndex].tab);
        currentIndex++;
        if (currentIndex < tabs.length) {
          switchTabs();
        } else {
          setTemIsLoading(false);
        }
      }, tabs[currentIndex].delay);
    };

    switchTabs();
  }, [chatbotResponse]);

  return (
    <div>
      <AlertMsg />
      {isLoading ? (
        <ProgressBar isLoading={isLoading} />
      ) : (
        <>
          <LoadingButtonClick isLoading={temIsLoading} />
          <div className="w-full h-full flex flex-col lg:flex-row">
            <Gemini
              setIsLoading={setIsLoading}
              setChatbotResponse={setChatbotResponse}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </div>
          <div className="my-4">
            <ul className="py-4 flex justify-center items-center border-t-2">
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "overview" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("overview")}
              >
                Overview
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "customer" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("customer")}
              >
                Customer
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "sales" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("sales")}
              >
                Sales
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "cost" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("cost")}
              >
                Cost
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "personnel" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("personnel")}
              >
                Personnel
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "investment" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("investment")}
              >
                Investment
              </li>
              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "loan" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("loan")}
              >
                Loan
              </li>

              <li
                className={`cursor-pointer mr-4 ${
                  activeTab === "result" ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleTabChange("result")}
              >
                Result
              </li>
            </ul>
            <div>
              {activeTab === "overview" && (
                <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
                  <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
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

                  <div className="w-full lg:w-3/4 p-4">
                    <MetricsFM
                      yearlyAverageCustomers={yearlyAverageCustomers}
                      customerInputs={customerInputs}
                      yearlySales={yearlySales}
                      customerGrowthChart={customerGrowthChart}
                      revenue={revenue}
                    />
                  </div>
                </div>
              )}
              {activeTab === "customer" && (
                <CustomerSection
                  customerInputs={customerInputs}
                  setCustomerInputs={setCustomerInputs}
                  numberOfMonths={numberOfMonths}
                  customerGrowthData={customerGrowthData}
                  setCustomerGrowthData={setCustomerGrowthData}
                  channelNames={channelNames}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  yearlyAverageCustomers={yearlyAverageCustomers}
                  setYearlyAverageCustomers={setYearlyAverageCustomers}
                  customerGrowthChart={customerGrowthChart}
                  setCustomerGrowthChart={setCustomerGrowthChart}
                />
              )}
              {activeTab === "sales" && (
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
                  setRevenueData={setRevenueData}
                  setRevenueDeductionData={setRevenueDeductionData}
                  setCogsData={setCogsData}
                  setNetRevenueData={setNetRevenueData}
                  setGrossProfitData={setGrossProfitData}
                  customerGrowthData={customerGrowthData}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  yearlySales={yearlySales}
                  setYearlySales={setYearlySales}
                  revenue={revenue}
                  setRevenue={setRevenue}
                />
              )}
              {activeTab === "cost" && (
                <CostSection
                  costInputs={costInputs}
                  setCostInputs={setCostInputs}
                  numberOfMonths={numberOfMonths}
                  costData={costData}
                  setCostData={setCostData}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                />
              )}
              {activeTab === "personnel" && (
                <PersonnelSection
                  personnelInputs={personnelInputs}
                  setPersonnelInputs={setPersonnelInputs}
                  numberOfMonths={numberOfMonths}
                  personnelCostData={personnelCostData}
                  setPersonnelCostData={setPersonnelCostData}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                />
              )}
              {activeTab === "investment" && (
                <InvestmentSection
                  investmentInputs={investmentInputs}
                  setInvestmentInputs={setInvestmentInputs}
                  numberOfMonths={numberOfMonths}
                  investmentData={investmentData}
                  setInvestmentData={setInvestmentData}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  setInvestmentTableData={setInvestmentTableData}
                />
              )}
              {activeTab === "loan" && (
                <LoanSection
                  loanInputs={loanInputs}
                  setLoanInputs={setLoanInputs}
                  numberOfMonths={numberOfMonths}
                  loanData={loanData}
                  setLoanData={setLoanData}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  setLoanTableData={setLoanTableData}
                />
              )}
              {activeTab === "result" && (
                <ProfitAndLossSection
                  revenueData={revenueData}
                  revenueDeductionData={revenueDeductionData}
                  cogsData={cogsData}
                  costData={costData}
                  personnelCostData={personnelCostData}
                  investmentData={investmentData}
                  loanData={loanData}
                  numberOfMonths={numberOfMonths}
                  incomeTaxRate={incomeTax}
                  investmentTableData={investmentTableData}
                  loanTableData={loanTableData}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* <button onClick={downloadExcel} className="download-excel-button">
        Download Excel
      </button> */}
    </div>
  );
};

export default FinancialForm;
