import { Avatar, Modal, Tooltip, message } from "antd";

import { useNavigate, useParams } from "react-router-dom";
import { formatNumber } from "../../features/CostSlice";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import ButtonGroup from "./ButtonGroup";
import { useAuth } from "../../context/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Settings } from "lucide-react";

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
        canClick === false ? "mt-4 " : "mx-auto sm:mt-24 mt-16"
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

      <Card className="overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar
                shape="square"
                size={64}
                src={company.project_url ? company.project_url : null}
                icon={!company.project_url && <UserOutlined />}
              />
              <div>
                <CardTitle className="text-2xl font-bold">
                  {company?.name ? company?.name : "VoltDrive (DEMO)"}
                </CardTitle>

                {company?.industry.length > 0 ? (
                  company?.industry?.map((industry, index) => (
                    <Badge key={index} className="mt-1 mr-2 bg-gray-100">
                      {industry}
                    </Badge>
                  ))
                ) : (
                  <Badge key={1} className="mt-1 bg-gray-100">
                    Technology
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                className="text-white bg-slate-800"
                onClick={() => window.open(company?.calendly, "_blank")}
              >
                Book meeting
              </Button>
              <ButtonGroup
                handleDrawChart={handleDrawChart}
                handleCompanySettings={handleCompanySettings}
                handleRequired={handleRequired}
                currentProject={currentProject}
                isLoading={isLoading}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 space-y-4">
              <p
                className="text-muted-foreground"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {company?.description
                  ? company?.description
                  : "In the bustling heart of Silicon Valley, nestled among the towering tech giants, lies a beacon of innovation and sustainability: VoltDrive Electric. Founded by visionary engineer, Emily Rodriguez, VoltDrive is not just an electric car company; it's a revolution on wheels. At VoltDrive, every day begins with a dedication to a greener, cleaner future. Their state-of-the-art manufacturing facility, powered entirely by renewable energy, is a testament to their commitment to sustainability. The sleek, modern architecture of the building mirrors the company's ethos: merging cutting-edge technology with eco-conscious design."}
              </p>
            </div>
            <div className="relative aspect-video md:aspect-auto">
              {company.card_url ? (
                <img
                  alt="Insert your cover here"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
                  src={company.card_url}
                />
              ) : (
                <img
                  alt="Insert your cover here"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-b-lg md:rounded-r-lg md:rounded-bl-none"
                  src="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_storage/beekrowd_images/img-1710146272575"
                />
              )}

              {project?.verified && (
                <span className="absolute top-0 right-0 bg-[#ABFB4F] text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
                  Verified profile
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {company.showAdditionalFields === "Yes" && (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 transform">
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border ">
            <div className="text-xl font-semibold truncate">
              $
              {company?.target_amount
                ? formatNumber(company?.target_amount)
                : "1,000,000"}
            </div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              Target amount
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">
              $
              {company?.ticket_size
                ? formatNumber(company?.ticket_size)
                : "100,000"}
            </div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              Min ticket size
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">
              {company?.revenueStatus ? company?.revenueStatus : "0k-10k"}
            </div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              Revenue range
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">
              $
              {company?.amountRaised
                ? formatNumber(company?.amountRaised)
                : "0"}
            </div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              Raised before
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">
              {company?.teamSize ? company?.teamSize : "1-10"}+
            </div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              Team size
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">Round</div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              {company?.round ? company?.round : "Pre-seed"}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">Established</div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              {company?.operationTime ? company?.operationTime : "2024"}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <Tooltip title={company?.offer}>
              <div className="text-xl font-semibold truncate">Offer</div>
              <div className="text-black mt-2 truncate">
                {company?.offer ? company?.offer : "5% equity"}
              </div>
            </Tooltip>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <div className="text-xl font-semibold truncate">Type</div>
            <div className="text-black mt-2 truncate hover:cursor-pointer">
              {company?.offer_type ? company?.offer_type : "Investment"}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-300 border">
            <Tooltip title={company?.website}>
              <div className="text-xl font-semibold truncate">Website</div>
              <div
                className="text-black mt-2 truncate hover:cursor-pointer"
                onClick={() => window.open(company?.website)}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {company?.website
                  ? company?.website
                      .replace(/^(https?:\/\/)?(www\.)?/i, "")
                      .replace(/\/+$/, "")
                  : "beekrowd.com"}
              </div>
            </Tooltip>
          </div>
          {/* Repeat the structure for other statistic cards */}
        </div>
      )}
    </div>
  );
}
