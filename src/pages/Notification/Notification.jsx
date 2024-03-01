import React, { useState, useEffect } from "react";
import Header from "../Home/Header";
import { supabase } from "../../supabase"; // Import supabase connection
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NotificationItem = ({ notification }) => {
  console.log("notification", notification);

  const parsedContent = JSON.parse(notification.content);

  // Calculate the time passed since createdAt
  const timePassed = () => {
    const createdDate = new Date(notification.created_at); // Convert createdAt to a JavaScript Date object
    const now = new Date(); // Get current date
    const timeDifference = Math.abs(now - createdDate); // Calculate time difference in milliseconds
    const minutesPassed = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
    if (minutesPassed < 60) {
      return `${minutesPassed} phút trước`;
    } else {
      const hoursPassed = Math.floor(minutesPassed / 60);
      return `${hoursPassed} giờ trước`;
    }
  };
  const navigateToFounderPage = (founderId) => {
    window.location.href = `/founder/${founderId}`;
  };

  console.log("notification", notification.content);

  return (
    <div className="flex justify-between items-start px-4 py-2 border-b border-gray-200">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">Thông báo</p>
        <p className="text-sm text-gray-600 mt-1">
          Các dự án sau có thể phù hợp với nhu cầu của bạn:
          <span
            className="font-semibold hover:cursor-pointer"
            onClick={() => navigateToFounderPage(parsedContent.project_id)}
          >
            {" "}
            {parsedContent.name}{" "}
          </span>
        </p>
      </div>
      <span className="text-xs text-gray-500">{timePassed()}</span>
    </div>
  );
};

const Notifications = ({ notifications }) => (
  <div className="bg-white shadow overflow-hidden sm:rounded-md">
    <h1 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">
      Notifications
    </h1>
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  </div>
);

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    // Function to fetch notifications from Supabase
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("receivedUser", user.email); // Query notifications for current user
      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setNotifications(data); // Set notifications state with fetched data
      }
    };

    fetchNotifications(); // Call the function to fetch notifications
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 mt-24 w-[50vw] mx-auto">
        <Notifications notifications={notifications} />
      </div>
    </>
  );
};

export default NotificationsPage;
