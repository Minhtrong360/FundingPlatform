import React, { useEffect, useState } from "react";
import Company from "./Company"; // Import your Company component
import HeroSection from "./HeroSection"; // Import your HeroSection component
import AnnouncePage from "../../components/AnnouncePage";

import { toast } from "react-toastify";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../Home/Components/Card";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import AlertMsg from "../../components/AlertMsg";

function CompanySetting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [viewError, setViewError] = useState("");
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "Tesla",
    country: "US",
    industry: ["Technology"],
    targetAmount: 100000,
    typeOffering: "Investment", // Mặc định là "land"
    minTicketSize: 10000,
    noTicket: "",
    offer: "10% equity",
    project_url:
      "https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    website: "https://www.beekrowd.com",

    card_url:
      "https://images.unsplash.com/photo-1633164106121-fd129dfb9f4d?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    companyDescription:
      "Tesla, Inc., founded in 2003 by Elon Musk and others, is an American company specializing in electric vehicles, battery energy storage, and solar products. Known for its high-performance electric cars like the Model S and Model 3, Tesla aims to advance sustainable transportation and energy. The company also operates a global network of superchargers and is a leader in renewable energy technologies.",
    rememberMe: false,
    user_email: "",
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
                companyName: companyData.name,
                country: companyData.country,
                industry:
                  companyData.industry.length > 0
                    ? companyData.industry
                    : formData.industry,
                targetAmount: companyData.target_amount,
                typeOffering: companyData.offer_type,
                minTicketSize: companyData.ticket_size,
                noTicket: companyData.no_ticket,
                offer: companyData.offer,
                project_url: companyData.project_url
                  ? companyData.project_url
                  : formData.project_url,
                card_url: companyData.card_url
                  ? companyData.card_url
                  : formData.card_url,
                website: companyData.website,
                companyDescription: companyData.description,
                user_email: companyData.user_email,
              });

              setIsLoading(false);
            } else {
              // Nếu không có dự án tồn tại, ở lại trang để tạo
              console.log("Project not found, stay on create page");
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
      const targetAmount = parseInt(formData.targetAmount);
      const minTicketSize = parseInt(formData.minTicketSize);

      if (
        !isNaN(targetAmount) &&
        !isNaN(minTicketSize) &&
        minTicketSize !== 0
      ) {
        const noTicket = Math.floor(targetAmount / minTicketSize);
        return noTicket;
      }
      return 0;
    };
    setFormData({
      ...formData,
      noTicket: calculateNoTicket(),
    });
  }, [formData.targetAmount, formData.minTicketSize]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        toast.error("No internet access.");
        setIsLoading(false);
        return;
      }
      if (
        formData.industry === null ||
        formData.industry === undefined ||
        formData.industry.length === 0
      ) {
        // Không có kết nối Internet
        toast.error("Please choose industry before submitting.");
        setIsLoading(false);
        return;
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

          const { data, error } = await supabase.from("company").upsert([
            {
              id: existingCompanyId, // Sử dụng id của công ty đã tồn tại để thực hiện cập nhật
              name: formData.companyName,
              country: formData.country,
              industry: formData.industry,
              target_amount: formData.targetAmount,
              offer_type: formData.typeOffering,
              ticket_size: formData.minTicketSize,
              no_ticket: formData.noTicket,
              offer: formData.offer,
              project_url: formData.project_url,
              card_url: formData.card_url,
              website: formData.website,
              description: formData.companyDescription,
              user_id: user.id,
              user_email: user.email,
              project_id: params.id,
            },
          ]);

          if (error) {
            console.log("Error updating data to Supabase:", error);
            throw error;
          } else {
            console.log("Data updated successfully:", data);
            setIsLoading(false);
            navigate(`/founder/${params.id}`);
          }
        } else {
          // Nếu công ty chưa tồn tại, thêm mới thông tin công ty

          const { error } = await supabase.from("company").upsert([
            {
              name: formData.companyName,
              country: formData.country,
              industry: formData.industry,
              target_amount: formData.targetAmount,
              offer_type: formData.typeOffering,
              ticket_size: formData.minTicketSize,
              no_ticket: formData.noTicket,
              offer: formData.offer,
              project_url: formData.project_url,
              card_url: formData.card_url,
              website: formData.website,
              description: formData.companyDescription,
              user_id: user.id,
              user_email: user.email,
              project_id: params.id,
            },
          ]);

          if (error) {
            console.log("Error saving data to Supabase:", error);
          } else {
            setIsLoading(false);
            navigate(`/founder/${params.id}`);
          }
        }
      }
    } catch (error) {
      console.log("An error occurred:", error);
      toast.error(error.message);
      setIsLoading(false);
    }
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
          toast.error(error.message);
          // Xử lý lỗi khi không thể lấy dự án
        } else {
          // Kiểm tra quyền truy cập của người dùng
          if (
            data.status === false &&
            data.user_id !== user?.id &&
            !data.invited_user?.includes(user.email)
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

  console.log("formData", formData);
  if (viewError) {
    return (
      <AnnouncePage
        title="Permission Required"
        announce="This is a private project."
        describe="This is a private project and you must be invited to access and see it."
      />
    );
  }

  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
      {" "}
      {/* Sử dụng lg:grid-cols-3 để chia thành 3 cột, trong đó Company component chiếm 1/3 và các div còn lại chiếm 2/3 */}
      <LoadingButtonClick isLoading={isLoading} />
      <div className="flex-1 lg:col-span-1">
        {" "}
        {/* Sử dụng lg:col-span-1 để Company component chiếm 1/3 */}
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
      <div className="flex-1 lg:col-span-2">
        {" "}
        {/* Sử dụng lg:col-span-2 để các div còn lại chiếm 2/3 */}
        <div className="flex flex-col">
          <HeroSection
            formData={formData}
            title={formData.companyName}
            description={formData.companyDescription}
            button1Text={formData.targetAmount}
            button2Text={formData.minTicketSize}
            button3Text={formData.noTicket}
            button4Text={formData.offer}
            button5Text={formData.typeOffering}
            imageUrl={formData.project_url}
          />

          <hr className="mt-16 border-dashed border-gray-400" />

          <div className="mt-11 px-4 sm:px-6 lg:px-8 z-0">
            <Card
              title={formData.companyName}
              description={formData.companyDescription}
              imageUrl={formData.card_url}
              buttonText="Read more"
              project_id={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanySetting;
