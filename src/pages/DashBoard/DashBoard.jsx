import React from "react";
import Chart from "./chart";
import DonutChart from "./DonusChart";
import { useState } from "react";
import DonusChart1 from "./DonusChart01";
import ApexCharts from "apexcharts";
import { CreditCardOutlined } from "@ant-design/icons";

import ChartForm from "./DataInputTable";
import SideBar from "../../components/SideBar";

export const DonusSeries01 = [36, 23, 11, 30];
export const labels = ["Startup", "VCs", "Investor", "Others"];

const Dashboard = () => {
  // const [chartData, setChartData] = useState(null);

  // const handleDataSubmit = (data) => {
  //   setChartData(data);
  // };

  if (document.getElementById("traffic-by-device")) {
    const chart = new ApexCharts(
      document.getElementById("traffic-by-device"),
      getTrafficChannelsChartOptions()
    );
    chart.render();

    // init again when toggling dark mode
    document.addEventListener("dark-mode", function () {
      chart.updateOptions(getTrafficChannelsChartOptions());
    });
  }

  const getTrafficChannelsChartOptions = () => {
    let trafficChannelsChartColors = {};

    if (document.documentElement.classList.contains("dark")) {
      trafficChannelsChartColors = {
        strokeColor: "#1f2937",
      };
    } else {
      trafficChannelsChartColors = {
        strokeColor: "#ffffff",
      };
    }

    return {
      series: [70, 5, 25],
      labels: ["Desktop", "Tablet", "Phone"],
      colors: ["#16BDCA", "#FDBA8C", "#1A56DB"],
      chart: {
        type: "donut",
        height: 400,
        fontFamily: "Inter, sans-serif",
        toolbar: {
          show: false,
        },
      },
      responsive: [
        {
          breakpoint: 430,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
      stroke: {
        colors: [trafficChannelsChartColors.strokeColor],
      },
      states: {
        hover: {
          filter: {
            type: "darken",
            value: 0.9,
          },
        },
      },
      tooltip: {
        shared: true,
        followCursor: false,
        fillSeriesColor: false,
        inverseOrder: true,
        style: {
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
        },
        x: {
          show: true,
          formatter: function (_, { seriesIndex, w }) {
            const label = w.config.labels[seriesIndex];
            return label;
          },
        },
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    };
  };
  return (
    <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <aside
        id="sidebar"
        className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 hidden w-64 h-full  font-normal duration-75 lg:flex transition-width"
        aria-label="Sidebar"
      >
        <SideBar />
      </aside>
      <div
        className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/90"
        id="sidebarBackdrop"
      ></div>
      <div
        id="main-content"
        className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
      >
        <main>
          <div className="px-4 pt-6">
            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {/* Main widget --> */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
                      $45,385
                    </span>
                    <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
                      Sales this week
                    </h3>
                  </div>
                  <div className="flex items-center justify-end flex-1 text-base font-medium text-green-500 dark:text-green-400">
                    12.5%
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                {/* <DataInputTable onSubmit={handleDataSubmit} />
                {chartData && <Chart series={chartData.series} categories={chartData.categories} />} */}
                {/* <Chart series={seriesData} categories={categoriesData} /> */}
                <ChartForm />
                {/* Card Footer --> */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
                  <div>
                    <button
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      type="button"
                      data-dropdown-toggle="weekly-sales-dropdown"
                    >
                      Last 7 days{" "}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {/* Dropdown menu --> */}
                    <div
                      className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                      // id="weekly-sales-dropdown"
                    >
                      <div className="px-4 py-3" role="none">
                        <p
                          className="text-sm font-medium text-gray-900 truncate dark:text-white"
                          role="none"
                        >
                          Sep 16, 2021 - Sep 22, 2021
                        </p>
                      </div>
                      <ul className="py-1" role="none">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Yesterday
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Today
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 7 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 30 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 90 days
                          </a>
                        </li>
                      </ul>
                      <div className="py-1" role="none">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Custom...
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
                    >
                      Sales Report
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              {/* Tabs widget --> */}

              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Statistics this month
                  <button
                    data-popover-target="popover-description"
                    data-popover-placement="bottom-end"
                    type="button"
                  >
                    <svg
                      className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Show information</span>
                  </button>
                </h3>
                <div
                  data-popover
                  id="popover-description"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                >
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Statistics
                    </h3>
                    <p>
                      Statistics is a branch of applied mathematics that
                      involves the collection, description, analysis, and
                      inference of conclusions from quantitative data.
                    </p>
                    <a
                      href="#"
                      className="flex items-center font-medium text-primary-600 dark:text-primary-500 dark:hover:text-primary-600 hover:text-primary-700"
                    >
                      Read more{" "}
                      <svg
                        className="w-4 h-4 ml-1"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                  <div data-popper-arrow></div>
                </div>
                <div className="sm:hidden">
                  <label for="tabs" className="sr-only">
                    Select tab
                  </label>
                  <select
                    id="tabs"
                    className="bg-gray-50 border-0 border-b border-gray-200 text-gray-900 text-sm rounded-t-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option>Statistics</option>
                    <option>Services</option>
                    <option>FAQ</option>
                  </select>
                </div>
                <ul
                  className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400"
                  id="fullWidthTab"
                  data-tabs-toggle="#fullWidthTabContent"
                  role="tablist"
                >
                  <li className="w-full">
                    <button
                      id="faq-tab"
                      data-tabs-target="#faq"
                      type="button"
                      role="tab"
                      aria-controls="faq"
                      aria-selected="true"
                      className="inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      Top products
                    </button>
                  </li>
                  <li className="w-full">
                    <button
                      id="about-tab"
                      data-tabs-target="#about"
                      type="button"
                      role="tab"
                      aria-controls="about"
                      aria-selected="false"
                      className="inline-block w-full p-4 rounded-tr-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      Top Customers
                    </button>
                  </li>
                </ul>
                <div
                  id="fullWidthTabContent"
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <div
                    className="hidden pt-4"
                    id="faq"
                    role="tabpanel"
                    aria-labelledby="faq-tab"
                  >
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <img
                              className="flex-shrink-0 w-10 h-10"
                              src="/images/products/iphone.png"
                              alt="imac image"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900 truncate dark:text-white">
                                iPhone 14 Pro
                              </p>
                              <div className="flex items-center justify-end flex-1 text-sm text-green-500 dark:text-green-400">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    fill-rule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                  ></path>
                                </svg>
                                2.5%
                                <span className="ml-2 text-gray-500">
                                  vs last month
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $445,467
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <img
                              className="flex-shrink-0 w-10 h-10"
                              src="/images/products/imac.png"
                              alt="imac image"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900 truncate dark:text-white">
                                Apple iMac 27"
                              </p>
                              <div className="flex items-center justify-end flex-1 text-sm text-green-500 dark:text-green-400">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    fill-rule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                  ></path>
                                </svg>
                                12.5%
                                <span className="ml-2 text-gray-500">
                                  vs last month
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $256,982
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <img
                              className="flex-shrink-0 w-10 h-10"
                              src="/images/products/watch.png"
                              alt="watch image"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900 truncate dark:text-white">
                                Apple Watch SE
                              </p>
                              <div className="flex items-center justify-end flex-1 text-sm text-red-600 dark:text-red-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    fill-rule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                  ></path>
                                </svg>
                                1.35%
                                <span className="ml-2 text-gray-500">
                                  vs last month
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $201,869
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <img
                              className="flex-shrink-0 w-10 h-10"
                              src="/images/products/ipad.png"
                              alt="ipad image"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900 truncate dark:text-white">
                                Apple iPad Air
                              </p>
                              <div className="flex items-center justify-end flex-1 text-sm text-green-500 dark:text-green-400">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    fill-rule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                  ></path>
                                </svg>
                                12.5%
                                <span className="ml-2 text-gray-500">
                                  vs last month
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $103,967
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <img
                              className="flex-shrink-0 w-10 h-10"
                              src="/images/products/imac.png"
                              alt="imac image"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900 truncate dark:text-white">
                                Apple iMac 24"
                              </p>
                              <div className="flex items-center justify-end flex-1 text-sm text-red-600 dark:text-red-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    clip-rule="evenodd"
                                    fill-rule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                  ></path>
                                </svg>
                                2%
                                <span className="ml-2 text-gray-500">
                                  vs last month
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $98,543
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="hidden pt-4"
                    id="about"
                    role="tabpanel"
                    aria-labelledby="about-tab"
                  >
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/images/users/neil-sims.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              Neil Sims
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@flowbite.com
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $3320
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/images/users/bonnie-green.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              Bonnie Green
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@flowbite.com
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $2467
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/images/users/michael-gough.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              Michael Gough
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@flowbite.com
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $2235
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/images/users/thomas-lean.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              Thomes Lean
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@flowbite.com
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $1842
                          </div>
                        </div>
                      </li>
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              className="w-8 h-8 rounded-full"
                              src="/images/users/lana-byrd.png"
                              alt="Neil image"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate dark:text-white">
                              Lana Byrd
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@flowbite.com
                            </p>
                          </div>
                          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            $1044
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Card Footer --> */}
                <div className="flex items-center justify-between pt-3 mt-5 border-t border-gray-200 sm:pt-6 dark:border-gray-700">
                  <div>
                    <button
                      className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      type="button"
                      data-dropdown-toggle="stats-dropdown"
                    >
                      Last 7 days{" "}
                    </button>
                    {/* Dropdown menu --> */}
                    <div
                      className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                      id="stats-dropdown"
                    >
                      <div className="px-4 py-3" role="none">
                        <p
                          className="text-sm font-medium text-gray-900 truncate dark:text-white"
                          role="none"
                        >
                          Sep 16, 2021 - Sep 22, 2021
                        </p>
                      </div>
                      <ul className="py-1" role="none">
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Yesterday
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Today
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 7 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 30 days
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            role="menuitem"
                          >
                            Last 90 days
                          </a>
                        </li>
                      </ul>
                      <div className="py-1" role="none">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          Custom...
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
                    >
                      Full Report
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-2 2xl:grid-cols-3">
              <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="w-full">
                  <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                    New products
                  </h3>
                  <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                    2,340
                  </span>
                  <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                    <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                      12.5%
                    </span>
                    Since last month
                  </p>
                </div>
                <div className="w-full" id="new-products-chart"></div>
              </div>
              <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="w-full">
                  <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                    Users
                  </h3>
                  <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                    2,340
                  </span>
                  <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                    <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                      3,4%
                    </span>
                    Since last month
                  </p>
                </div>
                <div className="w-full" id="week-signups-chart"></div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="w-full">
                  <h3 className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                    Audience by age
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="w-16 text-sm font-medium dark:text-white">
                      50+
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-16 text-sm font-medium dark:text-white">
                      40+
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-16 text-sm font-medium dark:text-white">
                      30+
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-16 text-sm font-medium dark:text-white">
                      20+
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-primary-600 h-2.5 rounded-full dark:bg-primary-500"></div>
                    </div>
                  </div>
                </div>
                <div id="traffic-channels-chart" className="w-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 my-4 xl:grid-cols-2 xl:gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Traffic by device
                    </h3>
                    <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                      Desktop
                    </span>
                  </div>
                </div>
                <div id="traffic-by-device"></div>
                <DonusChart1 />
                {/* <!-- Card Footer --> */}
                <div className="flex items-center justify-between pt-4 lg:justify-evenly sm:pt-6">
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">
                      Desktop
                    </h3>
                    <h4 className="text-xl font-bold dark:text-white">234k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                          ></path>
                        </svg>
                        4%
                      </span>
                      vs last month
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">Phone</h3>
                    <h4 className="text-xl font-bold dark:text-white">94k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                          ></path>
                        </svg>
                        1%
                      </span>
                      vs last month
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">Tablet</h3>
                    <h4 className="text-xl font-bold dark:text-white">16k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                          ></path>
                        </svg>
                        0,6%
                      </span>
                      vs last month
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
                      Traffic by device
                    </h3>
                    <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
                      Desktop
                    </span>
                  </div>
                </div>

                <DonutChart DonusSeries={DonusSeries01} Labels={labels} />
                {/* <!-- Card Footer --> */}
                <div className="flex items-center justify-between pt-4 lg:justify-evenly sm:pt-6">
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">
                      Desktop
                    </h3>
                    <h4 className="text-xl font-bold dark:text-white">234k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                          ></path>
                        </svg>
                        4%
                      </span>
                      vs last month
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">Phone</h3>
                    <h4 className="text-xl font-bold dark:text-white">94k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                          ></path>
                        </svg>
                        1%
                      </span>
                      vs last month
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 dark:text-gray-400">Tablet</h3>
                    <h4 className="text-xl font-bold dark:text-white">16k</h4>
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center mr-1.5 text-sm text-red-600 dark:text-red-500">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                          ></path>
                        </svg>
                        0,6%
                      </span>
                      vs last month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 columns --> */}

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              {/* Card header --> */}
              <div className="items-center justify-between lg:flex">
                <div className="mb-4 lg:mb-0">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    Transactions
                  </h3>
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    This is a list of latest transactions
                  </span>
                </div>
                <div className="items-center sm:flex">
                  <div className="flex items-center">
                    <button
                      id="dropdownDefault"
                      data-dropdown-toggle="dropdown"
                      className="mb-4 sm:mb-0 mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                      type="button"
                    >
                      Filter by status
                      <svg
                        className="w-4 h-4 ml-2"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    {/* Dropdown menu --> */}
                    <div
                      id="dropdown"
                      className="z-10 hidden w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                    >
                      <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                        Category
                      </h6>
                      <ul
                        className="space-y-2 text-sm"
                        aria-labelledby="dropdownDefault"
                      >
                        <li className="flex items-center">
                          <input
                            id="apple"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            for="apple"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            Completed (56)
                          </label>
                        </li>

                        <li className="flex items-center">
                          <input
                            id="fitbit"
                            type="checkbox"
                            value=""
                            checked
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            for="fitbit"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            Cancelled (56)
                          </label>
                        </li>

                        <li className="flex items-center">
                          <input
                            id="dell"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            for="dell"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            In progress (56)
                          </label>
                        </li>

                        <li className="flex items-center">
                          <input
                            id="asus"
                            type="checkbox"
                            value=""
                            checked
                            className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />

                          <label
                            for="asus"
                            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                          >
                            In review (97)
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div date-rangepicker className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        name="start"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="From"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                          ></path>
                        </svg>
                      </div>
                      <input
                        name="end"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="To"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Table --> */}
              <div className="flex flex-col mt-6">
                <div className="overflow-x-auto rounded-lg">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Transaction
                            </th>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Date & Time
                            </th>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Reference number
                            </th>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Payment method
                            </th>
                            <th
                              scope="col"
                              className="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800">
                          <tr>
                            <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                              Payment from{" "}
                              <span className="font-semibold">
                                Bonnie Green
                              </span>
                            </td>
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              Apr 23 ,2021
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                              $2300
                            </td>
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              0047568936
                            </td>
                            <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              <CreditCardOutlined />
                              <span>••• 475</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                              Payment from{" "}
                              <span className="font-semibold">Santa</span>
                            </td>
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              Apr 23 ,2021
                            </td>
                            <td className="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                              $2300
                            </td>
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              0047568936
                            </td>
                            <td className="inline-flex items-center p-4 space-x-2 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              <CreditCardOutlined />
                              <span>••• 475</span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-md dark:bg-gray-700 dark:text-green-400 border border-green-100 dark:border-green-500">
                                Completed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Card Footer --> */}
              <div className="flex items-center justify-between pt-3 sm:pt-6">
                <div className="flex-shrink-0">
                  <a
                    href="#"
                    className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
                  >
                    Transactions Report
                    <svg
                      className="w-4 h-4 ml-1 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
