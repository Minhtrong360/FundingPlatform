import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/Input";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateInvestmentData,
  setInvestmentData,
  setInvestmentInputs,
  setInvestmentTableData,
  transformInvestmentDataForTable,
} from "../../../features/InvestmentSlice";

const InvestmentSection = ({
  numberOfMonths,

  isSaved,
  setIsSaved,

  handleSubmit,
}) => {
  const { investmentInputs, investmentData, investmentTableData } = useSelector(
    (state) => state.investment
  );
  const dispatch = useDispatch();
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

  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      investmentInputs,
      numberOfMonths
    );
    dispatch(setInvestmentData(calculatedData));
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentInputs, numberOfMonths, renderInvestmentForm]);

  useEffect(() => {
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [investmentInputs, numberOfMonths, investmentData]);

  useEffect(() => {
    const calculatedData = calculateInvestmentData(
      tempInvestmentInputs,
      numberOfMonths
    );
    setTempInvestmentData(calculatedData);
    const tableData = transformInvestmentDataForTable(
      tempInvestmentInputs,
      renderInvestmentForm,
      tempInvestmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, [tempInvestmentInputs, numberOfMonths, renderInvestmentForm]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const investmentColumns = [
    {
      fixed: "left",
      title: <div>Type</div>,
      dataIndex: "type",
      key: "type",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (startingMonth + i - 1) % 12;
      const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
      return {
        title: `${months[monthIndex]}/${year}`,
        dataIndex: `month${i + 1}`,
        key: `month${i + 1}`,
        align: "right",
        onCell: (record) => ({
          style: {
            borderRight: "1px solid #f0f0f0", // Add border right style
          },
        }),
      };
    }),
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
      dispatch(setInvestmentInputs(tempInvestmentInputs));
      const tableData = transformInvestmentDataForTable(
        tempInvestmentInputs,
        renderInvestmentForm,
        tempInvestmentData,
        numberOfMonths
      );
      dispatch(setInvestmentTableData(tableData));
      setIsSaved(false);
    }
  }, [isSaved]);

  useEffect(() => {
    const tableData = transformInvestmentDataForTable(
      investmentInputs,
      renderInvestmentForm,
      investmentData,
      numberOfMonths
    );
    dispatch(setInvestmentTableData(tableData));
  }, []);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 lg:border-r-2 border-r-0 lg:border-b-0 border-b-2">
        <section aria-labelledby="investment-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center mt-4"
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
              className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
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
                    value={formatNumber(input.assetCost)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "assetCost",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">Quantity:</span>
                  <Input
                    className="col-start-2 border-gray-200"
                    type="text"
                    min="1"
                    value={formatNumber(input.quantity)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "quantity",
                        parseNumber(e.target.value)
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
                    value={formatNumber(input.usefulLifetime)}
                    onChange={(e) =>
                      handleInvestmentInputChange(
                        input?.id,
                        "usefulLifetime",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded text-sm mt-4"
                    onClick={() => removeInvestmentInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          <button
            className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4 mr-4"
            onClick={addNewInvestmentInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-2 px-4 text-sm rounded mt-4"
            onClick={handleSave}
          >
            Save changes
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-2xl font-semibold mb-4">Investment Table</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={transformInvestmentDataForTable(
            tempInvestmentInputs,
            renderInvestmentForm,
            tempInvestmentData,
            numberOfMonths
          )}
          columns={investmentColumns}
          pagination={false}
          bordered
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
