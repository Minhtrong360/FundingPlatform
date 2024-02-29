import React, { useState, useEffect } from "react";
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

//JSON

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
  financeName,
  setFinanceName,
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Financial name:</span>
          <Input
            value={financeName}
            onChange={(e) => setFinanceName(e.target.value)}
            type="text"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Start Month:</span>
          <Select onValueChange={setStartMonth} value={startMonth}>
            <SelectTrigger
              id="start-month"
              className="border-solid border-[1px] border-gray-600"
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

        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Start Year:</span>
          <Select onValueChange={setStartYear} value={startYear}>
            <SelectTrigger
              id="start-year"
              className="border-solid border-[1px] border-gray-600"
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Duration</span>
          <Select onValueChange={(value) => setSelectedDuration(value)}>
            <SelectTrigger
              id="start-date-year"
              className="border-solid border-[1px] border-gray-600"
            >
              <SelectValue placeholder={selectedDuration} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="3 years">3 years</SelectItem>
              <SelectItem value="5 years">5 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">
            Starting Cash Balance:
          </span>
          <Input
            value={startingCashBalance}
            onChange={(e) => setStartingCashBalance(e.target.value)}
            type="number"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Status:</span>
          <Select onValueChange={(value) => setStatus(value)} value={status}>
            <SelectTrigger className="border-solid border-[1px] border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Industry:</span>
          <Select onValueChange={setIndustry} value={industry}>
            <SelectTrigger
              id="industry"
              className="border-solid border-[1px] border-gray-600"
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Income Tax (%):</span>
          <Input
            type="number"
            value={incomeTax}
            onChange={(e) => setIncomeTax(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">
            Payroll Tax (%):
          </span>
          <Input
            type="number"
            value={payrollTax}
            onChange={(e) => setPayrollTax(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium flex items-center">Currency:</span>
          <Select
            onValueChange={(value) => setCurrency(value)}
            value={currency}
          >
            <SelectTrigger className="border-solid border-[1px] border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

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
      <h2
        className="text-2xl font-semibold mb-4 flex items-center"
        id="customers-heading"
      >
        Customer
      </h2>

      {customerInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Customers Per Month:</span>
            <Input
              className="col-start-2"
              value={input.customersPerMonth}
              onChange={(e) =>
                handleInputChange(index, "customersPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Growth Per Month:</span>
            <Input
              className="col-start-2"
              value={input.growthPerMonth}
              onChange={(e) =>
                handleInputChange(index, "growthPerMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Channel Name:</span>
            <Input
              className="col-start-2"
              value={input.channelName}
              onChange={(e) =>
                handleInputChange(index, "channelName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Begin Month:</span>
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
            <span className="font-medium">End Month:</span>
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
              className="bg-red-500 text-white py-1 px-4 rounded"
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
      txFeePercentage: 0,
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
            <span className="font-medium">Product Name:</span>
            <Input
              className="col-start-2"
              value={input.productName}
              onChange={(e) =>
                handleChannelInputChange(index, "productName", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Price:</span>
            <Input
              className="col-start-2"
              value={input.price}
              onChange={(e) =>
                handleChannelInputChange(index, "price", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Multiples:</span>
            <Input
              className="col-start-2"
              value={input.multiples}
              onChange={(e) =>
                handleChannelInputChange(index, "multiples", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Tx Fee (%):</span>
            <Input
              className="col-start-2"
              value={input.txFeePercentage}
              onChange={(e) =>
                handleChannelInputChange(
                  index,
                  "txFeePercentage",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">COGS (%):</span>
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
            <span className="font-medium">Sales Channel:</span>
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
                className="border-solid border-[1px] border-gray-600"
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
            <span className="font-medium">Channel Allocation (%):</span>
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
              className="bg-red-500 text-white py-1 px-4 rounded"
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
            <span className="font-medium">Cost Name:</span>
            <Input
              className="col-start-2"
              value={input.costName}
              onChange={(e) =>
                handleCostInputChange(index, "costName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Cost Value:</span>
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
            <span className="font-medium">Growth Percentage:</span>
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
            <span className="font-medium">Begin Month:</span>
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
            <span className="font-medium">End Month:</span>
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
            <span className="font-medium">Cost Type:</span>
            <Select
              onValueChange={(value) =>
                handleCostInputChange(index, "costType", value)
              }
              value={input.costType}
            >
              <SelectTrigger
                id={`select-costType-${index}`}
                className="border-solid border-[1px] border-gray-600"
              >
                <SelectValue placeholder="Select Cost Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="Operating Cost">Operating Cost</SelectItem>
                <SelectItem value="SG & A">SG & A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end items-center">
            <button
              className="bg-red-500 text-white py-1 px-4 rounded"
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
            <span className="font-medium">Job Title</span>
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
            <span className="font-medium">Salary/month</span>
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
            <span className="font-medium">No. of hires</span>
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
            <span className="font-medium">Job begin month</span>
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
            <span className="font-medium">Job ending month</span>
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
              className="bg-red-500 text-white py-1 px-4 rounded"
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
            <span className="font-medium">Name of Purchase</span>
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
            <span className="font-medium">Asset Cost</span>
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
            <span className="font-medium">Quantity:</span>
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
            <span className="font-medium">Purchase Month</span>
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
            <span className="font-medium">Residual Value</span>
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
            <span className="font-medium">Useful Lifetime (Months)</span>
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
              className="bg-red-500 text-white py-1 px-4 rounded"
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
            <span className="font-medium">Loan Name:</span>
            <Input
              className="col-start-2"
              value={input.loanName}
              onChange={(e) =>
                handleLoanInputChange(index, "loanName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Amount:</span>
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
            <span className="font-medium">Interest Rate (%):</span>
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
            <span className="font-medium">Month Loan Begins:</span>
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
            <span className="font-medium">Month Loan Ends:</span>
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
              className="bg-red-500 text-white py-1 px-4 rounded"
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
  //DurationSection
  const [chatbotResponse, setChatbotResponse] = useState("");
  const [jsonInput, setJsonInput] = useState(null); // JSON input state
  const [durationSelect, setDurationSelect] = useState({});
  const [customerSection, setCustomerSection] = useState({});
  const [salesSection, setSalesSection] = useState({});
  const [costSection, setCostSection] = useState({});
  const [personnelSection, setPersonnelSection] = useState({});
  const [investmentSection, setInvestmentSection] = useState({});
  const [loanSection, setLoanSection] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  // gemini

  const { Text } = Typography;

  const industries = [
    "Coffee shop",
    "Pizza restaurant",
    "HR SaaS (Human Resources Software as a Service)",
    "Lending fintech (Financial Technology for Lending)",
    "Food delivery platform",
    "Ride-sharing service",
    "E-commerce platform",
    "Subscription box service",
    "Social media management tool",
    "Online tutoring platform",
    "Health and wellness app",
    "Home cleaning service",
    "Co-working space",
    "Meal kit delivery service",
    "Pet care app",
    "Fashion rental platform",
    "Online marketplace for handmade goods",
    "Personal finance management tool",
    "Virtual event platform",
    "Language learning app",
    "Electric scooter rental service",
    "Meal planning app",
    "Online therapy platform",
    "Digital marketing agency",
    "Sustainable fashion brand",
    "Freelance marketplace",
    "Smart home technology provider",
    "Online event ticketing platform",
    "Plant-based food products company",
    "Fitness app",
  ];

  const IndustrySelector = ({ onIndustrySelect }) => {
    const handleIndustrySelect = (industry) => {
      onIndustrySelect(industry);
    };

    return (
      <div>
        <h3 className="text-lg font-semibold">Choose an industry:</h3>
        <div className="flex overflow-x-auto whitespace-nowrap p-4">
          {industries.map((industry, index) => (
            <button
              key={index}
              className="m-1 py-2 px-3 inline-flex justify-center items-center gap-x-3 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
              onClick={() => handleIndustrySelect(industry)}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const Gemini = () => {
    // const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const handleSendMessage = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          "https://news-fetcher-8k6m.onrender.com/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              user_input: `{ "DurationSelect": { "selectedDuration": "5 years", "startingCashBalance": 20000, "status": "active", "industry": "retail", "incomeTax": 25, "payrollTax": 12, "currency": "USD" }, "CustomerSection": { "customerInputs": [ { "customersPerMonth": 500, "growthPerMonth": 5, "channelName": "In-Store", "beginMonth": 1, "endMonth": 60 }, { "customersPerMonth": 200, "growthPerMonth": 10, "channelName": "Online Delivery", "beginMonth": 6, "endMonth": 60 } ] }, "SalesSection": { "channelInputs": [ { "productName": "Coffee", "price": 5, "multiples": 1, "txFeePercentage": 0, "cogsPercentage": 30, "selectedChannel": "In-Store", "channelAllocation": 0.6 }, { "productName": "Pastries", "price": 4, "multiples": 1, "txFeePercentage": 0, "cogsPercentage": 50, "selectedChannel": "In-Store", "channelAllocation": 0.4 }, { "productName": "Coffee Subscription", "price": 20, "multiples": 1, "txFeePercentage": 5, "cogsPercentage": 25, "selectedChannel": "Online Delivery", "channelAllocation": 1 } ], "channelNames": [ "In-Store", "Online Delivery" ] }, "CostSection": { "costInputs": [ { "costName": "Rent", "costValue": 3000, "growthPercentage": 3, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" }, { "costName": "Utilities", "costValue": 500, "growthPercentage": 4, "beginMonth": 1, "endMonth": 60, "costType": "Operating Cost" } ] }, "PersonnelSection": { "personnelInputs": [ { "jobTitle": "Barista", "salaryPerMonth": 2500, "numberOfHires": 3, "jobBeginMonth": 1, "jobEndMonth": 60 }, { "jobTitle": "Manager", "salaryPerMonth": 4000, "numberOfHires": 1, "jobBeginMonth": 1, "jobEndMonth": 60 } ] }, "InvestmentSection": { "investmentInputs": [ { "purchaseName": "Espresso Machine", "assetCost": 8000, "quantity": 2, "purchaseMonth": 1, "residualValue": 800, "usefulLifetime": 60 }, { "purchaseName": "Furniture", "assetCost": 10000, "quantity": 1, "purchaseMonth": 1, "residualValue": 1000, "usefulLifetime": 60 } ] }, "LoanSection": { "loanInputs": [ { "loanName": "Equipment Loan", "loanAmount": 15000, "interestRate": 4, "loanBeginMonth": 1, "loanEndMonth": 60 } ] } } create a json file like this for a ${inputValue}, return only json file`,
            }),
          }
        );

        const data = await response.json();

        //Remove backticks from the constant responseText
        const cleanedResponseText = data.response.replace(/json|`/g, "");

        // Set the chatbot response to the latest messag

        setChatbotResponse(cleanedResponseText);

        saveUserData();

        setIsLoading(false);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsLoading(false);
      }
    };

    async function saveUserData() {
      try {
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

          const resetPrompt = await apiService.post("/count/finance");

          if (error) {
            throw error;
          }

          // Cập nhật state userData với thông tin người dùng đã lấy được
          if (data) {
            setCurrentUser(data[0]);
          }
        }
      } catch (error) {}
    }

    const handleIndustrySelect = (industry) => {
      setInputValue(industry);
    };

    return (
      <div className="w-1/2 mx-auto">
        <div className="input-container p-4">
          <h2 className="text-lg font-semibold mb-4">
            What business do you want to start with?
          </h2>
          <Input
            className="p-4 m-4"
            rows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Candy shop, pizza restaurant, hospital, HR SaaS software... or anything"
          />
          <IndustrySelector onIndustrySelect={handleIndustrySelect} />
          <button
            className="p-2 m-4 rounded-md bg-blue-600 text-white"
            onClick={handleSendMessage}
            type="button"
          >
            Send
          </button>
        </div>
      </div>
    );
  };

  //////////////////////

  const jsonHandleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const applyJsonInput = () => {
    if (!chatbotResponse || !chatbotResponse.trim()) {
      alert("No JSON data provided. Please paste valid JSON data.");
      return;
    }

    try {
      const parsedData = JSON.parse(chatbotResponse);
      // Check if parsedData has the property 'DurationSelect'
      if (parsedData && parsedData.DurationSelect) {
        setDurationSelect(parsedData.DurationSelect);
      } else {
        // Handle cases where DurationSelect is not present or parsedData is not as expected
        console.error("Parsed data is missing the DurationSelect property.");
        setDurationSelect({}); // Reset or set to a default state
        alert("JSON data does not contain the DurationSelect property.");
      }
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      alert("Invalid JSON format. Please check the data and try again.");
    }
  };

  // In the main functional component, update the useEffect
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
  }, [customerGrowthData, channelInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      selectedDuration
    );
    setCustomerGrowthData(calculatedData);
  }, [customerInputs, selectedDuration, numberOfMonths]);

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

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setPersonnelCostData(calculatedData);
  }, [personnelInputs, numberOfMonths]);

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
      loanName: "Banking loan",
      loanAmount: "150000",
      interestRate: "6",
      loanBeginMonth: "1",
      loanEndMonth: "12",
    },
  ]);

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
          )?.toFixed(2);
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
      title: `Month_${month}`,
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
          revenueRow[`month${index + 1}`] = parseFloat(value)?.toFixed(2);
          txFeeRow[`month${index + 1}`] = parseFloat(
            channelTxFee[index]
          )?.toFixed(2);
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
  }, [costInputs, numberOfMonths]);

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
        )?.toFixed(2);
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
        rowData[`month${monthData.month}`] = monthData.cost?.toFixed(2); // Adjust formatting as needed
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
      stroke: { curve: "smooth" },
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

  const ProfitAndLossSection = ({
    revenueData,
    costData,
    personnelCostData,
    investmentData,
    loanData,
    numberOfMonths,
  }) => {
    const calculateProfitAndLoss = () => {
      let totalRevenue = new Array(numberOfMonths).fill(0);
      let totalTxfee = new Array(numberOfMonths).fill(0);
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
        if (entry.channelName.includes("- Txfee")) {
          Object.keys(entry).forEach((key) => {
            if (key.startsWith("month")) {
              const monthIndex = parseInt(key.replace("month", "")) - 1;
              totalTxfee[monthIndex] += parseFloat(entry[key] || 0);
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

      let netProfit = totalRevenue.map(
        (revenue, index) =>
          revenue -
          (totalTxfee[index] +
            totalCOGS[index] +
            totalCosts[index] +
            totalPersonnelCosts[index] +
            totalInvestmentDepreciation[index] +
            totalLoanPayments[index])
      );

      return {
        totalRevenue,
        totalTxfee,
        totalCOGS,
        totalCosts,
        totalPersonnelCosts,
        totalInvestmentDepreciation,
        totalLoanPayments,
        netProfit,
      };
    };

    const {
      totalRevenue,
      totalTxfee,
      totalCOGS,
      totalCosts,
      totalPersonnelCosts,
      totalInvestmentDepreciation,
      totalLoanPayments,
      netProfit,
    } = calculateProfitAndLoss();

    const transposedData = [
      { key: "Total Revenue", values: totalRevenue },
      { key: "Total Txfee", values: totalTxfee },
      { key: "Total COGS", values: totalCOGS },
      { key: "Total Costs", values: totalCosts },
      { key: "Total Personnel Costs", values: totalPersonnelCosts },
      {
        key: "Total Investment Depreciation",
        values: totalInvestmentDepreciation,
      },
      { key: "Total Loan Payments", values: totalLoanPayments },
      { key: "Net Profit", values: netProfit },
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
        name: "Total Loan Payments",
        data: totalLoanPayments.map((value) => parseFloat(value?.toFixed(2))),
      },
      {
        name: "Net Profit",
        data: netProfit.map((value) => parseFloat(value?.toFixed(2))),
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
        <h2 className="text-lg font-semibold mb-4">
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

  const [startingCashBalance, setStartingCashBalance] = useState([]);

  const [status, setStatus] = useState([]);

  const [industry, setIndustry] = useState([]);

  const [incomeTax, setIncomeTax] = useState([]);

  const [payrollTax, setPayrollTax] = useState([]);

  const [currency, setCurrency] = useState([]);

  const [startMonth, setStartMonth] = useState([]);

  const [startYear, setStartYear] = useState([]);

  const [financeName, setFinanceName] = useState([]);

  return (
    <div>
      <AlertMsg />
      {isLoading ? (
        <ProgressBar isLoading={isLoading} />
      ) : (
        <>
          <div className="w-full h-full flex flex-col md:flex-row">
            <Gemini />
          </div>
          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
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
                financeName={financeName}
                setFinanceName={setFinanceName}
              />
            </div>
            <div className="w-full md:w-2/3 p-4"></div>
          </div>

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
              <CustomerSection
                customerInputs={customerInputs}
                addNewCustomerInput={addNewCustomerInput}
                removeCustomerInput={removeCustomerInput}
                handleInputChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4 ">
              <h3 className="text-lg font-semibold mb-4">
                Customer Growth Data by Channel
              </h3>
              <Table
                className="overflow-auto mb-4  text-lg"
                dataSource={tableData}
                columns={columns}
                pagination={false}
              />
              <h3 className="text-lg font-semibold">
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

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2 border-r-2">
              <SalesSection
                channelInputs={channelInputs}
                channelNames={channelNames}
                addNewChannelInput={addNewChannelInput}
                removeChannelInput={removeChannelInput}
                handleChannelInputChange={handleChannelInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-4">
                Revenue Data by Channel and Product
              </h3>
              <Table
                className="overflow-auto mb-4"
                dataSource={revenueTableData}
                columns={revenueColumns}
                pagination={false}
              />
              <h3 className="text-lg font-semibold mb-4">
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

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
              <CostSection
                costInputs={costInputs}
                addNewCostInput={addNewCostInput}
                removeCostInput={removeCostInput}
                handleCostInputChange={handleCostInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-4">Cost Table</h3>
              <Table
                className="overflow-auto mb-4"
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

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
              <PersonnelSection
                personnelInputs={personnelInputs}
                addNewPersonnelInput={addNewPersonnelInput}
                removePersonnelInput={removePersonnelInput}
                handlePersonnelInputChange={handlePersonnelInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-4">
                Personnel Cost Table
              </h3>
              <Table
                className="overflow-auto mb-4"
                dataSource={personnelCostTableData}
                columns={personnelCostColumns}
                pagination={false}
              />
              <h3 className="text-lg font-semibold mb-4">
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

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
              <InvestmentSection
                investmentInputs={investmentInputs}
                setInvestmentInputs={setInvestmentInputs}
                addNewInvestmentInput={addNewInvestmentInput}
                removeInvestmentInput={removeInvestmentInput}
                handleInvestmentInputChange={handleInvestmentInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-4">Investment Table</h3>
              <Table
                className="overflow-auto mb-4"
                dataSource={transformInvestmentDataForTable()}
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

          <div className="w-full h-full flex flex-col md:flex-row border-t-2">
            <div className="w-full md:w-1/3 p-4 border-r-2">
              <LoanSection
                loanInputs={loanInputs}
                addNewLoanInput={addNewLoanInput}
                removeLoanInput={removeLoanInput}
                handleLoanInputChange={handleLoanInputChange}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-lg font-semibold mb-4">Loan Data</h3>
              <Table
                className="overflow-auto mb-4"
                dataSource={transformLoanDataForTable()}
                columns={loanColumns}
                pagination={false}
              />
              <h3 className="text-lg font-semibold mb-4">Loan Data</h3>
              <Chart
                options={loanChart.options}
                series={loanChart.series}
                type="line"
                height={350}
              />
            </div>
          </div>
          <ProfitAndLossSection
            revenueData={revenueTableData}
            costData={costData}
            personnelCostData={personnelCostData}
            investmentData={calculateInvestmentData()}
            loanData={calculateLoanData()}
            numberOfMonths={numberOfMonths}
          />
        </>
      )}

      {/* The following sections are commented out */}

      {/* <div>
        <div className="json-input-section mb-8">
          <h2 className="text-lg font-semibold mb-4">Import Data from JSON</h2>
          <textarea
            value={jsonInput || ''}
            onChange={jsonHandleInputChange}
            className="border p-2 w-full mb-4"
            placeholder="Paste your JSON here"
            rows="10"
          ></textarea>
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={applyJsonInput}
          >
            Apply JSON
          </button>
        </div>
      </div> */}
      {/* <LoadingButtonClick isLoading={isLoading} /> */}
    </div>
  );
};

export default Z;
