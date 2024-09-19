import { useSelector } from "react-redux";
import AllChartSections from "./AllChartSections";

const MetricsFM = ({ customerGrowthChart, revenue, numberOfMonths }) => {
  // Define data for each card
  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);

  return (
    <AllChartSections
      yearlyAverageCustomers={yearlyAverageCustomers}
      customerGrowthChart={customerGrowthChart}
      yearlySales={yearlySales}
      revenue={revenue}
      numberOfMonths={numberOfMonths}
    />
  );
};

export default MetricsFM;
