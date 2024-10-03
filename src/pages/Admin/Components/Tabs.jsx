import {
  // Modal,
  Table,
  // DatePicker,
  // Input,
  // Button,
  // message,
  // Dropdown,
  // Menu,
} from "antd";
import React from "react";
import Dashboard from "./Dashboard";
import {
  Tabs as TabsUi,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { PlusIcon } from "lucide-react";
// import { supabase } from "../../../supabase";
// import { formatDate } from "../../../features/DurationSlice";
// import { PlusOutlined } from "@ant-design/icons";
// import moment from "moment";

function Tabs({
  activeTab,
  setIsSidebarOpen,
  handleTabChange,
  columns,
  dataSource,
  filteredData,
  financialColumns,
  dataFinanceSource,
  clientColumns,
  dataClientSource,
  codeData,
  setCodeData,
  isLoading,
}) {
  return (
    <div
      className="p-4 sm:pl-0 sm:ml-16 ml-0 "
      onClick={() => setIsSidebarOpen(false)}
    >
      <div className="sm:container mx-auto border-gray-300 rounded-md darkBorderGray min-h-[96vh]">
        <h1 className="text-4xl text-center my-2 font-bold">Admin Dashboard</h1>

        <TabsUi
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full flex justify-center items-center mt-12"
        >
          <TabsList className="w-full bg-gray-50 mb-4 overflow-x-auto flex sm:grid sm:grid-cols-4 sm:min-h-full min-h-12 sm:justify-center justify-start">
            <TabsTrigger
              value="fundraising"
              className="data-[state=active]:bg-white data-[state=active]:text-black w-full text-center mx-auto rounded-md text-gray-800 whitespace-nowrap"
            >
              Fundraising profiles
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-white data-[state=active]:text-black w-full text-center mx-auto rounded-md text-gray-800 whitespace-nowrap"
            >
              Financial profiles
            </TabsTrigger>
            <TabsTrigger
              value="client"
              className="data-[state=active]:bg-white data-[state=active]:text-black w-full text-center mx-auto rounded-md text-gray-800 whitespace-nowrap"
            >
              Client profiles
            </TabsTrigger>
            <TabsTrigger
              value="adminChart"
              className="data-[state=active]:bg-white data-[state=active]:text-black w-full text-center mx-auto rounded-md text-gray-800 whitespace-nowrap"
            >
              Admin charts
            </TabsTrigger>
          </TabsList>
        </TabsUi>

        {activeTab === "fundraising" && (
          <main className="w-full min-h-[92.5vh]">
            <section className="mx-auto mt-14">
              <div className="flex flex-col mb-8">
                <h2 className="text-2xl font-semibold">
                  Fundraising profiles table
                </h2>
                <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                      position: ["bottomLeft"],
                    }}
                    rowKey="id"
                    size="small"
                    bordered
                    scroll={{
                      x: true,
                    }}
                    loading={isLoading}
                  />
                </div>
              </div>
            </section>
          </main>
        )}
        {activeTab === "financial" && (
          <section className="mx-auto mt-14">
            <div className="flex flex-col mb-8">
              {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg"> */}
              <h2 className="text-2xl font-semibold">
                Financial profiles table
              </h2>
              <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                <Table
                  className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white"
                  columns={financialColumns}
                  dataSource={dataFinanceSource}
                  pagination={{
                    position: ["bottomLeft"],
                  }}
                  rowKey="id"
                  size="small"
                  bordered
                  scroll={{
                    x: true,
                  }}
                  loading={isLoading}
                />
              </div>
              {/* </div>
                </div>
              </div> */}
            </div>
          </section>
        )}
        {activeTab === "client" && (
          <section className="mx-auto mt-14">
            <div className="flex flex-col mb-8">
              {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg"> */}
              <h2 className="text-2xl font-semibold">User listing table</h2>
              <div className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white">
                <Table
                  className="overflow-hidden overflow-x-scroll scrollbar-hide my-8 rounded-md bg-white"
                  columns={clientColumns}
                  dataSource={dataClientSource}
                  pagination={{
                    position: ["bottomLeft"],
                  }}
                  rowKey="id"
                  size="small"
                  bordered
                  scroll={{
                    x: true,
                  }}
                  loading={isLoading}
                />
              </div>
              {/* </div>
                </div>
              </div> */}
            </div>
          </section>
        )}
        {activeTab === "adminChart" && (
          <div className="w-full flex items-center justify-center mt-10">
            <Dashboard dataSource={dataSource} />
          </div>
        )}
        {/* {activeTab === "code" && (
          <section className="mx-auto mt-14">
            <div className="flex flex-col mb-8">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
                  <div className="flex justify-end mb-8">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setNewCode("");
                        setExpirationDate(null);
                        setIsAddNewModalOpen(true);
                      }}
                    >
                      Add new
                    </Button>
                  </div>
                  <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-lg">
                    <Table
                      columns={codeColumns}
                      dataSource={codeData}
                      pagination={{
                        position: ["bottomLeft"],
                      }}
                      rowKey="id"
                      size="small"
                      bordered
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )} */}

        {/* <Modal
zIndex={42424244}
          title="Add new Premium Code"
          open={isAddNewModalOpen}
          onOk={handleAddNewCode}
          onCancel={() => setIsAddNewModalOpen(false)}
          okText="Save"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          centered={true}
        >
          <div
            key="1"
            className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="code">Code</label>
                  <div className="flex items-center">
                    <Input
                      id="code"
                      placeholder="Enter your code"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="expired_at">Expired at</label>
                  <div className="flex items-center">
                    <DatePicker
                      id="expired_at"
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                      value={expirationDate}
                      onChange={(date) => setExpirationDate(date)}
                      style={{ width: "100%" }}
                      className="text-sm py-[7px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
zIndex={42424244}
          title="Edit Premium Code"
          open={isEditModalOpen}
          onOk={handleEditCode}
          onCancel={() => setIsEditModalOpen(false)}
          okText="Save"
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          okButtonProps={{
            style: {
              background: "#2563EB",
              borderColor: "#2563EB",
              color: "#fff",
              borderRadius: "0.375rem",
              cursor: "pointer",
            },
          }}
          centered={true}
        >
          <div
            key="2"
            className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <form className="grid gap-6 col-span-1 md:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="edit_code">Code</label>
                  <div className="flex items-center">
                    <Input
                      id="edit_code"
                      placeholder="Enter your code"
                      required
                      className="border-gray-300 rounded-md text-sm"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit_expired_at">Expired at</label>
                  <div className="flex items-center">
                    <DatePicker
                      id="edit_expired_at"
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                      value={expirationDate}
                      onChange={(date) => setExpirationDate(date)}
                      style={{ width: "100%" }}
                      className="text-sm py-[7px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>

        {isDeleteModalOpen && (
          <Modal
zIndex={42424244}
            title="Confirm Delete"
            open={isDeleteModalOpen}
            onOk={handleDeleteCode}
            onCancel={() => setIsDeleteModalOpen(false)}
            okText="Delete"
            cancelText="Cancel"
            cancelButtonProps={{
              style: {
                borderRadius: "0.375rem",
                cursor: "pointer",
              },
            }}
            okButtonProps={{
              style: {
                background: "#f5222d",
                borderColor: "#f5222d",
                color: "#fff",
                borderRadius: "0.375rem",
                cursor: "pointer",
              },
            }}
            centered={true}
          >
            Are you sure you want to delete it?
          </Modal>
        )} */}
      </div>
    </div>
  );
}

export default Tabs;
