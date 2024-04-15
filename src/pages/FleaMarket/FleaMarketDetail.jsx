import { Button, Modal, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import { formatNumber } from "../../features/CostSlice";

export default function FleaMarketDetail({
  isDetailModalOpen,
  setIsDetailModalOpen,
  SelectedID,
  setSelectedID,
}) {
  const handleCancel = () => {
    setSelectedID("");
    setIsDetailModalOpen(false);
  };

  const [fleaMarketData, setFleaMarketData] = useState("");

  useEffect(() => {
    const fetchFleaMarketData = async () => {
      try {
        const { data: fleaMarketData, error } = await supabase
          .from("fleamarket")
          .select("*")
          .eq("id", SelectedID)
          .single();
        if (error) {
          throw error;
        }

        setFleaMarketData(fleaMarketData);
      } catch (error) {
        console.error("Error fetching Flea Market data:", error.message);
      }
    };

    if (SelectedID) {
      fetchFleaMarketData();
    }
  }, [SelectedID]);

  const [showContactDetails, setShowContactDetails] = useState(false);
  const handleSubmit = () => {
    setShowContactDetails((prevShowContactDetails) => !prevShowContactDetails);
  };

  const handleOpenClick = (link) => {
    window.open(link, "_blank");
  };

  return (
    <Modal
      title="Flea-Market project detail"
      visible={isDetailModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={showContactDetails ? "Hide" : "Contact"}
      cancelText="Cancel"
      cancelButtonProps={{
        style: {
          borderRadius: "0.375rem",
          cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
        },
      }}
      okButtonProps={{
        style: {
          background: "#2563EB",
          borderColor: "#2563EB",

          color: "#fff",
          borderRadius: "0.375rem",
          cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
        },
      }}
      centered={true}
    >
      <div
        key="1"
        className="bg-white p-6 mx-auto rounded-lg shadow-md max-w-md relative"
      >
        <img
          alt="Company logo"
          className="w-full h-auto rounded-lg mb-6 relative"
          src={fleaMarketData.companyLogo}
          style={{
            aspectRatio: "16/9",
            objectFit: "cover",
          }}
        />
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {fleaMarketData.name}
          </h1>
          {/* <p className="text-gray-500 text-center">
            New standard in coffee: Specialty coffee brewed like tea in a...
          </p> */}
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Number of Shares: {formatNumber(fleaMarketData.shares)}
              </span>
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Price per shares: {formatNumber(fleaMarketData.price)}
              </span>
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Amount invested: {formatNumber(fleaMarketData.amountInvested)}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mt-4">
              <span className="text-gray-500">Indicative valuation</span>
              <span className="text-gray-900 font-bold">
                ${fleaMarketData.total}
              </span>
            </div>
          </div>
          <div className="w-full">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Company Info
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-gray-600">Legal name</p>
                <p className="text-gray-900 font-semibold">
                  {fleaMarketData.company}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Industry</p>
                <p className="text-gray-900 font-semibold">
                  {fleaMarketData.industry}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Proof documents</p>
                <p
                  className="text-gray-900 font-semibold truncate hover:cursor-pointer"
                  onClick={() => handleOpenClick(fleaMarketData?.proof)}
                >
                  {fleaMarketData?.proof
                    ? fleaMarketData?.proof
                    : "No document"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Website</p>
                <Link
                  className="text-blue-600 truncate"
                  onClick={() => handleOpenClick(fleaMarketData?.website)}
                >
                  {fleaMarketData?.website
                    ? fleaMarketData?.website
                        .replace(/^(https?:\/\/)?(www\.)?/i, "")
                        .replace(/^(http?:\/\/)?(www\.)?/i, "")
                        .replace(/\/+$/, "")
                    : "beekrowd.com"}
                </Link>
              </div>

              <div className={`text-center `}>
                <p className="text-gray-600">Owner email</p>
                {showContactDetails ? (
                  <Tooltip title={fleaMarketData?.email}>
                    <p
                      className={`text-gray-900 font-semibold truncate hover:cursor-pointer opacity-100`}
                    >
                      {fleaMarketData?.email
                        ? fleaMarketData?.email
                        : "No detail"}
                    </p>
                  </Tooltip>
                ) : (
                  <p
                    className={`text-gray-900 font-semibold truncate hover:cursor-pointer opacity-25 blur-sm`}
                  >
                    {fleaMarketData?.email
                      ? fleaMarketData?.email
                      : "No detail"}
                  </p>
                )}
              </div>

              <div className={`text-center `}>
                <p className="text-gray-600">Owner phone</p>
                {showContactDetails ? (
                  <Tooltip title={fleaMarketData?.phone}>
                    <p
                      className={`text-gray-900 font-semibold truncate hover:cursor-pointer opacity-100`}
                    >
                      {fleaMarketData?.phone
                        ? fleaMarketData?.phone
                        : "No detail"}
                    </p>
                  </Tooltip>
                ) : (
                  <p
                    className={`text-gray-900 font-semibold truncate hover:cursor-pointer opacity-25 blur-sm`}
                  >
                    {fleaMarketData?.phone
                      ? fleaMarketData?.phone
                      : "No detail"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
