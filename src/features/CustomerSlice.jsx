import { createSlice } from "@reduxjs/toolkit";
import { formatNumber, parseNumber } from "./CostSlice";

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
  customerTableData: [],
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
    setCustomerTableData(state, action) {
      state.customerTableData = action.payload;
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
        if (month === customerInput.beginMonth) {
          currentCustomers = initialCustomers;
        } else {
          if (customerInput.customerGrowthFrequency === "Monthly") {
            currentCustomers *=
              1 + parseFloat(customerInput.growthPerMonth) / 100;
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

            if ((month - customerInput.beginMonth) % frequency === 0) {
              currentCustomers *=
                1 + parseFloat(customerInput.growthPerMonth) / 100;
            }
          }
        }

        const churnValue = (
          beginValue *
          (customerInput.churnRate / 100)
        ).toFixed(0); // Calculate churn value

        beginValue += currentCustomers - parseFloat(churnValue); // Update beginValue for the calculation of the next month

        monthlyCustomers.push({
          month: month,
          customers: beginValue.toFixed(0) > 0 ? beginValue.toFixed(0) : 0,
          begin:
            month === customerInput.beginMonth
              ? parseFloat(customerInput.beginCustomer).toFixed(0)
              : parseFloat(
                  monthlyCustomers[monthlyCustomers.length - 1]?.end
                ).toFixed(0),

          add: currentCustomers.toFixed(0),
          churn: churnValue,
          end: beginValue.toFixed(0) > 0 ? beginValue.toFixed(0) : 0,
          channelName: customerInput.channelName,
        });
      } else {
        monthlyCustomers.push({
          month: month,
          customers: "0",
          begin: "0",
          add: "0",
          churn: "0",
          end: "0",
          channelName: customerInput.channelName,
        });
      }
    }
    return monthlyCustomers;
  });
};

export function transformCustomerData(
  tempCustomerGrowthData,
  tempCustomerInputs
) {
  const transformedCustomerTableData = {};

  tempCustomerGrowthData.forEach((channelData) => {
    channelData.forEach((data) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === data.channelName
      );
      if (customerInput) {
        if (!transformedCustomerTableData[data.channelName]) {
          transformedCustomerTableData[data.channelName] = {
            key: data.channelName,
            channelName: data.channelName,
          };
        }
        if (
          data.month >= customerInput.beginMonth &&
          data.month <= customerInput.endMonth
        ) {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            parseFloat(data.customers)?.toFixed(0);
        } else {
          transformedCustomerTableData[data.channelName][`month${data.month}`] =
            "0";
        }
      }
    });
  });

  return transformedCustomerTableData;
}

export function generateCustomerTableData(
  transformedCustomerTableData,
  tempCustomerInputs,
  numberOfMonths,
  renderCustomerForm
) {
  const allRows = Object.values(transformedCustomerTableData).flatMap(
    (curr) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === curr.channelName
      );

      const channelRow = {
        key: curr.channelName,
        channelName: curr.channelName,
      };

      const startRow = {
        key: `${curr.channelName}-start`,
        channelName: `${curr.channelName} (Existing)`,
      };
      const beginRow = {
        key: `${curr.channelName}-begin`,
        channelName: `${curr.channelName} (Begin)`,
      };
      const churnRow = {
        key: `${curr.channelName}-churn`,
        channelName: `${curr.channelName} (Churn)`,
      };
      const endRow = {
        ...curr,
        key: `${curr.channelName}-end`,
        channelName: `${curr.channelName} (End)`,
      };
      const channelAddRow = {
        key: `${curr.channelName}-add`,
        channelName: `${curr.channelName} (Add)`,
      };

      let currentCustomers = parseFloat(customerInput.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= customerInput.beginMonth && i <= customerInput.endMonth) {
          if (i === customerInput.beginMonth) {
            currentCustomers = customerInput.customersPerMonth;
          } else {
            if (customerInput.customerGrowthFrequency === "Monthly") {
              currentCustomers *=
                1 + parseFloat(customerInput.growthPerMonth) / 100;
            } else {
              let frequency = 12; // Default to Annually
              if (customerInput.customerGrowthFrequency === "Quarterly")
                frequency = 3;
              else if (
                customerInput.customerGrowthFrequency === "Semi-Annually"
              )
                frequency = 6;

              if ((i - customerInput.beginMonth) % frequency === 0) {
                currentCustomers *=
                  1 + parseFloat(customerInput.growthPerMonth) / 100;
              }
            }
          }
          channelAddRow[`month${i}`] = formatNumber(
            currentCustomers.toFixed(0)
          );
        } else {
          channelAddRow[`month${i}`] = "0";
        }
        startRow[`month${i}`] = "0";
        beginRow[`month${i}`] = "0";
        churnRow[`month${i}`] = "0";
      }

      if (customerInput) {
        startRow[`month${customerInput.beginMonth}`] = formatNumber(
          parseFloat(customerInput.beginCustomer).toFixed(0)
        );
        beginRow[`month${customerInput.beginMonth}`] =
          startRow[`month${customerInput.beginMonth}`];

        for (let i = customerInput.beginMonth; i <= numberOfMonths; i++) {
          if (i > customerInput.beginMonth) {
            beginRow[`month${i}`] = formatNumber(endRow[`month${i - 1}`]); // Set Begin row of month i to End row of month i-1
          }
          endRow[`month${i}`] = formatNumber(endRow[`month${i}`]);
          const beginValue = beginRow[`month${i}`] || 0; // Begin value for the current month
          const addValue = parseNumber(channelAddRow[`month${i}`]) || 0; // Add value for the current month
          const churnValue = (
            parseNumber(beginValue) *
            (customerInput.churnRate / 100)
          ).toFixed(0); // Calculate churn value
          churnRow[`month${i}`] = churnValue; // Assign churn value to Churn row of the current month
          endRow[`month${i}`] = formatNumber(
            parseNumber(beginValue) +
              parseNumber(addValue) -
              parseNumber(churnValue)
          ); // Update End row to Begin + Add - Churn
        }
      }

      return [channelRow, startRow, beginRow, channelAddRow, churnRow, endRow];
    }
  );

  // Calculate the totals
  const totalRow = {
    key: "Total",
    channelName: "Total",
  };

  for (let i = 1; i <= numberOfMonths; i++) {
    totalRow[`month${i}`] = allRows
      .filter((row) => row.key.includes("-end"))
      .reduce((sum, row) => sum + parseNumber(row[`month${i}`]), 0)
      .toFixed(0);
  }

  allRows.push(totalRow);

  const filteredRows = Object.values(transformedCustomerTableData)
    .filter((data) =>
      renderCustomerForm === "all"
        ? true
        : tempCustomerInputs.find(
            (input) =>
              input.id == renderCustomerForm &&
              input.channelName === data.channelName
          )
    )
    .flatMap((curr) => {
      const customerInput = tempCustomerInputs.find(
        (input) => input.channelName === curr.channelName
      );

      const channelRow = {
        key: curr.channelName,
        channelName: curr.channelName,
      };

      const startRow = {
        key: `${curr.channelName}-start`,
        channelName: `${curr.channelName} (Existing)`,
      };
      const beginRow = {
        key: `${curr.channelName}-begin`,
        channelName: `${curr.channelName} (Begin)`,
      };
      const churnRow = {
        key: `${curr.channelName}-churn`,
        channelName: `${curr.channelName} (Churn)`,
      };
      const endRow = {
        ...curr,
        key: `${curr.channelName}-end`,
        channelName: `${curr.channelName} (End)`,
      };
      const channelAddRow = {
        key: `${curr.channelName}-add`,
        channelName: `${curr.channelName} (Add)`,
      };

      let currentCustomers = parseFloat(customerInput.customersPerMonth);
      for (let i = 1; i <= numberOfMonths; i++) {
        if (i >= customerInput.beginMonth && i <= customerInput.endMonth) {
          if (i === customerInput.beginMonth) {
            currentCustomers = customerInput.customersPerMonth;
          } else {
            if (customerInput.customerGrowthFrequency === "Monthly") {
              currentCustomers *=
                1 + parseFloat(customerInput.growthPerMonth) / 100;
            } else {
              let frequency = 12; // Default to Annually
              if (customerInput.customerGrowthFrequency === "Quarterly")
                frequency = 3;
              else if (
                customerInput.customerGrowthFrequency === "Semi-Annually"
              )
                frequency = 6;

              if ((i - customerInput.beginMonth) % frequency === 0) {
                currentCustomers *=
                  1 + parseFloat(customerInput.growthPerMonth) / 100;
              }
            }
          }
          channelAddRow[`month${i}`] = formatNumber(
            currentCustomers.toFixed(0)
          );
        } else {
          channelAddRow[`month${i}`] = "0";
        }
        startRow[`month${i}`] = "0";
        beginRow[`month${i}`] = "0";
        churnRow[`month${i}`] = "0";
      }

      if (customerInput) {
        startRow[`month${customerInput.beginMonth}`] = formatNumber(
          parseFloat(customerInput.beginCustomer).toFixed(0)
        );
        beginRow[`month${customerInput.beginMonth}`] =
          startRow[`month${customerInput.beginMonth}`];

        for (let i = customerInput.beginMonth; i <= numberOfMonths; i++) {
          if (i > customerInput.beginMonth) {
            beginRow[`month${i}`] = formatNumber(endRow[`month${i - 1}`]); // Set Begin row of month i to End row of month i-1
          }
          endRow[`month${i}`] = formatNumber(endRow[`month${i}`]);
          const beginValue = beginRow[`month${i}`] || 0; // Begin value for the current month
          const addValue = parseNumber(channelAddRow[`month${i}`]) || 0; // Add value for the current month
          const churnValue = (
            parseNumber(beginValue) *
            (customerInput.churnRate / 100)
          ).toFixed(0); // Calculate churn value
          churnRow[`month${i}`] = churnValue; // Assign churn value to Churn row of the current month
          endRow[`month${i}`] = formatNumber(
            parseNumber(beginValue) +
              parseNumber(addValue) -
              parseNumber(churnValue)
          ); // Update End row to Begin + Add - Churn
        }
      }

      return [channelRow, startRow, beginRow, channelAddRow, churnRow, endRow];
    });

  filteredRows.push(totalRow);

  return filteredRows;
}

export const {
  setCustomerInputs,
  setCustomerGrowthData,
  setYearlyAverageCustomers,
  setCustomerTableData,
} = customerSlice.actions;

export default customerSlice.reducer;
