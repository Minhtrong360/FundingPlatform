import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerInputs: [
    {
      id: 1,
      customersPerMonth: 300,
      growthPerMonth: 1,
      customerGrowthFrequency: "Monthly",
      channelName: "Online",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
      acquisitionCost: 0, // Default value for acquisition cost
    },
    {
      id: 2,
      customersPerMonth: 400,
      growthPerMonth: 2,
      customerGrowthFrequency: "Monthly",
      channelName: "Offline",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
      acquisitionCost: 0, // Default value for acquisition cost
    },
  ],
  customerGrowthData: [],
  yearlyAverageCustomers: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomerInputs(state, action) {
      state.customerInputs = action.payload;
    },
    setCustomerGrowthData(state, action) {
      state.customerGrowthData = action.payload;
    },
    setYearlyAverageCustomers(state, action) {
      state.yearlyAverageCustomers = action.payload;
    },
  },
});

export const calculateYearlyAverage = (
  tempCustomerGrowthData,
  numberOfMonths
) => {
  const yearlyAverages = [];
  for (let i = 0; i < numberOfMonths; i += 12) {
    let totalCustomers = 0;
    for (let j = i; j < i + 12 && j < numberOfMonths; j++) {
      tempCustomerGrowthData.forEach((channelData) => {
        totalCustomers += parseFloat(channelData[j]?.customers) || 0;
      });
    }
    const averageCustomers = totalCustomers / 12;
    yearlyAverages.push(averageCustomers.toFixed(0));
  }
  return yearlyAverages;
};

export const calculateCustomerGrowth = (customerInputs, numberOfMonths) => {
  return customerInputs.map((customerInput) => {
    let monthlyCustomers = [];
    let initialCustomers = parseFloat(customerInput.customersPerMonth); // Initial customers per month, remains unchanged
    let currentCustomers = initialCustomers; // Current customers, will be updated based on growth
    let beginValue = parseFloat(customerInput.beginCustomer); // Begin value for the current month

    for (let month = 1; month <= numberOfMonths; month++) {
      if (
        month >= customerInput.beginMonth &&
        month <= customerInput.endMonth
      ) {
        if (customerInput.customerGrowthFrequency === "Monthly") {
          currentCustomers =
            initialCustomers *
            (1 + parseFloat(customerInput.growthPerMonth) / 100);
        } else if (
          ["Annually", "Quarterly", "Semi-Annually"].includes(
            customerInput.customerGrowthFrequency
          )
        ) {
          let frequency = 12;
          if (customerInput.customerGrowthFrequency === "Quarterly")
            frequency = 3;
          else if (customerInput.customerGrowthFrequency === "Semi-Annually")
            frequency = 6;

          if (
            month === customerInput.beginMonth ||
            ((month - customerInput.beginMonth) % frequency === 0 &&
              month !== customerInput.beginMonth)
          ) {
            currentCustomers =
              initialCustomers *
              (1 + parseFloat(customerInput.growthPerMonth) / 100);
          }
        }

        const churnValue = (
          beginValue *
          (customerInput.churnRate / 100)
        ).toFixed(0); // Calculate churn value
        beginValue += currentCustomers - parseFloat(churnValue); // Update beginValue for the calculation of the next month

        monthlyCustomers.push({
          month: month,
          customers: beginValue.toFixed(0),
          channelName: customerInput.channelName,
        });
      } else {
        monthlyCustomers.push({
          month: month,
          customers: "0",
          channelName: customerInput.channelName,
        });
      }
    }
    return monthlyCustomers;
  });
};

export const {
  setCustomerInputs,
  setCustomerGrowthData,
  setYearlyAverageCustomers,
} = customerSlice.actions;

export default customerSlice.reducer;
