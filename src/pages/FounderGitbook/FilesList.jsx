import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { useParams } from "react-router-dom";
import InvitedUserFile from "../../components/InvitedUserFile";
import apiService from "../../app/apiService";
import { message, Modal, Table, Tooltip, Button } from "antd";

function FilesList() {
  const { id } = useParams();
  const { user } = useAuth();
  const [projectLinks, setProjectLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const showDeleteModal = (file) => {
    setDeleteFileId(file);
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
        .select("user_id, link")
        .eq("id", deleteFileId?.id)
        .single();

      if (fileError) {
        console.log("Error fetching file data:", fileError);
      } else {
        if (fileData.user_id === user.id) {
          // Extract the file path from the URL
          const filePath = fileData.link.split(
            "/storage/v1/object/public/beekrowd_storage"
          )[1];

          // Delete the file from storage
          const { error: storageError } = await supabase.storage
            .from("beekrowd_storage")
            .remove([filePath]);
          console.log("filePath", filePath);
          if (storageError) {
            console.log("Error deleting file from storage:", storageError);
          } else {
            // Delete the file record from the database
            const { error } = await supabase
              .from("files")
              .delete()
              .eq("id", deleteFileId?.id);

            if (error) {
              console.log("Error deleting file record:", error);
            } else {
              const updatedLinks = projectLinks.filter(
                (link) => link.id !== deleteFileId?.id
              );
              setProjectLinks(updatedLinks);
              message.success("Deleted file successfully.");
            }
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

      if (
        currentProject.user_id === user.id ||
        currentProject.collabs?.includes(user.email)
      ) {
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
            message.error("A link with the same name already exists.");
            return;
          }

          setProjectLinks([...projectLinks, newFile[0]]);
        }
      } else {
        message.error("You are not the owner of the project.");
        return;
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
      !currentUser?.plan ||
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

  const truncate = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return `${text?.substring(0, maxLength)}...`;
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 80, // Set fixed width
      render: (_, __, index) => <span>#{index + 1}</span>,
    },
    {
      title: "File name",
      dataIndex: "name",
      key: "name",
      width: 200, // Set fixed width
      ellipsis: true, // Truncate text if too long
      render: (text) => (
        <Tooltip title={text} color="geekblue" zIndex={20000}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "File link",
      dataIndex: "link",
      key: "link",
      width: 250, // Set fixed width
      ellipsis: true,
      render: (text, record) => (
        <span
          onClick={() => calculateCanClick(record) && handleLinkClick(record)}
          style={{
            cursor: calculateCanClick(record) ? "pointer" : "not-allowed",
            color: calculateCanClick(record) ? "blue" : "black",
            maxWidth: "10rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {calculateCanClick(record) ? truncate(text, 20) : "***********"}
        </span>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner_email",
      key: "owner_email",
      width: 200, // Set fixed width
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text} color="geekblue" zIndex={20000}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100, // Set fixed width
      render: (text) => (text ? "Public" : "Private"),
    },
    {
      title: "Action",
      key: "action",
      width: 100, // Set fixed width
      render: (_, record) => (
        <Button
          style={{ fontSize: "12px" }}
          danger
          onClick={() => showDeleteModal(record)}
        >
          Delete
        </Button>
      ),
    },
    {
      title: "Invite",
      key: "invite",
      width: 150, // Set fixed width
      render: (_, record) =>
        record.status ? (
          ""
        ) : record?.user_id === user.id ? (
          <InvitedUserFile fileId={record.id} />
        ) : record?.invited_user?.includes(user?.email) ? (
          ""
        ) : (
          <Button
            type="primary"
            style={{ backgroundColor: "#2563EB", fontSize: "12px" }}
            onClick={() => handleSendRequest(record)}
          >
            Send Request
          </Button>
        ),
    },
  ];
  // console.log("deleteFileId", deleteFileId);
  return (
    <main className="w-full max-w-full overflow-hidden">
      <section className="mx-auto">
        {/* <div className="flex justify-end my-5 items-end">
					<AddLinkFile
						isLoading={isLoading}
						currentProject={currentProject}
						handleAddLinks={handleAddLinks}
						isPrivateDisabled={isPrivateDisabled}
					/>
				</div> */}
        <div
          className="overflow-hidden overflow-x-auto w-full mx-auto max-w-full scrollbar-hide my-8 rounded-md bg-white"
          style={{
            maxWidth: "80vw", // Ensure the container fits within the viewport width
            overflowX: "auto", // Enable horizontal scrolling if needed
          }}
        >
          <Table
            columns={columns}
            dataSource={projectLinks.map((link, index) => ({
              ...link,
              key: link.id,
              no: index + 1,
            }))}
            loading={isLoading}
            rowKey="id"
            scroll={{ x: "max-content" }} // Allow the table to scroll based on content size
            size="small"
            style={{
              width: "100%", // Ensure the table takes full width of the container
              tableLayout: "auto", // Let the table adjust column sizes automatically
            }}
          />
        </div>
      </section>
      <Modal
        zIndex={42424244}
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleDeleteModalOk}
        onCancel={handleDeleteModalCancel}
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
        Are you sure you want to delete this file
        <span className="text-[#f5222d] font-semibold">
          {deleteFileId?.name} ?
        </span>
      </Modal>
    </main>
  );
}

export default FilesList;
