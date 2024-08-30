import React, { useEffect, useState } from "react";
import Card from "../Home/Components/Card";
import { supabase } from "../../supabase";
import { LinearProgress } from "@mui/material";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Modal,
  Select,
  Table,
  Tabs,
  Tooltip,
} from "antd";

import UniSearch from "./UniSearch";
import UniEditorTool from "./UniEditorTool"; // Assuming this is the component for editing rules
import TabPane from "antd/es/tabs/TabPane";
import { useAuth } from "../../context/AuthContext";
import Header2 from "../Home/Header";
import HeroCompetitions from "./HeroCompetitons";
import SubmitProjectModal from "./components/SubmitProjectComponent";
import { formatDate } from "../../features/DurationSlice";
import { EyeTwoTone } from "@ant-design/icons";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import axios from "axios";
import SpinnerBtn from "../../components/SpinnerBtn";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";
import HeroSectionZubuz from "./HeroCompetitionZubuz";

const CompetitionPost = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCodeFull, setSelectedCodeFull] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("All");
  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [visibleItemCount, setVisibleItemCount] = useState(itemsPerPage);
  const [selectedTab, setSelectedTab] = useState("Listing"); // New state for tab selection
  const [filteredProjectList, setFilteredProjectList] = useState([]);
  const [showCreateActivitiesTab, setShowCreateActivitiesTab] = useState(false);

  // Update fetchCompanies function
  const fetchCompanies = async (codeId) => {
    setIsLoading(true);
    if (codeId) {
      try {
        const { data: projects, error: projectsError } = await supabase
          .from("projects")
          .select("id, verified, status, applyInfo")
          .neq("status", "stealth")
          .contains("universityCode", [codeId]);

        if (projectsError) {
          message.error(projectsError.message);
          return;
        }

        const projectIds = projects.map((project) => project.id);

        const { data: fetchedCompanies, error: companiesError } = await supabase
          .from("company")
          .select("*")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false });

        if (companiesError) {
          message.error(companiesError.message);
          return;
        }

        const verifiedStatusMap = new Map();
        const statusMap = new Map();
        const applyInfoMap = new Map();

        projects.forEach((project) => {
          verifiedStatusMap.set(project.id, project.verified);
          statusMap.set(project.id, project.status);
          applyInfoMap.set(project.id, project.applyInfo);
        });

        fetchedCompanies.forEach((company) => {
          company.verifiedStatus =
            verifiedStatusMap.get(company.project_id) || false;
          company.status = statusMap.get(company.project_id) || "Unknown";
          company.applyInfo = applyInfoMap.get(company.project_id) || [];
        });

        setCompanies(fetchedCompanies);
      } catch (error) {
        message.error("An error occurred while fetching companies.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  // Update handleSelectCode function
  const handleSelectCode = (codeId) => {
    fetchCompanies(codeId);
    handleCodeClick();
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };

  const [selectedRound, setSelectedRound] = useState(null); // New state for selected round from dropdown
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    let data = companies;

    if (currentTab === "verified") {
      data = data.filter((company) => company?.verifiedStatus === true);
    }
    if (currentTab === "unverified") {
      data = data.filter((company) => company?.verifiedStatus === false);
    }

    if (searchTerm) {
      data = data.filter((company) =>
        company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filteredProjectList) {
      data = data.filter((company) =>
        filteredProjectList.some(
          (project) => project?.id === company.project_id
        )
      );
    }

    const visibleCompanies = data.slice(0, visibleItemCount);
    setCompaniesToRender(visibleCompanies);
  }, [
    currentTab,
    companies,
    page,
    searchTerm,
    visibleItemCount,
    filteredProjectList,
    selectedRound,
    projectList,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if (atBottom) {
        setVisibleItemCount((prevVisible) => prevVisible + itemsPerPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    } catch (error) {
      message.error("Failed to update rules");
      console.error("Error updating rules:", error);
    }
  };

  const filterProjectsByRound = (round) => {
    if (!round) {
      setFilteredProjectList(projectList);
      return;
    }

    const selectedRoundIndex = selectedCodeFull?.rounds.findIndex(
      (r) => JSON.parse(r).id === round.id
    );

    const filteredProjects = projectList.filter((project) =>
      project.applyInfo.some((info) => {
        if (info.universityCode !== selectedCodeFull?.id) {
          return false;
        }
        if (!info.passRound) {
          return selectedRoundIndex === 0;
        }

        const passRoundIndex = selectedCodeFull?.rounds.findIndex(
          (r) => JSON.parse(r).id === info.passRound
        );

        return passRoundIndex >= selectedRoundIndex - 1;
      })
    );

    filteredProjects.sort((a, b) => {
      const applyInfoA = a.applyInfo.find(
        (info) => info.universityCode === selectedCodeFull?.id
      );
      const applyInfoB = b.applyInfo.find(
        (info) => info.universityCode === selectedCodeFull?.id
      );

      const applyAtA = applyInfoA ? new Date(applyInfoA.applyAt) : new Date(0);
      const applyAtB = applyInfoB ? new Date(applyInfoB.applyAt) : new Date(0);

      return applyAtB - applyAtA;
    });
    setFilteredProjectList(filteredProjects);
  };

  const handleRoundSelect = (round) => {
    setSelectedRound(round);
    filterProjectsByRound(round);
    setSelectedTab("Listing");
  };

  useEffect(() => {
    filterProjectsByRound(selectedRound);
  }, [projectList, selectedRound]);
  // Dropdown menu for rounds
  const roundsMenu = (
    <Menu>
      {selectedCodeFull?.rounds?.map((round, index) => (
        <Menu.Item
          key={index}
          onClick={() => handleRoundSelect(JSON.parse(round))}
          className={
            selectedRound && JSON.parse(round).id === selectedRound.id
              ? "bg-gray-300 text-white hover:bg-gray-300"
              : "hover:bg-gray-200"
          }
        >
          Round: {JSON.parse(round).name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const { user } = useAuth();
  // Check if the user is a judge
  const isJudge = selectedCodeFull?.judges?.some(
    (judge) => JSON.parse(judge)?.email === user?.email
  );

  const handleCodeClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const codeRef = document.getElementById("codeCompetition"); // Đặt ID tương ứng với ref của bạn

    if (codeRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = codeRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 90,
        behavior: "smooth",
      });
    }
  };

  const getApplyInfoByCode = (applyInfo, code) => {
    return applyInfo.find((info) => info.universityCode === code) || {};
  };
  const calculateWeightedAverageScore = (scoringInfo, scoringRules) => {
    if (!scoringInfo || !scoringRules) return 0;

    // Lọc scoringInfo theo selectedCodeFull?.id và selectedRound.id
    const filteredScoringInfo = scoringInfo.filter((info) => {
      const parsedInfo = JSON.parse(info);
      return (
        parsedInfo.codeId === selectedCodeFull?.id &&
        parsedInfo.round === selectedRound?.id
      );
    });

    if (filteredScoringInfo.length === 0) return 0;

    let totalJudgeScores = 0;
    let totalJudges = filteredScoringInfo.length;

    filteredScoringInfo.forEach((info) => {
      const parsedInfo = JSON.parse(info);
      let totalScore = 0;

      Object.entries(parsedInfo.scores).forEach(([feature, score]) => {
        const rule = scoringRules.find(
          (rule) => JSON.parse(rule).feature === feature
        );
        if (rule) {
          const parsedRule = JSON.parse(rule);
          totalScore += score * (parsedRule.rate / 100);
        }
      });

      totalJudgeScores += totalScore;
    });

    return totalJudges ? (totalJudgeScores / totalJudges).toFixed(2) : 0;
  };

  const [isRemoveProjectModalOpen, setIsRemoveProjectModalOpen] =
    useState(false);
  const [projectToRemove, setProjectToRemove] = useState(null);

  const openRemoveProjectModal = (project) => {
    setProjectToRemove(project);
    setIsRemoveProjectModalOpen(true);
  };
  const confirmRemoveProject = async () => {
    await handleRemoveProjectCode(projectToRemove.id, selectedCodeFull?.id);
    setIsRemoveProjectModalOpen(false);
    setProjectToRemove(null);
    setSelectedProject(null);
  };

  const handleRemoveProjectCode = async (projectId, codeToRemove) => {
    try {
      // Fetch the project data
      const { data: project, error: fetchError } = await supabase
        .from("projects")
        .select("universityCode, applyInfo, scoringInfo")
        .eq("id", projectId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Update the universityCode field
      const updatedUniversityCode = project.universityCode.filter(
        (code) => code !== codeToRemove
      );

      // Update the applyInfo field
      const updatedApplyInfo = project.applyInfo.filter(
        (info) => JSON.parse(info).universityCode !== codeToRemove
      );
      const updatedScoringInfo = project.scoringInfo.filter(
        (info) => JSON.parse(info).codeId !== codeToRemove
      );

      // Update the project in the database
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          universityCode: updatedUniversityCode,
          applyInfo: updatedApplyInfo,
          scoringInfo: updatedScoringInfo,
        })
        .eq("id", projectId);

      if (updateError) {
        throw updateError;
      }

      // Fetch the code entry
      const { data: codeData, error: codeFetchError } = await supabase
        .from("code")
        .select("diary")
        .eq("id", codeToRemove)
        .single();

      if (codeFetchError) {
        throw codeFetchError;
      }

      // Extract emails from the applyInfo
      const emailsToRemove = project.applyInfo
        .filter((info) => JSON.parse(info).universityCode === codeToRemove)
        .map((info) => JSON.parse(info).teamEmails.split(/\s*,\s*/))
        .flat();

      // Filter out diary entries that match the emails
      const updatedDiaries = codeData.diary.filter((diary) => {
        const diaryObj = JSON.parse(diary);
        return !emailsToRemove.includes(diaryObj.email);
      });

      // Update the code entry with the filtered diaries
      const { error: diaryUpdateError } = await supabase
        .from("code")
        .update({ diary: updatedDiaries })
        .eq("id", codeToRemove);

      if (diaryUpdateError) {
        throw diaryUpdateError;
      }

      message.success(
        "Project code removed successfully, and diaries updated."
      );
      setProjectList((prev) => prev.filter((item) => item.id !== projectId));
      setCompanies((prev) =>
        prev.filter((item) => item.project_id !== projectId)
      );
    } catch (error) {
      message.error("Failed to remove project code and update diaries");
      console.error(error);
    }
  };

  const [judgeScores, setJudgeScores] = useState("");
  const [isJudgeScoreModalOpen, setIsJudgeScoreModalOpen] = useState(false);

  const openJudgeScoreModal = (record) => {
    const scoringInfo =
      record?.scoringInfo?.map((info) => JSON.parse(info)) || [];

    const judgeScores = scoringInfo.map((info) => ({
      judgeEmail: info.judgeEmail,
      scores: info.scores,
    }));

    setJudgeScores(judgeScores);
    setIsJudgeScoreModalOpen(true);
  };

  const [isQualifiedModalOpen, setIsQualifiedModalOpen] = useState(false);
  const [projectToQualify, setProjectToQualify] = useState(null);
  const openQualifiedModal = (record) => {
    setProjectToQualify(record);
    setIsQualifiedModalOpen(true);
  };

  const handleQualified = async () => {
    const updatedApplyInfo = projectToQualify.applyInfo.map((info) => {
      if (info.universityCode === selectedCodeFull?.id) {
        return { ...info, passRound: selectedRound.id };
      }
      return info;
    });

    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ applyInfo: updatedApplyInfo })
        .eq("id", projectToQualify.id);

      if (error) {
        throw error;
      }

      const updatedProjects = projectList.map((proj) =>
        proj.id === projectToQualify.id
          ? { ...proj, applyInfo: updatedApplyInfo }
          : proj
      );

      setProjectList(updatedProjects);
      message.success("Project qualified successfully");
      setIsQualifiedModalOpen(false);
      filterProjectsByRound(selectedRound);
    } catch (error) {
      message.error("Failed to qualify project");
      console.error("Error qualifying project:", error);
    }
  };

  const [isUndoQualifiedModalOpen, setIsUndoQualifiedModalOpen] =
    useState(false);

  const openUndoQualifiedModal = (record) => {
    setProjectToQualify(record);
    setIsUndoQualifiedModalOpen(true);
  };

  const handleUndoQualified = async () => {
    const updatedApplyInfo = projectToQualify.applyInfo.map((info) => {
      if (info.universityCode === selectedCodeFull?.id) {
        // Find the index of the current round
        const roundIndex = selectedCodeFull?.rounds.findIndex(
          (round) => JSON.parse(round)?.id === info.passRound
        );

        // Set the passRound to the previous round, if it exists
        const previousRound =
          roundIndex > 0 ? selectedCodeFull?.rounds[roundIndex - 1] : null;
        return {
          ...info,
          passRound: previousRound ? JSON.parse(previousRound)?.id : null,
        };
      }
      return info;
    });

    try {
      const { data, error } = await supabase
        .from("projects")
        .update({ applyInfo: updatedApplyInfo })
        .eq("id", projectToQualify.id);

      if (error) {
        throw error;
      }

      const updatedProjects = projectList.map((proj) =>
        proj.id === projectToQualify.id
          ? { ...proj, applyInfo: updatedApplyInfo }
          : proj
      );

      setProjectList(updatedProjects);
      message.success("Project moved back to previous round successfully");
      setIsUndoQualifiedModalOpen(false);
      filterProjectsByRound(selectedRound);
    } catch (error) {
      message.error("Failed to move project back to previous round");
      console.error("Error moving project back to previous round:", error);
    }
  };

  const { Option } = Select;
  const projectByCodeColumns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => (
        <span>{filteredProjectList?.indexOf(record) + 1}</span>
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
      title: "Company Name",
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
          record?.applyInfo,
          selectedCodeFull?.id
        );
        return (
          <span className="hover:cursor-pointer">{applyInfo?.creatorName}</span>
        );
      },
    },
    {
      title: "Applied at",
      dataIndex: "applyAt",
      key: "applyAt",
      render: (text, record) => {
        const applyInfo = getApplyInfoByCode(
          record?.applyInfo,
          selectedCodeFull?.id
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
          selectedCodeFull?.id
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
          selectedCodeFull?.id
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
          selectedCodeFull?.id
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
          selectedCodeFull?.id
        );
        const teamEmails = applyInfo.teamEmails;
        const emailArray = teamEmails
          ?.split(/\s*,\s*/)
          .map((email) => email.trim());

        return (
          <span className="hover:cursor-pointer flex justify-center items-center">
            {emailArray?.length || 0}
          </span>
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
          selectedCodeFull?.id
        );
        return (
          <span
            className="hover:cursor-pointer truncate"
            style={{
              maxWidth: "200px",
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Tooltip title={applyInfo.teamEmails}>
              {applyInfo.teamEmails}
            </Tooltip>
          </span>
        );
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      align: "center",
      render: (text, record) => (
        <span>
          {calculateWeightedAverageScore(
            record.scoringInfo,
            selectedCodeFull?.scoringRules
          )}{" "}
          <EyeTwoTone onClick={() => openJudgeScoreModal(record)} />
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
                <Menu.Item key="remove">
                  <div
                    onClick={() => openRemoveProjectModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Remove
                  </div>
                </Menu.Item>
                <Menu.Item key="qualified">
                  <div
                    onClick={() => openQualifiedModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Qualified
                  </div>
                </Menu.Item>
                <Menu.Item key="undoQualified">
                  <div
                    onClick={() => openUndoQualifiedModal(record)}
                    style={{ fontSize: "12px" }}
                  >
                    Undo Qualified
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

  const judgeScoreColumns = [
    {
      title: "Judge Email",
      dataIndex: "judgeEmail",
      key: "judgeEmail",
    },
    {
      title: "Scores",
      dataIndex: "scores",
      key: "scores",
      render: (text, record) => (
        <div>
          {Object.entries(record.scores).map(([feature, score]) => (
            <div key={feature}>
              {feature}: {score}
            </div>
          ))}
        </div>
      ),
    },
  ];

  const [selectedProject, setSelectedProject] = useState();
  const [participants, setParticipants] = useState([]);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);

  const fetchParticipantNames = async (emails) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("email, full_name")
        .in("email", emails);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching participant names:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedDiary, setSelectedDiary] = useState();
  const handleViewDiary = (email) => {
    const userDiary = diaries?.find(
      (entry) => JSON.parse(entry).email === email
    );

    if (userDiary) {
      editor.replaceBlocks(
        editor.topLevelBlocks,
        JSON.parse(userDiary).content
      );
    } else editor.replaceBlocks(editor.topLevelBlocks, []);
    setSelectedDiary(email);
    setIsDiaryModalOpen(true);
  };

  useEffect(() => {
    const teamEmails = selectedProject?.applyInfo[0]?.teamEmails;
    const emailArray = teamEmails
      ?.split(/\s*,\s*/)
      ?.map((email) => email?.trim());

    const getParticipants = async () => {
      const participantsData = await fetchParticipantNames(emailArray);
      setParticipants(
        emailArray?.map((email, index) => ({
          key: index,
          email,
          name:
            participantsData.find((user) => user.email === email)?.full_name ||
            "",
          projectName: selectedProject?.name,
        })) || []
      );
    };

    getParticipants();
  }, [selectedProject]);

  useEffect(() => {
    const checkCreateActivitiesPermission = () => {
      const found = filteredProjectList.some((project) =>
        project.applyInfo.some(
          (info) =>
            info.universityCode === selectedCodeFull?.id &&
            info?.teamEmails?.includes(user?.email)
        )
      );
      setShowCreateActivitiesTab(found);
    };

    checkCreateActivitiesPermission();
  }, [filteredProjectList, selectedCodeFull, user]);

  const DiaryColumns = [
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
        <span className="hover:cursor-pointer">{record.name || ""}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{record.email}</span>
      ),
    },

    {
      title: "Project name",
      dataIndex: "projectName",
      key: "projectName",
      align: "center",
      render: (text, record) => (
        <span className="hover:cursor-pointer">{selectedProject?.name}</span>
      ),
    },
    {
      title: "Diaries",
      dataIndex: "diaries",
      key: "diaries",
      align: "center",
      render: (text, record) => (
        <Button
          style={{ fontSize: "12px" }}
          onClick={() => handleViewDiary(record.email)}
        >
          View
        </Button>
      ),
    },
  ];

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        // Tạo tên file độc đáo để tránh xung đột
        const uniqueFileName = `profile_images/${Date.now()}`;

        // Upload file lên Supabase Storage
        let { error, data } = await supabase.storage
          .from("beekrowd_storage")
          .upload(uniqueFileName, file);

        if (error) {
          throw error;
        }

        // Trả về URL của file
        return `${process.env.REACT_APP_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`;
      } catch (error) {
        if (error.message === "The object exceeded the maximum allowed size") {
          message.error("The object exceeded the maximum allowed size (5MB).");
        } else message.error(error.message);

        // Xử lý lỗi tại đây
      }
    },
  });

  // Function to upload image to Supabase from URL
  const uploadImageFromURLToSupabase = async (imageUrl) => {
    try {
      // Download image from URL
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      // Create Blob from downloaded image data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Get current timestamp
      const timestamp = Date.now();

      // Create File object from Blob with filename as "img-{timestamp}"
      const file = new File([blob], `img-${timestamp}`, {
        type: response.headers["content-type"],
      });

      // Upload image file to Supabase storage
      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(`beekrowd_images/${file.name}`, file);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Return Supabase URL of the uploaded image
      const imageUrlFromSupabase = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;
      return imageUrlFromSupabase;
    } catch (error) {
      console.error("Error uploading image from URL to Supabase:", error);
      return null;
    }
  };

  const [content, setContent] = useState([]);

  const handleSaveDiary = async () => {
    try {
      const diaryEntry = {
        email: user.email,
        content,
      };
      setIsLoading(true);
      // Fetch existing diary entries
      const { data, error: fetchError } = await supabase
        .from("code")
        .select("diary")
        .eq("id", selectedCodeFull.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const existingDiary = data?.diary || [];
      let updatedDiary = false;

      // Update the existing diary entries or add a new one
      const updatedDiaryEntries = existingDiary.map((diary) => {
        const diaryObj = JSON.parse(diary);

        if (diaryObj.email === user.email) {
          // Update the content for the existing diary entry
          diaryObj.content = content;
          updatedDiary = true;
          return JSON.stringify(diaryObj);
        }

        return diary;
      });

      // If no existing diary entry for the current user, add a new entry
      if (!updatedDiary) {
        updatedDiaryEntries.push(JSON.stringify(diaryEntry));
      }

      // Save the updated diary entries to the database
      const { error } = await supabase
        .from("code")
        .update({ diary: updatedDiaryEntries })
        .eq("id", selectedCodeFull.id);

      if (error) {
        throw error;
      }

      message.success("Diary saved successfully");
    } catch (error) {
      message.error("Failed to save diary");
      console.error("Error saving diary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [diaries, setDiaries] = useState();

  const fetchDiaryContent = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("code")
        .select("diary")
        .eq("id", selectedCodeFull.id)
        .single();

      if (error) {
        throw error;
      }

      setDiaries(data.diary);
      const userDiary = data?.diary?.find(
        (entry) => JSON.parse(entry).email === user.email
      );

      if (userDiary) {
        editor.replaceBlocks(
          editor.topLevelBlocks,
          JSON.parse(userDiary).content
        );
      }
    } catch (error) {
      // message.error("Failed to fetch diary content");
      console.error("Error fetching diary content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaryContent();
  }, [selectedTab, selectedCodeFull]);

  const handleTeamClick = () => {
    // Lấy đối tượng ref của phần tử "Financial Product" từ Home component
    const codeRef = document.getElementById("participants_listing"); // Đặt ID tương ứng với ref của bạn

    if (codeRef) {
      // Sử dụng `scrollIntoView()` để cuộn đến phần tử "Financial Product"
      const elementRect = codeRef.getBoundingClientRect();
      const bodyRect = document.body.getBoundingClientRect();
      const offsetTop = elementRect.top - bodyRect.top;
      window.scrollTo({
        top: offsetTop - (window.innerHeight - elementRect.height) / 90,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <HomeHeader />

      <div className="py-2 lg:py-1 mx-auto ">
        <HeroSectionZubuz />
        <HeroCompetitions
          onSelectCode={handleSelectCode}
          setCompanies={setCompanies}
          selectedCode={selectedCodeFull}
          setSelectedCodeFull={setSelectedCodeFull}
          filteredProjectList={filteredProjectList}
          setFilteredProjectList={setFilteredProjectList}
          selectedRound={selectedRound}
          setSelectedRound={setSelectedRound}
          filterProjectsByRound={filterProjectsByRound}
          projectList={projectList}
          setProjectList={setProjectList}
        />

        <>
          <UniSearch
            onSearch={handleSearch}
            companies={companiesToRender}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            selectedCode={selectedCodeFull}
          />

          <Tabs
            activeKey={selectedTab}
            onChange={(key) => setSelectedTab(key)}
            centered
            id="codeCompetition"
          >
            <TabPane
              tab={
                <Dropdown overlay={roundsMenu} trigger={["hover"]}>
                  <span>Listing</span>
                </Dropdown>
              }
              key="Listing"
            >
              {isLoading ? (
                <LinearProgress className="my-20" />
              ) : (
                <>
                  {selectedRound && (
                    <h2 className="text-center font-semibold text-lg">
                      Round: {selectedRound?.name}
                    </h2>
                  )}
                  <div className="bg-gray-50">
                    <div className="container grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      {companiesToRender.length > 0 ? (
                        companiesToRender.map((company, index) => (
                          <div
                            key={company.id}
                            className="group flex justify-center"
                          >
                            {company ? (
                              <Card
                                key={company.id}
                                title={company.name}
                                description={company.description}
                                imageUrl={company.card_url}
                                buttonText="More"
                                project_id={company.project_id}
                                verified={company.verifiedStatus}
                                status={company.status}
                                selectedCodeFull={selectedCodeFull}
                                projectList={projectList}
                                selectedRound={selectedRound}
                                setProjectList={setProjectList}
                                isJudge={isJudge}
                                project={company}
                              />
                            ) : (
                              <div className="w-[30vw] h-[55vh]"></div>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          <div></div>
                          <div className="mx-auto my-20 text-center text-4xl font-semibold text-gray-800 darkTextGray">
                            No result
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="sticky bottom-8 left-8">
                    <SubmitProjectModal />
                  </div>
                </>
              )}
            </TabPane>
            <TabPane tab="Rules" key="Rules">
              <div className="flex justify-center items-center">
                <UniEditorTool
                  selectedCode={selectedCodeFull}
                  setSelectedCode={setSelectedCodeFull}
                  unChange={true}
                  handleUpdateRules={handleUpdateRules}
                />
              </div>
              <div className="sticky bottom-8 left-8">
                <SubmitProjectModal />
              </div>
            </TabPane>
            {isJudge && (
              <TabPane tab="Tracking" key="tracking">
                <section className="container px-4 mx-auto mt-14 max-w-[85rem]">
                  <div className="flex flex-col mb5">
                    <h2 className="text-xl font-bold text-left">
                      Project listing by {selectedCodeFull?.code}
                    </h2>
                    <div className="flex items-center mt-2">
                      <label className="text-sm mr-2">Select round:</label>
                      <Select
                        id="round-select"
                        className="rounded-md p-1 text-xs"
                        value={selectedRound?.name}
                        onChange={(value) => {
                          const foundRound = selectedCodeFull?.rounds.find(
                            (round) =>
                              JSON.parse(round)?.id === JSON.parse(value).id
                          );
                          return setSelectedRound(JSON.parse(foundRound));
                        }}
                        style={{ width: 200 }}
                      >
                        {selectedCodeFull?.rounds?.map((round, index) => (
                          <Option key={index} value={round}>
                            {JSON.parse(round).name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                      <Table
                        columns={projectByCodeColumns}
                        dataSource={filteredProjectList}
                        pagination={{
                          position: ["bottomLeft"],
                        }}
                        rowKey="id"
                        size="small"
                        bordered
                        scroll={{
                          x: true,
                        }}
                        onRow={(record) => ({
                          onClick: () => {
                            setSelectedProject(record);
                            handleTeamClick();
                          },
                        })}
                      />
                    </div>
                  </div>
                </section>
                <section className="container px-4 mx-auto mt-14 max-w-[85rem]">
                  <div className="flex flex-col mb-5">
                    <h3
                      className="font-bold text-xl text-left"
                      id="participants_listing"
                    >
                      Participants listing
                    </h3>

                    <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                      <Table
                        columns={DiaryColumns}
                        dataSource={participants}
                        pagination={{
                          position: ["bottomLeft"],
                        }}
                        rowKey="email"
                        size="small"
                        bordered
                        loading={isLoading}
                      />
                    </div>
                  </div>
                </section>
              </TabPane>
            )}
            {showCreateActivitiesTab && (
              <TabPane tab="Create Activities" key="createActivities">
                <div className="container px-4 mx-auto mt-14 max-w-[85rem]">
                  <div className="relative">
                    <BlockNoteView
                      editor={editor}
                      theme={"light"}
                      className="w-full"
                      onChange={async function (editor) {
                        const blocks = editor.topLevelBlocks;
                        for (const block of blocks) {
                          if (
                            block.type === "image" &&
                            block.props.url &&
                            !block.props.url.includes("beekrowd_storage")
                          ) {
                            const newUrl = await uploadImageFromURLToSupabase(
                              block.props.url
                            );
                            if (newUrl) {
                              block.props.url = newUrl;
                            }
                          }
                        }

                        // Handle video blocks
                        blocks.forEach((block) => {
                          if (block.type === "video") {
                            const videoElement = document.querySelector(
                              `video[src="${block.props.url}"]`
                            );
                            if (
                              videoElement &&
                              block.props.url.includes("youtube.com")
                            ) {
                              const videoId = block.props.url.split("v=")[1];
                              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              const iframe = document.createElement("iframe");
                              iframe.width = block.props.previewWidth || "100%";
                              iframe.height = "315";
                              iframe.src = embedUrl;
                              iframe.frameBorder = "0";
                              iframe.allow =
                                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                              iframe.allowFullscreen = true;
                              videoElement.replaceWith(iframe);
                            }
                          }
                        });
                        setContent(blocks);
                      }}
                    />

                    <div className="sm:px-5 sticky bottom-5 left-5">
                      <>
                        <button
                          className={`min-w-[110px] mt-8 hover:cursor-pointer py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent ${
                            isLoading
                              ? "bg-gray-600 disabled:opacity-50 disabled:pointer-events-none"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }  `}
                          onClick={handleSaveDiary}
                          type="button"
                        >
                          {isLoading ? (
                            <SpinnerBtn isLoading={isLoading} />
                          ) : (
                            "Save Diary"
                          )}
                        </button>
                      </>
                    </div>
                  </div>
                </div>
              </TabPane>
            )}
          </Tabs>
        </>
      </div>

      <Modal
        title="Judge Scores"
        open={isJudgeScoreModalOpen}
        onOk={() => setIsJudgeScoreModalOpen(false)}
        onCancel={() => setIsJudgeScoreModalOpen(false)}
        okText="Close"
        cancelText="Cancel"
        centered={true}
        width={600}
      >
        <Table
          columns={judgeScoreColumns}
          dataSource={judgeScores}
          rowKey="judgeEmail"
          pagination={false}
        />
      </Modal>

      <Modal
        title="Confirm Remove"
        open={isRemoveProjectModalOpen}
        onOk={confirmRemoveProject}
        onCancel={() => setIsRemoveProjectModalOpen(false)}
        okText="Remove"
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
        Are you sure to remove{" "}
        <span className="text-[#f5222d] font-semibold">
          {projectToRemove?.name}
        </span>{" "}
        from <span className="font-semibold">{selectedCodeFull?.code}</span>?{" "}
        <span className="text-[#f5222d] font-semibold">
          {projectToRemove?.name}
        </span>{" "}
        will no longer exist in this code.
      </Modal>

      <Modal
        title="Qualified project"
        open={isQualifiedModalOpen}
        onOk={handleQualified}
        onCancel={() => setIsQualifiedModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
        centered={true}
      >
        <div className="w-full mx-auto p-6 space-y-6">
          Is this{" "}
          <span className="text-[#2563EB] font-semibold">
            {projectToQualify?.name} ({projectToQualify?.company?.name})
          </span>{" "}
          moved to next round?
        </div>
      </Modal>

      <Modal
        title="Undo Qualified project"
        open={isUndoQualifiedModalOpen}
        onOk={handleUndoQualified}
        onCancel={() => setIsUndoQualifiedModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
        centered={true}
      >
        <div className="w-full mx-auto p-6 space-y-6">
          Are you sure you want to move{" "}
          <span className="text-[#2563EB] font-semibold">
            {projectToQualify?.name} ({projectToQualify?.company?.name})
          </span>{" "}
          back to the previous round?
        </div>
      </Modal>

      <Modal
        title={
          <>
            View Diary of{" "}
            <span className="text-[#2563EB] font-semibold">
              {selectedDiary}
            </span>
          </>
        }
        open={isDiaryModalOpen}
        footer={null}
        onOk={() => setIsDiaryModalOpen(false)}
        onCancel={() => setIsDiaryModalOpen(false)}
        okText="Close"
        cancelText="Cancel"
        centered={true}
        width={800}
      >
        <BlockNoteView
          editor={editor}
          theme={"light"}
          className="w-full mt-8"
        />
      </Modal>
    </div>
  );
};

export default CompetitionPost;
