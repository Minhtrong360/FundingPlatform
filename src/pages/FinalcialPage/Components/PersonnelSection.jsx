import { useCallback, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Checkbox, FloatButton, Modal, Table, message } from "antd";
import Chart from "react-apexcharts";
import { formatNumber, parseNumber } from "../../../features/CostSlice";
import {
  setPersonnelInputs,
  setPersonnelCostData,
  calculatePersonnelCostData,
  transformPersonnelCostDataForTable,
} from "../../../features/PersonnelSlice";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../supabase";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { useParams } from "react-router-dom";
import { FileOutlined } from "@ant-design/icons";

import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";

import {
  Card as CardShadcn,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/ui/card";
import { Check, DollarSign, Download, Plus, Trash2 } from "lucide-react";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { debounce } from "lodash";
import { CalendarIcon, Users, Settings } from "lucide-react";
// Thêm các import cần thiết cho metrics
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

const PersonnelInputForm = ({
  tempPersonnelInputs,
  renderPersonnelForm,
  setRenderPersonnelForm,
  handlePersonnelInputChange,
  formatNumber,
  parseNumber,
  addNewPersonnelInput,
  handleSave,
  isLoading,
  setIsDeleteModalOpen,
  numberOfMonths,
}) => {
  const [debouncedInputs, setDebouncedInputs] = useState(tempPersonnelInputs);
  // Thêm useEffect để đồng bộ hóa debouncedInputs khi tempFundraisingInputs thay đổi
  useEffect(() => {
    setDebouncedInputs(tempPersonnelInputs);
  }, [tempPersonnelInputs]);
  // Debounced function to update state after 1 second
  const debouncedHandleInputChange = useCallback(
    debounce((id, field, value) => {
      handlePersonnelInputChange(id, field, value);
    }, 1000),
    [handlePersonnelInputChange]
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

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const startingMonth = startMonth;
  const startingYear = startYear;

  return (
    <section
      aria-labelledby="personnel-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      {/* <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="personnel-heading"
      >
        Personnel
      </h2> */}

      {debouncedInputs
        .filter((input) => input?.id == renderPersonnelForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-md p-6 border mb-4">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">Job Title</span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Job Title"
                value={input.jobTitle}
                onChange={(e) =>
                  handleInputChange(input.id, "jobTitle", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">Department</span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Department"
                value={input.department}
                onChange={(e) =>
                  handleInputChange(input.id, "department", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">Salary/month</span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Salary per Month"
                value={formatNumber(input.salaryPerMonth)}
                onChange={(e) =>
                  handleInputChange(
                    input.id,
                    "salaryPerMonth",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">
                Growth rate (%)
              </span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Growth rate"
                value={formatNumber(input.increasePerYear)}
                onChange={(e) =>
                  handleInputChange(
                    input.id,
                    "increasePerYear",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Frequency:</span>
              <Select
                className="border-gray-300"
                onValueChange={(value) =>
                  handleInputChange(input?.id, "growthSalaryFrequency", value)
                }
                value={input.growthSalaryFrequency}
              >
                <SelectTrigger
                  id={`select-growthSalaryFrequency-${input?.id}`}
                  className="border-solid border-[1px] border-gray-300"
                >
                  <SelectValue placeholder="Select Growth Frequency" />
                </SelectTrigger>
                <SelectContent position="popper" className="bg-white">
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                  <SelectItem value="Annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">No. of hires</span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Number of Hires"
                value={formatNumber(input.numberOfHires)}
                onChange={(e) =>
                  handleInputChange(
                    input.id,
                    "numberOfHires",
                    parseNumber(e.target.value)
                  )
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">Job begin month</span>
              <Select
                value={input.jobBeginMonth}
                onValueChange={(value) => {
                  handleInputChange(input.id, "jobBeginMonth", value);
                }}
              >
                <SelectTrigger className="col-start-2 border-gray-300 w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
                    return (
                      <SelectItem key={i + 1} value={i + 1}>
                        {`${months[monthIndex]}/${year}`}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className="flex items-center text-sm">
                Job ending month
              </span>
              <Select
                value={input.jobEndMonth}
                onValueChange={(value) => {
                  handleInputChange(input.id, "jobEndMonth", value);
                }}
              >
                <SelectTrigger className="col-start-2 border-gray-300 w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: numberOfMonths }, (_, i) => {
                    const monthIndex = (startingMonth + i - 1) % 12;
                    const year =
                      startingYear + Math.floor((startingMonth + i - 1) / 12);
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
          onClick={addNewPersonnelInput}
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
    </section>
  );
};

const PersonnelSection = ({ numberOfMonths }) => {
  const { personnelInputs, personnelCostData } = useSelector(
    (state) => state.personnel
  );
  const dispatch = useDispatch();
  const [tempPersonnelInputs, setTempPersonnelInputs] =
    useState(personnelInputs);
  const [tempPersonnelCostData, setTempPersonnelCostData] =
    useState(personnelCostData);
  const [renderPersonnelForm, setRenderPersonnelForm] = useState(
    personnelInputs[0]?.id
  );

  const addNewPersonnelInput = () => {
    const maxId = Math.max(...tempPersonnelInputs.map((input) => input?.id));
    const newId = maxId !== -Infinity ? maxId + 1 : 1;
    const newPersonnel = {
      id: newId,
      jobTitle: "New position",
      department: "General",
      salaryPerMonth: 0,
      increasePerYear: 10,
      growthSalaryFrequency: "Annually",
      numberOfHires: 1,
      jobBeginMonth: 1,
      jobEndMonth: 36,
    };
    setTempPersonnelInputs([...tempPersonnelInputs, newPersonnel]);
    setRenderPersonnelForm(newId.toString());
  };

  const removePersonnelInput = (id) => {
    const newInputs = tempPersonnelInputs.filter((input) => input?.id != id);
    setTempPersonnelInputs(newInputs);
    setRenderPersonnelForm(newInputs[0]?.id);
  };

  const handlePersonnelInputChange = (id, field, value) => {
    const newInputs = tempPersonnelInputs.map((input) => {
      if (input?.id === id) {
        return {
          ...input,
          [field]: value,
        };
      }
      return input;
    });
    setTempPersonnelInputs(newInputs);
  };

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      personnelInputs,
      numberOfMonths
    );
    dispatch(setPersonnelCostData(calculatedData));
  }, [personnelInputs, numberOfMonths]);

  useEffect(() => {
    const calculatedData = calculatePersonnelCostData(
      tempPersonnelInputs,
      numberOfMonths
    );
    setTempPersonnelCostData(calculatedData);
  }, [tempPersonnelInputs, numberOfMonths]);

  const personnelCostTableData = transformPersonnelCostDataForTable(
    tempPersonnelCostData
  );

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
  const startingMonth = startMonth;
  const startingYear = startYear;

  const personnelCostColumns = [
    {
      fixed: "left",
      title: <div>Personnel</div>,
      dataIndex: "jobTitle",
      key: "jobTitle",
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

  const [personnelChart, setPersonnelChart] = useState({
    options: {
      chart: {
        id: "personnel-chart",
        type: "area",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        fontFamily: "Raleway Variable, sans-serif",
        fontWeight: 500,
        animations: { enabled: false },
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
        axisTicks: { show: false },
        labels: {
          show: true,
          rotate: 0,
          style: {
            fontFamily: "Raleway Variable, sans-serif",
            fontWeight: 500,
          },
        },
        categories: [], // Ensure categories array is initialized
      },
      yaxis: {
        min: 0,
        labels: {
          show: true,
          style: {
            fontFamily: "Raleway Variable, sans-serif",
            fontWeight: 500,
          },
          formatter: (val) => formatNumber(Math.floor(val)),
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "right",
        fontFamily: "Raleway Variable, sans-serif",
        fontWeight: 500,
        fontSize: "13px",
      },
      dataLabels: { enabled: false },
      stroke: { width: 1, curve: "straight" },
    },
    series: [], // Initialize with an empty array
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
        if (user.email !== user_email && !collabs?.includes(user.email)) {
          message.error("You do not have permission to update this record.");
          return;
        }

        dispatch(setPersonnelInputs(tempPersonnelInputs));

        const updatedInputData = {
          ...inputData,
          personnelInputs: tempPersonnelInputs,
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

  const [isInputFormOpen, setIsInputFormOpen] = useState(false);
  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  const calculatePersonnelByDepartment = () => {
    const departmentCount = tempPersonnelInputs.reduce((acc, input) => {
      if (input.department) {
        acc[input.department] =
          (acc[input.department] || 0) + input.numberOfHires;
      }
      return acc;
    }, {});

    const labels = Object.keys(departmentCount);
    const data = Object.values(departmentCount);

    return { labels, data };
  };

  useEffect(() => {
    const filteredSeries = tempPersonnelCostData.map((personnel) => ({
      name: personnel.jobTitle,
      data: personnel.monthlyCosts
        .slice(chartStartMonth - 1, chartEndMonth)
        .map((month) => month.cost),
    }));

    const totalPersonnelCostPerMonth = filteredSeries.reduce((acc, channel) => {
      channel.data.forEach((cost, index) => {
        if (!acc[index]) acc[index] = 0;
        acc[index] += cost;
      });
      return acc;
    }, []);

    setPersonnelChart((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
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
      series: [
        ...filteredSeries,
        { name: "Total", data: totalPersonnelCostPerMonth },
      ],
    }));

    const { labels, data } = calculatePersonnelByDepartment();

    setPersonnelChart((prevState) => ({
      ...prevState,
      pieChart: {
        options: {
          ...prevState.options,
          chart: {
            ...prevState.options.chart,
            id: "pieChart",
            stacked: false,
            type: "pie",
            toolbar: {
              show: true,
              tools: {
                download: true,
              },
            },
          },
          labels: labels, // Labels for pie chart

          legend: {
            position: "bottom",
            horizontalAlign: "right",
            fontFamily: "Raleway Variable, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
          },
        },
        series: data, // Series (data) for pie chart
      },
    }));
  }, [tempPersonnelCostData, chartStartMonth, chartEndMonth]);

  console.log("personnelChart", personnelChart);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const confirmDelete = () => {
    removePersonnelInput(renderPersonnelForm);
    setIsDeleteModalOpen(false);
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState(null);

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };
  console.log("selectedChart", selectedChart);
  const downloadExcel = () => {
    const workBook = XLSX.utils.book_new();

    // Create worksheet data in the desired format
    const worksheetData = [
      [
        "Personnel",
        ...Array.from({ length: numberOfMonths }, (_, i) => {
          const monthIndex = (startingMonth + i - 1) % 12;
          const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
          return `${months[monthIndex]}/${year}`;
        }),
      ],
    ];

    // Add rows for each channel
    personnelCostTableData.forEach((record) => {
      const row = [record.jobTitle];
      for (let i = 1; i <= numberOfMonths; i++) {
        row.push(record[`month${i}`] || "");
      }
      worksheetData.push(row);
    });

    // Convert data to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workBook, worksheet, "Personnel Cost Data");

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
      "personnel_data.xlsx"
    );
  };

  const downloadJSON = () => {
    // Filter out department data from personnelCostTableData
    const updatePersonnelCostTableData = personnelCostTableData.filter(
      (data) => !data.isDepartment
    );

    // Update personnel inputs with formatted job begin and end months
    const updatePersonnelInputs = tempPersonnelInputs.map((input) => {
      const monthIndexStart =
        (Number(startingMonth) + Number(input.jobBeginMonth) - 2) % 12;

      const yearStart =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.jobBeginMonth) - 2) / 12
        );

      const monthIndexEnd =
        (Number(startingMonth) + Number(input.jobEndMonth) - 2) % 12;
      const yearEnd =
        Number(startingYear) +
        Math.floor(
          (Number(startingMonth) + Number(input.jobEndMonth) - 2) / 12
        );

      return {
        ...input,
        jobBeginMonth: `${months[monthIndexStart]}/${yearStart}`,
        jobEndMonth: `${months[monthIndexEnd]}/${yearEnd}`,
      };
    });

    // Prepare data object to be saved
    const data = {
      personnelInputs: updatePersonnelInputs,
      updatePersonnelCostTableData,
    };

    // Create a JSON Blob and trigger download
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    saveAs(jsonBlob, "personnel_data.json");
  };

  const [visibleMetrics, setVisibleMetrics] = useState({
    numberOfPersonnel: true,
    totalSalaries: true,
    averageSalary: true,
  });

  const toggleMetric = (metric) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  const [metrics, setMetrics] = useState([
    {
      key: "numberOfPersonnel",
      title: "Number of Personnel",
      value: "",
      change: "",
      icon: Users,
    },
    {
      key: "totalSalaries",
      title: "Total Salaries",
      value: "",
      change: "",
      icon: DollarSign,
    },
    {
      key: "averageSalary",
      title: "Average Salary Per Month",
      value: "",
      change: "",
      icon: CalendarIcon,
    },
    // Add other metrics as necessary
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

  // Updated useEffect for calculating metrics
  useEffect(() => {
    const filteredPersonnelData = personnelCostTableData?.filter(
      (row) => !row.isDepartment && row.key !== "Total"
    );

    const numberOfPersonnel = filteredPersonnelData.length;
    if (renderPersonnelForm === "all") {
      // Calculate total cost across all months (sum up 'Total' row values)
      const totalCostRow = personnelCostTableData?.find(
        (row) => row.key === "Total"
      );

      let totalCost = 0;

      totalCost += extractData(
        totalCostRow,
        "month",
        chartStartMonth,
        chartEndMonth
      );

      const totalCostChange = calculateChange(
        personnelCostTableData
          .filter((row) => row.key.includes("Total"))
          .reduce(
            (acc, curr) => acc + parseNumber(curr[`month${chartStartMonth}`]),
            0
          ),
        personnelCostTableData
          .filter((row) => row.key.includes("Total"))
          .reduce(
            (acc, curr) => acc + parseNumber(curr[`month${chartEndMonth}`]),
            0
          )
      );

      const average = totalCost / (chartEndMonth - chartStartMonth + 1);

      // Update metrics for "all"
      setMetrics((prevMetrics) => [
        {
          ...prevMetrics[0],
          value: numberOfPersonnel,
          change: "",
        },
        {
          ...prevMetrics[1],
          value: formatNumber(totalCost),
          change: formatNumber(totalCostChange?.toFixed(2)),
        },
        {
          ...prevMetrics[2],
          value: formatNumber(average.toFixed(2)),
          change: "",
        },
      ]);
    } else {
      // Handle specific channel case (based on ID)
      const selectedData = tempPersonnelInputs.find(
        (input) => input.id == renderPersonnelForm
      );

      const filtered = filteredPersonnelData?.filter((data) =>
        data?.jobTitle?.includes(selectedData?.jobTitle)
      );
      if (filtered.length > 0 && filteredPersonnelData.length > 0) {
        const costData = extractData(
          filtered[0],
          "month",
          chartStartMonth,
          chartEndMonth
        );
        const average = costData / (chartEndMonth - chartStartMonth + 1);
        const costDataChange = calculateChange(
          parseNumber(filtered[0][`month${chartStartMonth}`]),
          parseNumber(filtered[0][`month${chartEndMonth}`])
        );

        // Update metrics for "all"
        setMetrics((prevMetrics) => [
          {
            ...prevMetrics[0],
            value: numberOfPersonnel,
            change: "",
          },
          {
            ...prevMetrics[1],
            value: formatNumber(costData.toFixed(2)),
            change: formatNumber(costDataChange?.toFixed(2)),
          },
          {
            ...prevMetrics[2],
            value: formatNumber(average.toFixed(2)),
            change: "",
          },
        ]);
      }
    }
  }, [
    chartStartMonth,
    chartEndMonth,
    renderPersonnelForm,
    tempPersonnelInputs,
  ]);

  const renderValue =
    tempPersonnelInputs.find((item) => item.id == renderPersonnelForm) || "all";

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
                setRenderPersonnelForm(e);
              }}
              className="w-full md:w-auto min-w-[10rem]"
            >
              <SelectTrigger className="w-full md:w-auto min-w-[10rem]">
                <SelectValue placeholder="Offline">
                  {renderValue.jobTitle ? renderValue.jobTitle : "All"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="w-full md:w-auto min-w-[10rem]">
                <SelectItem value="all">All</SelectItem>
                {tempPersonnelInputs.map((input) => (
                  <SelectItem key={input?.id} value={input?.id}>
                    {input?.jobTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center sm:space-x-4 space-x-0 sm:space-y-0 space-y-4 justify-start w-full md:w-auto sm:flex-row flex-col md:!mt-0 !mt-2">
              {/* Bộ chọn khoảng thời gian */}

              <div className="flex items-center space-x-4 justify-start w-full md:w-auto">
                <div className="min-w-[10vw] w-full flex flex-row sm:!mr-0 !mr-1">
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
                    -
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
                          ? `${metric.change}% from last period`
                          : ""}
                      </p>
                    </CardContent>
                  </CardShadcn>
                )
            )}
          </div>
        </section>
        {/* <h3 className="text-lg font-semibold mb-8">II. Personnel Cost Chart</h3> */}
        <div className="grid md:grid-cols-2 gap-6">
          <CardShadcn className="flex flex-col transition duration-500 !rounded-md relative">
            <CardHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50"
                onClick={(event) => handleChartClick(personnelChart, event)}
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
                  ...personnelChart.options,
                  stroke: {
                    width: 1,
                    curve: "straight",
                  },
                  xaxis: {
                    ...personnelChart.options.xaxis,
                  },
                }}
                series={personnelChart.series}
                type={
                  personnelChart?.options?.chart?.type
                    ? personnelChart?.options?.chart?.type
                    : "area"
                }
                height={350}
              />
            </CardContent>
          </CardShadcn>

          <CardShadcn className="flex flex-col transition duration-500 !rounded-md relative">
            <CardHeader>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-50"
                onClick={(event) =>
                  handleChartClick(personnelChart?.pieChart, event)
                }
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
            {personnelChart?.pieChart?.series?.length > 0 && (
              <CardContent>
                <Chart
                  options={{
                    ...personnelChart?.pieChart?.options,
                    fill: {
                      type: "gradient",
                      gradient: {
                        shade: "light",
                        shadeIntensity: 0.5,
                        opacityFrom: 0.75,
                        opacityTo: 0.65,
                        stops: [0, 90, 100],
                      },
                    },

                    stroke: {
                      width: 1,
                      curve: "straight",
                    },
                  }}
                  series={personnelChart?.pieChart?.series}
                  type={
                    personnelChart?.pieChart?.options?.chart?.type
                      ? personnelChart?.pieChart?.options?.chart?.type
                      : "area"
                  }
                  height={350}
                />
              </CardContent>
            )}
          </CardShadcn>

          <Modal
            zIndex={42424244}
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
                  ...selectedChart?.options,
                  fill: {
                    type: "gradient",
                    gradient: {
                      shade: "light",
                      shadeIntensity: 0.5,
                      opacityFrom: 0.75,
                      opacityTo: 0.65,
                      stops: [0, 90, 100],
                    },
                  },
                }}
                series={selectedChart.series}
                type={
                  selectedChart?.options?.chart?.type
                    ? selectedChart?.options?.chart?.type
                    : "area"
                }
                height={500}
                className="p-4"
              />
            )}
          </Modal>
        </div>
        <div className="flex justify-between items-center my-8 mt-20">
          {/* <h3 className="text-lg font-semibold">III. Personnel Cost Table</h3> */}
          <ButtonV0 variant="outline" onClick={downloadExcel}>
            <Download className="mr-2 h-4 w-4" />
            Download Excel
          </ButtonV0>
        </div>
        <Table
          className="custom-table bg-white overflow-auto my-8 rounded-md"
          size="small"
          dataSource={personnelCostTableData}
          columns={personnelCostColumns}
          pagination={false}
          bordered={false} // Tắt border mặc định của antd
          rowClassName={(record) =>
            record.key === "Total" || record.isDepartment === true
              ? "font-bold"
              : ""
          }
        />
      </div>

      <div className="relative w-full xl:w-1/4">
        <div className="!py-4 xl:!block !hidden border-white !sticky !top-28">
          <PersonnelInputForm
            tempPersonnelInputs={tempPersonnelInputs}
            renderPersonnelForm={renderPersonnelForm}
            setRenderPersonnelForm={setRenderPersonnelForm}
            handlePersonnelInputChange={handlePersonnelInputChange}
            formatNumber={formatNumber}
            parseNumber={parseNumber}
            addNewPersonnelInput={addNewPersonnelInput}
            handleSave={handleSave}
            isLoading={isLoading}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            numberOfMonths={numberOfMonths}
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
          zIndex={42424244}
          open={isInputFormOpen}
          onCancel={() => {
            setTempPersonnelInputs(personnelInputs);
            setIsInputFormOpen(false);
          }}
          footer={null}
          centered={true}
        >
          <PersonnelInputForm
            tempPersonnelInputs={tempPersonnelInputs}
            renderPersonnelForm={renderPersonnelForm}
            setRenderPersonnelForm={setRenderPersonnelForm}
            handlePersonnelInputChange={handlePersonnelInputChange}
            formatNumber={formatNumber}
            parseNumber={parseNumber}
            addNewPersonnelInput={addNewPersonnelInput}
            handleSave={handleSave}
            isLoading={isLoading}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
        </Modal>
      )}
      {isDeleteModalOpen && (
        <Modal
          zIndex={42424244}
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
      )}
    </div>
  );
};

export default PersonnelSection;
