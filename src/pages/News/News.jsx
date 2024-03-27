import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import image from "../Home/Components/founder&Business.jpg";

import AlertMsg from "../../components/AlertMsg";
import LoadingButtonClick from "../../components/LoadingButtonClick";

import Header from "../Home/Header";

function BlogPost({ articles, blogs }) {
  console.log("blogs", blogs);
  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto mt-28">
      <Header />
      <section className="bg-white darkBg">
        <div className="container sm:px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl darkTextWhite">
            Just Raised
          </h1>

          {/* {articles.map((article, index) => (
            <div
              key={index}
              className="my-28 border border-gray-200 rounded-lg shadow hover:border-transparent hover:shadow-lg transition-all duration-300 "
            >
              <div className="lg:-mx-6 lg:flex lg:items-center px-4 py-4 ">
                <img
                  className="object-cover mx-auto w-[34rem] lg:mx-6 rounded-xl h-[20rem]"
                  src={article.image_link}
                  alt=""
                />

                <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
                  <p className="text-sm text-blue-500 uppercase">Fundraising</p>

                  <a
                    href={article.link}
                    className="block mt-4 text-3xl font-semibold text-gray-800 hover:underline darkTextWhite"
                  >
                    {article.title}
                  </a>

                  <p className="mt-3 text-sm text-gray-500 darkTextGray md:text-sm line-clamp-5">
                    {article.abstract}
                  </p>

                  <a
                    href={article.link}
                    className="inline-block mt-2 text-blue-500 underline hover:text-blue-400 text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read more
                  </a>

                  <div className="flex items-center mt-6">
                    <img
                      className="object-cover object-center w-10 h-10 rounded-full"
                      src="https://w0.peakpx.com/wallpaper/432/249/HD-wallpaper-sprout-beauty-enviroment-natural-plant-seed-tree-thumbnail.jpg"
                      alt="Author"
                    />

                    <div className="mx-4">
                      {article.authors.map((author, index) => (
                        <h1
                          key={index}
                          className="text-sm text-gray-700 darkTextGray"
                        >
                          {author}
                        </h1>
                      ))}

                      <p className="text-sm text-gray-500 darkTextGray">
                        Author
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))} */}
          {blogs?.map((blog, index) => (
            <div
              key={index}
              className="my-28 border border-gray-200 rounded-lg shadow hover:border-transparent hover:shadow-lg transition-all duration-300 "
            >
              <div className="lg:-mx-6 lg:flex lg:items-center px-4 py-4 ">
                <img
                  className="object-cover mx-auto w-[34rem] lg:mx-6 rounded-xl h-[20rem]"
                  src={blog?.image_link ? blog?.image_link : image}
                  alt=""
                />

                <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
                  <p className="text-sm text-blue-500 uppercase">
                    FINANCIAL MODEL
                  </p>

                  <a
                    href={`/news/${blog?.id}`}
                    className="block mt-4 text-3xl font-semibold text-gray-800 hover:underline darkTextWhite"
                  >
                    {blog?.title}
                  </a>

                  <p className="mt-3 text-sm text-gray-500 darkTextGray md:text-sm line-clamp-5">
                    {blog?.content.article.introduction.text}
                  </p>

                  <a
                    href={`/news/${blog?.id}`}
                    className="inline-block mt-2 text-blue-500 underline hover:text-blue-400 text-sm"
                    // target="_blank"
                    rel="noreferrer"
                  >
                    Read more
                  </a>

                  <div className="flex items-center mt-6">
                    <img
                      className="object-cover object-center w-10 h-10 rounded-full"
                      src="https://w0.peakpx.com/wallpaper/432/249/HD-wallpaper-sprout-beauty-enviroment-natural-plant-seed-tree-thumbnail.jpg"
                      alt="Author"
                    />

                    <p className="text-sm text-gray-500 darkTextGray ml-5">
                      BeeKrowd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function News() {
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(10); // Số lượng bài viết ban đầu hiển thị

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);

        let { data: articles, error: articleError } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        let { data: blogs, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (articleError || blogError) {
          console.log(
            "Error fetching from Supabase:",
            articleError || blogError
          );
          // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi
          return;
        }

        setBlogs(blogs);
        setArticles(articles);
      } catch (error) {
        console.error("An error occurred:", error);
        // Xử lý lỗi, ví dụ: hiển thị một thông báo hoặc thông báo lỗi thân thiện
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, []);

  // Sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if (atBottom) {
        // Nếu người dùng cuộn đến cuối trang, tăng số lượng bài viết hiển thị thêm (ví dụ, thêm 5)
        setVisibleArticles((prevVisible) => prevVisible + 5);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <BlogPost
        // articles={articles.slice(0, visibleArticles)}
        blogs={blogs.slice(0, visibleArticles)}
      />

      <AlertMsg />
      <LoadingButtonClick isLoading={isLoading} />
    </>
  );
}

export default News;
