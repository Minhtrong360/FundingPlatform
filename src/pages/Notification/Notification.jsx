import React from "react";
import Header from "../Home/Header";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    name: "Phuc Le",
    message: "đã thêm 11 ảnh mới: Lên đường cày thôi! Cảm ơn cô chú anh...",
    time: "3 giờ trước",
  },
  {
    id: 2,
    name: "Phuc Le",
    message: "đã thêm 11 ảnh mới: Lên đường cày thôi! Cảm ơn cô chú anh...",
    time: "10 giờ trước",
  },
  // ... add other notifications here
];

const NotificationItem = ({ name, message, time }) => (
  <div className="flex justify-between items-start px-4 py-2 border-b border-gray-200">
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-800">{name}</p>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

const Notifications = () => (
  <div className="bg-white shadow overflow-hidden sm:rounded-md">
    <h1 className="text-xl font-semibold text-gray-900 p-4 border-b border-gray-200">
      Notifications
    </h1>
    <div className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  </div>
);

const NotificationsPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8 mt-24 w-[50vw] mx-auto">
        <Notifications />
      </div>
    </>
  );
};

export default NotificationsPage;
