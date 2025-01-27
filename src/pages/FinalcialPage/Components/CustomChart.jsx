import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Modal } from "antd";
import { formatNumber } from "../../../features/CostSlice";
import { useSelector } from "react-redux";
import { FullscreenOutlined } from "@ant-design/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const CustomChart = ({
  numberOfMonths,
  id,
  yaxisTitle,
  seriesTitle,
  RenderData,
  options,
  title,
  chartStartMonth,
  chartEndMonth,
}) => {
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  const getDynamicMinMax = (seriesData) => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    // Check if seriesData is an array and not empty
    if (Array.isArray(seriesData) && seriesData.length > 0) {
      seriesData.forEach((serie) => {
        // Safely check if data is an array
        if (Array.isArray(serie.data)) {
          serie.data.forEach((value) => {
            if (value < min) min = value;
            if (value > max) max = value;
          });
        }
      });
    } else {
      // Set default min and max if seriesData is empty or undefined
      min = 0;
      max = 10; // You can adjust this default range
    }

    return { min, max };
  };

  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const xaxisCategories = Array.from(
    { length: chartEndMonth - chartStartMonth + 1 },
    (_, i) => {
      const monthIndex = (startMonth + chartStartMonth + i - 2) % 12;
      const year =
        startYear + Math.floor((startMonth + chartStartMonth + i - 2) / 12);
      return `${months[monthIndex]}/${year}`;
    }
  );

  const filteredData = RenderData?.slice(
    chartStartMonth - 1,
    chartEndMonth
  )?.map((value) => parseFloat(value?.toFixed(0)));

  // Get dynamic min and max based on series data
  const { min, max } = getDynamicMinMax([
    { name: seriesTitle, data: filteredData },
  ]);

  const chartOptions = {
    chart: {
      fontFamily: "Raleway Variable, sans-serif",
      id,
      type: "area",
      height: 350,
      toolbar: {
        show: false,
        tools: {
          download: true,
        },
      },
      zoom: { enabled: false },
      animations: {
        enabled: false,
      },
    },
    grid: { show: false },

    colors: ["#00A2FF", "#14F584", "#FFB303", "#DBFE01", "#FF474C", "#D84FE4"],
    xaxis: {
      categories: xaxisCategories,
      axisTicks: { show: false },
      labels: {
        show: false,
        rotate: 0,
        style: { fontFamily: "Raleway Variable, sans-serif" },
      },
    },
    yaxis: {
      show: false, // Hide y-axis
      // min: 0,

      min: min < 0 ? min - 10 : 0, // Adjust for negative values with padding
      max: max + 10, // Add padding to the max value

      axisBorder: { show: false },
      labels: {
        show: false,
        formatter: (val) => formatNumber(Math.floor(val)),
        style: { fontFamily: "Raleway Variable, sans-serif" },
      },
      title: {
        show: false,
        text: yaxisTitle,
        style: { fontSize: "12px", fontFamily: "Raleway Variable, sans-serif" },
      },
    },
    legend: {
      show: false,
      position: "bottom",
      horizontalAlign: "right",
      fontFamily: "Raleway Variable, sans-serif",
    },

    stroke: { curve: "straight", width: 1 },
    dataLabels: { enabled: false },
  };

  const [isChartModalVisible, setIsChartModalVisible] = useState(false); // New state for chart modal visibility
  const [selectedChart, setSelectedChart] = useState(null); // New state for selected chart

  const handleChartClick = (chart) => {
    setSelectedChart(chart);
    setIsChartModalVisible(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card
        title={title}
        className="flex flex-col transition duration-500  !rounded-md relative"
      >
        <CardHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50"
            onClick={(event) => handleChartClick(filteredData, event)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
            </svg>
            <span className="sr-only">Fullscreen</span>
          </Button>
        </CardHeader>
        <CardContent>
          <Chart
            options={options ? options : chartOptions}
            series={[{ name: seriesTitle, data: filteredData }]}
            type="area"
            height={350}
          />
        </CardContent>
      </Card>
      <Modal
        zIndex={42424244}
        centered
        open={isChartModalVisible}
        footer={null}
        onCancel={() => setIsChartModalVisible(false)}
        width="90%"
        style={{ top: 20 }}
      >
        {selectedChart && (
          <Chart
            options={chartOptions}
            series={[{ name: seriesTitle, data: filteredData }]}
            type="area"
            height={500}
            className="p-4"
          />
        )}
      </Modal>
    </div>
  );
};

export default CustomChart;
