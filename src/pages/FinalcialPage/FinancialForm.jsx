import React, { useState, useEffect } from "react";
// import { saveAs } from "file-saver";
// import Joyride, { STATUS, CallBackProps, Step } from "react-joyride";
import { CheckCircleOutlined } from "@ant-design/icons";

import DurationSelect from "./Components/DurationSelect";
import CustomerSection from "./Components/CustomerSection";
import SalesSection from "./Components/SalesSection";
import CostSection from "./Components/CostSection";
import PersonnelSection from "./Components/PersonnelSection";
import InvestmentSection from "./Components/InvestmentSection";
import LoanSection from "./Components/LoanSection";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import ProgressBar from "../../components/ProgressBar";
import Gemini from "./Components/Gemini";
import MetricsFM from "./Components/MetricsFM";
import ProfitAndLossSection from "./Components/ProfitAndLossSection";
// import * as XLSX from "xlsx";
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
  setDescription,
  setLocation,
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
import { formatNumber, setCostInputs } from "../../features/CostSlice";
import { setPersonnelInputs } from "../../features/PersonnelSlice";
import { setInvestmentInputs } from "../../features/InvestmentSlice";
import { setLoanInputs } from "../../features/LoanSlice";
import { setFundraisingInputs } from "../../features/FundraisingSlice";
import CashFlowSection from "./Components/CashFlowSection";
import { Modal, message } from "antd";
import { useParams } from "react-router-dom";
// import AnnounceFMPage from "./Components/AnnounceFMPage";
// import Perflexity from "./Components/Perflexity";
import SpinnerBtn from "../../components/SpinnerBtn";
import DraggableChart from "./Components/DraggableChart";

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
    description,
    location,
  } = useSelector((state) => state.durationSelect);
  // const generatePrompt = () => {
  //   return `Given ${description} and ${location}, list all facts and figures related to the revenue, cost, personnel, margin, salary related to in bullet points. Each bullet points no more than 10 words. `;
  // };
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
    try {
      // Ensure chatbotResponse is only processed when it's a valid string
      if (!chatbotResponse || chatbotResponse.trim() === "") return;
      const data = JSON?.parse(chatbotResponse);

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
          },
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
          },
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
      .map((input) => ({
        id: input.id,
        channelName: input.channelName,
      }))
      .filter(
        (item, index, self) =>
          item.channelName &&
          self.findIndex((i) => i.channelName === item.channelName) === index
      );
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
        dispatch(setDescription(inputData.description || ""));
        dispatch(setLocation(inputData.location || ""));
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
                acquisitionCost: 0,
                localGrowthRate: 1,
                eventName: "",
                eventBeginMonth: 1,
                eventEndMonth: 36,
                additionalInfo: "",
                applyAdditionalInfo: false,
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
                acquisitionCost: 0,
                localGrowthRate: 1,
                eventName: "",
                eventBeginMonth: 1,
                eventEndMonth: 36,
                additionalInfo: "",
                applyAdditionalInfo: false,
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
                selectedChannel: { id: 1, channelName: "Online" },
                channelAllocation: 0.4,
                daysGetPaid: 0,
              },
              {
                id: 2,
                productName: "Cake",
                price: 8,
                multiples: 1,
                deductionPercentage: 4,
                cogsPercentage: 35,
                selectedChannel: { id: 2, channelName: "Offline" },
                channelAllocation: 0.3,
                daysGetPaid: 0,
              },
              {
                id: 3,
                productName: "Coffee Bag",
                price: 6,
                multiples: 1,
                deductionPercentage: 6,
                cogsPercentage: 25,
                selectedChannel: { id: 2, channelName: "Offline" },
                channelAllocation: 0.6,
                daysGetPaid: 0,
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
                endMonth: 36,
                growthFrequency: "Monthly",
                costType: "Based on Revenue",
                costGroup: "Professional Fees",
                salePercentage: 5,
                relatedRevenue: "Offline - Cake",
                applyAdditionalInfo: false,
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
                costGroup: "Professional Fees",
                salePercentage: 0,
                relatedRevenue: "",
                applyAdditionalInfo: false,
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
                costGroup: "Rent",
                salePercentage: 0,
                relatedRevenue: "",
                applyAdditionalInfo: false,
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
                department: "Sales", // Updated to lowercase
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
                department: "Management", // Updated to lowercase
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
      setIsLoading(true);
      const { data: existingData, error: selectError } = await supabase
        .from("finance")
        .select("*")
        .eq("id", id);

      if (selectError) throw selectError;

      if (existingData.length > 0) {
        const financeRecord = existingData[0];

        // Kiểm tra nếu tác giả của dữ liệu tài chính trùng với userId
        if (
          financeRecord.user_id === user.id ||
          financeRecord.collabs?.includes(user.email)
        ) {
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
    } finally {
      setIsLoading(false);
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
      description,
      location,
    };

    await saveOrUpdateFinanceData(financeData);

    // Handle post-save actions
  };

  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(false); // Initialize Joyride on component mount
  }, []);

  // const handleJoyrideCallback = (data) => {
  //   if (data.status === "finished" || data.status === "skipped") {
  //     setRun(false);
  //   }
  // };

  // const startTour = () => {
  //   setRun(true);
  // };

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [activeTabA, setActiveTabA] = useState("table&chart");

  const handleTabChangeA = (tabName) => {
    setActiveTabA(tabName);
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
             <h3 className="text-md text-center font-md mb-2">
  <span className="bg-yellow-100">Yellow parts</span> are inputs. <span className="bg-green-100">Green parts</span> are automatically generated results.
</h3>
<h3 className="text-md text-center font-md mb-2">
  <span className="font-semibold">Modules</span> are listed with 1, 2, 3...<span className="font-semibold"> Sub-modules</span> are listed with a, b, c...
</h3>
            <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm">
              <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "overview" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("overview")}
>
  1. Overview
</li>
                {/* Repeat for other tabs */}
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "customer"
      ? "bg-yellow-300 font-bold"
      : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("customer")}
>
  2. Customer
</li>

                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "sales"
      ? "bg-yellow-300 font-bold"
      : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("sales")}
>
  3. Sales
</li>
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "cost" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("cost")}
>
  4. Costs
</li>
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "personnel" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("personnel")}
>
  5. Personnel
</li>
             <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "investment" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("investment")}
>
  6. CapEx
</li>
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "loan" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("loan")}
>
  7. Loans
</li>
                <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "fundraising" ? "bg-yellow-300 font-bold" : "bg-yellow-100 hover:bg-yellow-200"
  }`}
  onClick={() => handleTabChange("fundraising")}
>
  8. Funding
</li>
               <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTab === "profitAndLoss" ? "bg-green-300 font-bold" : "bg-green-100 hover:bg-green-200"
  }`}
  onClick={() => handleTabChange("profitAndLoss")}
>
  9. Profit & Loss
</li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-green-200 ${
                    activeTab === "cashFlow" ? "bg-green-300 font-bold" : "bg-green-100 hover:bg-green-200"
                  }`}
                  onClick={() => handleTabChange("cashFlow")}
                >
                  10. Cash Flow
                </li>
                <li
                  className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-green-200 ${
                    activeTab === "balanceSheet"
                      ? "bg-green-300 font-bold" : "bg-green-100 hover:bg-green-200"
                  }`}
                  onClick={() => handleTabChange("balanceSheet")}
                >
                  11. Balance Sheet
                </li>
              </ul>
            </div>

            <div className="">
              {activeTab === "overview" && (
                <div>
                  <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm NOsticky NOtop-8 z-50">
                    <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
                    <li
                        className={`hover:cursor-pointer px-2 py-1 rounded-md hover:bg-yellow-200 ${
                          activeTabA === "input"
                            ? "bg-yellow-100 font-bold"
                            : ""
                        }`}
                        onClick={() => handleTabChangeA("input")}
                      >
                      a. Inputs
                      </li>
                      <li
  className={`hover:cursor-pointer px-2 py-1 rounded-md ${
    activeTabA === "table&chart" ? "bg-green-300 font-bold" : "bg-green-100"
  } hover:bg-green-200`}
  onClick={() => handleTabChangeA("table&chart")}
>
                        b. Charts
                      </li>
                      {/* Repeat for other tabs */}
                     
                    </ul>
                  </div>
                  <div className="w-full h-full flex flex-col lg:flex-row">
                    {activeTabA === "table&chart" && (
                      <>
                        <div className="w-full xl:w-3/4 sm:p-4 p-0">
                          <h2
                            className="text-lg font-semibold mb-7 flex items-center"
                            id="duration-heading"
                          >
                            Overview
                          </h2>
                          {/* <Perflexity prompt={generatePrompt()} button={"Benchmark"} /> */}
                          <MetricsFM
                            customerGrowthChart={customerGrowthChart}
                            revenue={revenue}
                            numberOfMonths={numberOfMonths}
                          />
                        </div>
                        <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden ">
                          <button
                            className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] "
                            style={{
                              bottom: "20px",
                              right: "80px",
                              position: "fixed",
                            }}
                            onClick={handleSubmit}
                          >
                            {isLoading ? (
                              <SpinnerBtn />
                            ) : (
                              <>
                                <CheckCircleOutlined
                                  style={{
                                    fontSize: "12px",
                                    color: "#FFFFFF",
                                    marginRight: "4px",
                                  }}
                                />
                                Save
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                    {activeTabA === "input" && (
                      <>
                        <div className="w-full xl:w-3/4 sm:p-4 p-0 "> </div>

                        <div className="w-full xl:w-1/4 sm:p-4 p-0">
                          <DurationSelect
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                          />
                        </div>
                        {/* <div className="xl:hidden block">
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
                        </div> */}

                        {isInputFormOpen && (
                          <Modal
                            // title="Customer channel"
                            open={isInputFormOpen}
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
                      </>
                    )}
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
    </div>
  );
};

export default FinancialForm;
