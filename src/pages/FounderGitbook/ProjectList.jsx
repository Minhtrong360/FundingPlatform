import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";

// import InvitedUserProject from "../../components/InvitedUserProject";

// import ProjectGiven from "../../components/ProjectGiven";
import { Dropdown, Menu, message, Table, Modal, Select } from "antd";
import { formatDate } from "../../features/DurationSlice";
import InputField from "../../components/InputField";
import apiService from "../../app/apiService";
import { Option } from "antd/es/mentions";

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
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [email, setEmail] = useState("elonmusk@gmail.com");
  const [contestCode, setContestCode] = useState("");
  const [inviteEmail, setInviteEmail] = useState("elonmusk@gmail.com");

  const [SelectedID, setSelectedID] = useState();

  const [applyInfo, setApplyInfo] = useState({
    // projectName: "",
    creatorName: "",
    // registrationTime: "",
    contactEmail: "",
    contactPhone: "",
    university: "",
    teamSize: "",
    teamEmails: "",
  });

  const handleDelete = async (projectId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteModalOpen(true);
    // Lưu projectId của dự án cần xóa
    setSelectedID(projectId);
  };

  const handleAssign = async (projectId) => {
    setIsAssignModalOpen(true);

    setSelectedID(projectId);
  };

  const handleSubmit = async (projectId) => {
    setIsSubmitModalOpen(true);

    setSelectedID(projectId);
  };

  const handleInvite = async (projectId) => {
    setIsInviteModalOpen(true);

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
        const updatedProjectsCopy = updatedProjects.filter(
          (project) => project.id !== SelectedID
        );
        setUpdatedProjects(updatedProjectsCopy);

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

  // Hàm Assign dự án
  const handleConfirmAssign = async () => {
    try {
      // Kiểm tra kết nối internet
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      // Tìm id của user dựa trên email nhập vào
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email);

      if (userError) {
        console.log("Error fetching user data:", userError);
        message.error(userError.message);
        return;
      }

      if (!userData.length > 0) {
        message.error(`User with email ${email} not found.`);
        return;
      }

      const userId = userData[0].id;

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", SelectedID);

      if (projectError) {
        console.log("Error fetching project data:", projectError);
        message.error(projectError.message);
        return;
      }

      if (!projectData.length > 0) {
        console.log("Project not found.");
        message.error("Project not found.");
        return;
      }

      const { error: updateError } = await supabase
        .from("projects")
        .update({ user_id: userId, user_email: email })
        .eq("id", SelectedID);

      if (updateError) {
        console.log("Error updating project data:", updateError);
        message.error(updateError.message);
        return;
      }

      message.success("Assign project successfully");
      const updatedProjectsCopy = updatedProjects?.filter(
        (project) => project.id !== SelectedID
      );
      setUpdatedProjects(updatedProjectsCopy);
    } catch (error) {
      console.log("Error inviting user:", error);
      message.error(error.message);
    } finally {
      setIsAssignModalOpen(false);
    }
  };

  //Hàm Submit to contest
  const handleConfirmSubmit = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      if (!contestCode) {
        message.error("Please select a contest code.");
        return;
      }

      const requiredFields = {
        creatorName: "Creator Name",
        contactEmail: "Contact Email",
        contactPhone: "Contact Phone",
        university: "University",
        teamSize: "Team Size",
        teamEmails: "Team Emails",
      };

      for (const [key, label] of Object.entries(requiredFields)) {
        if (!applyInfo[key]) {
          message.error(`Please fill in the ${label}.`);
          return;
        }
      }

      const { data: codeData, error: codeError } = await supabase
        .from("code")
        .select("id")
        .eq("code", contestCode);

      if (codeError) {
        message.error(codeError.message);
        return;
      }

      if (codeData.length === 0) {
        message.error(`Code "${contestCode}" does not exist.`);
        return;
      }

      const codeId = codeData[0].id;

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", SelectedID);

      if (projectError) {
        message.error(projectError.message);
        return;
      }

      if (projectData.length === 0) {
        message.error("Project not found.");
        return;
      }

      const project = projectData[0];
      let updatedUniversityCode = project.universityCode || [];
      let updatedApplyInfo = project.applyInfo || [];

      if (!updatedUniversityCode.includes(codeId)) {
        updatedUniversityCode.push(codeId);
        const newApplyInfo = {
          ...applyInfo,
          applyAt: new Date().toISOString(),
          universityCode: codeId,
        };
        updatedApplyInfo.push(newApplyInfo);
      } else {
        message.warning("You submitted this project to this contest.");
        return;
      }

      const { error: updateError } = await supabase
        .from("projects")
        .update({
          universityCode: updatedUniversityCode,
          applyInfo: updatedApplyInfo,
        })
        .eq("id", SelectedID);

      if (updateError) {
        message.error(updateError.message);
        return;
      }

      message.success("Submitted project successfully");
      setIsSubmitModalOpen(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Hàm Invite user
  const [invited_type, setInvited_type] = useState("View only");
  const handleConfirmInvite = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: projectData, error: fileError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", SelectedID)
        .single();

      if (fileError) {
        console.log("Error fetching project data:", fileError);
        message.error(fileError);
        return;
      }

      if (!projectData) {
        console.log("File with ID not found.");
        message.error("File with ID not found.");
        return;
      }

      const currentInvitedUsers = projectData.invited_user || [];
      const currentCollabs = projectData.collabs || [];

      if (
        invited_type === "View only" &&
        currentInvitedUsers.includes(inviteEmail)
      ) {
        message.warning(`User with email ${inviteEmail} is already invited.`);
        return;
      }

      if (
        invited_type === "Collaborate" &&
        currentCollabs.includes(inviteEmail)
      ) {
        message.warning(
          `User with email ${inviteEmail} is already invited as collaborator.`
        );
        return;
      }

      if (invited_type === "View only") {
        currentInvitedUsers.push(inviteEmail);
      } else if (invited_type === "Collaborate") {
        currentCollabs.push(inviteEmail);
      }

      await apiService.post("/invite/project", {
        target_email: inviteEmail,
        project_name: projectData.name,
        owner_email: projectData.user_email,
        project_id: projectData.id,
        invited_type: invited_type,
      });

      const updateData =
        invited_type === "View only"
          ? { invited_user: currentInvitedUsers }
          : { collabs: currentCollabs };

      const { error: updateError } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", SelectedID);

      if (updateError) {
        console.log("Error updating file data:", updateError);
        message.error(updateError);
      } else {
        console.log(`Successfully invited user with email: ${inviteEmail}`);
        message.success("Invited user successfully");
      }
    } catch (error) {
      console.log("Error inviting user:", error);
      message.error(error.message);
    } finally {
      setIsInviteModalOpen(false);
    }
  };

  // Hàm hủy bỏ xóa dự án
  const cancelDelete = () => {
    // Đóng modal và không làm gì cả
    setIsDeleteModalOpen(false);
    setSelectedID("");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState();
  // Trong hàm handleEdit, khi người dùng nhấp vào nút Edit, mở modal và truyền thông tin dự án được chọn vào AddProject

  const handleEdit = (record) => {
    setIsModalOpen(true); // Mở modal
    setSelectedProject(record); // Truyền thông tin dự án được chọn
  };

  const myColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{myProjects?.indexOf(record) + 1}</span>
      ),
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
                    <Menu.Item key="Edit Project">
                      <div
                        onClick={() => handleEdit(record)}
                        style={{ fontSize: "12px" }}
                      >
                        Edit Project
                      </div>
                    </Menu.Item>
                    <Menu.Item key="delete">
                      <div
                        onClick={() => handleDelete(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Delete Project
                      </div>
                    </Menu.Item>
                    <Menu.Item key="assign">
                      <div
                        onClick={() => handleAssign(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Assign
                      </div>
                    </Menu.Item>
                    <Menu.Item key="submit">
                      <div
                        onClick={() => handleSubmit(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Submit
                      </div>
                    </Menu.Item>
                    {record.user_id === user.id ? (
                      <Menu.Item key="invite">
                        <div
                          onClick={() => handleInvite(record.id)}
                          style={{ fontSize: "12px" }}
                        >
                          Invite
                        </div>
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
  const sharedColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{sharedProjects?.indexOf(record) + 1}</span>
      ),
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
                    <Menu.Item key="Edit Project">
                      <div
                        onClick={() => handleEdit(record)}
                        style={{ fontSize: "12px" }}
                      >
                        Edit Project
                      </div>
                    </Menu.Item>
                    <Menu.Item key="delete">
                      <div
                        onClick={() => handleDelete(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Delete Project
                      </div>
                    </Menu.Item>
                    <Menu.Item key="assign">
                      <div
                        onClick={() => handleAssign(record.id)}
                        style={{ fontSize: "12px" }}
                      >
                        Assign
                      </div>
                    </Menu.Item>

                    {record.user_id === user.id ? (
                      <Menu.Item key="invite">
                        <div
                          onClick={() => handleInvite(record.id)}
                          style={{ fontSize: "12px" }}
                        >
                          Invite
                        </div>
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
  const [contestCodes, setContestCodes] = useState([]);

  useEffect(() => {
    const fetchContestCodes = async () => {
      const { data, error } = await supabase
        .from("code")
        .select("id, code")
        .eq("publish", true);

      if (error) {
        console.error("Error fetching contest codes:", error);
        return;
      }

      setContestCodes(data);
    };

    fetchContestCodes();
  }, []);

  return (
    <main className="w-full min-h-[92.5vh]">
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
          Are you sure you want to delete this{" "}
          <span className="text-[#f5222d] font-semibold">
            {
              updatedProjects?.find((project) => project.id === SelectedID)
                ?.name
            }
          </span>{" "}
          project?
        </Modal>
      )}

      {isAssignModalOpen && (
        <Modal
          title="Assign project"
          open={isAssignModalOpen}
          onOk={handleConfirmAssign}
          onCancel={() => setIsAssignModalOpen(false)}
          okText="Assign"
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
          <InputField
            label="Assign this project to:"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            required
          />
        </Modal>
      )}

      {isSubmitModalOpen && (
        <Modal
          title="Submit project"
          open={isSubmitModalOpen}
          onOk={handleConfirmSubmit}
          onCancel={() => setIsSubmitModalOpen(false)}
          okText="Submit"
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
          <div>
            <label
              htmlFor={contestCode}
              className="block mb-2 text-sm darkTextWhite"
            >
              Submit this project to:
            </label>
          </div>
          <Select
            style={{
              width: "100%",
              marginBottom: "6px",
              minHeight: "46px",
            }}
            placeholder="Select a contest code"
            value={contestCode}
            onChange={(value) => setContestCode(value)}
            required
          >
            {contestCodes.map((code) => (
              <Option key={code.id} value={code.code}>
                {code.code}
              </Option>
            ))}
          </Select>
          {/* <InputField
                      style={{ marginBottom: "6px" }}

            label="Project Name"
            id="projectName"
            name="projectName"
            value={applyInfo.projectName}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, projectName: e.target.value })
            }
            type="text"
            required
          /> */}
          <InputField
            style={{ marginBottom: "6px" }}
            label="Creator Name"
            id="creatorName"
            name="creatorName"
            value={applyInfo.creatorName}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, creatorName: e.target.value })
            }
            type="text"
            required
          />
          {/* <InputField
                      style={{ marginBottom: "6px" }}

            label="Registration Time"
            id="registrationTime"
            name="registrationTime"
            value={applyInfo.registrationTime}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, registrationTime: e.target.value })
            }
            type="text"
            required
          /> */}
          <InputField
            style={{ marginBottom: "6px" }}
            label="Contact Email"
            id="contactEmail"
            name="contactEmail"
            value={applyInfo.contactEmail}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, contactEmail: e.target.value })
            }
            type="text"
            required
          />
          <InputField
            style={{ marginBottom: "6px" }}
            label="Contact Phone"
            id="contactPhone"
            name="contactPhone"
            value={applyInfo.contactPhone}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, contactPhone: e.target.value })
            }
            type="text"
            required
          />
          <InputField
            style={{ marginBottom: "6px" }}
            label="University"
            id="university"
            name="university"
            value={applyInfo.university}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, university: e.target.value })
            }
            type="text"
            required
          />
          <InputField
            style={{ marginBottom: "6px" }}
            label="Team Size"
            id="teamSize"
            name="teamSize"
            value={applyInfo.teamSize}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, teamSize: e.target.value })
            }
            type="text"
            required
          />
          <InputField
            style={{ marginBottom: "6px" }}
            label="Team Emails"
            id="teamEmails"
            name="teamEmails"
            value={applyInfo.teamEmails}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, teamEmails: e.target.value })
            }
            type="text"
            required
          />
        </Modal>
      )}

      {isInviteModalOpen && (
        <Modal
          title="Invite user"
          open={isInviteModalOpen}
          onOk={handleConfirmInvite}
          onCancel={() => setIsInviteModalOpen(false)}
          okText="Invite"
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
          <InputField
            label="Invite this email to watch/collaborate your profile"
            id="inviteEmail"
            name="inviteEmail"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            type="text"
            required
          />
          <div className="mt-5">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="invitedType"
                value="View only"
                checked={invited_type === "View only"} // Cập nhật giá trị checked dựa trên giá trị state
                onChange={() => setInvited_type("View only")} // Cập nhật loại dự án khi người dùng thay đổi lựa chọn
              />
              <span className="ml-2 text-gray-700 text-sm">View only</span>
            </label>

            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="invitedType"
                value="Collaborate"
                checked={invited_type === "Collaborate"} // Cập nhật giá trị checked dựa trên giá trị state
                onChange={() => setInvited_type("Collaborate")} // Cập nhật loại dự án khi người dùng thay đổi lựa chọn
              />
              <span className="ml-2 text-gray-700 text-sm">Collaborate</span>
            </label>
          </div>
        </Modal>
      )}

      <section className="container px-4 mx-auto">
        <h1 className="text-4xl text-center my-2 font-bold">
          Fundraising Profile Listing Dashboard
        </h1>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold mb-4">My Projects</h2>
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
        <div className="flex flex-col mb-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                <Table
                  columns={myColumns}
                  dataSource={myProjects}
                  pagination={{
                    position: ["bottomLeft"],
                  }}
                  rowKey="id"
                  size="small"
                  bordered
                />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4 mt-12">
          Projects Shared With Me
        </h2>
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                <Table
                  columns={sharedColumns}
                  dataSource={sharedProjects}
                  pagination={{
                    position: ["bottomLeft"],
                  }}
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
