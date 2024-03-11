import React, { useState, useEffect } from "react";
import { Form, Input, Select, Table, Button } from "antd";
import ReactApexChart from "react-apexcharts";
import { EditOutlined } from "@ant-design/icons";
const { Option } = Select;

// const CompoundInterestCalculator = () => {
//   const [form] = Form.useForm();
//   const [tableData, setTableData] = useState([]);
//   const [chartOptions, setChartOptions] = useState({
//     chart: {
//       id: "cashflow-chart",
//       animations: {
//         enabled: true,
//         easing: "easeinout",
//         speed: 800,
//         animateGradually: {
//           enabled: true,
//           delay: 150,
//         },
//       },
//     },
//     xaxis: {
//       categories: [],
//     },
//   });

//   const onFinish = (values) => {
//     // Assuming values contain initialInvest, interestRate, and investmentDuration
//     const { initialInvest, interestRate, investmentDuration } = values;

//     // Calculate compound interest for each month
//     const interestRatePerMonth = interestRate / 12 / 100;
//     const numberOfMonths = investmentDuration === "3" ? 36 : 60;

//     const cashflowData = Array.from({ length: numberOfMonths }, (_, i) => {
//       const month = i + 1;
//       const compoundInterest =
//         initialInvest * Math.pow(1 + interestRatePerMonth, month);

//       return {
//         month,
//         compoundInterest: compoundInterest.toFixed(2),
//       };
//     });

//     // Update table and chart data
//     setTableData(cashflowData);
//     setChartOptions({
//       ...chartOptions,
//       xaxis: {
//         categories: Array.from({ length: numberOfMonths }, (_, i) => i + 1),
//       },
//     });
//   };

//   const columns = [
//     {
//       title: "Month",
//       dataIndex: "month",
//       key: "month",
//     },
//     ...tableData.map((data) => ({
//       title: `Month ${data.month}`,
//       dataIndex: data.month,
//       key: `month_${data.month}`,
//     })),
//   ];

//   const dataSource = [
//     {
//       key: "compoundInterest",
//       month: "Compound Interest",
//       ...tableData.reduce((acc, data) => {
//         acc[data.month] = data.compoundInterest;
//         return acc;
//       }, {}),
//     },
//   ];

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl text-blue-600 font-semibold mb-4">
//         Compound Interest Calculator
//       </h1>
//       <Form form={form} onFinish={onFinish} layout="inline">
//         <Form.Item
//           label="Initial Invest"
//           name="initialInvest"
//           rules={[
//             { required: true, message: "Please enter initial invest amount!" },
//           ]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           label="Interest Rate"
//           name="interestRate"
//           rules={[{ required: true, message: "Please enter interest rate!" }]}
//         >
//           <Input type="number" />
//         </Form.Item>
//         <Form.Item
//           label="Investment Duration"
//           name="investmentDuration"
//           rules={[
//             { required: true, message: "Please choose investment duration!" },
//           ]}
//         >
//           <Select>
//             <Option value="3">3 years</Option>
//             <Option value="5">5 years</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-1 rounded"
//           >
//             Calculate
//           </button>
//         </Form.Item>
//       </Form>

//       <div className="my-8 overflow-auto">
//         <Table dataSource={dataSource} columns={columns} pagination={false} />
//       </div>

//       <div>
//         <ReactApexChart
//           options={chartOptions}
//           series={[
//             {
//               name: "Compound Interest",
//               data: tableData.map((item) => +item.compoundInterest),
//             },
//           ]}
//           type="area"
//           height={300}
//         />
//       </div>
//     </div>
//   );
// };

// const CustomerGrowthComponent = () => {
//     const [initialCustomer, setInitialCustomer] = useState(100);
//     const [growthRate, setGrowthRate] = useState(0.05);
//     const [numOfYears, setNumOfYears] = useState(3);

//     const handleInitialCustomerChange = (value) => {
//       setInitialCustomer(value);
//     };

//     const handleGrowthRateChange = (value) => {
//       setGrowthRate(value);
//     };

//     const handleNumOfYearsChange = (value) => {
//       setNumOfYears(value);
//     };

//     const calculateCustomerGrowth = () => {
//       const months = numOfYears === 3 ? 36 : 60;
//       const data = [];
//       let currentCustomer = initialCustomer;

//       for (let i = 0; i < months; i++) {
//         data.push({
//           Month: i + 1,
//           Customers: currentCustomer.toFixed(2),
//         });
//         currentCustomer *= 1 + growthRate;
//       }

//       return data;
//     };

//     const columns = [
//       {
//         title: 'Month',
//         dataIndex: 'Month',
//         key: 'Month',
//       },
//       ...calculateCustomerGrowth().map((data) => ({
//         title: `Month ${data.Month}`,
//         dataIndex: `Month${data.Month}`,
//         key: `Month${data.Month}`,
//       })),
//     ];

//     const dataSource = [calculateCustomerGrowth()[0]]; // We only show one row of data

//     calculateCustomerGrowth().forEach((data, index) => {
//       dataSource[0][`Month${data.Month}`] = data.Customers;
//     });

//     const options = {
//       chart: {
//         id: 'customer-growth-chart',
//       },
//       xaxis: {
//         categories: calculateCustomerGrowth().map((data) => data.Month),
//       },
//     };

//     const series = [
//       {
//         name: 'Customers',
//         data: calculateCustomerGrowth().map((data) => data.Customers),
//       },
//     ];

//     return (
//       <div>
//         <div className="mb-4">
//           <label className="mr-2">Initial Customer:</label>
//           <Input
//             type="number"
//             value={initialCustomer}
//             onChange={(e) => handleInitialCustomerChange(Number(e.target.value))}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="mr-2">Growth Rate (%):</label>
//           <Input
//             type="number"
//             value={growthRate * 100}
//             onChange={(e) => handleGrowthRateChange(e.target.value / 100)}
//           />
//         </div>
//         <div className="mb-4">
//           <label className="mr-2">Choose Option:</label>
//           <Select defaultValue={numOfYears} onChange={handleNumOfYearsChange}>
//             <Option value={3}>3 Years</Option>
//             <Option value={5}>5 Years</Option>
//           </Select>
//         </div>
//         <div className="mb-4 overflow-auto">
//           <Table dataSource={dataSource} columns={columns} pagination={false} />
//         </div>
//         <div>
//           <ReactApexChart options={options} series={series} type="area" height={350} />
//         </div>
//       </div>
//     );
//   };

const CustomerGrowthComponent = ({
  customersPerMonth,
  percentChangePerMonth,
}) => {
  const [initialCustomer, setInitialCustomer] = useState(100);
  const [growthRate, setGrowthRate] = useState(0.05);
  const [numOfYears, setNumOfYears] = useState(3);

  const handleInitialCustomerChange = (value) => {
    setInitialCustomer(value);
  };

  const handleGrowthRateChange = (value) => {
    setGrowthRate(value);
  };

  const handleNumOfYearsChange = (value) => {
    setNumOfYears(value);
  };

  useEffect(() => {
    setInitialCustomer(customersPerMonth * 12 * numOfYears);
  }, [customersPerMonth, percentChangePerMonth, numOfYears]);

  const calculateCustomerGrowth = () => {
    const months = numOfYears === 3 ? 36 : 60;
    const data = [];
    let currentCustomer = initialCustomer;

    for (let i = 0; i < months; i++) {
      data.push({
        Month: i + 1,
        Customers: currentCustomer.toFixed(2),
      });
      currentCustomer *= 1 + growthRate;
    }

    return data;
  };

  const columns = [
    {
      title: "Month",
      dataIndex: "Month",
      key: "Month",
    },
    ...calculateCustomerGrowth().map((data) => ({
      title: `Month ${data.Month}`,
      dataIndex: `Month${data.Month}`,
      key: `Month${data.Month}`,
    })),
  ];

  const dataSource = [calculateCustomerGrowth()[0]];

  calculateCustomerGrowth().forEach((data, index) => {
    dataSource[0][`Month${data.Month}`] = data.Customers;
  });

  const options = {
    chart: {
      id: "customer-growth-chart",
    },
    xaxis: {
      categories: calculateCustomerGrowth().map((data) => data.Month),
    },
  };

  const series = [
    {
      name: "Customers",
      data: calculateCustomerGrowth().map((data) => data.Customers),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <label className="mr-2">Initial Customer:</label>
        <Input
          type="number"
          value={initialCustomer}
          onChange={(e) => handleInitialCustomerChange(Number(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Growth Rate (%):</label>
        <Input
          type="number"
          value={growthRate * 100}
          onChange={(e) => handleGrowthRateChange(e.target.value / 100)}
        />
      </div>
      <div className="mb-4">
        <label className="mr-2">Choose Option:</label>
        <Select defaultValue={numOfYears} onChange={handleNumOfYearsChange}>
          <Option value={3}>3 Years</Option>
          <Option value={5}>5 Years</Option>
        </Select>
      </div>
      <div className="mb-4">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
      <div>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

function GeneralForm() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-xl font-semibold mb-6">General Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="start-date"
          >
            Start Date
          </label>
          <div className="flex gap-2">
            <Select defaultValue="September" style={{ width: "100%" }}>
              <Option value="january">January</Option>
              <Option value="february">February</Option>
              <Option value="march">March</Option>
              <Option value="april">April</Option>
              <Option value="may">May</Option>
              <Option value="june">June</Option>
              <Option value="july">July</Option>
              <Option value="august">August</Option>
              <Option value="september">September</Option>
              <Option value="october">October</Option>
              <Option value="november">November</Option>
              <Option value="december">December</Option>
            </Select>
            <Select defaultValue="2022" style={{ width: "100%" }}>
              <Option value="2020">2020</Option>
              <Option value="2021">2021</Option>
              <Option value="2022">2022</Option>
            </Select>
          </div>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="forecast-range"
          >
            Forecast Range (# of Years)
          </label>
          <Select defaultValue="3 Years" style={{ width: "100%" }}>
            <Option value="1">1 Year</Option>
            <Option value="2">2 Years</Option>
            <Option value="3">3 Years</Option>
          </Select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="starting-cash"
          >
            Starting Cash Balance
          </label>
          <Input id="starting-cash" placeholder="0.00" />
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="income-tax"
          >
            Income Tax
          </label>
          <div className="flex items-center">
            <Input id="income-tax" placeholder="25.00" />
            <span className="text-sm font-medium ml-2">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <Select defaultValue="Active" style={{ width: "100%" }}>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="payroll-tax"
          >
            Payroll Tax
          </label>
          <div className="flex items-center">
            <Input id="payroll-tax" placeholder="15.30" />
            <span className="text-sm font-medium ml-2">%</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="industry">
            Industry
          </label>
          <Select
            defaultValue="Please Select an Option"
            style={{ width: "100%" }}
          >
            <Option value="technology">Technology</Option>
            <Option value="finance">Finance</Option>
            <Option value="healthcare">Healthcare</Option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="currency">
            Currency
          </label>
          <Select
            defaultValue="United States Dollar (USD)"
            style={{ width: "100%" }}
          >
            <Option value="usd">United States Dollar (USD)</Option>
            <Option value="eur">Euro (EUR)</Option>
            <Option value="gbp">British Pound (GBP)</Option>
          </Select>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Update Project
        </Button>
      </div>
    </div>
  );
}

function CustomerInput({
  customersPerMonth,
  percentChangePerMonth,
  onCustomersPerMonthChange,
  onPercentChangePerMonthChange,
}) {
  return (
    <div className="max-w-md mx-auto">
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4" id="assumptions-heading">
          Assumptions
        </h2>
        <div className="bg-white rounded-md shadow p-6 border">
          {/* ... (Assumptions section remains the same) */}
        </div>
      </section>
      <section className="mb-8">
        <h2
          className="text-lg font-semibold mb-4 flex items-center"
          id="customers-heading"
        >
          <EditOutlined className="mr-2" />
          Customers
        </h2>
        <div className="bg-white rounded-md shadow p-6 border">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Begin Projection</span>
            <Input className="col-start-2" placeholder="Sep 2022 - 1" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">End Projection</span>
            <Input className="col-start-2" placeholder="Aug 2025 - 36" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <span className="font-medium">Customers per Month</span>
            <Input
              className="col-start-2"
              placeholder="950"
              value={customersPerMonth}
              onChange={(e) => onCustomersPerMonthChange(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-medium">% Change per Month</span>
            <Input
              className="col-start-2"
              placeholder="5.00 %"
              value={percentChangePerMonth}
              onChange={(e) => onPercentChangePerMonthChange(e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// function CustomerInput() {
//   return (
//     <div className="max-w-md mx-auto">
//       <section className="mb-8">
//         <h2 className="text-lg font-semibold mb-4" id="assumptions-heading">
//           Assumptions
//         </h2>
//         <div className="bg-white rounded-md shadow p-6 border">
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <span className="font-medium">Acquisition Type</span>
//             <Input className="col-start-2" placeholder="Annual Projection" />
//           </div>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <span className="font-medium">Revenue Streams</span>
//             <Input className="col-start-2" placeholder="5" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <span className="font-medium">Monthly Spend</span>
//             <Input className="col-start-2" placeholder="$0.00" />
//           </div>
//         </div>
//       </section>
//       <section className="mb-8">
//         <h2 className="text-lg font-semibold mb-4 flex items-center" id="customers-heading">
//           <EditOutlined className="mr-2" />
//           Customers
//         </h2>
//         <div className="bg-white rounded-md shadow p-6 border">
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <span className="font-medium">Begin Projection</span>
//             <Input className="col-start-2" placeholder="Sep 2022 - 1" />
//           </div>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <span className="font-medium">End Projection</span>
//             <Input className="col-start-2" placeholder="Aug 2025 - 36" />
//           </div>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <span className="font-medium">Customers per Month</span>
//             <Input className="col-start-2" placeholder="950" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <span className="font-medium">% Change per Month</span>
//             <Input className="col-start-2" placeholder="5.00 %" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

const Financials = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <GeneralForm />
      <CustomerInput />
      <CustomerGrowthComponent />
    </div>
  );
};

export default Financials;
