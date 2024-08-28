import { useEffect, useState } from "react";
import { Avatar, Row, Table } from "antd";

import { UserOutlined } from "@ant-design/icons";
import { supabase } from "../../supabase";

import { formatNumber } from "../../features/CostSlice";
import FleaMarketDetail from "./FleaMarketDetail";
import Header from "../Home/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

function FleaMarketListAll() {
  const [fleaMarketData, setFleaMarketData] = useState([]);

  useEffect(() => {
    // Function to fetch Flea Market data from Supabase
    const fetchFleaMarketData = async () => {
      try {
        const { data, error } = await supabase.from("fleamarket").select("*");

        if (error) {
          throw error;
        }
        setFleaMarketData(data);
      } catch (error) {
        console.error("Error fetching Flea Market data:", error.message);
      }
    };

    // Call the function to fetch data when component mounts
    fetchFleaMarketData();
  }, []);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [SelectedID, setSelectedID] = useState("");
  const handleProjectClick = (fleaMarket) => {
    setSelectedID(fleaMarket.id);
    setIsDetailModalOpen(true);
  };

  const columns = [
    {
      title: "Company name",
      dataIndex: "company",
      key: "company",
      render: (text, record) => (
        <Row
          align="middle"
          className="hover:cursor-pointer"
          onClick={() => handleProjectClick(record)}
        >
          <Avatar
            shape="square"
            size={32}
            src={record.companyLogo ? record.companyLogo : null}
            icon={!record.companyLogo && <UserOutlined />}
          />
          <div
            className="ml-2 truncate"
            style={{ maxWidth: "100%" }}
            title={record.company}
          >
            {record.company}
          </div>
        </Row>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {record.country}
        </div>
      ),
    },

    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {record.industry}
        </div>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.price)}
        </div>
      ),
    },
    {
      title: "Shares",
      dataIndex: "shares",
      key: "shares",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.shares)}
        </div>
      ),
    },

    {
      title: "Time Invested",
      dataIndex: "timeInvested",
      key: "timeInvested",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {record.timeInvested}
        </div>
      ),
    },
    {
      title: "Amount Invested",
      dataIndex: "amountInvested",
      key: "amountInvested",
      render: (text, record) => (
        <div
          className="ml-2 truncate hover:cursor-pointer"
          style={{ maxWidth: "100%" }}
          onClick={() => handleProjectClick(record)}
        >
          {formatNumber(record.amountInvested)}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-12">
      {/* <HomeHeader /> */}
      <HomeHeader />
      <div className="max-w-[85rem] px-3 py-2 sm:px-6 lg:px-8 lg:py-1 mx-auto mt-28">
        <div className="flex flex-col mb-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                <Table
                  columns={columns}
                  dataSource={fleaMarketData}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  bordered
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDetailModalOpen && (
        <FleaMarketDetail
          isDetailModalOpen={isDetailModalOpen}
          setIsDetailModalOpen={setIsDetailModalOpen}
          SelectedID={SelectedID}
          setSelectedID={setSelectedID}
        />
      )}
    </div>
  );
}

export default FleaMarketListAll;
