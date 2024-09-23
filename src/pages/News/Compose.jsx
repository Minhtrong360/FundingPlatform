import React from "react";
import { Table } from "antd";

// Define the data structure
const columns = [
  {
    title: " ",
    dataIndex: "name",
    render: (text, record, index) => ({
      children: (
        <button
          style={{ fontWeight: index === 0 || index === 3 ? "bold" : "normal" }}
        >
          {text}
        </button>
      ),
      props: {
        colSpan: index === 0 || index === 3 ? 5 : 1,
      },
    }),
  },
  {
    title: "Age",
    dataIndex: "age",
    onCell: (_, index) => {
      // In the fifth row, other columns are merged into the first column
      if (index === 0 || index === 3) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: "Home phone",
    colSpan: 2,
    dataIndex: "tel",
    onCell: (_, index) => {
      if (index === 0 || index === 3) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: "Phone",
    colSpan: 0,
    dataIndex: "phone",
    onCell: (_, index) => {
      // In the fifth row, other columns are merged into the first column
      if (index === 0 || index === 3) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    onCell: (_, index) => {
      // In the fifth row, other columns are merged into the first column
      if (index === 0 || index === 3) {
        return { colSpan: 0 };
      }
      return {};
    },
  },
];

// Define the data
const data = [
  {
    key: "1",
    name: "Short term",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    tel: "0571-22098333",
    phone: 18889898888,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Long term",
  },
  {
    key: "5",
    name: "Jake White",
    age: 18,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "Dublin No. 2 Lake Park",
  },
  {
    key: "6",
    name: "Jim Red",
    age: 32,
    tel: "0575-22098909",
    phone: 18900010002,
    address: "London No. 2 Lake Park",
  },
];

// Define the App component
const Post = () => (
  <div className=" m-10 flex justify-center overflow-auto">
    <Table columns={columns} dataSource={data} bordered />
  </div>
);

export default Post;
