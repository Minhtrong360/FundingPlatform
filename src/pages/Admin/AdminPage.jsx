import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import AnnouncePage from "../../components/AnnouncePage";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

import Header from "../Home/Header";
import { Badge, message, Table, Tabs, Tooltip } from "antd";
import {
  formatDate,
  getCurrencyLabelByKey,
} from "../../features/DurationSlice";
import { Switch, Space } from "antd";
import { Input, Button , InputNumber,Checkbox} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import moment from "moment";
import { formatNumber } from "../../features/CostSlice";
import Chart from "react-apexcharts";
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Updated Dashboard component in AdminPage to include an ApexChart for all table data

function Dashboard({ data }) {
  // Initialize filteredData to an empty array if data is not provided
  const [filteredData, setFilteredData] = useState(data || []);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Values'
        }
      }
    },
    series: [{
      name: 'Amount Raised',
      data: []
    }]
  });

  useEffect(() => {
    // Only proceed if filteredData is an array and has elements
    if (Array.isArray(filteredData) && filteredData.length > 0) {
      // Aggregate data for chart
      const countrySums = filteredData.reduce((acc, item) => {
        acc[item.country] = (acc[item.country] || 0) + item.amountRaised;
        return acc;
      }, {});

      const statusCounts = filteredData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});

      // Prepare series and categories for the chart
      const countryCategories = Object.keys(countrySums);
      const countrySeries = Object.values(countrySums);
      const statusCategories = Object.keys(statusCounts);
      const statusSeries = Object.values(statusCounts);

      setChartData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            categories: countryCategories.concat(statusCategories),
          },
        },
        series: [{
          name: 'Amount Raised',
          data: countrySeries.concat(statusSeries.map(s => s * 10000)) // Adjust if necessary
        }]
      }));
    }
  }, [filteredData]);

  return (
    <div>
      <button onClick={() => setFilteredData(data || [])}>Reset Filter</button>
      {chartData.series[0].data.length > 0 && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
}



function AdminPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState([]);
  
  useEffect(() => {
    async function fetchUsers() {
      // Thực hiện truy vấn để lấy danh sách người dùng với điều kiện trường email
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", user.email)
        .single(); // user.email là giá trị email của người dùng

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        setUserData(data);
      }
    }

    fetchUsers();
  }, [user]); // Sử dụng một lần khi component được render

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("*");
        const { data: companies, error: companiesError } = await supabase
          .from("company")
          .select("*");

        if (projectsError || companiesError) {
          throw new Error(projectsError || companiesError);
        } else {
          // Find project ids associated with companies
          const projectIds = companies.map((company) => company.project_id);

          // Filter projects by whether they have associated companies
          const filteredProjects = projects.filter((project) =>
            projectIds.includes(project.id)
          );

          // Sort filtered projects by created_at in descending order (from newest to oldest)
          filteredProjects.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          const combinedArray = [];

          // Duyệt qua mảng projects
          filteredProjects.forEach((project) => {
            // Tìm company tương ứng với project_id
            const company = companies.find(
              (company) => company.project_id === project.id
            );

            // Nếu tìm thấy company
            if (company) {
              // Kết hợp thông tin từ cả project và company vào một object mới
              const combinedObject = { ...project, ...company };

              // Thêm object kết hợp vào mảng tổng hợp
              combinedArray.push(combinedObject);
            }
          });
          setDataSource(combinedArray);
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    }

    fetchProjects();
  }, []);

  const navigate = useNavigate();
  const handleProjectClick = (project) => {
    navigate(`/founder/${project.project_id}`);
  };

  const handleVerifyToggle = async (project) => {
    // Update project verification status
    const { error } = await supabase
      .from("projects")
      .update({ verified: !project.verified })
      .eq("id", project.id);
    if (error) {
      console.error("Error updating project:", error.message);
      message.error(error.message);
    } else {
      // Update projects state with updated data
      setDataSource((prevProjects) =>
        prevProjects.map((prevProject) =>
          prevProject.id === project.id
            ? { ...prevProject, verified: !prevProject.verified }
            : prevProject
        )
      );
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (text, record, index) => (
        <div
          className={`  hover:cursor-pointer`}
          onClick={() => handleProjectClick(record)}
        >
          {index + 1}
        </div>
      ),
    },

    {
      title: "Company name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div
          className={`flex items-center  hover:cursor-pointer`}
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Name`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
              fontSize: "12px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          />
          <Space>
           
            <Button
              onClick={() => {
                clearFilters();
                confirm(); 
              }}
              size="small"
              style={{ width: 90, fontSize: "12px" }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
    },

    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => (
        <div onClick={() => handleProjectClick(record)}>{formatDate(text)}</div>
      ),
      ellipsis: true,
      width: "10%",
      align: "center",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={selectedKeys[0] ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])] : []}
            onChange={dates => {
              const range = dates ? [[dates[0].startOf('day').format('YYYY-MM-DD'), dates[1].endOf('day').format('YYYY-MM-DD')]] : [];
              setSelectedKeys(range);
              if (!dates) {
                clearFilters();
              } else {
                confirm(); // Confirm the filter immediately
              }
            }}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button onClick={() => {
            clearFilters();
            confirm(); 
          }} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.created_at);
        return date >= moment(start) && date <= moment(end);
      }
    }
    ,
    {
      title: "Customer",
      dataIndex: "user_email",
      key: "user_email",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Company Name`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
              fontSize: "12px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          />
          <Space>
           
            <Button
              onClick={() => {
                clearFilters();
                confirm(); 
              }}
              size="small"
              style={{ width: 90, fontSize: "12px" }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.user_email.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Required verification",
      key: "required",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
          className={`w-[5em] 
                ${record.required ? "text-blue-600" : " text-black-500"}
                focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md   py-1 text-center `}
        >
          {record.required && record.verified
            ? "Accepted"
            : record.required
            ? "Waiting..."
            : "No required"}
        </div>
      ),
      filters: [
        { text: "Accepted", value: "accepted" },
        { text: "Waiting", value: "waiting" },
        { text: "Not Required", value: "notRequired" }
      ],
      onFilter: (value, record) => {
        switch (value) {
          case "accepted":
            return record.required && record.verified;
          case "waiting":
            return record.required && !record.verified;
          case "notRequired":
            return !record.required;
        }
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          
          {["accepted", "waiting", "notRequired"].map((option) => (
            <div className="mb-2" key={option} style={{ marginTop: 8 }}>
              <Checkbox
                checked={selectedKeys.includes(option)}
                onChange={(e) => {
                  const keys = [...selectedKeys];
                  if (e.target.checked) {
                    keys.push(option);
                  } else {
                    const index = keys.indexOf(option);
                    if (index !== -1) {
                      keys.splice(index, 1);
                    }
                  }
                  setSelectedKeys(keys);
                  confirm(); // Confirm the filter change immediately
                }}
              >
                {option === "accepted" ? "Accepted" : option === "waiting" ? "Waiting" : "Not Required"}
              </Checkbox>
            </div>
          ))}
          <Button  onClick={() => {
            clearFilters();
            confirm(); // Confirm the filter clearing immediately
          }} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
    }
    ,
    {
      title: "Status",
      key: "status",
      render: (text, record) => (
        <div className="">
          <button
            onClick={() => handleProjectClick(record)}
            className={`w-[5em]  ${
              record?.status === "public"
                ? "bg-blue-600 text-white"
                : record?.status === "private"
                ? "bg-red-600 text-white"
                : record?.status === "stealth"
                ? "bg-yellow-300 text-black"
                : ""
            }   focus:ring-4 focus:outline-none focus:ring-blue-300  py-1 text-center rounded-md `}
          >
            {record?.status === "public"
              ? "Public"
              : record?.status === "private"
              ? "Private"
              : "Stealth"}
          </button>
        </div>
      ),
      filters: [
        { text: "Public", value: "public" },
        { text: "Private", value: "private" },
        { text: "Stealth", value: "stealth" }
      ],
      onFilter: (value, record) => record.status === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          
          {["public", "private", "stealth"].map((option) => (
            <div className="mb-2" key={option} style={{ marginTop: 8 }}>
              <Checkbox
                checked={selectedKeys.includes(option)}
                onChange={(e) => {
                  const keys = [...selectedKeys];
                  if (e.target.checked) {
                    keys.push(option);
                  } else {
                    const index = keys.indexOf(option);
                    if (index !== -1) {
                      keys.splice(index, 1);
                    }
                  }
                  setSelectedKeys(keys);
                  confirm(); // Confirm the filter change immediately
                }}
              >
                {option === "public" ? "Public" : option === "private" ? "Private" : "Stealth"}
              </Checkbox>
            </div>
          ))}
          <Button  onClick={() => {
            clearFilters();
            confirm(); // Confirm the filter clearing immediately
          }} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
    },
    {
      title: "Verified Status",
      key: "Verified",
      render: (text, record) => (
        <Space direction="vertical">
          <Switch
            className="text-black"
            checkedChildren="Yes"
            unCheckedChildren="No"
            value={record.verified}
            onClick={() => handleVerifyToggle(record)}
          />
        </Space>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false }
      ],
      onFilter: (value, record) => record.verified === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          confirm(); // Confirm the filter clearing immediately
        };
    
        return (
          <div className="mb-2" style={{ padding: 8 }}>
            
            {["true", "false"].map((option) => (
              <div key={option} style={{ marginTop: 8 }}>
                <Checkbox
                  checked={selectedKeys.includes(option)}
                  onChange={(e) => {
                    const keys = [...selectedKeys];
                    if (e.target.checked) {
                      keys.push(option);
                    } else {
                      const index = keys.indexOf(option);
                      if (index !== -1) {
                        keys.splice(index, 1);
                      }
                    }
                    setSelectedKeys(keys);
                    confirm(); // Confirm the filter change immediately
                  }}
                >
                  {option === "true" ? "Yes" : "No"}
                </Checkbox>
              </div>
            ))}
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      }
    }
,    
{
  title: "Target Amount",
  dataIndex: "target_amount",
  key: "target_amount",
  render: (text, record) => (
    <div
      className="whitespace-nowrap hover:cursor-pointer"
      onClick={() => handleProjectClick(record)}
    >
      {formatNumber(text)}
    </div>
  ),
  filters: [
    { text: "0-100", value: "0-100000" },
    { text: "100-500", value: "100000-500000" },
    { text: "500K-1M", value: "500000-1000000" },
    { text: "1M-5M", value: "1000000-5000000" },
    { text: ">5M", value: ">5000000" }
  ],
  onFilter: (value, record) => {
    const amount = parseFloat(record.target_amount);
    switch (value) {
      case "0-100000":
        return amount >= 0 && amount <= 100000;
      case "100000-500000":
        return amount > 100000 && amount <= 500000;
      case "500000-1000000":
        return amount > 500000 && amount <= 1000000;
      case "1000000-5000000":
        return amount > 1000000 && amount <= 5000000;
      case ">5000000":
        return amount > 5000000;
    }
  },
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const handleReset = () => {
      clearFilters();
      setSelectedKeys([]); // Reset selected keys
      confirm(); // Confirm the filter clearing immediately
    };

    return (
      <div className="mb-2" style={{ padding: 8 }}>
       
        {[
          "0-100000",
          "100000-500000",
          "500000-1000000",
          "1000000-5000000",
          ">5000000"
        ].map((option) => (
          <div key={option} style={{ marginTop: 8 }}>
            <Checkbox
              checked={selectedKeys.includes(option)}
              onChange={(e) => {
                const keys = [...selectedKeys];
                if (e.target.checked) {
                  keys.push(option);
                } else {
                  const index = keys.indexOf(option);
                  if (index !== -1) {
                    keys.splice(index, 1);
                  }
                }
                setSelectedKeys(keys);
                confirm(); // Confirm the filter change immediately
              }}
            >
              {option}
            </Checkbox>
          </div>
        ))}
         <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  }
}
,
{
  title: "Ticket Size",
  dataIndex: "ticket_size",
  key: "ticket_size",
  render: (text, record) => (
    <div
      className="whitespace-nowrap hover:cursor-pointer"
      onClick={() => handleProjectClick(record)}
    >
      {formatNumber(text)}
    </div>
  ),
  sorter: (a, b) => a.ticket_size - b.ticket_size,
  filters: [
    { text: "0-1000", value: "0-100" },
    { text: "1000-5000", value: "100-500" },
    { text: "5000-10000", value: "500-1000" },
    { text: "1000-50000", value: "1000-5000" },
    { text: ">50000", value: ">5000" }
  ],
  onFilter: (value, record) => {
    const size = parseFloat(record.ticket_size);
    switch (value) {
      case "0-100":
        return size >= 0 && size <= 1000;
      case "100-500":
        return size > 1000 && size <= 5000;
      case "500-1000":
        return size > 5000 && size <= 10000;
      case "1000-5000":
        return size > 10000 && size <= 50000;
      case ">5000":
        return size > 50000;
    }
  },
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const handleReset = () => {
      clearFilters();
      setSelectedKeys([]); // Reset selected keys
      confirm(); // Confirm the filter clearing immediately
    };

    return (
      <div style={{ padding: 8 }}>
       
        {[
          "0-100",
          "100-500",
          "500-1000",
          "1000-5000",
          ">5000"
        ].map((option) => (
          <div className="mb-2" key={option} style={{ marginTop: 8 }}>
            <Checkbox
              checked={selectedKeys.includes(option)}
              onChange={(e) => {
                const keys = [...selectedKeys];
                if (e.target.checked) {
                  keys.push(option);
                } else {
                  const index = keys.indexOf(option);
                  if (index !== -1) {
                    keys.splice(index, 1);
                  }
                }
                setSelectedKeys(keys);
                confirm(); // Confirm the filter change immediately
              }}
            >
              {option}
            </Checkbox>
          </div>
        ))}
         <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  }
}
,
    {
      title: "No. Ticket",
      dataIndex: "no_ticket",
      key: "no_ticket",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(text)}
        </div>
      ),
    },
    {
      title: "Offer Type",
      dataIndex: "offer_type",
      key: "offer_type",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
      filters: [
        { text: "M&A", value: "M&A" },
        { text: "Investment", value: "Investment" },
        { text: "Lending", value: "Lending" },
        { text: "Convertible", value: "Convertible" },
        { text: "Non-Profit", value: "Non-Profit" }
      ],
      onFilter: (value, record) => record.offer_type === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          confirm(); // Confirm the filter clearing immediately
        };
    
        return (
          <div style={{ padding: 8 }}>
           
            {[
              "M&A",
              "Investment",
              "Lending",
              "Convertible",
              "Non-Profit"
            ].map((option) => (
              <div className="mb-2" key={option} style={{ marginTop: 8 }}>
                <Checkbox
                  checked={selectedKeys.includes(option)}
                  onChange={(e) => {
                    const keys = [...selectedKeys];
                    if (e.target.checked) {
                      keys.push(option);
                    } else {
                      const index = keys.indexOf(option);
                      if (index !== -1) {
                        keys.splice(index, 1);
                      }
                    }
                    setSelectedKeys(keys);
                    confirm(); // Confirm the filter change immediately
                  }}
                >
                  {option}
                </Checkbox>
              </div>
            ))}
             <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      }
    }
,    
    {
      title: "Offer",
      dataIndex: "offer",
      key: "offer",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(text)}
        </div>
      ),
    },
    {
      title: "Amount Raised",
      dataIndex: "amountRaised",
      key: "amountRaised",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(text)}
        </div>
      ),
      filters: [
        { text: "0-100K", value: "0-100" },
        { text: "100K-500K", value: "100-500" },
        { text: "500K-1M", value: "500-1000" },
        { text: "1M-5M", value: "1000-5000" },
        { text: ">5M", value: ">5000" }
      ],
      onFilter: (value, record) => {
        const raised = parseFloat(record.amountRaised);
        switch (value) {
          case "0-100":
            return raised >= 0 && raised <= 100000;
          case "100-500":
            return raised > 100000 && raised <= 500000;
          case "500-1000":
            return raised > 500000 && raised <= 1000000;
          case "1000-5000":
            return raised > 1000000 && raised <= 5000000;
          case ">5000":
            return raised > 5000000;
        }
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          confirm(); // Confirm the filter clearing immediately
        };
    
        return (
          <div style={{ padding: 8 }}>
            
            {[
              "0-100",
              "100-500",
              "500-1000",
              "1000-5000",
              ">5000"
            ].map((option) => (
              <div className="mb-2" key={option} style={{ marginTop: 8 }}>
                <Checkbox
                  checked={selectedKeys.includes(option)}
                  onChange={(e) => {
                    const keys = [...selectedKeys];
                    if (e.target.checked) {
                      keys.push(option);
                    } else {
                      const index = keys.indexOf(option);
                      if (index !== -1) {
                        keys.splice(index, 1);
                      }
                    }
                    setSelectedKeys(keys);
                    confirm(); // Confirm the filter change immediately
                  }}
                >
                  {option}
                </Checkbox>
              </div>
            ))}
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      }
    }
,    
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Country`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
              fontSize: "12px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          />
          <Space>
           
            <Button
              onClick={() => {
                clearFilters();
                confirm(); 
              }}
              size="small"
              style={{ width: 90, fontSize: "12px" }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.country.toString().toLowerCase().includes(value.toLowerCase()),

    },
    {
      title: "Established",
      dataIndex: "operationTime",
      key: "operationTime",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
       
    },
    {
      title: "Revenue Range",
      dataIndex: "revenueStatus",
      key: "revenueStatus",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
      filters: [
        { text: "$0 - $10k", value: "$0 - $10k" },
        { text: "$10k - $50k", value: "$10k - $50k" },
        { text: "$50k - $100k", value: "$50k - $100k" },
        { text: "$100k - $500k", value: "$100k - $500k" },
        { text: "$500k - $1M", value: "$500k - $1M" },
        { text: "$1M - $5M", value: "$1M - $5M" },
        { text: ">$5M", value: ">$5M" },
        { text: "Non-Profit", value: "Non-Profit" },
      ],
      onFilter: (value, record) => record.revenueStatus === value,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          confirm(); // Confirm the filter clearing immediately
        };
    
        return (
          <div style={{ padding: 8 }}>
           
            {[
              "$0 - $10k",
              "$10k - $50k",
              "$50k - $100k",
              "$100k - $500k",
              "$500k - $1M",
              "$1M - $5M",
              ">$5M",
              "Non-Profit"
            ].map((option) => (
              <div className="mb-2" key={option} style={{ marginTop: 8 }}>
                <Checkbox
                  checked={selectedKeys.includes(option)}
                  onChange={(e) => {
                    const keys = [...selectedKeys];
                    if (e.target.checked) {
                      keys.push(option);
                    } else {
                      const index = keys.indexOf(option);
                      if (index !== -1) {
                        keys.splice(index, 1);
                      }
                    }
                    setSelectedKeys(keys);
                    confirm(); // Confirm the filter change immediately
                  }}
                >
                  {option}
                </Checkbox>
              </div>
            ))}
             <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      }
    }
,    
{
  title: "Round",
  dataIndex: "round",
  key: "round",
  render: (text, record) => (
    <div
      className="whitespace-nowrap hover:cursor-pointer"
      onClick={() => handleProjectClick(record)}
    >
      {text}
    </div>
  ),
  filters: [
    { text: "Seed", value: "Seed" },
    { text: "Pre-seed", value: "Pre-seed" },
    { text: "Series A", value: "Series A" },
    { text: "Series B", value: "Series B" },
    { text: "Series C", value: "Series C" },
    { text: "Non-Profit", value: "Non-Profit" },
  ],
  onFilter: (value, record) => record.round === value,
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const handleReset = () => {
      clearFilters();
      setSelectedKeys([]); // Reset selected keys
      confirm(); // Confirm the filter clearing immediately
    };

    return (
      <div style={{ padding: 8 }}>
       
        {[
          "Seed",
          "Pre-seed",
          "Series A",
          "Series B",
          "Series C",
          "Non-Profit"
        ].map((option) => (
          <div className="mb-2" key={option} style={{ marginTop: 8 }}>
            <Checkbox
              checked={selectedKeys.includes(option)}
              onChange={(e) => {
                const keys = [...selectedKeys];
                if (e.target.checked) {
                  keys.push(option);
                } else {
                  const index = keys.indexOf(option);
                  if (index !== -1) {
                    keys.splice(index, 1);
                  }
                }
                setSelectedKeys(keys);
                confirm(); // Confirm the filter change immediately
              }}
            >
              {option}
            </Checkbox>
          </div>
        ))}
         <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  }
}
,
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),

    },
    {
  title: "Industry",
  dataIndex: "industry",
  key: "industry",
  render: (text, record) => (
    <div
      className="whitespace-nowrap hover:cursor-pointer"
      onClick={() => handleProjectClick(record)}
    >
      {record?.industry?.map((industry, index) => (
        <Badge
          key={index}
          className="mx-2 bg-yellow-300 border border-gray-200 truncate text-black  inline-flex justify-center items-center gap-x-1 px-2 py-1 text-xs  text-center   rounded-3xl "
        >
          {industry}
        </Badge>
      ))}
    </div>
  ),
  filters: [
    { text: "Technology", value: "Technology" }, 
    { text:"E-commerce", value: "E-commerce" }, 
    { text:"Healthtech", value: "Healthtech" }, 
    { text:"Fintech", value: "Fintech" }, 
    { text:"Food & Beverage", value: "Food & Beverage" }, 
    { text:"Edtech", value: "Edtech" }, 
    { text:"Cleantech", value: "Cleantech" }, 
    { text:"AI & ML", value: "AI & ML" }, 
    { text:"Cybersecurity", value: "Cybersecurity" }, 
    { text:"PropTech", value: "PropTech" }, 
    { text:"Travel & Hospitality", value: "Travel & Hospitality" }, 
    { text:"Fashion & Apparel", value: "Fashion & Apparel" }, 
    { text:"IoT", value: "IoT" }, 
    { text:"Biotech", value: "Biotech" }, 
    { text:"Social Media", value: "Social Media" }, 
    { text:"Entertainment", value: "Entertainment" }, 
    { text:"Gaming", value: "Gaming" }, 
    { text:"Eco-friendly", value: "Eco-friendly" }, 
    { text:"Transportation", value: "Transportation" }, 
    { text:"Fitness & Wellness", value: "Fitness & Wellness" }, 
    { text:"Agtech", value: "Agtech" },
  ],
  onFilter: (value, record) => record.industry.includes(value),
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
    const handleReset = () => {
      clearFilters();
      setSelectedKeys([]); // Reset selected keys
      confirm(); // Confirm the filter clearing immediately
    };

    return (
      <div style={{ padding: 8 }}>
       
        {[
          "Technology", 
          "E-commerce", 
          "Healthtech", 
          "Fintech", 
          "Food & Beverage", 
          "Edtech", 
          "Cleantech", 
          "AI & ML", 
          "Cybersecurity", 
          "PropTech", 
          "Travel & Hospitality", 
          "Fashion & Apparel", 
          "IoT", 
          "Biotech", 
          "Social Media", 
          "Entertainment", 
          "Gaming", 
          "Eco-friendly", 
          "Transportation", 
          "Fitness & Wellness", 
          "Agtech"
        ].map((option) => (
          <div className="mb-2" key={option} style={{ marginTop: 8 }}>
            <Checkbox
              checked={selectedKeys.includes(option)}
              onChange={(e) => {
                const keys = [...selectedKeys];
                if (e.target.checked) {
                  keys.push(option);
                } else {
                  const index = keys.indexOf(option);
                  if (index !== -1) {
                    keys.splice(index, 1);
                  }
                }
                setSelectedKeys(keys);
                confirm(); // Confirm the filter change immediately
              }}
            >
              {option}
            </Checkbox>
          </div>
        ))}
         <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    );
  }
}
,
    {
      title: "Keywords",
      dataIndex: "keyWords",
      key: "keyWords",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {record?.keyWords &&
            record.keyWords.split(",").map((keyWord, index) => (
              <Badge
                key={index}
                className="mx-2 bg-yellow-300 border border-gray-200 truncate text-black inline-flex justify-center items-center gap-x-1 px-2 py-1 text-xs text-center rounded-3xl"
              >
                {keyWord.trim()}
              </Badge>
            ))}
        </div>
      ),
    },
  ];

  const handleFinanceClick = async (finance) => {
    navigate(`/financials/${finance.id}`);
  };

  const financialColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleFinanceClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search Name`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => confirm()}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
              fontSize: "12px",
              paddingTop: "2px",
              paddingBottom: "2px",
            }}
          />
          <Space>
           
            <Button
              onClick={() => {
                clearFilters();
                confirm(); 
              }}
              size="small"
              style={{ width: 90, fontSize: "12px" }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.name.toString().toLowerCase().includes(value.toLowerCase()),
    },

 
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer"
          onClick={() => handleFinanceClick(record)}
        >
          {formatDate(record.created_at)}
        </span>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={selectedKeys[0] ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])] : []}
            onChange={dates => {
              const range = dates ? [[dates[0].startOf('day').format('YYYY-MM-DD'), dates[1].endOf('day').format('YYYY-MM-DD')]] : [];
              setSelectedKeys(range);
              if (!dates) {
                clearFilters();
              } else {
                confirm(); // Confirm the filter immediately
              }
            }}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button onClick={() => {
            clearFilters();
            confirm(); 
          }} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.created_at);
        return date >= moment(start) && date <= moment(end);
      }
    
    },
    {
      title: "Owner",
      dataIndex: "user_email",
      key: "user_email",
      width: "25%",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleFinanceClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.user_email}
            >
              {record.user_email}
            </div>
          </span>
        </>
      ),
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <>
          <button onClick={() => handleFinanceClick(record)}>
            {record?.inputData?.industry
              ? record?.inputData?.industry
              : "Waiting for setup"}
          </button>
        </>
      ),
    },
    {
      title: "Duration",
      dataIndex: "selectedDuration",
      key: "selectedDuration",
      render: (text, record) => (
        <div
          onClick={() => handleFinanceClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.selectedDuration
            ? record?.inputData?.selectedDuration
            : "Waiting for setup"}
        </div>
      ),
    },
    {
      title: "Start year",
      dataIndex: "startYear",
      key: "startYear",
      render: (text, record) => (
        <div
          onClick={() => handleFinanceClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.startMonth && record?.inputData?.startYear ? (
            <>
              {record?.inputData?.startMonth < 10
                ? `0${record?.inputData?.startMonth}`
                : record?.inputData?.startMonth}{" "}
              - {record?.inputData?.startYear}
            </>
          ) : (
            "Waiting for setup"
          )}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <Tooltip title="Customer of 1st year">
          <div
            onClick={() => handleFinanceClick(record)}
            className="flex justify-end items-end hover:cursor-pointer"
          >
            {record?.inputData?.yearlyAverageCustomers
              ? formatNumber(record?.inputData?.yearlyAverageCustomers[0])
              : "Waiting for setup"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "Revenue",
      key: "Revenue",

      render: (text, record) => (
        <Tooltip title="Revenue of 1st year">
          <div
            className="flex justify-end items-end hover:cursor-pointer"
            onClick={() => handleFinanceClick(record)}
          >
            {record?.inputData?.yearlySales
              ? `${getCurrencyLabelByKey(
                  record?.inputData?.currency
                )}${formatNumber(record?.inputData?.yearlySales[0])}`
              : "Waiting for setup"}
          </div>
        </Tooltip>
      ),
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   key: "action",
    //   render: (text, record) => (
    //     <Button
    //       onClick={() => handleDelete(record.id)}
    //       style={{ fontSize: "12px" }}
    //       className="hover:cursor-pointer bg-red-500 text-white"
    //     >
    //       Delete
    //     </Button>
    //   ),
    // },
  ];

  const [dataFinanceSource, setDataFinanceSource] = useState([]);

  useEffect(() => {
    // Tải danh sách finance từ Supabase dựa trên user.id
    const loadFinances = async () => {
      const { data, error } = await supabase.from("finance").select("*");

      if (error) {
        message.error(error.message);
        console.error("Lỗi khi tải danh sách finance:", error.message);
      } else {
        // Chuyển đổi inputData của mỗi đối tượng từ chuỗi JSON thành đối tượng JavaScript
        let transformedData = data.map((item) => ({
          ...item,
          inputData: JSON.parse(item.inputData),
        }));

        setDataFinanceSource(transformedData);
      }
    };

    loadFinances();
  }, [user.id]);
  const [activeTab, setActiveTab] = useState("fundraising");

  return (
    <main className="w-full my-28">
      <Header />

      {userData.admin === true && (
        <div className="flex justify-center mx-auto">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <TabPane tab="Fundraising projects" key="fundraising">
              <section className="container px-4 mx-auto mt-8">
                <div className="flex flex-col">
                  <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden md:rounded-md">
                        <Table
                          columns={columns}
                          dataSource={dataSource}
                          pagination={false}
                          rowKey="id"
                          size="small"
                          scroll={{ x: "max-content" }}
                          bordered
                        />
                        <Dashboard  />
                      </div>

                    </div>
                  </div>
                </div>
              </section>
            </TabPane>
            <TabPane tab="Financial projects" key="financial">
              <section className="container px-4 mx-auto mt-8">
                <div className="flex flex-col">
                  <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden md:rounded-md">
                        <Table
                          columns={financialColumns}
                          dataSource={dataFinanceSource}
                          pagination={false}
                          rowKey="id"
                          size="small"
                          scroll={{ x: "max-content" }}
                          bordered
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabPane>
          </Tabs>
        </div>
      )}
      {userData.admin === false && (
        <AnnouncePage
          title="Admin Page"
          announce="Admin Page"
          describe="Only for admin"
        />
      )}
    </main>
  );
}

export default AdminPage;
