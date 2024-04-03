import { Avatar, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabase";
import LoadingButtonClick from "../../../components/LoadingButtonClick";
import { formatDate } from "../../../features/DurationSlice";

function Author() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const id = "3ec3f142-f33c-4977-befd-30d4ce2b764d";

  useEffect(() => {
    async function fetchUserData() {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        setIsLoading(true);

        // Lấy user_id từ bảng projects
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

        // Lấy thông tin user từ bảng users với user_id đã lấy được
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
        }
      } catch (error) {
        message.error(error.message);
        console.error("Error fetching user data:", error);
      }
      setIsLoading(false);
    }

    fetchUserData();
  }, [id]);

  console.log("currentUser", currentUser);

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick />
      ) : (
        <aside className="w-full md:w-1/4 py-8 px-4 md:pl-8">
          <div className="sticky top-24 space-y-4">
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
                {/* <p className="text-sm text-gray-500">34k followers</p> */}
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
              <Button className="border border-gray-200  w-full mt-4">
                Follow me
              </Button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Author;
