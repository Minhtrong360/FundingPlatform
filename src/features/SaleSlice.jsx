import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelInputs: [
    {
      id: 1,
      productName: "Coffee",
      price: 4,
      multiples: 1,
      deductionPercentage: 5,
      cogsPercentage: 30,
      selectedChannel: "Offline",
      channelAllocation: 0.4,
    },
    {
      id: 2,
      productName: "Cake",
      price: 8,
      multiples: 1,
      deductionPercentage: 4,
      cogsPercentage: 35,
      selectedChannel: "Offline",
      channelAllocation: 0.3,
    },
    {
      id: 3,
      productName: "Coffee Bag",
      price: 6,
      multiples: 1,
      deductionPercentage: 6,
      cogsPercentage: 25,
      selectedChannel: "Online",
      channelAllocation: 0.6,
    },
  ],
  channelNames: [],
  revenueData: [],
  revenueDeductionData: [],
  cogsData: [],
  netRevenueData: [],
  grossProfitData: [],
  yearlySales: [],
};

const saleSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setChannelInputs(state, action) {
      state.channelInputs = action.payload;
    },
    setChannelNames(state, action) {
      state.channelNames = action.payload;
    },
    setRevenueData(state, action) {
      state.revenueData = action.payload;
    },
    setRevenueDeductionData(state, action) {
      state.revenueDeductionData = action.payload;
    },
    setCogsData(state, action) {
      state.cogsData = action.payload;
    },
    setNetRevenueData(state, action) {
      state.netRevenueData = action.payload;
    },
    setGrossProfitData(state, action) {
      state.grossProfitData = action.payload;
    },

    setYearlySales(state, action) {
      state.yearlySales = action.payload;
    },
  },
});

export const {
  setChannelInputs,
  setChannelNames,
  setRevenueData,
  setRevenueDeductionData,
  setCogsData,
  setNetRevenueData,
  setGrossProfitData,
  setIsSaved,
  setYearlySales,
} = saleSlice.actions;

export default saleSlice.reducer;
