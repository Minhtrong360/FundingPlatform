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
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  // Second useEffect - Filter and paginate companies
  useEffect(() => {
    let data = companies;

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

    // Paginate companies
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setFilteredCompanies(data.slice(startIndex, endIndex));
  }, [companies, page, searchTerm, selectedIndustry]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
    setPage(1);
  };

  const goToLastPage = () => {
    setPage(totalPages);
  };

  return (
    <div className="max-w-[85rem] px-4 py-1 sm:px-6 lg:px-8 lg:py-1 mx-auto">
      <Search
        onSearch={handleSearch}
        onIndustryChange={handleIndustryChange}
        companies={companies}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
      />
      <LoadingButtonClick isLoading={isLoading} />
      <>
        {filteredCompanies.length === 0 ? (
          <div className="mt-24 text-center text-4xl font-semibold text-gray-800 darkTextGray">
            No result
          </div>
        ) : (
          <>
            <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-16 transition-all duration-600 ease-out transform translate-x-0">
              {[...Array(itemsPerPage)].map((_, index) => {
                const company = filteredCompanies[index];
                return (
                  <div key={index} className="group flex justify-center">
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
                disabled={page === 1}
              >
                <SkipPreviousIcon />
              </button>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ArrowLeftIcon fontSize="large" />
              </button>
              <span className=" sm:px-4 sm:py-1 sm:mx-2  text-gray-800 rounded-md inline-flex flex-nowrap justify-center items-center  flex-shrink-0">
                Page {page} of {totalPages}
              </span>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ArrowRightIcon fontSize="large" />
              </button>
              <button
                className="sm:px-4 sm:py-1 sm:mx-2  text-black rounded-md"
                onClick={goToLastPage}
                disabled={page === totalPages}
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
