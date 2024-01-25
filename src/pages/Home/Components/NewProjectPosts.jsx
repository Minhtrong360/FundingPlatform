// NewProjectPosts.js
import { useEffect, useState } from "react";
import Card from "./Card";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";
import Search from "./Search";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

const NewProjectPosts = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);

        // Truy vấn danh sách companies và sắp xếp theo thời gian tạo mới nhất
        let { data, error } = await supabase
          .from("company")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error(error.message);
          console.error("Lỗi khi truy vấn dữ liệu từ Supabase:", error);
        } else {
          // Lọc danh sách công ty dựa trên giá trị tìm kiếm
          if (searchTerm) {
            data = data.filter((company) =>
              company?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
            );
          }
          if (selectedIndustry) {
            data = data.filter((company) =>
              company?.industry?.some(
                (industry) =>
                  industry.toLowerCase() === selectedIndustry.toLowerCase()
              )
            );
          }

          // Tính toán tổng số trang
          const calculatedTotalPages = Math.ceil(data.length / itemsPerPage);
          setTotalPages(calculatedTotalPages);

          // Lấy danh sách công ty cho trang hiện tại
          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const currentPageCompanies = data.slice(startIndex, endIndex);

          setCompanies(currentPageCompanies);
        }
      } catch (error) {
        console.error("Lỗi khi truy vấn dữ liệu từ Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Gọi hàm fetchCompanies để lấy danh sách companies
    fetchCompanies();
  }, [page, searchTerm, selectedIndustry]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };
  const handleIndustryChange = (industry) => {
    console.log("handleIndustryChange", industry);
    setSelectedIndustry(industry);
    setPage(1);
  };

  return (
    <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
      <Search onSearch={handleSearch} onIndustryChange={handleIndustryChange} />
      <LoadingButtonClick isLoading={isLoading} />
      <>
        {companies.length === 0 ? (
          <div className="mt-24 text-center text-4xl font-bold text-gray-800 dark:text-gray-200">
            No result
          </div>
        ) : (
          <>
            <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-600 ease-out transform translate-x-0">
              {companies.map((company) => (
                <div key={company.id} className="flex justify-center">
                  <Card
                    key={company.id}
                    title={company.name}
                    description={company.description}
                    imageUrl={company.card_url}
                    buttonText="Read more"
                    project_id={company.project_id}
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button
                className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-2 bg-gray-200 text-gray-800 rounded-md">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 mx-2 bg-blue-600 text-white rounded-md"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default NewProjectPosts;
