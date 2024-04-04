import { Badge, Tag, Tooltip, message } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "../../features/CostSlice";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import ButtonGroup from "./ButtonGroup";
import { useAuth } from "../../context/AuthContext";
import ReactModal from "react-modal";

export default function ProfileInfo({
  company,
  canClick,
  currentProject,
  setCurrentProject,
  blocks,
}) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading
  const params = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      if (!company.id) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", company.project_id)
          .single();

        if (error) {
          throw error;
        }

        setProject(data);
      } catch (error) {
        console.log("Error fetching project:", error.message);
      }
    };

    fetchProject();
  }, [company]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDrawChart = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }

      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params?.id })
          .single();

        if (
          projectData &&
          (projectData?.user_id === user?.id ||
            projectData?.collabs?.includes(user?.email))
        ) {
          // Only allow save if project.user_id matches user.id

          const { error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });

          if (error) {
            message.error(error.message);
          } else {
            // Set isSaved to true after a successful save

            // Reset isLoading to false and enable the button
            setIsLoading(false);

            // Reset isSaved to false after 1 second
          }
        } else {
          // Handle the case where project.user_id doesn't match user.id
          message.error("You do not have permission to save this project.");

          setIsLoading(false);
        }
      }
    } catch (error) {
      if (!navigator.onLine) {
        message.error("No internet access.");
      } else {
        message.error(error.message);
      }
      setIsLoading(false);
    }
    navigate(`/trials`);
  };

  const handleCompanySettings = async () => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }

      if (params) {
        // Set isLoading to true to disable the button and show loading indicator
        setIsLoading(true);

        const { data: projectData } = await supabase
          .from("projects")
          .select("*")
          .match({ id: params.id })
          .single();

        if (
          projectData &&
          (projectData?.user_id === user?.id ||
            projectData?.collabs.includes(user?.email))
        ) {
          // Only allow save if project.user_id matches user.id

          const { error } = await supabase
            .from("projects")
            .update({ markdown: blocks })
            .match({ id: params.id });

          if (error) {
            message.error(error.message);
          } else {
            // Set isSaved to true after a successful save

            // Reset isLoading to false and enable the button
            setIsLoading(false);

            // Reset isSaved to false after 1 second
          }
        } else {
          // Handle the case where project.user_id doesn't match user.id
          message.error("You do not have permission to save this project.");

          setIsLoading(false);
        }
      }
    } catch (error) {
      if (!navigator.onLine) {
        message.error("No internet access.");
      } else {
        message.error(error.message);
      }
      setIsLoading(false);
    }
    navigate(`/company/${params.id}`);
  };
  const [showConfirmation, setShowConfirmation] = useState(false);
  const handleRequired = async () => {
    setShowConfirmation(true);
  };

  const handleRequiredVerification = async () => {
    try {
      setIsLoading(true);

      // Tìm tất cả user có trường admin = true
      const { data: adminUsers, error: adminUsersError } = await supabase
        .from("users")
        .select("email")
        .eq("admin", true);

      const adminEmails = [];

      adminUsers.map((user) => adminEmails.push(user.email));

      if (adminUsersError) {
        throw adminUsersError;
      }

      // Cập nhật trường required của dự án và lấy dự án hiện tại
      const { data, error } = await supabase
        .from("projects")
        .update({ required: true })
        .match({ id: params.id })
        .select();

      if (error) throw error;

      let updatedInvitedUser = data[0].invited_user || [];

      updatedInvitedUser = [...updatedInvitedUser, ...adminEmails];

      // Thêm danh sách email của user admin vào trường invited_user của dự án
      const updatedProject = await supabase
        .from("projects")
        .update({ invited_user: updatedInvitedUser })
        .match({ id: params.id })
        .select();

      setCurrentProject(updatedProject);
      window.location.reload();
      setShowConfirmation(false);

      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      message.error(error.message);
    }
  };

  return (
    <div
      key="1"
      className={`max-w-7xl ${
        canClick === false ? "mt-16 " : "mx-auto mt-32"
      } px-4 sm:px-6 lg:px-8 `}
    >
      <ReactModal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
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
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-md">
            <h2 className="mt-2 text-base text-gray-500 ">
              {" "}
              Our admins need to see all of your project, include your content,
              your files,... If you agree, we will start to verify as soon as
              possible.
            </h2>

            <div className="mt-4 flex items-center gap-10">
              <button
                type="button"
                onClick={handleRequiredVerification}
                className="w-full px-3 py-2 mt-3 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 hover:bg-blue-700"
              >
                Agree and Continue
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmation(false)} // Sử dụng hàm addLink để thêm liên kết
                className="w-full px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 transform border rounded-md hover:bg-gray-100"
              >
                Disagree
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start transform scale-90">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold leading-tight text-gray-900">
              {company?.name}
            </h1>
            {user?.id === currentProject?.user_id ||
            currentProject?.collabs?.includes(user.email) ? (
              <div className="ml-auto">
                <ButtonGroup
                  handleDrawChart={handleDrawChart}
                  handleCompanySettings={handleCompanySettings}
                  handleRequired={handleRequired}
                  currentProject={currentProject}
                  isLoading={isLoading}
                />
              </div>
            ) : null}
          </div>
          <p className="mt-4 text-black">{company?.description}</p>
          <div className="mt-6 flex gap-4">
            {canClick === false ? (
              <Tooltip
                title={
                  company?.calendly
                    ? ""
                    : "You need to add a Calendly link or a Google Meeting"
                }
              >
                <Button
                  className={`bg-blue-600 text-white ${
                    company?.calendly ? "" : "bg-blue-600"
                  }`}
                  onClick={() => navigate(company?.calendly)}
                  disabled={true}
                >
                  Book meeting
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                title={
                  company?.calendly
                    ? ""
                    : "You need to add a Calendly link or a Google Meeting"
                }
              >
                <Button
                  className={`bg-blue-600 text-white ${
                    company?.calendly ? "" : "bg-blue-600"
                  }`}
                  onClick={() => navigate(company?.calendly)}
                  // disabled={company?.calendly ? false : true}
                >
                  Book meeting
                </Button>
              </Tooltip>
            )}

            {/* <Button type="primary" ghost>
              Learn more
            </Button> */}
          </div>
          <div className="mt-8">
            <div className="text-black font-semibold">Features:</div>

<<<<<<< HEAD
            <div className="grid grid-cols-2 sm:flex mt-2 space-x-0 sm:space-x-4 gap-4">
=======
            <div className=" mt-4 grid grid-cols-2 xl:grid-cols-3 ">
>>>>>>> 549b8a19b05424b9f3cf00e3b5b5d1435aa3fd50
              {company?.industry?.map((industry, index) => (
                <Tag
                  key={index}
<<<<<<< HEAD
                  title={`Industry: ${industry}`}
                  className="min-h-6 bg-yellow-300 text-black px-2 py-1 rounded-md"
=======
                  className="bg-yellow-300 border border-gray-200 text-black mt-4  inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm  text-center   rounded-3xl "
>>>>>>> 549b8a19b05424b9f3cf00e3b5b5d1435aa3fd50
                >
                  {industry}
                </Tag>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <div className="text-black font-semibold">Key words:</div>

            <div className="mt-4 grid grid-cols-2 xl:grid-cols-3">
              {company?.keyWords &&
                company.keyWords.split(",").map((keyWord, index) => (
                  <Tag
                    key={index}
                    className="bg-yellow-300 border border-gray-200 text-black mt-4 inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm text-center rounded-3xl"
                  >
                    {keyWord.trim()}
                  </Tag>
                ))}
            </div>
          </div>
        </div>
        <div className="relative mt-2">
          {company.card_url ? (
            <img
              alt="Insert your cover here"
              className="rounded-lg object-cover"
              height="400"
              src={company.card_url}
              style={{
                aspectRatio: "600/400",
                objectFit: "cover",
              }}
              width="600"
            />
          ) : (
            <div className="w-[400px] h-[300px] bg-gray-300"></div>
          )}

          {project?.verified && (
            <span className="absolute top-0 right-0 bg-yellow-300 text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
              Verified profile
            </span>
          )}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 transform scale-90">
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border ">
          <div className="text-xl font-semibold">
            ${formatNumber(company?.target_amount)}
          </div>
          <div className="text-black mt-2">Target amount</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">
            ${formatNumber(company?.ticket_size)}
          </div>
          <div className="text-black mt-2">Min ticket size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">{company?.revenueStatus}</div>
          <div className="text-black mt-2">Revenue range</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">
            {" "}
            ${formatNumber(company?.amountRaised)}
          </div>
          <div className="text-black mt-2">Raised before</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">{company?.teamSize}+</div>
          <div className="text-black mt-2">Team size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Round</div>
          <div className="text-black mt-2">{company?.round}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Established</div>
          <div className="text-black mt-2">{company?.operationTime}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Offer</div>
          <div className="text-black mt-2">{company?.offer}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Type</div>
          <div className="text-black mt-2">{company?.offer_type}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold ">Website</div>
          <div
            className="text-black mt-2 truncate hover:cursor-pointer"
            onClick={() => window.open(company?.website)}
          >
            {company?.website.replace(/^https?:\/\/(www\.)?/i, "")}
          </div>
        </div>
        {/* Repeat the structure for other statistic cards */}
      </div>
    </div>
  );
}
