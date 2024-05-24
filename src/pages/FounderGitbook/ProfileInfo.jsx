import { Avatar, Badge, Modal, Tooltip, message } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "../../features/CostSlice";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import ButtonGroup from "./ButtonGroup";
import { useAuth } from "../../context/AuthContext";
import { UserOutlined } from "@ant-design/icons";

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
        canClick === false ? "mt-4 " : "mx-auto sm:mt-26 mt-16"
      } px-4 sm:px-6 lg:px-8 `}
    >
      {showConfirmation && (
        <Modal
          title="Apply verification"
          open={showConfirmation}
          onOk={handleRequiredVerification}
          onCancel={() => setShowConfirmation(false)}
          okText="Agree"
          cancelText="Disagree"
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
        ></Modal>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start transform scale-90">
        <div>
          <div className="flex justify-start items-center">
            <Avatar
              shape="square"
              size={64}
              src={company.project_url ? company.project_url : null}
              icon={!company.project_url && <UserOutlined />}
            />

            <h1 className="text-4xl font-bold leading-tight text-gray-900 mx-2">
              {company?.name ? company?.name : "VoltDrive (DEMO)"}
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
          <p
            className="mt-4 text-black"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {company?.description
              ? company?.description
              : "In the bustling heart of Silicon Valley, nestled among the towering tech giants, lies a beacon of innovation and sustainability: VoltDrive Electric. Founded by visionary engineer, Emily Rodriguez, VoltDrive is not just an electric car company; it's a revolution on wheels. At VoltDrive, every day begins with a dedication to a greener, cleaner future. Their state-of-the-art manufacturing facility, powered entirely by renewable energy, is a testament to their commitment to sustainability. The sleek, modern architecture of the building mirrors the company's ethos: merging cutting-edge technology with eco-conscious design."}
          </p>
          <div className="mt-4 flex gap-4">
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
                >
                  Book Meeting
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                title={
                  company?.calendly ? "" : "You need to add a Calendly link"
                }
              >
                <Button
                  className={`bg-blue-600 text-white ${
                    company?.calendly ? "" : "bg-blue-600"
                  }`}
                  onClick={() => window.open(company?.calendly, "_blank")}
                  // disabled={company?.calendly ? false : true}
                >
                  Book meeting
                </Button>
              </Tooltip>
            )}
          </div>
          <div className="mt-4">
            <div className="text-black font-semibold">Industry:</div>

            <div className=" mt-2  ">
              {company?.industry.length > 0 ? (
                company?.industry?.map((industry, index) => (
                  <Badge
                    key={index}
                    className="mx-2 bg-yellow-300 border border-gray-300 truncate text-black mt-4  inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm  text-center   rounded-3xl "
                  >
                    {industry}
                  </Badge>
                ))
              ) : (
                <Badge
                  key={1}
                  className="mx-2 bg-yellow-300 border border-gray-300 truncate text-black mt-4  inline-flex justify-center items-center gap-x-2 px-2 py-1 text-sm  text-center   rounded-3xl "
                >
                  Technology
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="relative mt-2 flex justify-end">
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
            <img
              alt="Insert your cover here"
              className="rounded-lg object-cover"
              height="400"
              src="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_storage/beekrowd_images/img-1710146272575"
              style={{
                aspectRatio: "600/400",
                objectFit: "cover",
              }}
              width="600"
            />
          )}

          {project?.verified && (
            <span className="absolute top-0 right-0 bg-yellow-300 text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
              Verified profile
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 transform scale-90">
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border ">
          <div className="text-xl font-semibold">
            $
            {company?.target_amount
              ? formatNumber(company?.target_amount)
              : "1,000,000"}
          </div>
          <div className="text-black mt-2">Target amount</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">
            $
            {company?.ticket_size
              ? formatNumber(company?.ticket_size)
              : "100,000"}
          </div>
          <div className="text-black mt-2">Min ticket size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">
            {company?.revenueStatus ? company?.revenueStatus : "0k-10k"}
          </div>
          <div className="text-black mt-2">Revenue range</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">
            {" "}
            ${company?.amountRaised ? formatNumber(company?.amountRaised) : "0"}
          </div>
          <div className="text-black mt-2">Raised before</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">
            {company?.teamSize ? company?.teamSize : "1-10"}+
          </div>
          <div className="text-black mt-2">Team size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">Round</div>
          <div className="text-black mt-2">
            {company?.round ? company?.round : "Pre-seed"}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">Established</div>
          <div className="text-black mt-2">
            {company?.operationTime ? company?.operationTime : "2024"}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <Tooltip title={company?.offer}>
            <div className="text-xl font-semibold">Offer</div>
            <div className="text-black mt-2 truncate">
              {company?.offer ? company?.offer : "5% equity"}
            </div>
          </Tooltip>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <div className="text-xl font-semibold">Type</div>
          <div className="text-black mt-2">
            {company?.offer_type ? company?.offer_type : "Investment"}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
          <Tooltip title={company?.website}>
            <div className="text-xl font-semibold ">Website</div>
            <div
              className="text-black mt-2 truncate hover:cursor-pointer"
              onClick={() => window.open(company?.website)}
            >
              {company?.website
                ? company?.website
                    .replace(/^(https?:\/\/)?(www\.)?/i, "")
                    .replace(/^(http?:\/\/)?(www\.)?/i, "")
                    .replace(/\/+$/, "")
                : "beekrowd.com"}
            </div>
          </Tooltip>
        </div>
        {/* Repeat the structure for other statistic cards */}
      </div>
    </div>
  );
}
