import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { useSelector } from "react-redux";

const DraggableChart = ({ data, onDataChange, beginMonth, endMonth }) => {
  const chartRef = useRef(null);

  const { startMonth, startYear } = useSelector(
    (state) => state.durationSelect
  );

  useEffect(() => {
    let chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0;

    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const filteredData = data.filter((item) => {
      const monthNumber = parseInt(item.month.replace("Month ", ""), 10);
      return monthNumber >= beginMonth && monthNumber <= endMonth;
    });

    chart.data = filteredData.map((item) => ({
      ...item,
      customers: parseFloat(item.customers),
      month: item.month,
      formattedMonth: (() => {
        const monthNumber = parseInt(item.month.replace("Month ", ""), 10);
        const monthIndex = (startMonth + monthNumber - 2) % 12;
        const year =
          startYear + Math.floor((startMonth + monthNumber - 2) / 12);
        return `${months[monthIndex]}/${year}`;
      })(),
    }));

    chart.padding(40, 40, 0, 0);
    chart.maskBullets = false;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "formattedMonth";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.labels.template.fontSize = 12; // Giảm kích thước font chữ trục X

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.strictMinMax = true;
    valueAxis.min = 0;
    valueAxis.renderer.minWidth = 60;
    valueAxis.renderer.labels.template.fontSize = 12; // Giảm kích thước font chữ trục Y

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "formattedMonth";
    series.dataFields.valueY = "customers";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = -8;
    series.defaultState.interpolationDuration = 0;
    series.sequencedInterpolation = false;
    series.columns.template.strokeOpacity = 0;

    var labelBullet = new am4charts.LabelBullet();
    series.bullets.push(labelBullet);
    labelBullet.label.text = "{valueY.value.formatNumber('#.')}";
    labelBullet.strokeOpacity = 0;
    labelBullet.stroke = am4core.color("#dadada");
    labelBullet.dy = -20;
    labelBullet.label.fontSize = 12; // Giảm kích thước font của các label trên cột

    var bullet = series.bullets.create();
    bullet.stroke = am4core.color("#ffffff");
    bullet.strokeWidth = 3;
    bullet.opacity = 1;
    bullet.defaultState.properties.opacity = 1;
    bullet.cursorOverStyle = am4core.MouseCursorStyle.verticalResize;
    bullet.draggable = true;

    var hoverState = bullet.states.create("hover");
    hoverState.properties.opacity = 1;

    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 8;

    bullet.events.on("drag", (event) => {
      handleDrag(event);
    });

    bullet.events.on("dragstop", (event) => {
      handleDragStop(event);
      var dataItem = event.target.dataItem;
      dataItem.column.isHover = false;
      event.target.isHover = false;
    });

    function handleDrag(event) {
      var dataItem = event.target.dataItem;
      var value = valueAxis.yToValue(event.target.pixelY);
      dataItem.valueY = value;
      dataItem.column.isHover = true;
      dataItem.column.hideTooltip(0);
      event.target.isHover = true;
    }

    function handleDragStop(event) {
      var dataItem = event.target.dataItem;
      var value = valueAxis.yToValue(event.target.pixelY);
      dataItem.valueY = value;
      dataItem.customers = value;
      dataItem.column.isHover = true;
      dataItem.column.hideTooltip(0);
      event.target.isHover = true;

      const newData = data.map((item) => {
        if (item.month === dataItem._dataContext.month) {
          return { ...item, customers: value };
        }
        return item;
      });
      onDataChange(newData);
    }

    var columnTemplate = series.columns.template;
    columnTemplate.column.cornerRadiusTopLeft = 8;
    columnTemplate.column.cornerRadiusTopRight = 8;
    columnTemplate.column.fillOpacity = 0.8;
    columnTemplate.tooltipText = "{categoryX}";
    columnTemplate.tooltipY = 0;

    var columnHoverState = columnTemplate.column.states.create("hover");
    columnHoverState.properties.fillOpacity = 1;
    columnHoverState.properties.cornerRadiusTopLeft = 35;
    columnHoverState.properties.cornerRadiusTopRight = 35;

    columnTemplate.events.on("over", (event) => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.isHover = true;
    });

    columnTemplate.events.on("out", (event) => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.isHover = false;
    });

    columnTemplate.events.on("down", (event) => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.dragStart(event.pointer);
    });

    columnTemplate.events.on("positionchanged", (event) => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);

      var column = dataItem.column;
      itemBullet.minX = column.pixelX + column.pixelWidth / 2;
      itemBullet.maxX = itemBullet.minX;
      itemBullet.minY = -Number.MAX_SAFE_INTEGER; // Allows dragging above the chart
      itemBullet.maxY = Number.MAX_SAFE_INTEGER; // Allows dragging below the chart
    });

    columnTemplate.adapter.add("fill", (fill, target) => {
      const colors = ["#00A2FF"];
      return am4core.color(colors[target.dataItem.index % colors.length]);
    });

    bullet.adapter.add("fill", (fill, target) => {
      const colors = ["#00A2FF"];
      return am4core.color(colors[target.dataItem.index % colors.length]);
    });

    bullet.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
    });

    // Dispose the chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, [data, onDataChange, beginMonth, endMonth, startMonth, startYear]);

  return (
    <div
      id="chartdiv"
      ref={chartRef}
      style={{ width: "100%", height: "500px" }}
    ></div>
  );
};

export default DraggableChart;
