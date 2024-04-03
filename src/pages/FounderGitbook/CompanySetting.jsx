import React, { useEffect, useState } from "react";
import Company from "./Company"; // Import your Company component
import HeroSection from "./HeroSection"; // Import your HeroSection component
import AnnouncePage from "../../components/AnnouncePage";

// import { toast } from "react-toastify";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../Home/Components/Card";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import AlertMsg from "../../components/AlertMsg";
// import CompanyTest from "./CompanyTest";

import axios from "axios";
import { message } from "antd";
import { parseNumber } from "../../features/CostSlice";
import ProfileInfo from "./ProfileInfo";

function CompanySetting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewError, setViewError] = useState("");
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    industry: [],
    target_amount: 0,
    offer_type: "Investment", // Mặc định là "land"
    ticket_size: 0,
    no_ticket: "",
    offer: "",
    project_url: "",
    website: "",
    card_url: "",
    description: "",
    rememberMe: false,
    user_email: "",
    revenueStatus: "Pre-revenue",
    calendly: "",
    teamSize: "",
    operationTime: "2024",
    amountRaised: 0,
    round: "Pre-seed",
  });

  useEffect(() => {
    // Hàm này chạy khi id thay đổi
    if (params.id) {
      setIsLoading(true); // Bắt đầu hiển thị trạng thái loading
      // Tìm dự án với project_id tương ứng
      supabase
        .from("company")
        .select("*") // Lấy tất cả các trường từ bảng company
        .eq("project_id", params.id)
        .then(({ data, error }) => {
          if (error) {
            console.log("Error fetching data from Supabase:", error);
          } else {
            if (data && data.length > 0) {
              // Nếu có dự án tồn tại, điều hướng đến trang "founder/:id"
              const companyData = data[0]; // Lấy dữ liệu của công ty đầu tiên (nếu có)

              setFormData({
                ...formData, // Giữ lại các giá trị hiện tại của formData
                name: companyData.name,
                country: companyData.country,
                industry:
                  companyData.industry.length > 0
                    ? companyData.industry
                    : formData.industry,
                target_amount: companyData.target_amount,
                offer_type: companyData.offer_type,
                ticket_size: companyData.ticket_size,
                no_ticket: companyData.no_ticket,
                offer: companyData.offer,
                project_url: companyData.project_url
                  ? companyData.project_url
                  : formData.project_url,
                card_url: companyData.card_url
                  ? companyData.card_url
                  : formData.card_url,
                website: companyData.website,
                description: companyData.description,
                user_email: companyData.user_email,
                revenueStatus: companyData.revenueStatus,
                calendly: companyData.calendly,
                teamSize: companyData.teamSize,
                operationTime: companyData.operationTime,
                amountRaised: parseNumber(companyData.amountRaised),
                round: companyData.round,
              });

              setIsLoading(false);
            } else {
              // Nếu không có dự án tồn tại, ở lại trang để tạo

              setIsLoading(false);
            }
          }
        });
    }
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    const calculateNoTicket = () => {
      const target_amount =
        formData.target_amount && typeof formData.target_amount === "string"
          ? parseInt(formData.target_amount.replace(/,/g, ""), 10)
          : formData.target_amount;
      const ticket_size =
        formData.ticket_size && typeof formData.ticket_size === "string"
          ? parseInt(formData.ticket_size.replace(/,/g, ""), 10)
          : formData.ticket_size;

      if (!isNaN(target_amount) && !isNaN(ticket_size) && ticket_size !== 0) {
        const no_ticket = Math.ceil(target_amount / ticket_size);
        return no_ticket;
      }
      return 0;
    };
    setFormData({
      ...formData,
      no_ticket: calculateNoTicket(),
    });
  }, [formData.target_amount, formData.ticket_size]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData?.description?.length < 50) {
      message.warning("Please input at least 50 characters.");
      return;
    }
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        setIsLoading(false);
        return;
      }
      if (
        formData.industry === null ||
        formData.industry === undefined ||
        formData.industry.length === 0
      ) {
        // Không có kết nối Internet
        message.error("Please choose industry before submitting.");
        setIsLoading(false);
        return;
      }

      // Upload ảnh project_url nếu có

      let projectUrl = formData.project_url;
      if (projectUrl && projectUrl.startsWith("data:image")) {
        const file = dataURItoFile(projectUrl, "img");
        const uploadedProjectUrl = await uploadImageToSupabase(file);
        if (uploadedProjectUrl) {
          projectUrl = uploadedProjectUrl;
        }
      }
      if (
        projectUrl &&
        !projectUrl.startsWith("https://dheunoflmddynuaxiksw.supabase.co")
      ) {
        if (
          projectUrl.startsWith("http://") ||
          projectUrl.startsWith("https://")
        ) {
          const uploadedProjectUrl = await uploadImageFromURLToSupabase(
            projectUrl
          );
          if (uploadedProjectUrl) {
            projectUrl = uploadedProjectUrl;
          }
        }
      }
      // Upload ảnh card_url nếu có
      let cardUrl = formData.card_url;
      if (cardUrl && cardUrl.startsWith("data:image")) {
        const file = dataURItoFile(cardUrl, "card_image.jpg");
        const uploadedCardUrl = await uploadImageToSupabase(file);

        if (uploadedCardUrl) {
          cardUrl = uploadedCardUrl;
        }
      }
      if (
        cardUrl &&
        !cardUrl.startsWith("https://dheunoflmddynuaxiksw.supabase.co")
      ) {
        if (cardUrl.startsWith("http://") || cardUrl.startsWith("https://")) {
          const uploadedcardUrl = await uploadImageFromURLToSupabase(cardUrl);
          if (uploadedcardUrl) {
            cardUrl = uploadedcardUrl;
          }
        }
      }
      // Kiểm tra xem công ty đã tồn tại trong Supabase chưa bằng cách truy vấn theo project_id
      const { data: existingCompany, error: existingCompanyError } =
        await supabase.from("company").select("*").eq("project_id", params.id);

      if (existingCompanyError) {
        console.log(
          "Error checking for existing company:",
          existingCompanyError
        );
      } else {
        // Nếu công ty đã tồn tại, cập nhật thông tin
        if (existingCompany && existingCompany.length > 0) {
          const existingCompanyId = existingCompany[0].id;

          const { data, error } = await supabase
            .from("company")
            .upsert([
              {
                id: existingCompanyId, // Sử dụng id của công ty đã tồn tại để thực hiện cập nhật
                name: formData.name,
                country: formData.country,
                industry: formData.industry,
                target_amount:
                  formData.target_amount &&
                  typeof formData.target_amount === "string"
                    ? parseInt(formData.target_amount.replace(/,/g, ""), 10)
                    : formData.target_amount,
                offer_type: formData.offer_type,
                ticket_size:
                  formData.ticket_size &&
                  typeof formData.ticket_size === "string"
                    ? parseInt(formData.ticket_size.replace(/,/g, ""), 10)
                    : formData.ticket_size,
                no_ticket:
                  formData.no_ticket && typeof formData.no_ticket === "string"
                    ? parseInt(formData.no_ticket.replace(/,/g, ""), 10)
                    : formData.no_ticket,
                offer: formData.offer,
                project_url: projectUrl,
                card_url: cardUrl,
                website: formData.website,
                description: formData.description,
                user_id: user.id,
                user_email: user.email,
                project_id: params.id,
                revenueStatus: formData.revenueStatus,
                calendly: formData.calendly,
                teamSize: formData.teamSize,
                operationTime: formData.operationTime,
                amountRaised: parseNumber(formData.amountRaised),
                round: formData.round,
              },
            ])
            .select();

          if (error) {
            console.log("Error updating data to Supabase:", error);
            throw error;
          } else {
            setIsLoading(false);
            navigate(`/founder/${params.id}`);
          }
        } else {
          // Nếu công ty chưa tồn tại, thêm mới thông tin công ty

          const { data, error } = await supabase
            .from("company")
            .upsert([
              {
                name: formData.name,
                country: formData.country,
                industry: formData.industry,
                target_amount:
                  formData.target_amount &&
                  typeof formData.target_amount === "string"
                    ? parseInt(formData.target_amount.replace(/,/g, ""), 10)
                    : formData.target_amount,
                offer_type: formData.offer_type,
                ticket_size:
                  formData.ticket_size &&
                  typeof formData.ticket_size === "string"
                    ? parseInt(formData.ticket_size.replace(/,/g, ""), 10)
                    : formData.ticket_size,
                no_ticket:
                  formData.no_ticket && typeof formData.no_ticket === "string"
                    ? parseInt(formData.no_ticket.replace(/,/g, ""), 10)
                    : formData.no_ticket,
                offer: formData.offer,
                project_url: projectUrl,
                card_url: cardUrl,
                website: formData.website,
                description: formData.description,
                user_id: user.id,
                user_email: user.email,
                project_id: params.id,
                revenueStatus: formData.revenueStatus,
                calendly: formData.calendly,
                teamSize: formData.teamSize,
                operationTime: formData.operationTime,
                amountRaised: parseNumber(formData.amountRaised),
                round: formData.round,
              },
            ])
            .select();
          if (error) {
            console.log("Error saving data to Supabase:", error);
            throw error;
          } else {
            createNotifications({ createdCompany: data[0] });
            setIsLoading(false);
            navigate(`/founder/${params.id}`);
          }
        }
      }
    } catch (error) {
      message.error(error.message);
      console.error("Error updating company data:", error);
    }
    setIsLoading(false);
  };

  const typeOfferingOptions = ["Lending", "Investment", "M&A", "Convertible"];

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
          console.log("error", error);
          message.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          // Kiểm tra quyền truy cập của người dùng
          if (
            data.status === "private" &&
            data.user_id !== user?.id &&
            !data.collabs?.includes(user.email)
          ) {
            // Kiểm tra xem dự án có trạng thái false, không thuộc về người dùng và không được mời tham gia
            // Hoặc có thể kiểm tra invited_user ở đây

            // Hiển thị thông báo hoặc thực hiện hành động tương ứng
            setViewError(true);
          } else {
            setViewError(false);
          }
        }
      });
  }, [id, user.email, user.id]);

  const handleIndustryChange = (selectedItems) => {
    setFormData({
      ...formData,
      industry: selectedItems,
    });
  };

  // Hàm để tải ảnh lên Supabase storage
  const uploadImageToSupabase = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("beekrowd_storage") // Chọn bucket
        .upload(`beekrowd_images/${file.name}`, file); // Lưu ảnh vào folder beekrowd_images

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Trả về liên kết ảnh từ Supabase
      // Lấy URL của ảnh đã lưu

      const imageUrl = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image to Supabase:", error);
      return null;
    }
  };

  // Function to upload image to Supabase from URL
  const uploadImageFromURLToSupabase = async (imageUrl) => {
    try {
      // Download image from URL
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      // Create Blob from downloaded image data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Get current timestamp
      const timestamp = Date.now();

      // Create File object from Blob with filename as "img-{timestamp}"
      const file = new File([blob], `img-${timestamp}`, {
        type: response.headers["content-type"],
      });

      // Upload image file to Supabase storage
      const { data, error } = await supabase.storage
        .from("beekrowd_storage")
        .upload(`beekrowd_images/${file.name}`, file);

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return null;
      }

      // Return Supabase URL of the uploaded image
      const imageUrlFromSupabase = `https://dheunoflmddynuaxiksw.supabase.co/storage/v1/object/public/${data.fullPath}`;
      return imageUrlFromSupabase;
    } catch (error) {
      console.error("Error uploading image from URL to Supabase:", error);
      return null;
    }
  };

  // Hàm chuyển đổi data URI thành File object
  const dataURItoFile = (dataURI, fileNamePrefix) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const extension = dataURI.split(",")[0].split("/")[1].split(";")[0]; // Lấy phần mở rộng của tệp từ data URI
    const fileName = `${fileNamePrefix}-${Date.now()}.${extension}`; // Tạo tên tệp duy nhất với ngày giờ hiện tại và phần mở rộng
    const blob = new Blob([ab], { type: `image/${extension}` });
    return new File([blob], fileName, { type: `image/${extension}` });
  };

  async function createNotifications({ createdCompany }) {
    try {
      // Code to create notifications similar to UserInfoSettings

      const notificationContent = {
        id: createdCompany.id,
        name: createdCompany.name,
        project_id: createdCompany.project_id,
      };

      // Lấy danh sách notifications từ cơ sở dữ liệu
      const { data: existingNotifications, error: existingError } =
        await supabase.from("notifications").select("*");

      if (existingError) {
        throw existingError;
      }

      // Kiểm tra xem thông báo đã tồn tại hay chưa
      // const notificationExists = existingNotifications.some((notification) => {
      //   const content = JSON.parse(notification.content);
      //   return content.some(
      //     (item) =>
      //       item.id === notificationContent.id &&
      //       item.name === notificationContent.name &&
      //       item.project_id === notificationContent.project_id
      //   );
      // });

      // if (notificationExists) {
      //   console.log("Notification already exists. Skipping insertion.");
      //   return; // Không thêm vào bảng notifications nếu thông báo đã tồn tại
      // }

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .neq("id", user.id) // Exclude the current user
        .eq("revenueStatusWanted", formData.revenueStatus)
        .eq("roll", "Investor");

      if (usersError) {
        throw usersError;
      }

      const filteredUsers = usersData.filter((user) => {
        // Parse investment sizes from user data
        const investmentSizeCondition = user.investment_size.map((size) => {
          const min = parseInt(
            size.split("-")[0].replace("$", "").replace(/,/g, "")
          );
          const max = parseInt(
            size.split("-")[1].replace("$", "").replace(/,/g, "")
          );
          return { min, max };
        });

        // Check if the user is interested in at least one of the industries of the created company
        const isInterestedInIndustry = user.interested_in.some((interest) =>
          createdCompany.industry.includes(interest)
        );

        // Check if the ticket size of the created company falls within the user's investment size range
        const isTicketSizeInRange = investmentSizeCondition.some(
          (size) =>
            createdCompany.ticket_size >= size.min &&
            createdCompany.ticket_size <= size.max
        );

        // Return true if both conditions are met
        return isInterestedInIndustry && isTicketSizeInRange;
      });

      if (filteredUsers.length > 0) {
        const notificationsToInsert = filteredUsers.map((user) => ({
          receivedUser: user.email,
          content: JSON.stringify([notificationContent]),
        }));

        // Insert new notifications into the notifications table
        const { error: insertError } = await supabase
          .from("notifications")
          .insert(notificationsToInsert);

        if (insertError) {
          console.log("error", insertError);
          // Xử lý lỗi nếu cần
        } else {
          // Tính toán giá trị mới của notification_count

          // Cập nhật notification_count vào bảng users cho mỗi người dùng trong filteredUsers
          for (const user of filteredUsers) {
            const updatedNotificationCount = user.notification_count + 1;

            const { error: updateError } = await supabase
              .from("users")
              .update({
                notification_count: updatedNotificationCount,
              })
              .eq("id", user.id);

            if (updateError) {
              console.log(
                `Error updating notification_count for user ${user.id}:`,
                updateError
              );
              // Xử lý lỗi nếu cần
            }
          }
        }
      } else {
        // If there are no users matching the criteria, display a message
        // message.warning("No users matching the criteria for notifications.");
      }
    } catch (error) {
      message.error(error.message);
      console.log("Error updating company data:", error);
    }
  }

  if (viewError) {
    return (
      <AnnouncePage
        title="Permission Required"
        announce="This is a private project."
        describe="This is a private project and you must be invited to access and see it."
      />
    );
  }

  const canClick = false;

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-6">
      {" "}
      {/* Sử dụng lg:grid-cols-3 để chia thành 3 cột, trong đó Company component chiếm 1/3 và các div còn lại chiếm 2/3 */}
      <LoadingButtonClick isLoading={isLoading} />
      <div className="flex-1 lg:col-span-1">
        <Company
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          typeOfferingOptions={typeOfferingOptions}
          handleIndustryChange={handleIndustryChange}
        />
        <AlertMsg />
      </div>
      <div className="flex-1 lg:col-span-3">
        {" "}
        {/* Sử dụng lg:col-span-2 để các div còn lại chiếm 2/3 */}
        <div className="flex flex-col">
          {/* <HeroSection
            formData={formData}
            title={formData.name}
            description={formData.description}
            button1Text={formData.target_amount}
            button2Text={formData.ticket_size}
            button3Text={formData.no_ticket}
            button4Text={formData.offer}
            button5Text={formData.offer_type}
            imageUrl={formData.project_url}
            setFormData={setFormData}
            canClick={canClick}
          /> */}

          <div className="text-4xl text-red-600 font-bold leading-tight sm:px-6 lg:px-8 mt-16">
            {" "}
            Preview
          </div>
          <hr className=" border-dashed border-gray-400" />
          <ProfileInfo company={formData} canClick={canClick} />

          <hr className="mt-16 border-dashed border-gray-400" />

          <div className="mt-11 px-4 sm:px-6 lg:px-8">
            <Card
              title={formData.name}
              description={formData.description}
              imageUrl={formData.card_url}
              buttonText="More"
              project_id={id}
              canClick={canClick}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySetting;
