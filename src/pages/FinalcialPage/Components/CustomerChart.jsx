import React from "react";
import Chart from "react-apexcharts";
import { Col, Card } from "antd";

const CustomChart = ({
  numberOfMonths,
  id,
  yaxisTitle,
  seriesTitle,
  RenderData,
  title,
}) => {
  const chartOptions = {
    chart: {
      zoom: {
        enabled: false, // Disable zooming
      },
      toolbar: {
        show: false, // Hide the toolbar
      },
      id: "customer-growth-chart",
      type: "area",
      height: 350,
      stacked: false,
    },

    xaxis: {
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      labels: {
        show: false, // Hide x-axis labels
      },
      categories: Array.from(
        { length: numberOfMonths },
        (_, i) => `Month ${i + 1}`
      ),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
    },
    yaxis: {
      axisBorder: {
        show: true, // Show y-axis line
      },
      labels: {
        show: false, // Hide y-axis labels
        formatter: function (val) {
          return Math.floor(val);
        },
      },
      title: { text: "Customers" },
      style: {
        fontFamily: "Inter, sans-serif",
        fontWeight: "600",
      },
    },
    legend: { position: "bottom", horizontalAlign: "right" },
    fill: {
      type: "gradient",

      gradient: {
        shade: "light",
        shadeIntensity: 0.75,
        opacityFrom: 0.8,
        opacityTo: 0.5,
        stops: [0, 90, 100],
      },
    },

    colors: ["#00A2FF", "#14F584", "#FFB303", "#DBFE01", "#FF474C", "#D84FE4"],
    dataLabels: { enabled: false },
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title={title} className="shadow-xl">
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
            yaxis: { title: { text: yaxisTitle } },
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
