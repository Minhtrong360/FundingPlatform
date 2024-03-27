import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";
import AlertMsg from "../../components/AlertMsg";
import InvitedUserProject from "../../components/InvitedUserProject";
import { toast } from "react-toastify";
import ProjectGiven from "../../components/ProjectGiven";
import { Dropdown, Menu, Button, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

function formatDate(inputDateString) {
  const dateObject = new Date(inputDateString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

function ProjectList({ projects }) {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [updatedProjects, setUpdatedProjects] = useState([]);
  const [editedProjectStatus, setEditedProjectStatus] = useState(true); // Thêm state cho trường status
  const navigate = useNavigate();
  const handleProjectClick = async (project) => {
    try {
      // Truy vấn trong bảng 'company' để kiểm tra project_id có tồn tại hay không
      const { data: companies, error } = await supabase
        .from("company")
        .select("id")
        .eq("project_id", project.id);

      if (error) {
        throw error;
      }

      // Nếu tồn tại trong bảng 'company', điều hướng đến '/founder/${project.id}'
      if (companies.length > 0) {
        navigate(`/founder/${project.id}`);
      } else {
        // Ngược lại, điều hướng đến '/company/${project.id}'
        navigate(`/company/${project.id}`);
      }
    } catch (error) {
      console.error("Error checking company:", error.message);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")

          // Filters
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        message.error(error.message);
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  useEffect(() => {
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setUpdatedProjects(sortedProjects);
  }, [projects]);

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setEditedProjectName(project.name);
    setEditedProjectStatus(project.status); // Thiết lập giá trị ban đầu cho trường status
  };

  const handleSaveClick = async (project) => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      if (
        (currentUser.plan === "Free" ||
          currentUser.plan === null ||
          currentUser.plan === undefined) &&
        !editedProjectStatus &&
        currentUser.subscription_status !== "active"
      ) {
        message.warning(
          "You need to upgrade your plan to create a private project"
        );

        return; // Ngăn chặn tiếp tục thực hiện
      }
      // Gửi yêu cầu cập nhật tên dự án đến Supabase
      const { error } = await supabase
        .from("projects")
        .update({ name: editedProjectName, status: editedProjectStatus })
        .eq("id", project.id);

      if (error) {
        console.error("Error updating project name:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Cập nhật thành công, cập nhật lại trạng thái projects với tên mới
        const updatedProjectIndex = updatedProjects.findIndex(
          (p) => p.id === project.id
        );
        if (updatedProjectIndex !== -1) {
          const updatedProject = { ...updatedProjects[updatedProjectIndex] };
          updatedProject.name = editedProjectName;
          updatedProject.status = editedProjectStatus;
          const updatedProjectsCopy = [...updatedProjects];
          updatedProjectsCopy[updatedProjectIndex] = updatedProject;
          setUpdatedProjects(updatedProjectsCopy);
        }
        setEditingProjectId(null);
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error updating project name:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  const handleDelete = async (projectId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!isConfirmed) {
      return; // Không thực hiện xóa nếu người dùng không xác nhận
    }
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      // Gửi yêu cầu xóa dự án ra khỏi Supabase bằng cách sử dụng phương thức `delete`

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting project:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Xóa dự án thành công, cập nhật lại danh sách dự án
        const updatedProjectsCopy = updatedProjects.filter(
          (project) => project.id !== projectId
        );
        setUpdatedProjects(updatedProjectsCopy);
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  const handleStatusToggle = () => {
    setEditedProjectStatus((prevStatus) => !prevStatus); // Chuyển đổi giữa Public và Private
  };

  return (
    <main className="w-full">
      <AlertMsg />
      <div className="flex justify-end mr-5 mb-5 items-end">
        <AddProject
          updatedProjects={updatedProjects}
          setUpdatedProjects={setUpdatedProjects}
        />
      </div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 darkDivideGray">
                  <thead className="bg-gray-50 darkBgBlue ">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        <div className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded darkBg darkRingOffsetGray darkBorderGray"
                          />
                          <button className="flex items-center gap-x-2">
                            <span>NO.</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="w-[150px] px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Date
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-semibold text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Invite
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 darkDivideGray darkBg">
                    {updatedProjects?.map((project, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 darkTextGray whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded darkBg darkRingOffsetGray darkBorderGray"
                            />
                            <span
                              className="hover:cursor-pointer"
                              onClick={() => handleProjectClick(project)}
                            >
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap">
                          <div
                            className={`w-[150px] flex items-center ${
                              editingProjectId === project.id ? "hidden" : ""
                            } hover:cursor-pointer`}
                            onClick={() => handleProjectClick(project)}
                          >
                            {project.name}
                          </div>
                          {editingProjectId === project.id && (
                            <input
                              type="text"
                              value={editedProjectName}
                              onChange={(e) =>
                                setEditedProjectName(e.target.value)
                              }
                              className="w-[150px] border-0 p-0 text-sm text-red-500 darkTextGray whitespace-nowrap focus:outline-none focus:ring-0 "
                            />
                          )}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap hover:cursor-pointer"
                          onClick={() => handleProjectClick(project)}
                        >
                          {formatDate(project.created_at)}
                        </td>
                        {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{project.status}</td> */}
                        <td
                          className="px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap hover:cursor-pointer"
                          onClick={() => handleProjectClick(project)}
                        >
                          {project.user_email}
                        </td>

                        <td
                          className={`hover:cursor-pointer px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap ${
                            editingProjectId !== project.id ? "" : "hidden"
                          }`}
                        >
                          <button
                            onClick={() => handleProjectClick(project)}
                            className={`w-[5em] ${
                              project.status ? "bg-blue-600" : "bg-red-600"
                            } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                          >
                            {project.status ? "Public" : "Private"}
                          </button>
                        </td>
                        <td
                          className={`px-4 py-4 text-sm whitespace-nowrap ${
                            editingProjectId === project.id ? "" : "hidden"
                          }`}
                        >
                          <div className="flex items-center gap-x-6">
                            <button
                              onClick={handleStatusToggle}
                              className={`w-[5em] ${
                                editedProjectStatus
                                  ? "bg-blue-600"
                                  : "bg-red-600"
                              } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                            >
                              {editedProjectStatus ? "Public" : "Private"}
                            </button>
                          </div>
                        </td>
                        {project.user_id === user.id ? (
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-3">
                              <Dropdown
                                overlay={
                                  <Menu>
                                    {editingProjectId === project.id ? (
                                      <>
                                        <Menu.Item key="save">
                                          <Button
                                            type="primary"
                                            onClick={() =>
                                              handleSaveClick(project)
                                            }
                                          >
                                            Save
                                          </Button>
                                        </Menu.Item>
                                        <Menu.Item key="cancel">
                                          <Button
                                            onClick={() =>
                                              setEditingProjectId(null)
                                            }
                                          >
                                            Cancel
                                          </Button>
                                        </Menu.Item>
                                      </>
                                    ) : (
                                      <>
                                        <Menu.Item key="edit">
                                          <Button
                                            onClick={() =>
                                              handleEditClick(project)
                                            }
                                          >
                                            Edit
                                          </Button>
                                        </Menu.Item>
                                        <Menu.Item key="delete">
                                          <Button
                                            type="danger"
                                            onClick={() =>
                                              handleDelete(project.id)
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </Menu.Item>
                                        <Menu.Item key="assign">
                                          <ProjectGiven
                                            projectId={project.id}
                                            setUpdatedProjects={
                                              setUpdatedProjects
                                            }
                                            updatedProject={updatedProjects}
                                          />
                                        </Menu.Item>
                                      </>
                                    )}
                                  </Menu>
                                }
                              >
                                <Button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                  Actions
                                  <DownOutlined className="ml-2 -mr-0.5 h-4 w-4" />
                                </Button>
                              </Dropdown>
                            </div>
                          </td>
                        ) : (
                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-3">
                              <button
                                onClick={() => handleProjectClick(project)}
                                className={`w-[8em] bg-blue-600  text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                              >
                                {project.invited_user?.includes(user.email) &&
                                project.collabs?.includes(user.email)
                                  ? "Collaboration"
                                  : project.invited_user?.includes(user.email)
                                  ? "View only"
                                  : project.collabs?.includes(user.email)
                                  ? "Collaboration"
                                  : "Default Label"}
                              </button>
                            </div>
                          </td>
                        )}

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {project.status ? (
                            "" // Nếu project.status = true, không hiển thị gì
                          ) : project.user_id === user.id ? (
                            <InvitedUserProject projectId={project.id} /> // Nếu project.status = false và project.user_id = user.id, hiển thị InvitedUserProject component
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProjectList;
