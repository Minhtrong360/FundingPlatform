import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";
// import image from "../Home/Components/founder&Business.jpg";
import Header from "../Home/Header";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import { Avatar } from "antd";
import { formatDate } from "../../features/DurationSlice";
import Header2 from "../Home/Header2";

const renderContentWithLineBreaks = (content) => {
  // Replace newline characters with <br> elements
  return content.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

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
          <Header2 />
          <article className="max-w-2xl mx-auto mt-16 p-4">
            <header className="flex items-center mb-8">
              <Avatar
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww"
                alt="Leyla Ludic"
              ></Avatar>
              <div className="ml-4">
                <p className="text-sm font-semibold">
                  {blog.author ? blog.author : "BeeKrowd"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(blog.publish_date)}
                </p>
              </div>
              {/* <Button className="ml-auto" shape="circle" icon={<TwitterOutlined />} size="large">
          Tweet
        </Button> */}
            </header>
            {/* Render introduction text */}

            <div className="text-3xl font-bold my-10">{blog.title}</div>

            <section>
              <p>
                {renderContentWithLineBreaks(
                  blog.content.article.introduction.text
                )}
              </p>
              {blog.content.article.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="text-xl font-semibold mb-8">
                    {section.title}
                  </h2>
                  {/* Render content with line breaks */}
                  <p>{renderContentWithLineBreaks(section.content)}</p>
                </section>
              ))}
            </section>
          </article>
        </div>
      )}
    </>
  );
}

export default DetailBlog;
