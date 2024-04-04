import { Badge, Tooltip } from "antd";

import { useNavigate } from "react-router-dom";
import { formatNumber } from "../../features/CostSlice";
import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ProfileInfo({ company, canClick }) {
  console.log("company", company);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!company.id) return;

      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", company.project_id)
          .single();

        if (error) {
          throw error;
        }

        setProject(data);
      } catch (error) {
        console.log("Error fetching project:", error.message);
      }
    };

    fetchProject();
  }, [company]);
  const navigate = useNavigate();

  return (
    <div
      key="1"
      className={`max-w-7xl ${
        canClick === false ? "mt-16 " : "mx-auto mt-32"
      } px-4 sm:px-6 lg:px-8`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            {company?.name}
          </h1>
          <p className="mt-4 text-black">{company?.description}</p>
          <div className="mt-6 flex gap-4">
            <Tooltip
              title={
                company?.calendly
                  ? ""
                  : "You need to add a Calendly link or a Google Meeting"
              }
            >
              <Button
                className={`bg-blue-600 text-white ${
                  company?.calendly ? "" : "bg-blue-600"
                }`}
                onClick={() => navigate(company?.calendly)}
                // disabled={company?.calendly ? false : true}
              >
                Book meeting
              </Button>
            </Tooltip>
            {/* <Button type="primary" ghost>
              Learn more
            </Button> */}
          </div>
          <div className="mt-8">
            <div className="text-black font-semibold">Features:</div>

            <div className="grid grid-cols-2 sm:flex mt-2 space-x-0 sm:space-x-4 gap-4">
              {company?.industry?.map((industry, index) => (
                <Badge
                  key={index}
                  title={`Industry: ${industry}`}
                  className="min-h-6 bg-yellow-300 text-black px-2 py-1 rounded-md"
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-2">
          {company.card_url ? (
            <img
              alt="Insert your cover here"
              className="rounded-lg object-cover"
              height="400"
              src={company.card_url}
              style={{
                aspectRatio: "600/400",
                objectFit: "cover",
              }}
              width="600"
            />
          ) : (
            <div className="w-[400px] h-[300px] bg-gray-300"></div>
          )}

          {project?.verified && (
            <span className="absolute top-0 right-0 bg-yellow-300 text-black text-sm font-medium py-1.5 px-3 rounded-bl-lg">
              Verified profile
            </span>
          )}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border ">
          <div className="text-xl font-semibold">
            ${formatNumber(company?.target_amount)}
          </div>
          <div className="text-black mt-2">Target amount</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">
            ${formatNumber(company?.ticket_size)}
          </div>
          <div className="text-black mt-2">Min ticket size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">$0-50,000</div>
          <div className="text-black mt-2">Revenue range</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">
            {" "}
            ${formatNumber(company?.amountRaised)}
          </div>
          <div className="text-black mt-2">Raised before</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">{company?.teamSize}+</div>
          <div className="text-black mt-2">Team size</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Round</div>
          <div className="text-black mt-2">{company?.round}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Established</div>
          <div className="text-black mt-2">{company?.operationTime}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Offer</div>
          <div className="text-black mt-2">{company?.offer}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold">Type</div>
          <div className="text-black mt-2">{company?.offer_type}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 border-gray-200 border">
          <div className="text-xl font-semibold ">Website</div>
          <div
            className="text-black mt-2 truncate hover:cursor-pointer"
            onClick={() => window.open(company?.website)}
          >
            {company?.website.replace(/^https?:\/\/(www\.)?/i, "")}
          </div>
        </div>
        {/* Repeat the structure for other statistic cards */}
      </div>
    </div>
  );
}
