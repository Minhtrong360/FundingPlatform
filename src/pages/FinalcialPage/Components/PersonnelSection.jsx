import { useCallback, useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Card, FloatButton, Modal, Table, message } from "antd";
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
import {
  DownloadOutlined,
  FileOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";
import SpinnerBtn from "../../../components/SpinnerBtn";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { setInputData } from "../../../features/DurationSlice";

import { Badge } from "../../../components/ui/badge";
import {
  Card as CardShadcn,
  CardHeader,
  CardContent,
} from "../../../components/ui/card";
import { Check, Download, Plus, Trash2 } from "lucide-react";
import { Button, Button as ButtonV0 } from "../../../components/ui/button";
import { debounce } from "lodash";

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

  return (
    <section
      aria-labelledby="personnel-heading"
      className="mb-8 NOsticky NOtop-8"
    >
      <h2
        className="text-lg font-semibold mb-8 flex items-center"
        id="personnel-heading"
      >
        Personnel
      </h2>

      <Select
        value={renderPersonnelForm}
        onValueChange={(e) => {
          setRenderPersonnelForm(e);
        }}
      >
        <SelectTrigger className="!rounded-2xl">
          <SelectValue placeholder="Offline" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {debouncedInputs.map((input) => (
            <SelectItem key={input?.id} value={input?.id}>
              {input?.jobTitle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {debouncedInputs
        .filter((input) => input?.id == renderPersonnelForm)
        .map((input) => (
          <div key={input?.id} className="bg-white rounded-2xl p-6 border my-4">
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
              <span className=" flex items-center text-sm">
                Job begin month
              </span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Job Begin Month"
                value={input.jobBeginMonth}
                onChange={(e) =>
                  handleInputChange(input.id, "jobBeginMonth", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <span className=" flex items-center text-sm">
                Job ending month
              </span>
              <Input
                className="col-start-2 border-gray-300"
                placeholder="Enter Job Ending Month"
                value={input.jobEndMonth}
                onChange={(e) =>
                  handleInputChange(input.id, "jobEndMonth", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
        type: "bar",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
          },
        },
        zoom: { enabled: false },
        fontFamily: "Raleway Variable, sans-serif",
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
          show: false,
        },
        labels: {
          show: true,
          rotate: 0,
          style: { fontFamily: "Raleway Variable, sans-serif" },
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
        min: 0,
        axisboder: {
          show: true,
        },
        labels: {
          show: true,
          style: { fontFamily: "Raleway Variable, sans-serif" },
          formatter: function (val) {
            return formatNumber(Math.floor(val));
          },
        },
        title: {
          text: "Salary ($)",
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
      stroke: { width: 1, curve: "straight" },
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
  }, [tempPersonnelCostData, chartStartMonth, chartEndMonth]);

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

  const [activeTab, setActiveTab] = useState("table&chart");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

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

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4">
      <div className="w-full xl:w-3/4 sm:!p-4 !p-0 ">
        <h3 className="text-lg font-semibold mb-8">I. Personnel Cost Chart</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <CardShadcn className="flex flex-col transition duration-500 rounded-2xl relative">
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
              <div className="flex justify-between items-center">
                <div className="min-w-[10vw] mb-2">
                  <label htmlFor="startMonthSelect" className="text-sm">
                    Start Month:
                  </label>
                  <select
                    id="startMonthSelect"
                    value={chartStartMonth}
                    onChange={(e) =>
                      setChartStartMonth(
                        Math.max(1, Math.min(e.target.value, chartEndMonth))
                      )
                    }
                    className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                  >
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startingMonth + i - 1) % 12;
                      const year =
                        startingYear + Math.floor((startingMonth + i - 1) / 12);
                      return (
                        <option key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="min-w-[10vw] mb-2">
                  <label htmlFor="endMonthSelect" className="text-sm">
                    End Month:
                  </label>
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
                    className="py-2 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  "
                  >
                    {Array.from({ length: numberOfMonths }, (_, i) => {
                      const monthIndex = (startingMonth + i - 1) % 12;
                      const year =
                        startingYear + Math.floor((startingMonth + i - 1) / 12);
                      return (
                        <option key={i + 1} value={i + 1}>
                          {`${months[monthIndex]}/${year}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
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
                type="area"
                height={350}
              />
            </CardContent>
          </CardShadcn>
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
                }}
                series={selectedChart.series}
                type="area"
                height={500}
                className="p-4"
              />
            )}
          </Modal>
        </div>
        <div className="flex justify-between items-center my-4 mt-20">
          <h3 className="text-lg font-semibold">II. Personnel Cost Table</h3>
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
          onCancel={() => {
            setTempPersonnelInputs(personnelInputs);
            setIsInputFormOpen(false);
          }}
          footer={null}
          centered={true}
          zIndex={50}
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
