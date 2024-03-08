import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
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
import { Typography } from "antd";
import LoadingButtonClick from "../components/LoadingButtonClick";
import ProgressBar from "../components/ProgressBar";
import { toast } from "react-toastify";
import { supabase } from "../supabase";
import AlertMsg from "../components/AlertMsg";
import apiService from "../app/apiService";
import MetricsFM from "./MetricsFM";
import Search from "./Home/Components/Search";
import { InfoCircleOutlined } from "@ant-design/icons";

// Duration UI
const DurationSelect = ({
  selectedDuration,
  setSelectedDuration,
  startingCashBalance,
  setStartingCashBalance,
  status,
  setStatus,
  industry,
  setIndustry,
  incomeTax,
  setIncomeTax,
  payrollTax,
  setPayrollTax,
  currency,
  setCurrency,
  startMonth,
  setStartMonth,
  startYear,
  setStartYear,
  financialProjectName,
  setFinancialProjectName,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 },
    (_, index) => 2020 + index
  );

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
    "Transportation",
    "Hospitality",
    "Real Estate",
    "Entertainment",
  ];

  return (
    <section aria-labelledby="duration-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="duration-heading"
      >
        Duration and Initial Setup
      </h2>
      <div className="bg-white rounded-md shadow p-6">
        <Tooltip title="Enter the name of your business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Business name :</span>

            <Input
              value={financialProjectName}
              onChange={(e) => setFinancialProjectName(e.target.value)}
              type="text"
            />
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting month of the business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Start Month :</span>
            <Select onValueChange={setStartMonth} value={startMonth}>
              <SelectTrigger
                id="start-month"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {months.map((month, index) => (
                  <SelectItem key={index} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting year of the business">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Start Year :</span>
            <Select onValueChange={setStartYear} value={startYear}>
              <SelectTrigger
                id="start-year"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {years.map((year, index) => (
                  <SelectItem key={index} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Select the duration 3 years or 5 years">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Duration :</span>
            <Select onValueChange={(value) => setSelectedDuration(value)}>
              <SelectTrigger
                id="start-date-year"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue placeholder={selectedDuration} />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="3 years">3 years</SelectItem>
                <SelectItem value="5 years">5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Enter the starting cash balance, e.g. $10,000">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Starting Cash Balance :</span>

            <Input
              value={startingCashBalance}
              onChange={(e) => setStartingCashBalance(e.target.value)}
              type="number"
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the status of the business, e.g. $10,000">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Status :</span>
            <Select onValueChange={(value) => setStatus(value)} value={status}>
              <SelectTrigger className="border-solid border-[1px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Select the business industry, e.g. Fintech, Edtech">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Business industry:</span>
            <Select onValueChange={setIndustry} value={industry}>
              <SelectTrigger
                id="industry"
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {industries.map((industry, index) => (
                  <SelectItem key={index} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Tooltip>

        <Tooltip title="Input the income tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Income Tax(%) :</span>
            <Input
              type="number"
              value={incomeTax}
              onChange={(e) => setIncomeTax(e.target.value)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Input the payroll tax, e.g. 10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Payroll Tax (%):</span>
            <Input
              type="number"
              value={payrollTax}
              onChange={(e) => setPayrollTax(e.target.value)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Select the currency, e.g. USD">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Currency :</span>
            <Select
              onValueChange={(value) => setCurrency(value)}
              value={currency}
            >
              <SelectTrigger className="border-solid border-[1px] border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tooltip>
      </div>
    </section>
  );
};

// Customer UI
const CustomerSection = ({
  customerInputs,
  addNewCustomerInput,
  removeCustomerInput,
  handleInputChange,
}) => {
  const handleAddNewCustomer = () => {
    const newCustomerInput = {
      customersPerMonth: 100,
      growthPerMonth: 10,
      channelName: "",
      beginMonth: 1,
      endMonth: 15,
    };
    addNewCustomerInput(newCustomerInput);
  };

  return (
    <section aria-labelledby="customers-heading" className="mb-8">
      <Tooltip title="Customer channels for startups can vary depending on the nature of the business, target audience, and industry. Here's a list of common customer channels that startups often utilize: Website, Social Media,Email Marketing, Referral Programs, Events and Networking, Direct Sales, Subscription.">
        <h2
          className="text-2xl font-semibold mb-4 flex items-center"
          id="customers-heading"
        >
          1. Identify your customer{" "}
          <InfoCircleOutlined style={{ marginLeft: "0.5rem" }} />
        </h2>
        <p>
          Việc tạo kênh bán là cực kì quan trọng. Bạn phải nghe tui, không xác
          định được kênh bán là đi bụi
        </p>
      </Tooltip>

      {customerInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Channel Name:</span>
            <Input
              className="col-start-2"
              value={input.channelName}
              onChange={(e) =>
                handleInputChange(index, "channelName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Customers per month:</span>
            <Input
              className="col-start-2"
              value={input.customersPerMonth}
              onChange={(e) =>
                handleInputChange(index, "customersPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Growth Per Month:</span>
            <Input
              className="col-start-2"
              value={input.growthPerMonth}
              onChange={(e) =>
                handleInputChange(index, "growthPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Begin Month:</span>
            <Input
              className="col-start-2"
              type="number"
              min="1"
              value={input.beginMonth}
              onChange={(e) =>
                handleInputChange(index, "beginMonth", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">End Month:</span>
            <Input
              className="col-start-2"
              type="number"
              min="1"
              value={input.endMonth}
              onChange={(e) =>
                handleInputChange(index, "endMonth", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removeCustomerInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white py-1 px-4 rounded"
        onClick={handleAddNewCustomer}
      >
        Add New
      </button>
    </section>
  );
};

// Revenue UI
const SalesSection = ({
  channelInputs,
  channelNames,
  addNewChannelInput,
  removeChannelInput,
  handleChannelInputChange,
}) => {
  const handleAddNewChannelInput = () => {
    const newChannelInput = {
      productName: "", // New field for product name
      price: 0,
      multiples: 0,
      deductionPercentage: 0,
      cogsPercentage: 0,
      selectedChannel: "",
    };
    addNewChannelInput(newChannelInput);
  };

  return (
    <section aria-labelledby="sales-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="sales-heading"
      >
        Sales Section
      </h2>

      {channelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Product Name:</span>
            <Input
              className="col-start-2"
              value={input.productName}
              onChange={(e) =>
                handleChannelInputChange(index, "productName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Price:</span>
            <Input
              className="col-start-2"
              value={input.price}
              onChange={(e) =>
                handleChannelInputChange(index, "price", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Multiples:</span>
            <Input
              className="col-start-2"
              value={input.multiples}
              onChange={(e) =>
                handleChannelInputChange(index, "multiples", e.target.value)
              }
            />
          </div>

          <Tooltip title="Revenue deductions like transaction fees, commission fee... ">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className=" flex items-center">Rev. Deductions (%):</span>
              <Input
                className="col-start-2"
                value={input.deductionPercentage}
                onChange={(e) =>
                  handleChannelInputChange(
                    index,
                    "deductionPercentage",
                    e.target.value
                  )
                }
              />
            </div>
          </Tooltip>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">COGS (%):</span>
            <Input
              className="col-start-2"
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
            <span className=" flex items-center">Sales Channel:</span>
            <Select
              onValueChange={(value) =>
                handleChannelInputChange(index, "selectedChannel", value)
              }
              value={
                input.selectedChannel !== null ? input.selectedChannel : ""
              }
            >
              <SelectTrigger
                id={`select-channel-${index}`}
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent position="popper">
                {channelNames.map((channelName, channelIndex) => (
                  <SelectItem key={channelIndex} value={channelName}>
                    {channelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Channel Allocation (%):</span>
            <Input
              className="col-start-2"
              type="number"
              min={0}
              max={100}
              value={input.channelAllocation * 100} // Convert to percentage for display
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "channelAllocation",
                  e.target.value / 100
                )
              } // Convert back to fraction
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removeChannelInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-1 px-4 rounded"
        onClick={handleAddNewChannelInput}
      >
        Add New
      </button>
    </section>
  );
};

// Cost UI
const CostSection = ({
  costInputs,
  addNewCostInput,
  removeCostInput,
  handleCostInputChange,
}) => {
  const handleAddNewCost = () => {
    const newCostInput = {
      costName: "",
      costValue: 0,
      growthPercentage: 0,
      beginMonth: 1,
      endMonth: 12,
    };
    addNewCostInput(newCostInput);
  };

  return (
    <section aria-labelledby="costs-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="costs-heading"
      >
        Costs
      </h2>

      {costInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4 ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Cost Name:</span>
            <Input
              className="col-start-2"
              value={input.costName}
              onChange={(e) =>
                handleCostInputChange(index, "costName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Cost Value:</span>
            <Input
              className="col-start-2"
              type="number"
              value={input.costValue}
              onChange={(e) =>
                handleCostInputChange(
                  index,
                  "costValue",
                  parseFloat(e.target.value)
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Growth Percentage:</span>
            <Input
              className="col-start-2"
              type="number"
              value={input.growthPercentage}
              onChange={(e) =>
                handleCostInputChange(
                  index,
                  "growthPercentage",
                  parseFloat(e.target.value)
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Begin Month:</span>
            <Input
              className="col-start-2"
              type="number"
              min="1"
              max="12"
              value={input.beginMonth}
              onChange={(e) =>
                handleCostInputChange(
                  index,
                  "beginMonth",
                  parseInt(e.target.value, 10)
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">End Month:</span>
            <Input
              className="col-start-2"
              type="number"
              min="1"
              max="12"
              value={input.endMonth}
              onChange={(e) =>
                handleCostInputChange(
                  index,
                  "endMonth",
                  parseInt(e.target.value, 10)
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Cost Type:</span>
            <Select
              onValueChange={(value) =>
                handleCostInputChange(index, "costType", value)
              }
              value={input.costType}
            >
              <SelectTrigger
                id={`select-costType-${index}`}
                className="border-solid border-[1px] border-gray-200"
              >
                <SelectValue placeholder="Select Cost Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Sales, Marketing Cost">
                  Sales, Marketing Cost
                </SelectItem>
                <SelectItem value="General Administrative Cost">
                  General Administrative Cost
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removeCostInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white py-1 px-4 rounded"
        onClick={handleAddNewCost}
      >
        Add New
      </button>
    </section>
  );
};

// Personnel UI
const PersonnelSection = ({
  personnelInputs,
  addNewPersonnelInput,
  removePersonnelInput,
  handlePersonnelInputChange,
}) => {
  return (
    <section aria-labelledby="personnel-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="personnel-heading"
      >
        Personnel
      </h2>
      {personnelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Job Title</span>
            <Input
              className="col-start-2"
              placeholder="Enter Job Title"
              value={input.jobTitle}
              onChange={(e) =>
                handlePersonnelInputChange(index, "jobTitle", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Salary/month</span>
            <Input
              className="col-start-2"
              placeholder="Enter Salary per Month"
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
            <span className=" flex items-center">No. of hires</span>
            <Input
              className="col-start-2"
              placeholder="Enter Number of Hires"
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
            <span className=" flex items-center">Job begin month</span>
            <Input
              className="col-start-2"
              placeholder="Enter Job Begin Month"
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
            <span className=" flex items-center">Job ending month</span>
            <Input
              className="col-start-2"
              placeholder="Enter Job Ending Month"
              value={input.jobEndMonth}
              onChange={(e) =>
                handlePersonnelInputChange(index, "jobEndMonth", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removePersonnelInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-1 px-4 rounded"
        onClick={addNewPersonnelInput}
      >
        Add New
      </button>
    </section>
  );
};

// Investment UI
const InvestmentSection = ({
  investmentInputs,
  setInvestmentInputs, // Add this line
  addNewInvestmentInput,
  removeInvestmentInput,
  handleInvestmentInputChange,
}) => {
  return (
    <section aria-labelledby="investment-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="investment-heading"
      >
        Investment
      </h2>
      {investmentInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Name of Purchase</span>
            <Input
              className="col-start-2"
              value={input.purchaseName}
              onChange={(e) => {
                const newInputs = [...investmentInputs];
                newInputs[index].purchaseName = e.target.value;
                setInvestmentInputs(newInputs);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Asset Cost</span>
            <Input
              className="col-start-2"
              value={input.assetCost}
              onChange={(e) => {
                const newInputs = [...investmentInputs];
                newInputs[index].assetCost = e.target.value;
                setInvestmentInputs(newInputs);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Quantity:</span>
            <Input
              className="col-start-2"
              type="number"
              min="1"
              value={input.quantity}
              onChange={(e) =>
                handleInvestmentInputChange(index, "quantity", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Purchase Month</span>
            <Input
              className="col-start-2"
              value={input.purchaseMonth}
              onChange={(e) => {
                const newInputs = [...investmentInputs];
                newInputs[index].purchaseMonth = e.target.value;
                setInvestmentInputs(newInputs);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Residual Value</span>
            <Input
              className="col-start-2"
              value={input.residualValue}
              onChange={(e) => {
                const newInputs = [...investmentInputs];
                newInputs[index].residualValue = e.target.value;
                setInvestmentInputs(newInputs);
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Useful Lifetime (Months)</span>
            <Input
              className="col-start-2"
              value={input.usefulLifetime}
              onChange={(e) => {
                const newInputs = [...investmentInputs];
                newInputs[index].usefulLifetime = e.target.value;
                setInvestmentInputs(newInputs);
              }}
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removeInvestmentInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-1 px-4 rounded"
        onClick={addNewInvestmentInput}
      >
        Add New
      </button>
    </section>
  );
};

// Loan UI
const LoanSection = ({
  loanInputs,
  addNewLoanInput,
  removeLoanInput,
  handleLoanInputChange,
}) => {
  return (
    <section aria-labelledby="loan-heading" className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="loan-heading"
      >
        Loan
      </h2>

      {loanInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Loan Name:</span>
            <Input
              className="col-start-2"
              value={input.loanName}
              onChange={(e) =>
                handleLoanInputChange(index, "loanName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Loan Amount:</span>
            <Input
              type="number"
              className="col-start-2"
              value={input.loanAmount}
              onChange={(e) =>
                handleLoanInputChange(index, "loanAmount", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Interest Rate (%):</span>
            <Input
              type="number"
              className="col-start-2"
              value={input.interestRate}
              onChange={(e) =>
                handleLoanInputChange(index, "interestRate", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Month Loan Begins:</span>
            <Input
              type="number"
              className="col-start-2"
              value={input.loanBeginMonth}
              onChange={(e) =>
                handleLoanInputChange(index, "loanBeginMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className=" flex items-center">Month Loan Ends:</span>
            <Input
              type="number"
              className="col-start-2"
              value={input.loanEndMonth}
              onChange={(e) =>
                handleLoanInputChange(index, "loanEndMonth", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end items-center">
            <button
              className="bg-red-600 text-white py-1 px-4 rounded"
              onClick={() => removeLoanInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-1 px-4 rounded"
        onClick={addNewLoanInput}
      >
        Add New
      </button>
    </section>
  );
};

const Z = ({ currentUser, setCurrentUser }) => {
  //DURATION
  //DURATION
  //DURATION
  //DURATION
  //DURATION
  //DURATION
  //DURATION
  //DURATION
  //DURATION

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

  const [chatbotResponse, setChatbotResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [startingCashBalance, setStartingCashBalance] = useState([]);
  const [status, setStatus] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [incomeTax, setIncomeTax] = useState(10);
  const [payrollTax, setPayrollTax] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [startMonth, setStartMonth] = useState([]);
  const [startYear, setStartYear] = useState(2024);
  const [financialProjectName, setFinancialProjectName] = useState([]);

  const industries = [
    "Coffee shop ☕",
    "Pizza restaurant 🍕",
    "HR SaaS (Human Resources Software as a Service) 💼🖥️",
    "Lending fintech (Financial Technology for Lending) 💸🏦",
    "Food delivery platform 🚚🍲",
    "Ride-sharing service 🚗👥",
    "E-commerce platform 🛒🌐",
    "Subscription box service 📦🎁",
    "Social media management tool 📱💡",
    "Online tutoring platform 🖥️📚",
    "Health and wellness app 💪🍏",
    "Home cleaning service 🏠🧹",
    "Co-working space 🏢👩‍💻",
    "Meal kit delivery service 📦🥗",
    "Pet care app 🐶📱",
    "Fashion rental platform 👗🔄",
    "Online marketplace for handmade goods 🤲🛍️",
    "Personal finance management tool 💰📊",
    "Virtual event platform 🖥️🎤",
    "Language learning app 📚🌍",
    "Electric scooter rental service 🛴🔋",
    "Meal planning app 📝🥘",
    "Online therapy platform 💬❤️",
    "Digital marketing agency 💻📈",
    "Sustainable fashion brand 🌿👚",
    "Freelance marketplace 💻🤝",
    "Smart home technology provider 🏠💡",
    "Online event ticketing platform 🎟️🌐",
    "Plant-based food products company 🌱🍔",
    "Fitness app 🏋️‍♀️📱",
  ];

  const Gemini = () => {
    // const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
      try {
        setIsLoading(true);
        console.log("1");
        const response = await fetch(
          "https://news-fetcher-8k6m.onrender.com/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              user_input: `{ "DurationSelect": { "selectedDuration": "5 years", "startingCashBalance": 20000, "status": "active", "industry": "retail", "incomeTax": 25, "payrollTax": 12, "currency": "USD" }, "CustomerSection": { "customerInputs": [ { "customersPerMonth": 500, "growthPerMonth": 5, "channelName": "In-Store", "beginMonth": 1, "endMonth": 60 }, { "customersPerMonth": 200, "growthPerMonth": 10, "channelName": "Online Delivery", "beginMonth": 6, "endMonth": 60 } ] }, "SalesSection": { "channelInputs": [ { "productName": "Coffee", "price": 5, "multiples": 1, "deductionPercentage": 0, "cogsPercentage": 30, "selectedChannel": "In-Store", "channelAllocation": 0.6 }, { "productName": "Pastries", "price": 4, "multiples": 1, "deductionPercentage": 0, "cogsPercentage": 50, "selectedChannel": "In-Store", "channelAllocation": 0.4 }, { "productName": "Coffee Subscription", "price": 20, "multiples": 1, "deductionPercentage": 5, "cogsPercentage": 25, "selectedChannel": "Online Delivery", "channelAllocation": 1 } ], "channelNames": [ "In-Store", "Online Delivery" ] }, "CostSection": { "costInputs": [ { "costName": "Rent", "costValue": 3000, "growthPercentage": 3, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" }, { "costName": "Utilities", "costValue": 500, "growthPercentage": 4, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" } ] }, "PersonnelSection": { "personnelInputs": [ { "jobTitle": "Barista", "salaryPerMonth": 2500, "numberOfHires": 3, "jobBeginMonth": 1, "jobEndMonth": 60 }, { "jobTitle": "Manager", "salaryPerMonth": 4000, "numberOfHires": 1, "jobBeginMonth": 1, "jobEndMonth": 60 } ] }, "InvestmentSection": { "investmentInputs": [ { "purchaseName": "Espresso Machine", "assetCost": 8000, "quantity": 2, "purchaseMonth": 1, "residualValue": 800, "usefulLifetime": 60 }, { "purchaseName": "Furniture", "assetCost": 10000, "quantity": 1, "purchaseMonth": 1, "residualValue": 1000, "usefulLifetime": 60 } ] }, "LoanSection": { "loanInputs": [ { "loanName": "Equipment Loan", "loanAmount": 15000, "interestRate": 4, "loanBeginMonth": 1, "loanEndMonth": 60 } ] } } create a json file like this for a ${inputValue}, return only json file`,
            }),
          }
        );
        console.log("2", response);
        const data = await response.json();
        console.log("3", data);
        //Remove backticks from the constant responseText
        const cleanedResponseText = data.response.replace(/json|`/g, "");
        console.log("4");
        // Set the chatbot response to the latest messag

        setChatbotResponse(cleanedResponseText);
        console.log("5");
        saveUserData();
        console.log("6");
        setIsLoading(false);
      } catch (error) {
        console.log("Error sending message:", error);
        setIsLoading(false);
      }
    };

    async function saveUserData() {
      try {
        console.log("7");
        // Thực hiện truy vấn để lấy thông tin người dùng theo id (điều này cần được thay đổi dựa trên cấu trúc dữ liệu của bạn trong Supabase)
        const currentPrompt = currentUser.financePromptNumber - 1;
        if (currentPrompt <= 0) {
          toast.warning("Prompt per hour limited. Let return after an hour.");
        } else {
          if (currentPrompt === 99) {
            await supabase
              .from("users")
              .update({ financeFirstPrompt: Date.now() })
              .eq("id", currentUser?.id);
          }
          const { data, error } = await supabase
            .from("users")
            .update({ financePromptNumber: currentPrompt })
            .eq("id", currentUser?.id)
            .select();
          console.log("8");
          const resetPrompt = await apiService.post("/count/finance");
          console.log("9");
          if (error) {
            throw error;
          }

          // Cập nhật state userData với thông tin người dùng đã lấy được
          if (data) {
            setCurrentUser(data[0]);
            console.log("10");
          }
        }
      } catch (error) {}
    }

    const handleIndustrySelect = (industry) => {
      setInputValue(industry);
    };

    return (
      <div className=" mx-auto w-full">
        <div className="input-container p-4">
          <h2 className="text-3xl sm:text-5xl font-semibold text-gray-800 darkTextGray mb-6">
            Build your financial model with AI
          </h2>
          <form onSubmit={handleSendMessage}>
            <div className="w-[50%] relative z-10 flex space-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 darkBgBlue darkBorderGray darkShadowGray">
              <div className="flex-[1_0_0%]">
                <input
                  type="text"
                  name="hs-search-article-1"
                  id="hs-search-article-1"
                  className=" px-4 block w-full h-full border-transparent rounded-lg focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Candy shop, pizza restaurant, hospital, HR SaaS software... or anything"
                />
              </div>

              <div className="flex-[0_0_auto]">
                <button
                  type="submit"
                  className="w-[64px] h-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg> */}
                  OK 🐶
                </button>
              </div>
            </div>
          </form>
          <h3 className="text-2xl font-semibold mt-8">Templates</h3>
          <div>
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => handleIndustrySelect(industry)}
                className={`m-2 py-3 px-4 inline-flex items-center gap-x-2  rounded-lg border shadow-sm hover:cursor-pointer`}
              >
                {industry}
              </button>
            ))}
          </div>
          {/* <button
            className="p-2 m-4 rounded-md bg-blue-600 text-white"
            onClick={handleSendMessage}
            type="button"
          >
            Send
          </button> */}
        </div>
      </div>
    );
  };

  // Gemini useEffect
  useEffect(() => {
    // Ensure chatbotResponse is only processed when it's a valid string
    if (!chatbotResponse || chatbotResponse.trim() === "") return;

    try {
      const data = JSON.parse(chatbotResponse);

      // For each section, check if the JSON has relevant data and use it to update state
      // This replaces manual inputs with JSON-provided values
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

      // setChatbotResponse(
      //   (prevResponse) => `${prevResponse}\n${data.geminiResponse}`
      // );
      // console.log("data", data);
      // console.log("data.geminiResponse", data.geminiResponse);
      // console.log("chatbotResponse", chatbotResponse);
    } catch (error) {
      console.log("Error parsing JSON:", error);
      // Handle error or notify user here
    }
  }, [chatbotResponse]);

  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER
  //CUSTOMER

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

  // CustomerFunctions
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

  const calculateCustomerGrowth = (customerInputs) => {
    return customerInputs.map((channel) => {
      let customers = [];
      let currentCustomers = parseFloat(channel.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= channel.beginMonth && i <= channel.endMonth) {
          customers.push({
            month: i,
            customers: currentCustomers,
            channelName: channel.channelName,
          });
          currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
        } else {
          customers.push({
            month: i,
            customers: 0,
            channelName: channel.channelName,
          });
        }
      }
      return customers;
    });
  };

  //CustomerUseEffect
  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      selectedDuration
    );
    setCustomerGrowthData(calculatedData);
  }, [customerInputs, selectedDuration, numberOfMonths]);

  // CustomerTableData
  const transformedCustomerTableData = {};
  customerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = customerInputs.find(
        (input) => input.channelName === data.channelName
      );
      if (customerInput) {
        if (!transformedCustomerTableData[data.channelName]) {
          transformedCustomerTableData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        // Check if the month is within the range
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            parseFloat(data.customers)?.toFixed(2);
        } else {
          // Set value to 0 if outside the range
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            "0.00";
        }
      }
    });
  });

  const customerTableData = Object.values(transformedCustomerTableData).map(
    (row) => {
      for (let month = 1; month <= numberOfMonths; month++) {
        if (!row.hasOwnProperty(`month${month}`)) {
          row[`month${month}`] = "0.00";
        }
      }
      return row;
    }
  );

  // CustomerColumns
  const customerColumns = [
    {
      fixed: "left",
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

  //CustomerChart
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
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
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
          fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
          fontWeight: "600", // Cỡ chữ semibold
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
  }, [customerGrowthData, numberOfMonths]);

  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE
  //REVENUE

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

  useEffect(() => {
    // Update channelNames based on current customerInputs
    const updatedChannelNames = customerInputs
      .map((input) => input.channelName)
      .filter((name, index, self) => name && self.indexOf(name) === index);
    setChannelNames(updatedChannelNames);
  }, [customerInputs]);

  //RevenueFunctions
  const addNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      {
        productName: "",
        price: 0,
        multiples: 0,
        deductionPercentage: 0,
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
  const [revenueDeductionData, setrevenueDeductionData] = useState([]);
  const [cogsData, setCogsData] = useState([]);

  const calculateChannelRevenue = () => {
    let revenueByChannelAndProduct = {};

    // New arrays for revenueDeduction and COGS
    let DeductionByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};

    channelInputs.forEach((channel) => {
      console.log("2", channel);
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);

        // Initialize revenueDeduction and COGS arrays
        const revenueDeductionArray = Array(numberOfMonths).fill(0);
        const cogsArray = Array(numberOfMonths).fill(0);
        const netRevenueArray = Array(numberOfMonths).fill(0);
        const grossProfitArray = Array(numberOfMonths).fill(0);
        console.log("customerGrowthData", customerGrowthData);
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

  //RevenueUseEffect
  useEffect(() => {
    const {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
    } = calculateChannelRevenue();
    setRevenueData(revenueByChannelAndProduct);
    setrevenueDeductionData(DeductionByChannelAndProduct);
    setCogsData(cogsByChannelAndProduct);
    setNetRevenueData(netRevenueByChannelAndProduct);
    setGrossProfitData(grossProfitByChannelAndProduct);
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  //RevenueTable
  const revenueTableData = [];
  console.log("channelInputs", channelInputs);
  channelInputs.forEach((channel) => {
    if (channel.selectedChannel && channel.productName) {
      console.log("revenueData", revenueData);
      const channelRevenue =
        revenueData[channel.selectedChannel + " - " + channel.productName] ||
        [];
      const channelrevenueDeduction =
        revenueDeductionData[
          channel.selectedChannel + " - " + channel.productName
        ] || [];
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
      const revenueDeductionRow = {
        key:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - revenueDeduction",
        channelName:
          channel.selectedChannel +
          " - " +
          channel.productName +
          " - revenueDeduction",
      };
      const cogsRow = {
        key: channel.selectedChannel + " - " + channel.productName + " - COGS",
        channelName:
          channel.selectedChannel + " - " + channel.productName + " - COGS",
      };
      console.log("channelRevenue", channelRevenue);
      channelRevenue.forEach((value, index) => {
        if (index + 1 >= begin && index + 1 <= end) {
          revenueRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
          revenueDeductionRow[`month${index + 1}`] = parseFloat(
            channelrevenueDeduction[index]
          )?.toFixed(2);
          cogsRow[`month${index + 1}`] = parseFloat(channelCOGS[index]).toFixed(
            2
          );
        } else {
          revenueRow[`month${index + 1}`] = "0.00";
          revenueDeductionRow[`month${index + 1}`] = "0.00";
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
        netRevenueRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
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
        grossProfitRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
      });
      console.log("revenueRow", revenueRow);

      revenueTableData.push(revenueRow);
      revenueTableData.push(revenueDeductionRow);
      revenueTableData.push(cogsRow);
      revenueTableData.push(netRevenueRow);
      revenueTableData.push(grossProfitRow);
    }
  });

  //RevenueColumns
  const revenueColumns = [
    {
      fixed: "left",
      title: "Channel_Product_Type",
      dataIndex: "channelName",
      key: "channelName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => i + 1).map((month) => ({
      title: `Month_${month}`,
      dataIndex: `month${month}`,
      key: `month${month}`,
    })),
  ];

  console.log("revenueTableData", revenueTableData);

  //RevenueChart
  const [grossProfit, setgrossProfit] = useState({
    options: {
      chart: { id: "gross-profit-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Revenue Data by Channel and Product', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Profit ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      markers: { size: 1 },
    },

    series: [],
  });

  useEffect(() => {
    const seriesData = Object.entries(grossProfitData).map(([key, data]) => {
      return { name: key, data };
    });

    setgrossProfit((prevState) => ({ ...prevState, series: seriesData }));
  }, [grossProfitData, numberOfMonths]);

  //COSTS
  //COSTS
  //COSTS
  //COSTS
  //COSTS
  //COSTS
  //COSTS
  //COSTS
  //COSTS

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

  //CostFunctions
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

  //CostUseEffect
  useEffect(() => {
    const calculatedData = calculateCostData();
    setCostData(calculatedData);
  }, [costInputs, numberOfMonths]);

  //CostTableData
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

  const costTableData = transformCostDataForTable();

  //CostColumns
  const costColumns = [
    {
      fixed: "left",
      title: "CostType_CostName",
      dataIndex: "costName",
      key: "costName",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  //CostChart
  const [costChart, setCostChart] = useState({
    options: {
      chart: { id: "cost-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Cost Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Cost ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
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
  }, [costData, numberOfMonths]);

  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL
  //PERSONNEL

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

  //PersonnelFunctions
  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 1,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
    ]);
  };

  const removePersonnelInput = (index) => {
    const newInputs = [...personnelInputs];
    newInputs.splice(index, 1);
    setPersonnelInputs(newInputs);
  };

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

      for (let month = 1; month <= numberOfMonths; month++) {
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

  //PersonnelUseEffect
  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setPersonnelCostData(calculatedData);
  }, [personnelInputs, numberOfMonths]);

  //PersonnelCostTableData
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

  const personnelCostTableData = transformPersonnelCostDataForTable();

  //PersonnelColumns
  const personnelCostColumns = [
    {
      fixed: "left",
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

  //PersonnelChart
  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: { id: "personnel-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Personnel Cost Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Salary ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
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
  }, [personnelCostData, numberOfMonths]);

  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS
  //INVESTMENTS

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

  //InvestmentFunctions
  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: 0,
        purchaseMonth: 0,
        residualValue: 0,
        usefulLifetime: 0,
      },
    ]);
  };

  const removeInvestmentInput = (index) => {
    const newInputs = [...investmentInputs];
    newInputs.splice(index, 1);
    setInvestmentInputs(newInputs);
  };

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

  //InvestmentTableData
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

  //InvestmentColumns
  const investmentColumns = [
    { fixed: "left", title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  //InvestmentChart
  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Investment Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Investment ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      markers: { size: 1 },
    },
    series: [],
  });

  useEffect(() => {
    const seriesData = calculateInvestmentData().map((investment) => {
      return { name: investment.purchaseName, data: investment.assetValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [investmentInputs, numberOfMonths]);

  //LOAN
  //LOAN
  //LOAN
  //LOAN
  //LOAN
  //LOAN
  //LOAN
  //LOAN
  //LOAN

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

  //LoanFunctions
  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "0",
        interestRate: "0",
        loanBeginMonth: "0",
        loanEndMonth: "0",
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

  //LoanColumns
  const loanColumns = [
    { fixed: "left", title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `Month ${i + 1}`,
      key: `Month ${i + 1}`,
    })),
  ];

  //LoanChart
  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      // title: { text: 'Loan Data', align: 'left' },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val); // Format Y-axis labels as integers
          },
        },
        title: {
          text: "Payment amount ($)",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
      },
      legend: { position: "bottom", horizontalAlign: "right" },
      fill: { type: "solid" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
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
  }, [loanInputs, numberOfMonths]);

  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS
  //PROFIT_AND_LOSS

  const ProfitAndLossSection = ({
    revenueData,
    costData,
    personnelCostData,
    investmentData,
    loanData,
    numberOfMonths,
    incomeTaxRate,
  }) => {
    const calculateProfitAndLoss = () => {
      let totalRevenue = new Array(numberOfMonths).fill(0);
      let totalDeductions = new Array(numberOfMonths).fill(0);
      let totalCOGS = new Array(numberOfMonths).fill(0);
      let totalCosts = new Array(numberOfMonths).fill(0);
      let totalPersonnelCosts = new Array(numberOfMonths).fill(0);
      let totalInvestmentDepreciation = new Array(numberOfMonths).fill(0);
      let totalLoanPayments = new Array(numberOfMonths).fill(0);

      revenueData.forEach((entry) => {
        if (!entry.channelName.includes("Revenue")) {
          Object.keys(entry).forEach((key) => {
            if (key.startsWith("month")) {
              const monthIndex = parseInt(key.replace("month", "")) - 1;
              totalRevenue[monthIndex] += parseFloat(entry[key] || 0);
            }
          });
        }
      });

      revenueTableData.forEach((entry) => {
        if (entry.channelName.includes("- revenueDeduction")) {
          Object.keys(entry).forEach((key) => {
            if (key.startsWith("month")) {
              const monthIndex = parseInt(key.replace("month", "")) - 1;
              totalDeductions[monthIndex] += parseFloat(entry[key] || 0);
            }
          });
        } else if (entry.channelName.includes("- COGS")) {
          Object.keys(entry).forEach((key) => {
            if (key.startsWith("month")) {
              const monthIndex = parseInt(key.replace("month", "")) - 1;
              totalCOGS[monthIndex] += parseFloat(entry[key] || 0);
            }
          });
        }
      });

      costData.forEach((cost) => {
        cost.monthlyCosts.forEach((monthData) => {
          totalCosts[monthData.month - 1] += monthData.cost;
        });
      });

      personnelCostData.forEach((personnel) => {
        personnel.monthlyCosts.forEach((monthData) => {
          totalPersonnelCosts[monthData.month - 1] += monthData.cost;
        });
      });

      investmentData.forEach((investment) => {
        investment.depreciationArray.forEach((value, index) => {
          totalInvestmentDepreciation[index] += value;
        });
      });

      loanData.forEach((loan) => {
        loan.loanDataPerMonth.forEach((monthData) => {
          totalLoanPayments[monthData.month - 1] += monthData.payment;
        });
      });

      // Feb29
      let netRevenue = totalRevenue.map(
        (revenue, index) => revenue - totalDeductions[index]
      ); // Net Revenue calculation

      let grossProfit = netRevenue.map(
        (revenue, index) => revenue - totalCOGS[index]
      ); // Gross Profit calculation

      let ebitda = grossProfit.map(
        (profit, index) =>
          profit - (totalCosts[index] + totalPersonnelCosts[index])
      ); // Adjust EBITDA calculation to use grossProfit

      let totalInterestPayments = new Array(numberOfMonths).fill(0);
      loanData.forEach((loan) => {
        loan.loanDataPerMonth.forEach((monthData) => {
          totalInterestPayments[monthData.month - 1] += monthData.interest;
        });
      });

      // Adjust earningsBeforeTax calculation to use ebitda
      let earningsBeforeTax = ebitda.map(
        (profit, index) =>
          profit -
          (totalInvestmentDepreciation[index] + totalInterestPayments[index])
      );

      let incomeTax = earningsBeforeTax.map((earnings) =>
        earnings > 0 ? earnings * (incomeTaxRate / 100) : 0
      );

      let netIncome = earningsBeforeTax.map(
        (earnings, index) => earnings - incomeTax[index]
      );

      return {
        totalRevenue,
        totalDeductions,
        netRevenue,
        totalCOGS,
        grossProfit, // Include Gross Profit in the returned object
        totalCosts,
        totalPersonnelCosts,
        totalInvestmentDepreciation,
        totalInterestPayments,
        ebitda,
        earningsBeforeTax,
        incomeTax,
        netIncome,
      };
    };

    const {
      totalRevenue,
      totalDeductions,
      netRevenue,
      totalCOGS,
      grossProfit, // Destructure Gross Profit
      totalCosts,
      totalPersonnelCosts,
      totalInvestmentDepreciation,
      totalInterestPayments,
      ebitda,
      earningsBeforeTax,
      incomeTax,
      netIncome,
    } = calculateProfitAndLoss();

    const transposedData = [
      { key: "Total Revenue", values: totalRevenue },
      { key: "Total Deductions", values: totalDeductions },
      { key: "Net Revenue", values: netRevenue },
      { key: "Total COGS", values: totalCOGS },
      { key: "Gross Profit", values: grossProfit },
      { key: "Total Operating Expenses", values: totalCosts },
      { key: "Total Personnel Costs", values: totalPersonnelCosts },
      { key: "EBITDA", values: ebitda }, // Add EBITDA row
      {
        key: "Total Investment Depreciation",
        values: totalInvestmentDepreciation,
      },
      { key: "Total Interest Payments", values: totalInterestPayments },
      { key: "Earnings Before Tax", values: earningsBeforeTax },
      { key: "Income Tax", values: incomeTax },
      { key: "Net Income", values: netIncome },
    ].map((item, index) => ({
      metric: item.key,
      ...item.values.reduce(
        (acc, value, i) => ({ ...acc, [`Month ${i + 1}`]: value?.toFixed(2) }),
        {}
      ),
    }));

    // Adjust columns for the transposed table
    const columns = [
      {
        title: "Metric",
        dataIndex: "metric",
        key: "metric",
        fixed: "left",
      },
      ...Array.from({ length: numberOfMonths }, (_, i) => ({
        title: `Month_${i + 1}`,
        dataIndex: `Month ${i + 1}`,
        key: `Month ${i + 1}`,
      })),
    ];

    const chartSeries = [
      {
        name: "Total Revenue",
        data: totalRevenue.map((value) => parseFloat(value?.toFixed(2))),
      },
      {
        name: "Total Costs",
        data: totalCosts.map((value) => parseFloat(value?.toFixed(2))),
      },
      {
        name: "Total Personnel Costs",
        data: totalPersonnelCosts.map((value) => parseFloat(value?.toFixed(2))),
      },
      {
        name: "Total Investment Depreciation",
        data: totalInvestmentDepreciation.map((value) =>
          parseFloat(value?.toFixed(2))
        ),
      },
      {
        name: "Total Interest Payments",
        data: totalInterestPayments.map((value) =>
          parseFloat(value?.toFixed(2))
        ),
      },
      {
        name: "Net Income",
        data: netIncome.map((value) => parseFloat(value.toFixed(2))),
      },
    ];

    const chartOptions = {
      chart: { id: "profit-and-loss-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif", // Sử dụng font chữ Inter
            fontWeight: "600", // Cỡ chữ semibold
          },
        },
        labels: {
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          trim: true,
          minHeight: 100, // Adjust as needed to ensure labels do not overlap or take up too much space
          style: {
            cssClass: "apexcharts-xaxis-label",
          },
        },
      },
      yaxis: { title: { text: "Amount ($)" } },
      stroke: { curve: "smooth" },
      legend: { position: "top" },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `$${val?.toFixed(2)}`,
        },
      },
    };

    // Transposed table data preparation remains unchanged

    // Table columns definition remains unchanged

    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Profit and Loss Statement
        </h2>
        <Table
          className="overflow-auto mb-4"
          dataSource={transposedData}
          columns={columns}
          pagination={false}
        />
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      </div>
    );
  };

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
            <Gemini />
          </div>

          {/* DurationSection */}
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

            {/* FMMetrics */}
            <div className="w-full lg:w-3/4 p-4">
              <MetricsFM />
            </div>
          </div>

          {/* CustomerSection */}
          <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <CustomerSection
                customerInputs={customerInputs}
                addNewCustomerInput={addNewCustomerInput}
                removeCustomerInput={removeCustomerInput}
                handleInputChange={handleInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4 ">
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
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <SalesSection
                channelInputs={channelInputs}
                channelNames={channelNames}
                addNewChannelInput={addNewChannelInput}
                removeChannelInput={removeChannelInput}
                handleChannelInputChange={handleChannelInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4">
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
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <CostSection
                costInputs={costInputs}
                addNewCostInput={addNewCostInput}
                removeCostInput={removeCostInput}
                handleCostInputChange={handleCostInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4">
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
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <PersonnelSection
                personnelInputs={personnelInputs}
                addNewPersonnelInput={addNewPersonnelInput}
                removePersonnelInput={removePersonnelInput}
                handlePersonnelInputChange={handlePersonnelInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4">
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
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <InvestmentSection
                investmentInputs={investmentInputs}
                setInvestmentInputs={setInvestmentInputs}
                addNewInvestmentInput={addNewInvestmentInput}
                removeInvestmentInput={removeInvestmentInput}
                handleInvestmentInputChange={handleInvestmentInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4">
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
            <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
              <LoanSection
                loanInputs={loanInputs}
                addNewLoanInput={addNewLoanInput}
                removeLoanInput={removeLoanInput}
                handleLoanInputChange={handleLoanInputChange}
              />
            </div>
            <div className="w-full lg:w-3/4 p-4">
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

export default Z;
