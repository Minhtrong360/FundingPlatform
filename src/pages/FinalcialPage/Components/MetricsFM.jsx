import { useSelector } from "react-redux";
import AllChartSections from "./AllChartSections";

const MetricsFM = ({ customerGrowthChart, revenue, numberOfMonths }) => {
  // Define data for each card
  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);

  return (
    <div className="sm:max-w-[85rem] max-w-full px-0  mx-auto">
      {/* End Grid */}
      <AllChartSections
        yearlyAverageCustomers={yearlyAverageCustomers}
        customerGrowthChart={customerGrowthChart}
        yearlySales={yearlySales}
        revenue={revenue}
        numberOfMonths={numberOfMonths}
      />
    </div>
  );
};

export default MetricsFM;
