import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import Table from "../pages/FinalcialComponents/Table";

const Alpha = () => {
  const [selectedDuration, setSelectedDuration] = useState("3 years");
  const columns = 5;
  const [customerInputs, setCustomerInputs] = useState([
    { channelName: "Online", customersPerMonth: 100, growthPerMonth: 10 },
  ]);

  const addNewCustomerInput = () => {
    setCustomerInputs([
      ...customerInputs,
      { customersPerMonth: 0, growthPerMonth: 0, channelName: "" },
    ]);
  };

  const removeCustomerInput = (index) => {
    const newInputs = [...customerInputs];
    newInputs.splice(index, 1);
    setCustomerInputs(newInputs);
  };

  const handleCustomerInputChange = (index, field, value) => {
    const newInputs = [...customerInputs];
    newInputs[index][field] = value;
    setCustomerInputs(newInputs);
  };

  const calculateCustomerResult = () => {
    const customerResult = customerInputs.map((input) => {
      const { channelName, customersPerMonth, growthPerMonth } = input;
      const result = {};

      let currentCustomers = customersPerMonth;

      for (let month = 1; month <= 5; month++) {
        result[month] = Math.round(currentCustomers);

        currentCustomers *= 1 + parseFloat(growthPerMonth) / 100;
      }

      return { channelName, result };
    });

    return customerResult;
  };

  const [customerResult, setCustomerResult] = useState(
    calculateCustomerResult()
  );

  useEffect(() => {
    // Recalculate revenueResult when channelInputs or customerResult change
    setCustomerResult(calculateCustomerResult());
  }, [customerInputs]);

  // console.log("customerInputs", customerInputs);
  console.log("customerResult", customerResult);

  const [channelInputs, setChannelInputs] = useState([
    {
      price: 100,
      multiples: 2,
      txFeePercentage: 10,
      cogsPercentage: 30,
      selectedChannel: customerInputs[0].channelName, // Initialize with null or another default value
    },
  ]);

  const addNewChannelInput = () => {
    setChannelInputs([
      ...channelInputs,
      { price: "0", multiples: "0", txFeePercentage: "0", selectedChannel: "" },
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

  // Calculate revenueResult based on channelInputs and customerResult
  const calculateRevenueResult = () => {
    const result = customerResult
      .map((customer) => {
        const { channelName, result: customerResultData } = customer;

        if (
          channelInputs.find((input) => input.selectedChannel === channelName)
        ) {
          const channelInput = channelInputs.find(
            (input) => input.selectedChannel === channelName
          );
          const { price, multiples, txFeePercentage, cogsPercentage } =
            channelInput;

          const revenueResult = {};
          const txFeeResult = {};
          const cogsResult = {};
          const netRevenueResult = {};
          const grossProfitResult = {};

          for (let month = 1; month <= 5; month++) {
            const currentCustomers = customerResultData[month];
            const revenue = currentCustomers * price * multiples;
            const txFeePercentageFloat = parseFloat(txFeePercentage) / 100;
            const cogsPercentageFloat = parseFloat(cogsPercentage) / 100;
            const txFee = revenue * txFeePercentageFloat;
            const cogs = revenue * cogsPercentageFloat;
            const netRevenue = revenue - txFee;
            const grossProfit = netRevenue - cogs;

            revenueResult[month] = Math.round(revenue);
            txFeeResult[month] = Math.round(txFee);
            cogsResult[month] = Math.round(cogs);
            netRevenueResult[month] = Math.round(netRevenue);
            grossProfitResult[month] = Math.round(grossProfit);
          }

          return {
            revenueName: channelName,
            revenueResult,
            txFeeResult,
            cogsResult,
            netRevenueResult,
            grossProfitResult,
          };
        }
      })
      .filter(Boolean);

    return result;
  };

  const [revenueResult, setRevenueResult] = useState(calculateRevenueResult());

  useEffect(() => {
    // Recalculate revenueResult when channelInputs or customerResult change
    setRevenueResult(calculateRevenueResult());
  }, [channelInputs, customerResult]);

  console.log("revenueResult", revenueResult);

  const [costInputs, setCostInputs] = useState([
    {
      costName: "", // Initialize with an empty string or default value
      costValue: 0, // Initialize with a default value
      beginMonth: 1,
      endMonth: 10,
    },
  ]);
  const handleCostInputChange = (index, field, value) => {
    const newInputs = [...costInputs];
    newInputs[index][field] = value;
    setCostInputs(newInputs);
  };

  const addNewCostInput = () => {
    setCostInputs([
      ...costInputs,
      {
        costName: "", // Initialize with an empty string
        costValue: 0, // Initialize with a default value
        beginMonth: 1, // Set default or desired value
        endMonth: 10, // Set default or desired value
      },
    ]);
  };

  const removeCostInput = (index) => {
    const newInputs = [...costInputs];
    newInputs.splice(index, 1);
    setCostInputs(newInputs);
  };

  const calculateCostsResult = () => {
    const costsResult = costInputs.map((input) => {
      const { costName, costValue, beginMonth, endMonth } = input;

      const costResult = {};

      for (let month = 1; month <= 5; month++) {
        costResult[month] =
          month >= beginMonth && month <= endMonth
            ? parseFloat(costValue) // Use CostValueFloat if needed
            : 0;
      }

      return { costName, result: costResult };
    });

    return costsResult;
  };

  const [costsResult, setCostsResult] = useState(calculateCostsResult());

  useEffect(() => {
    setCostsResult(calculateCostsResult());
  }, [costInputs]);
  console.log("costsResult", costsResult);

  const [personnelInputs, setPersonnelInputs] = useState([
    {
      jobTitle: "",
      salaryPerMonth: 0,
      numberOfHires: 0,
      jobBeginMonth: 1,
      jobEndMonth: 8,
    },
  ]);

  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 0,
        jobBeginMonth: 1,
        jobEndMonth: 10,
      },
    ]);
  };

  const handlePersonnelInputChange = (index, field, value) => {
    const newInputs = [...personnelInputs];
    newInputs[index][field] = value;
    setPersonnelInputs(newInputs);
  };

  const removePersonnelInput = (index) => {
    const newInputs = [...personnelInputs];
    newInputs.splice(index, 1);
    setPersonnelInputs(newInputs);
  };

  const calculatePersonnelResult = () => {
    const personnelResult = personnelInputs.map((input) => {
      const {
        jobTitle,
        salaryPerMonth,
        numberOfHires,
        jobBeginMonth,
        jobEndMonth,
      } = input;

      const personnelResultData = {};

      for (let month = 1; month <= 5; month++) {
        personnelResultData[month] =
          month >= jobBeginMonth && month <= jobEndMonth
            ? parseFloat(salaryPerMonth) * parseFloat(numberOfHires)
            : 0;
      }

      return { jobTitle, result: personnelResultData };
    });

    return personnelResult;
  };

  const [personnelResult, setPersonnelResult] = useState(
    calculatePersonnelResult()
  );

  useEffect(() => {
    setPersonnelResult(calculatePersonnelResult());
  }, [personnelInputs]);
  console.log("personnelResult", personnelResult);

  const [investmentInputs, setInvestmentInputs] = useState([
    {
      purchaseName: "",
      assetCost: 1000,
      purchaseMonth: 2,
      residualValue: 10,
      usefulLifetime: 5,
    },
  ]);

  const handleInvestmentInputChange = (index, field, value) => {
    const newInputs = [...investmentInputs];
    newInputs[index][field] = value;
    setInvestmentInputs(newInputs);
  };

  // Function to add a new investment input
  const addNewInvestmentInput = () => {
    setInvestmentInputs([
      ...investmentInputs,
      {
        purchaseName: "",
        assetCost: 0,
        purchaseMonth: 2,
        residualValue: 0,
        usefulLifetime: 0,
      },
    ]);
  };

  // Function to remove an investment input
  const removeInvestmentInput = (index) => {
    const newInputs = [...investmentInputs];
    newInputs.splice(index, 1);
    setInvestmentInputs(newInputs);
  };

  const calculateInvestmentResult = () => {
    const investmentResult = investmentInputs.map((input) => {
      const {
        purchaseName,
        assetCost,
        purchaseMonth,
        residualValue,
        usefulLifetime,
      } = input;

      const bookValueData = {};
      const depreciationData = {};
      const accumulatedDepreciationData = {};

      let accumulatedDepreciation = 0;
      let bookValue = parseFloat(assetCost);

      for (let month = 1; month <= 5; month++) {
        let depreciation = 0;

        if (
          month >= parseInt(purchaseMonth) &&
          month < parseInt(purchaseMonth) + parseFloat(usefulLifetime)
        ) {
          depreciation =
            parseFloat(assetCost - residualValue) / parseFloat(usefulLifetime);
          accumulatedDepreciation += depreciation;
        }

        if (month >= parseInt(purchaseMonth)) {
          bookValue = parseFloat(assetCost) - accumulatedDepreciation;
        }

        bookValueData[month] = bookValue;
        depreciationData[month] = depreciation;
        accumulatedDepreciationData[month] = accumulatedDepreciation;
      }

      return {
        purchaseName,
        bookValue: bookValueData,
        depreciation: depreciationData,
        accumulatedDepreciation: accumulatedDepreciationData,
      };
    });

    return investmentResult;
  };

  const [investmentResult, setInvestmentResult] = useState(
    calculateInvestmentResult()
  );

  useEffect(() => {
    setInvestmentResult(calculateInvestmentResult());
  }, [investmentInputs]);
  console.log("investmentResult", investmentResult);

  const [loanInputs, setLoanInputs] = useState([
    {
      loanName: "",
      loanAmount: 500,
      interestRate: 10,
      loanBeginMonth: 1,
      loanLength: 6,
    },
  ]);

  const handleLoanInputChange = (index, field, value) => {
    const newInputs = [...loanInputs];
    newInputs[index][field] = value;
    setLoanInputs(newInputs);
  };

  // Function to add a new loan input
  const addNewLoanInput = () => {
    setLoanInputs([
      ...loanInputs,
      {
        loanName: "",
        loanAmount: "0",
        interestRate: "0",
        loanBeginMonth: "",
        loanLength: "0",
      },
    ]);
  };

  // Function to remove a loan input
  const removeLoanInput = (index) => {
    const newInputs = [...loanInputs];
    newInputs.splice(index, 1);
    setLoanInputs(newInputs);
  };

  const calculateLoanResult = () => {
    const loanResult = loanInputs.map((input) => {
      const { loanName, loanAmount, interestRate, loanBeginMonth, loanLength } =
        input;

      let principalPayment = 0;
      let interestPayment = 0;
      let loanBalanceDisplay = 0;

      const loanAmountData = {};
      const principalPaymentData = {};
      const interestPaymentData = {};
      const loanBalanceData = {};

      let remainingLoanBalance = parseFloat(loanAmount);

      for (let month = 1; month <= 5; month++) {
        if (month === parseInt(loanBeginMonth)) {
          loanAmountData[month] = parseFloat(loanAmount).toFixed(0);
        } else {
          loanAmountData[month] = 0;
        }

        if (
          month >= parseInt(loanBeginMonth) &&
          month < parseInt(loanBeginMonth) + parseInt(loanLength)
        ) {
          principalPayment = parseFloat(loanAmount) / parseInt(loanLength);
          interestPayment =
            remainingLoanBalance * (parseFloat(interestRate) / 100 / 12);
          remainingLoanBalance -= principalPayment;

          loanBalanceDisplay = remainingLoanBalance.toFixed(0);
        } else {
          principalPayment = 0;
          interestPayment = 0;
          loanBalanceDisplay = 0;
        }

        principalPaymentData[month] = principalPayment.toFixed(0);
        interestPaymentData[month] = interestPayment.toFixed(0);
        loanBalanceData[month] = loanBalanceDisplay;
      }

      return {
        loanName,
        loanAmount: loanAmountData,
        principalPayment: principalPaymentData,
        interestPayment: interestPaymentData,
        loanBalance: loanBalanceData,
      };
    });

    return loanResult;
  };

  const [loanResult, setLoanResult] = useState(calculateLoanResult());

  useEffect(() => {
    setLoanResult(calculateLoanResult());
  }, [loanInputs]);
  console.log("loanResult", loanResult);

  return (
    <div className="mx-auto" style={{ width: "80%" }}>
      <div className="max-w-md mx-auto">
        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Basic Info
          </h2>
          <div className="bg-white rounded-md shadow p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="font-medium">Duration</span>
              <Select onValueChange={(value) => setSelectedDuration(value)}>
                <SelectTrigger id="start-date-year">
                  <SelectValue placeholder="3 years" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="3 years">3 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Customer
          </h2>
          {customerInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Customer per Month</span>
                <Input
                  className="col-start-2"
                  value={input.customersPerMonth}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "customersPerMonth",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Growth per Month</span>
                <Input
                  className="col-start-2"
                  value={input.growthPerMonth}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "growthPerMonth",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Channel Name</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Channel Name"
                  value={input.channelName}
                  onChange={(e) =>
                    handleCustomerInputChange(
                      index,
                      "channelName",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeCustomerInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewCustomerInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="customers-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="customers-heading"
          >
            Sales channel
          </h2>
          {channelInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Price</span>
                <Input
                  className="col-start-2"
                  placeholder="100"
                  value={input.price}
                  onChange={(e) =>
                    handleChannelInputChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Multiples</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.multiples}
                  onChange={(e) =>
                    handleChannelInputChange(index, "multiples", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Tx Fee (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
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
                <span className="font-medium">COGS (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
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
                <span className="font-medium">Sales Channel</span>
                <Select
                  onValueChange={(value) => {
                    const newInputs = [...channelInputs];
                    newInputs[index].selectedChannel = value;
                    setChannelInputs(newInputs);
                  }}
                  value={
                    input.selectedChannel !== null ? input.selectedChannel : ""
                  }
                >
                  <SelectTrigger id={`select-channel-${index}`}>
                    <SelectValue placeholder="Select Channel" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {customerInputs
                      .filter(
                        (input) =>
                          input.channelName && input.channelName.trim() !== ""
                      )
                      .map((input, index) => (
                        <SelectItem key={index} value={input.channelName}>
                          {input.channelName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeChannelInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewChannelInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="costs-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="costs-heading"
          >
            Costs
          </h2>
          {costInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Cost name</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Cost Name"
                  value={input.costName}
                  onChange={(e) =>
                    handleCostInputChange(index, "costName", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Cost Value</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
                  value={input.costValue}
                  onChange={(e) =>
                    handleCostInputChange(index, "costValue", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Begin Month</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.beginMonth}
                  onChange={(e) =>
                    handleCostInputChange(index, "beginMonth", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">End Month</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.endMonth}
                  onChange={(e) =>
                    handleCostInputChange(index, "endMonth", e.target.value)
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeCostInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewCostInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="personnel-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
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
                  placeholder="CFO"
                  value={input.jobTitle}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "jobTitle",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Salary/month</span>
                <Input
                  className="col-start-2"
                  placeholder="0"
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
                  placeholder="0"
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
                  placeholder="2"
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
                  placeholder="10"
                  value={input.jobEndMonth}
                  onChange={(e) =>
                    handlePersonnelInputChange(
                      index,
                      "jobEndMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removePersonnelInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewPersonnelInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="investment-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
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
                  placeholder="Enter Name of Purchase"
                  value={input.purchaseName}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "purchaseName",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Asset Cost</span>
                <Input
                  className="col-start-2"
                  placeholder="1000"
                  value={input.assetCost}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "assetCost",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Purchase Month</span>
                <Input
                  className="col-start-2"
                  placeholder="2"
                  value={input.purchaseMonth}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "purchaseMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Residual Value</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.residualValue}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "residualValue",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Useful Lifetime (Months)</span>
                <Input
                  className="col-start-2"
                  placeholder="5"
                  value={input.usefulLifetime}
                  onChange={(e) =>
                    handleInvestmentInputChange(
                      index,
                      "usefulLifetime",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeInvestmentInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewInvestmentInput}
          >
            Add New
          </button>
        </section>

        <section aria-labelledby="loan-heading" className="mb-8">
          <h2
            className="text-lg font-semibold mb-4 flex items-center mt-16"
            id="loan-heading"
          >
            Loan
          </h2>
          {loanInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Loan Amount</span>
                <Input
                  className="col-start-2"
                  placeholder="500"
                  value={input.loanAmount}
                  onChange={(e) =>
                    handleLoanInputChange(index, "loanAmount", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Interest Rate (%)</span>
                <Input
                  className="col-start-2"
                  placeholder="10"
                  value={input.interestRate}
                  onChange={(e) =>
                    handleLoanInputChange(index, "interestRate", e.target.value)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Month Begin Loan</span>
                <Input
                  className="col-start-2"
                  placeholder="5"
                  value={input.loanBeginMonth}
                  onChange={(e) =>
                    handleLoanInputChange(
                      index,
                      "loanBeginMonth",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className="font-medium">Loan Length (Months)</span>
                <Input
                  className="col-start-2"
                  placeholder="6"
                  value={input.loanLength}
                  onChange={(e) =>
                    handleLoanInputChange(index, "loanLength", e.target.value)
                  }
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => removeLoanInput(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded"
            onClick={addNewLoanInput}
          >
            Add New
          </button>
        </section>
      </div>
      <Table
        customerResult={customerResult}
        revenueResult={revenueResult}
        personnelResult={personnelResult}
        investmentResult={investmentResult}
        loanResult={loanResult}
      />
    </div>
  );
};

const X = () => {
  return (
    <div>
      <Alpha />
    </div>
  );
};

export default X;
