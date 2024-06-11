import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Badge, Dropdown, Menu, message, Modal, Radio, Tooltip } from "antd";
import {
  formatDate,
  getCurrencyLabelByKey,
} from "../../features/DurationSlice";
import { Switch, Space } from "antd";
import { Input, Button, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import moment from "moment";
import { formatNumber } from "../../features/CostSlice";
import industries from "../../components/Industries";
import SideBar from "../../components/SideBar";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import Tabs from "./Components/Tabs";
const { RangePicker } = DatePicker;

function AdminPage() {
  const [dataSource, setDataSource] = useState([]);
  const [dataClientSource, setDataClientSource] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      setIsLoading(true);
      try {
        // Thực hiện truy vấn để lấy danh sách người dùng với điều kiện trường email
        const { data, error } = await supabase.from("users").select("*");

        if (error) {
          console.error("Error fetching users:", error.message);
        } else {
          // Sắp xếp data theo created_at từ mới nhất đến cũ nhất
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setDataClientSource(data);
        }
      } catch (error) {
        message.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, []); // Sử dụng một lần khi component được render

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
        message.error(error);
      } finally {
        setIsLoading(false);
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
      .eq("id", project.project_id);

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

  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({});

  const applyFilters = () => {
    let filtered = [...dataSource];
    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        if (key === "requiredVerification") {
          filtered = filtered.filter((record) => {
            if (filters[key].length === 1) {
              const filterKey = filters[key][0];
              if (filterKey === "accepted") {
                return record.required && record.verified;
              } else if (filterKey === "waiting") {
                return record.required && !record.verified;
              } else if (filterKey === "notRequired") {
                return !record.required;
              }
            } else if (filters[key].length === 2) {
              const key1 = filters[key][0];
              const key2 = filters[key][1];
              if (
                (key1 === "accepted" && key2 === "waiting") ||
                (key1 === "waiting" && key2 === "accepted")
              ) {
                return record.required && (record.verified || !record.verified);
              } else if (
                (key1 === "accepted" && key2 === "notRequired") ||
                (key1 === "notRequired" && key2 === "accepted")
              ) {
                return (record.required && record.verified) || !record.required;
              } else if (
                (key1 === "waiting" && key2 === "notRequired") ||
                (key1 === "notRequired" && key2 === "waiting")
              ) {
                return (
                  (record.required && !record.verified) || !record.required
                );
              }
            }
            if (filters[key].length === 3) {
              return record.required || record.verified || !record.required;
            }

            return false;
          });
        } else if (key === "verified") {
          filtered = filtered.filter(
            (record) => record.verified === filters[key][0]
          );
        } else if (key === "target_amount") {
          filtered = filtered.filter((record) => {
            return filters[key].some((filterKey) => {
              let [min, max] = filterKey.split("-");
              if (!max) {
                min = 5000000;
              }

              const amount = parseFloat(record.target_amount);
              if (max) {
                return amount >= parseFloat(min) && amount <= parseFloat(max);
              } else {
                return amount >= parseFloat(min);
              }
            });
          });
        } else if (key === "ticket_size") {
          filtered = filtered.filter((record) => {
            return filters[key].some((filterKey) => {
              let [min, max] = filterKey.split("-");
              if (!max) {
                min = 50000;
              }
              const amount = parseFloat(record.ticket_size);
              if (max) {
                return amount >= parseFloat(min) && amount <= parseFloat(max);
              } else {
                return amount >= parseFloat(min);
              }
            });
          });
        } else if (
          key === "offer_type" ||
          key === "revenueStatus" ||
          key === "status" ||
          key === "round" ||
          key === "industry"
        ) {
          filtered = filtered.filter((record) =>
            filters[key].some((filterKey) => record[key].includes(filterKey))
          );
        } else if (key === "amountRaised") {
          filtered = filtered.filter((record) => {
            return filters[key].some((filterKey) => {
              let [min, max] = filterKey.split("-");
              if (!max) {
                min = 5000000;
              }
              const amount = parseFloat(record.amountRaised);
              if (max) {
                return amount >= parseFloat(min) && amount <= parseFloat(max);
              } else {
                return amount >= parseFloat(min);
              }
            });
          });
        } else {
          filtered = filtered.filter((item) =>
            item[key].toLowerCase().includes(filters[key][0].toLowerCase())
          );
        }
      }
    });
    setFilteredData(filtered);
  };

  const handleFilterChange = (key, values) => {
    const newFilters = { ...filters, [key]: values };
    setFilters(newFilters);
  };

  useEffect(() => {
    applyFilters();
  }, [dataSource, filters]);

  const columns = [
    {
      title: "No",
      key: "index",
      align: "center",
      fixed: "left",
      render: (text, record, index) => (
        <span
          className={`  hover:cursor-pointer text-left`}
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {dataSource?.indexOf(record) + 1}
        </span>
      ),
    },

    {
      title: "Company name",
      dataIndex: "name",
      width: "25%",
      key: "name",
      align: "center",
      fixed: "left",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer text-left"
            onClick={() => handleProjectClick(record)}
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
            autoFocus
            placeholder={`Search Name`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => {
              handleFilterChange("name", selectedKeys);
              confirm();
            }}
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
                handleFilterChange("name", []);
                confirm();

                // setFilteredData(dataSource);
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

      align: "center",
      render: (text, record) => (
        <span onClick={() => handleProjectClick(record)}>
          {formatDate(text)}
        </span>
      ),

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={
              selectedKeys[0]
                ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
                : []
            }
            onChange={(dates) => {
              const range = dates
                ? [
                    [
                      dates[0].startOf("day").format("YYYY-MM-DD"),
                      dates[1].endOf("day").format("YYYY-MM-DD"),
                    ],
                  ]
                : [];
              setSelectedKeys(range);
              if (!dates) {
                clearFilters();
              } else {
                confirm(); // Confirm the filter immediately
              }
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.created_at);
        return date >= moment(start) && date <= moment(end);
      },
    },
    {
      title: "Customer",
      dataIndex: "user_email",
      key: "user_email",
      align: "center",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer text-left"
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
            onPressEnter={() => {
              handleFilterChange("user_email", selectedKeys);
              confirm();
            }}
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
                handleFilterChange("user_email", []);
                confirm();

                // setFilteredData(dataSource);
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
        record.user_email
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Required verification",
      key: "required",
      align: "center",
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
        { text: "Not Required", value: "notRequired" },
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
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
                  handleFilterChange("requiredVerification", keys);
                  confirm();
                }}
              >
                {option === "accepted"
                  ? "Accepted"
                  : option === "waiting"
                    ? "Waiting"
                    : "Not Required"}
              </Checkbox>
            </div>
          ))}
          <Button
            onClick={() => {
              clearFilters();
              handleFilterChange("requiredVerification", []);

              confirm();
              // setFilteredData(dataSource); // Confirm the filter clearing immediately
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (text, record) => (
        <div className="">
          <button
            onClick={() => handleProjectClick(record)}
            className={`w-[5em] text-left ${
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
        { text: "Stealth", value: "stealth" },
      ],
      onFilter: (value, record) => record.status === value,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
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
                  handleFilterChange("status", keys);
                  confirm();
                }}
              >
                {option === "public"
                  ? "Public"
                  : option === "private"
                    ? "Private"
                    : "Stealth"}
              </Checkbox>
            </div>
          ))}
          <Button
            onClick={() => {
              clearFilters();
              handleFilterChange("status", []);
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    },
    {
      title: "Verified Status",
      key: "Verified",
      align: "center",
      render: (text, record) => (
        <Space direction="vertical">
          <Switch
            className="text-black "
            checkedChildren="Yes"
            unCheckedChildren="No"
            checked={record.verified}
            onClick={() => handleVerifyToggle(record)}
          />
        </Space>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.verified === value,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("verified", []);

          confirm();
        };

        return (
          <div className="mb-2" style={{ padding: 8 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Checkbox
                className="my-1"
                checked={selectedKeys.includes(true)}
                onChange={(e) => {
                  const keys = e.target.checked ? [true] : [];
                  setSelectedKeys(keys);
                  handleFilterChange("verified", keys);
                  confirm();
                }}
              >
                Yes
              </Checkbox>
              <Checkbox
                className="my-1"
                checked={selectedKeys.includes(false)}
                onChange={(e) => {
                  const keys = e.target.checked ? [false] : [];
                  setSelectedKeys(keys);
                  handleFilterChange("verified", keys);

                  confirm();
                }}
              >
                No
              </Checkbox>
            </div>
            <Button
              className="my-1"
              onClick={handleReset}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        );
      },
    },

    {
      title: "Target Amount",
      dataIndex: "target_amount",
      key: "target_amount",
      align: "center",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer text-right"
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
        { text: ">5M", value: ">5000000" },
      ],
      onFilter: (value, record) => {
        const amount = parseFloat(record.target_amount);
        switch (value) {
          case "0-100000":
            return amount >= 0 && amount <= 100000;
          case "100000-500000":
            return amount >= 100000 && amount <= 500000;
          case "500000-1000000":
            return amount >= 500000 && amount <= 1000000;
          case "1000000-5000000":
            return amount >= 1000000 && amount <= 5000000;
          case ">5000000":
            return amount >= 5000000;
        }
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("target_amount", []);
          confirm(); // Confirm the filter clearing immediately
        };

        return (
          <div className="mb-2" style={{ padding: 8 }}>
            {[
              "0-100000",
              "100000-500000",
              "500000-1000000",
              "1000000-5000000",
              ">5000000",
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
                    handleFilterChange("target_amount", keys);
                    confirm();
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
      },
    },
    {
      title: "Ticket Size",
      dataIndex: "ticket_size",
      key: "ticket_size",
      align: "center",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer text-right"
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(text)}
        </div>
      ),
      sorter: (a, b) => a.ticket_size - b.ticket_size,
      filters: [
        { text: "0-1000", value: "0-1000" },
        { text: "1000-5000", value: "1000-5000" },
        { text: "5000-10000", value: "5000-10000" },
        { text: "1000-50000", value: "10000-50000" },
        { text: ">50000", value: ">50000" },
      ],
      onFilter: (value, record) => {
        const size = parseFloat(record.ticket_size);
        switch (value) {
          case "0-1000":
            return size >= 0 && size <= 1000;
          case "1000-5000":
            return size >= 1000 && size <= 5000;
          case "5000-10000":
            return size >= 5000 && size <= 10000;
          case "10000-50000":
            return size >= 10000 && size <= 50000;
          case ">50000":
            return size >= 50000;
        }
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("ticket_size", []);
          confirm(); // Confirm the filter clearing immediately
        };

        return (
          <div style={{ padding: 8 }}>
            {["0-1000", "1000-5000", "5000-10000", "10000-50000", ">50000"].map(
              (option) => (
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
                      handleFilterChange("ticket_size", keys);
                      confirm();
                    }}
                  >
                    {option}
                  </Checkbox>
                </div>
              )
            )}
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      },
    },
    {
      title: "No. Ticket",
      dataIndex: "no_ticket",
      key: "no_ticket",
      align: "center",
      render: (text, record) => (
        <div
          className=" whitespace-nowrap hover:cursor-pointer text-right"
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
      align: "center",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer text-left"
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
        { text: "Non-Profit", value: "Non-Profit" },
      ],
      onFilter: (value, record) => record.offer_type === value,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("offer_type", []);
          confirm(); // Confirm the filter clearing immediately
        };

        return (
          <div style={{ padding: 8 }}>
            {["M&A", "Investment", "Lending", "Convertible", "Non-Profit"].map(
              (option) => (
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
                      handleFilterChange("offer_type", keys);

                      confirm(); // Confirm the filter change immediately
                    }}
                  >
                    {option}
                  </Checkbox>
                </div>
              )
            )}
            <Button onClick={handleReset} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        );
      },
    },
    {
      title: "Offer",
      dataIndex: "offer",
      key: "offer",
      align: "center",
      render: (text, record) => (
        <Tooltip title={text}>
          <div
            className=" whitespace-nowrap hover:cursor-pointer md:max-w-xl max-w-xs truncate text-left"
            onClick={() => handleProjectClick(record)}
          >
            {formatNumber(text)}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Amount Raised",
      dataIndex: "amountRaised",
      key: "amountRaised",
      align: "center",
      render: (text, record) => (
        <div
          className="whitespace-nowrap hover:cursor-pointer text-right"
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
        { text: ">5M", value: ">5000000" },
      ],
      onFilter: (value, record) => {
        const amount = parseFloat(record.amountRaised);
        switch (value) {
          case "0-100000":
            return amount >= 0 && amount <= 100000;
          case "100000-500000":
            return amount >= 100000 && amount <= 500000;
          case "500000-1000000":
            return amount >= 500000 && amount <= 1000000;
          case "1000000-5000000":
            return amount >= 1000000 && amount <= 5000000;
          case ">5000000":
            return amount >= 5000000;
        }
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("amountRaised", []);
          confirm(); // Confirm the filter clearing immediately
        };

        return (
          <div className="mb-2" style={{ padding: 8 }}>
            {[
              "0-100000",
              "100000-500000",
              "500000-1000000",
              "1000000-5000000",
              ">5000000",
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
                    handleFilterChange("amountRaised", keys);

                    confirm();
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
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      align: "center",
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
            onPressEnter={() => {
              handleFilterChange("country", selectedKeys);
              confirm();
              if (selectedKeys.length > 0) {
                const filtered = dataSource?.filter((record) =>
                  record?.country
                    ?.toLowerCase()
                    .includes(selectedKeys[0]?.toLowerCase())
                );
                setFilteredData(filtered);
              } else {
                setFilteredData(dataSource);
              }
            }}
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
                handleFilterChange("country", []);

                confirm();
                // setFilteredData(dataSource);
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
      align: "center",
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
      align: "center",
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("revenueStatus", []);
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
              "Non-Profit",
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
                    handleFilterChange("revenueStatus", keys);
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
      },
    },
    {
      title: "Round",
      dataIndex: "round",
      key: "round",
      align: "center",
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
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("round", []);
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
              "Non-Profit",
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
                    handleFilterChange("round", keys);

                    confirm();
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
      },
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      align: "center",

      render: (text, record) => (
        <Tooltip title={text}>
          <div
            className=" whitespace-nowrap hover:cursor-pointer md:max-w-sm max-w-sm truncate text-left"
            onClick={() => handleProjectClick(record)}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: (
        <span className="flex justify-center items-center">Industry </span>
      ),
      dataIndex: "industry",
      key: "industry",

      render: (text, record) => (
        <span
          className="whitespace-nowrap hover:cursor-pointer md:max-w-sm max-w-sm truncate" // Căn trái nội dung
          onClick={() => handleProjectClick(record)}
        >
          {record?.industry?.map((industry, index) => (
            <Badge
              key={index}
              className="mx-2 bg-yellow-300 border border-gray-300 truncate text-black  inline-flex justify-start items-start gap-x-1 px-2 py-1 text-xs  text-center   rounded-3xl "
            >
              {industry}
            </Badge>
          ))}
        </span>
      ),
      filters: [
        { text: "Technology", value: "Technology" },
        { text: "E-commerce", value: "E-commerce" },
        { text: "Healthtech", value: "Healthtech" },
        { text: "Fintech", value: "Fintech" },
        { text: "Food & Beverage", value: "Food & Beverage" },
        { text: "Edtech", value: "Edtech" },
        { text: "Cleantech", value: "Cleantech" },
        { text: "AI & ML", value: "AI & ML" },
        { text: "Cybersecurity", value: "Cybersecurity" },
        { text: "PropTech", value: "PropTech" },
        { text: "Travel & Hospitality", value: "Travel & Hospitality" },
        { text: "Fashion & Apparel", value: "Fashion & Apparel" },
        { text: "IoT", value: "IoT" },
        { text: "Biotech", value: "Biotech" },
        { text: "Social Media", value: "Social Media" },
        { text: "Entertainment", value: "Entertainment" },
        { text: "Gaming", value: "Gaming" },
        { text: "Eco-friendly", value: "Eco-friendly" },
        { text: "Transportation", value: "Transportation" },
        { text: "Fitness & Wellness", value: "Fitness & Wellness" },
        { text: "Agtech", value: "Agtech" },
      ],
      onFilter: (value, record) => record.industry.includes(value),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const handleReset = () => {
          clearFilters();
          setSelectedKeys([]); // Reset selected keys
          handleFilterChange("industry", []);
          confirm(); // Confirm the filter clearing immediately
        };

        return (
          <div style={{ padding: 8 }}>
            {industries.map((option) => (
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
                    handleFilterChange("industry", keys);

                    confirm();
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
      },
    },
    {
      title: (
        <span className="flex justify-center items-center">Key words </span>
      ),
      dataIndex: "keyWords",
      key: "keyWords",

      render: (text, record) => (
        <span
          className=" whitespace-nowrap hover:cursor-pointer md:max-w-sm max-w-sm truncate"
          onClick={() => handleProjectClick(record)}
        >
          {record?.keyWords &&
            record.keyWords.split(",").map((keyWord, index) => (
              <Badge
                key={index}
                className="mx-2 bg-yellow-300 border border-gray-300 truncate text-black inline-flex justify-center items-center gap-x-1 px-2 py-1 text-xs text-center rounded-3xl"
              >
                {keyWord.trim()}
              </Badge>
            ))}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",

      render: (text, record) => (
        <Button
          onClick={() => handleDelete(record.project_id)}
          style={{ fontSize: "12px" }}
          className="hover:cursor-pointer bg-red-500 text-white"
        >
          Delete
        </Button>
      ),
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SelectedID, setSelectedID] = useState();

  const handleDelete = async (projectId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteModalOpen(true);
    // Lưu projectId của dự án cần xóa
    setSelectedID(projectId);
  };

  // Hàm xác nhận xóa dự án
  const confirmDelete = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", SelectedID);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedProjectsCopy = dataSource.filter(
          (project) => project.project_id !== SelectedID
        );
        setDataSource(updatedProjectsCopy);

        message.success("Deleted project.");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
    } finally {
      // Đóng modal sau khi xóa hoặc xảy ra lỗi
      setIsDeleteModalOpen(false);
      setSelectedID("");
    }
  };

  // Hàm hủy bỏ xóa dự án
  const cancelDelete = () => {
    // Đóng modal và không làm gì cả
    setIsDeleteModalOpen(false);
    setSelectedID("");
  };

  const handleFinanceClick = async (finance) => {
    navigate(`/financials/${finance.id}`);
  };

  const financialColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{dataFinanceSource?.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer text-left"
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
            onPressEnter={() => {
              confirm();
              const filtered = dataSource?.filter((record) =>
                record?.name
                  ?.toLowerCase()
                  .includes(selectedKeys[0]?.toLowerCase())
              );
              setFilteredData(filtered);
            }}
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
                setFilteredData(dataSource);
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
      align: "center",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer"
          onClick={() => handleFinanceClick(record)}
        >
          {formatDate(record.created_at)}
        </span>
      ),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={
              selectedKeys[0]
                ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
                : []
            }
            onChange={(dates) => {
              const range = dates
                ? [
                    [
                      dates[0].startOf("day").format("YYYY-MM-DD"),
                      dates[1].endOf("day").format("YYYY-MM-DD"),
                    ],
                  ]
                : [];
              setSelectedKeys(range);
              if (!dates) {
                clearFilters();
              } else {
                confirm();
              }
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => {
              clearFilters();
              confirm();
              setFilteredData(dataSource);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.created_at);
        return date >= moment(start) && date <= moment(end);
      },
    },
    {
      title: "Owner",
      dataIndex: "user_email",
      key: "user_email",
      width: "20",
      align: "center",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer text-left"
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
      align: "center",
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
      align: "center",
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
      align: "center",
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
      align: "center",
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

      align: "center",
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",

      render: (text, record) => (
        <Button
          onClick={() => handleFinancialDelete(record.id)}
          style={{ fontSize: "12px" }}
          className="hover:cursor-pointer bg-red-500 text-white"
        >
          Delete
        </Button>
      ),
    },
  ];

  const clientColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{dataClientSource?.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Full name",
      dataIndex: "full_name",
      key: "full_name",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <Tooltip title={record.full_name}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.full_name ? record.full_name : "No provided"}
            </div>
          </span>
        </Tooltip>
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
            onPressEnter={() => {
              confirm();
              const filtered = dataClientSource?.filter((record) =>
                record?.full_name
                  ?.toLowerCase()
                  .includes(selectedKeys[0]?.toLowerCase())
              );
              setFilteredData(filtered);
            }}
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
                setFilteredData(dataClientSource);
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
        record.full_name
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      align: "center",
      render: (text, record) => (
        <Tooltip title={record.email}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.email}
            </div>
          </span>
        </Tooltip>
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
            onPressEnter={() => {
              confirm();
              const filtered = dataClientSource?.filter((record) =>
                record?.email
                  ?.toLowerCase()
                  .includes(selectedKeys[0]?.toLowerCase())
              );
              setFilteredData(filtered);
            }}
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
                setFilteredData(dataClientSource);
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
        record.email?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",

      align: "center",
      render: (text, record) => <span>{formatDate(text)}</span>,

      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={
              selectedKeys[0]
                ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
                : []
            }
            onChange={(dates) => {
              const range = dates
                ? [
                    [
                      dates[0].startOf("day").format("YYYY-MM-DD"),
                      dates[1].endOf("day").format("YYYY-MM-DD"),
                    ],
                  ]
                : [];
              setSelectedKeys(range);
              if (!dates) {
                clearFilters();
              } else {
                confirm(); // Confirm the filter immediately
              }
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        const [start, end] = value;
        const date = moment(record.created_at);
        return date >= moment(start) && date <= moment(end);
      },
    },
    {
      title: "Roll",
      dataIndex: "roll",
      key: "roll",

      align: "center",
      render: (text, record) => (
        <Tooltip title={record.roll}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.roll ? record.roll : "No provided"}
            </div>
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",

      align: "center",
      render: (text, record) => (
        <Tooltip title={record.plan}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.plan}
            </div>
          </span>
        </Tooltip>
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
            onPressEnter={() => {
              confirm();
              const filtered = dataClientSource?.filter((record) =>
                record?.plan
                  ?.toLowerCase()
                  .includes(selectedKeys[0]?.toLowerCase())
              );
              setFilteredData(filtered);
            }}
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
                setFilteredData(dataClientSource);
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
        record.plan?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Plan status",
      dataIndex: "subscription_status",
      key: "subscription_status",

      align: "center",
      render: (text, record) => (
        <Tooltip title={record.subscription_status}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.subscription_status
                ? capitalizeFirstLetter(record.subscription_status)
                : "No subscription"}
            </div>
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Free Code",
      dataIndex: "code",
      key: "code",

      align: "center",
      render: (text, record) => (
        <Tooltip title={record.code}>
          <span className="hover:cursor-pointer text-left">
            <div className="truncate" style={{ maxWidth: "100%" }}>
              {record.code ? record.code : "No code"}
            </div>
          </span>
        </Tooltip>
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
            onPressEnter={() => {
              confirm();
              const filtered = dataClientSource?.filter((record) =>
                record?.code
                  ?.toLowerCase()
                  .includes(selectedKeys[0]?.toLowerCase())
              );
              setFilteredData(filtered);
            }}
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
                setFilteredData(dataClientSource);
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
        record.code?.toString().toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          className="flex items-center justify-center"
          overlay={
            <Menu>
              <>
                <Menu.Item key="Edit Plan">
                  <div
                    onClick={() => handleUpgradePlan(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Upgrade plan
                  </div>
                </Menu.Item>
                <Menu.Item key="delete">
                  <div
                    onClick={() => handleClientDelete(record.id)}
                    style={{ fontSize: "12px" }}
                  >
                    Delete
                  </div>
                </Menu.Item>
              </>
            </Menu>
          }
        >
          <div className="bg-blue-600 rounded-md text-white py-1 hover:cursor-pointer">
            Action
          </div>
        </Dropdown>
      ),
    },
  ];

  const capitalizeFirstLetter = (str) => {
    if (!str) return ""; // Bảo vệ trường hợp giá trị null hoặc undefined
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);

  const [clientStatus, setClientStatus] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  const handleUpgradePlan = (client) => {
    setIsUpgradePlanModalOpen(true); // Mở modal
    setSelectedClient(client); // Truyền thông tin client
  };

  useEffect(() => {
    setClientStatus(selectedClient?.plan);
  }, [selectedClient]);
  useEffect(() => {
    if (clientStatus === "Free") {
      setSubscriptionStatus("cancelled");
    } else {
      setSubscriptionStatus("active");
    }
  }, [clientStatus]);

  const confirmUpgrade = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ plan: clientStatus, subscription_status: subscriptionStatus })
        .eq("id", selectedClient.id);

      if (error) {
        console.error("Error fetching users:", error.message);
      } else {
        message.success(`Upgraded client's plan successfully.`);
      }
    } catch (error) {
      message.error(error);
    } finally {
      setSelectedClient("");
      setIsUpgradePlanModalOpen(false);
    }
  };

  const handleClientDelete = async (clientId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteClientModalOpen(true);
    // Lưu projectId của dự án cần xóa
    setSelectedID(clientId);
  };

  const confirmClientDelete = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", SelectedID);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedClientsCopy = dataClientSource.filter(
          (client) => client.id !== SelectedID
        );
        setDataClientSource(updatedClientsCopy);

        message.success("Deleted client.");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting client:", error);
    } finally {
      // Đóng modal sau khi xóa hoặc xảy ra lỗi
      setIsDeleteClientModalOpen(false);
      setSelectedID("");
    }
  };

  const [isDeleteFinModalOpen, setIsDeleteFinModalOpen] = useState(false);

  const handleFinancialDelete = async (projectId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteFinModalOpen(true);
    // Lưu projectId của dự án cần xóa
    setSelectedID(projectId);
  };

  const confirmFinDelete = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("finance")
        .delete()
        .eq("id", SelectedID);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedProjectsCopy = dataFinanceSource.filter(
          (finance) => finance.id !== SelectedID
        );
        setDataFinanceSource(updatedProjectsCopy);

        message.success("Deleted financial project.");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
    } finally {
      // Đóng modal sau khi xóa hoặc xảy ra lỗi
      setIsDeleteFinModalOpen(false);
      setSelectedID("");
    }
  };

  const [dataFinanceSource, setDataFinanceSource] = useState([]);

  useEffect(() => {
    // Tải danh sách finance từ Supabase dựa trên user.id
    const loadFinances = async () => {
      setIsLoading(true);
      try {
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

          transformedData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setDataFinanceSource(transformedData);
        }
      } catch (error) {
        console.error("Error fetching Financial data", error.message);
        message.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinances();
  }, []);

  const [activeTab, setActiveTab] = useState("fundraising");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const [codeData, setCodeData] = useState([]);

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data, error } = await supabase.from("code").select("*");

        if (error) {
          throw error;
        }

        setCodeData(
          data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
      } catch (error) {
        console.error("Error fetching code data:", error);
      }
    };

    fetchCodeData();
  }, []);

  return (
    <>
      <div className=" bg-white darkBg antialiased !p-0 ">
        <LoadingButtonClick isLoading={isLoading} />
        <div id="exampleWrapper">
          <SideBar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />

          <Tabs
            activeTab={activeTab}
            setIsSidebarOpen={setIsSidebarOpen}
            handleTabChange={handleTabChange}
            columns={columns}
            dataSource={dataSource}
            filteredData={filteredData}
            financialColumns={financialColumns}
            dataFinanceSource={dataFinanceSource}
            clientColumns={clientColumns}
            dataClientSource={dataClientSource}
            codeData={codeData}
            setCodeData={setCodeData}
          />
        </div>

        {isDeleteModalOpen && (
          <Modal
            title="Confirm Delete"
            open={isDeleteModalOpen}
            onOk={confirmDelete}
            onCancel={cancelDelete}
            okText="Delete"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            okButtonProps={{
              style: {
                background: "#f5222d",
                borderColor: "#f5222d",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            centered={true}
          >
            Are you sure you want to delete this project?
          </Modal>
        )}

        {isDeleteFinModalOpen && (
          <Modal
            title="Confirm Delete"
            open={isDeleteFinModalOpen}
            onOk={confirmFinDelete}
            onCancel={() => {
              setIsDeleteFinModalOpen(false);
              setSelectedID("");
            }}
            okText="Delete"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            okButtonProps={{
              style: {
                background: "#f5222d",
                borderColor: "#f5222d",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            centered={true}
          >
            Are you sure you want to delete this project?
          </Modal>
        )}

        {isUpgradePlanModalOpen && (
          <Modal
            title="Upgrade client's plan"
            open={isUpgradePlanModalOpen}
            onOk={confirmUpgrade}
            onCancel={() => {
              setIsUpgradePlanModalOpen(false);
              setSelectedClient("");
            }}
            okText="Upgrade"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            okButtonProps={{
              style: {
                background: "#2563EB",
                borderColor: "#2563EB",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            centered={true}
          >
            <>
              <label className="block mt-2">
                <input
                  type="text"
                  name="Client email"
                  placeholder=""
                  value={selectedClient.email}
                  className="block w-full px-4 py-3 text-sm text-gray-800 border-gray-300 rounded-md"
                  disabled
                />
              </label>

              <div className="mt-4">
                <div className="mt-4">
                  <Radio.Group
                    onChange={(e) => setClientStatus(e.target.value)}
                    value={clientStatus}
                  >
                    <Radio value="Free">Free</Radio>

                    <Radio value="FundFlow Premium">FundFlow Premium</Radio>

                    <Radio value="FundFlow Platinum">FundFlow Platinum</Radio>
                  </Radio.Group>
                </div>
              </div>
            </>
          </Modal>
        )}

        {isDeleteClientModalOpen && (
          <Modal
            title="Confirm Delete Client"
            open={isDeleteClientModalOpen}
            onOk={confirmClientDelete}
            onCancel={() => {
              setIsDeleteClientModalOpen(false);
              setSelectedID("");
            }}
            okText="Delete"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            okButtonProps={{
              style: {
                background: "#f5222d",
                borderColor: "#f5222d",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
              },
            }}
            centered={true}
          >
            Are you sure you want to delete this user?
          </Modal>
        )}
      </div>
    </>
  );
}

export default AdminPage;
