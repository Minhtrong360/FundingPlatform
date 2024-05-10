import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Card } from "antd";
import { formatNumber } from "../../../features/CostSlice";
import { useSelector } from "react-redux";

const CustomChart = ({
  numberOfMonths,
  id,
  yaxisTitle,
  seriesTitle,
  RenderData,
  title,
}) => {
  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

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

  const [chartStartMonth, setChartStartMonth] = useState(1);
  const [chartEndMonth, setChartEndMonth] = useState(numberOfMonths);

  const xaxisCategories = Array.from(
    { length: chartEndMonth - chartStartMonth + 1 },
    (_, i) => {
      const monthIndex = (startMonth + chartStartMonth + i - 2) % 12;
      const year =
        startYear + Math.floor((startMonth + chartStartMonth + i - 2) / 12);
      return `${months[monthIndex]}/${year}`;
    }
  );

  const filteredData = RenderData.slice(chartStartMonth - 1, chartEndMonth).map(
    (value) => parseFloat(value.toFixed(0))
  );

  const chartOptions = {
    chart: {
      fontFamily: "Sora, sans-serif",
      id,
      type: "area",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: false,
      }
    },
    grid: { show: false },
    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     shade: "light",
    //     shadeIntensity: 0.5,
    //     opacityFrom: 0.85,
    //     opacityTo: 0.65,
    //     stops: [0, 90, 100],
    //   },
    // },

    colors: ["#00A2FF", "#14F584", "#FFB303", "#DBFE01", "#FF474C", "#D84FE4"],
    xaxis: {
      categories: xaxisCategories,
      axisTicks: { show: false },
      labels: {
        rotate: 0,
        style: { fontFamily: "Sora, sans-serif" },
      },
      title: {
        text: "Month",
        style: { fontSize: "12px", fontFamily: "Sora, sans-serif" },
      },
    },
    yaxis: {
      axisBorder: { show: true },
      labels: {
        formatter: (val) => formatNumber(Math.floor(val)),
        style: { fontFamily: "Sora, sans-serif" },
      },
      title: {
        text: yaxisTitle,
        style: { fontSize: "12px", fontFamily: "Sora, sans-serif" },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "right",
      fontFamily: "Sora, sans-serif",
    },
    // fill: {
    //   type: "gradient",

    //   gradient: {
    //     shade: "light",
    //     shadeIntensity: 0.5,
    //     opacityFrom: 0.85,
    //     opacityTo: 0.65,
    //     stops: [0, 90, 100],
    //   },
    // },
    stroke: { curve: "smooth", width: 1 },
    dataLabels: { enabled: false },
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title={title}>
        <div className="flex justify-between items-center">
          <div className="min-w-[10vw]">
            <label htmlFor="startMonthSelect">Start Month:</label>
            <select
              id="startMonthSelect"
              value={chartStartMonth}
              onChange={(e) =>
                setChartStartMonth(
                  Math.max(1, Math.min(parseInt(e.target.value), chartEndMonth))
                )
              }
              className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: numberOfMonths }, (_, i) => {
                const monthIndex = (startMonth + i - 1) % 12;
                const year = startYear + Math.floor((startMonth + i - 1) / 12);
                return (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >{`${months[monthIndex]}/${year}`}</option>
                );
              })}
            </select>
          </div>
          <div className="min-w-[10vw]">
            <label htmlFor="endMonthSelect">End Month:</label>
            <select
              id="endMonthSelect"
              value={chartEndMonth}
              onChange={(e) =>
                setChartEndMonth(
                  Math.max(
                    chartStartMonth,
                    Math.min(parseInt(e.target.value), numberOfMonths)
                  )
                )
              }
              className="py-3 px-4 block w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: numberOfMonths }, (_, i) => {
                const monthIndex = (startMonth + i - 1) % 12;
                const year = startYear + Math.floor((startMonth + i - 1) / 12);
                return (
                  <option
                    key={i + 1}
                    value={i + 1}
                  >{`${months[monthIndex]}/${year}`}</option>
                );
              })}
            </select>
          </div>
        </div>
        <Chart
          options={chartOptions}
          series={[{ name: seriesTitle, data: filteredData }]}
          type="area"
          height={350}
        />
      </Card>
    </div>
  );
};

export default CustomChart;
