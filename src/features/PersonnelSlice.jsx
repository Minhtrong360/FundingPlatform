import { createSlice } from "@reduxjs/toolkit";

export const personnelSlice = createSlice({
  name: "personnel",
  initialState: {
    personnelInputs: [
      {
        id: 1,
        jobTitle: "Cashier",
        salaryPerMonth: 800,
        increasePerYear: 10,
        numberOfHires: 2,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
      {
        id: 2,
        jobTitle: "Manager",
        salaryPerMonth: 2000,
        increasePerYear: 10,
        numberOfHires: 1,
        jobBeginMonth: 1,
        jobEndMonth: 36,
      },
    ],
    personnelCostData: [],
  },
  reducers: {
    setPersonnelInputs: (state, action) => {
      state.personnelInputs = action.payload;
    },
    setPersonnelCostData: (state, action) => {
      state.personnelCostData = action.payload;
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
    let lastYearSalary = parseFloat(personnelInput.salaryPerMonth);
    // Determine the number of months based on the selected duration
    for (let month = 1; month <= numberOfMonths; month++) {
      if (
        month >= personnelInput.jobBeginMonth &&
        month <= personnelInput.jobEndMonth
      ) {
        const salaryPerMonth = lastYearSalary;
        const numberOfHires = parseInt(personnelInput.numberOfHires);
        const increasePercentage = parseFloat(personnelInput.increasePerYear);
        let newSalary = salaryPerMonth;
        if (
          (month - personnelInput.jobBeginMonth) % 12 === 0 &&
          month !== personnelInput.jobBeginMonth
        ) {
          newSalary *= 1 + increasePercentage / 100;
          lastYearSalary = newSalary; // Update last year's salary
        }
        const monthlyCost = newSalary * numberOfHires;
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

export const { setPersonnelInputs, setPersonnelCostData, setIsSaved } =
  personnelSlice.actions;

export default personnelSlice.reducer;
