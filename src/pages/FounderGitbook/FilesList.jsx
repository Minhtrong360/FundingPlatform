import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";

import AddLinkFile from "./AddLinkFile";
import { useParams } from "react-router-dom";

import InvitedUser from "../../components/InvitedUser";

function FilesList() {
  const { id } = useParams();
  const { user } = useAuth();
  const [projectLinks, setProjectLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState();

  // Tạo một hàm để tính giá trị canClick cho từng dòng trong bảng
  const calculateCanClick = (link) => {
    // Nếu link.status = true thì canClick=true
    if (link.status) {
      return true;
    }

    // Nếu link.invited_user chứa user.id thì canClick = true
    if (link.invited_user && link.invited_user.includes(user.id)) {
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
        console.error("Error fetching projects:", error);
      }
    };

    if (id) {
      fetchFiles();
    }
  }, [id]);

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
  }, [id]);

  const handleAddLinks = async (newLink) => {
    try {
      // Tạo một dự án mới và lưu vào Supabase
      const { error } = await supabase.from("files").insert([
        {
          name: newLink.name,
          link: newLink.link,
          user_id: user.id,
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
    } catch (error) {
      console.log("Error creating files:", error);
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
          console.log("User does not have permission to delete this file.");
          // Xử lý trường hợp người dùng không có quyền xóa (ví dụ: hiển thị thông báo lỗi cho người dùng)
        }
      }
    } catch (error) {
      console.error("Error deleting project:", error);
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

  return (
    <main className="w-full">
      <div className="flex justify-end mr-5 mt-10 mb-5 items-end">
        <AddLinkFile
          isLoading={isLoading}
          currentProject={currentProject}
          handleAddLinks={handleAddLinks}
        />
      </div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                          />
                          <button className="flex items-center gap-x-2">
                            <span>NO.</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        File name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        File link
                      </th>

                      {/* <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Status
                      </th> */}
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-black-500 dark:text-gray-400"
                      >
                        Invite
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {projectLinks?.map((link, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <input
                              type="checkbox"
                              className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                            />
                            <span>#{index + 1}</span>
                          </div>
                        </td>
                        <td
                          className={`hover:cursor-pointer px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap`}
                        >
                          {link.name}
                        </td>
                        <td
                          className={`${
                            calculateCanClick(link)
                              ? "hover:cursor-pointer hover:bg-blue-100"
                              : ""
                          } px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap`}
                          onClick={() =>
                            calculateCanClick(link) && handleLinkClick(link)
                          }
                          style={{
                            cursor: calculateCanClick(link)
                              ? "pointer"
                              : "not-allowed",
                            color: calculateCanClick(link) ? "blue" : "black",
                          }}
                        >
                          {link.link}
                        </td>
                        <td className="px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap max-w-[12rem]">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-black-500 dark:text-gray-300 whitespace-nowrap">
                          {link.status ? "Public" : "Private"}
                        </td>
                        {/* <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">{project.status}</td> */}

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              className="text-red-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                              onClick={() => handleDelete(link.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {calculateCanClick(link) ? (
                            ""
                          ) : link.user_id !== user.id ? (
                            "Required Allowment"
                          ) : (
                            <InvitedUser fileId={link.id} />
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
