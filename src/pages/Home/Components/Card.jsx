import { useNavigate } from "react-router-dom";

import { Input, Modal, Tag, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";

const Card = ({
  title,
  description,
  imageUrl,
  buttonText,
  project_id,
  canClick,
  verified,
  status,
  selectedCodeFull,
  projectList,
  setProjectList,
  selectedRound,
  isJudge,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user

  const handleButtonClick = () => {
    if (isJudge) {
      openScoreModal(selectedCodeFull);
    } else {
      navigate(`/founder/${project_id}`);
    }
  };
  const [selectedProject, setSelectedProject] = useState();
  const [scoringRules, setScoringRules] = useState([]);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const openScoreModal = async (record) => {
    const project = projectList.find((proj) => proj.id === project_id);
    setSelectedProject(project);

    const scoringRulesForCode =
      selectedCodeFull?.scoringRules?.map((rule) => ({
        ...JSON.parse(rule),
        score: 0, // Initialize score to 0 or an appropriate default value
      })) || [];

    setScoringRules(scoringRulesForCode);
    setIsScoreModalOpen(true);
  };
  const handleScoreProject = async (project) => {
    // if (
    //   !selectedCodeFull.judges.some(
    //     (judge) => JSON.parse(judge).email === user.email
    //   )
    // ) {
    //   message.error(
    //     "You are not the JUDGE of this contest, so you cannot score this project"
    //   );
    //   return;
    // }
    console.log("project", project);

    const scoringInfo = project.scoringInfo || [];
    const newScoringEntry = {
      judgeEmail: user.email,
      codeId: selectedCodeFull.id,
      round: selectedRound.id,
      scores: scoringRules.reduce((acc, rule) => {
        acc[rule.feature] = rule.score;
        return acc;
      }, {}),
    };

    const existingIndex = scoringInfo.findIndex((entry) => {
      const parsedEntry = JSON.parse(entry);
      return (
        parsedEntry.judgeEmail === user.email &&
        parsedEntry.round === selectedRound.id
      );
    });

    let updatedScoringInfo;
    if (existingIndex >= 0) {
      // Replace the existing entry
      updatedScoringInfo = [...scoringInfo];
      updatedScoringInfo[existingIndex] = JSON.stringify(newScoringEntry);
    } else {
      // Add the new entry
      updatedScoringInfo = [...scoringInfo, JSON.stringify(newScoringEntry)];
    }

    try {
      const { error } = await supabase
        .from("projects")
        .update({ scoringInfo: updatedScoringInfo })
        .eq("id", project.id);

      if (error) {
        throw error;
      }

      const updatedProjects = projectList.map((proj) =>
        proj.id === project.id
          ? { ...proj, scoringInfo: updatedScoringInfo }
          : proj
      );
      setProjectList(updatedProjects);
      message.success("Score updated successfully");
    } catch (error) {
      message.error("Failed to update score");
      console.error("Error updating score:", error);
    } finally {
      setIsScoreModalOpen(false);
    }
  };

  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const initialTotalScore = scoringRules.reduce(
      (acc, rule) => acc + (rule.score || 0) * (Number(rule.rate) / 100),
      0
    );

    setTotalScore(initialTotalScore.toFixed(2));
  }, [scoringRules]);

  const handleScoreChange = (index, value) => {
    const newScore = Number(value);
    const updatedScoringRules = [...scoringRules];
    updatedScoringRules[index].score = newScore;

    const newTotalScore = updatedScoringRules.reduce(
      (acc, rule) => acc + (rule.score || 0) * (Number(rule.rate) / 100),
      0
    );
    setTotalScore(newTotalScore);
  };

  const handleClick = () => {
    if (canClick !== false) {
      navigate(`/founder/${project_id}`);
    } else return;
  };

  return (
    <div className="flex flex-col h-full max-w-sm bg-white border rounded-md shadow-md transition-all duration-300  hover:shadow-lg cursor-pointer">
      <div
        className="relative pt-[50%] sm:pt-[70%] rounded-t-lg overflow-hidden"
        onClick={handleClick}
      >
        {imageUrl ? (
          <>
            {canClick !== false ? (
              <img
                className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "
                src={imageUrl}
                alt="Company Avatar"
              />
            ) : (
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out"
                src={imageUrl}
                alt="Company Avatar"
              />
            )}
          </>
        ) : (
          <div className=" h-full w-full  absolute top-0 start-0 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out "></div>
        )}

        {verified && (
          <span className="absolute top-0 right-0 bg-yellow-300 text-gray-800 text-sm font-bold py-1.5 px-3 rounded-bl-lg">
            Verified profile
          </span>
        )}
      </div>

      <div className="flex-grow p-5">
        <a
          className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 "
          onClick={() => navigate(`/founder/${project_id}`)}
          href={`/founder/${project_id}`}
        >
          {title}
        </a>
        <p className="mb-2 text-sm font-normal text-gray-700  overflow-hidden text-ellipsis line-clamp-6">
          {description}
        </p>
      </div>

      <div className="px-5 pb-5  rounded-b-lg">
        <div className="flex justify-between items-center">
          {canClick !== false ? (
            <button
              onClick={handleButtonClick}
              className="mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 darkBgBlue darkHoverBgBlue darkFocus"
            >
              {isJudge ? "Giving Score" : buttonText}
            </button>
          ) : (
            <button
              className="mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-black bg-gray-100 rounded-md cursor-not-allowed darkBgBlue"
              disabled
            >
              {isJudge ? "Giving Score" : buttonText}
            </button>
          )}
          <Tag
            className={` ${
              status === "public"
                ? "bg-yellow-300 text-black"
                : "bg-bg-gray-50 border border-gray-300 text-black"
            } mt-1 inline-flex items-center px-3 py-1 text-sm font-medium text-center   rounded-3xl`}
            onClick={() => navigate(`/founder/${project_id}`)}
          >
            {status === "public"
              ? "Public"
              : status === "private"
                ? "Private"
                : "Stealth"}
          </Tag>
        </div>
      </div>
      <Modal
        title={
          <div>
            Giving Score for{" "}
            <span className="text-[#2563EB] font-semibold">
              {/* {selectedProject?.name?.toUpperCase()} ( */}
              {selectedProject?.company?.name?.toUpperCase()}
              {/* ) */}
            </span>
          </div>
        }
        open={isScoreModalOpen}
        onOk={() => handleScoreProject(selectedProject)}
        onCancel={() => setIsScoreModalOpen(false)}
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
        width={600}
      >
        <div className="w-full mx-auto p-6 space-y-6">
          <form className="grid gap-6 col-span-1 md:col-span-2">
            {scoringRules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="Feature"
                  value={rule.feature}
                  disabled
                  className="border-gray-300 rounded-md text-sm"
                />
                <Input
                  placeholder="Rate (%)"
                  type="number"
                  value={rule.rate}
                  disabled
                  className="border-gray-300 rounded-md text-sm"
                />
                <Input
                  placeholder="Score"
                  type="number"
                  value={rule.score}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  className="border-gray-300 rounded-md text-sm"
                />
              </div>
            ))}
            <div className="flex justify-end">
              <span className="text-lg font-semibold">
                Total Score: {totalScore}
              </span>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Card;
