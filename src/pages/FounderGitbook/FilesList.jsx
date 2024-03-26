import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import AddLinkFile from "./AddLinkFile";
import { useParams } from "react-router-dom";

import InvitedUserFile from "../../components/InvitedUserFile";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import { Tooltip, message } from "antd";

function FilesList() {
  const { id } = useParams();
  const { user } = useAuth();
  const [projectLinks, setProjectLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false); // New state for disabling private option

  // Tạo một hàm để tính giá trị canClick cho từng dòng trong bảng
  const calculateCanClick = (link) => {
    // Nếu link.status = true thì canClick=true
    if (link.status) {
      return true;
    }

    // Nếu link.invited_user chứa user.id thì canClick = true
    if (link?.invited_user && link?.invited_user?.includes(user.email)) {
      return true;
    }

    if (link.user_id && link.user_id === user.id) {
      return true;
    }

    // Còn lại canClick = false
    return false;
  };

  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchFiles = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
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
  }, []);

  useEffect(() => {
    // Lấy dự án từ Supabase
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
        if (error) {
          console.log(error);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          setCurrentProject(data);
        }
      });
  }, []);

  const handleAddLinks = async (newLink) => {
    newLink.owner_email = user.email;
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      // Tạo một dự án mới và lưu vào Supabase
      if (currentProject.user_id === user.id) {
        const { error } = await supabase.from("files").insert([
          {
            name: newLink.name,
            link: newLink.link,
            user_id: user.id,
            owner_email: user.email,
            status: newLink.status,
            project_id: id,
          },
        ]);

        if (error) {
          console.log("Error creating files:", error);
          // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
        } else {
          // Check if the link with the same name already exists
          const linkWithSameNameExists = projectLinks.some(
            (existingLink) => existingLink.name === newLink.name
          );

          if (linkWithSameNameExists) {
            alert("A link with the same name already exists.");
            return;
          }

          // Create a new link object and add it to the projectLinks array

          setProjectLinks([...projectLinks, newLink]);
        }
      } else {
        alert("You are not the owner of project");
        return;
      }
    } catch (error) {
      console.log("Error creating files:", error);
      message.error(error.message);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  const handleDelete = async (fileId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!isConfirmed) {
      return; // Don't proceed with deletion if the user doesn't confirm
    }

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      // Trước khi xóa, hãy truy vấn để kiểm tra user_id
      const { data: fileData, error: fileError } = await supabase
        .from("files")
        .select("user_id")
        .eq("id", fileId)
        .single();

      if (fileError) {
        console.log("Error fetching file data:", fileError);
        // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
      } else {
        // Kiểm tra user_id từ dữ liệu file với user.id đăng nhập
        if (fileData.user_id === user.id) {
          // Xóa dự án ra khỏi Supabase bằng cách sử dụng phương thức `delete`
          const { error } = await supabase
            .from("files")
            .delete()
            .eq("id", fileId);

          if (error) {
            console.log("Error deleting project:", error);
            // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
          } else {
            // Xóa dự án thành công, cập nhật lại danh sách dự án
            // Tạo một mảng mới của các liên kết không có fileId cụ thể
            const updatedLinks = projectLinks.filter(
              (link) => link.id !== fileId
            );

            // Đặt trạng thái với mảng liên kết đã cập nhật
            setProjectLinks(updatedLinks);
          }
        } else {
          message.error("User does not have permission to delete this file.");
          console.log("User does not have permission to delete this file.");
          // Xử lý trường hợp người dùng không có quyền xóa (ví dụ: hiển thị thông báo lỗi cho người dùng)
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      message.error(error.message);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi cho người dùng)
    }
  };

  const handleLinkClick = (link) => {
    // Sử dụng hàm calculateCanClick để kiểm tra điều kiện
    if (calculateCanClick(link)) {
      // Nếu canClick là true, mở tab mới với đường dẫn từ link.link
      window.open(link.link, "_blank");
    }
  };

  const handleSendRequest = async (link) => {
    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
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
    // Import Supabase client và thiết lập nó

    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          // Không có kết nối Internet
          message.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")

          // Filters
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
  }, []);

  useEffect(() => {
    // Check if the user doesn't meet the conditions to create a private project
    if (
      (currentUser?.plan === "Free" ||
        currentUser?.plan === null ||
        currentUser?.plan === undefined) &&
      currentUser?.subscription_status !== "active"
    ) {
      setIsPrivateDisabled(true);
    } else {
      setIsPrivateDisabled(false);
    }
  }, []);

  return (
    <main className="w-full ml-2">
      <LoadingButtonClick isLoading={isLoading} />
      <section className="container px-4 mx-auto">
        <div className="flex justify-start my-5 items-start">
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
              <div className="overflow-hidden border border-gray-200 darkBorderGray md:rounded-lg">
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

                      {/* <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 darkTextGray"
                      >
                        Status
                      </th> */}
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
                            maxWidth: "150px", // Set the maximum width here
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
                            maxWidth: "10rem", // Set the maximum width here
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
                            maxWidth: "10rem", // Set the maximum width here
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
                        {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{project.status}</td> */}

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              className={`w-[5em] text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm  py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
                              onClick={() => handleDelete(link.id)}
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
                              className={`text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-1 text-center darkBgBlue darkHoverBgBlue darkFocus `}
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
    </main>
  );
}

export default FilesList;
