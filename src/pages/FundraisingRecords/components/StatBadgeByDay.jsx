import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { supabase } from "../../../supabase";
import Chart from "react-apexcharts";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Project Name",
    dataIndex: "projectName",
    key: "projectName",
  },
  // {
  //   title: "Owner",
  //   dataIndex: "projectOwner",
  //   key: "projectOwner",
  //   ellipsis: true,
  // },
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
  {
    title: "Screen Page Views Per User",
    dataIndex: "screenPageViewsPerUser",
    key: "screenPageViewsPerUser",
  },
  // {
  //   title: "Scrolled Users",
  //   dataIndex: "scrolledUsers",
  //   key: "scrolledUsers",
  // },
];

const StatBadgeByDay = ({ ggData, setIsLoading }) => {
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const projectIds = ggData.flatMap((item) =>
        item.reports.map((report) => report.id)
      );
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .in("id", projectIds);

      if (error) {
        console.error("Error fetching projects from Supabase:", error.message);
        return;
      }

      setProjectData(projects);
      setIsLoading(false);
    };
    if (ggData.length > 0) {
      fetchProjects();
    }
  }, [ggData]);

  const data = ggData.flatMap((item, index) => {
    return item.reports.map((report) => {
      const project = projectData.find((project) => project.id === report.id);
      return {
        key: `${index}_${report.id}`,
        projectName: project ? project.name : "Unknown",
        date: item.date,
        ...report.data,
        projectOwner: project ? project.user_email : "Unknown",
      };
    });
  });

  const getRowClassName = (record, index) => {
    return "text-md";
  };

  const [customerGrowthChart, setCustomerGrowthChart] = useState({
    options: {
      chart: {
        id: "customer-growth-chart",
        type: "area", // Area chart
        height: 350,
        toolbar: {
          show: false, // Hide the toolbar
        },
      },
      xaxis: {
        type: "datetime",
        categories: [],
        labels: {
          show: false, // Show only the x-axis labels
        },
        axisBorder: {
          show: false, // Hide the axis border
        },
        axisTicks: {
          show: false, // Hide the axis ticks
        },
      },
      yaxis: {
        show: false, // Hide the y-axis
      },
      fill: {
        type: "gradient", // Gradient fill for smooth transition
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.2,
        },
      },
      dataLabels: {
        enabled: false, // Disable data labels
      },
      stroke: {
        curve: "smooth", // Smooth curve
        width: 1, // Thin line for the stroke
      },
      markers: {
        size: 0, // No markers on the line
      },
      grid: {
        show: false, // Hide the grid
      },
      colors: ["#A2D2FF", "#FFA8A8"], // Colors for the areas
      tooltip: {
        enabled: false, // Disable tooltips
      },
    }
    ,
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const seriesMap = {};
      const xCategories = [];

      for (const item of ggData) {
        for (const report of item.reports) {
          const id = report.id;
          const project = projectData.find((project) => project.id === id);
          if (!seriesMap[id]) {
            seriesMap[id] = {
              name: project ? project.name : `Project ${id}`,
              data: [],
            };
          }

          const timestamp = new Date(item.date).getTime();
          seriesMap[id].data.push([timestamp, report.data.activeUsers]);

          if (!xCategories.includes(timestamp)) {
            xCategories.push(timestamp);
          }
        }
      }

      xCategories.sort((a, b) => a - b);

      setCustomerGrowthChart((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: xCategories,
          },
        },
        series: Object.values(seriesMap),
      }));
    };

    fetchData();
  }, [ggData, projectData]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowClassName={getRowClassName}
        className="max-w-[85rem] overflow-auto pb-5 "
      />

      <Chart
        options={customerGrowthChart.options}
        series={customerGrowthChart.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default StatBadgeByDay;
