import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";
import { useEffect } from "react";

const CostSection = ({
  costInputs,
  setCostInputs,
  setCostData,
  numberOfMonths,
  setCostTableData,
  costData,
  setCostChart,
}) => {
  const handleAddNewCost = () => {
    setCostInputs([
      ...costInputs,
      {
        costName: "",
        costValue: 0,
        growthPercentage: 0,
        beginMonth: 1,
        endMonth: 12,
      },
    ]);
  };

  const removeCostInput = (index) => {
    const newInputs = [...costInputs];
    newInputs.splice(index, 1);
    setCostInputs(newInputs);
  };

  const handleCostInputChange = (index, field, value) => {
    const newInputs = [...costInputs];

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

    setCostInputs(newInputs);
  };

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
        ).toFixed(2);
      });
    });

    return Object.values(transformedData);
  };

  useEffect(() => {
    const calculatedData = calculateCostData();

    setCostData(calculatedData);
    setCostTableData(transformCostDataForTable());
  }, [costInputs, numberOfMonths]);

  useEffect(() => {
    const seriesData = costData.map((item) => {
      return {
        name: item.costName,
        data: item.monthlyCosts.map((cost) => cost.cost),
      };
    });

    setCostChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [costData, numberOfMonths]);

  return (
    <section aria-labelledby="costs-heading" className="mb-8">
      <h2
        className="text-lg font-semibold mb-4 flex items-center mt-16"
        id="costs-heading"
      >
        Costs
      </h2>

      {costInputs.map((input, index) => (
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4 ">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Cost Name:</span>
            <Input
              required
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
              required
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
              required
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
              required
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
              required
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
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeCostInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-600 text-white py-2 px-4 rounded"
        onClick={handleAddNewCost}
      >
        Add New
      </button>
    </section>
  );
};

export default CostSection;
