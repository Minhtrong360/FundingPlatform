import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import Card from "../Home/Components/Card";
import { LinearProgress } from "@mui/material";

const UniversityDetailPage = () => {
  const { universityId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("departments")
          .select("*")
          .eq("university_id", universityId);
        if (error) throw error;
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [universityId]);

  if (isLoading) return <LinearProgress />;

  return (
    <div className="container mx-auto my-12">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map((department) => (
          <Card
            key={department.id}
            title={department.name}
            description={department.description}
            imageUrl={department.imageUrl}
            buttonText="View Profiles"
            onClick={() => console.log("View Profiles")} // handle navigation to profiles
          />
        ))}
      </div>
    </div>
  );
};

export default UniversityDetailPage;
