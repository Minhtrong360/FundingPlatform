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
import { CalendarClock, Heart, Settings, Share2 } from "lucide-react";

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
    <div key="1">
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

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 !mb-4 lg:!mb-0">
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

            <div className="text-sm text-gray-500">
              {company?.industry && company.industry.length > 0
                ? company.industry.join(" • ")
                : "Technology"}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            className="text-white bg-slate-800"
            onClick={() => window.open(company?.calendly, "_blank")}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            <span>Book Meeting</span>
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

      <p
        className="text-muted-foreground"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {company?.description
          ? company?.description
          : "In the bustling heart of Silicon Valley, nestled among the towering tech giants, lies a beacon of innovation and sustainability: VoltDrive Electric. Founded by visionary engineer, Emily Rodriguez, VoltDrive is not just an electric car company; it's a revolution on wheels. At VoltDrive, every day begins with a dedication to a greener, cleaner future. Their state-of-the-art manufacturing facility, powered entirely by renewable energy, is a testament to their commitment to sustainability. The sleek, modern architecture of the building mirrors the company's ethos: merging cutting-edge technology with eco-conscious design."}
      </p>

      <div className="relative mb-8 group">
        {company.card_url ? (
          <img
            alt="Insert your cover here"
            layout="fill"
            objectFit="cover"
            width={800}
            height={400}
            className="rounded-lg w-full"
            src={company.card_url}
          />
        ) : (
          <img
            alt="Insert your cover here"
            layout="fill"
            objectFit="cover"
            width={800}
            height={400}
            className="rounded-lg w-full"
            src="https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/beekrowd_storage/beekrowd_images/img-1710146272575"
          />
        )}

        {project?.verified && (
          <span className="absolute top-0 right-0 bg-[#ABFB4F] text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
            Verified profile
          </span>
        )}
        <div className="absolute top-2 left-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {company.showAdditionalFields === "Yes" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <InfoCard
            title={`$${company?.target_amount ? formatNumber(company?.target_amount) : "1,000,000"}`}
            subtitle="Target amount"
          />
          <InfoCard
            title={`$${company?.ticket_size ? formatNumber(company?.ticket_size) : "100,000"}`}
            subtitle="Min ticket size"
          />
          <InfoCard
            title={
              company?.revenueStatus ? company?.revenueStatus : "Pre-revenue"
            }
            subtitle="Revenue range"
          />
          <InfoCard
            title={`$${company?.amountRaised ? formatNumber(company?.amountRaised) : "0"}`}
            subtitle="Raised before"
          />
          <InfoCard
            title={`${company?.teamSize ? company?.teamSize : "1-10"}+`}
            subtitle="Team size"
          />
          <InfoCard
            title={company?.round ? company?.round : "Pre-seed"}
            subtitle="Round"
          />
          <InfoCard
            title={company?.operationTime ? company?.operationTime : "2024"}
            subtitle="Established"
          />
          <InfoCard
            title={company?.offer ? company?.offer : "5% equity"}
            subtitle="Offer"
          />
          <InfoCard
            title={company?.offer_type ? company?.offer_type : "Investment"}
            subtitle="Type"
          />
          {/* <InfoCard
            title={
              company?.website
                ? company.website
                    .replace(/^(https?:\/\/)?(www\.)?/i, "")
                    .replace(/\/+$/, "")
                : "beekrowd.com"
            }
            subtitle="Website"
            onClick={() => window.open(company?.website)}
          /> */}
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, subtitle }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-lg font-bold">{title}</div>
        <div className="text-sm text-gray-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}
