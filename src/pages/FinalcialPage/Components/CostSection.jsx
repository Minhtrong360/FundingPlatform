import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";

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
