import React from "react";
import { Table } from "antd";

const CustomTable = ({ dataSource, columns, title }) => (
  <div className="my-8">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    <Table
      className="overflow-auto"
      size="small"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
    />
  </div>
);

export default CustomTable;
