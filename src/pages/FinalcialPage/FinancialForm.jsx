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
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDuration,
  setStartingCashBalance,
  setStatus,
  setIndustry,
  setIncomeTax,
  setPayrollTax,
  setCurrency,
  setFinancialProjectName,
} from "../../features/DurationSlice";
import {
  calculateCustomerGrowth,
  calculateYearlyAverage,
  setCustomerGrowthData,
  setCustomerInputs,
  setYearlyAverageCustomers,
} from "../../features/CustomerSlice";
import {
  calculateChannelRevenue,
  calculateYearlySales,
  setChannelInputs,
  setChannelNames,
  setYearlySales,
} from "../../features/SaleSlice";
import FundraisingSection from "./Components/FundraisingSections";

const FinancialForm = ({ currentUser, setCurrentUser }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  //DurationSection
  const {
    selectedDuration,
    startingCashBalance,
    status,
    industry,
    incomeTax,
    payrollTax,
    currency,
    startMonth,
    startYear,
    financialProjectName,
  } = useSelector((state) => state.durationSelect);

  const [numberOfMonths, setNumberOfMonths] = useState(0);

  useEffect(() => {
    // Chuyển đổi selectedDuration từ dạng "3 years" sang số
    const extractNumber = (durationString) => {
      const numberPattern = /\d+/; // Mẫu để trích xuất số từ chuỗi
      const matches = durationString.match(numberPattern); // Tìm các số trong chuỗi
      if (matches) {
        return Number(matches[0]); // Chuyển đổi số thành kiểu số
      }
      return 0; // Trả về 0 nếu không tìm thấy số trong chuỗi
    };

    const years = extractNumber(selectedDuration);
    const month = years * 12;
    setNumberOfMonths(month);
  }, [selectedDuration]);

  // Gemini
  const [chatbotResponse, setChatbotResponse] = useState("");
  // Gemini useEffect
  useEffect(() => {
    // Ensure chatbotResponse is only processed when it's a valid string
    if (!chatbotResponse || chatbotResponse.trim() === "") return;
    try {
      const data = JSON.parse(chatbotResponse);

      if (data.DurationSelect)
        dispatch(setSelectedDuration(data.DurationSelect.selectedDuration));
      dispatch(setStartingCashBalance(data.DurationSelect.startingCashBalance));
      dispatch(setStatus(data.DurationSelect.status));
      dispatch(setIndustry(data.DurationSelect.industry));
      dispatch(setIncomeTax(data.DurationSelect.incomeTax));
      dispatch(setPayrollTax(data.DurationSelect.payrollTax));
      dispatch(setCurrency(data.DurationSelect.currency));
      if (data.CustomerSection)
        dispatch(setCustomerInputs(data.CustomerSection.customerInputs));
      if (data.SalesSection)
        dispatch(setChannelInputs(data.SalesSection.channelInputs));
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

  const { customerInputs } = useSelector((state) => state.customer);

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
  const { channelInputs } = useSelector((state) => state.sales);
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
    dispatch(setChannelNames(updatedChannelNames));
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
      residualValue: 0,
      usefulLifetime: 36,
    },

    {
      id: 2,
      purchaseName: "Table",
      assetCost: 200,
      quantity: 10,
      purchaseMonth: 1,
      residualValue: 0,
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
      loanAmount: "30000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "12",
    },
    {
      id: 2,
      loanName: "Startup loan",
      loanAmount: "20000",
      interestRate: "3",
      loanBeginMonth: "6",
      loanEndMonth: "24",
    },
  ]);

  const [loanData, setLoanData] = useState([]);

  const [loanTableData, setLoanTableData] = useState([]);

  // Fundraising State
  const [fundraisingInputs, setFundraisingInputs] = useState([
    {
      id: 1,
      name: "",
      fundraisingAmount: 0,
      fundraisingType: "Common Stock",
      fundraisingBeginMonth: 1,
      equityOffered: 0,
    },
  ]);

  const [fundraisingTableData, setFundraisingTableData] = useState([]);

  // Lưu vào DB

  const { user } = useAuth();
  const loadData = async (userId) => {
    const { data, error } = await supabase
      .from("finance")
      .select("inputData")
      .eq("user_id", userId);
    if (error) {
      toast.error(error.message);
      console.error("Error fetching data", error);
      return null;
    }

    return data.length > 0 ? JSON.parse(data[0]?.inputData) : null;
  };

  useEffect(() => {
    // Assuming `user` is your user object
    const userId = user?.id;
    if (userId) {
      loadData(userId).then((inputData) => {
        if (inputData) {
          // Set your state here

          dispatch(
            setFinancialProjectName(
              inputData.financialProjectName || financialProjectName
            )
          );
          dispatch(
            setSelectedDuration(inputData.selectedDuration || selectedDuration)
          );

          dispatch(
            setStartingCashBalance(
              inputData.startingCashBalance || startingCashBalance
            )
          );
          dispatch(setStatus(inputData.status || status));
          dispatch(setIndustry(inputData.industry || industry));
          dispatch(setIncomeTax(inputData.incomeTax || incomeTax));
          dispatch(setPayrollTax(inputData.payrollTax || payrollTax));
          dispatch(setCurrency(inputData.currency || currency));

          dispatch(
            setCustomerInputs(inputData.customerInputs || customerInputs)
          );
          dispatch(setChannelInputs(inputData.channelInputs || channelInputs));
          setCostInputs(inputData.costInputs || costInputs);
          setPersonnelInputs(inputData.personnelInputs || personnelInputs);
          setInvestmentInputs(inputData.investmentInputs || investmentInputs);
          setLoanInputs(inputData.loanInputs || loanInputs);
          setFundraisingInputs(
            inputData.fundraisingInputs || fundraisingInputs
          );
        }
      });
    }
  }, [user?.id]);

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      numberOfMonths
    );

    dispatch(setCustomerGrowthData(calculatedData));

    const averages = calculateYearlyAverage(calculatedData, numberOfMonths);
    dispatch(setYearlyAverageCustomers(averages));

    const { revenueByChannelAndProduct } = dispatch(
      calculateChannelRevenue(
        numberOfMonths,
        calculatedData,
        customerInputs,
        channelInputs
      )
    );

    const yearlySale = calculateYearlySales(revenueByChannelAndProduct);
    dispatch(setYearlySales(yearlySale));

    const seriesData = calculatedData.map((channelData) => {
      return {
        name: channelData[0]?.channelName || "Unknown Channel",
        data: channelData.map((data) => data.customers),
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));

    const seriesSaleData = Object.entries(revenueByChannelAndProduct).map(
      ([key, data]) => {
        return { name: key, data };
      }
    );

    setRevenue((prevState) => ({ ...prevState, series: seriesSaleData }));
  }, [numberOfMonths, customerInputs, channelInputs]);

  const saveOrUpdateFinanceData = async (userId, inputData) => {
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
          // Cập nhật bản ghi hiện có

          const { error: updateError } = await supabase
            .from("finance")
            .update({ name: inputData.financialProjectName, inputData })
            .eq("id", financeRecord?.id)
            .select();

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
        const { error: insertError } = await supabase.from("finance").insert([
          {
            user_id: userId,
            name: inputData.financialProjectName,
            user_email: user.email,
            inputData,
          },
        ]);
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
    }
  };

  const handleSubmit = async () => {
    const financeData = {
      selectedDuration,
      startingCashBalance,
      status,
      industry,
      incomeTax,
      payrollTax,
      currency,
      startMonth,
      startYear,
      financialProjectName,
      customerInputs,
      channelInputs,
      costInputs,
      personnelInputs,
      investmentInputs,
      loanInputs,
      fundraisingInputs,
    };

    await saveOrUpdateFinanceData(user?.id, financeData);

    // Handle post-save actions
  };

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
      { tab: "customer", delay: 100 },
      { tab: "sales", delay: 100 },
      { tab: "cost", delay: 100 },
      { tab: "sales", delay: 100 },
      { tab: "personnel", delay: 100 },
      { tab: "investment", delay: 100 },
      { tab: "loan", delay: 100 },
      { tab: "fundraising", delay: 100 },
      { tab: "investment", delay: 100 },
      { tab: "fundraising", delay: 100 },
      { tab: "overview", delay: 100 },
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
          <div className="my-4 ">
            <div className="overflow-x-auto whitespace-nowrap border-t-2">
              <ul className="py-4 flex sm:justify-center justify-start items-center">
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
                    activeTab === "fundraising" ? "border-b-2 border-black" : ""
                  }`}
                  onClick={() => handleTabChange("fundraising")}
                >
                  Fundraising
                </li>

                <li
                  className={`cursor-pointer mr-4 ${
                    activeTab === "result" ? "border-b-2 border-black" : ""
                  }`}
                  onClick={() => handleTabChange("result")}
                >
                  Financial Statements
                </li>
              </ul>
            </div>

            <div>
              {activeTab === "overview" && (
                <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
                  <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
                    <DurationSelect handleSubmit={handleSubmit} />
                  </div>

                  <div className="w-full lg:w-3/4 p-4">
                    <MetricsFM
                      customerGrowthChart={customerGrowthChart}
                      revenue={revenue}
                    />
                  </div>
                </div>
              )}
              {activeTab === "customer" && (
                <CustomerSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  customerGrowthChart={customerGrowthChart}
                  setCustomerGrowthChart={setCustomerGrowthChart}
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "sales" && (
                <SalesSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  revenue={revenue}
                  setRevenue={setRevenue}
                  handleSubmit={handleSubmit}
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
                  handleSubmit={handleSubmit}
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
                  handleSubmit={handleSubmit}
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
                  handleSubmit={handleSubmit}
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
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "fundraising" && (
                <FundraisingSection
                  fundraisingInputs={fundraisingInputs}
                  setFundraisingInputs={setFundraisingInputs}
                  fundraisingTableData={fundraisingTableData}
                  setFundraisingTableData={setFundraisingTableData}
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}

              {activeTab === "result" && (
                <ProfitAndLossSection
                  costData={costData}
                  personnelCostData={personnelCostData}
                  investmentData={investmentData}
                  loanData={loanData}
                  numberOfMonths={numberOfMonths}
                  investmentTableData={investmentTableData}
                  loanTableData={loanTableData}
                  startingCashBalance={startingCashBalance}
                  fundraisingInputs={fundraisingInputs}
                  fundraisingTableData={fundraisingTableData}
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
