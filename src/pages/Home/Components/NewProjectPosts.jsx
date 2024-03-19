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
  const [allPage, setAllPage] = useState(1);
  const [companiesToRender, setCompaniesToRender] = useState([]);
  const [verifiedCompanies, setVerifiedCompanies] = useState([]);
  const [unverifiedCompanies, setUnverifiedCompanies] = useState([]);

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
  }, []);

  const handlePageChange = (newPage, tab) => {
    if (tab === "verified") {
      setVerifiedPage(newPage);
    } else if (tab === "unverified") {
      setUnverifiedPage(newPage);
    } else if (tab === "All") {
      setAllPage(newPage);
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
    } else if (currentTab === "All") {
      setAllPage(1);
    }
  };

  const goToLastPage = () => {
    let totalPages;
    let data;

    if (currentTab === "All") {
      data = companies;
    } else if (currentTab === "verified") {
      data = verifiedCompanies;
    } else if (currentTab === "unverified") {
      data = unverifiedCompanies;
    }

    totalPages = Math.ceil(data.length / itemsPerPage);

    if (currentTab === "verified") {
      setVerifiedPage(totalPages);
    } else if (currentTab === "unverified") {
      setUnverifiedPage(totalPages);
    } else if (currentTab === "All") {
      setAllPage(totalPages);
    }
  };

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

  const divideCompaniesByVerifiedStatus = async (companies) => {
    const verifiedCompanies = [];
    const unverifiedCompanies = [];

    for (const company of companies) {
      const verifiedStatus = await fetchVerifiedStatus(company.project_id);

      if (verifiedStatus) {
        verifiedCompanies.push(company);
      } else {
        unverifiedCompanies.push(company);
      }
    }

    return { verifiedCompanies, unverifiedCompanies };
  };

  useEffect(() => {
    const divideCompanies = async () => {
      setIsLoading(true);
      try {
        const { verifiedCompanies, unverifiedCompanies } =
          await divideCompaniesByVerifiedStatus(companies);
        setVerifiedCompanies(verifiedCompanies);
        setUnverifiedCompanies(unverifiedCompanies);
        setIsLoading(false);
      } catch (error) {
        console.log(
          "Error dividing companies by verified status:",
          error.message
        );
      }
      setIsLoading(false);
    };

    divideCompanies();
  }, [companies]);

  const currentPage =
    currentTab === "verified"
      ? verifiedPage
      : currentTab === "unverified"
      ? unverifiedPage
      : allPage;

  useEffect(() => {
    let data = [];
    if (currentTab === "verified") {
      data = verifiedCompanies;
    } else if (currentTab === "All") {
      data = companies;
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
        currentTab={currentTab}
      />
      <LoadingButtonClick isLoading={isLoading} />
      <div className="mt-10 flex justify-center">
        <button
          className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
            currentTab === "All"
              ? "bg-blue-600 text-black"
              : "bg-white text-gray-800 hover:bg-gray-50"
          } shadow-sm hover:cursor-pointer`}
          onClick={() => setCurrentTab("All")}
        >
          All
        </button>
        <button
          className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
            currentTab === "verified"
              ? "bg-blue-600 text-black"
              : "bg-white text-gray-800 hover:bg-gray-50"
          } shadow-sm hover:cursor-pointer`}
          onClick={() => setCurrentTab("verified")}
        >
          Verified
        </button>
        <button
          className={`m-2 py-3 px-4 inline-flex items-center gap-x-2 text-sm rounded-lg border ${
            currentTab === "unverified"
              ? "bg-blue-600 text-black"
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
                  <div key={index} className="group flex justify-center">
                    {company ? (
                      <Card
                        key={company.id}
                        title={company.name}
                        description={company.description}
                        imageUrl={company.card_url}
                        buttonText="More"
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
              {/* <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <SkipPreviousIcon />
              </button> */}
              <button
                className="flex items-center justify-center px-4 py-2 mx-1 text-black capitalize bg-gray-200 rounded-md  rtl:-scale-x-100 "
                onClick={() => handlePageChange(currentPage - 1, currentTab)}
                disabled={currentPage === 1}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="flex flex-wrap items-center">
                {[...Array(totalPages).keys()].map((pageNumber) => {
                  if (
                    totalPages <= 5 ||
                    pageNumber + 1 === currentPage ||
                    pageNumber === 0 ||
                    pageNumber === totalPages - 1 ||
                    (pageNumber === currentPage - 1 &&
                      currentPage > 2 &&
                      currentPage < totalPages - 1) ||
                    (pageNumber === currentPage - 2 &&
                      currentPage > 3 &&
                      currentPage < totalPages - 1) ||
                    (pageNumber === currentPage && currentPage < totalPages - 2)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={`flex items-center justify-center px-4 py-2 mx-1 text-black capitalize rounded-md  rtl:-scale-x-100 ${
                          pageNumber + 1 === currentPage
                            ? "bg-blue-600 hover:bg-blue-800"
                            : "bg-gray-200 hover:bg-gray-400"
                        }`}
                        onClick={() =>
                          handlePageChange(pageNumber + 1, currentTab)
                        }
                      >
                        {pageNumber + 1}
                      </button>
                    );
                  } else if (
                    (pageNumber === 1 && currentPage > 3) ||
                    (pageNumber === totalPages - 2 &&
                      currentPage < totalPages - 2)
                  ) {
                    return <span key={pageNumber}>...</span>;
                  } else {
                    return null;
                  }
                })}
              </div>

              <button
                className="flex items-center justify-center px-4 py-2 mx-1 text-black capitalize bg-gray-200 rounded-md  rtl:-scale-x-100 "
                onClick={() => handlePageChange(currentPage + 1, currentTab)}
                disabled={currentPage === totalPages}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <SkipNextIcon />
              </button> */}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default NewProjectPosts;
