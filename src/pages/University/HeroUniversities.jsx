import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Button,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Modal,
  Table,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import moment from "moment";
import { formatDate } from "../../features/DurationSlice";

const HeroUniversities = ({ university, onSelectCode }) => {
  const { user } = useAuth();

  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [competitionName, setCompetitionName] = useState(""); // New state for competition name
  const [expirationDate, setExpirationDate] = useState(null);
  const [newExpirationDate, setNewExpirationDate] = useState(null); // New state for new expiration date
  const [selectedCode, setSelectedCode] = useState(null);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const [codeData, setCodeData] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});
  const [projectList, setProjectList] = useState();

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data: codes, error } = await supabase
          .from("code")
          .select("*")
          .contains("universityCode", [`${university}`]);

        if (error) {
          throw error;
        }

        const projectCounts = await fetchProjectCounts(codes);

        setCodeData(
          codes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
        setProjectCounts(projectCounts);
      } catch (error) {
        console.error("Error fetching code data:", error);
      }
    };

    fetchCodeData();
  }, [university]);

  const filterProjectsByCode = async (code) => {
    try {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .contains("universityCode", [code]);

      if (error) {
        throw error;
      }

      const parsedProjects = projects.map((project) => ({
        ...project,
        applyInfo: JSON.parse(project.applyInfo),
      }));

      setProjectList(parsedProjects);
    } catch (error) {
      console.error("Error fetching projects for code:", error);
    }
  };

  console.log("projectList", projectList);

  const fetchProjectCounts = async (codes) => {
    const counts = {};

    for (const code of codes) {
      const { count, error } = await supabase
        .from("projects")
        .select("id", { count: "exact" })
        .contains("universityCode", [code.code]);

      if (error) {
        console.error("Error fetching project count:", error);
        counts[code.id] = 0;
      } else {
        counts[code.id] = count;
      }
    }

    return counts;
  };

  const handleAddNewCode = async () => {
    if (!newCode || !expirationDate || !competitionName) {
      message.error("Please enter all required fields");
      return;
    }

    const { data, error } = await supabase
      .from("code")
      .insert([
        {
          code: newCode,
          expired_at: expirationDate.format("YYYY-MM-DD"),
          universityCode: [`${university}`],
          name: competitionName, // Add this line
        },
      ])
      .select();

    if (error) {
      message.error("Failed to add new code");
      console.error(error);
    } else {
      message.success("New code added successfully");
      setCodeData((prev) =>
        [data[0], ...prev].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
      const updatedCounts = await fetchProjectCounts([data[0]]);
      setProjectCounts((prevCounts) => ({
        ...prevCounts,
        ...updatedCounts,
      }));
      setIsAddNewModalOpen(false);
      setNewCode("");
      setExpirationDate(null);
      setCompetitionName(""); // Reset the competition name
    }
  };

  const handleEditCode = async () => {
    if (!selectedCode || !newCode || !newExpirationDate || !competitionName) {
      message.error("Please enter all required fields");
      return;
    }

    const { data, error } = await supabase
      .from("code")
      .update({
        code: newCode,
        expired_at: newExpirationDate.format("YYYY-MM-DD"),
        name: competitionName, // Add this line
      })
      .eq("id", selectedCode.id)
      .select();

    if (error) {
      message.error("Failed to update code");
      console.error(error);
    } else {
      message.success("Code updated successfully");
      setCodeData((prev) =>
        prev
          .map((item) => (item.id === selectedCode.id ? data[0] : item))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      const updatedCounts = await fetchProjectCounts([data[0]]);
      setProjectCounts((prevCounts) => ({
        ...prevCounts,
        ...updatedCounts,
      }));
      setIsEditModalOpen(false);
      setNewCode("");
      setExpirationDate(null);
      setNewExpirationDate(null);
      setCompetitionName(""); // Reset the competition name
    }
  };

  const handleDeleteCode = async () => {
    const { error } = await supabase
      .from("code")
      .delete()
      .eq("id", codeToDelete);

    if (error) {
      message.error("Failed to delete code");
      console.error(error);
    } else {
      message.success("Code deleted successfully");
      setCodeData((prev) => prev.filter((item) => item.id !== codeToDelete));
      setIsDeleteModalOpen(false);
      setCodeToDelete(null);
    }
  };

  const openEditModal = (record) => {
    setSelectedCode(record);
    setNewCode(record.code);
    setCompetitionName(record.name); // Set competition name
    setExpirationDate(record.expired_at ? moment(record.expired_at) : null);
    setNewExpirationDate(null); // Reset new expiration date
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setCodeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const codeColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{codeData?.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Competition Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{record.name}</span>
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{record.code}</span>
      ),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      align: "center",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {formatDate(record.created_at)}
        </span>
      ),
    },
    {
      title: "Expired at",
      dataIndex: "expired_at",
      key: "expired_at",
      align: "center",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {formatDate(record.expired_at)}
        </span>
      ),
    },
    {
      title: "Number of Profiles",
      dataIndex: "number_of_used",
      key: "number_of_used",
      render: (text, record) => projectCounts[record.id] || 0,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          className="flex items-center justify-center"
          overlay={
            <Menu>
              <>
                <Menu.Item key="edit">
                  <div
                    onClick={() => openEditModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Edit
                  </div>
                </Menu.Item>
                <Menu.Item key="delete">
                  <div
                    onClick={() => openDeleteModal(record.id)}
                    style={{ fontSize: "12px" }}
                  >
                    Delete
                  </div>
                </Menu.Item>
              </>
            </Menu>
          }
        >
          <div className="bg-blue-600 rounded-md max-w-[5rem] text-white py-1 hover:cursor-pointer">
            Action
          </div>
        </Dropdown>
      ),
    },
  ];

  const projectByCodeColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{projectList?.indexOf(record) + 1}</span>
      ),
    },
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{record?.name}</span>
      ),
    },
    {
      title: "Creator",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.creatorName}
        </span>
      ),
    },
    {
      title: "Applied at",
      dataIndex: "applyAt",
      key: "applyAt",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {formatDate(record?.applyInfo.applyAt)}
        </span>
      ),
    },
    {
      title: "Contact Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.contactEmail}
        </span>
      ),
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.contactPhone}
        </span>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.university}
        </span>
      ),
    },
    {
      title: "Team size",
      dataIndex: "teamSize",
      key: "teamSize",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.teamSize}
        </span>
      ),
    },
    {
      title: "Team Emails",
      dataIndex: "teamEmails",
      key: "teamEmails",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record?.applyInfo.teamEmails}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Dropdown
          className="flex items-center justify-center"
          overlay={
            <Menu>
              <>
                <Menu.Item key="edit">
                  <div
                    onClick={() => openEditModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Edit
                  </div>
                </Menu.Item>
                <Menu.Item key="delete">
                  <div
                    onClick={() => openDeleteModal(record.id)}
                    style={{ fontSize: "12px" }}
                  >
                    Delete
                  </div>
                </Menu.Item>
              </>
            </Menu>
          }
        >
          <div className="bg-blue-600 rounded-md max-w-[5rem] text-white py-1 hover:cursor-pointer">
            Action
          </div>
        </Dropdown>
      ),
    },
  ];

  console.log("selectedCode", selectedCode);

  return (
    <section className="bg-white mt-12">
      {" "}
      {/* Add margin-top */}
      <div className="sm:px-6 px-3 py-16 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl"
            style={{ lineHeight: "1.5" }}
          >
            Profile listing for{" "}
            <span className="text-blue-600 bg-yellow-300 h-6">
              {university}.
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-800">
            Create a fundraising profile and get discovered by investors. It
            will be easy, fast and well-structured.
          </p>
          <div className="mt-7 flex justify-center">
            {" "}
            {/* Add justify-center class */}
            {user && (
              <button
                className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  setNewCode("");
                  setExpirationDate(null);
                  setCompetitionName(""); // Reset competition name
                  setIsAddNewModalOpen(true);
                }}
              >
                Create A Competition
              </button>
            )}
          </div>
        </div>

        <section className="container px-4 mx-auto mt-14">
          <div className="flex flex-col mb-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                <h3 className="font-bold text-xl text-left mb-5">
                  Code listing
                </h3>

                <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                  <Table
                    columns={codeColumns}
                    dataSource={codeData}
                    pagination={{
                      position: ["bottomLeft"],
                    }}
                    rowKey="id"
                    size="small"
                    bordered
                    onRow={(record) => ({
                      onClick: () => {
                        setSelectedCode(record);
                        onSelectCode(record.code);
                        filterProjectsByCode(record.code);
                      },
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {projectList && (
          <section className="container px-4 mx-auto mt-14">
            <div className="flex flex-col mb-5">
              <h2 className="text-xl font-bold text-left">
                Project listing by {selectedCode?.code}
              </h2>
              <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                <Table
                  columns={projectByCodeColumns}
                  dataSource={projectList}
                  pagination={{
                    position: ["bottomLeft"],
                  }}
                  rowKey="id"
                  size="small"
                  bordered
                  scroll={{
                    x: true,
                  }}
                />
              </div>
            </div>
          </section>
        )}

        <Modal
          title="Add new Competition"
          open={isAddNewModalOpen}
          onOk={handleAddNewCode}
          onCancel={() => setIsAddNewModalOpen(false)}
          okText="Save"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          centered={true}
        >
          <div
            key="1"
            className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="competition_name">Competition Name</label>
                  <div className="flex items-center">
                    <Input
                      id="competition_name"
                      placeholder="Enter competition name"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={competitionName}
                      onChange={(e) => setCompetitionName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="code">Name (CODE)</label>
                  <div className="flex items-center">
                    <Input
                      id="code"
                      placeholder="Enter your code"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="expired_at">Expired at</label>
                  <div className="flex items-center">
                    <DatePicker
                      id="expired_at"
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                      value={expirationDate}
                      onChange={(date) => setExpirationDate(date)}
                      style={{ width: "100%" }}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          title="Edit Code"
          open={isEditModalOpen}
          onOk={handleEditCode}
          onCancel={() => setIsEditModalOpen(false)}
          okText="Save"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          centered={true}
        >
          <div
            key="2"
            className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="edit_competition_name">
                    Competition Name
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="edit_competition_name"
                      placeholder="Enter competition name"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={competitionName}
                      onChange={(e) => setCompetitionName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit_code">Code</label>
                  <div className="flex items-center">
                    <Input
                      id="edit_code"
                      placeholder="Enter your code"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit_expired_at">Expired at (Old)</label>
                  <div className="flex items-center">
                    <DatePicker
                      id="edit_expired_at"
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                      value={expirationDate}
                      style={{ width: "100%" }}
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="new_expired_at">Expired at (New)</label>
                  <div className="flex items-center">
                    <DatePicker
                      id="new_expired_at"
                      format="DD/MM/YYYY"
                      placeholder="Select new date"
                      value={newExpirationDate}
                      onChange={(date) => setNewExpirationDate(date)}
                      style={{ width: "100%" }}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>

        {isDeleteModalOpen && (
          <Modal
            title="Confirm Delete"
            open={isDeleteModalOpen}
            onOk={handleDeleteCode}
            onCancel={() => setIsDeleteModalOpen(false)}
            okText="Delete"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer",
              },
            }}
            okButtonProps={{
              style: {
                background: "#f5222d",
                borderColor: "#f5222d",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer",
              },
            }}
            centered={true}
          >
            Are you sure you want to delete it?
          </Modal>
        )}
      </div>
    </section>
  );
};

export default HeroUniversities;
