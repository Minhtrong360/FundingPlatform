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

function Author() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setIsLoading(true);

        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("user_id")
          .eq("id", id)
          .single();

        if (projectError) {
          throw projectError;
        }

        if (!projectData) {
          throw new Error("Project not found.");
        }

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
          setIsLiked(data.liked.includes(user.email));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    }

    fetchUserData();
  }, []);

  const onClickShowInterested = async () => {
    try {
      if (!currentUser || !user.email) return;

      const liked = [...currentUser.liked];

      if (isLiked) {
        const index = liked.indexOf(user.email);
        if (index !== -1) {
          liked.splice(index, 1);
        }
      } else {
        liked.push(user.email);
      }

      const { error } = await supabase
        .from("users")
        .update({ liked })
        .eq("id", currentUser.id);

      if (error) {
        throw error;
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating liked:", error);
    }
  };

  return (
    <aside className="w-full md:w-1/4 py-8 px-4 md:pl-8">
      <div className="sticky top-24 space-y-4">
        {isLoading ? (
          <LoadingButtonClick />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <Avatar
                id="avatar"
                src={currentUser?.avatar}
                style={{
                  width: "40px",
                  height: "40px",
                }}
              />
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
