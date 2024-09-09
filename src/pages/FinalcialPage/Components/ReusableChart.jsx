import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { ChartContainer } from "../../../components/ui/chart";
import { TrendingUp } from "lucide-react";
import Chart from "react-apexcharts";
import { formatNumber } from "../../../features/CostSlice";

const ReusableChart = ({
  title,
  description,
  series,
  charttype,
  options,
  categories,
  footerText,
  footerSubText,
  footerIcon: FooterIcon = TrendingUp,
  footerIconClassName = "h-4 w-4",
  ...props
}) => {
  const defaultOptions = {
    chart: {
      id: "reusable-chart",
      zoom: {
        enabled: false, // Disable zooming
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
        },
      },
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels
      },
      categories: categories,
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
    },
    yaxis: {
      show: false, // Hide y-axis
      labels: {
        show: false,
        formatter: (val) => formatNumber(Math.floor(val)),
      },
    },
    legend: {
      show: false, // Hide legend
    },
    grid: {
      show: false, // Hide gridlines
    },
    stroke: {
      show: true, // Hide lines
      width: 1,
      curve: "smooth", // Set stroke curve to straight
    },
    dataLabels: {
      enabled: false, // Hide data labels
    },
    ...options, // Merge with any options passed as props
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <Chart type={charttype} options={defaultOptions} series={series} />
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {footerText}
        </div>
        <div className="leading-none text-muted-foreground text-gray-500">
          {footerSubText}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReusableChart;
