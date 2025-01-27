import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { supabase } from "../../../supabase";
import { StarOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoadingButtonClick from "../../../components/LoadingButtonClick";
import { Avatar, Tooltip } from "antd";
import { formatDate } from "../../../features/DurationSlice";

const InterestButton = React.memo(({ onClick, isLiked, likeCount }) => (
  <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
    <Button
      className={`border border-gray-300 ${
        isLiked ? "bg-blue-600 text-white" : ""
      }`}
      onClick={onClick}
    >
      {isLiked ? "Unlike" : "Like"}
    </Button>
    <div style={{ marginLeft: "8px" }}>
      <StarOutlined />
      <span style={{ marginLeft: "4px" }}>{likeCount ? likeCount : 0}</span>
    </div>
  </div>
));

function Author({ company }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [projectData, setProjectData] = useState();
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (!projectData) {
          throw new Error("Project not found.");
        }
        setProjectData(projectData);
        const user_id = projectData.user_id;

        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user_id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setCurrentUser(data);
          setIsLiked(projectData.liked.includes(user.email));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    }

    fetchUserData();
  }, []);

  const [likedCount, setLikedCount] = useState(projectData?.liked.length);

  useEffect(() => {
    setLikedCount(projectData?.liked.length);
  }, [projectData?.liked.length]);

  const like = async () => {
    try {
      if (!currentUser || !user.email) return;

      const liked = [...projectData.liked];
      liked.push(user.email);

      // Thêm thông tin người like vào bảng likedNotifications
      const content = JSON.stringify([
        {
          id: company.id,
          name: company.name,
          project_id: company.project_id,
          project_name: projectData.name,
        },
      ]);
      const receivedUser = currentUser?.email;
      const { error: notificationError } = await supabase
        .from("likedNotifications")
        .insert([
          {
            receivedUser,
            content,
            from: user?.email,
            likedID: company?.project_id,
          },
        ]);

      if (notificationError) {
        throw notificationError;
      }

      const { error1 } = await supabase
        .from("users")
        .update({
          notification_count: currentUser?.notification_count + 1,
        })
        .eq("id", currentUser?.id);
      const { error2 } = await supabase
        .from("projects")
        .update({
          liked,
        })
        .eq("id", projectData?.id);

      if (error1 || error2) {
        throw error1 || error2;
      }

      // Cập nhật trạng thái của isLiked

      const newLikedCount = likedCount + 1;

      setLikedCount(newLikedCount);
      setIsLiked(true);
    } catch (error) {
      console.error("Error updating liked:", error);
    }
  };

  const unlike = async () => {
    try {
      if (!currentUser || !user.email) return;

      const liked = [...projectData.liked];

      const index = liked.indexOf(user.email);
      if (index !== -1) {
        liked.splice(index, 1);
        // Xóa thông báo like khỏi bảng likedNotifications
        const { error } = await supabase
          .from("likedNotifications")
          .delete()
          .eq("receivedUser", currentUser.email)
          .eq("from", user.email)
          .eq("likedID", projectData?.id)
          .single();

        if (error) {
          throw error;
        }

        const { updateError } = await supabase
          .from("projects")
          .update({
            liked,
          })
          .eq("id", projectData?.id);

        if (updateError) {
          throw updateError;
        }

        // Cập nhật trạng thái của isLiked
        const newLikedCount = likedCount - 1;

        setLikedCount(newLikedCount);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error updating unliked:", error);
    }
  };

  const onClickShowInterested = async () => {
    try {
      if (!currentUser || !user.email) return;

      if (isLiked) {
        unlike();
      } else {
        like();
      }
    } catch (error) {
      console.error("Error on click show interested:", error);
    }
  };

  return (
    <aside className="max-w-sm lg:w-1/4 py-5 px-1">
      <div className="sticky top-8 space-y-4 border-2 border-gray-300 rounded-md p-3">
        {isLoading ? (
          <LoadingButtonClick />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <div>
                {currentUser?.avatar ? (
                  <Avatar id="avatar" src={currentUser?.avatar} />
                ) : (
                  <Avatar
                    style={{
                      verticalAlign: "middle",
                    }}
                    size="large"
                  />
                )}
              </div>

              <Tooltip
                title={
                  currentUser?.full_name
                    ? currentUser?.full_name
                    : currentUser?.email
                }
              >
                <h4 className="font-bold truncate max-w-[150px] md:max-w-full">
                  {currentUser?.full_name
                    ? currentUser?.full_name
                    : currentUser?.email}
                </h4>
              </Tooltip>
            </div>

            <div className="mt-4">
              <p>{currentUser?.detail ? currentUser?.detail : "No detail"}</p>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">Company</h5>
                <p
                  className="text-sm text-gray-500 hover:cursor-pointer "
                  onClick={() => {
                    const website = currentUser?.company_website;
                    if (website) {
                      const prefixedWebsite =
                        website.startsWith("http://") ||
                        website.startsWith("https://")
                          ? website
                          : `http://${website}`;
                      window.open(prefixedWebsite, "_blank");
                    }
                  }}
                >
                  {currentUser?.company ? currentUser?.company : "No detail"}
                </p>
              </div>
              <div className="mt-4">
                <h5 className="font-bold text-gray-700">Joined</h5>
                <p className="text-sm text-gray-500">
                  {formatDate(currentUser?.created_at)}
                </p>
              </div>
              <InterestButton
                onClick={onClickShowInterested}
                isLiked={isLiked}
                likeCount={likedCount}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default Author;
