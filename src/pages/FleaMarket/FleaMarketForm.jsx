import { Avatar, Modal, message } from "antd";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/Select";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { useEffect, useState } from "react";
import { formatNumber, parseNumber } from "../../features/CostSlice";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function FleaMarketForm({
  isAddNewModalOpen,
  setIsAddNewModalOpen,
  SelectedID,
  setSelectedID,
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: user?.email,
    website: "",
    industry: "",
    country: "",
    phone: "",
    role: "seller",
    shares: "",
    proof: "",
    price: "",
    total: "",
    timeInvested: "",
    amountInvested: "",
    companyLogo: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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

  const uploadImageToSupabase = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("beekrowd_storage") // Chọn bucket
        .upload(`fleamarket/${file.name}`, file); // Lưu ảnh vào folder fleamarket

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
        .upload(`fleamarket/${file.name}`, file);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      company,
      companyLogo,
      website,
      industry,
      country,
      phone,
      shares,
      price,
      proof,
      timeInvested,
      amountInvested,
    } = formData;

    // Kiểm tra xem các trường đã được điền đầy đủ chưa
    if (
      !name ||
      !company ||
      !companyLogo ||
      !website ||
      !industry ||
      !country ||
      !phone ||
      !shares ||
      !price ||
      !proof ||
      !timeInvested ||
      !amountInvested
    ) {
      // Tìm trường đầu tiên mà thiếu dữ liệu
      const missingField = !name
        ? "Name"
        : !company
        ? "Company"
        : !companyLogo
        ? "Company Logo"
        : !website
        ? "Website"
        : !industry
        ? "Industry"
        : !country
        ? "Country"
        : !phone
        ? "Phone Number"
        : !shares
        ? "Number of Shares"
        : !price
        ? "Price"
        : !proof
        ? "Proof Documents"
        : !timeInvested
        ? "Time Invested"
        : "Amount Invested";

      // Hiển thị thông báo lỗi với trường đang thiếu dữ liệu
      message.error(`Please fill in the "${missingField}" field.`);
      return;
    }

    try {
      let proofUrl = formData.proof;
      if (proofUrl && proofUrl.startsWith("data:image")) {
        const file = dataURItoFile(proofUrl, "img");

        const uploadedproofUrl = await uploadImageToSupabase(file);
        if (uploadedproofUrl) {
          proofUrl = uploadedproofUrl;
        }
      }
      if (
        proofUrl &&
        !proofUrl.startsWith("https://dheunoflmddynuaxiksw.supabase.co")
      ) {
        if (proofUrl.startsWith("http://") || proofUrl.startsWith("https://")) {
          const uploadedproofUrl = await uploadImageFromURLToSupabase(proofUrl);
          if (uploadedproofUrl) {
            proofUrl = uploadedproofUrl;
          }
        }
      }

      let companyLogoUrl = formData.companyLogo;
      if (companyLogoUrl && companyLogoUrl.startsWith("data:image")) {
        const file = dataURItoFile(companyLogoUrl, "img");

        const uploadedproofUrl = await uploadImageToSupabase(file);
        if (uploadedproofUrl) {
          companyLogoUrl = uploadedproofUrl;
        }
      }

      formData.proof = proofUrl;
      formData.companyLogo = companyLogoUrl;
      formData.shares = parseNumber(formData.shares);
      formData.price = parseNumber(formData.price);
      formData.amountInvested = parseNumber(formData.amountInvested);

      if (SelectedID) {
        // If SelectedID exists, update the existing record
        const { error: updateError } = await supabase
          .from("fleamarket")
          .update(formData)
          .eq("id", SelectedID);
        if (updateError) {
          throw updateError;
        } else {
          message.success("Updated Flea-Market successfully.");
        }
      } else {
        // If SelectedID doesn't exist, insert a new record
        const { error: insertError } = await supabase
          .from("fleamarket")
          .insert([formData]);
        if (insertError) {
          throw insertError;
        } else {
          message.success("Create Flea-Market successfully.");
        }
      }

      // Clear form after successful submission

      setIsAddNewModalOpen(false);
    } catch (error) {
      console.error("Error inserting/updating data:", error.message);
      message.error(error.message);
    } finally {
      setSelectedID("");
    }
  };

  useEffect(() => {
    if (formData.shares && formData.price) {
      let total = parseNumber(formData.shares) * parseNumber(formData.price);
      setFormData({ ...formData, total: formatNumber(total) });
    }
  }, [formData.shares, formData.price]);

  const [proof, setProof] = useState(formData.proof); // State to store project image URL

  const handleProjectImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setProof(e.target.result); // Set the project image URL in state
    };
    reader.readAsDataURL(file); // Read the uploaded file
    // Update formData with the project image URL
  };
  const [companyLogo, setCompanyLogo] = useState(formData.companyLogo); // State to store project image URL

  const handleLogoImageUpload = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    // Assuming you're using FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setCompanyLogo(e.target.result); // Set the project image URL in state
    };
    reader.readAsDataURL(file); // Read the uploaded file
    // Update formData with the project image URL
  };

  useEffect(() => {
    setFormData({ ...formData, proof: proof });
  }, [proof]);
  useEffect(() => {
    setFormData({ ...formData, companyLogo: companyLogo });
  }, [companyLogo]);

  const handleRollSelect = (value) => {
    setFormData({ ...formData, role: value });
  };

  useEffect(() => {
    const fetchFleaMarketData = async () => {
      try {
        const { data: fleaMarketData, error } = await supabase
          .from("fleamarket")
          .select("*")
          .eq("id", SelectedID)
          .single();
        if (error) {
          throw error;
        }

        setFormData({
          ...formData,
          name: fleaMarketData.name,
          company: fleaMarketData.company,
          website: fleaMarketData.website,
          industry: fleaMarketData.industry,
          country: fleaMarketData.country,
          phone: fleaMarketData.phone,
          shares: fleaMarketData.shares,
          price: fleaMarketData.price,
          proof: fleaMarketData.proof,
          total: fleaMarketData.total,
          timeInvested: fleaMarketData.timeInvested,
          amountInvested: fleaMarketData.amountInvested,
          companyLogo: fleaMarketData.companyLogo,
        });
      } catch (error) {
        console.error("Error fetching Flea Market data:", error.message);
      }
    };

    if (SelectedID) {
      fetchFleaMarketData();
    }
  }, [SelectedID]);

  const handleCancel = () => {
    setSelectedID("");
    setIsAddNewModalOpen(false);
  };

  return (
    <Modal
      title="Add new Flea-Market project"
      visible={isAddNewModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Save"
      cancelText="Cancel"
      cancelButtonProps={{
        style: {
          borderRadius: "0.375rem",
          cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
        },
      }}
      okButtonProps={{
        style: {
          background: "#2563EB",
          borderColor: "#2563EB",

          color: "#fff",
          borderRadius: "0.375rem",
          cursor: "pointer", // Hiệu ứng con trỏ khi di chuột qua
        },
      }}
      centered={true}
    >
      <div
        key="1"
        className="w-full max-w-2xl mx-auto p-6 space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <h1 className="text-2xl font-bold text-center col-span-1 md:col-span-2">
          Registration Form
        </h1>
        <form
          className="grid gap-6 col-span-1 md:col-span-2"
          onSubmit={handleSubmit}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <div className="flex items-center">
                <UserIcon className="mr-2" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <div className="flex items-center">
                <MailIcon className="mr-2" />
                <Input
                  id="email"
                  placeholder="Enter your email"
                  disabled
                  value={user?.email}
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="company">Company</label>
              <div className="flex items-center">
                <BuildingIcon className="mr-2" />
                <Input
                  value={formData.company}
                  onChange={handleChange}
                  id="company"
                  placeholder="Enter your company name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="proof">Company Logo</label>
              <div className="flex items-center">
                <FileTextIcon className="mr-2" />
                <Input
                  id="proof"
                  type="file"
                  className="self-center"
                  onChange={handleLogoImageUpload}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="website">Website</label>
              <div className="flex items-center">
                <GlobeIcon className="mr-2" />
                <Input
                  value={formData.website}
                  onChange={handleChange}
                  id="website"
                  placeholder="Enter your website URL"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="industry">Industry</label>
              <div className="flex items-center">
                <FactoryIcon className="mr-2" />
                <Input
                  id="industry"
                  placeholder="Enter your industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="country">Country</label>
              <div className="flex items-center">
                <FlagIcon className="mr-2" />
                <Input
                  id="country"
                  placeholder="Enter your country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone">Phone Number</label>
              <div className="flex items-center">
                <PhoneIcon className="mr-2" />
                <Input
                  value={formData.phone}
                  onChange={handleChange}
                  id="phone"
                  placeholder="Enter your phone number"
                  required
                  type="tel"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <div className="flex items-center">
                <UserIcon className="mr-2" />
                <Select
                  id="role"
                  value={formData.role}
                  onValueChange={(value) => handleRollSelect(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="shares">Number of Shares</label>
              <div className="flex items-center">
                <ShareIcon className="mr-2" />
                <Input
                  value={formatNumber(formData.shares)}
                  onChange={handleChange}
                  id="shares"
                  placeholder="Enter number of shares"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2" />
                <Input
                  value={formatNumber(formData.price)}
                  onChange={handleChange}
                  id="price"
                  placeholder="Enter price per share"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="total">Total</label>
              <div className="flex items-center">
                <CalculatorIcon className="mr-2" />
                <Input
                  disabled
                  id="total"
                  placeholder="Total will be calculated automatically"
                  type="text"
                  value={formData.total}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="proof">Proof Documents</label>
              <div className="flex items-center">
                <FileTextIcon className="mr-2" />
                <Input
                  id="proof"
                  type="file"
                  className="self-center"
                  onChange={handleProjectImageUpload}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="timeInvested">Time Invested</label>
              <div className="flex items-center">
                <ClockIcon className="mr-2" />
                <Input
                  value={formData.timeInvested}
                  onChange={handleChange}
                  id="timeInvested"
                  placeholder="Enter time invested"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="amountInvested">Amount Invested</label>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2" />
                <Input
                  value={formatNumber(formData.amountInvested)}
                  onChange={handleChange}
                  id="amountInvested"
                  placeholder="Enter amount invested"
                  required
                  type="text"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function BuildingIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function CalculatorIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DollarSignIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function FactoryIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  );
}

function FileTextIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function GlobeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ShareIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
