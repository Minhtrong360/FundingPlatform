import { useEffect } from "react";
import { Input } from "../../../components/ui/Input";

const InvestmentSection = ({
  investmentInputs,
  setInvestmentInputs, // Add this line
  numberOfMonths,
  setInvestmentTableData,
  setInvestmentChart,
}) => {
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
    if (field === "beginMonth" || field === "endMonth") {
      const beginMonth = parseFloat(newInputs[index].beginMonth);
      const endMonth = parseFloat(newInputs[index].endMonth);

      if (field === "beginMonth" && beginMonth > endMonth) {
        newInputs[index].endMonth = value;
      } else if (field === "endMonth" && endMonth < beginMonth) {
        newInputs[index].beginMonth = value;
      }
    }
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

  useEffect(() => {
    setInvestmentTableData(transformInvestmentDataForTable());
  }, [investmentInputs, numberOfMonths]);

  useEffect(() => {
    const seriesData = calculateInvestmentData().map((investment) => {
      return { name: investment.purchaseName, data: investment.assetValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [investmentInputs, numberOfMonths]);

  return (
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
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
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeInvestmentInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={addNewInvestmentInput}
      >
        Add New
      </button>
    </section>
  );
};

export default InvestmentSection;
