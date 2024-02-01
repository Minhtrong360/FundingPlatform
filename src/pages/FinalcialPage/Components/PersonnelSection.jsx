import { Input } from "../../../components/ui/Input";

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
        <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Job Title</span>
            <Input
              required
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
              required
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
              required
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
              required
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
              required
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
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => removePersonnelInput(index)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={addNewPersonnelInput}
      >
        Add New
      </button>
    </section>
  );
};

export default PersonnelSection;
