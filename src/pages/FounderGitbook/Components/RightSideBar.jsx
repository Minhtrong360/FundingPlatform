import { Button } from "../../..//components/ui/button";
import { Input } from "../../..//components/ui/input";
import { Card, CardContent } from "../../..//components/ui/card";
import { Badge } from "../../..//components/ui/badge";
import { supabase } from "../../../supabase";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RightSideBar({ company, currentProject }) {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchCompanies = async () => {
    try {
      // Fetch projects including their verified status and status, avoiding stealth status projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, verified, status") // Get verified status and status along with id
        .neq("status", "stealth")
        .neq("stamp", "lesson");

      if (projectsError) {
        message.error(projectsError.message);
        return;
      }

      const projectIds = projects.map((project) => project.id);

      // Fetch companies based on project ids
      const { data: fetchedCompanies, error: companiesError } = await supabase
        .from("company")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false });

      if (companiesError) {
        message.error(companiesError.message);
        return;
      }

      // Create maps to store verified status and status for quick lookup
      const verifiedStatusMap = new Map();
      const statusMap = new Map();

      projects.forEach((project) => {
        verifiedStatusMap.set(project.id, project.verified);
        statusMap.set(project.id, project.status);
      });

      // Attach verified status and status directly to each company object
      fetchedCompanies.forEach((company) => {
        company.verifiedStatus =
          verifiedStatusMap.get(company.project_id) || false;
        company.status = statusMap.get(company.project_id) || "Unknown"; // Default to "Unknown" if no status found
      });

      setCompanies(fetchedCompanies);
    } catch (error) {
      message.error("An error occurred while fetching companies.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    let data = companies;

    if (searchTerm) {
      data = data.filter((company) =>
        company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(data);
    } else setSuggestions([]);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filteredSuggestions = companies.filter((company) =>
        company.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const navigate = useNavigate();

  const handleSuggestionClick = (company) => {
    navigate(`/profile/${company?.project_id}`);
    window.location.reload();
    setSuggestions([]);
    setSearchTerm("");
  };

  const [blogData, setBlogData] = useState([]); // Lưu dữ liệu hiện tại (sau khi filter hoặc gốc)

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    const { data, error } = await supabase
      .from("blogsV2")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error);
    } else if (data) {
      setBlogData(data); // Hiển thị dữ liệu ban đầu
    } else {
      setBlogData([]);
    }
  };
  console.log("blogData", blogData);
  return (
    <div className="space-y-4" style={{ position: "sticky", top: "10px" }}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search..."
          className="pr-8"
          value={searchTerm}
          onChange={handleSearchChange} // Thêm sự kiện onChange này
        />
        <svg
          className="absolute right-2 top-[1.375rem] h-4 w-4 text-muted-foreground"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      {suggestions.length > 0 && (
        <ul className=" mt-2 top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {suggestions.map((company, index) => (
            <li
              key={index}
              className="text-left text-sm px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
              onClick={() => handleSuggestionClick(company)}
            >
              <span>{company.name}</span>
              <Badge
                className={
                  company?.status === "public"
                    ? "bg-blue-600 text-white"
                    : "bg-[#ABFB4F]"
                }
              >
                {company?.status.trim().charAt(0).toUpperCase() +
                  company?.status.slice(1)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <Card className="!bg-white">
        <CardContent className="p-4 ">
          <h3 className="text-xl font-bold mb-3">Categories</h3>{" "}
          <ul className="space-y-1">
            {company?.industry?.map((category) => (
              <li key={category} className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-black rounded-full"></span>
                <span className="text-base">{category}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="!bg-white">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2">Recent Posts:</h4>
          <ul className="space-y-4">
            {blogData?.slice(0, 3)?.map((post, index) => (
              <li
                key={index}
                className="flex flex-row"
                onClick={() => navigate("/blog")}
              >
                <img
                  src={post.cover}
                  alt={post.title}
                  width={100}
                  height={50}
                  className="mr-2 rounded-md"
                />

                <div className="block group hover:cursor-pointer">
                  <h4
                    className="post-title !text-sm"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </h4>
                  <div className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* <div>
        <h4 className="font-semibold mb-2">Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {company?.keyWords?.split(",").map((keyWord, index) => {
            const trimmedKeyword = keyWord?.trim();
            if (trimmedKeyword) {
              const capitalizedKeyword =
                trimmedKeyword?.charAt(0).toUpperCase() +
                trimmedKeyword?.slice(1);
              return (
                <Badge key={index} className="bg-gray-100">
                  {capitalizedKeyword}
                </Badge>
              );
            }
            return null;
          })}
        </div>
      </div> */}

      <Card className="bg-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">How can we help you?</h3>
          <p className="text-gray-600 mb-4">
            We are here to help you! Tell us how we can help and we'll get in
            touch within next 24hrs.
          </p>
          <form className="space-y-4">
            <Input placeholder="Enter your email" />
            <Button className="w-full bg-[#18181B] text-white">
              Contact Us
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
