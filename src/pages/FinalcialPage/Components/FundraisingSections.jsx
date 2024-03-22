import {
  Select as FundraisingSelect,
  SelectTrigger as FundraisingSelectTrigger,
  SelectValue as FundraisingSelectValue,
  SelectContent as FundraisingSelectContent,
  SelectItem as FundraisingSelectItem,
} from "../../../components/ui/Select";
import { Input as FundraisingInput } from "../../../components/ui/Input";
import { useEffect, useState } from "react";
import { Table, Tooltip, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setFundraisingInputs,
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";

const FundraisingSection = ({
  numberOfMonths,
  isSaved,
  setIsSaved,
  handleSubmit,
}) => {
  const { fundraisingInputs } = useSelector((state) => state.fundraising);
  const dispatch = useDispatch();

  const [tempFundraisingInputs, setTempFundraisingInputs] =
    useState(fundraisingInputs);
  const [selectedFundraisingId, setSelectedFundraisingId] = useState(
    fundraisingInputs[0]?.id
  );

  useEffect(() => {
    setTempFundraisingInputs(fundraisingInputs);
    setSelectedFundraisingId(fundraisingInputs[0]?.id);
  }, [fundraisingInputs]);

  const addNewFundraisingInput = () => {
    const maxId = Math.max(...tempFundraisingInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newFundraising = {
      id: newId,
      name: "",
      fundraisingAmount: 0,
      fundraisingType: "Common Stock",
      fundraisingBeginMonth: 1,
      equityOffered: 0,
    };
    setTempFundraisingInputs([...tempFundraisingInputs, newFundraising]);
    setSelectedFundraisingId(newId.toString());
  };

  const removeFundraisingInput = (id) => {
    const newInputs = tempFundraisingInputs.filter((input) => input?.id !== id);
    setTempFundraisingInputs(newInputs);
    setSelectedFundraisingId(newInputs[0]?.id);
  };

  const handleFundraisingInputChange = (id, field, value) => {
    const newInputs = tempFundraisingInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempFundraisingInputs(newInputs);
  };

  const fundraisingColumns = [
    {
      fixed: "left",
      title: "Fundraising Activities",
      dataIndex: "name",
      key: "name",
    },
    ...Array.from({ length: numberOfMonths }, (_, i) => ({
      title: `Month_${i + 1}`,
      dataIndex: `month${i + 1}`,
      key: `month${i + 1}`,
    })),
  ];

  const [fundraisingChart, setFundraisingChart] = useState({
    options: {
      chart: { id: "fundraising-chart", type: "bar", height: 350 },
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
          text: "Fundraising Amount ($)",
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

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedFundraisingId(selectedId);
  };

  const handleSave = () => {
    setIsSaved(true);
    message.success("Data saved successfully!");
  };

  useEffect(() => {
    if (isSaved) {
      dispatch(setFundraisingInputs(tempFundraisingInputs));

      const tableData = transformFundraisingDataForTable(
        tempFundraisingInputs,
        numberOfMonths
      );

      dispatch(setFundraisingTableData(tableData));
      setIsSaved(false);
    }
  }, [isSaved]);

  useEffect(() => {
    dispatch(setFundraisingInputs(tempFundraisingInputs));

    const tableData = transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    );

    dispatch(setFundraisingTableData(tableData));
  }, []);

  useEffect(() => {
    const transformedData = transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    );

    const seriesData = [];

    transformedData.forEach((item) => {
      const seriesItem = {
        name: item.name,
        data: Object.keys(item)
          .filter((key) => key.startsWith("month"))
          .map((key) => parseFloat(item[key])),
      };
      seriesData.push(seriesItem);
    });

    setFundraisingChart((prevChart) => ({
      ...prevChart,
      series: seriesData,
    }));
  }, [tempFundraisingInputs]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row border-t-2">
      <div className="w-full lg:w-1/4 sm:p-4 p-0 sm:border-r-2 border-r-0 sm:border-b-0 border-b-2">
        <section aria-labelledby="fundraising-heading" className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4 flex items-center mt-4"
            id="fundraising-heading"
          >
            Fundraising
          </h2>

          <div>
            <label
              htmlFor="selectedFundraising"
              className="block my-4 text-base  darkTextWhite"
            ></label>
            <select
              id="selectedFundraising"
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
              value={selectedFundraisingId}
              onChange={handleSelectChange}
            >
              {tempFundraisingInputs.map((input) => (
                <option key={input?.id} value={input?.id}>
                  {input.name}
                </option>
              ))}
            </select>
          </div>

          {tempFundraisingInputs
            .filter((input) => input?.id == selectedFundraisingId)
            .map((input) => (
              <div
                key={input?.id}
                className="bg-white rounded-md shadow p-6 border my-4 "
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Name:
                  </span>
                  <FundraisingInput
                    className="col-start-2 border-gray-200"
                    value={input.name}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Equity offered (%):
                  </span>
                  <FundraisingInput
                    className="col-start-2 border-gray-200"
                    type="number"
                    min={0}
                    max={100}
                    value={formatNumber(input.equityOffered)}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "equityOffered",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Amount:
                  </span>
                  <FundraisingInput
                    className="col-start-2 border-gray-200"
                    value={formatNumber(input.fundraisingAmount)}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingAmount",
                        parseNumber(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Fundraising Type:
                  </span>
                  <FundraisingSelect
                    className="border-gray-200"
                    onValueChange={(value) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingType",
                        value
                      )
                    }
                    value={input.fundraisingType}
                  >
                    <FundraisingSelectTrigger
                      id={`select-fundraisingType-${input?.id}`}
                      className="border-solid border-[1px] border-gray-200"
                    >
                      <FundraisingSelectValue placeholder="Select Fundraising Type" />
                    </FundraisingSelectTrigger>
                    <FundraisingSelectContent position="popper">
                      <FundraisingSelectItem value="Common Stock">
                        Common Stock
                      </FundraisingSelectItem>
                      <FundraisingSelectItem value="Preferred Stock">
                        Preferred Stock
                      </FundraisingSelectItem>
                      <FundraisingSelectItem value="Paid in Capital">
                        Paid in Capital
                      </FundraisingSelectItem>
                    </FundraisingSelectContent>
                  </FundraisingSelect>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <span className=" flex items-center text-sm">
                    Month Fundraising Begins:
                  </span>
                  <FundraisingInput
                    className="col-start-2 border-gray-200"
                    type="number"
                    min="1"
                    max="12"
                    value={input.fundraisingBeginMonth}
                    onChange={(e) =>
                      handleFundraisingInputChange(
                        input?.id,
                        "fundraisingBeginMonth",
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    className="bg-red-600 text-white py-1 px-2 rounded"
                    onClick={() => removeFundraisingInput(input?.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4 mr-4"
            onClick={addNewFundraisingInput}
          >
            Add new
          </button>

          <button
            className="bg-blue-600 text-white py-1 px-2 rounded mt-4"
            onClick={handleSave}
          >
            Save changes
          </button>
        </section>
      </div>
      <div className="w-full lg:w-3/4 sm:p-4 p-0">
        <h3 className="text-2xl font-semibold mb-4">Fundraising Table</h3>
        <Table
          className="overflow-auto my-8"
          size="small"
          dataSource={transformFundraisingDataForTable(
            tempFundraisingInputs,
            numberOfMonths
          )}
          columns={fundraisingColumns}
          pagination={false}
        />
        <h3 className="text-2xl font-semibold my-8">Fundraising Chart</h3>
        <Chart
          options={fundraisingChart.options}
          series={fundraisingChart.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default FundraisingSection;
