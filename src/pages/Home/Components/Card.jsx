import { useNavigate } from "react-router-dom";

import { Input, Modal, Tag, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../../supabase";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  CalendarIcon,
  UsersIcon,
  CodeIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Card as CardShadcn,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

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
  project,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user

  const handleButtonClick = () => {
    if (isJudge) {
      openScoreModal(selectedCodeFull);
    } else {
      navigate(`/profile/${project_id}`);
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
      navigate(`/profile/${project.project_id}`);
    } else return;
  };
  console.log("projectList", projectList);
  console.log("selectedCodeFull", selectedCodeFull);

  return (
    <>
      <CardShadcn
        key={project?.id}
        className="bg-white overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
      >
        <CardHeader className="p-0">
          <img
            src={project?.card_url}
            alt={project?.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl font-bold">{project?.name}</CardTitle>

            <Badge
              className={
                project?.status === "public" ? "text-white" : "bg-[#ABFB4F]"
              }
            >
              {project?.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {project?.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <Button
            variant="outline"
            className="w-full group flex-1 mr-2"
            onClick={handleClick}
          >
            View
            <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          {selectedCodeFull && isJudge && (
            <Button
              variant="outline"
              className="w-full group flex-1 ml-2"
              onClick={handleButtonClick}
            >
              Giving Score
              <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </CardFooter>
      </CardShadcn>

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
    </>
  );
};

export default Card;
