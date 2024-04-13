import { useEffect, useState } from "react";
import { Avatar, Button, Modal, Row, Table, Tooltip, message } from "antd";
import SideBar from "../../components/SideBar";
import AlertMsg from "../../components/AlertMsg";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import FleaMarketForm from "./FleaMarketForm";
import Header from "../Home/Header";

function FleaMarketListAll() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

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

  const handleProjectClick = (fleaMarket) => {
    navigate(`/Flea-Market/${fleaMarket.id}`);
  };

  const columns = [
    {
      title: "Company name",
      dataIndex: "company",
      key: "company",
      render: (text, record) => (
        <Row align="middle">
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
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },

    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },
    {
      title: "Shares",
      dataIndex: "shares",
      key: "shares",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },

    {
      title: "Time Invested",
      dataIndex: "timeInvested",
      key: "timeInvested",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },
    {
      title: "Amount Invested",
      dataIndex: "amountInvested",
      key: "amountInvested",
      render: (text, record) => (
        <>
          <span
            className="hover:cursor-pointer"
            onClick={() => handleProjectClick(record)}
          >
            <div
              className="truncate"
              style={{ maxWidth: "100%" }}
              title={record.name}
            >
              {record.name}
            </div>
          </span>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-12">
      <Header />
      <div className="max-w-[85rem] px-3 py-2 sm:px-6 lg:px-8 lg:py-1 mx-auto mt-28">
        <div className="flex flex-col mb-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
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
    </div>
  );
}

export default FleaMarketListAll;
