import { useEffect, useState } from "react";
import CheckboxField from "../../components/CheckBoxField";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import countries from "../../components/Country";
import AlertMsg from "../../components/AlertMsg";
import { toast } from "react-toastify";

function CompanyInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "Tesla",
    country: "US",
    targetAmount: 100000,
    typeOffering: "Investment", // Mặc định là "land"
    minTicketSize: 10000,
    noTicket: "",
    offer: "10% equity",
    url: "https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
                targetAmount: companyData.target_amount,
                typeOffering: companyData.offer_type,
                minTicketSize: companyData.ticket_size,
                noTicket: companyData.no_ticket,
                offer: companyData.offer,
                url: companyData.url,
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
              target_amount: formData.targetAmount,
              offer_type: formData.typeOffering,
              ticket_size: formData.minTicketSize,
              no_ticket: formData.noTicket,
              offer: formData.offer,
              url: formData.url,
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

          const { data, error } = await supabase.from("company").upsert([
            {
              name: formData.companyName,
              country: formData.country,
              target_amount: formData.targetAmount,
              offer_type: formData.typeOffering,
              ticket_size: formData.minTicketSize,
              no_ticket: formData.noTicket,
              offer: formData.offer,
              url: formData.url,
              description: formData.companyDescription,
              user_id: user.id,
              user_email: user.email,
              project_id: params.id,
            },
          ]);

          if (error) {
            console.log("Error saving data to Supabase:", error);
          } else {
            console.log("Data saved successfully:", data);
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

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center text-center">Loading...</div>
      ) : (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <AlertMsg />
          <div className="max-w-xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
                Company Info
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                This will be an amazing journey.
              </p>
            </div>

            <div className="mt-12">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 lg:gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Company name"
                      id="company-name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      type="text"
                      required
                    />
                    <SelectField
                      label="Country"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      options={countries} // Thay thế bằng danh sách các tùy chọn bạn muốn
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Target amount"
                      id="target-amount"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                    <SelectField
                      label="Type offering"
                      id="type-offering"
                      name="typeOffering"
                      options={typeOfferingOptions}
                      value={formData.typeOffering}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <InputField
                      label="Min ticket size"
                      id="min-ticket-size"
                      name="minTicketSize"
                      value={formData.minTicketSize}
                      onChange={handleInputChange}
                      type="number"
                      required
                    />
                    <InputField
                      label="No. ticket"
                      id="no-ticket"
                      name="noTicket"
                      value={formData.noTicket}
                      type="number"
                      readOnly // Đặt readOnly để ngăn người dùng chỉnh sửa trường này thủ công
                    />
                  </div>

                  <InputField
                    label="Offer"
                    id="offer"
                    name="offer"
                    value={formData.offer}
                    onChange={handleInputChange}
                    type="text"
                    required
                  />
                  <InputField
                    label="Profile image url (>700*800 recommended)"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    type="text"
                  />

                  <TextAreaField
                    label="Company description"
                    id="company-description"
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mt-6 grid">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyInfo;
