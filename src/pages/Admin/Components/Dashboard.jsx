import moment from "moment";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function Dashboard({ dataSource }) {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const processData = () => {
      let months = {};
      let customers = {};
      let status = {};
      let verified = {};
      let targetAmount = {};
      let ticketSize = {};
      let offerType = {};
      let amountRaised = {};
      let country = {};
      let yearEstablished = {};
      let revenueRange = {};
      let round = {};
      let industry = {};

      dataSource.forEach((item) => {
        // Count projects per month
        const month = moment(item.created_at).format("MMM YYYY");
        months[month] = (months[month] || 0) + 1;

        // Count projects per customer
        customers[item.user_email] = (customers[item.user_email] || 0) + 1;

        // Count projects by status
        status[item.status] = (status[item.status] || 0) + 1;

        // Count projects by verified status
        verified[item.verified ? "Verified" : "Not Verified"] =
          (verified[item.verified ? "Verified" : "Not Verified"] || 0) + 1;

        // Count projects by target amount ranges
        const amountRanges = ["0-100K", "100K-500K", "500K-1M", "1M-5M", ">5M"];
        amountRanges.forEach((range) => {
          if (!targetAmount[range]) targetAmount[range] = 0;
          const amount = parseFloat(item.target_amount);
          switch (range) {
            case "0-100K":
              if (amount <= 100000) targetAmount[range]++;
              break;
            case "100K-500K":
              if (amount >= 100000 && amount <= 500000) targetAmount[range]++;
              break;
            case "500K-1M":
              if (amount >= 500000 && amount <= 1000000) targetAmount[range]++;
              break;
            case "1M-5M":
              if (amount >= 1000000 && amount <= 5000000) targetAmount[range]++;
              break;
            case ">5M":
              if (amount >= 5000000) targetAmount[range]++;
              break;
          }
        });

        // Count projects by ticket size ranges
        const ticketRanges = [
          "0-1000",
          "1001-5000",
          "5001-10000",
          "10001-50000",
          ">50000",
        ];
        ticketRanges.forEach((range) => {
          if (!ticketSize[range]) ticketSize[range] = 0;
          const size = parseFloat(item.ticket_size);
          switch (range) {
            case "0-1000":
              if (size <= 1000) ticketSize[range]++;
              break;
            case "1001-5000":
              if (size > 1000 && size <= 5000) ticketSize[range]++;
              break;
            case "5001-10000":
              if (size > 5000 && size <= 10000) ticketSize[range]++;
              break;
            case "10001-50000":
              if (size > 10000 && size <= 50000) ticketSize[range]++;
              break;
            case ">50000":
              if (size > 50000) ticketSize[range]++;
              break;
          }
        });

        // Count projects by offer type
        offerType[item.offer_type] = (offerType[item.offer_type] || 0) + 1;

        // Count projects by amount raised ranges
        amountRanges.forEach((range) => {
          if (!amountRaised[range]) amountRaised[range] = 0;
          const raised = parseFloat(item.amountRaised);
          switch (range) {
            case "0-100K":
              if (raised <= 100000) amountRaised[range]++;
              break;
            case "100K-500K":
              if (raised > 100000 && raised <= 500000) amountRaised[range]++;
              break;
            case "500K-1M":
              if (raised > 500000 && raised <= 1000000) amountRaised[range]++;
              break;
            case "1M-5M":
              if (raised > 1000000 && raised <= 5000000) amountRaised[range]++;
              break;
            case ">5M":
              if (raised > 5000000) amountRaised[range]++;
              break;
          }
        });

        // Count projects by country
        country[item.country] = (country[item.country] || 0) + 1;

        // Count projects by year established
        yearEstablished[item.operationTime] =
          (yearEstablished[item.operationTime] || 0) + 1;

        // Count projects by revenue range
        revenueRange[item.revenueStatus] =
          (revenueRange[item.revenueStatus] || 0) + 1;

        // Count projects by round
        round[item.round] = (round[item.round] || 0) + 1;

        // Count projects by industry
        item.industry.forEach((ind) => {
          industry[ind] = (industry[ind] || 0) + 1;
        });
        // console.log("Processing item:", item);
      });

      const sortedCustomers = Object.entries(customers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      setChartData([
        {
          name: "Projects by Month",
          data: Object.values(months),
          categories: Object.keys(months),
          type: "bar",
        },
        {
          name: "Top 10 Customers",
          data: sortedCustomers.map((c) => c[1]),
          categories: sortedCustomers.map((c) => c[0]),
          type: "bar",
        },
        {
          name: "Projects by Status",
          data: Object.values(status),
          categories: Object.keys(status),
          type: "pie",
        },
        {
          name: "Projects by Verified Status",
          data: Object.values(verified),
          categories: Object.keys(verified),
          type: "pie",
        },
        {
          name: "Projects by Target Amount",
          data: Object.values(targetAmount),
          categories: Object.keys(targetAmount),
          type: "bar",
        },
        {
          name: "Projects by Ticket Size",
          data: Object.values(ticketSize),
          categories: Object.keys(ticketSize),
          type: "bar",
        },
        {
          name: "Projects by Offer Type",
          data: Object.values(offerType),
          categories: Object.keys(offerType),
          type: "bar",
        },
        {
          name: "Projects by Amount Raised",
          data: Object.values(amountRaised),
          categories: Object.keys(amountRaised),
          type: "bar",
        },
        {
          name: "Projects by Country",
          data: Object.values(country),
          categories: Object.keys(country),
          type: "bar",
        },
        {
          name: "Projects by Year Established",
          data: Object.values(yearEstablished),
          categories: Object.keys(yearEstablished),
          type: "bar",
        },
        {
          name: "Projects by Revenue Range",
          data: Object.values(revenueRange),
          categories: Object.keys(revenueRange),
          type: "bar",
        },
        {
          name: "Projects by Round",
          data: Object.values(round),
          categories: Object.keys(round),
          type: "bar",
        },
        {
          name: "Projects by Industry",
          data: Object.values(industry),
          categories: Object.keys(industry),
          type: "bar",
        },
      ]);
    };

    processData();
  }, [dataSource]);

  console.log("dataSource", dataSource);
  return (
    <div className="w-[90%] flex flex-col gap-8 md:p-8 p-0 bg-white">
      <h2 className="text-3xl font-semibold">Overview Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chartData.map((chart, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{chart.name}</h2>
            <Chart
              options={{
                chart: {
                  fontFamily: "Sora, sans-serif",
                  zoom: {
                    enabled: false, // Disable zooming
                  },
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                    },
                  },
                  type: chart.type,
                  height: 350,
                  animations: {
                    enabled: false,
                  },
                },
                grid: {
                  show: false,
                },
                dataLabels: {
                  enabled: true,

                  style: {
                    fontSize: "12px",
                    fontFamily: "Sora, sans-serif",
                    fontWeight: "bold",
                    colors: ["#000000"],
                  },
                },
                plotOptions: {
                  bar: {
                    borderRadius: 2,
                  },
                },
                colors: [
                  "#00A2FF",
                  "#14F584",
                  "#FFB303",
                  "#DBFE01",
                  "#FF474C",
                  "#D84FE4",
                ],
                fill:
                  chart.type === "bar"
                    ? {
                        type: "gradient",

                        gradient: {
                          shade: "light",
                          shadeIntensity: 0.5,
                          opacityFrom: 0.75,
                          opacityTo: 0.65,
                          stops: [0, 90, 100],
                        },
                      }
                    : {},

                labels: chart.categories,

                xaxis: {
                  categories: chart.categories,

                  axisTicks: {
                    show: false, // Hide x-axis ticks
                  },
                  labels: {
                    show: true,
                    rotate: 0,
                    style: {
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                  title: {
                    style: {
                      fontSize: "12px",
                      fontFamily: "Sora, sans-serif",
                    },
                  },
                },

                stroke:
                  chart.type === "bar"
                    ? {
                        curve: "straight",
                        width: 1,
                      }
                    : {},
                legend: {
                  position: chart.type === "pie" ? "bottom" : "top",
                  onItemClick: {
                    toggleDataSeries: true,
                  },
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                      },
                    },
                  },
                ],
              }}
              series={
                chart.type === "pie"
                  ? chart.data
                  : [{ data: chart.data, name: "Quantity" }]
              }
              type={chart.type}
              height={350}
              className="w-full h-48"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
