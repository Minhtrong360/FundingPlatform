import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { PlusIcon, SearchIcon } from "lucide-react";
import AddProject from "./AddProject";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import InputField from "../../components/InputField";
import { Option } from "antd/es/mentions";
import apiService from "../../app/apiService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../..//components/ui/dropdown-menu";

function ProjectList({ projects, isLoading }) {
  const { user } = useAuth();
  const [updatedProjects, setUpdatedProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("my-projects");

  const navigate = useNavigate();

  useEffect(() => {
    const sortedProjects = [...projects].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setUpdatedProjects(sortedProjects);
  }, [projects]);

  const myProjects = updatedProjects.filter(
    (project) => project.user_id === user.id
  );

  const sharedProjects = updatedProjects.filter(
    (project) => project.user_id !== user.id
  );

  const filteredProjects = (
    activeTab === "my-projects" ? myProjects : sharedProjects
  ).filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || project.status.toLowerCase() === statusFilter)
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
        navigate(`/profile/${project.id}`);
      } else {
        navigate(`/company/${project.id}`);
      }
    } catch (error) {
      console.error("Error checking company:", error.message);
    }
  };

  // Lấy từ code cũ
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
    teamName: "",
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
        teamName: "Team Name",
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
        // Update the applyInfo that corresponds to the existing codeId
        updatedApplyInfo = updatedApplyInfo.map((info) => {
          if (JSON.parse(info).universityCode === codeId) {
            info = applyInfo;
            info.applyAt = new Date().toISOString();
            info.universityCode = codeId;

            return info;
          }
          return info;
        });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center -tracking-normal">
        Fundraising Profile Listing Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="grid sm:w-[50%] w-full grid-cols-2 bg-gray-50 mb-4">
          <TabsTrigger
            value="my-projects"
            className="data-[state=active]:bg-white data-[state=active]:text-black w-full mx-auto rounded-md text-gray-800"
          >
            My Projects
          </TabsTrigger>
          <TabsTrigger
            value="shared-projects"
            className="data-[state=active]:bg-white data-[state=active]:text-black w-full mx-auto rounded-md text-gray-800"
          >
            Shared Projects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Projects</h2>
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
          {renderContent()}
        </TabsContent>
        <TabsContent value="shared-projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Projects Shared With Me</h2>
            <div style={{ visibility: "hidden" }}>
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
          </div>

          {renderContent()}
        </TabsContent>
      </Tabs>

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
            label="Team Name"
            id="teamName"
            name="teamName"
            value={applyInfo.teamName}
            onChange={(e) =>
              setApplyInfo({ ...applyInfo, teamName: e.target.value })
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
          <div className="mt-4">
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
    </div>
  );

  function renderContent() {
    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="!pl-10 !h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action/Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell
                    className="hover:cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="font-medium hover:cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    {project.name}
                  </TableCell>
                  <TableCell className="hover:cursor-pointer">
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{project.user_email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        project.status.toLowerCase() === "private"
                          ? "bg-red-600 text-white"
                          : "bg-black text-white"
                      }
                    >
                      {project?.status.trim().charAt(0).toUpperCase() +
                        project?.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {project.user_id === user.id ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Action
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white" align="end">
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onClick={() => handleEdit(project)}
                          >
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onClick={() => handleDelete(project.id)}
                          >
                            Delete Project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onClick={() => handleAssign(project.id)}
                          >
                            Assign
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onClick={() => handleSubmit(project.id)}
                          >
                            Submit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onClick={() => handleInvite(project.id)}
                          >
                            Invite
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Button variant="outline" size="sm">
                        {project.invited_user?.includes(user.email) &&
                        project.collabs?.includes(user.email)
                          ? "Collaboration"
                          : project.invited_user?.includes(user.email)
                            ? "View only"
                            : project.collabs?.includes(user.email)
                              ? "Collaboration"
                              : "Default Label"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
}

export default ProjectList;
