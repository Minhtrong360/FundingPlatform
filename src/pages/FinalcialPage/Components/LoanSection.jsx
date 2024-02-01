import { Input } from "../../../components/ui/Input";

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
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Name:</span>
            <Input
              required
              className="border p-2 rounded"
              value={input.loanName}
              onChange={(e) =>
                handleLoanInputChange(index, "loanName", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Loan Amount:</span>
            <Input
              required
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
            <Input
              required
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
            <Input
              required
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
            <Input
              required
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
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removeLoanInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={addNewLoanInput}
      >
        Add New
      </button>
    </section>
  );
};

export default LoanSection;
