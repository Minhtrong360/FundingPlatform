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
      productName: "Coffee", // New field for product name
      price: 4,
      multiples: 1,
      txFeePercentage: 10,
      cogsPercentage: 30,
      selectedChannel: "Offline",
      channelAllocation: 0.4,
    },
    {
      productName: "Cake", // New field for product name
      price: 8,
      multiples: 1,
      txFeePercentage: 5,
      cogsPercentage: 35,
      selectedChannel: "Offline",
      channelAllocation: 0.3,
    },
    {
      productName: "Coffee bag", // New field for product name
      price: 6,
      multiples: 1,
      txFeePercentage: 5,
      cogsPercentage: 25,
      selectedChannel: "Online",
      channelAllocation: 0.6,
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
      costName: "Website",
      costValue: 1000,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 6,
      costType: "Operating Cost",
    },
    {
      costName: "Marketing",
      costValue: 500,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 36,
      costType: "Operating Cost",
    },
    {
      costName: "Rent",
      costValue: 1000,
      growthPercentage: 2,
      beginMonth: 1,
      endMonth: 36,
      costType: "Operating Cost",
    },
  ]);

  // ...other existing code...

  // State management cho Personnel
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

  // Function to add a new personnel input

  const [personnelCostData, setPersonnelCostData] = useState([]);

  //Investment Inputs
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

  //Loan part

  const [loanInputs, setLoanInputs] = useState([
    {
      loanName: "Banking loan",
      loanAmount: "150000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "12",
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
      title: `Month_${month}`,
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
      title: `Month_${month}`,
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
      title: `Month_${i + 1}`,
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
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const investmentColumns = [
    { title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const loanColumns = [
    { title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
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

  const [isLoading, setIsLoading] = useState(true);

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
    const userId = user?.id;
    if (userId) {
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
    }
  }, [user?.id]);

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

    await saveOrUpdateFinanceData(user?.id, financeData);

    // Handle post-save actions
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
            <Gemini />
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

            {/* FMMetrics */}
            <div className="w-full lg:w-2/3 p-4">
               <MetricsFM />
            </div>
          </div>  

          {/* CustomerSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <CustomerSection
                customerInputs={customerInputs}
                addNewCustomerInput={addNewCustomerInput}
                removeCustomerInput={removeCustomerInput}
                handleInputChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4 ">
              <h3 className="text-2xl font-semibold ">Customer Table</h3>
              <Table
                className="overflow-auto my-8"
                dataSource={customerTableData}
                columns={customerColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">Customer Chart</h3>
              <Chart
                options={customerGrowthChart.options}
                series={customerGrowthChart.series}
                type="area"
                height={350}
              />
            </div>
          </div>

          {/* RevenueSetion */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <SalesSection
                channelInputs={channelInputs}
                channelNames={channelNames}
                addNewChannelInput={addNewChannelInput}
                removeChannelInput={removeChannelInput}
                handleChannelInputChange={handleChannelInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4">
              <h3 className="text-2xl font-semibold mb-4">
                Revenue Data by Channel and Product
              </h3>
              <Table
                className="overflow-auto my-8"
                dataSource={revenueTableData}
                columns={revenueColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">
                Gross Profit Data by Channel and Product
              </h3>
              <Chart
                options={grossProfit.options}
                series={grossProfit.series}
                type="line"
                height={350}
              />
            </div>
          </div>  

          {/* CostSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <CostSection
                costInputs={costInputs}
                addNewCostInput={addNewCostInput}
                removeCostInput={removeCostInput}
                handleCostInputChange={handleCostInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4">
              <h3 className="text-2xl font-semibold mb-4">Cost Table</h3>
              <Table
                className="overflow-auto my-8"
                dataSource={costTableData}
                columns={costColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">Cost Chart</h3>
              <Chart
                options={costChart.options}
                series={costChart.series}
                type="bar"
                height={350}
              />
            </div>
          </div>

          {/* PersonnelSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <PersonnelSection
                personnelInputs={personnelInputs}
                addNewPersonnelInput={addNewPersonnelInput}
                removePersonnelInput={removePersonnelInput}
                handlePersonnelInputChange={handlePersonnelInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4">
              <h3 className="text-2xl font-semibold mb-4">
                Personnel Cost Table
              </h3>
              <Table
                className="overflow-auto my-8"
                dataSource={personnelCostTableData}
                columns={personnelCostColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">
                Personnel Cost Chart
              </h3>
              <Chart
                options={personnelChart.options}
                series={personnelChart.series}
                type="bar"
                height={350}
              />
            </div>
          </div>

          {/* InvestmentSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <InvestmentSection
                investmentInputs={investmentInputs}
                setInvestmentInputs={setInvestmentInputs}
                addNewInvestmentInput={addNewInvestmentInput}
                removeInvestmentInput={removeInvestmentInput}
                handleInvestmentInputChange={handleInvestmentInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4">
              <h3 className="text-2xl font-semibold mb-4">Investment Table</h3>
              <Table
                className="overflow-auto my-8"
                dataSource={transformInvestmentDataForTable()}
                columns={investmentColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">Investment Chart</h3>
              <Chart
                options={investmentChart.options}
                series={investmentChart.series}
                type="area"
                height={350}
              />
            </div>
          </div>

          {/* LoanSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/3 p-4 border-r-2">
              <LoanSection
                loanInputs={loanInputs}
                addNewLoanInput={addNewLoanInput}
                removeLoanInput={removeLoanInput}
                handleLoanInputChange={handleLoanInputChange}
              />
            </div>
            <div className="w-full lg:w-2/3 p-4">
              <h3 className="text-2xl font-semibold mb-4">Loan Data</h3>
              <Table
                className="overflow-auto my-8"
                dataSource={transformLoanDataForTable()}
                columns={loanColumns}
                pagination={false}
              />
              <h3 className="text-2xl font-semibold my-8">Loan Data</h3>
              <Chart
                options={loanChart.options}
                series={loanChart.series}
                type="line"
                height={350}
              />
            </div>
          </div>

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
