import React, { useState, useEffect } from "react";

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

  function buildTooltip(props, options) {
    const {
      title,
      mode,
      valuePrefix = '$',
      isValueDivided = true,
      valuePostfix = '',
      hasTextLabel = false,
      invertGroup = false,
      labelDivider = '',
      wrapperClasses = 'ms-0.5 mb-2 bg-white border border-gray-200 text-gray-800 rounded-lg shadow-md dark:bg-neutral-800 dark:border-neutral-700',
      wrapperExtClasses = '',
      seriesClasses = 'text-[12px]',
      seriesExtClasses = '',
      titleClasses = 'font-semibold !text-sm !bg-white !border-gray-200 text-gray-800 rounded-t-lg dark:!bg-neutral-800 dark:!border-neutral-700 dark:text-neutral-200',
      titleExtClasses = '',
      markerClasses = '!w-2.5 !h-2.5 !me-1.5',
      markerExtClasses = '!rounded-sm',
      valueClasses = '!font-medium text-gray-500 !ms-auto dark:text-neutral-400',
      valueExtClasses = '',
      labelClasses = 'text-gray-500 dark:text-neutral-400',
      labelExtClasses = ''
    } = options;
    const { dataPointIndex } = props;
    const { colors } = props.ctx.opts;
    const series = props.ctx.opts.series;
    let seriesGroups = '';
  
    series.forEach((single, i) => {
      const val = props.series[i][dataPointIndex] || (typeof series[i].data[dataPointIndex] !== 'object' ? series[i].data[dataPointIndex] : props.series[i][dataPointIndex]);
      const label = series[i].name;
      const groupData = invertGroup ? {
        left: `${hasTextLabel ? label : ''}${labelDivider}`,
        right: `${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}`
      } : {
        left: `${valuePrefix}${val >= 1000 && isValueDivided ? `${val / 1000}k` : val}${valuePostfix}`,
        right: `${hasTextLabel ? label : ''}${labelDivider}`
      }
      const labelMarkup = `<span class="apexcharts-tooltip-text-y-label ${labelClasses} ${labelExtClasses}">${groupData.left}</span>`;
  
      seriesGroups += `<div class="apexcharts-tooltip-series-group !flex ${hasTextLabel ? '!justify-between' : ''} order-${i + 1} ${seriesClasses} ${seriesExtClasses}">
        <span class="flex items-center">
          <span class="apexcharts-tooltip-marker ${markerClasses} ${markerExtClasses}" style="background: ${colors[i]}"></span>
          <div class="apexcharts-tooltip-text">
            <div class="apexcharts-tooltip-y-group !py-0.5">
              <span class="apexcharts-tooltip-text-y-value ${valueClasses} ${valueExtClasses}">${groupData.right}</span>
            </div>
          </div>
        </span>
        ${labelMarkup}
      </div>`
    });
  
    return `<div class="${mode === 'dark' ? 'dark ' : ''}${wrapperClasses} ${wrapperExtClasses}">
      <div class="apexcharts-tooltip-title ${titleClasses} ${titleExtClasses}">${title}</div>
      ${seriesGroups}
    </div>`;
  }
  

const BarChart1 = () => {
    useEffect(() => {
      (function () {
        buildChart('#hs-multiple-bar-charts', (mode) => ({
          colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
          chart: {
            type: 'bar',
            height: 300,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: true
            }
          },
         
          series: [
            {
              name: 'Income',
              data: [23000, 44000, 55000, 57000, 56000]
            }, {
              name: 'Outcome',
              data: [17000, 76000, 85000, 101000, 98000]
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '60%',
              borderRadius: 0
            }
          },
          legend: {
            show: false
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 8,
            colors: ['transparent']
          },
          xaxis: {
            categories: [
              'January',
              'February',
              'March',
              'April',
              'May',
             
            ],
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              show: false
            },
            labels: {
              style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
              },
              offsetX: -2,
              formatter: (title) => title.slice(0, 3)
            }
          },
          yaxis: {
            labels: {
              align: 'left',
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
              },
              formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
            }
          },
          states: {
            hover: {
              filter: {
                type: 'darken',
                value: 0.9
              }
            }
          },
          tooltip: {
            y: {
              formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`
            },
            custom: function (props) {
              const { categories } = props.ctx.opts.xaxis;
              const { dataPointIndex } = props;
              const title = categories[dataPointIndex];
              const newTitle = `${title}`;
    
              return buildTooltip(props, {
                title: newTitle,
                mode,
                hasTextLabel: true,
                wrapperExtClasses: 'min-w-[120px]',
                labelDivider: ':',
                labelExtClasses: 'ms-2'
              });
            }
          },
          responsive: [{
            breakpoint: 568,
            options: {
              chart: {
                height: 300
              },
              plotOptions: {
                bar: {
                  columnWidth: '14px'
                }
              },
              stroke: {
                width: 8
              },
              labels: {
                style: {
                  colors: '#9ca3af',
                  fontSize: '11px',
                  fontFamily: 'Inter, ui-sans-serif',
                  fontWeight: 400
                },
                offsetX: -2,
                formatter: (title) => title.slice(0, 3)
              },
              yaxis: {
                labels: {
                  align: 'left',
                  minWidth: 0,
                  maxWidth: 140,
                  style: {
                    colors: '#9ca3af',
                    fontSize: '11px',
                    fontFamily: 'Inter, ui-sans-serif',
                    fontWeight: 400
                  },
                  formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
                }
              },
            },
          }]
        }), {
          colors: ['#2563eb', '#d1d5db'],
          grid: {
            borderColor: '#e5e7eb'
          }
        }, {
          colors: ['#6b7280', '#2563eb'],
          grid: {
            borderColor: '#374151'
          }
        });
      })();
    }, []);
    
  
    return (
      <div id="hs-multiple-bar-charts">
      </div>
    );
  };