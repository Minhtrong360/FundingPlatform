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

  // const numberOfMonths = selectedDuration === "3 years" ? 36 : 60;

  const [numberOfMonths, setNumberOfMonths] = useState(0);
  useEffect(() => {
    if (selectedDuration === "3 years") {
      setNumberOfMonths(36);
    }
    if (selectedDuration === "5 years") {
      setNumberOfMonths(60);
    }
  }, [selectedDuration]);

  //CustomerSection
  const [customerInputs, setCustomerInputs] = useState([
    {
      customersPerMonth: 100,
      growthPerMonth: 10,
      channelName: "",
      beginMonth: 1,
      endMonth: numberOfMonths,
    },
  ]);

  const [customerGrowthData, setCustomerGrowthData] = useState([]);
  const [customerTableData, setCustomerTableData] = useState([]);

  const [channelNames, setChannelNames] = useState([]);

  useEffect(() => {
    // Update channelNames based on current customerInputs
    const updatedChannelNames = customerInputs
      .map((input) => input.channelName)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    setChannelNames(updatedChannelNames);
  }, [customerInputs]); // Update channelNames when customerInputs changes

  //SalesSection
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
  const [revenueData, setRevenueData] = useState([]);
  const [netRevenueData, setNetRevenueData] = useState([]);
  const [grossProfitData, setGrossProfitData] = useState([]);

  const [txFeeData, setTxFeeData] = useState([]);
  const [cogsData, setCogsData] = useState([]);
  const [revenueTableData, setRevenueTableData] = useState([]);

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

  const [personnelCostData, setPersonnelCostData] = useState([]);

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

  const [loanTableData, setLoanTableData] = useState([]);

  // Costs Calculation
  const [costData, setCostData] = useState([]);

  // In your render method or return statement
  const [costTableData, setCostTableData] = useState([]);

  //Personel cost
  const [personnelCostTableData, setPersonnelCostTableData] = useState([]);

  //Investment cost
  const [investmentTableData, setInvestmentTableData] = useState([]);

  // Dynamic Column Creation

  const customerColumns = [
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

  const [revenueChart, setRevenueChart] = useState({
    options: {
      chart: { id: "revenue-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
   
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

  const [costChart, setCostChart] = useState({
    options: {
      chart: { id: "cost-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
     
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

  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: { id: "personnel-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
     
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

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
 
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

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      
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

  const saveOrUpdateFinanceData = async (userId, inputData) => {
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
          // Cập nhật bản ghi hiện có

          const { error: updateError } = await supabase
            .from("finance")
            .update({ name: financeName, inputData })
            .eq("id", financeRecord.id)
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
            name: financeName,
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
            numberOfMonths={numberOfMonths}
            selectedDuration={selectedDuration}
            customerInputs={customerInputs}
            setCustomerInputs={setCustomerInputs}
            customerGrowthData={customerGrowthData}
            setCustomerGrowthData={setCustomerGrowthData}
            customerGrowthChart={customerGrowthChart}
            setCustomerGrowthChart={setCustomerGrowthChart}
            customerTableData={customerTableData}
            setCustomerTableData={setCustomerTableData}
          />
        </div>

        <div className="w-full lg:w-2/3 p-4 ">
          <h3 className="text-lg font-semibold my-8">
            Customer Growth Data by Channel
          </h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={customerTableData}
            columns={customerColumns}
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
        <div className="w-full lg:w-1/3 p-4 border-e-2">
          <SalesSection
            channelInputs={channelInputs}
            channelNames={channelNames}
            setChannelInputs={setChannelInputs}
            setRevenueData={setRevenueData}
            setNetRevenueData={setNetRevenueData}
            setGrossProfitData={setGrossProfitData}
            setTxFeeData={setTxFeeData}
            setCogsData={setCogsData}
            customerGrowthData={customerGrowthData}
            numberOfMonths={numberOfMonths}
            customerInputs={customerInputs}
            revenueData={revenueData}
            txFeeData={txFeeData}
            cogsData={cogsData}
            netRevenueData={netRevenueData}
            grossProfitData={grossProfitData}
            setRevenueTableData={setRevenueTableData}
            setRevenueChart={setRevenueChart}
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
           <h3 className="text-lg font-semibold mb-4">
          Gross Profit Data by Channel and Product
          </h3>
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
            setCostInputs={setCostInputs}
            setCostData={setCostData}
            numberOfMonths={numberOfMonths}
            setCostTableData={setCostTableData}
            setCostChart={setCostChart}
            costData={costData}
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
          <h3 className="text-lg font-semibold mb-4">Cost Chart</h3>
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
            setPersonnelInputs={setPersonnelInputs}
            setPersonnelCostData={setPersonnelCostData}
            numberOfMonth={numberOfMonths}
            setPersonnelCostTableData={setPersonnelCostTableData}
            personnelCostData={personnelCostData}
            setPersonnelChart={setPersonnelChart}
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
          <h3 className="text-lg font-semibold mb-4">Personnel Cost Chart</h3>
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
            numberOfMonths={numberOfMonths}
            setInvestmentTableData={setInvestmentTableData}
            setInvestmentChart={setInvestmentChart}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Investment Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={investmentTableData}
            columns={investmentColumns}
            pagination={false}
          />
          <h3 className="text-lg font-semibold mb-4">Investment Chart</h3>
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
            setLoanInputs={setLoanInputs}
            numberOfMonths={numberOfMonths}
            setLoanTableData={setLoanTableData}
            setLoanChart={setLoanChart}
          />
        </div>
        <div className="w-full lg:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Loan Data</h3>
          <Table
            className="overflow-auto mb-4 border-2"
            dataSource={loanTableData}
            columns={loanColumns}
            pagination={false}
          />
          <h3 className="text-lg font-semibold mb-4">Loan Chart</h3>
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
