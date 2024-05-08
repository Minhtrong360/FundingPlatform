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
    chart: { id: "profit-and-loss-chart", type: "area", height: 350 },
     fill: {
        type: "gradient",
        
        gradient: {
          shade: "light",
          shadeIntensity: 0.5,
          opacityFrom: 0.8,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
     
    colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
    xaxis: {
      categories: Array.from({ length: numberOfMonths }, (_, i) => `${i + 1}`),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
      tickAmount: 12,
      
      labels: {
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        trim: true,
        minHeight: 100,
        style: {
          cssClass: "apexcharts-xaxis-label",
        },
      },
    },
    stroke: {
      width: 1, // Set the stroke width to 1
      curve: "smooth", // Set the curve of the line, making it smooth
    },
    yaxis: { title: { text: "Amount ($)" } },
    // stroke: { curve: "smooth" },
   
    // legend: { position: "top" },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `$${val?.toFixed(0)}`,
      },
    },
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card title={title} className="shadow-xl">
        <Chart
          options={{
            ...chartOptions,
            chart: { ...chartOptions.chart, id: id },
            dataLabels: { enabled: false },
            colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
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
