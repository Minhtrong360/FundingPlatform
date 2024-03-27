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

function formatDate(inputDateString) {
  const dateObject = new Date(inputDateString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
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
  const [editedProjectStatus, setEditedProjectStatus] = useState(true);
  const navigate = useNavigate();

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
    setEditedProjectStatus(project.status);
  };

  const handleSaveClick = async (project) => {
    try {
      if (!navigator.onLine) {
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
        return;
      }
      const { error } = await supabase
        .from("projects")
        .update({ name: editedProjectName, status: editedProjectStatus })
        .eq("id", project.id);

      if (error) {
        console.error("Error updating project name:", error);
      } else {
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
    }
  };

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

  const handleStatusToggle = () => {
    setEditedProjectStatus((prevStatus) => !prevStatus);
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
          {editingProjectId === record.id ? (
            <input
              type="text"
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              className="w-[150px] border-0 p-0 text-sm text-red-500 darkTextGray whitespace-nowrap focus:outline-none focus:ring-0"
            />
          ) : (
            <span
              className="hover:cursor-pointer"
              onClick={() => handleProjectClick(record)}
            >
              {record.name}
            </span>
          )}
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
          {editingProjectId !== record.id ? (
            <Button
              onClick={() => handleProjectClick(record)}
              className={`w-[5em] ${
                record.status ? "bg-blue-600" : "bg-red-600"
              } text-white  focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
            >
              {record.status ? "Public" : "Private"}
            </Button>
          ) : (
            <Switch
              checked={editedProjectStatus}
              onChange={handleStatusToggle}
            />
          )}
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
                  {editingProjectId === record.id ? (
                    <>
                      <Menu.Item key="save">
                        <Button
                          type="primary"
                          onClick={() => handleSaveClick(record)}
                        >
                          Save
                        </Button>
                      </Menu.Item>
                      <Menu.Item
key="cancel">
<Button onClick={() => setEditingProjectId(null)}>
  Cancel
</Button>
</Menu.Item>
</>
) : (
<>
<Menu.Item key="edit">
<Button onClick={() => handleEditClick(record)}>
  Edit
</Button>
</Menu.Item>
<Menu.Item key="delete">
<Button
  type="danger"
  onClick={() => handleDelete(record.id)}
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
</>
)}
</Menu>
}
>
<Button
className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
onClick={(e) => e.preventDefault()}
>
Actions <DownOutlined className="ml-2 -mr-0.5 h-4 w-4" />
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
{
title: "Invite",
dataIndex: "invite",
key: "invite",
render: (text, record) => (
<td className="px-4 py-4 text-sm whitespace-nowrap">
{record.status ? (
""
) : record.user_id === user.id ? (
<InvitedUserProject projectId={record.id} />
) : (
""
)}
</td>
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

useEffect(() => {
const fetchCurrentUser = async () => {
try {
if (!navigator.onLine) {
message.error("No internet access.");
return;
}
let { data: users, error } = await supabase
.from("users")
.select("*")
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
<div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-md">
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
