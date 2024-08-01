import { useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  Menu,
  Modal,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import SideBar from "../../components/SideBar";

import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import FleaMarketForm from "./FleaMarketForm";
import { formatNumber } from "../../features/CostSlice";
import InputField from "../../components/InputField";
import FleaMarketDetail from "./FleaMarketDetail";
import PricingWithLemon from "../Home/Components/PricingWithLemon";
import ReactModal from "react-modal";

function FleaMarketList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [needPremium, setNeedPremium] = useState(false);
  const [fleaMarketData, setFleaMarketData] = useState([]);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("elonmusk@gmail.com");

  const { user, subscribed } = useAuth();

  useEffect(() => {
    // Function to fetch Flea Market data from Supabase
    const fetchFleaMarketData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("fleamarket")
          .select("*")
          .eq("email", user?.email);
        if (error) {
          throw error;
        }
        setFleaMarketData(data);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching Flea Market data:", error);
        setIsLoading(false);
      }
    };

    // Call the function to fetch data when component mounts
    fetchFleaMarketData();
  }, [isEditModalOpen, isAssignModalOpen, isAddNewModalOpen, user?.email]);

  useEffect(() => {
    if (fleaMarketData.length >= 2 && !subscribed) {
      setNeedPremium(true);
    } else {
      setNeedPremium(false);
    }
  }, [fleaMarketData.length, subscribed]);

  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  const handleClickAddNew = () => {
    if (!needPremium) {
      setIsAddNewModalOpen(true);
    } else {
      setIsPricingOpen(true);
    }
  };

  const handleEdit = (fleaMarket) => {
    setIsEditModalOpen(true);
    setSelectedID(fleaMarket?.id);
  };

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const handleProjectClick = (fleaMarket) => {
    setSelectedID(fleaMarket.id);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      title: "Company name",
      dataIndex: "company",
      key: "company",
      render: (text, record) => (
        <Row
          align="middle"
          className="hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          <Avatar
            shape="square"
            size={32}
            src={record.companyLogo ? record.companyLogo : null}
            icon={!record.companyLogo && <UserOutlined />}
          />
          <div
            className="ml-2 truncate"
            style={{ maxWidth: "100%" }}
            title={record.company}
          >
            {record.company}
          </div>
        </Row>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {record.country}
        </div>
      ),
    },

    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {record.industry}
        </div>
      ),
    },

    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.price)}
        </div>
      ),
    },
    {
      title: "Shares",
      dataIndex: "shares",
      key: "shares",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.shares)}
        </div>
      ),
    },

    {
      title: "Time Invested",
      dataIndex: "timeInvested",
      key: "timeInvested",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {record.timeInvested}
        </div>
      ),
    },
    {
      title: "Amount Invested",
      dataIndex: "amountInvested",
      key: "amountInvested",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          // title={record.company}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.amountInvested)}
        </div>
      ),
    },
    {
      title: "Action/Roles",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
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
                </>
              </Menu>
            }
          >
            <div className="w-[6rem] bg-blue-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-md py-1 text-center darkBgBlue darkHoverBgBlue darkFocus cursor-pointer">
              Action
            </div>
          </Dropdown>
        </>
      ),
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [SelectedID, setSelectedID] = useState("");
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
        .from("fleamarket")
        .delete()
        .eq("id", SelectedID);

      if (error) {
        console.error("Error deleting project:", error);
      } else {
        const updatedFleaMarketCopy = fleaMarketData.filter(
          (flea) => flea.id !== SelectedID
        );
        setFleaMarketData(updatedFleaMarketCopy);

        message.success("Deleted Flea-Market project.");
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error deleting project:", error);
    } finally {
      // Đóng modal sau khi xóa hoặc xảy ra lỗi
      setIsDeleteModalOpen(false);
    }
  };

  const handleAssign = async (projectId) => {
    setIsAssignModalOpen(true);

    setSelectedID(projectId);
  };

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

      const { error: updateError } = await supabase
        .from("fleamarket")
        .update({ email: email })
        .eq("id", SelectedID);

      if (updateError) {
        console.log("Error updating flea-market data:", updateError);
        message.error(updateError.message);
        return;
      }

      message.success("Assign project successfully");
      setSelectedID("");
      setEmail("elonmusk@gmail.com");
    } catch (error) {
      console.log("Error assign:", error);
      message.error(error.message);
    } finally {
      setIsAssignModalOpen(false);
    }
  };

  return (
    <div className=" bg-white darkBg antialiased !p-0 ">
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0 "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-4 border-gray-300 border-dashed rounded-md darkBorderGray min-h-[96vh]">
            <main className="w-full min-h-[92.5vh]">
              <section className="container px-4 mx-auto mt-14">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold ">
                    My Flea-Market Projects
                  </h2>
                  {needPremium ? (
                    <Tooltip
                      title={`You need to upgrade your plan to create more Flea-Market projects. 'Click' to update your plan!`}
                      color="gray"
                      zIndex={20000}
                    >
                      <button
                        className={`text-white opacity-50 bg-gray-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
                        onClick={handleClickAddNew}
                      >
                        <PlusOutlined className="mr-1" />
                        Add new
                      </button>
                    </Tooltip>
                  ) : (
                    <>
                      <button
                        className={`text-white bg-blue-600 "hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-2 text-center darkBgBlue darkFocus`}
                        onClick={handleClickAddNew}
                      >
                        <PlusOutlined className="mr-1" />
                        Add new
                      </button>
                    </>
                  )}
                </div>
                <div className="flex flex-col mb-8">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                        <Table
                          columns={columns}
                          dataSource={fleaMarketData}
                          pagination={false}
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
              {isAddNewModalOpen && (
                <FleaMarketForm
                  isAddNewModalOpen={isAddNewModalOpen}
                  setIsAddNewModalOpen={setIsAddNewModalOpen}
                  setSelectedID={setSelectedID}
                />
              )}

              {isEditModalOpen && (
                <FleaMarketForm
                  isAddNewModalOpen={isEditModalOpen}
                  setIsAddNewModalOpen={setIsEditModalOpen}
                  SelectedID={SelectedID}
                  setSelectedID={setSelectedID}
                />
              )}

              {isDeleteModalOpen && (
                <Modal
                  title="Confirm Delete"
                  open={isDeleteModalOpen}
                  onOk={confirmDelete}
                  onCancel={() => setIsDeleteModalOpen(false)}
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
                      fleaMarketData?.find(
                        (project) => project.id === SelectedID
                      )?.name
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

              {isDetailModalOpen && (
                <FleaMarketDetail
                  isDetailModalOpen={isDetailModalOpen}
                  setIsDetailModalOpen={setIsDetailModalOpen}
                  SelectedID={SelectedID}
                  setSelectedID={setSelectedID}
                />
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
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleaMarketList;
