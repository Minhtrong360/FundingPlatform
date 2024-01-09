// import React, { useState } from 'react';
// import Chart from "./chart";

// function ChartInput({ inputName,type ,placeholder, value, onChange }) {
//   return (
//     <div>
//       <label htmlFor={inputName} className="block text-sm text-gray-500 dark:text-gray-300">
//         {inputName}
//       </label>
//       <input
//         type={type}
//         name={inputName}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="block mt-2 mb-2 w-1/2 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
//       />
//     </div>
//   );
// }

// function ChartForm() {

//   const [seriesName01, setSeriesName1] = useState('');
//   const [seriesData01, setSeriesData1] = useState('');
//   const [seriesName02, setSeriesName2] = useState('');
//   const [seriesData02, setSeriesData2] = useState('');
//   const [categoryData, setCategoryData] = useState('');
//   const handleSave = () => {
//     // Logic to save the states goes here
//     // You can send the data to a server, update a global state, etc.

//     console.log("Saving Series Name:", seriesName01);
//     console.log("Saving Series Data:", seriesData01);
//     console.log("Saving Series Name:", seriesName02);
//     console.log("Saving Series Data:", seriesData02);
//     console.log("Saving Categories Data:", categoryData);
//   };

//   // Handlers for adding series and categories will go here

//   return (
//     <div>
//     <Chart seriesName01={seriesName01} seriesName02={seriesName02} seriesData01={seriesData01} seriesData02={seriesData02} categories={categoryData} />
//     <div>
//       <ChartInput inputName="Series Name 1" type="text"  placeholder="Ex: Income" value={seriesName01} onChange={(e) => setSeriesName1(e.target.value)} />
//       <ChartInput inputName="Series Data 1" type="text"  placeholder="Ex: 18000, 51000, 60000" value={seriesData01} onChange={(e) => setSeriesData1(e.target.value)} />
//       <ChartInput inputName="Series Name 2" type="text"  placeholder="Ex: Outcome" value={seriesName02} onChange={(e) => setSeriesName2(e.target.value)} />
//       <ChartInput inputName="Series Data 2" type="text"  placeholder="Ex: 27000, 38000, 60000" value={seriesData02} onChange={(e) => setSeriesData2(e.target.value)} />
//       <ChartInput inputName="X-axis va lue" type="text" placeholder="Ex:  January 2023,  January 2023" value={categoryData} onChange={(e) => setCategoryData(e.target.value)} />

//       {/* Buttons for adding series and categories */}
//       <button onClick={handleSave} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//         Save
//       </button>
//     </div>
//     </div>
//   );
// }

// export default ChartForm;

// import React, { useState } from 'react';
// import  Chart  from "react-apexcharts";
// // import Chart from "./chart";

// function ChartInput({ inputName, type, placeholder, value, onChange }) {
//   return (
//     <div>
//       <label htmlFor={inputName} className="block text-sm text-gray-500 dark:text-gray-300">
//         {inputName}
//       </label>
//       <input
//         type={type}
//         name={inputName}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="block mt-2 mb-2 w-1/2 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
//       />
//     </div>
//   );
// }

// function ChartForm() {
//   const [seriesName01, setSeriesName1] = useState('');
//   const [seriesData01, setSeriesData1] = useState('');
//   const [seriesName02, setSeriesName2] = useState('');
//   const [seriesData02, setSeriesData2] = useState('');
//   const [categoryData, setCategoryData] = useState('');

//   const [chartData, setChartData] = useState({
//     series: [],
//     options: {
//       chart: {
//         type: 'area',
//         height: 300,
//       },
//       xaxis: {
//         categories: []
//       }
//     }
//   });

//   const convertToNumberArray = (dataString) => {
//     return dataString.split(',').map(Number);
//   };

//   const handleSave = () => {
//     setChartData({
//       incomeData: convertToNumberArray(seriesData01),
//       outcomeData: convertToNumberArray(seriesData02),
//       xAxisCategories: categoryData.split(',')
//     });
//   };

//   return (
//     <div>
//       <Chart

//        type="area"
//         height={300}

//         // incomeData={chartData.incomeData}
//         // outcomeData={chartData.outcomeData}
//         // xAxisCategories={chartData.xAxisCategories}
//       /><Chart/>
//       <div>
//         <ChartInput inputName="Series Name 1" type="text" placeholder="Ex: Income" value={seriesName01} onChange={(e) => setSeriesName1(e.target.value)} />
//         <ChartInput inputName="Series Data 1" type="text" placeholder="Ex: 18000, 51000, 60000" value={seriesData01} onChange={(e) => setSeriesData1(e.target.value)} />
//         <ChartInput inputName="Series Name 2" type="text" placeholder="Ex: Outcome" value={seriesName02} onChange={(e) => setSeriesName2(e.target.value)} />
//         <ChartInput inputName="Series Data 2" type="text" placeholder="Ex: 27000, 38000, 60000" value={seriesData02} onChange={(e) => setSeriesData2(e.target.value)} />
//         <ChartInput inputName="X-axis value" type="text" placeholder="Ex: January 2023, February 2023" value={categoryData} onChange={(e) => setCategoryData(e.target.value)} />

//         <button onClick={handleSave} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//           Save
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChartForm;

import React, { useState } from "react";
import Chart from "react-apexcharts";

function ChartInput({ inputName, type, placeholder, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={inputName}
        className="block text-sm text-gray-500 dark:text-gray-300"
      >
        {inputName}
      </label>
      <input
        type={type}
        name={inputName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block mt-2 mb-2 w-1/2 placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
      />
    </div>
  );
}

function ChartForm() {
  const [seriesName01, setSeriesName1] = useState("");
  const [seriesData01, setSeriesData1] = useState("");
  const [seriesName02, setSeriesName2] = useState("");
  const [seriesData02, setSeriesData2] = useState("");
  const [categoryData, setCategoryData] = useState("");

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      height: 300,
    },
    xaxis: {
      categories: [],
    },
  });

  const [chartSeries, setChartSeries] = useState([]);

  const convertToNumberArray = (dataString) => {
    return dataString.split(",").map(Number);
  };

  const handleSave = () => {
    const categories = categoryData.split(",");

    setChartOptions({
      ...chartOptions,
      xaxis: { ...chartOptions.xaxis, categories: categories },
    });

    setChartSeries([
      { name: seriesName01, data: convertToNumberArray(seriesData01) },
      { name: seriesName02, data: convertToNumberArray(seriesData02) },
    ]);
  };

  return (
    <div>
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={300}
      />

      <div>
        <ChartInput
          inputName="Series Name 1"
          type="text"
          placeholder="Ex: Income"
          value={seriesName01}
          onChange={(e) => setSeriesName1(e.target.value)}
        />
        <ChartInput
          inputName="Series Data 1"
          type="text"
          placeholder="Ex: 18000, 51000, 60000"
          value={seriesData01}
          onChange={(e) => setSeriesData1(e.target.value)}
        />
        <ChartInput
          inputName="Series Name 2"
          type="text"
          placeholder="Ex: Outcome"
          value={seriesName02}
          onChange={(e) => setSeriesName2(e.target.value)}
        />
        <ChartInput
          inputName="Series Data 2"
          type="text"
          placeholder="Ex: 27000, 38000, 60000"
          value={seriesData02}
          onChange={(e) => setSeriesData2(e.target.value)}
        />
        <ChartInput
          inputName="X-axis value"
          type="text"
          placeholder="Ex: January 2023, February 2023"
          value={categoryData}
          onChange={(e) => setCategoryData(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ChartForm;
