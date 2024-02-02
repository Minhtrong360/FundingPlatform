import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { supabase } from "../../../supabase";

const columns = [
  {
    title: "Project Name",
    dataIndex: "projectName",
    key: "projectName",
  },
  {
    title: "Project Owner",
    dataIndex: "projectOwner",
    key: "projectOwner",
  },
  {
    title: "Active Users",
    dataIndex: "activeUsers",
    key: "activeUsers",
  },
  {
    title: "Event Count",
    dataIndex: "eventCount",
    key: "eventCount",
  },
  // {
  //   title: "New Users",
  //   dataIndex: "newUsers",
  //   key: "newUsers",
  // },
  {
    title: "User Engagement Duration (ms)",
    dataIndex: "userEngagementDuration",
    key: "userEngagementDuration",
  },
  {
    title: "Average Session Duration",
    dataIndex: "averageSessionDuration",
    key: "averageSessionDuration",
  },
  {
    title: "Screen Page Views",
    dataIndex: "screenPageViews",
    key: "screenPageViews",
  },
  // {
  //   title: "Conversions",
  //   dataIndex: "conversions",
  //   key: "conversions",
  // },
  // {
  //   title: "Screen Page Views Per Session",
  //   dataIndex: "screenPageViewsPerSession",
  //   key: "screenPageViewsPerSession",
  // },
  {
    title: "Screen Page Views Per User",
    dataIndex: "screenPageViewsPerUser",
    key: "screenPageViewsPerUser",
  },
  {
    title: "Scrolled Users",
    dataIndex: "scrolledUsers",
    key: "scrolledUsers",
  },
];

const StatBadge = ({ ggData }) => {
  const [projectData, setProjectData] = useState([]);
  console.log("ggData", ggData);
  useEffect(() => {
    const fetchProjects = async () => {
      const projectIds = ggData.map((item) => item.id);
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .in("id", projectIds);

      if (error) {
        console.error("Error fetching projects from Supabase:", error.message);
        return;
      }

      setProjectData(projects);
    };

    fetchProjects();
  }, [ggData]);

  const data = ggData?.map((item, index) => ({
    key: index.toString(),
    projectName:
      projectData.find((project) => project.id === item.id)?.name || "Unknown",
    ...item.data,
    projectOwner:
      projectData.find((project) => project.id === item.id)?.user_email ||
      "Unknown",
    ...item.data,
  }));

  console.log("data", data);
  const getRowClassName = (record, index) => {
    // Apply the 'text-md' Tailwind CSS class to all rows
    return "text-md";
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowClassName={getRowClassName}
      className="max-w-[85rem] overflow-auto pb-5"
    />
  );
};

export default StatBadge;
