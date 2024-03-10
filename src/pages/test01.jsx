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

const DurationSelect = ({ selectedDuration, setSelectedDuration }) => {
  return (
    <section aria-labelledby="duration-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        id="duration-heading"
      >
        Duration
      </h2>
      <div className="bg-white rounded-md shadow p-6 border">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <span className="font-medium">Duration</span>
          <Select onValueChange={(value) => setSelectedDuration(value)}>
            <SelectTrigger id="start-date-year">
              <SelectValue placeholder={selectedDuration} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="3 years">3 years</SelectItem>
              <SelectItem value="5 years">5 years</SelectItem>
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
      customersPerMonth: 0,
      growthPerMonth: 0,
      channelName: "",
    };
    addNewCustomerInput(newCustomerInput);
  };

  return (
    <section aria-labelledby="customers-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="customers-heading"
      >
        Customer
      </h2>

      {customerInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4">
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
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="sales-heading"
      >
        Sales Section
      </h2>

      {channelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4">
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
              <SelectTrigger id={`select-channel-${index}`}>
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
              min="0"
              max="100"
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
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="costs-heading"
      >
        Costs
      </h2>

      {costInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4 ">
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
              <SelectTrigger id={`select-costType-${index}`}>
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
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="personnel-heading"
      >
        Personnel
      </h2>
      {personnelInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4">
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
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="investment-heading"
      >
        Investment
      </h2>
      {investmentInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4">
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
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="loan-heading"
      >
        Loan
      </h2>

      {loanInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 border mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Name:</span>
            <input
              className="border p-2 rounded"
              value={input.loanName}
              onChange={(e) =>
                handleLoanInputChange(index, "loanName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Amount:</span>
            <input
              type="number"
              className="border p-2 rounded"
              value={input.loanAmount}
              onChange={(e) =>
                handleLoanInputChange(index, "loanAmount", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Interest Rate (%):</span>
            <input
              type="number"
              className="border p-2 rounded"
              value={input.interestRate}
              onChange={(e) =>
                handleLoanInputChange(index, "interestRate", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Month Loan Begins:</span>
            <input
              type="number"
              className="border p-2 rounded"
              value={input.loanBeginMonth}
              onChange={(e) =>
                handleLoanInputChange(index, "loanBeginMonth", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Month Loan Ends:</span>
            <input
              type="number"
              className="border p-2 rounded"
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

const X = () => {
  //DurationSection
  const [selectedDuration, setSelectedDuration] = useState("3 years");

  //CustomerSection
  const [customerInputs, setCustomerInputs] = useState([
    {
      customersPerMonth: 100,
      growthPerMonth: 10,
      channelName: "",
      beginMonth: 1,
      endMonth: 12,
    },
  ]);

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

  const calculateCustomerGrowth = (customerInputs, selectedDuration) => {
    const months = selectedDuration === "3 years" ? 36 : 60;
    return customerInputs.map((channel) => {
      let customers = [];
      let currentCustomers = parseFloat(channel.customersPerMonth);
      for (let i = channel.beginMonth; i <= months; i++) {
        customers.push({
          month: i,
          customers: currentCustomers,
          channelName: channel.channelName,
        });
        currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
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
  }, [customerGrowthData, channelInputs]);

  useEffect(() => {
    const calculatedData = calculateCustomerGrowth(
      customerInputs,
      selectedDuration
    );
    setCustomerGrowthData(calculatedData);
  }, [customerInputs, selectedDuration]);

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
      jobTitle: "",
      salaryPerMonth: 0,
      numberOfHires: 0,
      jobBeginMonth: 1,
      jobEndMonth: 8,
    },
  ]);

  // Function to add a new personnel input
  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 0,
        jobBeginMonth: 1,
        jobEndMonth: 8,
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
      const totalMonths = selectedDuration === "3 years" ? 36 : 60;

      for (let month = 1; month <= totalMonths; month++) {
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
  }, [personnelInputs]);

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

  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: "0",
        purchaseMonth: "2",
        residualValue: "10",
        usefulLifetime: "5",
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
      loanName: "",
      loanAmount: "",
      interestRate: "",
      loanBeginMonth: "",
      loanEndMonth: "",
    },
  ]);

  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "",
        interestRate: "",
        loanBeginMonth: "",
        loanEndMonth: "",
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
        loanAmountRow[monthKey] = monthData.loanAmount.toFixed(2);
        paymentRow[monthKey] = monthData.payment.toFixed(2);
        principalRow[monthKey] = monthData.principal.toFixed(2);
        interestRow[monthKey] = monthData.interest.toFixed(2);
        balanceRow[monthKey] = monthData.balance.toFixed(2);
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

  const numberOfMonths = selectedDuration === "3 years" ? 36 : 60;

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
          ).toFixed(2);
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
      title: `Month ${month}`,
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
          revenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
          txFeeRow[`month${index + 1}`] = parseFloat(
            channelTxFee[index]
          ).toFixed(2);
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
        netRevenueRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
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
        grossProfitRow[`month${index + 1}`] = parseFloat(value).toFixed(2);
      });

      revenueTableData.push(revenueRow);
      revenueTableData.push(txFeeRow);
      revenueTableData.push(cogsRow);
      revenueTableData.push(netRevenueRow);
      revenueTableData.push(grossProfitRow);
      console.log(revenueTableData);
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
  }, [costInputs]);

  const transformCostDataForTable = () => {
    const transformedData = {};
    const calculatedCostData = calculateCostData();
    // console.log("calculatedCostData", calculatedCostData);
    calculatedCostData.forEach((costItem) => {
      const rowKey = `${costItem.costType} - ${costItem.costName}`;
      costItem.monthlyCosts.forEach((monthData) => {
        if (!transformedData[rowKey]) {
          transformedData[rowKey] = { key: rowKey, costName: rowKey };
        }
        transformedData[rowKey][`month${monthData.month}`] = parseFloat(
          monthData.cost
        ).toFixed(2);
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
        rowData[`month${monthData.month}`] = monthData.cost.toFixed(2); // Adjust formatting as needed
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
          assetCostRow[`month${monthIndex + 1}`] = assetCost.toFixed(2); // Using Asset Cost
          depreciationRow[`month${monthIndex + 1}`] =
            investment.depreciationArray[monthIndex].toFixed(2);
          accumulatedDepreciationRow[`month${monthIndex + 1}`] =
            investment.accumulatedDepreciation[monthIndex].toFixed(2);
          bookValueRow[`month${monthIndex + 1}`] = (
            assetCost - investment.accumulatedDepreciation[monthIndex]
          ).toFixed(2);
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

  console.log("Object.values(transformedData)", transformedData);
  console.log("customerGrowthData", customerGrowthData);

  useEffect(() => {
    const seriesData = customerGrowthData.map((channelData) => {
      console.log("channelData", channelData);
      return {
        name: channelData[0]?.channelName || "Unknown Channel",
        data: channelData.map((data) => data.customers),
      };
    });

    setCustomerGrowthChart((prevState) => ({
      ...prevState,
      series: seriesData,
    }));
  }, [customerGrowthData]);

  const [grossProfit, setgrossProfit] = useState({
    options: {
      chart: { id: "gross-profit-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      // title: { text: 'Revenue Data by Channel and Product', align: 'left' },
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

  useEffect(() => {
    const seriesData = Object.entries(grossProfitData).map(([key, data]) => {
      return { name: key, data };
    });

    setgrossProfit((prevState) => ({ ...prevState, series: seriesData }));
  }, [grossProfitData]);

  const [costChart, setCostChart] = useState({
    options: {
      chart: { id: "cost-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      // title: { text: 'Cost Data', align: 'left' },
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

  useEffect(() => {
    const seriesData = costData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [costData]);

  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: { id: "personnel-chart", type: "bar", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      // title: { text: 'Personnel Cost Data', align: 'left' },
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

  useEffect(() => {
    const seriesData = personnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    setPersonnelChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [personnelCostData]);

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      // title: { text: 'Investment Data', align: 'left' },
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

  useEffect(() => {
    const seriesData = calculateInvestmentData().map((investment) => {
      return { name: investment.purchaseName, data: investment.assetValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [investmentInputs]);

  const [loanChart, setLoanChart] = useState({
    options: {
      chart: { id: "loan-chart", type: "line", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `Month ${i + 1}`
        ),
      },
      // title: { text: 'Loan Data', align: 'left' },
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

  useEffect(() => {
    const seriesData = calculateLoanData().map((loan) => {
      return {
        name: loan.loanName,
        data: loan.loanDataPerMonth.map((month) => month.payment),
      };
    });

    setLoanChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [loanInputs]);

  return (
    <div>
      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <DurationSelect
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />
        </div>
        <div className="w-full md:w-2/3 p-4"></div>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
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
            className="overflow-auto mb-4"
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

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
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

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
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

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
          <PersonnelSection
            personnelInputs={personnelInputs}
            addNewPersonnelInput={addNewPersonnelInput}
            removePersonnelInput={removePersonnelInput}
            handlePersonnelInputChange={handlePersonnelInputChange}
          />
        </div>
        <div className="w-full md:w-2/3 p-4">
          <h3 className="text-lg font-semibold mb-4">Personnel Cost Table</h3>
          <Table
            className="overflow-auto mb-4"
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

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
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

      <div className="w-full h-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 p-4">
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
    </div>
  );
};

export default X;
