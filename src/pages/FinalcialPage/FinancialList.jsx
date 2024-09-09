import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { PlusIcon, SearchIcon } from "lucide-react";
import { message, Modal, Tooltip } from "antd";
import InputField from "../../components/InputField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import HomeHeader from "../../components/Section/Common/Header/HomeHeader";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  getCurrencyLabelByKey,
} from "../../features/DurationSlice";
import { formatNumber } from "../../features/CostSlice";

function FinancialList() {
  const { user } = useAuth();
  const [finances, setFinances] = useState([]);
  const [updatedFinances, setUpdatedFinances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("my-finances");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);

  const [SelectedID, setSelectedID] = useState();
  const [email, setEmail] = useState("elonmusk@gmail.com");
  const [inviteEmail, setInviteEmail] = useState("elonmusk@gmail.com");
  const [name, setName] = useState("");

  const [invited_type, setInvited_type] = useState("View only");

  useEffect(() => {
    const loadFinances = async () => {
      const { data: projects1, error: error1 } = await supabase
        .from("finance")
        .select("*")
        .eq("user_id", user.id);

      const { data: projects2, error: error2 } = await supabase
        .from("finance")
        .select("*")
        .contains("collabs", [user.email]);

      const { data: projects3, error: error3 } = await supabase
        .from("finance")
        .select("*")
        .contains("invited_user", [user.email]);

      const combinedProjects = [...projects1, ...projects2, ...projects3];

      const transformedData = combinedProjects.map((item) => ({
        ...item,
        inputData: JSON.parse(item.inputData),
      }));

      const sortedProjects = [...transformedData].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });

      setUpdatedFinances(sortedProjects);
    };

    if (user) {
      loadFinances();
    }
  }, [user]);

  const myFinances = updatedFinances.filter(
    (finance) => finance.user_id === user.id
  );
  const sharedFinances = updatedFinances.filter(
    (finance) => finance.user_id !== user.id
  );

  const filteredFinances = (
    activeTab === "my-finances" ? myFinances : sharedFinances
  ).filter(
    (finance) =>
      finance.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || finance.status?.toLowerCase() === statusFilter)
  );

  const handleDelete = async (financeId) => {
    setIsDeleteModalOpen(true);
    setSelectedID(financeId);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      const { error } = await supabase
        .from("finance")
        .delete()
        .eq("id", SelectedID);
      if (error) throw error;

      const updatedFinancesCopy = updatedFinances.filter(
        (finance) => finance.id !== SelectedID
      );
      setUpdatedFinances(updatedFinancesCopy);
      message.success("Deleted financial project.");
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleAssign = async (financeId) => {
    setIsAssignModalOpen(true);
    setSelectedID(financeId);
  };

  const handleConfirmAssign = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email);

      if (!userData?.length) {
        message.error(`User with email ${email} not found.`);
        return;
      }

      const userId = userData[0].id;
      const { error } = await supabase
        .from("finance")
        .update({ user_id: userId, user_email: email })
        .eq("id", SelectedID);

      if (error) throw error;

      const updatedFinancesCopy = updatedFinances.filter(
        (finance) => finance.id !== SelectedID
      );
      setUpdatedFinances(updatedFinancesCopy);
      message.success("Assigned project successfully.");
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsAssignModalOpen(false);
    }
  };

  const handleAddNew = () => {
    setIsAddNewModalOpen(true);
  };

  const handleConfirmAddNew = async () => {
    try {
      if (!name) {
        message.warning("Project name is required.");
        return;
      }

      const { data, error } = await supabase
        .from("finance")
        .insert([
          {
            name: name,
            user_id: user.id,
            user_email: user.email,
            inputData: { financialProjectName: name },
          },
        ])
        .select();
      if (error) throw error;

      setUpdatedFinances([data[0], ...updatedFinances]);
      message.success("Created financial project successfully.");
      setIsAddNewModalOpen(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleInvite = (financeId) => {
    setIsInviteModalOpen(true);
    setSelectedID(financeId);
  };

  const handleConfirmInvite = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: financeData, error } = await supabase
        .from("finance")
        .select("*")
        .eq("id", SelectedID)
        .single();

      if (error) throw error;

      const currentInvitedUsers = financeData.invited_user || [];
      const currentCollabs = financeData.collabs || [];

      if (
        invited_type === "View only" &&
        currentInvitedUsers.includes(inviteEmail)
      ) {
        message.warning(`User with email ${inviteEmail} is already invited.`);
        return;
      }

      if (
        invited_type === "Collaborate" &&
        currentCollabs.includes(inviteEmail)
      ) {
        message.warning(
          `User with email ${inviteEmail} is already a collaborator.`
        );
        return;
      }

      if (invited_type === "View only") {
        currentInvitedUsers.push(inviteEmail);
      } else {
        currentCollabs.push(inviteEmail);
      }

      const updateData =
        invited_type === "View only"
          ? { invited_user: currentInvitedUsers }
          : { collabs: currentCollabs };

      const { error: updateError } = await supabase
        .from("finance")
        .update(updateData)
        .eq("id", SelectedID);

      if (updateError) throw updateError;

      message.success("Invited user successfully.");
      setIsInviteModalOpen(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const navigate = useNavigate();
  const handleProjectClick = async (finance) => {
    navigate(`/financials/${finance.id}`);
  };

  return (
    <>
      <HomeHeader />
      <div className="mt-24 sm:p-4 p-0 border-gray-300 border-dashed rounded-md darkBorderGray">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center -tracking-normal">
            Financial Projects Dashboard
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid sm:w-[50%] w-full grid-cols-2 bg-gray-50 mb-4">
              <TabsTrigger
                value="my-finances"
                className="data-[state=active]:bg-white data-[state=active]:text-black w-full mx-auto rounded-md text-gray-800"
              >
                My Financials
              </TabsTrigger>
              <TabsTrigger
                value="shared-finances"
                className="data-[state=active]:bg-white data-[state=active]:text-black w-full mx-auto rounded-md text-gray-800"
              >
                Shared Financials
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-finances">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Financial Projects</h2>
                <Button
                  onClick={handleAddNew}
                  className="!text-white bg-blue-600"
                >
                  <PlusIcon className="mr-1" />
                  Add new
                </Button>
              </div>
              {renderContent()}
            </TabsContent>
            <TabsContent value="shared-finances">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Shared Financial Projects
                </h2>
                <Button
                  onClick={handleAddNew}
                  className="!text-white bg-blue-600"
                  style={{ visibility: "hidden" }}
                >
                  <PlusIcon className="mr-1" />
                  Add new
                </Button>
              </div>
              {renderContent()}
            </TabsContent>
          </Tabs>

          {isDeleteModalOpen && (
            <Modal
              title="Confirm Delete"
              open={isDeleteModalOpen}
              onOk={handleConfirmDelete}
              onCancel={() => setIsDeleteModalOpen(false)}
              okText="Delete"
              cancelText="Cancel"
              centered
            >
              Are you sure you want to delete this project?
            </Modal>
          )}

          {isAssignModalOpen && (
            <Modal
              title="Assign Financial Project"
              open={isAssignModalOpen}
              onOk={handleConfirmAssign}
              onCancel={() => setIsAssignModalOpen(false)}
              okText="Assign"
              cancelText="Cancel"
              centered
            >
              <InputField
                label="Assign this project to:"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                required
              />
            </Modal>
          )}

          {isAddNewModalOpen && (
            <Modal
              title="Add new financial project"
              open={isAddNewModalOpen}
              onOk={handleConfirmAddNew}
              onCancel={() => setIsAddNewModalOpen(false)}
              okText="Create"
              cancelText="Cancel"
            >
              <InputField
                label="Financial project name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
            </Modal>
          )}

          {isInviteModalOpen && (
            <Modal
              title="Invite user"
              open={isInviteModalOpen}
              onOk={handleConfirmInvite}
              onCancel={() => setIsInviteModalOpen(false)}
              okText="Invite"
              cancelText="Cancel"
              centered
            >
              <InputField
                label="Invite this email to watch/collaborate"
                id="inviteEmail"
                name="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="text"
                required
              />
              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="invitedType"
                    value="View only"
                    checked={invited_type === "View only"}
                    onChange={() => setInvited_type("View only")}
                  />
                  <span className="ml-2 text-gray-700 text-sm">View only</span>
                </label>

                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    name="invitedType"
                    value="Collaborate"
                    checked={invited_type === "Collaborate"}
                    onChange={() => setInvited_type("Collaborate")}
                  />
                  <span className="ml-2 text-gray-700 text-sm">
                    Collaborate
                  </span>
                </label>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </>
  );

  function renderContent() {
    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              className="!pl-10 !h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Start Year</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Action/Roles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFinances.map((finance, index) => (
                <TableRow key={finance.id}>
                  <TableCell
                    className="hover:cursor-pointer whitespace-nowrap"
                    onClick={() => handleProjectClick(finance)}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="hover:cursor-pointer whitespace-nowrap"
                    onClick={() => handleProjectClick(finance)}
                  >
                    {finance.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(finance.created_at)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {finance.user_email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {finance?.inputData?.industry || "Waiting for setup"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {finance?.inputData?.selectedDuration ||
                      "Waiting for setup"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {finance?.inputData?.startMonth &&
                    finance?.inputData?.startYear ? (
                      <>
                        {finance?.inputData?.startMonth < 10
                          ? `0${finance?.inputData?.startMonth}`
                          : finance?.inputData?.startMonth}{" "}
                        - {finance?.inputData?.startYear}
                      </>
                    ) : (
                      "Waiting for setup"
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Tooltip title="Customer of 1st year">
                      {finance?.inputData?.yearlyAverageCustomers
                        ? formatNumber(
                            finance?.inputData?.yearlyAverageCustomers[0]
                          )
                        : "Waiting for setup"}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Tooltip title="Revenue of 1st year">
                      {finance?.inputData?.yearlySales
                        ? `${getCurrencyLabelByKey(
                            finance?.inputData?.currency
                          )}${formatNumber(finance?.inputData?.yearlySales[0])}`
                        : "Waiting for setup"}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Action
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white" align="end">
                        <DropdownMenuItem
                          onClick={() => handleAssign(finance.id)}
                        >
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleInvite(finance.id)}
                        >
                          Invite
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(finance.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  }
}

export default FinancialList;
