import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip } from "antd";
import Chart from "react-apexcharts";

const PersonnelSection = ({
  personnelInputs,
  setPersonnelInputs,
  numberOfMonths,
  personnelCostData,
  setPersonnelCostData,
  isSaved,
  setIsSaved,
}) => {
  //PersonnelFunctions

  const [tempPersonnelInputs, setTempPersonnelInputs] =
    useState(personnelInputs);

  const [tempPersonnelCostData, setTempPersonnelCostData] =
    useState(personnelCostData);

  const [renderPersonnelForm, setRenderPersonnelForm] = useState(
    personnelInputs[0]?.id
  );
  const addNewPersonnelInput = () => {
    const maxId = Math.max(...tempPersonnelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newPersonnel = {
      id: newId,
      jobTitle: "New position",
      salaryPerMonth: 0,
      numberOfHires: 1,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    };
    setTempPersonnelInputs([...tempPersonnelInputs, newPersonnel]);
    setRenderPersonnelForm(newId.toString());
  };

  const removePersonnelInput = (id) => {
    const newInputs = tempPersonnelInputs.filter((input) => input?.id != id);

    setTempPersonnelInputs(newInputs);
    setRenderPersonnelForm(newInputs[0]?.id);
  };

  const handlePersonnelInputChange = (id, field, value) => {
    const newInputs = tempPersonnelInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempPersonnelInputs(newInputs);
  };

  const calculatePersonnelCostData = () => {
    let allPersonnelCosts = [];
    tempPersonnelInputs.forEach((personnelInput) => {
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

  const transformPersonnelCostDataForTable = () => {
    const transformedCustomerTableData = tempPersonnelCostData.map((item) => {
      const rowData = { key: item.jobTitle, jobTitle: item.jobTitle };
      item.monthlyCosts.forEach((monthData) => {
        rowData[`month${monthData.month}`] = monthData.cost?.toFixed(2); // Adjust formatting as needed
      });
      return rowData;
    });
    return transformedCustomerTableData;
  };

  //PersonnelUseEffect
  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setPersonnelCostData(calculatedData);
  }, [personnelInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setTempPersonnelCostData(calculatedData);
  }, [tempPersonnelInputs, numberOfMonths]);

  //PersonnelCostTableData

  const personnelCostTableData = transformPersonnelCostDataForTable();

  //PersonnelColumns
  const personnelCostColumns = [
    {
      fixed: "left",
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

  //PersonnelChart
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
    const seriesData = tempPersonnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    setPersonnelChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempPersonnelCostData, numberOfMonths]);

  const handleSelectChange = (event) => {
    setRenderPersonnelForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  useEffect(() => {
    if (isSaved) {
      setPersonnelInputs(tempPersonnelInputs);

      setIsSaved(false);
    }
  }, [isSaved]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/3 p-4 border-r-2">
        <section aria-labelledby="personnel-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="personnel-heading"
          >
            Personnel
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            >
              Selected position name:
            </label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderPersonnelForm}
              onChange={handleSelectChange}
            >
              {tempPersonnelInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.jobTitle}
                </option>
              ))}
            </select>
          </div>

          {tempPersonnelInputs
            .filter((input) => input?.id == renderPersonnelForm) // Sử dụng biến renderForm
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Job Title</span>
                  <Input
                    className="col-start-2"
                    placeholder="Enter Job Title"
                    value={input.jobTitle}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobTitle",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Salary/month</span>
                  <Input
                    className="col-start-2"
                    placeholder="Enter Salary per Month"
                    value={input.salaryPerMonth}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "salaryPerMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">No. of hires</span>
                  <Input
                    className="col-start-2"
                    placeholder="Enter Number of Hires"
                    value={input.numberOfHires}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "numberOfHires",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Job begin month</span>
                  <Input
                    className="col-start-2"
                    placeholder="Enter Job Begin Month"
                    value={input.jobBeginMonth}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobBeginMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <span className=" flex items-center">Job ending month</span>
                  <Input
                    className="col-start-2"
                    placeholder="Enter Job Ending Month"
                    value={input.jobEndMonth}
                    onChange={(e) =>
                      handlePersonnelInputChange(
                        input.id,
                        "jobEndMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-4 rounded"
                    onClick={() => removePersonnelInput(input.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4 mr-4"
            onClick={addNewPersonnelInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded mt-4"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
      <div className="w-full lg:w-2/3 p-4">
        <h3 className="text-2xl font-semibold mb-4">Personnel Cost Table</h3>
        <Table
          className="overflow-auto my-8"
          dataSource={personnelCostTableData}
          columns={personnelCostColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Personnel Cost Chart</h3>
        <Chart
          options={personnelChart.options}
          series={personnelChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default PersonnelSection;
