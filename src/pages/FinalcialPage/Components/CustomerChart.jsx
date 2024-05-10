import React from "react";
import Chart from "react-apexcharts";
import { Col, Card } from "antd";
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

  const startingMonth = startMonth; // Tháng bắt đầu từ 1
  const startingYear = startYear; // Năm bắt đầu từ 24
  const chartOptions = {
    chart: {
      fontFamily: "Sora, sans-serif",
      id: "profit-and-loss-chart",
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
      categories: Array.from({ length: numberOfMonths }, (_, i) => {
        const monthIndex = (startingMonth + i - 1) % 12;
        const year = startingYear + Math.floor((startingMonth + i - 1) / 12);
        return `${months[monthIndex]}/${year}`;
      }),
      // tickAmount: 6, // Set the number of ticks on the x-axis to 12

      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      labels: {
        rotate: 0,
        style: {
          fontFamily: "Sora, sans-serif",
        },
      },
      title: {
        text: "Month",
        style: {
          fontSize: "12px",
          fontFamily: "Sora, sans-serif",
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: true, // Show y-axis line
      },
      labels: {
        style: {
          fontFamily: "Sora, sans-serif",
        },
        show: true, // Hide y-axis labels
        formatter: function (val) {
          return formatNumber(Math.floor(val));
        },
      },
      title: {
        text: "Customers",
        style: {
          fontSize: "12px",
          fontFamily: "Sora, sans-serif",
        },
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
    // colors: ["#00A2FF", "#14F584", "#FFB303", "#DBFE01", "#FF474C", "#D84FE4"],
    dataLabels: { enabled: false },
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title={title}>
        <Chart
          options={{
            ...chartOptions,
            chart: { ...chartOptions.chart, id: id },
            dataLabels: { enabled: false },

            colors: [
              "#00A2FF",
              "#14F584",
              "#FFB303",
              "#DBFE01",
              "#FF474C",
              "#D84FE4",
            ],
            stroke: {
              width: 1,
            },
            yaxis: {
              title: { text: yaxisTitle },
              labels: {
                style: {
                  fontFamily: "Sora, sans-serif",
                },
                show: true, // Hide y-axis labels
                formatter: function (val) {
                  return formatNumber(Math.floor(val));
                },
              },
            },
          }}
          series={[
            {
              name: seriesTitle,
              data: RenderData.map((value) => parseFloat(value.toFixed(0))),
            },
          ]}
          type="area"
          height={350}
        />
      </Card>
    </div>
  );
};

export default CustomChart;
