import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { supabase } from "../../../supabase";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import LoadingButtonClick from "../../../components/LoadingButtonClick";
import { Avatar } from "antd";
import { formatDate } from "../../../features/DurationSlice";

const InterestButton = React.memo(({ onClick, isLiked }) => (
  <Button
    className={`border border-gray-200 w-full mt-4 ${
      isLiked ? "bg-blue-600 text-white" : ""
    }`}
    onClick={onClick}
  >
    {isLiked ? "Unlike" : "Like"} &nbsp;{" "}
    {isLiked ? <StarFilled /> : <StarOutlined />}
  </Button>
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
        console.log("liked", liked);
        // Xóa thông báo like khỏi bảng likedNotifications
        const { error } = await supabase
          .from("likedNotifications")
          .delete()
          .eq("receivedUser", currentUser.email)
          .eq("from", user.email)
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
    <aside className="w-full lg:w-1/4 py-8 px-4 xl:pl-8">
      <div className="sticky top-8 space-y-4">
        {isLoading ? (
          <LoadingButtonClick />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <div className="avatar-container">
                <Avatar
                  id="avatar"
                  src={currentUser?.avatar}
                  className="avatar"
                />
              </div>

              <div>
                <h4 className="font-bold">
                  {currentUser?.full_name
                    ? currentUser?.full_name
                    : currentUser?.email}
                </h4>
              </div>
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
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default Author;
