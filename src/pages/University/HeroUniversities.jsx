import { useAuth } from "../../context/AuthContext";
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Modal,
  Table,
  Card,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import moment from "moment";
import { formatDate } from "../../features/DurationSlice";
import { IconButton } from "@mui/material";
import UniEditorTool from "./UniEditorTool";
import UniCard from "./UniCard";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const HeroUniversities = ({
  onSelectCode,
  setCompanies,
  credentials,
  currentTab,
  setSelectedCodeFull,
}) => {
  const { user } = useAuth();
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const [newCode, setNewCode] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [competitionDescription, setCompetitionDescription] = useState("");
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

  const [universityName, setUniversityName] = useState(credentials?.university);
  const [description, setDescription] = useState(credentials?.description);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data: codes, error } = await supabase
          .from("code")
          .select("*")
          .eq("UniID", credentials?.UniID);

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
  }, [credentials]);

  const filterProjectsByCode = async (codeId) => {
    try {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .contains("universityCode", [codeId]);

      if (projectsError) {
        throw projectsError;
      }

      const projectIds = projects.map((project) => project.id);

      const { data: companies, error: companiesError } = await supabase
        .from("company")
        .select("*")
        .in("project_id", projectIds);

      if (companiesError) {
        throw companiesError;
      }

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
          company: companyInfo,
        };
      });

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
        .contains("universityCode", [code.id]);

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
    if (
      !newCode ||
      !expirationDate ||
      !competitionName ||
      !competitionDescription
    ) {
      message.error("Please enter all required fields");
      return;
    }

    const { data, error } = await supabase
      .from("code")
      .insert([
        {
          code: newCode,
          expired_at: expirationDate.format("YYYY-MM-DD"),
          UniID: credentials.UniID,
          name: competitionName,
          description: competitionDescription,
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
      setCompetitionDescription("");
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
        description: competitionDescription,
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
      setCompetitionDescription("");
      setSelectedCode(data[0]);
      setSelectedCodeFull(data[0]);
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

  const handleUnpublishCode = async () => {
    const { data, error } = await supabase
      .from("code")
      .update({ publish: false })
      .eq("id", selectedCode.id)
      .select();

    if (error) {
      message.error("Failed to unpublish code");
      console.error(error);
    } else {
      message.success("Code unpublished successfully");
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
      setSelectedCodeFull(data[0]);
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

    // Parse applyInfo array
    const applyInfoArray = project?.applyInfo;
    const applyInfoIndex = applyInfoArray.findIndex(
      (info) => info.universityCode === selectedCode.id
    );

    if (applyInfoIndex === -1) {
      message.error("No matching applyInfo found for this universityCode");
      return;
    }

    // Update the score in the correct applyInfo object
    applyInfoArray[applyInfoIndex].score = score;

    try {
      // Update the project in the database
      const { error } = await supabase
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
    setSelectedCodeFull(record);
    setNewCode(record.code);
    setCompetitionName(record.name);
    setCompetitionDescription(record.description);
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
    setSelectedCodeFull(record);
    setIsPublishModalOpen(true);
  };

  const openJudgeModal = (record) => {
    setSelectedCode(record);
    setSelectedCodeFull(record);
    setIsJudgeModalOpen(true);
  };

  const [selectedProject, setSelectedProject] = useState();
  const openScoreModal = (record) => {
    setSelectedProject(record);
    const applyInfo = record?.applyInfo?.find(
      (info) => info.universityCode === selectedCode.id
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
      setSelectedCodeFull(data[0]); // Update the selectedCode state to reflect the change
    }
  };

  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false); // New state for rules modal

  const openRulesModal = (record) => {
    setSelectedCode(record);
    setSelectedCodeFull(record);
    setIsRulesModalOpen(true);
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
      align: "center",
      render: (text, record) => (
        <span className="flex justify-center items-center">
          {projectCounts[record.id] || 0}
        </span>
      ),
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
      title: "Publish status",
      dataIndex: "publish",
      key: "publish",
      align: "center",
      render: (text, record) => (
        <span className="hover:cursor-pointer">
          {record.publish ? "Published" : "Unpublished"}
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
                    {record.publish ? "Un-publish" : "Publish"}
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
          <Button className="bg-blue-600 rounded-md max-w-[5rem] text-white py-1 hover:cursor-pointer text-xs">
            Action
          </Button>
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
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
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
        return (
          <span className="hover:cursor-pointer flex justify-center items-center">
            {applyInfo.teamSize}
          </span>
        );
      },
    },
    {
      title: "Team Emails",
      dataIndex: "teamEmails",
      key: "teamEmails",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
        return (
          <span className="hover:cursor-pointer">{applyInfo.teamEmails}</span>
        );
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "center",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(record.applyInfo, selectedCode.id);
        return (
          <span className="flex justify-center items-center">
            {applyInfo.score || 0}
          </span>
        );
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
                      handleRemoveProjectCode(record.id, selectedCode.id)
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

  const [avatarUrl, setAvatarUrl] = useState(credentials?.avatar_url); // State to store project image URL
  useEffect(() => {
    setAvatarUrl(credentials?.avatar_url);
    setUniversityName(credentials?.university);
    setDescription(credentials?.description);
  }, [credentials]);

  const dataURItoFile = (dataURI, fileNamePrefix) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const extension = dataURI.split(",")[0].split("/")[1].split(";")[0]; // Lấy phần mở rộng của tệp từ data URI
    const fileName = `${fileNamePrefix}-${Date.now()}.${extension}`; // Tạo tên tệp duy nhất với ngày giờ hiện tại và phần mở rộng
    const blob = new Blob([ab], { type: `image/${extension}` });
    return new File([blob], fileName, { type: `image/${extension}` });
  };

  const uploadImageToSupabase = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("beekrowd_storage") // Chọn bucket
        .upload(`beekrowd_images/${file.name}`, file); // Lưu ảnh vào folder beekrowd_images

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Trả về liên kết ảnh từ Supabase
      // Lấy URL của ảnh đã lưu

      const imageUrl = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
      return null;
    }
  };

  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = async (e) => {
      setAvatarUrl(e.target.result); // Set the project image URL in state

      // Upload the image to Supabase
      const uploadedAvatarUrl = await uploadImageToSupabase(
        dataURItoFile(e.target.result, "img")
      );

      if (uploadedAvatarUrl) {
        setAvatarUrl(uploadedAvatarUrl); // Update the state with the uploaded image URL

        // Update the avatar_url field in the workspace table
        const { error } = await supabase
          .from("workspace")
          .update({ avatar_url: uploadedAvatarUrl })
          .eq("UniID", credentials.UniID);

        if (error) {
          message.error("Failed to update avatar URL in the database");
          console.error("Error updating avatar URL:", error);
        } else {
          message.success("Avatar URL updated successfully");
        }
      }
    };

    reader.readAsDataURL(file); // Read the uploaded file
  };

  const handleUniversityNameChange = async (newName) => {
    setUniversityName(newName);
    const { error } = await supabase
      .from("workspace")
      .update({ university: newName })
      .eq("UniID", credentials?.UniID);

    if (error) {
      message.error("Failed to update university name in the database");
      console.error("Error updating university name:", error);
    } else {
      // message.success("University name updated successfully");
    }
  };
  const handleDescriptionChange = async (newDescription) => {
    setDescription(newDescription);
    const { error } = await supabase
      .from("workspace")
      .update({ description: description })
      .eq("UniID", credentials?.UniID);

    if (error) {
      message.error("Failed to update university name in the database");
      console.error("Error updating university name:", error);
    } else {
      // message.success("University name updated successfully");
    }
  };

  const handleUpdateRules = async (updatedCode) => {
    try {
      const { error } = await supabase
        .from("code")
        .update({ rules: updatedCode.rules })
        .eq("id", updatedCode.id);

      if (error) {
        throw error;
      }

      message.success("Rules updated successfully");
      setIsRulesModalOpen(false);
    } catch (error) {
      message.error("Failed to update rules");
      console.error("Error updating rules:", error);
    }
  };

  const [currentCodePage, setCurrentCodePage] = useState(0);
  const itemsPerPage = 2;

  const handleNext = () => {
    if ((currentCodePage + 1) * itemsPerPage < codeData.length) {
      setCurrentCodePage(currentCodePage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCodePage > 0) {
      setCurrentCodePage(currentCodePage - 1);
    }
  };

  const startIndex = currentCodePage * itemsPerPage;
  const selectedCodes = codeData.slice(startIndex, startIndex + itemsPerPage);

  console.log("selectedCodes", selectedCodes);

  return (
    <section className="bg-white">
      <div className="sm:px-6 px-3 mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col space-y-6 justify-center items-center">
            <input
              type="file"
              onChange={handleProjectImageUpload}
              id="upload"
              accept="image/*"
              style={{ display: "none" }}
            />
            <label htmlFor="upload">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <Avatar
                  id="avatar"
                  src={avatarUrl}
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
              </IconButton>
            </label>
            <label htmlFor="avatar" />
          </div>
          <h1
            className="block font-extrabold leading-relaxed text-gray-800 text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4"
            style={{ lineHeight: "1.25" }}
          >
            Profile listing for
            <Input.TextArea
              className="text-blue-600 bg-yellow-300 inline-block text-3xl sm:text-4xl md:text-5xl lg:text-7xl"
              value={universityName}
              onChange={(e) => handleUniversityNameChange(e.target.value)}
              style={{
                border: "none",
                backgroundColor: "#FDE047",
                textAlign: "center",
                fontWeight: "bold",
                color: "#2563EB",
                outline: "none",
              }}
              autoSize
            />
          </h1>
          <Input.TextArea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            style={{
              border: "none",
              backgroundColor: "transparent",
              textAlign: "center",
              outline: "none",
              fontSize: "20px",
              lineHeight: "28px",
            }}
            autoSize
          />
          <div className="mt-7 text-lg flex justify-center">
            {user && (
              <button
                className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => {
                  setNewCode("");
                  setExpirationDate(null);
                  setCompetitionName("");
                  setCompetitionDescription("");
                  setIsAddNewModalOpen(true);
                }}
              >
                Create A Competition
              </button>
            )}
          </div>
        </div>
        {currentTab === "Manage" && (
          <>
            <section className="container px-4 mx-auto mt-14 max-w-3xl">
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
                        setSelectedCodeFull(record);
                        onSelectCode(record.id);
                        filterProjectsByCode(record.id);
                      },
                    })}
                  />
                </div>
              </div>
            </section>
            {projectList?.length > 0 && (
              <section className="container px-4 mx-auto mt-14 max-w-3xl">
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
          </>
        )}

        {currentTab === "View" && (
          <>
            <section className="container px-4 mx-auto mt-14 max-w-3xl">
              <div className="flex flex-col mb-5">
                <h3 className="font-bold text-xl text-left">Code listing</h3>
                <div className="mx-auto mt-5 grid sm:grid-cols-2 gap-32 transition-all duration-600 ease-out transform translate-x-0">
                  {selectedCodes.map((code) => (
                    <div
                      key={code.id}
                      className="group flex justify-center w-full"
                    >
                      <UniCard
                        data={code}
                        setSelectedCode={setSelectedCode}
                        setSelectedCodeFull={setSelectedCodeFull}
                        onSelectCode={onSelectCode}
                        filterProjectsByCode={filterProjectsByCode}
                        projectCounts={projectCounts}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-5">
                  <button
                    onClick={handlePrevious}
                    disabled={currentCodePage === 0}
                    className={`bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] ${currentCodePage === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <LeftOutlined /> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={
                      (currentCodePage + 1) * itemsPerPage >= codeData.length
                    }
                    className={`bg-blue-600 text-white py-2 px-2 text-sm rounded-2xl mt-4 min-w-[6vw] ${(currentCodePage + 1) * itemsPerPage >= codeData.length ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Next
                    <RightOutlined className="ml-2" />
                  </button>
                </div>
              </div>
            </section>
          </>
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
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="competition_description">
                  Competition Description
                </label>
                <div className="flex items-center">
                  <Input.TextArea
                    id="competition_description"
                    placeholder="Enter competition description"
                    required
                    className="border-gray-300 rounded-md text-sm"
                    value={competitionDescription}
                    onChange={(e) => setCompetitionDescription(e.target.value)}
                    autoSize
                  />
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

                <div className="space-y-1 md:col-span-2">
                  <label htmlFor="competition_description">
                    Competition Description
                  </label>
                  <div className="flex items-center">
                    <Input.TextArea
                      id="competition_description"
                      placeholder="Enter competition description"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={competitionDescription}
                      onChange={(e) =>
                        setCompetitionDescription(e.target.value)
                      }
                      autoSize
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
          title={
            selectedCode?.publish ? "Confirm Unpublish" : "Confirm Publish"
          }
          open={isPublishModalOpen}
          onOk={selectedCode?.publish ? handleUnpublishCode : handlePublishCode}
          onCancel={() => setIsPublishModalOpen(false)}
          okText={selectedCode?.publish ? "Unpublish" : "Publish"}
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
          {selectedCode?.publish
            ? "Are you sure to un-publish this code?"
            : 'Other users can see all projects that relate to this code on "Competition". Are you sure to publish?'}
        </Modal>

        <Modal
          title="Manage Judges"
          open={isJudgeModalOpen}
          onOk={() => setIsJudgeModalOpen(false)}
          onCancel={() => setIsJudgeModalOpen(false)}
          footer={null}
          centered={true}
          styles={{ body: { minHeight: "84vh" } }} // Use bodyStyle to style the body
          width={600}
        >
          <div className="w-full mx-auto p-6 space-y-6 ">
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
                  pagination={{ pageSize: 4, position: ["topRight"] }}
                  scroll={{ x: true }}
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

        <Modal
          title={`Rules for ${selectedCode?.code}`}
          open={isRulesModalOpen}
          onCancel={() => setIsRulesModalOpen(false)}
          okText="Update"
          onOk={() => handleUpdateRules(selectedCode)}
          centered={true}
        >
          <UniEditorTool
            selectedCode={selectedCode}
            setSelectedCode={setSelectedCode}
          />
        </Modal>
      </div>
    </section>
  );
};

export default HeroUniversities;
