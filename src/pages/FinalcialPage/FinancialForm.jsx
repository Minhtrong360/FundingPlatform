import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Joyride, { STATUS, CallBackProps, Step } from "react-joyride";
import { FileOutlined, QuestionCircleOutlined } from "@ant-design/icons";

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

import ProgressBar from "../../components/ProgressBar";
import Gemini from "./Components/Gemini";
import MetricsFM from "./Components/MetricsFM";
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
import { formatNumber, setCostInputs } from "../../features/CostSlice";
import { setPersonnelInputs } from "../../features/PersonnelSlice";
import { setInvestmentInputs } from "../../features/InvestmentSlice";
import { setLoanInputs } from "../../features/LoanSlice";
import { setFundraisingInputs } from "../../features/FundraisingSlice";
import CashFlowSection from "./Components/CashFlowSection";
import { Button, FloatButton, Modal, message } from "antd";
import { useParams } from "react-router-dom";
import AnnounceFMPage from "./Components/AnnounceFMPage";

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
        dispatch(
          setCustomerInputs(
            data.CustomerSection.customerInputs.map((input) => ({
              ...input,
              customerGrowthFrequency: "Annually",
            }))
          )
        );
      if (data.SalesSection)
        dispatch(setChannelInputs(data.SalesSection.channelInputs));
      if (data.CostSection)
        dispatch(
          setCostInputs(
            data.CostSection.costInputs.map((input) => ({
              ...input,
              costType: "General Administrative Cost",
              growthFrequency: "Annually",
            }))
          )
        );
      if (data.PersonnelSection)
        dispatch(
          setPersonnelInputs(
            data.PersonnelSection.personnelInputs.map((input) => ({
              ...input,
              growthSalaryFrequency: "Annually",
            }))
          )
        );
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

  const { customerInputs } = useSelector((state) => state.customer);

  const [customerGrowthChart, setCustomerGrowthChart] = useState({
    options: {
      chart: {
        fontFamily: "Sora, sans-serif",
        zoom: {
          enabled: false, // Disable zooming
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        },
        id: "customer-growth-chart",
        type: "area",
        height: 350,
        stacked: false,

        animations: {
          enabled: false,
        },
      },

      xaxis: {
        axisTicks: {
          show: false, // Hide x-axis ticks
        },
        labels: {
          show: true,
          rotate: 0,
          style: {
            fontFamily: "Sora, sans-serif",
          },
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startMonth + i - 1) % 12;
          const year = startYear + Math.floor((startMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontSize: "12px",
            fontFamily: "Sora, sans-serif",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true, // Show y-axis line
        },

        labels: {
          style: {
            fontFamily: "Sora, sans-serif",
          },
          show: true,
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Customers",
          style: {
            fontFamily: "Sora, sans-serif",
            fontSize: "12px",
          },
        },
      },

      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      
      grid: {
        show: false,
      },

      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          borderRadius: 2,
          // columnWidth: '50%',
        },
      },
    },
    series: [],
  });

  //RevenueState
  const { channelInputs } = useSelector((state) => state.sales);
  const [revenue, setRevenue] = useState({
    options: {
      chart: {
        fontFamily: "Sora, sans-serif",
        id: "revenue-chart",
        type: "bar",
        height: 350,
        stacked: true,
        zoom: {
          enabled: false, // Disable zooming
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        },
        animations: {
          enabled: false,
        },
      },
      grid: {
        show: false,
      },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
    
      xaxis: {
        axisTicks: {
          show: false, // Hide x-axis ticks
        },
        labels: {
          show: true,
          rotate: 0,
          style: {
            fontFamily: "Sora, sans-serif",
          },
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startMonth + i - 1) % 12;
          const year = startYear + Math.floor((startMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontSize: "12px",
            fontFamily: "Sora, sans-serif",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true, // Show y-axis line
        },

        labels: {
          show: true,
          style: {
            fontFamily: "Sora, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Amount ($)",
          style: {
            fontSize: "12px",
            fontFamily: "Sora, sans-serif",
          },
        },
      },

      dataLabels: { enabled: false },
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

    return data.length > 0 ? data : null;
  };

  useEffect(() => {
    setTemIsLoading(true);
    // Assuming `user` is your user object

    loadData().then((dataFetched) => {
      if (JSON.parse(dataFetched[0]?.inputData)) {
        const inputData = JSON.parse(dataFetched[0]?.inputData);
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

        dispatch(setCustomerInputs(inputData.customerInputs || customerInputs));
        dispatch(setChannelInputs(inputData.channelInputs || channelInputs));
        dispatch(setCostInputs(inputData.costInputs || costInputs));
        dispatch(
          setPersonnelInputs(inputData.personnelInputs || personnelInputs)
        );
        dispatch(
          setInvestmentInputs(inputData.investmentInputs || investmentInputs)
        );
        dispatch(setLoanInputs(inputData.loanInputs || loanInputs));
        dispatch(
          setFundraisingInputs(inputData.fundraisingInputs || fundraisingInputs)
        );
      }

      setTemIsLoading(false);
    });
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
        dataBegin: channelData.map((data) => parseInt(data.begin, 10)),
        dataAdd: channelData.map((data) => parseInt(data.add, 10)),
        dataChurn: channelData.map((data) => parseInt(data.churn, 10)),
        dataEnd: channelData.map((data) => parseInt(data.end, 10)),
        data: channelData.map((data) => parseInt(data.customers, 10)),
      };
    });

    const totalCustomersPerMonth = seriesData.reduce((acc, channel) => {
      channel.data.forEach((customers, index) => {
        if (!acc[index]) {
          acc[index] = 0;
        }
        acc[index] += customers;
      });
      return acc;
    }, []);

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: [
        ...seriesData,
        {
          name: "Total",
          data: totalCustomersPerMonth,
        },
      ],
    }));

    const seriesSaleData = Object.entries(revenueByChannelAndProduct).map(
      ([key, data]) => {
        return { name: key, data };
      }
    );

    const totalSalesData = seriesSaleData.reduce((acc, channel) => {
      channel.data.forEach((amount, index) => {
        if (!acc[index]) acc[index] = 0;
        acc[index] += amount;
      });
      return acc;
    }, Array(numberOfMonths).fill(0));

    setRevenue((prevState) => ({
      ...prevState,
      series: [...seriesSaleData, { name: "Total", data: totalSalesData }],
    }));
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

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

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

            <div className="">
              {activeTab === "overview" && (
                <div className="w-full h-full flex flex-col lg:flex-row ">
                  {/* <div className="w-full lg:w-1/4 sm:p-4 p-0 "> */}

                  <div className="w-full xl:w-3/4 sm:p-4 p-0">
                    <h2
                      className="text-lg font-semibold mb-7 flex items-center"
                      id="duration-heading"
                    >
                      Overview
                    </h2>
                    <MetricsFM
                      customerGrowthChart={customerGrowthChart}
                      revenue={revenue}
                      numberOfMonths={numberOfMonths}
                    />
                  </div>
                  <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block ">
                    <DurationSelect handleSubmit={handleSubmit} />
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
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<FileOutlined />}
                      />
                    </FloatButton>
                  </div>

                  {isInputFormOpen && (
                    <Modal
                      // title="Customer channel"
                      visible={isInputFormOpen}
                      onOk={() => {
                        handleSubmit();
                        setIsInputFormOpen(false);
                      }}
                      onCancel={() => {
                        setIsInputFormOpen(false);
                      }}
                      okText="Save"
                      cancelText="Close"
                      cancelButtonProps={{
                        style: {
                          borderRadius: "0.375rem",
                          cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
                        },
                      }}
                      okButtonProps={{
                        style: {
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
                      <DurationSelect
                        handleSubmit={handleSubmit}
                        isInputFormOpen="Ok"
                      />
                    </Modal>
                  )}
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
