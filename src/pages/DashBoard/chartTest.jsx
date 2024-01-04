import React, { useState } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import Chart from 'react-apexcharts';

const LineChartForm = () => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: 'line-chart',
      },
    },
    series: [{
      name: 'Series 1',
      data: [],
    }],
  });

  const onFinish = (values) => {
    const { dateRange, dataPoints } = values;
    const dates = dateRange.map(date => date.format('YYYY-MM-DD'));
    
    setChartData({
      options: {
        chart: {
          id: 'line-chart',
        },
        xaxis: {
          categories: dates,
        },
      },
      series: [{
        name: 'Series 1',
        data: dataPoints.map(Number),
      }],
    });
  };

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[
            {
              required: true,
              message: 'Please select a date range',
            },
          ]}
        >
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item
          label="Data Points"
          name="dataPoints"
          rules={[
            {
              required: true,
              message: 'Please enter data points',
            },
          ]}
        >
          <Input.TextArea placeholder="Enter data points, separated by commas" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Generate Chart
          </Button>
        </Form.Item>
      </Form>

      <div>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default LineChartForm;
