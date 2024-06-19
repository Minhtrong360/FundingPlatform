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

const HeroUniversities = ({ university, onSelectCode, setCompanies }) => {
  const { user } = useAuth();
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [newExpirationDate, setNewExpirationDate] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [codeToDelete, setCodeToDelete] = useState(null);
  const [codeData, setCodeData] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});
  const [projectList, setProjectList] = useState([]);

  const [score, setScore] = useState(0);
  const [judgeName, setJudgeName] = useState("");
  const [judgeEmail, setJudgeEmail] = useState("");

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
      // Lấy danh sách projects từ bảng projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .contains("universityCode", [code]);

      if (projectsError) {
        throw projectsError;
      }

      // Lấy project_id từ danh sách projects
      const projectIds = projects.map((project) => project.id);

      // Lấy thông tin company từ bảng company dựa trên project_id
      const { data: companies, error: companiesError } = await supabase
        .from("company")
        .select("*")
        .in("project_id", projectIds);

      if (companiesError) {
        throw companiesError;
      }

      // Kết hợp thông tin từ hai bảng
      const combinedProjects = projects.map((project) => {
        const parsedApplyInfo = project.applyInfo.map((info) =>
          JSON.parse(info)
        );

        const companyInfo = companies.find(
          (company) => company.project_id === project.id
        );

        return {
          ...project,
          applyInfo: parsedApplyInfo,
          company: companyInfo, // Thêm thông tin company vào project
        };
      });

      // Lưu thông tin vào state
      setProjectList(combinedProjects);
    } catch (error) {
      console.error("Error fetching projects and companies for code:", error);
    }
  };

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
          name: competitionName,
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
      setCompetitionName("");
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
        name: competitionName,
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
      setCompetitionName("");
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

  const handlePublishCode = async () => {
    const { data, error } = await supabase
      .from("code")
      .update({ publish: true })
      .eq("id", selectedCode.id)
      .select();

    if (error) {
      message.error("Failed to publish code");
      console.error(error);
    } else {
      message.success("Code published successfully");
      setCodeData((prev) =>
        prev.map((item) => (item.id === selectedCode.id ? data[0] : item))
      );
      setIsPublishModalOpen(false);
    }
  };

  const handleAddJudge = async () => {
    const updatedJudges = [
      ...selectedCode?.judges,
      { name: judgeName, email: judgeEmail },
    ];
    const { data, error } = await supabase
      .from("code")
      .update({ judges: updatedJudges })
      .eq("id", selectedCode.id)
      .select();

    if (error) {
      message.error("Failed to add judge");
      console.error(error);
    } else {
      message.success("Judge added successfully");
      setCodeData((prev) =>
        prev.map((item) => (item.id === selectedCode.id ? data[0] : item))
      );
      setSelectedCode(data[0]); // Update the selectedCode state to reflect the change
      setJudgeName("");
      setJudgeEmail("");
    }
  };

  const handleRemoveProjectCode = async (projectId, codeToRemove) => {
    try {
      // Fetch the project data
      const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("universityCode")
        .eq("id", projectId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Remove the specific code from the universityCode array
      const updatedUniversityCode = project.universityCode.filter(
        (code) => code !== codeToRemove
      );

      // Update the project with the new universityCode array
      const { error: updateError } = await supabase
        .from("projects")
        .update({ universityCode: updatedUniversityCode })
        .eq("id", projectId);

      if (updateError) {
        throw updateError;
      }
      message.success("Project code removed successfully");
      setProjectList((prev) => prev.filter((item) => item.id !== projectId));
      setCompanies((prev) =>
        prev.filter((item) => item.project_id !== projectId)
      );
    } catch (error) {
      message.error("Failed to remove project code");
      console.error(error);
    }
  };

  const handleScoreProject = async (projectId) => {
    const project = projectList.find((proj) => proj.id === projectId);
    if (
      !project ||
      !selectedCode.judges.some(
        (judge) => JSON.parse(judge).email === user.email
      )
    ) {
      message.error("You can not score this project");
      return;
    }

    console.log("project", project);

    // Parse applyInfo array
    const applyInfoArray = project?.applyInfo;
    const applyInfoIndex = applyInfoArray.findIndex(
      (info) => info.universityCode === selectedCode.code
    );

    if (applyInfoIndex === -1) {
      message.error("No matching applyInfo found for this universityCode");
      return;
    }

    // Update the score in the correct applyInfo object
    applyInfoArray[applyInfoIndex].score = score;

    try {
      // Update the project in the database
      const { data, error } = await supabase
        .from("projects")
        .update({
          applyInfo: applyInfoArray.map((info) => JSON.stringify(info)),
        })
        .eq("id", projectId)
        .select();

      if (error) {
        throw error;
      }

      // Update the project list in the local state
      const updatedProjects = projectList.map((proj) =>
        proj.id === projectId ? { ...proj, applyInfo: applyInfoArray } : proj
      );
      setProjectList(updatedProjects);
      message.success("Score updated successfully");
    } catch (error) {
      message.error("Failed to update score");
      console.error("Error updating score:", error);
    } finally {
      setIsScoreModalOpen(false);
      setScore(0);
    }
  };

  const openEditModal = (record) => {
    setSelectedCode(record);
    setNewCode(record.code);
    setCompetitionName(record.name);
    setExpirationDate(record.expired_at ? moment(record.expired_at) : null);
    setNewExpirationDate(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setCodeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const openPublishModal = (record) => {
    setSelectedCode(record);
    setIsPublishModalOpen(true);
  };

  const openJudgeModal = (record) => {
    setSelectedCode(record);
    setIsJudgeModalOpen(true);
  };

  const [selectedProject, setSelectedProject] = useState();
  const openScoreModal = (record) => {
    setSelectedProject(record);
    const applyInfo = record?.applyInfo?.find(
      (info) => info.universityCode === selectedCode.code
    );

    // Set score from the found applyInfo or default to 0
    setScore(applyInfo?.score || 0);
    setIsScoreModalOpen(true);
  };

  const handleRemoveJudge = async (judgeEmail) => {
    const updatedJudges = selectedCode.judges.filter(
      (judge) => JSON.parse(judge).email !== judgeEmail
    );
    const { data, error } = await supabase
      .from("code")
      .update({ judges: updatedJudges })
      .eq("id", selectedCode.id)
      .select();

    if (error) {
      message.error("Failed to remove judge");
      console.error(error);
    } else {
      message.success("Judge removed successfully");
      setCodeData((prev) =>
        prev.map((item) => (item.id === selectedCode.id ? data[0] : item))
      );
      setSelectedCode(data[0]); // Update the selectedCode state to reflect the change
    }
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
      title: "Judges Name",
      dataIndex: "judges",
      key: "judges_name",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer truncate"
          style={{
            maxWidth: "150px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={record.judges
            ?.map((judge) => JSON.parse(judge).name)
            .join(", ")}
        >
          {record.judges?.map((judge) => JSON.parse(judge).name).join(", ")}
        </span>
      ),
    },
    {
      title: "Judges Email",
      dataIndex: "judges",
      key: "judges_email",
      render: (text, record) => (
        <span
          className="hover:cursor-pointer truncate"
          style={{
            maxWidth: "200px",
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={record.judges
            ?.map((judge) => JSON.parse(judge).email)
            .join(", ")}
        >
          {record.judges?.map((judge) => JSON.parse(judge).email).join(", ")}
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
                <Menu.Item key="publish">
                  <div
                    onClick={() => openPublishModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Publish
                  </div>
                </Menu.Item>
                <Menu.Item key="judges">
                  <div
                    onClick={() => openJudgeModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Judges
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

  const getApplyInfoByCode = (applyInfo, code) => {
    return applyInfo.find((info) => info.universityCode === code) || {};
  };

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
      title: "Team Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{record?.company?.name}</span>
      ),
    },
    {
      title: "Creator",
      dataIndex: "code",
      key: "code",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.creatorName}</span>
        );
      },
    },
    {
      title: "Applied at",
      dataIndex: "applyAt",
      key: "applyAt",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">
            {formatDate(applyInfo.applyAt)}
          </span>
        );
      },
    },
    {
      title: "Contact Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.contactEmail}</span>
        );
      },
    },
    {
      title: "Contact Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.contactPhone}</span>
        );
      },
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.university}</span>
        );
      },
    },
    {
      title: "Team size",
      dataIndex: "teamSize",
      key: "teamSize",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.teamSize}</span>
        );
      },
    },
    {
      title: "Team Emails",
      dataIndex: "teamEmails",
      key: "teamEmails",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo.teamEmails}</span>
        );
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record.applyInfo,
          selectedCode.code
        );
        return <span>{applyInfo.score || 0}</span>;
      },
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
                <Menu.Item key="remove">
                  <div
                    onClick={() =>
                      handleRemoveProjectCode(record.id, selectedCode.code)
                    }
                    style={{ fontSize: "12px" }}
                  >
                    Remove
                  </div>
                </Menu.Item>
                <Menu.Item key="score">
                  <div
                    onClick={() => openScoreModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Score
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

  return (
    <section className="bg-white mt-12">
      <div className="sm:px-6 px-3 pt-16 mx-auto text-center">
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
            {user && (
              <button
                className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  setNewCode("");
                  setExpirationDate(null);
                  setCompetitionName("");
                  setIsAddNewModalOpen(true);
                }}
              >
                Create A Competition
              </button>
            )}
          </div>
        </div>

        <section className="container px-4 mx-auto mt-14">
          <div className="flex flex-col mb-5">
            <h3 className="font-bold text-xl text-left">Code listing</h3>

            <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
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
        </section>
        {projectList?.length > 0 && (
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

        <Modal
          title="Confirm Publish"
          open={isPublishModalOpen}
          onOk={handlePublishCode}
          onCancel={() => setIsPublishModalOpen(false)}
          okText="Publish"
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
          Other users can see all projects that relate to this code on
          "University Contest". Are you sure to publish?
        </Modal>

        <Modal
          title="Manage Judges"
          open={isJudgeModalOpen}
          onOk={() => setIsJudgeModalOpen(false)}
          onCancel={() => setIsJudgeModalOpen(false)}
          footer={null}
          centered={true}
          styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }} // Add this line
        >
          <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
            <h3 className="text-lg font-semibold">Add Judge</h3>
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="space-y-2">
                <label htmlFor="judge_name">Judge Name</label>
                <div className="flex items-center">
                  <Input
                    id="judge_name"
                    placeholder="Enter judge name"
                    required
                    className="border-gray-300 rounded-md text-sm"
                    value={judgeName}
                    onChange={(e) => setJudgeName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="judge_email">Judge Email</label>
                <div className="flex items-center">
                  <Input
                    id="judge_email"
                    placeholder="Enter judge email"
                    required
                    className="border-gray-300 rounded-md text-sm"
                    value={judgeEmail}
                    onChange={(e) => setJudgeEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="primary" onClick={handleAddJudge}>
                Add Judge
              </Button>
            </form>

            <h3 className="text-lg font-semibold mt-6">Judge Listing</h3>
            <div>
              {" "}
              {/* Add this line */}
              <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                <Table
                  dataSource={selectedCode?.judges?.map((judge) =>
                    JSON.parse(judge)
                  )}
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Email",
                      dataIndex: "email",
                      key: "email",
                    },
                    {
                      title: "Action",
                      dataIndex: "action",
                      key: "action",
                      render: (text, record) => (
                        <Button
                          type="danger"
                          onClick={() => handleRemoveJudge(record.email)}
                          style={{
                            fontSize: "12px",
                            padding: 0,
                          }}
                        >
                          Remove
                        </Button>
                      ),
                    },
                  ]}
                  rowKey="email"
                  pagination={{ pageSize: 5, position: ["bottomLeft"] }}
                  scroll={{
                    x: true,
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          title="Score Project"
          open={isScoreModalOpen}
          onOk={() => handleScoreProject(selectedProject.id)}
          onCancel={() => setIsScoreModalOpen(false)}
          okText="Score"
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
          <div className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="space-y-2">
                <label htmlFor="score">Score</label>
                <div className="flex items-center">
                  <Input
                    id="score"
                    placeholder="Enter score"
                    required
                    type="number"
                    className="border-gray-300 rounded-md text-sm"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </section>
  );
};

export default HeroUniversities;
