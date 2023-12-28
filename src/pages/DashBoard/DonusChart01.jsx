import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';
import _ from 'lodash';

function buildChart(id, shared, light, dark) {
const $chart = document.querySelector(id);
let chart = null;

if (!$chart) return false;

const tabpanel = $chart.closest('[role="tabpanel"]');
let modeFromBodyClass = null;

Array.from(document.querySelector('html').classList).forEach((cl) => {
    if (['dark', 'light', 'default'].includes(cl)) modeFromBodyClass = cl;
});

const optionsFn = (mode = modeFromBodyClass || localStorage.getItem('hs_theme')) => _.merge(shared(mode), mode === 'dark' ? dark : light);

if ($chart) {
    chart = new ApexCharts($chart, optionsFn());
    chart.render();

    window.addEventListener('on-hs-appearance-change', (evt) => chart.updateOptions(optionsFn(evt.detail)));

    if (tabpanel) tabpanel.addEventListener('on-hs-appearance-change', (evt) => chart.updateOptions(optionsFn(evt.detail)));
}

return chart;
}

const DonutChart = () => {
    useEffect(() => {
      (function () {
        buildChart('#hs-donut-chart1', () => ({
          colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
          chart: {
            height: 300,
            width: 300,
            type: 'donut',
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: '76%',
              },
            },
          },
          series: [36, 23,11, 30],
          labels: ['Tailwind CSS', 'Preline UI','MUI' ,'Others'],
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            width: 5,
            colors: ["transparent"],
            lineCap: "",
          },
          grid: {
            padding: {
              top: -12,
              bottom: -11,
              left: -12,
              right: -12,
            },
          },
          states: {
            hover: {
              filter: {
                type: 'none',
              },
            },
          },
        }), {
          colors: ['#3b82f6', '#22d3ee', '#e5e7eb'],
          stroke: {
            colors: ['rgb(255, 255, 255)'],
          },
        }, {
          colors: ['#e5e7eb', '#3b82f6', '#22d3ee'],
          stroke: {
            colors: ['rgb(38, 38, 38)'],
          },
        });
      })();
    }, []);
  
    return (
      <div className="flex flex-col justify-center items-center">
        <div
          id="hs-donut-chart1"></div>
      
      </div>
    );
  };

export default DonutChart;