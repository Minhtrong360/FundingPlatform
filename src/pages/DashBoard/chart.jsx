import React, { useEffect } from "react";
import ApexCharts from "apexcharts";
import _ from "lodash";

function buildTooltip(props, options) {
  const {
    title,
    mode,
    valuePrefix = "$",
    isValueDivided = true,
    valuePostfix = "",
    hasTextLabel = false,
    invertGroup = false,
    labelDivider = "",
    wrapperClasses = "ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700",
    wrapperExtClasses = "",
    seriesClasses = "text-[12px]",
    seriesExtClasses = "",
    titleClasses = "font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200",
    titleExtClasses = "",
    markerClasses = "!w-2.5 !h-2.5 !me-1.5",
    markerExtClasses = "!rounded-sm",
    valueClasses = "!font-medium text-gray-500 !ms-auto dark:text-neutral-400",
    valueExtClasses = "",
    labelClasses = "text-gray-500 dark:text-neutral-400",
    labelExtClasses = "",
  } = options;
  const { dataPointIndex } = props;
  const { colors } = props.ctx.opts;
  const series = props.ctx.opts.series;
  let seriesGroups = "";

  series.forEach((single, i) => {
    const val =
      props.series[i][dataPointIndex] ||
      (typeof series[i].data[dataPointIndex] !== "object"
        ? series[i].data[dataPointIndex]
        : props.series[i][dataPointIndex]);
    const label = series[i].name;
    const groupData = invertGroup
      ? {
          left: `${hasTextLabel ? label : ""}${labelDivider}`,
          right: `${valuePrefix}${
            val >= 1000 && isValueDivided ? `${val / 1000}k` : val
          }${valuePostfix}`,
        }
      : {
          left: `${valuePrefix}${
            val >= 1000 && isValueDivided ? `${val / 1000}k` : val
          }${valuePostfix}`,
          right: `${hasTextLabel ? label : ""}${labelDivider}`,
        };
    const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${groupData.left}</span>`;

    seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${
      hasTextLabel ? "!justify-between" : ""
    } order-${i + 1} ${seriesClasses} ${seriesExtClasses}">
      <span class="flex items-center">
        <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${
      colors[i]
    }"></span>
        <div class="apexcharts-tooltip-text">
          <div class="apexcharts-tooltip-y-group !py-0.5">
            <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${
      groupData.right
    }</span>
          </div>
        </div>
      </span>
      ${labelMarkup}
    </div>`;
  });

  return `<div class="${
    mode === "dark" ? "dark " : ""
  }${wrapperClasses} ${wrapperExtClasses}">
    <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">${title}</div>
    ${seriesGroups}
  </div>`;
}
function buildChart(id, shared, light, dark) {
  const $chart = document.querySelector(id);
  let chart = null;

  if (!$chart) return false;

  const tabpanel = $chart.closest('[role="tabpanel"]');
  let modeFromBodyClass = null;

  Array.from(document.querySelector("html").classList).forEach((cl) => {
    if (["dark", "light", "default"].includes(cl)) modeFromBodyClass = cl;
  });

  const optionsFn = (
    mode = modeFromBodyClass || localStorage.getItem("hs_theme")
  ) => _.merge(shared(mode), mode === "dark" ? dark : light);

  if ($chart) {
    chart = new ApexCharts($chart, optionsFn());
    chart.render();

    window.addEventListener("on-hs-appearance-change", (evt) =>
      chart.updateOptions(optionsFn(evt.detail))
    );

    if (tabpanel)
      tabpanel.addEventListener("on-hs-appearance-change", (evt) =>
        chart.updateOptions(optionsFn(evt.detail))
      );
  }

  return chart;
}

// const Chart = ({ seriesName01,seriesName02,seriesData01,seriesData02, categories }) => {

//   useEffect(() => {
//     console.log("draw 1" )
//     const loadScript = () =>  {

//       // Dynamically create a script element
//       const script = document.createElement("script");
//       script.src = "https://preline.co/assets/js/hs-apexcharts-helpers.js";
//       script.async = true;
//       console.log("draw 2")
//       // Append the script element to the document body
//       document.body.appendChild(script);

//       // Event listener for script load
//       script.addEventListener("load", () => {
//         // Initialize ApexCharts inside this callback to ensure the script has loaded
//         (function () {
//           buildChart(
//             "#hs-multiple-area-charts",
//             (mode) => ({
//                colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
//               chart: {
//                 height: 300,
//                 type: "area",
//                 toolbar: {
//                   show: true,
//                 },
//                 zoom: {
//                   enabled: true,
//                 },
//               },
//               series:  [
//                 {
//                   name: seriesName01,
//                   data: seriesData01,
//                 },
//                 {
//                   name: seriesName02,
//                   data: seriesData02,
//                 },
//               ],
//               legend: {
//                 show: false,
//               },
//               dataLabels: {
//                 enabled: false,
//               },
//               stroke: {
//                 curve: "straight",
//                 width: 2,
//               },
//               grid: {
//                 strokeDashArray: 2,
//               },
//               fill: {
//                 type: "gradient",
//                 gradient: {
//                   type: "vertical",
//                   shadeIntensity: 1,
//                   opacityFrom: 0.1,
//                   opacityTo: 0.8,
//                 },
//               },
//               xaxis: {
//                 type: "category",
//                 tickPlacement: "on",
//                 categories: categories,
//                 axisBorder: {
//                   show: false,
//                 },
//                 axisTicks: {
//                   show: false,
//                 },
//                 crosshairs: {
//                   stroke: {
//                     dashArray: 0,
//                   },
//                   dropShadow: {
//                     show: false,
//                   },
//                 },
//                 tooltip: {
//                   enabled: false,
//                 },
//                 labels: {
//                   style: {
//                     colors: "#9ca3af",
//                     fontSize: "13px",
//                     fontFamily: "Inter, ui-sans-serif",
//                     fontWeight: 400,
//                   },
//                   formatter: (title) => {
//                     let t = title;

//                     if (t) {
//                       const newT = t.split(" ");
//                       t = `${newT[0]} ${newT[1]?.slice(0, 3)}`;
//                     }

//                     return t;
//                   },
//                 },
//               },
//               yaxis: {
//                 labels: {
//                   align: "left",
//                   minWidth: 0,
//                   maxWidth: 140,
//                   style: {
//                     colors: "#9ca3af",
//                     fontSize: "13px",
//                     fontFamily: "Inter, ui-sans-serif",
//                     fontWeight: 400,
//                   },
//                   formatter: (value) =>
//                     value >= 1000 ? `${value / 1000}k` : value,
//                 },
//               },
//               tooltip: {
//                 x: {
//                   format: "MMMM yyyy",
//                 },
//                 y: {
//                   formatter: (value) =>
//                     `$${value >= 1000 ? `${value / 1000}k` : value}`,
//                 },
//                 custom: function (props) {
//                   const { categories } = props.ctx.opts.xaxis;
//                   const { dataPointIndex } = props;
//                   const title = categories[dataPointIndex].split(" ");
//                   const newTitle = `${title[0]} ${title[1]}`;

//                   return buildTooltip(props, {
//                     title: newTitle,
//                     mode,
//                     hasTextLabel: true,
//                     wrapperExtClasses: "min-w-[120px]",
//                     labelDivider: ":",
//                     labelExtClasses: "ms-2",
//                   });
//                 },
//               },
//               responsive: [
//                 {
//                   breakpoint: 568,
//                   options: {
//                     chart: {
//                       height: 300,
//                     },
//                     labels: {
//                       style: {
//                         colors: "#9ca3af",
//                         fontSize: "11px",
//                         fontFamily: "Inter, ui-sans-serif",
//                         fontWeight: 400,
//                       },
//                       offsetX: -2,
//                       formatter: (title) => title?.slice(0, 3),
//                     },
//                     yaxis: {
//                       labels: {
//                         align: "left",
//                         minWidth: 0,
//                         maxWidth: 140,
//                         style: {
//                           colors: "#9ca3af",
//                           fontSize: "11px",
//                           fontFamily: "Inter, ui-sans-serif",
//                           fontWeight: 400,
//                         },
//                         formatter: (value) =>
//                           value >= 1000 ? `${value / 1000}k` : value,
//                       },
//                     },
//                   },
//                 },
//               ],
//             }),
//             {
//               colors: ["#2563eb", "#9333ea"],
//               fill: {
//                 gradient: {
//                   stops: [0, 90, 100],
//                 },
//               },
//               grid: {
//                 borderColor: "#e5e7eb",
//               },
//             },
//             {
//               colors: ["#3b82f6", "#a855f7"],
//               fill: {
//                 gradient: {
//                   stops: [100, 90, 0],
//                 },
//               },
//               grid: {
//                 borderColor: "#374151",
//               },
//             }
//           );
//         })();
//       });
//     };

//     // Call the function to load the script
//     loadScript();
//     console.log("draw 3")
//   }, [seriesData01,seriesData02,seriesName01,seriesName02]); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

//   return (
//     <div className="md:container md:mx-auto" >
//       {/* Legend Indicator */}
//       <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
//         <div className="inline-flex items-center">
//           <span className="w-2.5 h-2.5 inline-block bg-blue-600 rounded-sm me-2"></span>
//           <span className="text-[13px] text-gray-600 dark:text-neutral-400">
//             Income
//           </span>
//         </div>
//         <div className="inline-flex items-center">
//           <span className="w-2.5 h-2.5 inline-block bg-purple-600 rounded-sm me-2"></span>
//           <span className="text-[13px] text-gray-600 dark:text-neutral-400">
//             Outcome
//           </span>
//         </div>
//       </div>
//       {/* End Legend Indicator */}

//       {/* Container for the chart */}
//       <div id="hs-multiple-area-charts"></div>
//     </div>
//   );
// };

const Chart = ({ incomeData, outcomeData, xAxisCategories }) => {
  console.log("1");
  useEffect(() => {
    const loadScript = () => {
      console.log("2");
      const script = document.createElement("script");
      script.src = "https://preline.co/assets/js/hs-apexcharts-helpers.js";
      script.async = true;

      document.body.appendChild(script);

      script.addEventListener("load", () => {
        (function () {
          buildChart(
            "#hs-multiple-area-charts",
            (mode) => ({
              colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
              chart: {
                height: 300,
                type: "area",
                toolbar: {
                  show: true,
                },
                zoom: {
                  enabled: true,
                },
              },
              series: [
                {
                  name: "Income",
                  data: incomeData,
                },
                {
                  name: "Outcome",
                  data: outcomeData,
                },
              ],
              legend: {
                show: false,
              },
              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "straight",
                width: 2,
              },
              grid: {
                strokeDashArray: 2,
              },
              fill: {
                type: "gradient",
                gradient: {
                  type: "vertical",
                  shadeIntensity: 1,
                  opacityFrom: 0.1,
                  opacityTo: 0.8,
                },
              },
              xaxis: {
                type: "category",
                tickPlacement: "on",
                categories: xAxisCategories,
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
                crosshairs: {
                  stroke: {
                    dashArray: 0,
                  },
                  dropShadow: {
                    show: false,
                  },
                },
                tooltip: {
                  enabled: false,
                },
                labels: {
                  style: {
                    colors: "#9ca3af",
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  formatter: (title) => {
                    let t = title;

                    if (t) {
                      const newT = t.split(" ");
                      t = `${newT[0]} ${newT[1]?.slice(0, 3)}`;
                    }

                    return t;
                  },
                },
              },
              yaxis: {
                labels: {
                  align: "left",
                  minWidth: 0,
                  maxWidth: 140,
                  style: {
                    colors: "#9ca3af",
                    fontSize: "13px",
                    fontFamily: "Inter, ui-sans-serif",
                    fontWeight: 400,
                  },
                  formatter: (value) =>
                    value >= 1000 ? `${value / 1000}k` : value,
                },
              },
              tooltip: {
                x: {
                  format: "MMMM yyyy",
                },
                y: {
                  formatter: (value) =>
                    `$${value >= 1000 ? `${value / 1000}k` : value}`,
                },
                custom: function (props) {
                  const { categories } = props.ctx.opts.xaxis;
                  const { dataPointIndex } = props;
                  const title = categories[dataPointIndex].split(" ");
                  const newTitle = `${title[0]} ${title[1]}`;

                  return buildTooltip(props, {
                    title: newTitle,
                    mode,
                    hasTextLabel: true,
                    wrapperExtClasses: "min-w-[120px]",
                    labelDivider: ":",
                    labelExtClasses: "ms-2",
                  });
                },
              },
              responsive: [
                {
                  breakpoint: 568,
                  options: {
                    chart: {
                      height: 300,
                    },
                    labels: {
                      style: {
                        colors: "#9ca3af",
                        fontSize: "11px",
                        fontFamily: "Inter, ui-sans-serif",
                        fontWeight: 400,
                      },
                      offsetX: -2,
                      formatter: (title) => title?.slice(0, 3),
                    },
                    yaxis: {
                      labels: {
                        align: "left",
                        minWidth: 0,
                        maxWidth: 140,
                        style: {
                          colors: "#9ca3af",
                          fontSize: "11px",
                          fontFamily: "Inter, ui-sans-serif",
                          fontWeight: 400,
                        },
                        formatter: (value) =>
                          value >= 1000 ? `${value / 1000}k` : value,
                      },
                    },
                  },
                },
              ],
            }),
            {
              colors: ["#2563eb", "#9333ea"],
              fill: {
                gradient: {
                  stops: [0, 90, 100],
                },
              },
              grid: {
                borderColor: "#e5e7eb",
              },
            },
            {
              colors: ["#3b82f6", "#a855f7"],
              fill: {
                gradient: {
                  stops: [100, 90, 0],
                },
              },
              grid: {
                borderColor: "#374151",
              },
            }
          );
        })();
      });
    };

    loadScript();
    console.log("3");
  }, [incomeData, outcomeData, xAxisCategories]);

  return (
    <div className="md:container md:mx-auto">
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-blue-600 rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            Income
          </span>
        </div>
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-purple-600 rounded-sm me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            Outcome
          </span>
        </div>
      </div>
      <div id="hs-multiple-area-charts"></div>
    </div>
  );
};

export default Chart;
