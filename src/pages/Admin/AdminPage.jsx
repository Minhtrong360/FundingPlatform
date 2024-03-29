import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import AnnouncePage from "../../components/AnnouncePage";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

import Header from "../Home/Header";
import { message, Table } from "antd";
import { formatDate } from "../../features/DurationSlice";
import { Switch, Space } from "antd";

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

          setProjects(filteredProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    }

    fetchProjects();
  }, []);

  const navigate = useNavigate();
  const handleProjectClick = (project) => {
    navigate(`/founder/${project.id}`);
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
      title: "Name",
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
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
        >
          {formatDate(text)}
        </div>
      ),
      ellipsis: true, // Add ellipsis to truncate long content
      width: "10%", // Set a fixed width for the column
      align: "center", // Center align the content
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
            className={`w-[5em] ${
              record.status ? "bg-blue-600" : "bg-red-600"
            } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300  py-1 text-center rounded-md `}
          >
            {record.status ? "Public" : "Private"}
          </button>
        </div>
      ),
    },
    {
      title: "Verified",
      key: "verified",
      render: (text, record) => (
        <Space direction="vertical">
          <Switch
            className="text-black"
            checkedChildren="Verified"
            unCheckedChildren="Unverified"
            value={record.verified}
            onClick={() => handleVerifyToggle(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <main className="w-full my-28">
      <Header />

      {userData.admin === true && (
        <section className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden  md:rounded-md">
                  <Table
                    columns={columns}
                    dataSource={projects}
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
