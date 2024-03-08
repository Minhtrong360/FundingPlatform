import { Tooltip } from "antd";
import React from "react";

import { Card } from 'antd';

import Chart from 'react-apexcharts';

function Component() {
  const stackedbarChartData = {
    series: [
      {
        name: 'Product A',
        data: [44, 55, 41, 67, 22, 43]
      },
      {
        name: 'Product B',
        data: [13, 23, 20, 8, 13, 27]
      },
      {
        name: 'Product C',
        data: [11, 17, 15, 15, 21, 14]
      },
      {
        name: 'Product D',
        data: [21, 7, 25, 13, 22, 8]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false // Turn off toolbar
           },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      
      fill: {
        opacity: 1,
      },
       toolbar: {
      show: false // Turn off toolbar
      },
      
     
    },
  };
  
  const dotChartData = {
    series: [
      {
        name: 'Sessions',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false // Turn off toolbar
           },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      toolbar: {
        show: false
      }
    }
  };
  
  const groupedbarChartData = {
    series: [
      {
        name: 'New Customers',
        data: [44, 55, 41, 67, 22, 43]
      },
      {
        name: 'Returning Customers',
        data: [13, 23, 20, 8, 13, 27]
      }
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false // Turn off toolbar
           },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
     
      fill: {
        opacity: 1,
      },
      
     
      
    },
  };
  
  const lineChartData = {
    series: [
      {
        name: 'Visitors',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }
    ],
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: {
          show: false // Turn off toolbar
           },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      },
      toolbar: {
     show: false // Turn off toolbar
      }
    }
  };
  
  const labelledpieChartData = {
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: 'pie',
        height: 350,
        toolbar: {
          show: false // Turn off toolbar
           },
      },
      labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
      legend : {
        position: 'top',
      },
      toolbar: {
        show: false // Turn off toolbar
      }
    }
  };
  

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 mt-4 mb-4 md:gap-8 md:p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
              <div>
                <h3>Total Sales</h3>
                <p>$2389.00</p>
              </div>
              <Chart
                type="bar"
                series={stackedbarChartData.series}
                options={stackedbarChartData.options}
                height={300}
              />
           
          </Card>
          <Card>
           
              <div>
                <h3>Sessions</h3>
                <p>345</p>
              </div>
              <Chart
                type="line"
                series={dotChartData.series}
                options={dotChartData.options}
                height={300}
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
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="flex flex-col">
           
              <div>
                <h3>Visitors</h3>
                <p>3,456</p>
              </div>
              <Chart
                type="line"
                series={lineChartData.series}
                options={lineChartData.options}
                height={300}
              />
           
          </Card>
          <Card className="flex flex-col">
           
              <div>
                <h3>Page Views</h3>
                <p>12,345</p>
              </div>
              <Chart
                type="pie"
                series={labelledpieChartData.series}
                options={labelledpieChartData.options}
                height={300}
              />
           
          </Card>
          <Card>
           
              <div>
                <h3>Visitors</h3>
                <h1>Top Referrers</h1>
              </div>
                <ul>
                  <li>google.com - 3K</li>
                  <li>twitter.com - 1.2K</li>
                  <li>youtube.com - 1.1K</li>
                </ul>
              
           
          </Card>
        </div>
      </main>
    </div>
  );
}


const MetricsFM = () => {
  // Define data for each card
  const cardData = [
    { text: "Total users", number: "72,540", percentage: "1.7%" },
    { text: "Total revenue", number: "$100,000", percentage: "3.2%" },
    { text: "Active users", number: "15,000", percentage: "2.1%" },
    { text: "New users", number: "5,000", percentage: "0.8%" },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Map over cardData array */}
        {cardData.map((card, index) => (
          <d iv
            key={index}
            className="flex flex-col bg-white border shadow-sm rounded-xl"
          >
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-x-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {card.text}
                </p>
                <Tooltip title="The number of daily users">
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
                <h3 className="text-sm sm:text-sm font-medium text-gray-800">
                  {card.number}
                </h3>
                <span className="flex items-center gap-x-1 text-green-600">
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
                  <span className="inline-block text-sm">
                    {card.percentage}
                  </span>
                </span>
              </div>
              <div>Say something</div>
            </div>
          </d>
        ))}
        {/* End Map */}
      </div>
      {/* End Grid */}
      <Component />
    </div>
  );
};

export default MetricsFM;
