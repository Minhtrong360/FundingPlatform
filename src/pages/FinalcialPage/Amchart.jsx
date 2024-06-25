import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const DraggableChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Create chart instance
    let chart = am4core.create(chartRef.current, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [
      { country: "USA", visits: 3025 },
      { country: "China", visits: 1882 },
      { country: "Japan", visits: 1809 },
      { country: "Germany", visits: 1322 },
      { country: "UK", visits: 1122 },
      { country: "France", visits: 1114 },
      { country: "India", visits: 984 },
      { country: "Spain", visits: 711 },
      { country: "Netherlands", visits: 665 },
      { country: "Russia", visits: 580 },
      { country: "South Korea", visits: 443 },
      { country: "Canada", visits: 441 }
    ];

    chart.padding(40, 40, 0, 0);
    chart.maskBullets = true; // allow bullets to go out of plot area

    var text = chart.plotContainer.createChild(am4core.Label);
    text.text = "";
    text.y = 92;
    text.x = am4core.percent(100);
    text.horizontalCenter = "right";
    text.zIndex = 100;
    text.fillOpacity = 0.7;

    // category axis
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 50;

    // value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.strictMinMax = true;
    valueAxis.min = 0;
    valueAxis.max = 3400;
    valueAxis.renderer.minWidth = 60;

    // series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "visits";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.dy = -8;
    series.sequencedInterpolation = true;
    series.defaultState.interpolationDuration = 1500;
    series.columns.template.strokeOpacity = 0;

    // label bullet
    var labelBullet = new am4charts.LabelBullet();
    series.bullets.push(labelBullet);
    labelBullet.label.text = "{valueY.value.formatNumber('#.')}";
    labelBullet.strokeOpacity = 0;
    labelBullet.stroke = am4core.color("#dadada");
    labelBullet.dy = -20;

    // series bullet
    var bullet = series.bullets.create();
    bullet.stroke = am4core.color("#ffffff");
    bullet.strokeWidth = 3;
    bullet.opacity = 1; // initially invisible
    bullet.defaultState.properties.opacity = 1;
    bullet.cursorOverStyle = am4core.MouseCursorStyle.verticalResize;
    bullet.draggable = true;

    // create hover state
    var hoverState = bullet.states.create("hover");
    hoverState.properties.opacity = 1; // visible when hovered

    // add circle sprite to bullet
    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 8;

    // while dragging
    bullet.events.on("drag", event => {
      handleDrag(event);
    });

    bullet.events.on("dragstop", event => {
      handleDrag(event);
      var dataItem = event.target.dataItem;
      dataItem.column.isHover = false;
      event.target.isHover = false;
    });

    function handleDrag(event) {
      var dataItem = event.target.dataItem;
      var value = valueAxis.yToValue(event.target.pixelY);
      dataItem.valueY = value;
      console.log(`Country: ${dataItem.categoryX}, New Value: ${value}`);
      dataItem.column.isHover = true;
      dataItem.column.hideTooltip(0);
      event.target.isHover = true;
    }

    // column template
    var columnTemplate = series.columns.template;
    columnTemplate.column.cornerRadiusTopLeft = 8;
    columnTemplate.column.cornerRadiusTopRight = 8;
    columnTemplate.column.fillOpacity = 0.8;
    columnTemplate.tooltipText = "drag me";
    columnTemplate.tooltipY = 0;

    // hover state
    var columnHoverState = columnTemplate.column.states.create("hover");
    columnHoverState.properties.fillOpacity = 1;
    columnHoverState.properties.cornerRadiusTopLeft = 35;
    columnHoverState.properties.cornerRadiusTopRight = 35;

    // show bullet when hovered
    columnTemplate.events.on("over", event => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.isHover = true;
    });

    // hide bullet when mouse is out
    columnTemplate.events.on("out", event => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.isHover = false;
    });

    // start dragging bullet even if we hit on column not just a bullet
    columnTemplate.events.on("down", event => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);
      itemBullet.dragStart(event.pointer);
    });

    // when columns position changes, adjust minX/maxX of bullets so that we could only drag vertically
    columnTemplate.events.on("positionchanged", event => {
      var dataItem = event.target.dataItem;
      var itemBullet = dataItem.bullets.getKey(bullet.uid);

      var column = dataItem.column;
      itemBullet.minX = column.pixelX + column.pixelWidth / 2;
      itemBullet.maxX = itemBullet.minX;
      itemBullet.minY = 0;
      itemBullet.maxY = chart.seriesContainer.pixelHeight;
    });

    // set color adapter
    columnTemplate.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
    });

    bullet.adapter.add("fill", (fill, target) => {
      return chart.colors.getIndex(target.dataItem.index).saturate(0.3);
    });

    // Clean up chart when component unmounts
    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="chartdiv" ref={chartRef} style={{ width: "100%", height: "500px" }}></div>;
};

export default DraggableChart;
