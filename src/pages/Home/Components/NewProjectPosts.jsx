import { useEffect, useState } from "react";
import Card from "./Card";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";

const NewProjectPosts = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Khởi tạo Supabase Client với thông tin kết nối của bạn

    // Truy vấn danh sách companies và sắp xếp theo thời gian tạo mới nhất
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("company")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        toast.error(error.message);
        console.error("Lỗi khi truy vấn dữ liệu từ Supabase:", error);
      } else {
        setCompanies(data);
      }
    };

    // Gọi hàm fetchCompanies để lấy danh sách companies
    fetchCompanies();
  }, []);

  return (
    <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
      <div className="text-center mt-28 mb-28">
        <h3
          id="profiles"
          className="text-3xl sm:text-5xl font-bold text-gray-800 dark:text-gray-200"
        >
          New created profiles
        </h3>
      </div>
      {/* Hiển thị danh sách companies */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-600 ease-out transform translate-x-0">
        {companies.map((company) => (
          <Card
            key={company.id}
            title={company.name}
            description={company.description}
            imageUrl={company.card_url}
            buttonText="Read more"
            project_id={company.project_id}
          />
        ))}
      </div>
    </div>
  );
};

export default NewProjectPosts;
