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

const ReusableChart = ({
  title,
  description,
  series,
  charttype,
  options,
  footerText,
  footerSubText,
  footerIcon: FooterIcon = TrendingUp,
  footerIconClassName = "h-4 w-4",
  ...props
}) => {
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
