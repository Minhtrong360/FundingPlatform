import { useEffect, useState } from "react";
import Card from "./Card";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";
import Search from "./Search";
import LoadingButtonClick from "../../../components/LoadingButtonClick";

import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const NewProjectPosts = () => {
  const [companies, setCompanies] = useState([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("verified");
  const [verifiedPage, setVerifiedPage] = useState(1);
  const [unverifiedPage, setUnverifiedPage] = useState(1);
  const [companiesToRender, setCompaniesToRender] = useState([]);

  // First useEffect - Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        let { data, error } = await supabase
          .from("company")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          toast.error(error.message);
          console.error("Error fetching data from Supabase:", error);
        } else {
          setCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []); // Empty dependency array to run only on mount

  const handlePageChange = (newPage, tab) => {
    if (tab === "verified") {
      setVerifiedPage(newPage);
    } else if (tab === "unverified") {
      setUnverifiedPage(newPage);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    setPage(1);
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    setPage(1);
  };

  const goToFirstPage = () => {
    if (currentTab === "verified") {
      setVerifiedPage(1);
    } else if (currentTab === "unverified") {
      setUnverifiedPage(1);
    }
  };

  const goToLastPage = () => {
    const totalPages =
      currentTab === "verified"
        ? Math.ceil(verifiedCompanies.length / itemsPerPage)
        : Math.ceil(unverifiedCompanies.length / itemsPerPage);

    if (currentTab === "verified") {
      setVerifiedPage(totalPages);
    } else if (currentTab === "unverified") {
      setUnverifiedPage(totalPages);
    }
  };

  // Tạo một hàm async để lấy trạng thái verified từ bảng projects
  const fetchVerifiedStatus = async (companyId) => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("verified")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching verified status:", error.message);
        return null;
      } else {
        return data.verified;
      }
    } catch (error) {
      console.log("Error fetching verified status:", error.message);

      return null;
    }
  };

  const [verifiedCompanies, setVerifiedCompanies] = useState([]);
  const [unverifiedCompanies, setUnverifiedCompanies] = useState([]);

  // Tạo một hàm để chia companies thành hai danh sách verified và unverified
  const divideCompaniesByVerifiedStatus = async (companies) => {
    const verifiedCompanies = [];
    const unverifiedCompanies = [];

    // Duyệt qua mỗi công ty
    for (const company of companies) {
      // Lấy trạng thái verified từ bảng projects

      const verifiedStatus = await fetchVerifiedStatus(company.project_id);

      // Chia công ty vào danh sách tương ứng dựa vào trạng thái verified
      if (verifiedStatus) {
        verifiedCompanies.push(company);
      } else {
        unverifiedCompanies.push(company);
      }
    }

    return { verifiedCompanies, unverifiedCompanies };
  };

  // Sử dụng hàm divideCompaniesByVerifiedStatus trong useEffect để chia companies
  useEffect(() => {
    const divideCompanies = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        const { verifiedCompanies, unverifiedCompanies } =
          await divideCompaniesByVerifiedStatus(companies);
        setVerifiedCompanies(verifiedCompanies);
        setUnverifiedCompanies(unverifiedCompanies);
        setIsLoading(false); // Bắt đầu loading
      } catch (error) {
        console.log(
          "Error dividing companies by verified status:",
          error.message
        );
      }
      setIsLoading(false);
    };

    divideCompanies();
  }, [companies, searchTerm, selectedIndustry]);

  const currentPage = currentTab === "verified" ? verifiedPage : unverifiedPage;

  // Second useEffect - Filter and paginate companies
  useEffect(() => {
    let data = [];
    if (currentTab === "verified") {
      data = verifiedCompanies;
    } else {
      data = unverifiedCompanies;
    }

    if (searchTerm) {
      data = data.filter((company) =>
        company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Calculate total pages
    const calculatedTotalPages = Math.ceil(data.length / itemsPerPage);
    setTotalPages(calculatedTotalPages);

    setCompaniesToRender(data);
  }, [
    currentTab,
    companies,
    page,
    searchTerm,
    selectedIndustry,
    verifiedCompanies,
    unverifiedCompanies,
  ]);

  console.log("companyToRender", companiesToRender);
  console.log("companies", companies);

  return (
    <div className="max-w-[85rem] px-4 py-1 sm:px-6 lg:px-8 lg:py-1 mx-auto">
      <Search
        onSearch={handleSearch}
        onIndustryChange={handleIndustryChange}
        companies={companiesToRender}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
      />
      <LoadingButtonClick isLoading={isLoading} />
      <div className="mt-10 flex justify-center">
        <button
          className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
            currentTab === "verified"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 hover:bg-gray-50"
          } shadow-sm hover:cursor-pointer`}
          onClick={() => setCurrentTab("verified")}
        >
          Verified
        </button>
        <button
          className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
            currentTab === "unverified"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 hover:bg-gray-50"
          } shadow-sm hover:cursor-pointer`}
          onClick={() => setCurrentTab("unverified")}
        >
          Unverified
        </button>
      </div>
      <>
        {companiesToRender.length === 0 ? (
          <div className="mt-20 text-center text-4xl font-semibold text-gray-800 darkTextGray">
            No result
          </div>
        ) : (
          <>
            <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
              {[...Array(itemsPerPage)].map((_, index) => {
                const company =
                  companiesToRender[(currentPage - 1) * itemsPerPage + index];
                return (
                  <div key={index} className="flex justify-center">
                    {company ? (
                      <Card
                        key={company.id}
                        title={company.name}
                        description={company.description}
                        imageUrl={company.card_url}
                        buttonText="Read more"
                        project_id={company.project_id}
                      />
                    ) : (
                      <div className="w-[30vw] h-[55vh]"></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <SkipPreviousIcon />
              </button>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={() => handlePageChange(currentPage - 1, currentTab)}
                disabled={currentPage === 1}
              >
                <ArrowLeftIcon fontSize="large" />
              </button>
              <span className=" sm:px-4 sm:py-1 sm:mx-2  text-gray-800 rounded-md inline-flex flex-nowrap justify-center items-center  flex-shrink-0">
                Page {currentPage} of{" "}
                {Math.ceil(companiesToRender.length / itemsPerPage)}
              </span>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={() => handlePageChange(currentPage + 1, currentTab)}
                disabled={
                  currentTab === "verified"
                    ? currentPage === totalPages
                    : currentPage === totalPages
                }
              >
                <ArrowRightIcon fontSize="large" />
              </button>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={goToLastPage}
                disabled={
                  currentPage ===
                  (currentTab === "verified"
                    ? Math.ceil(verifiedCompanies.length / itemsPerPage)
                    : Math.ceil(unverifiedCompanies.length / itemsPerPage))
                }
              >
                <SkipNextIcon />
              </button>
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default NewProjectPosts;
