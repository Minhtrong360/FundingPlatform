import {
  Select as FundraisingSelect,
  SelectTrigger as FundraisingSelectTrigger,
  SelectValue as FundraisingSelectValue,
  SelectContent as FundraisingSelectContent,
  SelectItem as FundraisingSelectItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { Input as FundraisingInput } from "../../../components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { Checkbox, FloatButton, Modal, Table, message } from "antd";
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

import { FileOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";
import {
  CardContent,
  CardHeader,
  Card as CardShadcn,
  CardTitle,
} from "../../../components/ui/card";
import {
  Check,
  DollarSign,
  Download,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { debounce } from "lodash";
import {
  MessageSquare,
  Users,
  ThumbsUp,
  Settings,
  UserPlus,
  UserMinus,
} from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

const FundraisingInputForm = ({
  tempFundraisingInputs,
  renderFundraisingForm,
  setRenderFundraisingForm,
  handleFundraisingInputChange,
  addNewFundraisingInput,
  confirmDelete,
  setIsDeleteModalOpen,
  isDeleteModalOpen,
  handleSave,
  isLoading,
}) => {
  const [debouncedInputs, setDebouncedInputs] = useState(tempFundraisingInputs);

  // Thêm useEffect để đồng bộ hóa debouncedInputs khi tempFundraisingInputs thay đổi
  useEffect(() => {
    setDebouncedInputs(tempFundraisingInputs);
  }, [tempFundraisingInputs]);

  // Debounced function to update state after 1 second
  const debouncedHandleInputChange = useCallback(
    debounce((id, field, value) => {
      handleFundraisingInputChange(id, field, value);
    }, 1000),
    [handleFundraisingInputChange]
  );

  const handleInputChange = (id, field, value) => {
    setDebouncedInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );

    // Call debounced state update
    debouncedHandleInputChange(id, field, value);
  };

  useEffect(() => {
    if (!renderFundraisingForm) {
      setRenderFundraisingForm("all");
    }
  }, [renderFundraisingForm]);

  return (
    <section
      aria-labelledby="fundraising-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      {/* <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="fundraising-heading"
      >
        Fundraising
      </h2> */}

      {debouncedInputs
        .filter((input) => input?.id == renderFundraisingForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-md p-6 border mb-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">
                Fundraising Name:
              </span>
              <FundraisingInput
                className="col-start-2 border-gray-300"
                value={input.name}
                onChange={(e) =>
                  handleInputChange(input?.id, "name", e.target.value)
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
                  handleInputChange(
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
                  handleInputChange(
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
                  handleInputChange(input?.id, "fundraisingType", value)
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
                  handleInputChange(
                    input?.id,
                    "fundraisingBeginMonth",
                    parseInt(e.target.value, 10)
                  )
                }
              />
            </div>
          </div>
        ))}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="destructive"
          onClick={() => setIsDeleteModalOpen(true)}
          style={{ backgroundColor: "#EF4444", color: "white" }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>
        <Button
          variant="destructive"
          onClick={addNewFundraisingInput}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
        <Button
          variant="destructive"
          onClick={handleSave}
          style={{ backgroundColor: "#18181B", color: "white" }}
        >
          {isLoading ? (
            <SpinnerBtn />
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </div>
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
  const [renderFundraisingForm, setRenderFundraisingForm] = useState(
    fundraisingInputs[0]?.id
  );

  const addNewFundraisingInput = () => {
    const maxId = Math.max(...tempFundraisingInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newFundraising = {
      id: newId,
      name: "Owner",
      fundraisingAmount: 0,
      fundraisingType: "Common Stock",
      fundraisingBeginMonth: 1,
      equityOffered: 0,
    };
    setTempFundraisingInputs([...tempFundraisingInputs, newFundraising]);
    setRenderFundraisingForm(newId.toString());
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
      setRenderFundraisingForm(prevInputId);
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
            fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
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
            fontFamily: "Raleway Variable, sans-serif",
          },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Fundraising Amount ($)",
          style: {
            fontFamily: "Raleway Variable, sans-serif",
            fontsize: "12px",
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Raleway Variable, sans-serif",
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
    removeFundraisingInput(renderFundraisingForm);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
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

  const [visibleMetrics, setVisibleMetrics] = useState({
    fundingItems: true,
    totalFunding: true,
  });

  const [visibleCharts, setVisibleCharts] = useState({
    fundraisingChart: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const tableData = transformFundraisingDataForTable(
    tempFundraisingInputs,
    numberOfMonths
  );

  const [metrics, setMetrics] = useState([
    {
      key: "fundingItems",
      title: "Total Source",
      value: "",
      change: "",
      icon: Layers,
    },
    {
      key: "totalFunding",
      title: "Total Funding",
      value: "",
      change: "",
      icon: DollarSign,
    },
  ]);

  // Function to simplify data extraction
  const extractData = (data, keyPrefix, startMonth, endMonth) => {
    return Object.keys(data)
      .filter((key) => key.startsWith(keyPrefix))
      .slice(startMonth - 1, endMonth)
      .reduce((sum, monthKey) => sum + parseNumber(data[monthKey]), 0);
  };

  // Function to calculate metric changes
  const calculateChange = (startValue, endValue) => {
    if (startValue === 0) return 0;
    return ((endValue - startValue) / startValue) * 100;
  };

  // Simplified useEffect for calculating metrics and filtering data

  useEffect(() => {
    let fundingItems = tempFundraisingInputs.length;

    if (renderFundraisingForm === "all") {
      // New logic to calculate metrics for all loans

      let totalFunding = 0;

      // Sum up totalItems based on assetCost * quantity for each input

      const totalFundingRow = tableData.find((row) =>
        row.key.includes("Total funding")
      );

      if (totalFundingRow) {
        totalFunding += extractData(
          totalFundingRow,
          "month",
          chartStartMonth,
          chartEndMonth
        );
      }

      setMetrics((prevMetrics) => [
        { ...prevMetrics[0], value: fundingItems },
        { ...prevMetrics[1], value: formatNumber(totalFunding?.toFixed(2)) },
      ]);
    } else {
      // Case when a specific loan is selected
      const selectedFun = tempFundraisingInputs.find(
        (input) => input.id == renderFundraisingForm
      );
      if (selectedFun) {
        let totalFunding = 0;
        const filtered = tableData?.filter((data) =>
          data?.name?.includes(selectedFun.name)
        );
        console.log("filtered", filtered);
        if (filtered) {
          totalFunding += extractData(
            filtered[0],
            "month",
            chartStartMonth,
            chartEndMonth
          );
        }

        setMetrics((prevMetrics) => [
          { ...prevMetrics[0], value: fundingItems },
          { ...prevMetrics[1], value: formatNumber(totalFunding?.toFixed(2)) },
        ]);
      }
    }
  }, [
    chartStartMonth,
    chartEndMonth,
    renderFundraisingForm,
    tempFundraisingInputs,
  ]);

  const renderValue =
    tempFundraisingInputs.find((item) => item.id == renderFundraisingForm) ||
    "all";

  console.log("fundraisingInputs", fundraisingInputs);
  console.log("tableData", tableData);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <section className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-[1.25rem]">
            {/* <h2 className="text-lg font-semibold">
              I. Metrics (Under Constructions)
            </h2> */}
            <Select
              value={renderValue.id ? renderValue.id : "all"}
              onValueChange={(e) => {
                setRenderFundraisingForm(e);
              }}
              className="w-full md:w-auto min-w-[10rem]"
            >
              <SelectTrigger className="w-full md:w-auto min-w-[10rem]">
                <SelectValue placeholder="Offline">
                  {renderValue.name ? renderValue.name : "All"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full md:w-auto min-w-[10rem]">
                <SelectItem value="all">All</SelectItem>
                {tempFundraisingInputs.map((input) => (
                  <SelectItem key={input?.id} value={input?.id}>
                    {input?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col md:!mt-0 !mt-2">
              {/* Bộ chọn khoảng thời gian */}

              <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                <div className="min-w-[10vw] w-full flex flex-row sm:!mr-0 !mr-1">
                  <label
                    htmlFor="startMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    From:
                  </label>
                  <Select
                    value={chartStartMonth}
                    onValueChange={(value) => {
                      setChartStartMonth(
                        Math.max(1, Math.min(value, chartEndMonth))
                      );
                    }}
                  >
                    <SelectTrigger className="w-full sm:!justify-between !justify-center">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[10vw] w-full flex flex-row sm:!ml-0 !ml-1">
                  <label
                    htmlFor="endMonthSelect"
                    className="sm:!flex !hidden text-sm justify-center items-center !my-2 !mx-4"
                  >
                    To:
                  </label>
                  <Select
                    value={chartEndMonth}
                    onValueChange={(value) => {
                      setChartEndMonth(
                        Math.max(
                          chartStartMonth,
                          Math.min(value, numberOfMonths)
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: numberOfMonths }, (_, i) => {
                        const monthIndex = (startingMonth + i - 1) % 12;
                        const year =
                          startingYear +
                          Math.floor((startingMonth + i - 1) / 12);
                        return (
                          <SelectItem key={i + 1} value={i + 1}>
                            {`${months[monthIndex]}/${year}`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* Popover để chọn metrics hiển thị */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="bg-white right-0 left-auto"
                  align="end"
                  style={{
                    maxHeight: "300px", // Giới hạn chiều cao tối đa
                    overflowY: "auto", // Cho phép cuộn theo chiều dọc
                    paddingRight: "1rem", // Khoảng trống cho thanh cuộn
                  }}
                >
                  <div className="grid gap-4">
                    <h4 className="font-medium leading-none">
                      Visible Metrics
                    </h4>
                    {metrics.map((metric) => (
                      <div
                        key={metric.key}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={metric.key}
                          checked={visibleMetrics[metric.key]}
                          onChange={() => toggleMetric(metric.key)}
                        />
                        <label
                          htmlFor={metric.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {metric.title}
                        </label>
                      </div>
                    ))}

                    {/* <h4 className="font-medium leading-none mt-4">
                      Visible Charts
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fundraisingChart"
                        checked={visibleCharts.fundraisingChart}
                        onChange={() =>
                          setVisibleCharts((prev) => ({
                            ...prev,
                            fundraisingChart: !prev.fundraisingChart,
                          }))
                        }
                      />
                      <label
                        htmlFor="fundraisingChart"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Fundraising Chart
                      </label>
                    </div> */}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Hiển thị các metrics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(
              (metric) =>
                visibleMetrics[metric.key] && (
                  <CardShadcn key={metric.key}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {metric.change
                          ? `${metric.change} from last period`
                          : ""}
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>
        {/* <h3 className="text-lg font-semibold mb-8">II. Fundraising Chart</h3> */}
        {/* Fundraising Chart */}
        {!visibleCharts.fundraisingChart ? (
          <div className="flex justify-center items-center h-[350px]">
            <p className="animate-blink text-center text-lg font-semibold text-gray-500">
              Temporarily Disabled
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <CardShadcn className="flex flex-col transition duration-500 !rounded-md relative">
              <CardHeader>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-50"
                  onClick={(event) => handleChartClick(fundraisingChart, event)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M15 3h6v6" />
                    <path d="M10 14 21 3" />
                    <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
                  </svg>
                  <span className="sr-only">Fullscreen</span>
                </Button>
              </CardHeader>
              <CardContent>
                <Chart
                  options={{
                    ...fundraisingChart.options,
                    xaxis: {
                      ...fundraisingChart.options.xaxis,
                    },
                  }}
                  series={fundraisingChart.series}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </CardShadcn>
          </div>
        )}
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
        <div className="flex justify-between items-center my-8 mt-20">
          {/* <h3 className="text-lg font-semibold">III. Fundraising Table</h3> */}
          <ButtonV0 variant="outline" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </ButtonV0>
        </div>{" "}
        <Table
          className="custom-table bg-white overflow-auto my-8 rounded-md"
          size="small"
          dataSource={tableData}
          columns={fundraisingColumns}
          bordered={false} // Tắt border mặc định của antd
          pagination={false}
          rowClassName={(record) =>
            record.key === "Total funding" ? "font-bold" : ""
          }
        />
      </div>

      <div className="relative w-full xl:w-1/4">
        <div className="!py-4 xl:!block !hidden border-white !sticky !top-28">
          <FundraisingInputForm
            tempFundraisingInputs={tempFundraisingInputs}
            renderFundraisingForm={renderFundraisingForm}
            setRenderFundraisingForm={setRenderFundraisingForm}
            handleFundraisingInputChange={handleFundraisingInputChange}
            addNewFundraisingInput={addNewFundraisingInput}
            confirmDelete={confirmDelete}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            isDeleteModalOpen={isDeleteModalOpen}
            handleSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="xl:!hidden !block">
        <FloatButton
          tooltip={<div>Input values</div>}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "80px",
            width: "48px",
            height: "48px",
          }}
          className="!shadow-md !bg-[#f3f4f6]"
          onClick={() => {
            setIsInputFormOpen(true);
          }}
        >
          <Button type="primary" shape="circle" icon={<FileOutlined />} />
        </FloatButton>
      </div>

      {isInputFormOpen && (
        <Modal
          open={isInputFormOpen}
          onOk={() => {
            handleSave();
            setIsInputFormOpen(false);
          }}
          onCancel={() => {
            setTempFundraisingInputs(fundraisingInputs);
            setRenderFundraisingForm(fundraisingInputs[0]?.id);
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
          zIndex={42424243}
        >
          <FundraisingInputForm
            tempFundraisingInputs={tempFundraisingInputs}
            renderFundraisingForm={renderFundraisingForm}
            setRenderFundraisingForm={setRenderFundraisingForm}
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
    </div>
  );
};

export default FundraisingSection;
