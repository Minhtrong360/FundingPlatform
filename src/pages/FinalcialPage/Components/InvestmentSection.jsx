import { Input } from "../../../components/ui/Input";

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
