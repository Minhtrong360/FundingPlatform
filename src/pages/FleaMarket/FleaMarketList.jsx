import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Menu,
  Modal,
  Row,
  Table,
  Tooltip,
  message,
} from "antd";
import SideBar from "../../components/SideBar";
import AlertMsg from "../../components/AlertMsg";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import FleaMarketForm from "./FleaMarketForm";
import { formatNumber } from "../../features/CostSlice";

function FleaMarketList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();
  const [needPremium, setNeedPremium] = useState(false);
  const [fleaMarketData, setFleaMarketData] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    // Function to fetch Flea Market data from Supabase
    const fetchFleaMarketData = async () => {
      try {
        const { data, error } = await supabase
          .from("fleamarket")
          .select("*")
          .eq("email", user?.email);
        if (error) {
          throw error;
        }
        setFleaMarketData(data);
      } catch (error) {
        console.error("Error fetching Flea Market data:", error.message);
      }
    };

    // Call the function to fetch data when component mounts
    fetchFleaMarketData();
  }, []);

  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleClickAddNew = () => {
    if (!needPremium) {
      setIsAddNewModalOpen(true);
    } else {
      navigate("/pricing");
    }
  };

  const handleEdit = (fleaMarket) => {
    console.log("fleaMarket", fleaMarket);
    setIsEditModalOpen(true);
    setSelectedID(fleaMarket?.id);
  };

  const handleAssign = () => {
    console.log("assign");
  };

  const columns = [
    {
      title: "Company name",
      dataIndex: "company",
      key: "company",
      render: (text, record) => (
        <Row align="middle">
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
    { title: "Country", dataIndex: "country", key: "country" },

    { title: "Industry", dataIndex: "industry", key: "industry" },

    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Shares", dataIndex: "shares", key: "shares" },

    { title: "Time Invested", dataIndex: "timeInvested", key: "timeInvested" },
    {
      title: "Amount Invested",
      dataIndex: "amountInvested",
      key: "amountInvested",
      render: (text, record) => (
        <div
          className="ml-2 truncate"
          style={{ maxWidth: "100%" }}
          title={record.company}
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
                      onClick={() => handleAssign(record)}
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
  console.log("SelectedID", SelectedID);
  return (
    <div className=" bg-white darkBg antialiased !p-0 ">
      <div id="exampleWrapper">
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className="p-4 pl-4 sm:pl-0 sm:ml-16 ml-0 "
          onClick={() => setIsSidebarOpen(false)}
        >
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-md darkBorderGray min-h-[96vh]">
            <main className="w-full min-h-[92.5vh]">
              <AlertMsg />

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
                      <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
                        <Table
                          columns={columns}
                          dataSource={fleaMarketData}
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
              {isAddNewModalOpen && (
                <FleaMarketForm
                  isAddNewModalOpen={isAddNewModalOpen}
                  setIsAddNewModalOpen={setIsAddNewModalOpen}
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
                  visible={isDeleteModalOpen}
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
                  Are you sure you want to delete this project?
                </Modal>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleaMarketList;
