import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customerInputs: [
    {
      id: 1,
      customersPerMonth: 300,
      growthPerMonth: 1,
      channelName: "Online",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
    },
    {
      id: 2,
      customersPerMonth: 400,
      growthPerMonth: 2,
      channelName: "Offline",
      beginMonth: 1,
      endMonth: 36,
      beginCustomer: 0,
      churnRate: 0,
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

export const {
  setCustomerInputs,
  setCustomerGrowthData,
  setYearlyAverageCustomers,
} = customerSlice.actions;

export default customerSlice.reducer;
