import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { formatNumber } from "../features/CostSlice";
import AllChartSections from "./FinalcialPage/Components/AllChartSections";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getCurrencyLabelByKey } from "../features/DurationSlice";

const MetricsFM = ({ customerGrowthChart, revenue, numberOfMonths }) => {
  // Define data for each card
  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);
  const { currency } = useSelector((state) => state.durationSelect);

  return (
    <div className="sm:max-w-[85rem] max-w-full px-0 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map over cardData array */}

        <div className="flex flex-col bg-white border shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                USER
              </p>
              <Tooltip title="Total users of the first year.">
                <InfoCircleOutlined />
              </Tooltip>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <div className="flex flex-col xl:flex-row xl:items-center items-start">
                <h3 className="text-sm sm:text-3xl font-bold text-blue-600 my-2">
                  {formatNumber(Math.round(yearlyAverageCustomers[0], 2))}
                </h3>
              </div>
            </div>
            <div className="ml-0">
              <span className="text-green-600">
                <Tooltip title="The increase percentage of the second year compared to the first year in the series.">
                  <span className="inline-block text-sm">
                    {((yearlyAverageCustomers[1] - yearlyAverageCustomers[0]) *
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
            <div className="whitespace-normal mt-2">Customer</div>
          </div>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                REVENUE
              </p>
              <Tooltip title="The average revenue of the first year.">
                <InfoCircleOutlined />
              </Tooltip>
            </div>

            <div className="mt-1 flex items-center gap-x-2">
              <div className="flex flex-col xl:flex-row xl:items-center items-start">
                <h3 className="text-sm sm:text-3xl font-bold text-blue-600 my-2 ">
                  <span>{getCurrencyLabelByKey(currency)}&nbsp;</span>
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(Math.round(yearlySales[0] ? yearlySales[0] : 0))}
                </h3>
              </div>
            </div>
            <div className="ml-0">
              <span className="text-green-600">
                <Tooltip title="The increase percentage of the second year compared to the first year in the series.">
                  <span className="inline-block text-sm">
                    {((yearlySales[1] - yearlySales[0]) * 100) / yearlySales[0]
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
            <div className="whitespace-normal mt-2">Revenue</div>
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
