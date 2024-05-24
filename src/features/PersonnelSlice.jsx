import { createSlice } from "@reduxjs/toolkit";
import { formatNumber } from "./CostSlice";

export const personnelSlice = createSlice({
  name: "personnel",
  initialState: {
    personnelInputs: [
      {
        id: 1,
        jobTitle: "Cashier",
        department: "Sales", // Updated to lowercase
        salaryPerMonth: 800,
        increasePerYear: 10,
        growthSalaryFrequency: "Annually",
        numberOfHires: 2,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
      {
        id: 2,
        jobTitle: "Manager",
        department: "Management", // Updated to lowercase
        salaryPerMonth: 2000,
        increasePerYear: 10,
        growthSalaryFrequency: "Annually",
        numberOfHires: 1,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
    ],
    personnelCostData: [],
    personnelTableData: [],
  },
  reducers: {
    setPersonnelInputs: (state, action) => {
      state.personnelInputs = action.payload;
    },
    setPersonnelCostData: (state, action) => {
      state.personnelCostData = action.payload;
    },
    setPersonnelTableData: (state, action) => {
      state.personnelTableData = action.payload;
    },
  },
});

export const calculatePersonnelCostData = (
  tempPersonnelInputs,
  numberOfMonths
) => {
  let allPersonnelCosts = [];
  tempPersonnelInputs.forEach((personnelInput) => {
    let monthlyCosts = [];
    let currentSalary = parseFloat(personnelInput.salaryPerMonth);
    for (let month = 1; month <= numberOfMonths; month++) {
      if (
        month >= personnelInput.jobBeginMonth &&
        month <= personnelInput.jobEndMonth
      ) {
        if (personnelInput.growthSalaryFrequency === "Monthly") {
          monthlyCosts.push({
            month: month,
            cost: currentSalary * parseInt(personnelInput.numberOfHires),
          });
          currentSalary *= 1 + parseFloat(personnelInput.increasePerYear) / 100;
        } else {
          let frequency = 12; // Default to Annually
          if (personnelInput.growthSalaryFrequency === "Quarterly")
            frequency = 3;
          else if (personnelInput.growthSalaryFrequency === "Semi-Annually")
            frequency = 6;

          if (
            month === personnelInput.jobBeginMonth ||
            (month > personnelInput.jobBeginMonth &&
              (month - personnelInput.jobBeginMonth) % frequency === 0)
          ) {
            if (month !== personnelInput.jobBeginMonth) {
              currentSalary *=
                1 + parseFloat(personnelInput.increasePerYear) / 100;
            }
          }
          monthlyCosts.push({
            month: month,
            cost: currentSalary * parseInt(personnelInput.numberOfHires),
          });
        }
      } else {
        monthlyCosts.push({ month: month, cost: 0 });
      }
    }
    allPersonnelCosts.push({
      jobTitle: `${personnelInput.jobTitle} (${personnelInput.numberOfHires})`,
      department: personnelInput?.department?.toLowerCase(), // Normalize department to lowercase
      monthlyCosts,
    });
  });
  return allPersonnelCosts;
};

export const transformPersonnelCostDataForTable = (tempPersonnelCostData) => {
  const groupedByDepartment = tempPersonnelCostData.reduce((acc, item) => {
    const normalizedDepartment = item.department.toLowerCase(); // Normalize department to lowercase
    if (!acc[normalizedDepartment]) {
      acc[normalizedDepartment] = [];
    }
    acc[normalizedDepartment].push(item);
    return acc;
  }, {});

  const transformedPersonnelTableData = [];

  for (const [department, items] of Object.entries(groupedByDepartment)) {
    transformedPersonnelTableData.push({
      key: department.toUpperCase(),
      jobTitle: department.toUpperCase(),
      department: department,
      isDepartment: true,
    });

    items.forEach((item) => {
      const rowData = {
        key: item.jobTitle,
        jobTitle: item.jobTitle,
        department: item.department,
      };
      item.monthlyCosts?.forEach((monthData) => {
        rowData[`month${monthData.month}`] = formatNumber(
          monthData.cost?.toFixed(2)
        );
      });
      transformedPersonnelTableData.push(rowData);
    });
  }

  const totalRow = { key: "Total", jobTitle: "Total", department: "" };
  tempPersonnelCostData[0]?.monthlyCosts.forEach((monthData, index) => {
    let totalMonthlyCost = 0;
    tempPersonnelCostData.forEach((item) => {
      const cost = item.monthlyCosts[index].cost || 0;
      totalMonthlyCost += cost;
    });
    totalRow[`month${monthData.month}`] = formatNumber(
      totalMonthlyCost.toFixed(2)
    );
  });
  transformedPersonnelTableData.push(totalRow);
  return transformedPersonnelTableData;
};

export const {
  setPersonnelInputs,
  setPersonnelCostData,
  setIsSaved,
  setPersonnelTableData,
} = personnelSlice.actions;

export default personnelSlice.reducer;
