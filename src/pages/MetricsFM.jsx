import { Tooltip } from "antd";
import React from "react";

import { Card } from "antd";

import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

function Component({
  yearlyAverageCustomers,
  customerGrowthChart,
  yearlySales,
  revenue,
}) {
  const groupedbarChartData = {
    series: [
      {
        name: "New Customers",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "Returning Customers",
        data: [13, 23, 20, 8, 13, 27],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false, // Turn off toolbar
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },

      fill: {
        opacity: 1,
      },
    },
  };

  function sumArray(arr) {
    return arr.reduce((total, num) => total + Number(num), 0);
  }

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 mt-4 mb-4 md:gap-8 ">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
            <div>
              <h3>Total User</h3>
              <p>{Math.round(sumArray(yearlyAverageCustomers))}</p>
            </div>
            <Chart
              type="bar"
              series={customerGrowthChart.series}
              options={customerGrowthChart.options}
              height={300}
            />
          </Card>
          <Card className="flex flex-col">
            <div>
              <h3>Total Revenue</h3>
              <p>{Math.round(sumArray(yearlySales))}</p>
            </div>
            <Chart
              options={revenue.options}
              series={revenue.series}
              type="bar"
              height={325}
            />
          </Card>
          <Card className="flex flex-col">
            <div>
              <h3>Returning Customers</h3>
              <p>33.5%</p>
            </div>
            <Chart
              type="bar"
              series={groupedbarChartData.series}
              options={groupedbarChartData.options}
              height={300}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}

const MetricsFM = ({ customerGrowthChart, revenue }) => {
  // Define data for each card
  const { yearlyAverageCustomers } = useSelector((state) => state.customer);
  const { yearlySales } = useSelector((state) => state.sales);

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map over cardData array */}

        <div className="flex flex-col bg-white border shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                TOTAL USER (final year)
              </p>
              <Tooltip title="The average users of the final year.">
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
                  {Math.round(
                    yearlyAverageCustomers[yearlyAverageCustomers.length - 1],
                    2
                  )}
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
                  <Tooltip title="The increase percentage of the final year compared to the first year in the series.">
                    <span className="inline-block text-sm">
                      {(
                        ((yearlyAverageCustomers[
                          yearlyAverageCustomers.length - 1
                        ] -
                          yearlyAverageCustomers[0]) *
                          100) /
                        yearlyAverageCustomers[0]
                      )?.toFixed(2)}
                      %
                    </span>
                  </Tooltip>
                </span>
              </div>
            </div>
            <div>Customer</div>
          </div>
        </div>

        <div className="flex flex-col bg-white border shadow-sm rounded-xl">
          <div className="p-4 md:p-5">
            <div className="flex items-center gap-x-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                TOTAL REVENUES (final year)
              </p>
              <Tooltip title="The average revenue of the final year.">
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
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(yearlySales[yearlySales.length - 1]))}
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
                  <Tooltip title="The increase percentage of the final year compared to the first year in the series.">
                    <span className="inline-block text-sm">
                      {(
                        ((yearlySales[yearlySales.length - 1] -
                          yearlySales[0]) *
                          100) /
                        yearlySales[0]
                      )?.toFixed(2)}
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
      <Component
        yearlyAverageCustomers={yearlyAverageCustomers}
        customerGrowthChart={customerGrowthChart}
        yearlySales={yearlySales}
        revenue={revenue}
      />
    </div>
  );
};

export default MetricsFM;
