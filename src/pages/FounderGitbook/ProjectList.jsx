import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";
import AlertMsg from "../../components/AlertMsg";
import InvitedUserProject from "../../components/InvitedUserProject";
// import { toast } from "react-toastify";
import ProjectGiven from "../../components/ProjectGiven";
import { Dropdown, Button, Menu, message, Table, Modal } from "antd";
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState();
  const handleDelete = async (projectId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteModalOpen(true);

    // Lưu projectId của dự án cần xóa
    setDeletingProjectId(projectId);
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
        .eq("id", deletingProjectId);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedProjectsCopy = updatedProjects.filter(
          (project) => project.id !== deletingProjectId
        );
        setUpdatedProjects(updatedProjectsCopy);
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
    } finally {
      // Đóng modal sau khi xóa hoặc xảy ra lỗi
      setIsDeleteModalOpen(false);
    }
  };

  // Hàm hủy bỏ xóa dự án
  const cancelDelete = () => {
    // Đóng modal và không làm gì cả
    setIsDeleteModalOpen(false);
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
      width: "25%",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
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
      width: "25%",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <>
          <button
            onClick={() => handleProjectClick(record)}
            className={`w-[5em] ${
              record?.status === "public"
                ? "bg-blue-600 text-white"
                : record?.status === "private"
                ? "bg-red-600 text-white"
                : record?.status === "stealth"
                ? "bg-yellow-300 text-black"
                : ""
            }   focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-md py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
            style={{ fontSize: "12px" }}
          >
            {record.status === "public"
              ? "Public"
              : record.status === "private"
              ? "Private"
              : "Stealth"}
          </button>
        </>
      ),
    },
    {
      title: "Action/Roles",
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

                    {record.user_id === user.id ? (
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
              <div className="w-[6rem] bg-blue-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md py-1 text-center darkBgBlue darkHoverBgBlue darkFocus cursor-pointer">
                Action
              </div>
            </Dropdown>
          ) : (
            <div
              onClick={() => handleProjectClick(record)}
              className={`w-[6rem] bg-blue-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md py-1 text-center darkBgBlue darkHoverBgBlue darkFocus cursor-pointer`}
            >
              {record.invited_user?.includes(user.email) &&
              record.collabs?.includes(user.email)
                ? "Collaboration"
                : record.invited_user?.includes(user.email)
                ? "View only"
                : record.collabs?.includes(user.email)
                ? "Collaboration"
                : "Default Label"}
            </div>
          )}
        </>
      ),
    },
  ];

  const myProjects = updatedProjects.filter(
    (project) => project.user_id === user.id
  );

  const sharedProjects = updatedProjects.filter(
    (project) => project.user_id !== user.id
  );

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
          myProjects={myProjects}
        />
      </div>

      {isDeleteModalOpen && (
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalOpen}
          onOk={confirmDelete}
          onCancel={cancelDelete}
          okText="Delete"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderColor: "black",
              padding: "8px 16px",

              borderRadius: "0.375rem",
              cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
            },
          }}
          okButtonProps={{
            style: {
              background: "#f5222d",
              borderColor: "#f5222d",
              padding: "8px 16px",
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

      <section className="container px-4 mx-auto">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>
        <div className="flex flex-col mb-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
                <Table
                  columns={columns}
                  dataSource={myProjects}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  bordered
                />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-12">
          Projects Shared With Me
        </h2>
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
                <Table
                  columns={columns}
                  dataSource={sharedProjects}
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
