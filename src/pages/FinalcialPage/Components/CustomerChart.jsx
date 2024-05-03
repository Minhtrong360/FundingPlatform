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
    chart: { id: "profit-and-loss-chart", type: "bar", height: 350 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.5,
       
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 2, // Set the border radius to 10
      },
    },
    stroke: { width: 1 },
    colors: ['#00A2FF', '#14F584', '#FFB303', '#DBFE01', '#FF474C','#D84FE4'],
    dataLabels: { enabled: false },
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
   
    yaxis: { title: { text: "Amount ($)" } },
    
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
            // colors: ['#00A2FF', '#14F584', '#FFB303', '#5C39FF', '#D738FF', '#FF841F'],
            yaxis: { title: { text: yaxisTitle } },
          }}
          series={[
            {
              name: seriesTitle,
              data: RenderData.map((value) => parseFloat(value.toFixed(0))),
            },
          ]}
          type="bar"
          height={350}
        />
      </Card>
    </div>
  );
};

export default CustomChart;
