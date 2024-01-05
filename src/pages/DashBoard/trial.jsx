// import React, { useState } from 'react';
// import ReactApexChart from 'react-apexcharts';

// const BarChart = ({ xCategories, seriesData }) => {
//     const options = {
//       chart: {
//         id: 'bar-chart',
//       },
//       xaxis: {
//         categories: xCategories,
//       },
//     };
  
//     const series = [
//       {
//         name: 'Series 1',
//         data: seriesData,
//       },
//     ];
  
//     return <ReactApexChart options={options} series={series} type="bar" height={350} />;
//   };
  
//   const PieChart = ({ labels, seriesData }) => {
//     const options = {
//       chart: {
//         id: 'pie-chart',
//       },
//       labels: labels,
//     };
  
//     const series = seriesData;
  
//     return <ReactApexChart options={options} series={series} type="pie" height={350} />;
//   };

// const BarChartForm = () => {
//     const [categories, setCategories] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']);
//     const [seriesData, setSeriesData] = useState([30, 40, 35, 50, 49, 60, 70]);
  
//     const handleCategoriesChange = (e) => {
//       setCategories(e.target.value.split(','));
//     };
  
//     const handleSeriesDataChange = (e) => {
//       setSeriesData(e.target.value.split(',').map(Number));
//     };
  
//     return (
//       <div>
//         <h2>Bar Chart Form</h2>
//         <label>
//           X-Axis Categories (comma-separated):
//           <input type="text" value={categories.join(',')} onChange={handleCategoriesChange} />
//         </label>
//         <br />
//         <label>
//           Series Data (comma-separated):
//           <input type="text" value={seriesData.join(',')} onChange={handleSeriesDataChange} />
//         </label>
//         <br />
//         <BarChart xCategories={categories} seriesData={seriesData} />
//       </div>
//     );
//   };
  
//   const PieChartForm = () => {
//     const [labels, setLabels] = useState(['Category A', 'Category B', 'Category C', 'Category D']);
//     const [seriesData, setSeriesData] = useState([30, 40, 35, 50]);
  
//     const handleLabelsChange = (e) => {
//       setLabels(e.target.value.split(','));
//     };
  
//     const handleSeriesDataChange = (e) => {
//       setSeriesData(e.target.value.split(',').map(Number));
//     };
  
//     return (
//       <div>
//         <h2>Pie Chart Form</h2>
//         <label>
//           Labels (comma-separated):
//           <input type="text" value={labels.join(',')} onChange={handleLabelsChange} />
//         </label>
//         <br />
//         <label>
//           Series Data (comma-separated):
//           <input type="text" value={seriesData.join(',')} onChange={handleSeriesDataChange} />
//         </label>
//         <br />
//         <PieChart labels={labels} seriesData={seriesData} />
//       </div>
//     );
//   };

// const Trial = () => {
//     const [chartType, setChartType] = useState('bar'); // Default to bar chart
  
//     const handleChartTypeChange = (e) => {
//       setChartType(e.target.value);
//     };
  
//     return (
//       <div>
//         <label>
//           Select Chart Type:
//           <select value={chartType} onChange={handleChartTypeChange}>
//             <option value="bar">Bar Chart</option>
//             <option value="pie">Pie Chart</option>
//           </select>
//         </label>
  
//         {chartType === 'bar' ? (
//           <BarChartForm />
//         ) : (
//           <PieChartForm />
//         )}
//       </div>
//     );
//   };
// export default Trial;

import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const InputField = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
  />
);

const BarChart = ({ xCategories, seriesData, series }) => {
  const options = { chart: { id: 'bar-chart' }, xaxis: { categories: xCategories } };
  const chartSeries = series.map((seriesPair, index) => ({ name: seriesPair.name, data: seriesPair.data }));
  return <ReactApexChart options={options} series={chartSeries} type="bar" height={350} />;
};

const PieChart = ({ labels, seriesData }) => {
  const options = { chart: { id: 'pie-chart' }, labels: labels };
  const series = seriesData;
  return <ReactApexChart options={options} series={series} type="pie" height={350} />;
};

const DonutChart = ({ labels, seriesData }) => {
  const options = { chart: { id: 'donut-chart' }, labels: labels };
  const series = seriesData;
  return <ReactApexChart options={options} series={series} type="donut" height={350} />;
};

const LineChart = ({ xCategories, seriesData, series }) => {
  const options = { chart: { id: 'line-chart' }, xaxis: { categories: xCategories } };
  const chartSeries = series.map((seriesPair, index) => ({ name: seriesPair.name, data: seriesPair.data }));
  return <ReactApexChart options={options} series={chartSeries} type="line" height={350} />;
};

const AreaChart = ({ xCategories, seriesData, series }) => {
  const options = { chart: { id: 'area-chart' }, xaxis: { categories: xCategories } };
  const chartSeries = series.map((seriesPair, index) => ({ name: seriesPair.name, data: seriesPair.data }));
  return <ReactApexChart options={options} series={chartSeries} type="area" height={350} />;
};

  const BarChartForm = () => {
    const [categories, setCategories] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']);
    const [numPairs, setNumPairs] = useState(1);
    const [seriesPairs, setSeriesPairs] = useState([{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70] }]);
    const handleCategoriesChange = (e) => { setCategories(e.target.value.split(',')); };
    const handleNumPairsChange = (e) => {
      const num = parseInt(e.target.value);
      setNumPairs(num);
      const defaultSeriesPairs = Array.from({ length: num }, (_, index) => ({
        name: `Series ${index + 1}`,
        data: Array(categories.length).fill(0),
      }));
      setSeriesPairs(defaultSeriesPairs);
    };
    const handleSeriesNameChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].name = e.target.value;
      setSeriesPairs(updatedSeriesPairs);
    };
    const handleSeriesDataChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].data = e.target.value.split(',').map(Number);
      setSeriesPairs(updatedSeriesPairs);
    };
    return (
      <div>
        <h2>Bar Chart Form</h2>
        <label>X-Axis Categories (comma-separated):<InputField value={categories.join(',')} onChange={handleCategoriesChange} /></label><br />
        <label>Number of Series Pairs:<InputField value={numPairs} onChange={handleNumPairsChange} /></label><br />
        {seriesPairs.map((pair, index) => (
          <div key={index}>
            <label>Series Name {index + 1}:<InputField value={pair.name} onChange={(e) => handleSeriesNameChange(e, index)} /></label>
            <label>Series Data {index + 1} (comma-separated):<InputField value={pair.data.join(',')} onChange={(e) => handleSeriesDataChange(e, index)} /></label><br />
          </div>
        ))}
        <BarChart xCategories={categories} series={seriesPairs} />
      </div>
    );
  };

  const PieChartForm = () => {
    const [labels, setLabels] = useState(['Category A', 'Category B', 'Category C', 'Category D']);
    const [seriesData, setSeriesData] = useState([30, 40, 35, 50]);
    const handleLabelsChange = (e) => { setLabels(e.target.value.split(',')); };
    const handleSeriesDataChange = (e) => { setSeriesData(e.target.value.split(',').map(Number)); };
    return (
      <div>
        <h2>Pie Chart Form</h2>
        <label>Labels (comma-separated):<InputField value={labels.join(',')} onChange={handleLabelsChange} /></label><br />
        <label>Series Data (comma-separated):<InputField value={seriesData.join(',')} onChange={handleSeriesDataChange} /></label><br />
        <PieChart labels={labels} seriesData={seriesData} />
      </div>
    );
  };

  const DonutChartForm = () => {
    const [labels, setLabels] = useState(['Category A', 'Category B', 'Category C', 'Category D']);
    const [seriesData, setSeriesData] = useState([30, 40, 35, 50]);
    const handleLabelsChange = (e) => { setLabels(e.target.value.split(',')); };
    const handleSeriesDataChange = (e) => { setSeriesData(e.target.value.split(',').map(Number)); };
    return (
      <div>
        <h2>Donut Chart Form</h2>
        <label>Labels (comma-separated):<InputField value={labels.join(',')} onChange={handleLabelsChange} /></label><br />
        <label>Series Data (comma-separated):<InputField value={seriesData.join(',')} onChange={handleSeriesDataChange} /></label><br />
        <DonutChart labels={labels} seriesData={seriesData} />
      </div>
    );
  };

  const LineChartForm = () => {
    const [categories, setCategories] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']);
    const [numPairs, setNumPairs] = useState(1);
    const [seriesPairs, setSeriesPairs] = useState([{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70] }]);
    const handleCategoriesChange = (e) => { setCategories(e.target.value.split(',')); };
    const handleNumPairsChange = (e) => {
      const num = parseInt(e.target.value);
      setNumPairs(num);
      const defaultSeriesPairs = Array.from({ length: num }, (_, index) => ({
        name: `Series ${index + 1}`,
        data: Array(categories.length).fill(0),
      }));
      setSeriesPairs(defaultSeriesPairs);
    };
    const handleSeriesNameChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].name = e.target.value;
      setSeriesPairs(updatedSeriesPairs);
    };
    const handleSeriesDataChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].data = e.target.value.split(',').map(Number);
      setSeriesPairs(updatedSeriesPairs);
    };
    return (
      <div>
        <h2>Line Chart Form</h2>
        <label>X-Axis Categories (comma-separated):<InputField value={categories.join(',')} onChange={handleCategoriesChange} /></label><br />
        <label>Number of Series Pairs:<InputField value={numPairs} onChange={handleNumPairsChange} /></label><br />
        {seriesPairs.map((pair, index) => (
          <div key={index}>
            <label>Series Name {index + 1}:<InputField value={pair.name} onChange={(e) => handleSeriesNameChange(e, index)} /></label>
            <label>Series Data {index + 1} (comma-separated):<InputField value={pair.data.join(',')} onChange={(e) => handleSeriesDataChange(e, index)} /></label><br />
          </div>
        ))}
        <LineChart xCategories={categories} series={seriesPairs} />
      </div>
    );
  };

  const AreaChartForm = () => {
    const [categories, setCategories] = useState(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']);
    const [numPairs, setNumPairs] = useState(1);
    const [seriesPairs, setSeriesPairs] = useState([{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70] }]);
    const handleCategoriesChange = (e) => { setCategories(e.target.value.split(',')); };
    const handleNumPairsChange = (e) => {
      const num = parseInt(e.target.value);
      setNumPairs(num);
      const defaultSeriesPairs = Array.from({ length: num }, (_, index) => ({
        name: `Series ${index + 1}`,
        data: Array(categories.length).fill(0),
      }));
      setSeriesPairs(defaultSeriesPairs);
    };
    const handleSeriesNameChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].name = e.target.value;
      setSeriesPairs(updatedSeriesPairs);
    };
    const handleSeriesDataChange = (e, index) => {
      const updatedSeriesPairs = [...seriesPairs];
      updatedSeriesPairs[index].data = e.target.value.split(',').map(Number);
      setSeriesPairs(updatedSeriesPairs);
    };
    return (
      <div>
        <h2>Area Chart Form</h2>
        <label>X-Axis Categories (comma-separated):<InputField value={categories.join(',')} onChange={handleCategoriesChange} /></label><br />
        <label>Number of Series Pairs:<InputField value={numPairs} onChange={handleNumPairsChange} /></label><br />
        {seriesPairs.map((pair, index) => (
          <div key={index}>
            <label>Series Name {index + 1}:<InputField value={pair.name} onChange={(e) => handleSeriesNameChange(e, index)} /></label>
            <label>Series Data {index + 1} (comma-separated):<InputField value={pair.data.join(',')} onChange={(e) => handleSeriesDataChange(e, index)} /></label><br />
          </div>
        ))}
        <AreaChart xCategories={categories} series={seriesPairs} />
      </div>
    );
  };

const Trial = () => {
  const [chartType, setChartType] = useState('bar');
  const handleChartTypeChange = (e) => { setChartType(e.target.value); };
  return (
    <div>
      <label>
        Select Chart Type:
        <select
          value={chartType}
          onChange={handleChartTypeChange}
          className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          <option value="donut">Donut Chart</option>
          <option value="line">Line Chart</option>
          <option value="area">Area Chart</option>
        </select>
      </label>
      {chartType === 'bar' ? (
        <BarChartForm />
      ) : chartType === 'pie' ? (
        <PieChartForm />
      ) : chartType === 'donut' ? (
        <DonutChartForm />
      ) : chartType === 'line' ? (
        <LineChartForm />
      ) : (
        <AreaChartForm />
      )}
    </div>
  );
};

export default Trial;
