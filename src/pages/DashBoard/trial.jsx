import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

const InputField = ({ value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
  />
);

const BarChart = ({ xCategories, seriesData, series }) => (
  <ReactApexChart
    options={{ chart: { id: "bar-chart" }, xaxis: { categories: xCategories },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
  }}
    series={series.map((seriesPair, index) => ({
      name: seriesPair.name,
      data: seriesPair.data,
    }))}
    type="bar"
    height={350}
  />
);

const PieChart = ({ labels, seriesData }) => (
  <ReactApexChart
    options={{ chart: { id: "pie-chart" }, labels: labels }}
    series={seriesData}
    type="pie"
    height={350}
  />
);

const DonutChart = ({ labels, seriesData }) => (
  <ReactApexChart
    options={{ chart: { id: "donut-chart" }, labels: labels }}
    series={seriesData}
    type="donut"
    height={350}
  />
);

const LineChart = ({ xCategories, seriesData, series }) => (
  <ReactApexChart
    options={{
      chart: { id: "line-chart" },
      xaxis: { categories: xCategories },
    }}
    series={series.map((seriesPair, index) => ({
      name: seriesPair.name,
      data: seriesPair.data,
    }))}
    type="line"
    height={350}
  />
);

const AreaChart = ({ xCategories, seriesData, series }) => (
  <ReactApexChart
    options={{
      chart: { id: "area-chart" },
      xaxis: { categories: xCategories },
    }}
    series={series.map((seriesPair, index) => ({
      name: seriesPair.name,
      data: seriesPair.data,
    }))}
    type="area"
    height={350}
  />
);

const FormColumn = ({ children }) => (
  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
    {children}
  </div>
);

const Trial = () => {
  const navigate = useNavigate(); // Use the useNavigate hook
  const [chartType, setChartType] = useState("bar");
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };
  const handleBack = () => {
    navigate(-1); // Navigate back
  };

  return (
    <form className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <div>
        <label>
          Chart type
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
        {chartType === "bar" ? (
          <BarChartForm />
        ) : chartType === "pie" ? (
          <PieChartForm />
        ) : chartType === "donut" ? (
          <DonutChartForm />
        ) : chartType === "line" ? (
          <LineChartForm />
        ) : (
          <AreaChartForm />
        )}
      </div>
      {/* <div className={`flex justify-center`}> */}
      <button
        type="button"
        className={`flex justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
        onClick={handleBack}
      >
        Back to project
      </button>
      {/* </div> */}
    </form>
  );
};

const BarChartForm = () => {
  const [categories, setCategories] = useState([]);
  const [numPairs, setNumPairs] = useState(1);
  const [seriesPairs, setSeriesPairs] = useState([{ name: "", data: [] }]);
  const handleCategoriesChange = (e) => {
    setCategories(e.target.value.split(","));
  };
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
    updatedSeriesPairs[index].data = e.target.value.split(",").map(Number);
    setSeriesPairs(updatedSeriesPairs);
  };
  return (
    <div>
      <FormColumn>
        <label>
          X-axis{" "}
          <InputField
            value={categories.join(",")}
            onChange={handleCategoriesChange}
          />
        </label>
        <label>
          No. series
          <input
            type="number"
            value={numPairs}
            onChange={handleNumPairsChange}
            className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
        </label>
      </FormColumn>
      {seriesPairs.map((pair, index) => (
        <FormColumn key={index}>
          <label>
            Series name {index + 1}
            <InputField
              value={pair.name}
              onChange={(e) => handleSeriesNameChange(e, index)}
            />
          </label>
          <label>
            Series data {index + 1}{" "}
            <InputField
              value={pair.data.join(",")}
              onChange={(e) => handleSeriesDataChange(e, index)}
            />
          </label>
        </FormColumn>
      ))}
      <BarChart xCategories={categories} series={seriesPairs} />
    </div>
  );
};

const PieChartForm = () => {
  const [labels, setLabels] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const handleLabelsChange = (e) => {
    setLabels(e.target.value.split(","));
  };
  const handleSeriesDataChange = (e) => {
    setSeriesData(e.target.value.split(",").map(Number));
  };
  return (
    <div>
      <FormColumn>
        <label>
          Labels{" "}
          <InputField value={labels.join(",")} onChange={handleLabelsChange} />
        </label>
        <label>
          Series data{" "}
          <InputField
            value={seriesData.join(",")}
            onChange={handleSeriesDataChange}
          />
        </label>
      </FormColumn>
      <PieChart labels={labels} seriesData={seriesData} />
    </div>
  );
};

const DonutChartForm = () => {
  const [labels, setLabels] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const handleLabelsChange = (e) => {
    setLabels(e.target.value.split(","));
  };
  const handleSeriesDataChange = (e) => {
    setSeriesData(e.target.value.split(",").map(Number));
  };
  return (
    <div>
      <FormColumn>
        <label>
          Labels{" "}
          <InputField value={labels.join(",")} onChange={handleLabelsChange} />
        </label>
        <label>
          Series data{" "}
          <InputField
            value={seriesData.join(",")}
            onChange={handleSeriesDataChange}
          />
        </label>
      </FormColumn>
      <DonutChart labels={labels} seriesData={seriesData} />
    </div>
  );
};

const LineChartForm = () => {
  const [categories, setCategories] = useState([]);
  const [numPairs, setNumPairs] = useState(1);
  const [seriesPairs, setSeriesPairs] = useState([{ name: "", data: [] }]);
  const handleCategoriesChange = (e) => {
    setCategories(e.target.value.split(","));
  };
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
    updatedSeriesPairs[index].data = e.target.value.split(",").map(Number);
    setSeriesPairs(updatedSeriesPairs);
  };
  return (
    <div>
      <FormColumn>
        <label>
          X-axis{" "}
          <InputField
            value={categories.join(",")}
            onChange={handleCategoriesChange}
          />
        </label>
        <label>
          No. series
          <input
            type="number"
            value={numPairs}
            onChange={handleNumPairsChange}
            className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
        </label>
      </FormColumn>
      {seriesPairs.map((pair, index) => (
        <FormColumn key={index}>
          <label>
            Series name {index + 1}
            <InputField
              value={pair.name}
              onChange={(e) => handleSeriesNameChange(e, index)}
            />
          </label>
          <label>
            Series data {index + 1}{" "}
            <InputField
              value={pair.data.join(",")}
              onChange={(e) => handleSeriesDataChange(e, index)}
            />
          </label>
        </FormColumn>
      ))}
      <LineChart xCategories={categories} series={seriesPairs} />
    </div>
  );
};

const AreaChartForm = () => {
  const [categories, setCategories] = useState([]);
  const [numPairs, setNumPairs] = useState(1);
  const [seriesPairs, setSeriesPairs] = useState([{ name: "", data: [] }]);
  const handleCategoriesChange = (e) => {
    setCategories(e.target.value.split(","));
  };
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
    updatedSeriesPairs[index].data = e.target.value.split(",").map(Number);
    setSeriesPairs(updatedSeriesPairs);
  };
  return (
    <>
      <div>
        <FormColumn>
          <label>
            X-axis{" "}
            <InputField
              value={categories.join(",")}
              onChange={handleCategoriesChange}
            />
          </label>
          <label>
            No. series
            <input
              type="number"
              value={numPairs}
              onChange={handleNumPairsChange}
              className="flex-1 block h-10 px-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </label>
        </FormColumn>
        {seriesPairs.map((pair, index) => (
          <FormColumn key={index}>
            <label>
              Series name {index + 1}
              <InputField
                value={pair.name}
                onChange={(e) => handleSeriesNameChange(e, index)}
              />
            </label>

            <label>
              Series data {index + 1}{" "}
              <InputField
                value={pair.data.join(",")}
                onChange={(e) => handleSeriesDataChange(e, index)}
              />
            </label>
          </FormColumn>
        ))}
        <AreaChart xCategories={categories} series={seriesPairs} />
      </div>
    </>
  );
};

export default Trial;
