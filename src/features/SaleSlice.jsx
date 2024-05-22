import { createSlice } from "@reduxjs/toolkit";
import { formatNumber, parseNumber } from "./CostSlice";

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
      daysGetPaid: 0,
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
      daysGetPaid: 0,
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
      daysGetPaid: 0,
    },
  ],
  channelNames: [],
  revenueData: [],
  revenueDeductionData: [],
  cogsData: [],
  netRevenueData: [],
  grossProfitData: [],
  yearlySales: [],
  revenueTableData: [],
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
    setRevenueTableData(state, action) {
      state.revenueTableData = action.payload;
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
  setRevenueTableData,
} = saleSlice.actions;

export const calculateChannelRevenue =
  (numberOfMonths, customerGrowthData, customerInputs, channelInputs) =>
  (dispatch, getState) => {
    let revenueByChannelAndProduct = {};
    let DeductionByChannelAndProduct = {};
    let cogsByChannelAndProduct = {};
    let netRevenueByChannelAndProduct = {};
    let grossProfitByChannelAndProduct = {};
    let cashInflowByChannelAndProduct = {};
    let receivablesByChannelAndProduct = {};

    channelInputs.forEach((channel) => {
      if (channel.selectedChannel && channel.productName) {
        const channelProductKey = `${channel.selectedChannel} - ${channel.productName}`;
        const revenueArray = Array(numberOfMonths).fill(0);
        const revenueDeductionArray = Array(numberOfMonths).fill(0);
        const cogsArray = Array(numberOfMonths).fill(0);
        const netRevenueArray = Array(numberOfMonths).fill(0);
        const grossProfitArray = Array(numberOfMonths).fill(0);
        const cashInflowArray = Array(numberOfMonths).fill(0);
        const receivablesArray = Array(numberOfMonths).fill(0);

        // Calculate revenue, revenueDeduction, and COGS
        customerGrowthData.forEach((growthData) => {
          growthData.forEach((data) => {
            if (data.channelName === channel.selectedChannel) {
              const customerInput = customerInputs.find(
                (input) => input.channelName === channel.selectedChannel
              );
              if (customerInput) {
                const begin = customerInput.beginMonth;
                const end = customerInput.endMonth;

                if (data.month >= begin && data.month <= end) {
                  let revenue =
                    data.customers *
                    parseFloat(channel.price) *
                    parseFloat(channel.multiples) *
                    parseFloat(channel.channelAllocation);
                  revenueArray[data.month - 1] = revenue;

                  revenueDeductionArray[data.month - 1] =
                    (revenue * parseFloat(channel.deductionPercentage)) / 100;
                  cogsArray[data.month - 1] =
                    (revenue * parseFloat(channel.cogsPercentage)) / 100;
                }
              }
            }
          });
        });

        // Calculate net revenue and gross profit
        revenueByChannelAndProduct[channelProductKey] = revenueArray;
        DeductionByChannelAndProduct[channelProductKey] = revenueDeductionArray;
        cogsByChannelAndProduct[channelProductKey] = cogsArray;

        netRevenueArray.forEach((_, i) => {
          netRevenueArray[i] = revenueArray[i] - revenueDeductionArray[i];
        });
        netRevenueByChannelAndProduct[channelProductKey] = netRevenueArray;

        grossProfitArray.forEach((_, i) => {
          grossProfitArray[i] =
            netRevenueByChannelAndProduct[channelProductKey][i] -
            cogsByChannelAndProduct[channelProductKey][i];
        });
        grossProfitByChannelAndProduct[channelProductKey] = grossProfitArray;

        // Calculate cash inflow and receivables based on daysGetPaid
        const paymentDelayInMonths = channel.daysGetPaid / 30;

        for (let i = 0; i < numberOfMonths; i++) {
          if (paymentDelayInMonths === 0) {
            cashInflowArray[i] = revenueArray[i];
            receivablesArray[i] = 0;
          } else if (paymentDelayInMonths === 0.5) {
            if (i === 0) {
              cashInflowArray[i] = 0.5 * revenueArray[i];
              receivablesArray[i] = 0.5 * revenueArray[i];
            } else {
              cashInflowArray[i] =
                0.5 * revenueArray[i] + receivablesArray[i - 1];
              receivablesArray[i] = 0.5 * revenueArray[i];
            }
          } else if (paymentDelayInMonths === 1) {
            if (i === 0) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i];
            } else {
              cashInflowArray[i] = receivablesArray[i - 1];
              receivablesArray[i] = revenueArray[i];
            }
          } else if (paymentDelayInMonths === 1.5) {
            if (i === 0) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i];
            } else if (i === 1) {
              cashInflowArray[i] = 0.5 * receivablesArray[i - 1];
              receivablesArray[i] =
                revenueArray[i] + 0.5 * receivablesArray[i - 1];
            } else {
              cashInflowArray[i] =
                0.5 * revenueArray[i - 2] + 0.5 * revenueArray[i - 1];
              receivablesArray[i] = revenueArray[i] + 0.5 * revenueArray[i - 1];
            }
          } else if (paymentDelayInMonths === 2) {
            if (i === 0) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i];
            } else if (i === 1) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i] + revenueArray[i - 1];
            } else {
              cashInflowArray[i] = revenueArray[i - 2];
              receivablesArray[i] = revenueArray[i] + revenueArray[i - 1];
            }
          } else if (paymentDelayInMonths === 3) {
            if (i === 0) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i];
            } else if (i === 1) {
              cashInflowArray[i] = 0;
              receivablesArray[i] = revenueArray[i] + revenueArray[i - 1];
            } else if (i === 2) {
              cashInflowArray[i] = 0;
              receivablesArray[i] =
                revenueArray[i] + revenueArray[i - 1] + revenueArray[i - 2];
            } else {
              cashInflowArray[i] = revenueArray[i - 3];
              receivablesArray[i] =
                revenueArray[i] + revenueArray[i - 1] + revenueArray[i - 2];
            }
          }
        }

        cashInflowByChannelAndProduct[channelProductKey] = cashInflowArray;
        receivablesByChannelAndProduct[channelProductKey] = receivablesArray;
      }
    });

    // Dispatch actions to update the state
    return {
      revenueByChannelAndProduct,
      DeductionByChannelAndProduct,
      cogsByChannelAndProduct,
      netRevenueByChannelAndProduct,
      grossProfitByChannelAndProduct,
      cashInflowByChannelAndProduct,
      receivablesByChannelAndProduct,
    };
  };

export const calculateYearlySales = (tempRevenueData) => {
  const yearlySales = [];

  // Check if tempRevenueData is not empty
  if (Object.keys(tempRevenueData).length === 0) {
    return yearlySales; // Return empty array if tempRevenueData is empty
  }

  // Iterate over the first entry in tempRevenueData to determine the length
  const firstEntry = tempRevenueData[Object.keys(tempRevenueData)[0]];
  const numMonths = firstEntry ? firstEntry.length : 0;

  for (let i = 0; i < numMonths; i += 12) {
    let sum = 0;
    Object.values(tempRevenueData).forEach((data) => {
      for (let j = i; j < i + 12 && j < data.length; j++) {
        sum += parseFloat(data[j]);
      }
    });
    yearlySales.push(sum.toFixed(2));
  }
  return yearlySales;
};

export const transformRevenueDataForTable = (
  calculatedChannelRevenue,
  tempChannelInputs,
  renderChannelForm
) => {
  const allTransformedData = [];
  const totalRow = { key: "Total", channelName: "Total" };
  const cashInflowRow = {
    key: "Total Cash Inflow",
    channelName: "Total Cash Inflow",
  };
  const receivablesRow = {
    key: "Total Receivables",
    channelName: "Total Receivables",
  };

  // Aggregate totals for all channels and products
  const aggregateTotals = () => {
    const aggregatedData = {
      revenue: {},
      deductions: {},
      cogs: {},
      netRevenue: {},
      grossProfit: {},
      cashInFlow: {},
      receivables: {},
    };

    Object.keys(calculatedChannelRevenue.revenueByChannelAndProduct).forEach(
      (channelProductKey) => {
        calculatedChannelRevenue.revenueByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          aggregatedData.revenue[`month${index + 1}`] =
            (aggregatedData.revenue[`month${index + 1}`] || 0) +
            parseNumber(value);
        });
      }
    );

    Object.keys(calculatedChannelRevenue.cashInflowByChannelAndProduct).forEach(
      (channelProductKey) => {
        calculatedChannelRevenue.cashInflowByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          aggregatedData.cashInFlow[`month${index + 1}`] =
            (aggregatedData.cashInFlow[`month${index + 1}`] || 0) +
            parseNumber(value);
        });
      }
    );

    Object.keys(
      calculatedChannelRevenue.receivablesByChannelAndProduct
    ).forEach((channelProductKey) => {
      calculatedChannelRevenue.receivablesByChannelAndProduct[
        channelProductKey
      ].forEach((value, index) => {
        aggregatedData.receivables[`month${index + 1}`] =
          (aggregatedData.receivables[`month${index + 1}`] || 0) +
          parseNumber(value);
      });
    });

    return aggregatedData;
  };

  const totalAggregatedData = aggregateTotals();

  Object.keys(calculatedChannelRevenue.revenueByChannelAndProduct).forEach(
    (channelProductKey) => {
      const [selectedChannel, selectedProduct] = channelProductKey.split(" - ");
      if (
        (selectedChannel ==
          tempChannelInputs.find((input) => input.id == renderChannelForm)
            ?.selectedChannel &&
          selectedProduct ==
            tempChannelInputs.find((input) => input.id == renderChannelForm)
              ?.productName) ||
        renderChannelForm == "all"
      ) {
        const transformedRevenueTableData = {};
        const revenueRowKey = `Revenue`;
        const revenueDeductionRowKey = `Deductions`;
        const cogsRowKey = `COGS`;
        const netRevenueRowKey = `Net Revenue`;
        const grossProfitRowKey = `Gross Profit`;
        const cashInflowRowKey = `Cash Inflow`;
        const receivablesRowKey = `Receivables`;
        const productName = `Product Name`;

        transformedRevenueTableData[productName] = {
          key: channelProductKey,
          channelName: channelProductKey,
        };
        transformedRevenueTableData[revenueRowKey] = {
          key: `${revenueRowKey} - ${selectedProduct}`,
          channelName: revenueRowKey,
        };
        transformedRevenueTableData[revenueDeductionRowKey] = {
          key: `${revenueDeductionRowKey} - ${selectedProduct}`,
          channelName: revenueDeductionRowKey,
        };
        transformedRevenueTableData[netRevenueRowKey] = {
          key: `${netRevenueRowKey} - ${selectedProduct}`,
          channelName: netRevenueRowKey,
        };
        transformedRevenueTableData[cogsRowKey] = {
          key: `${cogsRowKey} - ${selectedProduct}`,
          channelName: cogsRowKey,
        };
        transformedRevenueTableData[grossProfitRowKey] = {
          key: `${grossProfitRowKey} - ${selectedProduct}`,
          channelName: grossProfitRowKey,
        };
        transformedRevenueTableData[cashInflowRowKey] = {
          key: `${cashInflowRowKey} - ${selectedProduct}`,
          channelName: cashInflowRowKey,
        };
        transformedRevenueTableData[receivablesRowKey] = {
          key: `${receivablesRowKey} - ${selectedProduct}`,
          channelName: receivablesRowKey,
        };

        calculatedChannelRevenue.revenueByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          const formattedValue = formatNumber(parseFloat(value)?.toFixed(2));
          transformedRevenueTableData[revenueRowKey][`month${index + 1}`] =
            formattedValue;

          totalRow[`month${index + 1}`] = formatNumber(
            (
              parseNumber(totalRow[`month${index + 1}`] || 0) +
              parseNumber(formattedValue)
            ).toFixed(2)
          );
        });

        calculatedChannelRevenue.DeductionByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[revenueDeductionRowKey][
            `month${index + 1}`
          ] = formatNumber(parseFloat(value)?.toFixed(2));
        });
        calculatedChannelRevenue.cogsByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[cogsRowKey][`month${index + 1}`] =
            formatNumber(parseFloat(value)?.toFixed(2));
        });
        calculatedChannelRevenue.netRevenueByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[netRevenueRowKey][`month${index + 1}`] =
            formatNumber(parseFloat(value)?.toFixed(2));
        });
        calculatedChannelRevenue.grossProfitByChannelAndProduct[
          channelProductKey
        ].forEach((value, index) => {
          transformedRevenueTableData[grossProfitRowKey][`month${index + 1}`] =
            formatNumber(parseFloat(value)?.toFixed(2));
        });

        // Add cash inflow and receivables data
        calculatedChannelRevenue.cashInflowByChannelAndProduct[
          channelProductKey
        ]?.forEach((value, index) => {
          transformedRevenueTableData[cashInflowRowKey][`month${index + 1}`] =
            formatNumber(parseFloat(value)?.toFixed(2));

          cashInflowRow[`month${index + 1}`] = formatNumber(
            (
              parseNumber(cashInflowRow[`month${index + 1}`] || 0) +
              parseNumber(value)
            ).toFixed(2)
          );
        });

        calculatedChannelRevenue.receivablesByChannelAndProduct[
          channelProductKey
        ]?.forEach((value, index) => {
          transformedRevenueTableData[receivablesRowKey][`month${index + 1}`] =
            formatNumber(parseFloat(value)?.toFixed(2));
        });

        allTransformedData.push(Object.values(transformedRevenueTableData));
      }
    }
  );

  // Assign total aggregated data to totalRow
  Object.keys(totalAggregatedData.revenue).forEach((monthKey) => {
    totalRow[monthKey] = formatNumber(
      totalAggregatedData.revenue[monthKey].toFixed(2)
    );
  });

  Object.keys(totalAggregatedData.cashInFlow).forEach((monthKey) => {
    cashInflowRow[monthKey] = formatNumber(
      totalAggregatedData.cashInFlow[monthKey].toFixed(2)
    );
  });
  Object.keys(totalAggregatedData.receivables).forEach((monthKey) => {
    receivablesRow[monthKey] = formatNumber(
      totalAggregatedData.receivables[monthKey].toFixed(2)
    );
  });

  allTransformedData.push(totalRow, cashInflowRow, receivablesRow);

  return allTransformedData.flat();
};

export default saleSlice.reducer;
