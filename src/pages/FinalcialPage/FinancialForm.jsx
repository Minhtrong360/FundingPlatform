import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Joyride, { STATUS, CallBackProps, Step } from "react-joyride";
import { QuestionCircleOutlined } from "@ant-design/icons";

import DurationSelect from "./Components/DurationSelect";
import CustomerSection from "./Components/CustomerSection";
import SalesSection from "./Components/SalesSection";
import CostSection from "./Components/CostSection";
import PersonnelSection from "./Components/PersonnelSection";
import InvestmentSection from "./Components/InvestmentSection";
import LoanSection from "./Components/LoanSection";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

// import { toast } from "react-toastify";
import AlertMsg from "../../components/AlertMsg";
import ProgressBar from "../../components/ProgressBar";
import Gemini from "./Components/Gemini";
import GPTAnalyzer from "./Components/GPTAnalyzer";
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
  setCutMonth,
  setStartMonth,
  setStartYear,
} from "../../features/DurationSlice";
import {
  calculateCustomerGrowth,
  calculateYearlyAverage,
  generateCustomerTableData,
  setCustomerGrowthData,
  setCustomerInputs,
  setCustomerTableData,
  setYearlyAverageCustomers,
  transformCustomerData,
} from "../../features/CustomerSlice";
import {
  calculateChannelRevenue,
  calculateYearlySales,
  setChannelInputs,
  setChannelNames,
  setRevenueTableData,
  setYearlySales,
  transformRevenueDataForTable,
} from "../../features/SaleSlice";
import FundraisingSection from "./Components/FundraisingSections";
import { setCostInputs } from "../../features/CostSlice";
import { setPersonnelInputs } from "../../features/PersonnelSlice";
import { setInvestmentInputs } from "../../features/InvestmentSlice";
import { setLoanInputs } from "../../features/LoanSlice";
import { setFundraisingInputs } from "../../features/FundraisingSlice";
import CashFlowSection from "./Components/CashFlowSection";
import { message } from "antd";
import { useParams } from "react-router-dom";
import Groq from "./Components/Groq";

const FinancialForm = ({ currentUser, setCurrentUser }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [temIsLoading, setTemIsLoading] = useState(true);
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
    cutMonth,
  } = useSelector((state) => state.durationSelect);

  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);

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
        // dispatch(setSelectedDuration(data.DurationSelect.selectedDuration));
        dispatch(
          setStartingCashBalance(data.DurationSelect.startingCashBalance)
        );
      dispatch(setStatus(data.DurationSelect.status));
      // dispatch(setIndustry(data.DurationSelect.industry));
      // dispatch(setStartMonth(data.DurationSelect.startMonth));
      // dispatch(setStartYear(data.DurationSelect.startYear));
      dispatch(setIncomeTax(data.DurationSelect.incomeTax));
      dispatch(setPayrollTax(data.DurationSelect.payrollTax));
      dispatch(setCurrency("USD"));
      dispatch(setCutMonth(data.DurationSelect.cutMonth));
      if (data.CustomerSection)
        dispatch(setCustomerInputs(data.CustomerSection.customerInputs));
      if (data.SalesSection)
        dispatch(setChannelInputs(data.SalesSection.channelInputs));
      if (data.CostSection)
        dispatch(
          setCostInputs(
            data.CostSection.costInputs.map((input) => ({
              ...input,
              costType: "General Administrative Cost",
            }))
          )
        );
      if (data.PersonnelSection)
        dispatch(setPersonnelInputs(data.PersonnelSection.personnelInputs));
      if (data.InvestmentSection)
        dispatch(setInvestmentInputs(data.InvestmentSection.investmentInputs));
      if (data.LoanSection)
        dispatch(setLoanInputs(data.LoanSection.loanInputs));
      if (data.FundraisingSection) {
        dispatch(
          setFundraisingInputs(
            data.FundraisingSection.fundraisingInputs.map((input) => ({
              ...input,
              fundraisingType: "Common Stock",
            }))
          )
        );
      }
      setIsLoading(false);
      setTimeout(() => {
        setSpinning(false);
      }, 1000);
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
        type: "area",
        height: 350,
        stacked: false,
        zoom: {
          enabled: false, 
        },
        toolbar: {
          show: false, 
        },
        animations: {
          enabled: false, 
        },
      },

      xaxis: {
        range:5,
        axisTicks: {
          show: false, 
        },
        labels: {
          show: true, 
            style: {
              
              fontSize: "12px",
              fontFamily: "Sora, sans-serif",
              fontWeight: "600",
            },
      
        },
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
          
          },
        },
      },
      yaxis: {
        
          axisBorder: {
            show: true, // Show y-axis line
          },
          
            
        labels: {
          show: true,
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: { text: "Number of Customers" },
        style: {
          fontFamily: "Sora, sans-serif",
          fontWeight: "600",
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: {
        type: "gradient",
        
        gradient: {
          shade: "light",
          shadeIntensity: 0.75,
          opacityFrom: 0.8,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      grid: {
        show: false,
      },
     
        
      colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
      dataLabels: { enabled: false },
      
    },
    series: [],
  });

  //RevenueState
  const { channelInputs } = useSelector((state) => state.sales);
  const [revenue, setRevenue] = useState({
    options: {
      chart: { id: "revenue-chart", type: "bar", height: 350, stacked: true, zoom: {
        enabled: false, // Disable zooming
      },
      toolbar: {
        show: false, // Hide the toolbar
      } },
      grid : {
        show : false
      },
      colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
      fill: {
        type: "gradient",
        
        gradient: {
          shade: "light",
          shadeIntensity: 0.75,
          opacityFrom: 0.8,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        axisTicks: {
          show: false, // Hide x-axis ticks
        },
        labels: {
          show: true, // Hide x-axis labels
          style: {
            fontSize: '12px',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 400,
            cssClass: 'apexcharts-xaxis-label',
          }
        },
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
          },
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true, // Show y-axis line
        },
       
        labels: {
          show: false,
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: {
          text: "Amount ($)",
          style: {
            fontFamily: "Sora, sans-serif",
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
  const { costInputs } = useSelector((state) => state.cost);

  //PersonnelState

  const { personnelInputs } = useSelector((state) => state.personnel);

  //InvestmentState
  const { investmentInputs } = useSelector((state) => state.investment);

  //LoanState

  const { loanInputs } = useSelector((state) => state.loan);

  // Fundraising State

  const { fundraisingInputs } = useSelector((state) => state.fundraising);
  // Lưu vào DB
  const { id } = useParams();
  const { user } = useAuth();

  const loadData = async () => {
    const { data, error } = await supabase
      .from("finance")
      .select("*")
      .eq("id", id);

    if (error) {
      message.error(error.message);
      console.error("Error fetching data", error);
      return null;
    }

    return data.length > 0 ? JSON.parse(data[0]?.inputData) : null;
  };

  useEffect(() => {
    setTemIsLoading(true);
    // Assuming `user` is your user object

    loadData().then((inputData) => {
      if (inputData) {
        // Set your state here
        dispatch(
          setFinancialProjectName(
            inputData.financialProjectName || financialProjectName
          )
        );
        dispatch(setSelectedDuration(inputData.selectedDuration || "3 years"));

        dispatch(setStartingCashBalance(inputData.startingCashBalance || 0));
        dispatch(setStatus(inputData.status || "active"));
        dispatch(setIndustry(inputData.industry || "Technology"));
        dispatch(setIncomeTax(inputData.incomeTax || 0));
        dispatch(setPayrollTax(inputData.payrollTax || 0));
        dispatch(setCurrency(inputData.currency || "USD"));
        dispatch(setCutMonth(inputData.cutMonth || 4));
        dispatch(
          setStartMonth(inputData.startMonth || new Date().getMonth() + 1)
        );
        dispatch(setStartYear(inputData.startYear || new Date().getFullYear()));

        dispatch(
          setCustomerInputs(
            inputData.customerInputs || [
              {
                id: 1,
                customersPerMonth: 300,
                growthPerMonth: 1,
                customerGrowthFrequency: "Monthly",
                channelName: "Online",
                beginMonth: 1,
                endMonth: 36,
                beginCustomer: 0,
                churnRate: 0,
                acquisitionCost: 0, // Default value for acquisition cost
              },
              {
                id: 2,
                customersPerMonth: 400,
                growthPerMonth: 2,
                customerGrowthFrequency: "Monthly",
                channelName: "Offline",
                beginMonth: 1,
                endMonth: 36,
                beginCustomer: 0,
                churnRate: 0,
                acquisitionCost: 0, // Default value for acquisition cost
              },
            ]
          )
        );
        dispatch(
          setChannelInputs(
            inputData.channelInputs || [
              {
                id: 1,
                productName: "Coffee",
                price: 4,
                multiples: 1,
                deductionPercentage: 5,
                cogsPercentage: 30,
                selectedChannel: "Offline",
                channelAllocation: 0.4,
              },
              {
                id: 2,
                productName: "Cake",
                price: 8,
                multiples: 1,
                deductionPercentage: 4,
                cogsPercentage: 35,
                selectedChannel: "Offline",
                channelAllocation: 0.3,
              },
              {
                id: 3,
                productName: "Coffee Bag",
                price: 6,
                multiples: 1,
                deductionPercentage: 6,
                cogsPercentage: 25,
                selectedChannel: "Online",
                channelAllocation: 0.6,
              },
            ]
          )
        );
        dispatch(
          setCostInputs(
            inputData.costInputs || [
              {
                id: 1,
                costName: "Website",
                costValue: 1000,
                growthPercentage: 5,
                beginMonth: 1,
                endMonth: 6,
                growthFrequency: "Monthly",
                costType: "Sales, Marketing Cost",
              },
              {
                id: 2,
                costName: "Marketing",
                costValue: 500,
                growthPercentage: 10,
                beginMonth: 1,
                endMonth: 36,
                growthFrequency: "Annually",
                costType: "Sales, Marketing Cost",
              },
              {
                id: 3,
                costName: "Rent",
                costValue: 1000,
                growthPercentage: 4,
                beginMonth: 1,
                endMonth: 36,
                growthFrequency: "Annually",
                costType: "General Administrative Cost",
              },
            ]
          )
        );
        dispatch(
          setPersonnelInputs(
            inputData.personnelInputs || [
              {
                id: 1,
                jobTitle: "Cashier",
                salaryPerMonth: 800,
                increasePerYear: 10,
                growthSalaryFrequency: "Annually",
                numberOfHires: 2,
                jobBeginMonth: 1,
                jobEndMonth: 36,
              },
              {
                id: 2,
                jobTitle: "Manager",
                salaryPerMonth: 2000,
                increasePerYear: 10,
                growthSalaryFrequency: "Annually",
                numberOfHires: 1,
                jobBeginMonth: 1,
                jobEndMonth: 36,
              },
            ]
          )
        );
        dispatch(
          setInvestmentInputs(
            inputData.investmentInputs || [
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
            ]
          )
        );
        dispatch(
          setLoanInputs(
            inputData.loanInputs || [
              {
                id: 1,
                loanName: "Banking loan",
                loanAmount: "30000",
                interestRate: "6",
                loanBeginMonth: "1",
                loanEndMonth: "36",
              },
              {
                id: 2,
                loanName: "Startup loan",
                loanAmount: "20000",
                interestRate: "3",
                loanBeginMonth: "1",
                loanEndMonth: "36",
              },
            ]
          )
        );
        dispatch(
          setFundraisingInputs(
            inputData.fundraisingInputs || [
              {
                id: 1,
                name: "",
                fundraisingAmount: 0,
                fundraisingType: "Common Stock",
                fundraisingBeginMonth: 1,
                equityOffered: 0,
              },
            ]
          )
        );
      }
    });

    setTemIsLoading(false);
  }, [id]);

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

  const saveOrUpdateFinanceData = async (inputData) => {
    try {
      const { data: existingData, error: selectError } = await supabase
        .from("finance")
        .select("*")
        .eq("id", id);

      if (selectError) throw selectError;

      if (existingData.length > 0) {
        const financeRecord = existingData[0];

        // Kiểm tra nếu tác giả của dữ liệu tài chính trùng với userId
        if (financeRecord.user_id === user.id) {
          // Cập nhật bản ghi hiện có

          const { error: updateError } = await supabase
            .from("finance")
            .update({ name: inputData.financialProjectName, inputData })
            .eq("id", financeRecord?.id)
            .select();

          if (updateError) {
            message.error(updateError.message);
          } else {
            message.success("Updated successfully.");
          }
        } else {
          message.error("You do not have permission to update this record.");
        }
      } else {
        // Thêm bản ghi mới
        const { error: insertError } = await supabase.from("finance").insert([
          {
            user_id: user.id,
            name: inputData.financialProjectName,
            user_email: user.email,
            inputData,
          },
        ]);
        if (insertError) {
          message.error(insertError.message);
        } else {
          message.success("Inserted successfully.");
        }
      }
    } catch (error) {
      message.error(error.message);
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
      cutMonth,
      customerInputs,
      channelInputs,
      costInputs,
      personnelInputs,
      investmentInputs,
      loanInputs,
      fundraisingInputs,
      yearlyAverageCustomers,
      yearlySales,
    };

    await saveOrUpdateFinanceData(financeData);

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

  // Download JSON

  // Chuẩn bị file cần down

  const downloadJSON = () => {};

  // Kết thúc down JSON

  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(false); // Initialize Joyride on component mount
  }, []);

  const handleJoyrideCallback = (data) => {
    if (data.status === "finished" || data.status === "skipped") {
      setRun(false);
    }
  };

  const startTour = () => {
    setRun(true);
  };

  return (
    <div className="min-h-screen">
      {/* <div>
        <Joyride
          steps={[
            {
              target: ".cursor-pointer-overview",
              content:
                "This is the Overview tab. It provides a summary of your financial data.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-customer",
              content:
                "This is the Customer tab. It allows you to manage customer-related data.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-sales",
              content:
                "This is the Sales tab. It helps you track your sales performance.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-cost",
              content:
                "This is the Cost tab. It helps you analyze your costs and expenses.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-personnel",
              content:
                "This is the Personnel tab. It allows you to manage your workforce.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-investment",
              content:
                "This is the Investment tab. It helps you track your investments.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-loan",
              content:
                "This is the Loan tab. It allows you to manage your loans and debts.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-fundraising",
              content:
                "This is the Fundraising tab. It helps you manage fundraising activities.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-profitAndLoss",
              content:
                "This is the Profit and Loss tab. It provides insights into your profitability.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-cashFlow",
              content:
                "This is the Cash Flow tab. It helps you monitor your cash flow.",
              disableBeacon: true,
            },
            {
              target: ".cursor-pointer-balanceSheet",
              content:
                "This is the Balance Sheet tab. It provides an overview of your financial position.",
              disableBeacon: true,
            },
          ]}
          run={run}
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          disableOverlayClose
          disableScrolling
          disableCloseOnEsc
          callback={handleJoyrideCallback}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
      </div> */}

      <AlertMsg />
      {spinning ? (
        <ProgressBar spinning={spinning} isLoading={isLoading} />
      ) : (
        <>
          {temIsLoading && <LoadingButtonClick isLoading={temIsLoading} />}
          <div className="w-full h-full flex flex-col lg:flex-row">
            <Gemini
              setIsLoading={setIsLoading}
              setChatbotResponse={setChatbotResponse}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              spinning={spinning}
              setSpinning={setSpinning}
            />
          </div>
          {/* <div>
            <Groq />
          </div> */}
          {/* <div>
            <GPTAnalyzer numberOfMonths={numberOfMonths} />
          </div> */}
          <div className="my-4 ">
            {/* <div className="rounded-lg bg-green-500 text-white shadow-lg p-4 mr-4 w-10 py-2 mb-4 flex items-center justify-center">
              <button onClick={startTour}>
                <QuestionCircleOutlined />
              </button>
            </div> */}
            <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm">
              <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "overview" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("overview")}
                >
                  Overview
                </li>
                {/* Repeat for other tabs */}
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "customer" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("customer")}
                >
                  Customer
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "sales" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("sales")}
                >
                  Sales
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "cost" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("cost")}
                >
                  Cost
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "personnel" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("personnel")}
                >
                  Personnel
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "investment" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("investment")}
                >
                  Investment
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "loan" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("loan")}
                >
                  Loan
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "fundraising" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("fundraising")}
                >
                  Fundraising
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "profitAndLoss"
                      ? "bg-yellow-300 font-bold"
                      : ""
                  }`}
                  onClick={() => handleTabChange("profitAndLoss")}
                >
                  Profit and Loss
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "cashFlow" ? "bg-yellow-300 font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("cashFlow")}
                >
                  Cash Flow
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                    activeTab === "balanceSheet"
                      ? "bg-yellow-300 font-bold"
                      : ""
                  }`}
                  onClick={() => handleTabChange("balanceSheet")}
                >
                  Balance Sheet
                </li>
              </ul>
            </div>

            <div>
              {activeTab === "overview" && (
                <div className="w-full h-full flex flex-col lg:flex-row ">
                  {/* <div className="w-full lg:w-1/4 sm:p-4 p-0 "> */}
                  <div className="w-full lg:w-1/4 sm:p-4 p-0 ">
                    <DurationSelect handleSubmit={handleSubmit} />
                  </div>

                  <div className="w-full lg:w-3/4 sm:p-4 p-0">
                    <MetricsFM
                      customerGrowthChart={customerGrowthChart}
                      revenue={revenue}
                      numberOfMonths={numberOfMonths}
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
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "personnel" && (
                <PersonnelSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "investment" && (
                <InvestmentSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "loan" && (
                <LoanSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}
              {activeTab === "fundraising" && (
                <FundraisingSection
                  numberOfMonths={numberOfMonths}
                  isSaved={isSaved}
                  setIsSaved={setIsSaved}
                  handleSubmit={handleSubmit}
                />
              )}

              {activeTab === "profitAndLoss" && (
                <ProfitAndLossSection numberOfMonths={numberOfMonths} />
              )}
              {activeTab === "cashFlow" && (
                <CashFlowSection numberOfMonths={numberOfMonths} />
              )}
              {activeTab === "balanceSheet" && (
                <BalanceSheetSection numberOfMonths={numberOfMonths} />
              )}
            </div>
          </div>
        </>
      )}

      {/* <button onClick={downloadExcel} className="download-excel-button">
        Download Excel
      </button> */}
      {/* <button onClick={downloadJSON} className="download-excel-button">
        Download Excel
      </button> */}
    </div>
  );
};

export default FinancialForm;
