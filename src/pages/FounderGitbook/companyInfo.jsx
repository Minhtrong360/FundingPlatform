import { useEffect, useState } from "react";
import CheckboxField from "../../components/CheckBoxField";
import InputField from "../../components/InputField";
import SelectField from "../../components/SelectField";
import TextAreaField from "../../components/TextAreaField";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function CompanyInfo() {
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    country: "",
    targetAmount: "",
    typeOffering: "land", // Mặc định là "land"
    minTicketSize: "",
    noTicket: "",
    offer: "",
    companyDescription: "",
    rememberMe: false,
  });

  useEffect(() => {
    // Hàm này chạy khi id thay đổi
    if (params.id) {
      setIsLoading(true); // Bắt đầu hiển thị trạng thái loading
      // Tìm dự án với project_id tương ứng
      supabase
        .from("company")
        .select("id")
        .eq("project_id", params.id)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching data from Supabase:", error);
          } else {
            if (data && data.length > 0) {
              // Nếu có dự án tồn tại, điều hướng đến trang "founder/:id"
              navigate(`/founder/${params.id}`);
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
    // Kiểm tra xem tất cả các trường đã được điền đầy đủ và checkbox đã được chọn
    try {
      // Tạo một đối tượng chứa dữ liệu để lưu vào bảng "company" trên Supabase
      const { data, error } = await supabase.from("company").upsert([
        {
          name: formData.companyName,
          country: formData.country,
          target_amount: formData.targetAmount,
          offer_type: formData.typeOffering,
          ticket_size: formData.minTicketSize,
          no_ticket: formData.noTicket,
          offer: formData.offer,
          description: formData.companyDescription,
          user_id: user.id,
          user_email: user.email,
        },
      ]);

      if (error) {
        console.log("Error saving data to Supabase:", error);
      } else {
        console.log("Data saved successfully:", data);
        setIsLoading(false);
        navigate(`/founder/${params.id}`);
      }
    } catch (error) {
      console.log("An error occurred:", error);
      setIsLoading(false);
    }
  };

  const typeOfferingOptions = ["Land", "Invest", "MSA", "Convertible"];
  console.log("formData", formData);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center text-center">Loading...</div>
      ) : (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
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
                    <InputField
                      label="Country"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      type="text"
                      required
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

                  <TextAreaField
                    label="Company description"
                    id="company-description"
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    required
                  />

                  <CheckboxField
                    label="By submitting this form I have read and acknowledged our Terms and Policies"
                    id="remember-me"
                    name="rememberMe"
                    checked={formData.rememberMe}
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