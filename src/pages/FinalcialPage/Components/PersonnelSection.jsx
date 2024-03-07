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
  transformPersonnelCostDataForTable,
}) => {
  //PersonnelFunctions
  const addNewPersonnelInput = () => {
    setPersonnelInputs([
      ...personnelInputs,
      {
        jobTitle: "",
        salaryPerMonth: 0,
        numberOfHires: 1,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
    ]);
  };

  const removePersonnelInput = (index) => {
    const newInputs = [...personnelInputs];
    newInputs.splice(index, 1);
    setPersonnelInputs(newInputs);
  };

  const handlePersonnelInputChange = (index, field, value) => {
    const newInputs = [...personnelInputs];
    newInputs[index][field] = value;
    setPersonnelInputs(newInputs);
  };

  const calculatePersonnelCostData = () => {
    let allPersonnelCosts = [];
    personnelInputs.forEach((personnelInput) => {
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

  //PersonnelUseEffect
  useEffect(() => {
    const calculatedData = calculatePersonnelCostData();
    setPersonnelCostData(calculatedData);
  }, [personnelInputs, numberOfMonths]);

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
    const seriesData = personnelCostData.map((personnel) => {
      return {
        name: personnel.jobTitle,
        data: personnel.monthlyCosts.map((month) => month.cost),
      };
    });

    setPersonnelChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [personnelCostData, numberOfMonths]);

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
          {personnelInputs.map((input, index) => (
            <div key={index} className="bg-white rounded-md shadow p-6 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <span className=" flex items-center">Job Title</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Job Title"
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
                <span className=" flex items-center">Salary/month</span>
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
                <span className=" flex items-center">No. of hires</span>
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
                <span className=" flex items-center">Job begin month</span>
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
                <span className=" flex items-center">Job ending month</span>
                <Input
                  className="col-start-2"
                  placeholder="Enter Job Ending Month"
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
              <div className="flex justify-end items-center">
                <button
                  className="bg-red-600 text-white py-1 px-4 rounded"
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
