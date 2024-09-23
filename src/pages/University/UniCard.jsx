import { Tag } from "antd";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  CalendarIcon,
  UsersIcon,
  CodeIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Card as CardShadcn,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

const UniCard = ({
  data,
  codeInCompetition,
  setSelectedCodeFull,
  onSelectCode,
  filterProjectsByCode,
  projectCounts,
}) => {
  const [universityInfo, setUniversityInfo] = useState("");
  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const { data: uniInfo, error } = await supabase
          .from("workspace")
          .select("*")
          .eq("UniID", data?.UniID);

        if (error) {
          throw error;
        }

        setUniversityInfo(uniInfo[0]);
      } catch (error) {
        console.error("Error fetching code data:", error);
      }
    };

    fetchCodeData();
  }, [data]);

  return (
    <div
      onClick={() => {
        if (setSelectedCodeFull) {
          setSelectedCodeFull(data);
        }
        if (onSelectCode) {
          onSelectCode(data.id);
        }
        if (filterProjectsByCode) {
          filterProjectsByCode(data.id);
        }
        if (codeInCompetition) {
          codeInCompetition(data.code);
        }
      }}
    >
      <CardShadcn
        key={data?.id}
        className="bg-white overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col justify-between h-full"
      >
        <CardHeader className="p-0">
          <img
            src={
              data?.avatar_url ||
              "https://media.istockphoto.com/id/1342229191/vi/anh/m%E1%BB%99t-h%E1%BB%93-n%C6%B0%E1%BB%9Bc-c%C3%B3-h%C3%ACnh-d%E1%BA%A1ng-c%E1%BB%A7a-c%C3%A1c-l%E1%BB%A5c-%C4%91%E1%BB%8Ba-tr%C3%AAn-th%E1%BA%BF-gi%E1%BB%9Bi-%E1%BB%9F-gi%E1%BB%AFa-thi%C3%AAn-nhi%C3%AAn-hoang-s%C6%A1-m%E1%BB%99t-ph%C3%A9p-%E1%BA%A9n.jpg?s=2048x2048&w=is&k=20&c=Yf6EtqbY4M9wanhrAhqFtyWXf1N0usDnSQXF8HUX3L0="
            }
            alt="Company Avatar"
            width={300}
            height={200}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl font-bold">{data?.name}</CardTitle>

            <Badge
              variant={data?.publish ? "primary" : "secondary"}
              className="ml-2"
            >
              {data.publish ? "Published" : "Not public"}
            </Badge>
          </div>
          <p className="text-sm text-start text-muted-foreground mb-4 line-clamp-3">
            {data?.description}
          </p>

          <TooltipProvider>
            <div className="flex flex-col space-y-2 mb-4">
              <Tooltip>
                <TooltipTrigger className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  <CodeIcon className="mr-2 h-4 w-4" />
                  Code: {data.code}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Project Code</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Expires: {data.expired_at}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Expiration Date</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Enrolled Teams: {projectCounts[data.id] || 0}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Number of Enrolled Teams</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
        <CardFooter className="flex justify-between p-4">
          <Button variant="outline" className="w-full group flex-1 mr-2">
            More
            <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </CardShadcn>
    </div>
  );
};

export default UniCard;
