import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import AddLinkFile from "./AddLinkFile";
import { useParams } from "react-router-dom";

import InvitedUserFile from "../../components/InvitedUserFile";
import apiService from "../../app/apiService";
import { message, Modal } from "antd";
import { Tooltip } from "antd";

function FilesList() {
  const { id } = useParams();
  const { user } = useAuth();
  const [projectLinks, setProjectLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null); // Thêm state để lưu ID của file sẽ bị xóa
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Thêm state để kiểm soát hiển thị của Modal

  const showDeleteModal = (fileId) => {
    setDeleteFileId(fileId);
    setIsDeleteModalVisible(true);
  };
  const handleDeleteModalOk = async () => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("user_id")
        .eq("id", deleteFileId)
        .single();

      if (fileError) {
        console.log("Error fetching file data:", fileError);
      } else {
        if (fileData.user_id === user.id) {
          const { error } = await supabase
            .from("files")
            .delete()
            .eq("id", deleteFileId);

          if (error) {
            console.log("Error deleting file:", error);
          } else {
            const updatedLinks = projectLinks.filter(
              (link) => link.id !== deleteFileId
            );
            setProjectLinks(updatedLinks);
          }
        } else {
          message.error("User does not have permission to delete this file.");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      message.error(error.message);
    }

    setIsDeleteModalVisible(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        let { data: files, error } = await supabase
          .from("files")
          .select("*")
          .filter("project_id", "eq", id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setProjectLinks(files);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    fetchFiles();
  }, [id]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false);
        if (error) {
          console.log(error);
        } else {
          setCurrentProject(data);
        }
      });
  }, [id]);

  const handleAddLinks = async (newLink) => {
    newLink.owner_email = user.email;
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }

      if (currentProject.user_id === user.id) {
        const { data: newFile, error } = await supabase
          .from("files")
          .insert([
            {
              name: newLink.name,
              link: newLink.link,
              user_id: user.id,
              owner_email: user.email,
              status: newLink.status,
              project_id: id,
            },
          ])
          .select();

        if (error) {
          console.log("Error creating file:", error);
        } else {
          const linkWithSameNameExists = projectLinks.some(
            (existingLink) => existingLink.name === newLink.name
          );

          if (linkWithSameNameExists) {
            alert("A link with the same name already exists.");
            return;
          }

          setProjectLinks([...projectLinks, newFile[0]]);
        }
      } else {
        alert("You are not the owner of the project.");
      }
    } catch (error) {
      console.log("Error creating file:", error);
      message.error(error.message);
    }
  };

  const handleLinkClick = (link) => {
    if (calculateCanClick(link)) {
      window.open(link.link, "_blank");
    }
  };

  const handleSendRequest = async (link) => {
    try {
      if (!navigator.onLine) {
        message.error("No internet access.");
        return;
      }
      setIsLoading(true);
      const response = await apiService.post("/request/file", {
        user_email: user.email,
        file_name: link.name,
        owner_email: link.owner_email,
        project_name: currentProject.name,
      });
      if (response) {
        console.log("OK");
      }
    } catch (error) {
      console.log("error", error);
      message.error(error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          message.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchCurrentUser();
  }, [user.id]);

  useEffect(() => {
    if (
      currentUser?.plan === "Free" ||
      currentUser?.plan === null ||
      currentUser?.plan === undefined ||
      currentUser?.subscription_status === "canceled" ||
      currentUser?.subscription_status === "cancelled"
    ) {
      setIsPrivateDisabled(true);
    } else {
      setIsPrivateDisabled(false);
    }
  }, [currentUser?.plan, currentUser?.subscription_status]);

  const calculateCanClick = (link) => {
    if (link.status) {
      return true;
    }

    if (link?.invited_user && link?.invited_user?.includes(user.email)) {
      return true;
    }

    if (link.user_id && link.user_id === user.id) {
      return true;
    }

    return false;
  };

  return (
    <main className="w-full ml-2">
      <section className="px-4 mx-auto">
        <div className="flex justify-end my-5 items-end">
          <AddLinkFile
            isLoading={isLoading}
            currentProject={currentProject}
            handleAddLinks={handleAddLinks}
            isPrivateDisabled={isPrivateDisabled}
          />
        </div>

        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-1 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-300 darkBorderGray md:rounded-md">
                <table className="min-w-full divide-y divide-gray-200 darkDivideGray">
                  <thead className="bg-gray-50 darkBgBlue">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        <div className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded darkBg darkRingOffsetGray darkBorderGray"
                          />
                          <button className="flex items-center gap-x-2">
                            <span>NO.</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        File name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        File link
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Invite
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 darkDivideGray darkBg">
                    {projectLinks?.map((link, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 darkTextGray whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded darkBg darkRingOffsetGray darkBorderGray"
                            />
                            <span>#{index + 1}</span>
                          </div>
                        </td>
                        <td
                          className={`hover:cursor-pointer px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap`}
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Tooltip
                            title={link.name}
                            color="geekblue"
                            zIndex={20000}
                          >
                            {link.name}
                          </Tooltip>
                        </td>
                        <td
                          className={`${
                            calculateCanClick(link)
                              ? "hover:cursor-pointer hover:bg-blue-700100"
                              : ""
                          } px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap`}
                          onClick={() =>
                            calculateCanClick(link) && handleLinkClick(link)
                          }
                          style={{
                            cursor: calculateCanClick(link)
                              ? "pointer"
                              : "not-allowed",
                            color: calculateCanClick(link) ? "blue" : "black",
                            maxWidth: "10rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {calculateCanClick(link) ? link.link : "***********"}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap"
                          style={{
                            maxWidth: "10rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Tooltip
                            title={link.owner_email}
                            color="geekblue"
                            zIndex={20000}
                          >
                            {link.owner_email}
                          </Tooltip>
                        </td>
                        <td className="px-4 py-4 text-sm text-black-500 darkTextGray whitespace-nowrap">
                          {link.status ? "Public" : "Private"}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              className={`w-[5em] text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                              onClick={() => showDeleteModal(link.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {link.status ? (
                            ""
                          ) : link?.user_id === user.id ? (
                            <InvitedUserFile fileId={link.id} />
                          ) : link?.invited_user?.includes(user?.email) ? (
                            ""
                          ) : (
                            <button
                              className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-3 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus`}
                              onClick={() => handleSendRequest(link)}
                            >
                              Send Request
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        title="Confirm Delete"
        visible={isDeleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
        okText="Delete"
        cancelText="Cancel"
        cancelButtonProps={{
          style: {
            borderRadius: "0.375rem",
            cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
          },
        }}
        okButtonProps={{
          style: {
            background: "#f5222d",
            borderColor: "#f5222d",
            color: "#fff",
            borderRadius: "0.375rem",
            cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
          },
        }}
        centered={true}
      >
        Are you sure you want to delete this link?
      </Modal>
    </main>
  );
}

export default FilesList;
