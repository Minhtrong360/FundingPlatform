import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import AnnouncePage from "../../components/AnnouncePage";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

import Header from "../Home/Header";
import { Badge, message, Table } from "antd";
import { formatDate } from "../../features/DurationSlice";
import { Switch, Space } from "antd";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import moment from "moment";
import { formatNumber } from "../../features/CostSlice";

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

  const [projects, setProjects] = useState([]);
  const [company, setCompany] = useState([]);
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
          setCompany(companies);
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

          setProjects(filteredProjects);

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
      setProjects((prevProjects) =>
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
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90, fontSize: "12px" }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
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
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Space direction="vertical">
            <DatePicker.RangePicker
              onChange={(value) => setSelectedKeys(value ? [value] : [])}
              style={{ width: 188, marginBottom: 8, display: "block" }}
              format="DD/MM/YYYY" // Add this line
            />
          </Space>
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => {
        if (!value) return true;
        const [start, end] = value;
        const createdAt = moment(record.created_at);
        return createdAt.isBetween(start, end, "day", "[]");
      },
    },
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
    },
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
    },
    {
      title: "Target Amount",
      dataIndex: "target_amount",
      key: "target_amount",
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
      title: "Ticket Size",
      dataIndex: "ticket_size",
      key: "ticket_size",
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
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
    },
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
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(text)}
        </div>
      ),
    },
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
          className=" whitespace-nowrap hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Round",
      dataIndex: "round",
      key: "round",
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
          className=" whitespace-nowrap hover:cursor-pointer"
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
    },
    {
      title: "Key words",
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

  return (
    <main className="w-full my-28">
      <Header />

      {userData.admin === true && (
        <section className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden  md:rounded-md">
                  <Table
                    columns={columns}
                    dataSource={dataSource}
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
