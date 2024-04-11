import React, { useEffect, useState } from "react";
import AlertMsg from "../../components/AlertMsg";
import SideBar from "../../components/SideBar";
import ReactModal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Table, Tooltip, message } from "antd";
import { formatDate } from "../../features/DurationSlice";
import { PlusOutlined } from "@ant-design/icons";
import InputField from "../../components/InputField";
import PricingWithLemon from "../Home/Components/PricingWithLemon";
// import { toast } from "react-toastify";

function FinancialList() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [finances, setFinances] = useState([]);
  const { user, subscribed } = useAuth();

  useEffect(() => {
    // Tải danh sách finance từ Supabase dựa trên user.id
    const loadFinances = async () => {
      const { data, error } = await supabase
        .from("finance")
        .select("*")
        .filter("user_id", "eq", user?.id);

      if (error) {
        message.error(error.message);
        console.error("Lỗi khi tải danh sách finance:", error.message);
      } else {
        // Chuyển đổi inputData của mỗi đối tượng từ chuỗi JSON thành đối tượng JavaScript
        let transformedData = data.map((item) => ({
          ...item,
          inputData: JSON.parse(item.inputData),
        }));

        setFinances(transformedData);
      }
    };

    loadFinances();
  }, [user.id]);

  useEffect(() => {
    const sortedProjects = [...finances].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setFinances(sortedProjects);
  }, [finances.length]);

  const navigate = useNavigate();

  const handleProjectClick = async (finance) => {
    navigate(`/financials/${finance.id}`);
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
        <>
          <button onClick={() => handleProjectClick(record)}>
            {record?.inputData?.selectedDuration
              ? record?.inputData?.selectedDuration
              : "Waiting for setup"}
          </button>
        </>
      ),
    },
    {
      title: "Start year",
      dataIndex: "startYear",
      key: "startYear",
      render: (text, record) => (
        <>
          <button onClick={() => handleProjectClick(record)}>
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
          </button>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Button
          onClick={() => handleDelete(record.id)}
          style={{ fontSize: "12px" }}
          className="hover:cursor-pointer bg-red-500 text-white"
        >
          Delete
        </Button>
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
    }
  };

  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [name, setName] = useState("");

  const [isPricingOpen, setIsPricingOpen] = useState(false); // State để kiểm soát modal Pricing
  const handleClickAddNew = () => {
    if (!needPremium) {
      setIsAddNewModalOpen(true);
    } else {
      setIsPricingOpen(true);
    }
  };

  const confirmAddNew = async () => {
    try {
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
        console.error("Error creating project:", error);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Tạo dự án thành công, đóng modal sau khi tạo

        setFinances([data[0], ...finances]);
        message.success("Created financial project successfully.");
      }
    } catch (error) {
      message.error(error);
    } finally {
      setIsAddNewModalOpen(false);
    }
  };

  const [needPremium, setNeedPremium] = useState(false);
  useEffect(() => {
    if (finances.length >= 4 && !subscribed) {
      setNeedPremium(true);
    } else {
      setNeedPremium(false);
    }
  }, [finances.length]);

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
                      borderColor: "black",
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
              {isAddNewModalOpen && (
                <Modal
                  title="Add new financial project"
                  visible={isAddNewModalOpen}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    My Financial Projects
                  </h2>
                  {needPremium ? (
                    <Tooltip
                      title={`You need to upgrade your plan to create more financial projects. 'Click' to update your plan!`}
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
                          dataSource={finances}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialList;
