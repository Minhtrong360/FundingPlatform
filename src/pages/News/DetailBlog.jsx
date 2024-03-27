import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import image from "../Home/Components/founder&Business.jpg";
import Header from "../Home/Header";
import LoadingButtonClick from "../../components/LoadingButtonClick";

function DetailBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: blogData, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setBlog(blogData);
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {isLoading ? (
        <LoadingButtonClick isLoading={isLoading} />
      ) : (
        <div className="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
          <Header />
          <div className="max-w-2xl mt-28">
            {/* Avatar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
                <div className="flex-shrink-0">
                  <img
                    className="w-[60px] h-[60px] rounded-full"
                    src={blog.image_link ? blog.image_link : image}
                    alt="Description"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex-col justify-between items-center gap-x-2">
                    <div className="text-base font-semibold text-gray-800 py-2">
                      BeeKrowd
                    </div>
                    <div className="text-sm py-2">
                      {new Date(blog.publish_date).toISOString().split("T")[0]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Avatar */}

            {/* Content */}
            <div className="space-y-5 md:space-y-8 mt-14">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold md:text-3xl dark:text-white my-10">
                  {blog?.title}
                </h2>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>

              {/* Other content goes here */}
            </div>
            {/* End Content */}
          </div>
        </div>
      )}
    </>
  );
}

export default DetailBlog;
