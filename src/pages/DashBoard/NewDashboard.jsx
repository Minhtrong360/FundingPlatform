import React from "react";
import Chart from "./chart";
import DonutChart from "./DonusChart";
import { useState } from "react";
import DonusChart1 from "./DonusChart01";
import ApexCharts from "apexcharts";
import { CreditCardOutlined } from "@ant-design/icons";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChartForm from "./DataInputTable";
import SideBar from "../../components/SideBar";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import { Space, Table, Tag } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const Newdb = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        id="main-content"
        className="sm:ml-64 p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700"
        onClick={() => setIsSidebarOpen(false)}
      >
        <main>
          <div className="px-4 pt-6">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800 mb-4">
              {/* Card header --> */}
              <div className="items-center justify-between lg:flex">
                <div className="mb-4 lg:mb-0">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    Transactions
                  </h3>
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                    This is a list of latest transactions
                  </span>
                </div>
                <div className="items-center sm:flex"></div>
              </div>
              {/*Test Table --> */}
              <Table columns={columns} dataSource={data} />

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
            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {/* Main widget --> */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-shrink-0">
                    <span className="text-xl font-semibold leading-none text-gray-900 sm:text-2xl dark:text-white">
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
                    </button>
                  </div>
                  <div className="flex-shrink-0">
                    <a
                      href="#"
                      className="inline-flex items-center p-2 text-xs font-medium uppercase rounded-lg text-primary-700 sm:text-sm hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
                    >
                      Sales Report
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
                ></div>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Newdb;
