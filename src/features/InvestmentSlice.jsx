import { createSlice } from "@reduxjs/toolkit";
import { formatNumber } from "./CostSlice";

const initialState = {
  investmentInputs: [
    {
      id: 1,
      purchaseName: "Coffee machine",
      assetCost: 8000,
      quantity: 1,
      purchaseMonth: 2,
      residualValue: 0,
      usefulLifetime: 36,
    },

    {
      id: 2,
      purchaseName: "Table",
      assetCost: 200,
      quantity: 10,
      purchaseMonth: 1,
      residualValue: 0,
      usefulLifetime: 36,
    },
  ],
  investmentData: [],
  investmentTableData: [],
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    setInvestmentInputs(state, action) {
      state.investmentInputs = action.payload;
    },
    setInvestmentData(state, action) {
      state.investmentData = action.payload;
    },
    setInvestmentTableData(state, action) {
      state.investmentTableData = action.payload;
    },
  },
});

export const calculateInvestmentData = (
  tempInvestmentInputs,
  numberOfMonths
) => {
  return tempInvestmentInputs.map((investment) => {
    const quantity = parseInt(investment.quantity, 10) || 1;
    const assetCost = parseFloat(investment.assetCost) * quantity;
    const residualValue = parseFloat(investment.residualValue) * quantity;
    const usefulLifetime = parseFloat(investment.usefulLifetime);
    const purchaseMonth = parseInt(investment.purchaseMonth, 10);

    const depreciationPerMonth = (assetCost - residualValue) / usefulLifetime;
    const depreciationArray = new Array(numberOfMonths).fill(0);

    for (let i = 0; i < numberOfMonths; i++) {
      if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
        depreciationArray[i] = depreciationPerMonth;
      }
    }

    const accumulatedDepreciation = depreciationArray.reduce(
      (acc, val, index) => {
        acc[index] = (acc[index - 1] || 0) + val;
        return acc;
      },
      []
    );

    const assetValue = new Array(numberOfMonths).fill(0);
    const bookValue = new Array(numberOfMonths).fill(0);
    for (let i = 0; i < numberOfMonths; i++) {
      if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
        assetValue[i] = assetCost;
        bookValue[i] = Math.abs(assetValue[i] - accumulatedDepreciation[i]); // Kẹp giá trị tuyệt đối cho bookValue
      }
    }

    return {
      purchaseName: investment.purchaseName,
      assetValue,
      depreciationArray,
      accumulatedDepreciation,
      bookValue,
    };
  });
};

export const transformInvestmentDataForTable = (
  tempInvestmentInputs,
  renderInvestmentForm,
  tempInvestmentData,
  numberOfMonths
) => {
  const investmentTableData = [];
  let filteredInputs = [];
  let filteredData = [];

  if (renderInvestmentForm === "all") {
    filteredInputs = tempInvestmentInputs;
    filteredData = tempInvestmentData;
  } else {
    const selectedInput = tempInvestmentInputs.find(
      (input) => input.id == renderInvestmentForm
    );
    if (!selectedInput || tempInvestmentData.length === 0) return [];

    const selectedInvestmentData = tempInvestmentData.find(
      (_, index) => tempInvestmentInputs[index].id == renderInvestmentForm
    );

    if (!selectedInvestmentData) return [];

    filteredInputs.push(selectedInput);
    filteredData.push(selectedInvestmentData);
  }

  filteredInputs.forEach((input, inputIndex) => {
    const investmentData = filteredData[inputIndex];
    const purchaseName = input.purchaseName || `Investment ${input.id}`;
    const purchaseNameRow = {
      key: purchaseName,
      type: purchaseName,
    };
    const assetCostRow = {
      key: `Asset Cost - ${purchaseName}`,
      type: `Asset Cost`,
    };
    const depreciationRow = {
      key: `Depreciation - ${purchaseName}`,
      type: "Depreciation",
    };
    const accumulatedDepreciationRow = {
      key: `Accumulated Depre. - ${purchaseName}`,
      type: "Accumulated Depre.",
    };
    const bookValueRow = {
      key: `Book Value - ${purchaseName}`,
      type: "Book Value",
    };

    const purchaseMonth = parseInt(input.purchaseMonth, 10);
    const usefulLife = parseInt(input.usefulLifetime, 10);
    const endMonth = purchaseMonth + usefulLife - 1;
    const assetCost =
      parseFloat(input.assetCost) * parseInt(input.quantity, 10);

    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      if (monthIndex >= purchaseMonth - 1 && monthIndex < endMonth) {
        assetCostRow[`month${monthIndex + 1}`] = formatNumber(
          assetCost?.toFixed(2)
        );

        depreciationRow[`month${monthIndex + 1}`] = formatNumber(
          investmentData.depreciationArray[monthIndex]?.toFixed(2)
        );
        accumulatedDepreciationRow[`month${monthIndex + 1}`] = formatNumber(
          investmentData.accumulatedDepreciation[monthIndex]?.toFixed(2)
        );
        if (
          assetCost - investmentData.accumulatedDepreciation[monthIndex] <
          0
        ) {
          bookValueRow[`month${monthIndex + 1}`] = "0.00";
        } else {
          bookValueRow[`month${monthIndex + 1}`] = formatNumber(
            (
              assetCost - investmentData.accumulatedDepreciation[monthIndex]
            )?.toFixed(2)
          );
        }
      } else {
        assetCostRow[`month${monthIndex + 1}`] = "0.00";
        depreciationRow[`month${monthIndex + 1}`] = "0.00";
        accumulatedDepreciationRow[`month${monthIndex + 1}`] = "0.00";
        bookValueRow[`month${monthIndex + 1}`] = "0.00";
      }
    }

    investmentTableData.push(
      purchaseNameRow,
      assetCostRow,
      depreciationRow,
      accumulatedDepreciationRow,
      bookValueRow
    );
  });
  // Calculate totals for CF Investments, Total Depreciation, and BS totals
  const depreciationSum = Array(numberOfMonths).fill(0);
  const cfInvestmentsSum = Array(numberOfMonths).fill(0);

  tempInvestmentData.forEach((data, index) => {
    data.depreciationArray.forEach((value, month) => {
      depreciationSum[month] += value;
    });
    const purchaseMonth =
      parseInt(tempInvestmentInputs[index]?.purchaseMonth, 10) - 1;

    if (purchaseMonth >= 0 && purchaseMonth < numberOfMonths) {
      const assetCost =
        parseFloat(tempInvestmentInputs[index]?.assetCost) *
        parseInt(tempInvestmentInputs[index]?.quantity, 10);
      cfInvestmentsSum[purchaseMonth] += assetCost;
    }
  });

  const cfInvestmentsRow = {
    key: `CF Investments`,
    type: "CF Investments",
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    cfInvestmentsRow[`month${monthIndex + 1}`] = formatNumber(
      cfInvestmentsSum[monthIndex]?.toFixed(2)
    );
  }
  investmentTableData.push(cfInvestmentsRow);

  // Add row for Total Depreciation
  const totalDepreciationRow = {
    key: `Total Depreciation`,
    type: "Total Depreciation",
  };
  depreciationSum.forEach((depreciation, index) => {
    totalDepreciationRow[`month${index + 1}`] = formatNumber(
      depreciation.toFixed(2)
    );
  });
  investmentTableData.push(totalDepreciationRow);

  // Add row for BS Total investment
  const bsTotalInvestmentRow = {
    key: `BS Total investment`,
    type: "BS Total investment",
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    bsTotalInvestmentRow[`month${monthIndex + 1}`] = formatNumber(
      cfInvestmentsSum
        .slice(0, monthIndex + 1)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2)
    );
  }
  investmentTableData.push(bsTotalInvestmentRow);

  //Add row for BS Total Accumulated Depreciation
  const bsTotalAccumulatedDepreciationRow = {
    key: `BS Total Accumulated Depreciation`,
    type: "BS Total Accumulated Depreciation",
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    bsTotalAccumulatedDepreciationRow[`month${monthIndex + 1}`] = formatNumber(
      depreciationSum
        .slice(0, monthIndex + 1)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2)
    );
  }
  investmentTableData.push(bsTotalAccumulatedDepreciationRow);

  // add new row call Total BS Net Fixed Assets equal to BS Total investment - BS Total Accumulated Depreciation
  const bsTotalNetFixedAssetsRow = {
    key: `BS Total Net Fixed Assets`,
    type: "BS Total Net Fixed Assets",
  };
  for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
    bsTotalNetFixedAssetsRow[`month${monthIndex + 1}`] = formatNumber(
      (
        cfInvestmentsSum
          .slice(0, monthIndex + 1)
          .reduce((acc, curr) => acc + curr, 0) -
        depreciationSum
          .slice(0, monthIndex + 1)
          .reduce((acc, curr) => acc + curr, 0)
      ).toFixed(2)
    );
  }
  investmentTableData.push(bsTotalNetFixedAssetsRow);

  return investmentTableData;
};

export const {
  setInvestmentInputs,
  setInvestmentData,
  setInvestmentTableData,
} = investmentSlice.actions;

export default investmentSlice.reducer;
