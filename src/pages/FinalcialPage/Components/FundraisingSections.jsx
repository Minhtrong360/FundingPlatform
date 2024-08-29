import {
  Select as FundraisingSelect,
  SelectTrigger as FundraisingSelectTrigger,
  SelectValue as FundraisingSelectValue,
  SelectContent as FundraisingSelectContent,
  SelectItem as FundraisingSelectItem,
} from "../../../components/ui/select";
import { Input as FundraisingInput } from "../../../components/ui/input";
import { useEffect, useState } from "react";
import { Card, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setFundraisingInputs,
  setFundraisingTableData,
  transformFundraisingDataForTable,
} from "../../../features/FundraisingSlice";
import { supabase } from "../../../supabase";
import { useParams } from "react-router-dom";
import { DownloadOutlined, FullscreenOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";

const FundraisingInputForm = ({
  tempFundraisingInputs,
  selectedFundraisingId,
  setSelectedFundraisingId,
  handleFundraisingInputChange,
  addNewFundraisingInput,
  confirmDelete,
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  handleSave,
  isLoading,
}) => {
  return (
    <section
      aria-labelledby="fundraising-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="fundraising-heading"
      >
        Fundraising
      </h2>

      <div>
        <label
          htmlFor="selectedFundraising"
          className="block my-4 text-base darkTextWhite"
        ></label>
        <select
          id="selectedFundraising"
          className="py-3 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
          value={selectedFundraisingId}
          onChange={(e) => setSelectedFundraisingId(e.target.value)}
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
          <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">
                Fundraising Name:
              </span>
              <FundraisingInput
                className="col-start-2 border-gray-300"
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
                className="col-start-2 border-gray-300"
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
                className="col-start-2 border-gray-300"
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
                className="border-gray-300"
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
                  className="border-solid border-[1px] border-gray-300"
                >
                  <FundraisingSelectValue placeholder="Select Fundraising Type" />
                </FundraisingSelectTrigger>
                <FundraisingSelectContent position="popper">
                  <FundraisingSelectItem
                    value="Common Stock"
                    className="hover:cursor-pointer"
                  >
                    Common Stock
                  </FundraisingSelectItem>
                  <FundraisingSelectItem
                    value="Preferred Stock"
                    className="hover:cursor-pointer"
                  >
                    Preferred Stock
                  </FundraisingSelectItem>
                  <FundraisingSelectItem
                    value="Paid in Capital"
                    className="hover:cursor-pointer"
                  >
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
                className="col-start-2 border-gray-300"
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                className="bg-red-600 text-white py-2 px-2 rounded-2xl text-sm mt-4"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                {" "}
                <DeleteOutlined
                  style={{
                    fontSize: "12px",
                    color: "#FFFFFF",
                    marginRight: "4px",
                  }}
                />
                Remove
              </button>

              <button
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4"
                onClick={addNewFundraisingInput}
              >
                <PlusOutlined
                  style={{
                    fontSize: "12px",
                    color: "#FFFFFF",
                    marginRight: "4px",
                  }}
                />
                Add
              </button>

              <button
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw]"
                onClick={handleSave}
              >
                {isLoading ? (
                  <SpinnerBtn />
                ) : (
                  <>
                    <CheckCircleOutlined
                      style={{
                        fontSize: "12px",
                        color: "#FFFFFF",
                        marginRight: "4px",
                      }}
                    />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
        cancelButtonProps={{
          style: {
            borderRadius: "0.375rem",
            cursor: "pointer",
          },
        }}
        okButtonProps={{
          style: {
            background: "#f5222d",
            borderColor: "#f5222d",
            color: "#fff",
            borderRadius: "0.375rem",
            cursor: "pointer",
          },
        }}
        centered={true}
      >
        Are you sure you want to delete it?
      </Modal>
    </section>
  );
};

const FundraisingSection = ({ numberOfMonths, isSaved, setIsSaved }) => {
  const { fundraisingInputs } = useSelector((state) => state.fundraising);
  const dispatch = useDispatch();

  const [tempFundraisingInputs, setTempFundraisingInputs] =
    useState(fundraisingInputs);
  const [selectedFundraisingId, setSelectedFundraisingId] = useState(
    fundraisingInputs[0]?.id
  );

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
    const indexToRemove = tempFundraisingInputs.findIndex(
      (input) => input?.id == id
    );
    if (indexToRemove !== -1) {
      const newInputs = [
        ...tempFundraisingInputs.slice(0, indexToRemove),
        ...tempFundraisingInputs.slice(indexToRemove + 1),
      ];
      const prevInputId =
        indexToRemove === 0
          ? newInputs[0]?.id
          : newInputs[indexToRemove - 1]?.id;

      setTempFundraisingInputs(newInputs);
      setSelectedFundraisingId(prevInputId);
    }
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

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  const { startMonth, startYear, inputData } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24

  const fundraisingColumns = [
    {
      fixed: "left",
      title: <div>Fundraising Activities</div>,
      dataIndex: "name",
      key: "name",
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

  const [fundraisingChart, setFundraisingChart] = useState({
    options: {
      chart: {
        id: "fundraising-chart",
        type: "area",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        animations: {
          enabled: false,
        },
      },
      grid: { show: false },
      colors: [
        "#00A2FF",
        "#14F584",
        "#FFB303",
        "#DBFE01",
        "#FF474C",
        "#D84FE4",
      ],
      xaxis: {
        axisTicks: {
          show: false, // Hide x-axis ticks
        },
        labels: {
          style: {
            fontFamily: "Sora, sans-serif",
          },
          rotate: 0,
        },
        categories: Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
        title: {
          text: "Month",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            fontFamily: "Sora, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Fundraising Amount ($)",
          style: {
            fontFamily: "Sora, sans-serif",
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Sora, sans-serif",
      },
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "smooth" },
    },
    series: [],
  });

  const { id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const { data: existingData, error: selectError } = await supabase
        .from("finance")
        .select("*")
        .eq("id", id);
      if (selectError) {
        throw selectError;
      }

      if (existingData && existingData.length > 0) {
        const { user_email, collabs } = existingData[0];

        // Check if user.email matches user_email or is included in collabs
        if (user.email !== user_email && !collabs?.includes(user.email)) {
          message.error("You do not have permission to update this record.");
          return;
        }

        dispatch(setFundraisingInputs(tempFundraisingInputs));

        const tableData = transformFundraisingDataForTable(
          tempFundraisingInputs,
          numberOfMonths
        );

        dispatch(setFundraisingTableData(tableData));

        const updatedInputData = {
          ...inputData,
          fundraisingInputs: tempFundraisingInputs,
        };

        dispatch(setInputData(updatedInputData));

        const { error: updateError } = await supabase
          .from("finance")
          .update({ inputData: updatedInputData })
          .eq("id", existingData[0]?.id)
          .select();

        if (updateError) {
          throw updateError;
        } else {
          message.success("Data saved successfully!");
        }
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsLoading(false);
      setIsInputFormOpen(false);
    }
  };

  useEffect(() => {
    dispatch(setFundraisingInputs(tempFundraisingInputs));

    const tableData = transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    );

    dispatch(setFundraisingTableData(tableData));
  }, []);
  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  useEffect(() => {
    const transformedData = transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    );

    const seriesData = [];
    transformedData.forEach((item) => {
      if (
        item.name !== "Increased in Common Stock" &&
        item.name !== "Increased in Preferred Stock" &&
        item.name !== "Increased in Paid in Capital" &&
        item.name !== "Accumulated Common Stock" &&
        item.name !== "Accumulated Preferred Stock" &&
        item.name !== "Accumulated Paid in Capital"
      ) {
        const seriesItem = {
          name: item.name,
          data: Object.keys(item)
            .filter((key) => key.startsWith("month"))
            .slice(chartStartMonth - 1, chartEndMonth) // slice để lấy khoảng tháng cần thiết
            .map((key) => (item[key] ? parseNumber(item[key]) : 0)), // Sử dụng parseNumber và đảm bảo rằng nếu không có dữ liệu thì trả về 0
        };
        seriesData.push(seriesItem);
      }
    });

    setFundraisingChart((prevChart) => ({
      ...prevChart,
      options: {
        ...prevChart.options,
        xaxis: {
          ...prevChart.options.xaxis,
          categories: Array.from(
            { length: chartEndMonth - chartStartMonth + 1 },
            (_, i) => {
              const monthIndex =
                (startingMonth + chartStartMonth - 1 + i - 1) % 12;
              const year =
                startingYear +
                Math.floor((startingMonth + chartStartMonth - 1 + i - 1) / 12);
              return `${months[monthIndex]}/${year}`;
            }
          ),
        },
      },
      series: seriesData,
    }));
  }, [tempFundraisingInputs, chartStartMonth, chartEndMonth, numberOfMonths]);

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removeFundraisingInput(selectedFundraisingId);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Fundraising Activities",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    ).forEach((record) => {
      console.log("record", record);
      const row = [record.name];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Fundraising Data");

    // Write workbook and trigger download
    const wbout = XLSX.write(workBook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "fundraising_data.xlsx"
    );
  };

  const downloadJSON = () => {
    const fundraisingTableData = transformFundraisingDataForTable(
      tempFundraisingInputs,
      numberOfMonths
    );

    // Update personnel inputs with formatted job begin and end months
    const updateFundraisingInputs = tempFundraisingInputs.map((input) => {
      const monthIndexStart =
        (Number(startingMonth) + Number(input.fundraisingBeginMonth) - 2) % 12;

      const yearStart =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.fundraisingBeginMonth) - 2) / 12
        );

      // const monthIndexEnd =
      //   (Number(startingMonth) + Number(input.jobEndMonth) - 2) % 12;
      // const yearEnd =
      //   Number(startingYear) +
      //   Math.floor(
      //     (Number(startingMonth) + Number(input.jobEndMonth) - 2) / 12
      //   );

      return {
        ...input,
        fundraisingInputs: `${months[monthIndexStart]}/${yearStart}`,
        // jobEndMonth: `${months[monthIndexEnd]}/${yearEnd}`,
      };
    });

    const data = {
      fundraisingInputs: updateFundraisingInputs,
      fundraisingTableData,
    };

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "fundraising_data.json");
  };

  return (
    <div>
      <div className="overflow-x-auto whitespace-nowrap border-yellow-300 text-sm NOsticky NOtop-8 z-50">
        <ul className="py-4 flex xl:justify-center justify-start items-center space-x-4">
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md ${
              activeTab === "input"
                ? "bg-yellow-300 font-bold"
                : "bg-yellow-100 hover:bg-yellow-200"
            } `}
            onClick={() => handleTabChange("input")}
          >
            a. Input
          </li>
          <li
            className={`hover:cursor-pointer px-2 py-1 rounded-md ${
              activeTab === "table&chart"
                ? "bg-green-300 font-bold"
                : "bg-green-100 hover:bg-green-200"
            } `}
            onClick={() => handleTabChange("table&chart")}
          >
            b. Table and Chart
          </li>
        </ul>
      </div>
      <div className="w-full h-full flex flex-col lg:flex-row">
        {activeTab === "table&chart" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0">
              <h3 className="text-lg font-semibold mb-8">
                I. Fundraising Chart
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="flex flex-col transition duration-500  rounded-2xl">
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(event) =>
                        handleChartClick(fundraisingChart, event)
                      }
                      className="text-gray-500 hover:text-gray-700 dark1:text-gray-400 dark1:hover:text-gray-200"
                    >
                      <FullscreenOutlined />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="min-w-[10vw] mb-2">
                      <label htmlFor="startMonthSelect">Start Month:</label>
                      <select
                        id="startMonthSelect"
                        value={chartStartMonth}
                        onChange={(e) =>
                          setChartStartMonth(
                            Math.max(1, Math.min(e.target.value, chartEndMonth))
                          )
                        }
                        className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                      >
                        {Array.from({ length: numberOfMonths }, (_, i) => {
                          const monthIndex = (startingMonth + i - 1) % 12;
                          const year =
                            startingYear +
                            Math.floor((startingMonth + i - 1) / 12);
                          return (
                            <option key={i + 1} value={i + 1}>
                              {`${months[monthIndex]}/${year}`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="min-w-[10vw] mb-2">
                      <label htmlFor="endMonthSelect">End Month:</label>
                      <select
                        id="endMonthSelect"
                        value={chartEndMonth}
                        onChange={(e) =>
                          setChartEndMonth(
                            Math.max(
                              chartStartMonth,
                              Math.min(e.target.value, numberOfMonths)
                            )
                          )
                        }
                        className="py-2 px-4 block w-full border-gray-300 rounded-2xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                      >
                        {Array.from({ length: numberOfMonths }, (_, i) => {
                          const monthIndex = (startingMonth + i - 1) % 12;
                          const year =
                            startingYear +
                            Math.floor((startingMonth + i - 1) / 12);
                          return (
                            <option key={i + 1} value={i + 1}>
                              {`${months[monthIndex]}/${year}`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <Chart
                    options={{
                      ...fundraisingChart.options,
                      xaxis: {
                        ...fundraisingChart.options.xaxis,
                        // tickAmount: 6, // Set the number of ticks on the x-axis to 12
                      },
                    }}
                    series={fundraisingChart.series}
                    type="bar"
                    height={350}
                  />
                </Card>
              </div>
              <Modal
                centered
                open={isChartModalVisible}
                footer={null}
                onCancel={() => setIsChartModalVisible(false)}
                width="90%"
                style={{ top: 20 }}
              >
                {selectedChart && (
                  <Chart
                    options={{
                      ...selectedChart.options,
                      // ... other options
                    }}
                    series={selectedChart.series}
                    type="bar"
                    height={500}
                    className="p-4"
                  />
                )}
              </Modal>
              <div className="flex justify-between items-center my-4 mt-20">
                <h3 className="text-lg font-semibold">II. Fundraising Table</h3>
                <button
                  onClick={downloadExcel}
                  className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl min-w-[6vw] "
                >
                  <DownloadOutlined className="mr-1" />
                  Download Excel
                </button>
              </div>{" "}
              <Table
                className="overflow-auto my-8 rounded-md bg-white"
                size="small"
                dataSource={transformFundraisingDataForTable(
                  tempFundraisingInputs,
                  numberOfMonths
                )}
                columns={fundraisingColumns}
                bordered
                pagination={false}
                rowClassName={(record) =>
                  record.key === "Total funding" ? "font-bold" : ""
                }
              />
            </div>
            <div className="w-full xl:w-1/4 sm:p-4 p-0 xl:block hidden ">
              <button
                className="bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] "
                style={{ bottom: "20px", right: "80px", position: "fixed" }}
                onClick={handleSave}
              >
                {isLoading ? (
                  <SpinnerBtn />
                ) : (
                  <>
                    <CheckCircleOutlined
                      style={{
                        fontSize: "12px",
                        color: "#FFFFFF",
                        marginRight: "4px",
                      }}
                    />
                    Save
                  </>
                )}
              </button>
            </div>
          </>
        )}
        {activeTab === "input" && (
          <>
            <div className="w-full xl:w-3/4 sm:p-4 p-0 "> </div>

            <div className="w-full xl:w-1/4 sm:p-4 p-0">
              <FundraisingInputForm
                tempFundraisingInputs={tempFundraisingInputs}
                selectedFundraisingId={selectedFundraisingId}
                setSelectedFundraisingId={setSelectedFundraisingId}
                handleFundraisingInputChange={handleFundraisingInputChange}
                addNewFundraisingInput={addNewFundraisingInput}
                confirmDelete={confirmDelete}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                handleSave={handleSave}
                isLoading={isLoading}
              />
            </div>

            {/* <div className="xl:hidden block">
              <FloatButton
                tooltip={<div>Input values</div>}
                style={{
                  position: "fixed",
                  bottom: "30px",
                  right: "30px",
                }}
                onClick={() => {
                  setIsInputFormOpen(true);
                }}
              >
                <Button type="primary" shape="circle" icon={<FileOutlined />} />
              </FloatButton>
            </div> */}

            {isInputFormOpen && (
              <Modal
                open={isInputFormOpen}
                onOk={() => {
                  handleSave();
                  setIsInputFormOpen(false);
                }}
                onCancel={() => {
                  setTempFundraisingInputs(fundraisingInputs);
                  setSelectedFundraisingId(fundraisingInputs[0]?.id);
                  setIsInputFormOpen(false);
                }}
                okText={isLoading ? <SpinnerBtn /> : "Save Change"}
                cancelText="Cancel"
                cancelButtonProps={{
                  style: {
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                  },
                }}
                okButtonProps={{
                  style: {
                    background: "#2563EB",
                    borderColor: "#2563EB",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    minWidth: "5vw",
                  },
                }}
                footer={null}
                centered={true}
                zIndex={50}
              >
                <FundraisingInputForm
                  tempFundraisingInputs={tempFundraisingInputs}
                  selectedFundraisingId={selectedFundraisingId}
                  setSelectedFundraisingId={setSelectedFundraisingId}
                  handleFundraisingInputChange={handleFundraisingInputChange}
                  addNewFundraisingInput={addNewFundraisingInput}
                  confirmDelete={confirmDelete}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  isDeleteModalOpen={isDeleteModalOpen}
                  handleSave={handleSave}
                  isLoading={isLoading}
                />
              </Modal>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FundraisingSection;
