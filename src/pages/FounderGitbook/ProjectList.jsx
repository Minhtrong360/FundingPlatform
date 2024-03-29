import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";
import AlertMsg from "../../components/AlertMsg";
import InvitedUserProject from "../../components/InvitedUserProject";
// import { toast } from "react-toastify";
import ProjectGiven from "../../components/ProjectGiven";
import { Dropdown, Button, Menu, message, Table, Switch } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { formatDate } from "../../features/DurationSlice";

function ProjectList({ projects }) {
  const { user } = useAuth();

  const [updatedProjects, setUpdatedProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setUpdatedProjects(sortedProjects);
  }, [projects]);

  const handleDelete = async (projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!isConfirmed) {
      return;
    }
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedProjectsCopy = updatedProjects.filter(
          (project) => project.id !== projectId
        );
        setUpdatedProjects(updatedProjectsCopy);
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState();
  // Trong hàm handleEdit, khi người dùng nhấp vào nút Edit, mở modal và truyền thông tin dự án được chọn vào AddProject
  const handleEdit = (record) => {
    setIsModalOpen(true); // Mở modal
    setSelectedProject(record); // Truyền thông tin dự án được chọn
  };

  const columns = [
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
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            {record.name}
          </span>
        </>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {formatDate(record.created_at)}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "user_email",
      key: "user_email",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          {record.user_email}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <>
          <button
            onClick={() => handleProjectClick(record)}
            className={`w-[5em] ${
              record.status ? "bg-blue-600" : "bg-red-600"
            } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-md py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
            style={{ fontSize: "12px" }}
          >
            {record.status ? "Public" : "Private"}
          </button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          {record.user_id === user.id ? (
            <Dropdown
              overlay={
                <Menu>
                  <>
                    <Menu.Item key="edit">
                      <Button
                        onClick={() => handleEdit(record)}
                        style={{ fontSize: "12px" }}
                      >
                        Edit
                      </Button>
                    </Menu.Item>
                    <Menu.Item key="delete">
                      <Button
                        type="danger"
                        onClick={() => handleDelete(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Delete
                      </Button>
                    </Menu.Item>
                    <Menu.Item key="assign">
                      <ProjectGiven
                        projectId={record.id}
                        setUpdatedProjects={setUpdatedProjects}
                        updatedProject={updatedProjects}
                      />
                    </Menu.Item>

                    {record.status ? (
                      ""
                    ) : record.user_id === user.id ? (
                      <Menu.Item key="invite">
                        <InvitedUserProject projectId={record.id} />
                      </Menu.Item>
                    ) : (
                      ""
                    )}
                  </>
                </Menu>
              }
            >
              <Button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Action
                <DownOutlined className="ml-2 -mr-0.5 h-4 w-4" />
              </Button>
            </Dropdown>
          ) : (
            <Button
              onClick={() => handleProjectClick(record)}
              className={`w-[8em] bg-blue-600  text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
            >
              {record.invited_user?.includes(user.email) &&
              record.collabs?.includes(user.email)
                ? "Collaboration"
                : record.invited_user?.includes(user.email)
                ? "View only"
                : record.collabs?.includes(user.email)
                ? "Collaboration"
                : "Default Label"}
            </Button>
          )}
        </>
      ),
    },
  ];

  const dataSource = updatedProjects.map((project, index) => ({
    ...project,
    index,
  }));

  const handleProjectClick = async (project) => {
    try {
      const { data: companies, error } = await supabase
        .from("company")
        .select("id")
        .eq("project_id", project.id);

      if (error) {
        throw error;
      }

      if (companies.length > 0) {
        navigate(`/founder/${project.id}`);
      } else {
        navigate(`/company/${project.id}`);
      }
    } catch (error) {
      console.error("Error checking company:", error.message);
    }
  };

  return (
    <main className="w-full min-h-[92.5vh]">
      <AlertMsg />
      <div className="flex justify-end mr-5 mb-5 items-end">
        <AddProject
          updatedProjects={updatedProjects}
          setUpdatedProjects={setUpdatedProjects}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      </div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  bordered
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProjectList;
