import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

import AlertMsg from "../../components/AlertMsg";
import LoadingButtonClick from "../../components/LoadingButtonClick";

import Header from "../Home/Header";

function BlogPost({ articles }) {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto mt-28">
      <Header />
      <section className="bg-white dark:bg-gray-900">
        <div className="container sm:px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
            Just Raised
          </h1>

          {articles.map((article, index) => (
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
                {/* <ResizeImage
                imageUrl={article.image_link}
                width={566}
                height={352}
              /> */}

                <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
                  <p className="text-sm text-blue-500 uppercase">Fundraising</p>

                  <a
                    href={article.link}
                    className="block mt-4 text-3xl font-semibold text-gray-800 hover:underline dark:text-white"
                  >
                    {article.title}
                  </a>

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm line-clamp-5">
                    {article.abstract}
                  </p>

                  <a
                    href={article.link}
                    className="inline-block mt-2 text-blue-500 underline hover:text-blue-400"
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
                          className="text-sm text-gray-700 dark:text-gray-200"
                        >
                          {author}
                        </h1>
                      ))}

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Author
                      </p>
                    </div>
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
  const [visibleArticles, setVisibleArticles] = useState(10); // Số lượng bài viết ban đầu hiển thị
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);

        let { data: articles, error } = await supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching articles from Supabase:", error);
          // Xử lý lỗi ở đây, ví dụ: hiển thị thông báo lỗi
          return;
        }

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
      <BlogPost articles={articles.slice(0, visibleArticles)} />
      <AlertMsg />
      <LoadingButtonClick isLoading={isLoading} />
    </>
  );
}

export default News;
