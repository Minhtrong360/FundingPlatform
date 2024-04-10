import React, { useState, useEffect } from "react";
import Header from "../Home/Header";
import { supabase } from "../../supabase"; // Import supabase connection
import { useAuth } from "../../context/AuthContext";

const NotificationItem = ({ notification, isLiked }) => {
  const parsedContent = JSON.parse(notification?.content);

  // Calculate the time passed since createdAt
  const timePassed = (created_at) => {
    const createdDate = new Date(created_at); // Convert createdAt to a JavaScript Date object
    const now = new Date(); // Get current date
    const timeDifference = Math.abs(now - createdDate); // Calculate time difference in milliseconds
    const minutesPassed = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
    const hoursPassed = Math.floor(minutesPassed / 60); // Convert minutes to hours
    const daysPassed = Math.floor(hoursPassed / 24); // Convert hours to days

    if (daysPassed > 0) {
      // If more than 24 hours have passed, display the date in dd/mm/yyyy format
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return createdDate.toLocaleDateString("en-GB", options);
    } else if (hoursPassed > 0) {
      // If less than 24 hours but more than 0 hours have passed, display hours
      return `${hoursPassed} hours ago`;
    } else {
      // If less than an hour has passed, display minutes
      return `${minutesPassed} minutes ago`;
    }
  };

  const navigateToFounderPage = (founderId) => {
    window.location.href = `/founder/${founderId}`;
  };

  return (
    <div className="flex justify-between items-start px-4 py-2 border-b border-gray-200">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Message</p>
        <p className="text-sm text-gray-600 mt-4">
          {isLiked ? (
            <div>
              {" "}
              <span className="font-semibold">{notification?.from}</span> liked
              your project:
            </div>
          ) : (
            "Check out these projects tailored to your interests"
          )}
        </p>

        {Object.keys(parsedContent).map((key, index) => (
          <span
            key={index}
            className="mr-3 ant-tag bg-bg-gray-50 border border-gray-200 text-black mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-center rounded-md"
          >
            <span
              className="font-semibold text-sm hover:cursor-pointer"
              onClick={() =>
                navigateToFounderPage(parsedContent[key].project_id)
              }
            >
              {isLiked
                ? `${parsedContent[key].project_name}`
                : `${parsedContent[key].name}`}
            </span>
            {index < parsedContent.length - 1 && " "}
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {timePassed(notification?.created_at)}
      </span>
    </div>
  );
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    // Function to fetch notifications from Supabase
    const fetchNotifications = async () => {
      const { data: normalNotification, error: normalError } = await supabase
        .from("notifications")
        .select("*")
        .eq("receivedUser", user.email); // Query notifications for current user
      const { data: likedNotification, error: likedError } = await supabase
        .from("likedNotifications")
        .select("*")
        .eq("receivedUser", user.email); // Query notifications for current user
      if (normalError || likedError) {
        console.error(
          "Error fetching notifications:",
          likedError.message || normalError.message
        );
      } else {
        const combinedNotifications = [
          ...normalNotification,
          ...likedNotification,
        ];
        const sortedNotifications = combinedNotifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setNotifications(sortedNotifications); // Set notifications state with fetched data
      }
    };

    fetchNotifications(); // Call the function to fetch notifications
  }, [user.email]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 mt-24 lg:w-[50vw] w-full mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <h1 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">
            Notifications
          </h1>
          {notifications && (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  notification={notification}
                  isLiked={notification?.likedID ? true : false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
