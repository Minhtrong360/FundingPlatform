import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";

function formatDate(inputDateString) {
  const dateObject = new Date(inputDateString);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

function ProjectList({ projects }) {
  const { user } = useAuth();
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [updatedProjects, setUpdatedProjects] = useState([]);
  const [editedProjectStatus, setEditedProjectStatus] = useState(true); // Thêm state cho trường status
  const navigate = useNavigate();
  const handleProjectClick = (project) => {
    // Gọi hàm handleClickProjectId để truyền projectId lên thành phần cha
    navigate(`/founder/${project.id}`);
  };

  useEffect(() => {
    setUpdatedProjects(projects);
  }, [projects]);

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setEditedProjectName(project.name);
    setEditedProjectStatus(project.status); // Thiết lập giá trị ban đầu cho trường status
  };

  const handleSaveClick = async (project) => {
    try {
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
      // Gửi yêu cầu xóa dự án ra khỏi Supabase bằng cách sử dụng phương thức `delete`
      console.log("projectId", projectId);
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
      console.error("Error deleting project:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  useEffect(() => {
    // Sắp xếp danh sách các dự án theo thời gian tạo mới nhất đến cũ nhất
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });

    setUpdatedProjects(sortedProjects);
  }, [projects]);

  const handleStatusToggle = () => {
    setEditedProjectStatus((prevStatus) => !prevStatus); // Chuyển đổi giữa Public và Private
  };

  return (
    <main className="w-full">
      <div className="flex justify-end mr-5 mt-10 mb-5 items-end">
        <AddProject />
      </div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                          />
                          <button className="flex items-center gap-x-2">
                            <span>NO.</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Date
                      </th>

                      {/* <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Status
                      </th> */}
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {updatedProjects.map((project, index) => (
                      <tr key={project.id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                            />
                            <span>#{index + 1}</span>
                          </div>
                        </td>
                        <td
                          onClick={() => handleProjectClick(project)}
                          className={`${
                            editingProjectId === project.id
                              ? "hidden"
                              : "hover:cursor-pointer"
                          } px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap`}
                        >
                          {project.name}
                        </td>
                        <td
                          className={`${
                            editingProjectId === project.id ? "" : "hidden"
                          } px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap`}
                        >
                          <input
                            type="text"
                            value={editedProjectName}
                            onChange={(e) =>
                              setEditedProjectName(e.target.value)
                            }
                          />
                        </td>
                        <td className="px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap">
                          {formatDate(project.created_at)}
                        </td>
                        {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{project.status}</td> */}
                        <td className=" py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap">
                          <div className="flex items-center gap-x-2">
                            {user.email}
                          </div>
                        </td>

                        <td
                          className={`px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap ${
                            editingProjectId !== project.id ? "" : "hidden"
                          }`}
                        >
                          {project.status ? "Public" : "Private"}
                        </td>
                        <td
                          className={`px-4 py-4 text-sm whitespace-nowrap ${
                            editingProjectId === project.id ? "" : "hidden"
                          }`}
                        >
                          <div className="flex items-center gap-x-2">
                            <button
                              onClick={handleStatusToggle}
                              className={`${
                                editedProjectStatus
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } text-white px-2 py-1 rounded-md hover:bg-opacity-80 transition-all`}
                            >
                              {editedProjectStatus ? "Public" : "Private"}
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            {editingProjectId === project.id ? (
                              <>
                                <button
                                  className="text-blue-500 transition-colors duration-200 dark:hover:text-indigo-500 dark:text-gray-300 hover:text-indigo-500 focus:outline-none"
                                  onClick={() => handleSaveClick(project)}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-red-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                                  onClick={() => setEditingProjectId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="text-blue-500 transition-colors duration-200 dark:hover:text-indigo-500 dark:text-gray-300 hover:text-indigo-500 focus:outline-none"
                                onClick={() => handleEditClick(project)}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="text-red-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                              onClick={() => handleDelete(project.id)}
                            >
                              Delete
                            </button>
                          </div>
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
