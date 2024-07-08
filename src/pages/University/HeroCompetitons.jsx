import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import UniCard from "./UniCard";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

const HeroCompetitions = ({
  onSelectCode,

  selectedCode,
  setSelectedCodeFull,

  setSelectedRound,
  filterProjectsByRound,
  setProjectList,
}) => {
  const { user } = useAuth();

  const [codeData, setCodeData] = useState([]);
  const [projectCounts, setProjectCounts] = useState({});

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data: codes, error } = await supabase
          .from("code")
          .select("*")
          .eq("publish", true);

        if (error) {
          throw error;
        }

        const projectCounts = await fetchProjectCounts(codes);

        setCodeData(
          codes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        );
        setProjectCounts(projectCounts);
        setSelectedCodeFull(codes[0]);
        onSelectCode(codes[0]?.id);
        filterProjectsByCode(codes[0]?.id);
      } catch (error) {
        console.error("Error fetching code data:", error);
      }
    };

    fetchCodeData();
  }, []);
  const filterProjectsByCode = async (codeId) => {
    if (codeId) {
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

  useEffect(() => {
    // Parse rounds if they are stringified JSON
    const parsedRounds =
      selectedCode?.rounds?.map((round) =>
        typeof round === "string" ? JSON.parse(round) : round
      ) || [];

    setSelectedRound(parsedRounds[0] || null);
    filterProjectsByRound(parsedRounds[0] || null);
  }, [selectedCode]);

  const navigate = useNavigate();
  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/founder/${"3ec3f142-f33c-4977-befd-30d4ce2b764d"}`);
    }
  };

  const handleClickProfile = () => {
    navigate(`/founder`);
  };

  return (
    <section className="bg-white">
      <div className="sm:px-6 px-3 mx-auto text-center">
        <section className="bg-white mt-12">
          {" "}
          {/* Add margin-top */}
          <div className="sm:px-6 px-3 py-16 mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h1
                className="block text-3xl font-extrabold leading-relaxed text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl"
                style={{ lineHeight: "1.5" }}
              >
                <span className="text-blue-600 bg-yellow-300 h-6">
                  Profile listing for
                </span>{" "}
                Competitions.
              </h1>
              <p className="mt-6 text-lg text-gray-800">
                Create a fundraising profile and get the reward from
                Competitions on BEEKROWD. It will be easy, fast and
                well-structured.
              </p>
              <div className="mt-7 flex justify-center">
                {" "}
                {/* Add justify-center class */}
                <button
                  className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={handleClick}
                >
                  {user ? "See demo" : "Get started"}
                </button>
                {user && (
                  <button
                    className="sm:mx-4 mx-2 hover:cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleClickProfile}
                  >
                    Create profile
                  </button>
                )}
              </div>
            </div>

            <div className=" flex justify-center items-center h-full mt-8 ">
              <div className="w-full lg:w-2/3">
                <div
                  className="relative w-full overflow-hidden shadow-lg "
                  style={{ paddingTop: "56.25%", paddingBottom: "6.25%" }}
                >
                  <p>
                    <img
                      alt="Cover"
                      className="absolute top-0 left-0 right-0 w-full h-full"
                      src="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_storage/beekrowd_images/Competition_Cover.jpg"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></img>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {codeData.length > 0 && (
          <>
            <section className="container px-4 mx-auto mt-14 max-w-3xl">
              <div className="flex flex-col mb-5">
                <h3 className="font-bold text-xl text-left">Code listing</h3>
                <div className="mt-5 grid sm:grid-cols-2 gap-14 transition-all duration-600 ease-out transform translate-x-0">
                  {selectedCodes.map((code) => (
                    <div
                      key={code.id}
                      className="group flex-grow justify-center w-full"
                    >
                      <UniCard
                        data={code}
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
      </div>
    </section>
  );
};

export default HeroCompetitions;
