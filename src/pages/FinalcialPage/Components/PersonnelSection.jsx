import { useEffect } from "react";
import { Input } from "../../../components/ui/Input";

const PersonnelSection = ({
  personnelInputs,
  setPersonnelInputs,
  numberOfMonth,
  setPersonnelCostData,
  personnelCostData,
  setPersonnelCostTableData,
  setPersonnelChart,
}) => {
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
    if (field === "beginMonth" || field === "endMonth") {
      const beginMonth = parseFloat(newInputs[index].beginMonth);
      const endMonth = parseFloat(newInputs[index].endMonth);

      if (field === "beginMonth" && beginMonth > endMonth) {
        newInputs[index].endMonth = value;
      } else if (field === "endMonth" && endMonth < beginMonth) {
        newInputs[index].beginMonth = value;
      }
    }
    setPersonnelInputs(newInputs);
  };

  const calculatePersonnelCostData = () => {
    let allPersonnelCosts = [];
    personnelInputs.forEach((personnelInput) => {
      let monthlyCosts = [];
      // Determine the number of months based on the selected duration

      for (let month = 1; month <= numberOfMonth; month++) {
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

  useEffect(() => {
    const tableData = transformPersonnelCostDataForTable();
    setPersonnelCostTableData(tableData);
  }, [personnelCostData]);

  useEffect(() => {
    const seriesData = personnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    setPersonnelChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [personnelCostData]);

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

export default PersonnelSection;
