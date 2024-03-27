import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import AnnouncePage from "../../components/AnnouncePage";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import SideBar from "../../components/SideBar";
import Header from "../Home/Header";
import { message } from "antd";

function formatDate(inputDateString) {
  const dateObject = new Date(inputDateString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
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

  return (
    <main className="w-full my-28">
      <Header />

      {userData.admin === true && (
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
                          Required verification
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
                          Verified
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 darkDivideGray darkBg">
                      {projects?.map((project, index) => (
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
                              className={`w-[150px] flex items-center  hover:cursor-pointer`}
                              onClick={() => handleProjectClick(project)}
                            >
                              {project.name}
                            </div>
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
                            className={`hover:cursor-pointer px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap `}
                          >
                            <div
                              onClick={() => handleProjectClick(project)}
                              className={`w-[5em] 
                              ${
                                project.required
                                  ? "text-blue-600"
                                  : " text-black-500"
                              }
                               focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                            >
                              {project.required && project.verified
                                ? "Accepted"
                                : project.required
                                ? "Waiting..."
                                : "No required"}
                            </div>
                          </td>

                          <td
                            className={`hover:cursor-pointer px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap `}
                          >
                            <button
                              onClick={() => handleProjectClick(project)}
                              className={`w-[5em] ${
                                project.status ? "bg-blue-600" : "bg-red-600"
                              } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                            >
                              {project.status ? "Public" : "Private"}
                            </button>
                          </td>

                          <td className="px-4 py-4 text-sm whitespace-nowrap">
                            <div className="flex items-center gap-x-3">
                              <button
                                className={`w-[6em] ${
                                  project.verified
                                    ? "bg-blue-600"
                                    : "bg-red-600"
                                } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                                onClick={() => handleVerifyToggle(project)}
                              >
                                {project.verified ? "Verified" : "Unverified"}
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
      )}
      {userData.admin === false && (
        <AnnouncePage
          title="Permission Required"
          announce="You are not ADMIN"
          describe="Only ADMIN can access this site!"
        />
      )}
    </main>
  );
}

export default AdminPage;
