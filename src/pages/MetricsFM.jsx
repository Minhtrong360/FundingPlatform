import { Tooltip } from "antd";

import { useSelector } from "react-redux";
import { formatNumber } from "../features/CostSlice";
import AllChartSections from "./FinalcialPage/Components/AllChartSections";

const MetricsFM = ({ customerGrowthChart, revenue, numberOfMonths }) => {
  // Define data for each card
  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);

  return (
    <div className="sm:max-w-[85rem] max-w-full px-0 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map over cardData array */}

        <div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
  <div className="p-4 md:p-5">
    <div className="flex items-center gap-x-2">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        USER
      </p>
      <Tooltip title="Total users of the first year.">
        <svg
          className="flex-shrink-0 size-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </Tooltip>
    </div>

    <div className="mt-1 flex items-center gap-x-2">
      <div className="flex flex-col xl:flex-row xl:items-center items-start">
        <h3 className="text-sm sm:text-3xl font-bold text-gray-800 my-2">
          {formatNumber(Math.round(yearlyAverageCustomers[0], 2))}
        </h3>
        <span className="flex items-center gap-x-1 text-green-600 ml-2">
          <svg
            className="inline-block size-4 self-center"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <Tooltip title="The increase percentage of the second year compared to the first year in the series.">
            <span className="inline-block text-sm">
              {((yearlyAverageCustomers[1] -
                yearlyAverageCustomers[0]) *
                100) /
              yearlyAverageCustomers[0]
                ? formatNumber(
                    (
                      ((yearlyAverageCustomers[1] -
                        yearlyAverageCustomers[0]) *
                        100) /
                      yearlyAverageCustomers[0]
                    ).toFixed(2)
                  )
                : 0}
              %
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
    <div>Customer</div>
  </div>
</div>

<div className="flex flex-col bg-white border shadow-lg rounded-xl m-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
  <div className="p-4 md:p-5">
    <div className="flex items-center gap-x-2">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        REVENUE
      </p>
      <Tooltip title="The average revenue of the first year.">
        <svg
          className="flex-shrink-0 size-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </Tooltip>
    </div>

    <div className="mt-1 flex items-center gap-x-2">
      <div className="flex flex-col xl:flex-row xl:items-center items-start">
        <h3 className="text-sm sm:text-3xl font-bold text-gray-800 my-2">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Math.round(yearlySales[0] ? yearlySales[0] : 0))}
        </h3>
        <span className="flex items-center gap-x-1 text-green-600 ml-2">
          <svg
            className="inline-block size-4 self-center"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          <Tooltip title="The increase percentage of the second year compared to the first year in the series.">
            <span className="inline-block text-sm">
              {((yearlySales[1] - yearlySales[0]) * 100) /
              yearlySales[0]
                ? formatNumber(
                    (
                      ((yearlySales[1] - yearlySales[0]) * 100) /
                      yearlySales[0]
                    )?.toFixed(2)
                  )
                : 0}
              %
            </span>
          </Tooltip>
        </span>
      </div>
    </div>
    <div>Revenue</div>
  </div>
</div>


        {/* End Map */}
      </div>
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
