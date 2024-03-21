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
    chart: { id: "profit-and-loss-chart", type: "line", height: 350 },
    xaxis: {
      categories: Array.from({ length: numberOfMonths }, (_, i) => `${i + 1}`),
      title: {
        text: "Month",
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: "600",
        },
      },
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
    yaxis: { title: { text: "Amount ($)" } },
    stroke: { curve: "smooth" },
    legend: { position: "top" },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `$${val?.toFixed(2)}`,
      },
    },
  };
  return (
    <Col span={24} md={24} className="my-5">
      <Card title={title}>
        <Chart
          options={{
            ...chartOptions,
            chart: { ...chartOptions.chart, id: id },
            yaxis: { title: { text: yaxisTitle } },
          }}
          series={[
            {
              name: seriesTitle,
              data: RenderData.map((value) => parseFloat(value.toFixed(2))),
            },
          ]}
          type="area"
          height={300}
        />
      </Card>
    </Col>
  );
};

export default CustomChart;
