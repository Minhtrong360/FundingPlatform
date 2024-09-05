import React, { useEffect, useState } from "react";

import SideBar from "../../components/SideBar";
import ReactModal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Modal, Table, Tooltip, message } from "antd";
import {
  formatDate,
  getCurrencyLabelByKey,
} from "../../features/DurationSlice";
import { PlusOutlined } from "@ant-design/icons";
import InputField from "../../components/InputField";
import PricingWithLemon from "../Home/Components/PricingWithLemon";
import { formatNumber } from "../../features/CostSlice";
import apiService from "../../app/apiService";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

function FinancialList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [isLoading, setIsLoading] = useState(false);

  const [finances, setFinances] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Tải danh sách finance từ Supabase dựa trên user.id

    const loadFinances = async () => {
      // const { data, error } = await supabase
      //   .from("finance")
      //   .select("*")
      //   .filter("user_id", "eq", user?.id);

      // Lấy các dự án có user_id = user.id
      setIsLoading(true);
      let { data: projects1, error: error1 } = await supabase
        .from("finance")
        .select("*")
        .eq("user_id", user.id);

      if (error1) {
        console.log("error1", error1);
        throw error1;
      }

      // Lấy các dự án có user.email trong mảng collabs
      let { data: projects2, error: error2 } = await supabase
        .from("finance")
        .select("*")
        .contains("collabs", [user.email]);

      if (error2) {
        console.log("error2", error2);
        throw error2;
      }

      let { data: projects3, error: error3 } = await supabase
        .from("finance")
        .select("*")
        .contains("invited_user", [user.email]);

      if (error3) {
        console.log("error3", error3);
        throw error3;
      }

      // Kết hợp các dự án từ hai kết quả truy vấn trên
      const combinedProjects = [...projects1, ...projects2, ...projects3];

      // Chuyển đổi inputData của mỗi đối tượng từ chuỗi JSON thành đối tượng JavaScript
      let transformedData = combinedProjects.map((item) => ({
        ...item,
        inputData: JSON.parse(item.inputData),
      }));

      const sortedProjects = [...transformedData].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
      setFinances(sortedProjects);
      setIsLoading(false);
    };
    if (user) {
      loadFinances();
    }
  }, [user]);

  const navigate = useNavigate();

  const handleProjectClick = async (finance) => {
    navigate(`/financials/${finance.id}`);
  };

  const myProjectColumns = [
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
      title: "Owner",
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
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <>
          <button onClick={() => handleProjectClick(record)}>
            {record?.inputData?.industry
              ? record?.inputData?.industry
              : "Waiting for setup"}
          </button>
        </>
      ),
    },
    {
      title: "Duration",
      dataIndex: "selectedDuration",
      key: "selectedDuration",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.selectedDuration
            ? record?.inputData?.selectedDuration
            : "Waiting for setup"}
        </div>
      ),
    },
    {
      title: "Start year",
      dataIndex: "startYear",
      key: "startYear",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.startMonth && record?.inputData?.startYear ? (
            <>
              {record?.inputData?.startMonth < 10
                ? `0${record?.inputData?.startMonth}`
                : record?.inputData?.startMonth}{" "}
              - {record?.inputData?.startYear}
            </>
          ) : (
            "Waiting for setup"
          )}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <Tooltip title="Customer of 1st year">
          <div
            onClick={() => handleProjectClick(record)}
            className="flex justify-end items-end hover:cursor-pointer"
          >
            {record?.inputData?.yearlyAverageCustomers
              ? formatNumber(record?.inputData?.yearlyAverageCustomers[0])
              : "Waiting for setup"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "Revenue",
      key: "Revenue",

      render: (text, record) => (
        <Tooltip title="Revenue of 1st year">
          <div
            className="flex justify-end items-end hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            {record?.inputData?.yearlySales
              ? `${getCurrencyLabelByKey(
                  record?.inputData?.currency
                )}${formatNumber(record?.inputData?.yearlySales[0])}`
              : "Waiting for setup"}
          </div>
        </Tooltip>
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
              <div
                className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
              >
                Action
              </div>
            </Dropdown>
          ) : (
            <div
              onClick={() => handleProjectClick(record)}
              className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
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
  const sharedProjectColumns = [
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
      title: "Owner",
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
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <>
          <button onClick={() => handleProjectClick(record)}>
            {record?.inputData?.industry
              ? record?.inputData?.industry
              : "Waiting for setup"}
          </button>
        </>
      ),
    },
    {
      title: "Duration",
      dataIndex: "selectedDuration",
      key: "selectedDuration",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.selectedDuration
            ? record?.inputData?.selectedDuration
            : "Waiting for setup"}
        </div>
      ),
    },
    {
      title: "Start year",
      dataIndex: "startYear",
      key: "startYear",
      render: (text, record) => (
        <div
          onClick={() => handleProjectClick(record)}
          className="flex justify-end items-end hover:cursor-pointer"
        >
          {record?.inputData?.startMonth && record?.inputData?.startYear ? (
            <>
              {record?.inputData?.startMonth < 10
                ? `0${record?.inputData?.startMonth}`
                : record?.inputData?.startMonth}{" "}
              - {record?.inputData?.startYear}
            </>
          ) : (
            "Waiting for setup"
          )}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (text, record) => (
        <Tooltip title="Customer of 1st year">
          <div
            onClick={() => handleProjectClick(record)}
            className="flex justify-end items-end hover:cursor-pointer"
          >
            {record?.inputData?.yearlyAverageCustomers
              ? formatNumber(record?.inputData?.yearlyAverageCustomers[0])
              : "Waiting for setup"}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Revenue",
      dataIndex: "Revenue",
      key: "Revenue",

      render: (text, record) => (
        <Tooltip title="Revenue of 1st year">
          <div
            className="flex justify-end items-end hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            {record?.inputData?.yearlySales
              ? `${getCurrencyLabelByKey(
                  record?.inputData?.currency
                )}${formatNumber(record?.inputData?.yearlySales[0])}`
              : "Waiting for setup"}
          </div>
        </Tooltip>
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
              <div
                className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
              >
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

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleAssign = async (projectId) => {
    setIsAssignModalOpen(true);

    setSelectedID(projectId);
  };

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const handleInvite = async (projectId) => {
    setIsInviteModalOpen(true);

    setSelectedID(projectId);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SelectedID, setSelectedID] = useState();
  const handleDelete = async (projectId) => {
    // Hiển thị modal xác nhận xóa
    setIsDeleteModalOpen(true);
    // Lưu projectId của dự án cần xóa
    setSelectedID(projectId);
  };

  const confirmDelete = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("finance")
        .delete()
        .eq("id", SelectedID);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedProjectsCopy = finances.filter(
          (finance) => finance.id !== SelectedID
        );
        setFinances(updatedProjectsCopy);

        message.success("Deleted financial project.");
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

  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [name, setName] = useState("");

  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  const handleClickAddNew = () => {
    setIsAddNewModalOpen(true);
  };

  const confirmAddNew = async () => {
    try {
      if (!name) {
        message.warning("Project name is required.");
        return;
      }
      // Tạo một dự án mới và lưu vào Supabase
      const { data, error } = await supabase
        .from("finance")
        .insert([
          {
            name: name,
            user_id: user.id,
            user_email: user.email, // Thêm giá trị is_public
            inputData: { financialProjectName: name },
          },
        ])
        .select();
      if (error) {
        message.error(error.message);
        console.log("Error creating project:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Tạo dự án thành công, đóng modal sau khi tạo

        setFinances([data[0], ...finances]);
        message.success("Created financial project successfully.");
        setIsAddNewModalOpen(false);
      }
    } catch (error) {
      message.log(error);
    }
  };

  const [email, setEmail] = useState("elonmusk@gmail.com");

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
        .from("finance")
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
        .from("finance")
        .update({ user_id: userId, user_email: email })
        .eq("id", SelectedID);

      if (updateError) {
        console.log("Error updating project data:", updateError);
        message.error(updateError.message);
        return;
      }

      message.success("Assign project successfully");
      const updatedProjectsCopy = finances?.filter(
        (finance) => finance.id !== SelectedID
      );
      setFinances(updatedProjectsCopy);
    } catch (error) {
      console.log("Error inviting user:", error);
      message.error(error.message);
    } finally {
      setIsAssignModalOpen(false);
    }
  };

  const [invited_type, setInvited_type] = useState("View only");
  const [inviteEmail, setInviteEmail] = useState("elonmusk@gmail.com");

  const handleConfirmInvite = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: projectData, error: fileError } = await supabase
        .from("finance")
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
        .from("finance")
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

  const myProjects = finances.filter((project) => project.user_id === user.id);

  const sharedProjects = finances.filter(
    (project) => project.user_id !== user.id
  );

  return (
    <div className=" bg-white">
      <HomeHeader />

      <div className="mt-24 p-4 border-gray-300 border-dashed rounded-md darkBorderGray min-h-[96vh]">
        <main className="w-full min-h-[92.5vh]">
          {isDeleteModalOpen && (
            <Modal
              title="Confirm Delete"
              open={isDeleteModalOpen}
              onOk={confirmDelete}
              onCancel={() => {
                setIsDeleteModalOpen(false);
                setSelectedID("");
              }}
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
              Are you sure you want to delete this project{" "}
              <span className="text-[#f5222d] font-semibold">
                {myProjects.find((project) => project.id === SelectedID)?.name}
              </span>
              ?
            </Modal>
          )}
          {isAddNewModalOpen && (
            <Modal
              title="Add new financial project"
              open={isAddNewModalOpen}
              onOk={confirmAddNew}
              onCancel={() => setIsAddNewModalOpen(false)}
              okText="Create"
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
                label="Financial name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
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
                  <span className="ml-2 text-gray-700 text-sm">
                    Collaborate
                  </span>
                </label>
              </div>
            </Modal>
          )}

          <ReactModal
            isOpen={isPricingOpen}
            onRequestClose={() => setIsPricingOpen(false)}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: "gray", // Màu nền overlay
                position: "fixed", // Để nền overlay cố định
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998, // Chỉ số z để đảm bảo nó hiển thị trên cùng
              },
              content: {
                border: "none", // Để ẩn border của nội dung Modal
                background: "none", // Để ẩn background của nội dung Modal
                // margin: "auto", // Để căn giữa
              },
            }}
          >
            <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
              <div className="relative p-5 bg-white w-full  m-auto flex-col flex rounded-md">
                <PricingWithLemon />
                <div className="mt-4 flex items-center gap-10">
                  <button
                    className="max-w-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
                    onClick={() => setIsPricingOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </ReactModal>

          <section className="container px-4 mx-auto">
            <h1 className="text-4xl text-center my-2 font-bold">
              Financial Listing Dashboard
            </h1>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-center flex justify-center items-center">
                My Projects
              </h2>

              <button
                className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-2 text-center darkBgBlue darkFocus`}
                onClick={handleClickAddNew}
              >
                <PlusOutlined className="mr-1" />
                Add new
              </button>
            </div>
            <div className="flex flex-col mb-8">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                    <Table
                      columns={myProjectColumns}
                      dataSource={myProjects}
                      pagination={{
                        position: ["bottomLeft"],
                      }}
                      rowKey="id"
                      size="small"
                      bordered
                      loading={isLoading}
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
                      columns={sharedProjectColumns}
                      dataSource={sharedProjects}
                      pagination={{
                        position: ["bottomLeft"],
                      }}
                      rowKey="id"
                      size="small"
                      bordered
                      loading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default FinancialList;
