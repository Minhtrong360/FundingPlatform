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

export const calculateCustomerGrowth = (tempCustomerInputs, numberOfMonths) => {
  return tempCustomerInputs.map((channel) => {
    let customers = [];
    let currentCustomers = parseFloat(channel.customersPerMonth);
    let beginValue = parseFloat(channel.beginCustomer); // Begin value for the current month

    for (let i = 1; i <= numberOfMonths; i++) {
      if (i >= channel.beginMonth && i <= channel.endMonth) {
        const churnValue = (beginValue * (channel.churnRate / 100)).toFixed(0); // Calculate churn value

        const endValue = (
          beginValue +
          currentCustomers -
          parseFloat(churnValue)
        ).toFixed(0); // Calculate and assign value to End row

        customers.push({
          month: i,
          customers: endValue,
          channelName: channel.channelName,
        });
        currentCustomers *= 1 + parseFloat(channel.growthPerMonth) / 100;
        beginValue = parseFloat(endValue);
      } else {
        customers.push({
          month: i,
          customers: 0,
          channelName: channel.channelName,
        });
      }
    }
    return customers;
  });
};

export const {
  setCustomerInputs,
  setCustomerGrowthData,
  setYearlyAverageCustomers,
} = customerSlice.actions;

export default customerSlice.reducer;
