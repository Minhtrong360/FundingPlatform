'use client';
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { ChartContainer } from "../../../components/ui/chart";
import { TrendingUp } from "lucide-react";
import Chart from "react-apexcharts";

const ReusableChart = ({
  title,
  description,
  series,
  categories,
  charttype,
  // numberOfMonths,
  // startMonth,
  // startYear,
  footerText,
  footerSubText,
  footerIcon: FooterIcon = TrendingUp,
  footerIconClassName = "h-4 w-4",
  ...props
}) => {
  // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // const xaxisCategories = Array.from({ length: numberOfMonths }, (_, i) => {
  //   const monthIndex = (startMonth + i - 1) % 12;
  //   const year = startYear + Math.floor((startMonth + i - 1) / 12);
  //   return `${months[monthIndex]}/${year}`;
  // });

  const options = {
    grid: {
      show: true,
      borderColor: "#f3f4f5",
      strokeDashArray: 0,
      position: 'back',
    },
    chart: {
      zoom: { enabled: false },
      toolbar: {
        show: false,
        tools: { download: false },
      },
      // height: 350,
      stacked: false,
      animations: {
        enabled: false
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: categories,
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      title: { text: undefined },
      tickAmount: 5,
      labels: { offsetX: 5, rotate: 0 },
    },
    yaxis: {
      show: false,
      tickAmount: 4,
    },
    stroke: { width: 1, curve: "straight" },
    ...props.config,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-500">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="" config={{}}>
          <Chart type={charttype} options={options} series={series} />
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {footerText} <FooterIcon className={footerIconClassName} />
        </div>
        <div className="leading-none text-muted-foreground text-gray-500">
          {footerSubText}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReusableChart;
