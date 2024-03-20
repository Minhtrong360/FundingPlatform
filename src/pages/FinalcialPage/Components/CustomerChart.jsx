import React from "react";
import Chart from "react-apexcharts";
import { Col, Card } from "antd";

const CustomChart = ({ chartOptions, data, title }) => (
  <Col span={24} md={12} className="md:mt-0 mt-5">
    <Card title={title}>
      <Chart
        options={{
          ...chartOptions,
          chart: { ...chartOptions.chart, id: "total-revenue-chart" },
          yaxis: { title: { text: "Total Revenue ($)" } },
        }}
        series={[
          {
            name: "Total Revenue",
            data: data.map((value) => parseFloat(value.toFixed(2))),
          },
        ]}
        type="area"
        height={300}
      />
    </Card>
  </Col>
);

export default CustomChart;
