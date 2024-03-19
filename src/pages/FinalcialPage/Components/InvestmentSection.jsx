import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";

const InvestmentSection = ({
  investmentInputs,
  setInvestmentInputs,
  numberOfMonths,
  investmentData,
  setInvestmentData,
  isSaved,
  setIsSaved,
  setInvestmentTableData,
  handleSubmit,
}) => {
  const [tempInvestmentInputs, setTempInvestmentInputs] =
    useState(investmentInputs);

  const [tempInvestmentData, setTempInvestmentData] = useState(investmentData);

  const [renderInvestmentForm, setRenderInvestmentForm] = useState(
    investmentInputs[0]?.id
  );

  useEffect(() => {
    setTempInvestmentInputs(investmentInputs);
    setRenderInvestmentForm(investmentInputs[0]?.id);
  }, [investmentInputs]);

  const addNewInvestmentInput = () => {
    const maxId = Math.max(...tempInvestmentInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newCustomer = {
      id: newId,
      purchaseName: "New investment",
      assetCost: 0,
      quantity: 0,
      purchaseMonth: 0,
      residualValue: 0,
      usefulLifetime: 0,
    };
    setTempInvestmentInputs([...tempInvestmentInputs, newCustomer]);
    setRenderInvestmentForm(newId.toString());
  };

  const removeInvestmentInput = (id) => {
    const newInputs = tempInvestmentInputs.filter((input) => input?.id != id);

    setTempInvestmentInputs(newInputs);
    setRenderInvestmentForm(newInputs[0]?.id);
  };

  const handleInvestmentInputChange = (id, field, value) => {
    const newInputs = tempInvestmentInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempInvestmentInputs(newInputs);
  };

  const calculateInvestmentData = () => {
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
          bookValue[i] = assetValue[i] - accumulatedDepreciation[i];
        }
      }

      return {
        assetValue,
        depreciationArray,
        accumulatedDepreciation,
        bookValue,
      };
    });
  };

  const transformInvestmentDataForTable = () => {
    const investmentTableData = [];

    const selectedInput = tempInvestmentInputs.find(
      (input) => input.id == renderInvestmentForm
    );
    if (!selectedInput || tempInvestmentData.length === 0) return [];

    const selectedInvestmentData = tempInvestmentData.find(
      (_, index) => tempInvestmentInputs[index].id == renderInvestmentForm
    );

    if (!selectedInvestmentData) return [];

    const purchaseName =
      selectedInput.purchaseName || `Investment ${renderInvestmentForm}`;
    const assetCostRow = {
      key: `Asset Cost`,
      type: `${purchaseName}`,
    };
    const depreciationRow = {
      key: `Depreciation`,
      type: "Depreciation",
    };
    const accumulatedDepreciationRow = {
      key: `Accumulated Depre.`,
      type: "Accumulated Depre.",
    };
    const bookValueRow = {
      key: `Book Value`,
      type: "Book Value",
    };

    const purchaseMonth = parseInt(selectedInput.purchaseMonth, 10);
    const usefulLife = parseInt(selectedInput.usefulLifetime, 10);
    const endMonth = purchaseMonth + usefulLife - 1;
    const assetCost =
      parseFloat(selectedInput.assetCost) *
      parseInt(selectedInput.quantity, 10);

    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      if (monthIndex >= purchaseMonth - 1 && monthIndex < endMonth) {
        assetCostRow[`month${monthIndex + 1}`] = assetCost?.toFixed(2);
        depreciationRow[`month${monthIndex + 1}`] =
          selectedInvestmentData.depreciationArray[monthIndex]?.toFixed(2);
        accumulatedDepreciationRow[`month${monthIndex + 1}`] =
          selectedInvestmentData.accumulatedDepreciation[monthIndex]?.toFixed(
            2
          );
        bookValueRow[`month${monthIndex + 1}`] = (
          assetCost - selectedInvestmentData.accumulatedDepreciation[monthIndex]
        )?.toFixed(2);
      } else {
        assetCostRow[`month${monthIndex + 1}`] = "0.00";
        depreciationRow[`month${monthIndex + 1}`] = "0.00";
        accumulatedDepreciationRow[`month${monthIndex + 1}`] = "0.00";
        bookValueRow[`month${monthIndex + 1}`] = "0.00";
      }
    }

    investmentTableData.push(
      assetCostRow,
      depreciationRow,
      accumulatedDepreciationRow,
      bookValueRow
    );

    const depreciationSum = Array(numberOfMonths).fill(0);
    const cfInvestmentsSum = Array(numberOfMonths).fill(0);

    tempInvestmentData.forEach((data, index) => {
      data.depreciationArray.forEach((value, month) => {
        depreciationSum[month] += value;
      });
      const purchaseMonth = parseInt(tempInvestmentInputs[index].purchaseMonth, 10) - 1;
      if (purchaseMonth >= 0 && purchaseMonth < numberOfMonths) {
        const assetCost = parseFloat(tempInvestmentInputs[index].assetCost) * parseInt(tempInvestmentInputs[index].quantity, 10);
        cfInvestmentsSum[purchaseMonth] += assetCost;
      }
    });

    const cfInvestmentsRow = {
      key: `CF Investments`,
      type: "CF Investments",
    };
    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      cfInvestmentsRow[`month${monthIndex + 1}`] =
        cfInvestmentsSum[monthIndex]?.toFixed(2);
    }
    investmentTableData.push(cfInvestmentsRow);

    // Add row for Total Depreciation
    const totalDepreciationRow = {
      key: `Total Depreciation`,
      type: "Total Depreciation",
    };
    depreciationSum.forEach((depreciation, index) => {
      totalDepreciationRow[`month${index + 1}`] = depreciation.toFixed(2);
    });
    investmentTableData.push(totalDepreciationRow);

    // Add row for BS Total investment
    const bsTotalInvestmentRow = {
      key: `BS Total investment`,
      type: "BS Total investment",
    };
    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      bsTotalInvestmentRow[`month${monthIndex + 1}`] = cfInvestmentsSum
        .slice(0, monthIndex + 1)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2);
    }
    investmentTableData.push(bsTotalInvestmentRow);

    //Add row for BS Total Accumulated Depreciation
    const bsTotalAccumulatedDepreciationRow = {
      key: `BS Total Accumulated Depreciation`,
      type: "BS Total Accumulated Depreciation",
    };
    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      bsTotalAccumulatedDepreciationRow[`month${monthIndex + 1}`] =
        depreciationSum
          .slice(0, monthIndex + 1)
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed(2);
    }
    investmentTableData.push(bsTotalAccumulatedDepreciationRow);

    // add new row call Total BS Net Fixed Assets equal to BS Total investment - BS Total Accumulated Depreciation
    const bsTotalNetFixedAssetsRow = {
      key: `BS Total Net Fixed Assets`,
      type: "BS Total Net Fixed Assets",
    };
    for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
      bsTotalNetFixedAssetsRow[`month${monthIndex + 1}`] = (
        cfInvestmentsSum
          .slice(0, monthIndex + 1)
          .reduce((acc, curr) => acc + curr, 0) -
        depreciationSum
          .slice(0, monthIndex + 1)
          .reduce((acc, curr) => acc + curr, 0)
      ).toFixed(2);
    }
    investmentTableData.push(bsTotalNetFixedAssetsRow);

    return investmentTableData;
  };

  const calculateDepreciationArray = (
    assetCost,
    residualValue,
    usefulLifetime,
    purchaseMonth,
    numberOfMonths
  ) => {
    const depreciationArray = new Array(numberOfMonths).fill(0);
    const depreciationPerMonth = (assetCost - residualValue) / usefulLifetime;

    for (let i = 0; i < numberOfMonths; i++) {
      if (i >= purchaseMonth - 1 && i < purchaseMonth - 1 + usefulLifetime) {
        depreciationArray[i] = depreciationPerMonth;
      }
    }
    return depreciationArray;
  };

  useEffect(() => {
    const calculatedData = calculateInvestmentData();
    setInvestmentData(calculatedData);
    const tableData = transformInvestmentDataForTable();
    setInvestmentTableData(tableData);
  }, [investmentInputs, numberOfMonths, renderInvestmentForm]);

  useEffect(() => {
    const calculatedData = calculateInvestmentData();
    setTempInvestmentData(calculatedData);
    const tableData = transformInvestmentDataForTable();
    setInvestmentTableData(tableData);
  }, [tempInvestmentInputs, numberOfMonths, renderInvestmentForm]);

  const investmentColumns = [
    { fixed: "left", title: "Type", dataIndex: "type", key: "type" },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const [investmentChart, setInvestmentChart] = useState({
    options: {
      chart: { id: "investment-chart", type: "area", height: 350 },
      xaxis: {
        categories: Array.from(
          { length: numberOfMonths },
          (_, i) => `${i + 1}`
        ),
        title: {
          text: "Month",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.floor(val);
          },
        },
        title: {
          text: "Investment ($)",
          style: {
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
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
    const seriesData = tempInvestmentData.map((investment) => {
      return { name: investment.purchaseName, data: investment.bookValue };
    });

    setInvestmentChart((prevState) => ({ ...prevState, series: seriesData }));
  }, [tempInvestmentData, numberOfMonths]);

  const handleSelectChange = (event) => {
    setRenderInvestmentForm(event.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  useEffect(() => {
    if (isSaved) {
      setInvestmentInputs(tempInvestmentInputs);
      const tableData = transformInvestmentDataForTable();
      setInvestmentTableData(tableData);
      setIsSaved(false);
    }
  }, [isSaved]);

  useEffect(() => {
    const tableData = transformInvestmentDataForTable();
    setInvestmentTableData(tableData);
  }, []);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 p-4 sm:border-r-2 border-r-0">
        <section aria-labelledby="investment-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center"
            id="investment-heading"
          >
            Investment
          </h2>

          <div>
            <label
              htmlFor="selectedChannel"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedChannel"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={renderInvestmentForm}
              onChange={handleSelectChange}
            >
              {tempInvestmentInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.purchaseName}
                </option>
              ))}
            </select>
          </div>

          {tempInvestmentInputs
            .filter((input) => input?.id == renderInvestmentForm)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4"
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Name of Purchase
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.purchaseName}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "purchaseName",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Asset Cost</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.assetCost}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "assetCost",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Quantity:</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="1"
                    value={input.quantity}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "quantity",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Purchase Month
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.purchaseMonth}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "purchaseMonth",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Residual Value
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.residualValue}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "residualValue",
                        e.target.value
                      )
                    }
                    
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Useful Lifetime (Months)
                  </span>
                  <Input
                    className="col-start-2 border-gray-200"
                    value={input.usefulLifetime}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "usefulLifetime",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => removeInvestmentInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4 mr-4"
            onClick={addNewInvestmentInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4"
            onClick={handleSave}
          >
            Save
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 p-4">
        <h3 className="text-2xl font-semibold mb-4">Investment Table</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={transformInvestmentDataForTable()}
          columns={investmentColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Investment Chart</h3>
        <Chart
          options={investmentChart.options}
          series={investmentChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default InvestmentSection;
