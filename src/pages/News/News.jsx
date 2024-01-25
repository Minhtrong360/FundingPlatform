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
        <div className="container px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
            From the blog
          </h1>

          {articles.map((article, index) => (
            <div key={index} className="mt-8 lg:-mx-6 lg:flex lg:items-center">
              <img
                className="object-cover  w-full lg:mx-6 lg:w-1/2 rounded-xl h-[22rem] "
                src={article.image_link}
                alt=""
              />

              <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
                <p className="text-sm text-blue-500 uppercase">category</p>

                <a
                  href={article.link}
                  className="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white"
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
                    src="https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80"
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
          ))}
        </div>
      </section>
    </div>
  );
}

function News() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Number of articles per page
  const [totalPages, setTotalPages] = useState(0);
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
          // Handle error here, e.g., display an error message
          return;
        }

        // Calculate total pages
        const calculatedTotalPages = Math.ceil(articles.length / perPage);
        setTotalPages(calculatedTotalPages);

        // Get articles for the current page
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const currentArticles = articles.slice(startIndex, endIndex);

        setArticles(currentArticles);
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle the error, e.g., show a toast or a friendly message
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, [page, perPage]);
  console.log("articles", articles);

  return (
    <>
      <BlogPost articles={articles} />
      <AlertMsg />
      <LoadingButtonClick isLoading={isLoading} />
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center mb-28">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-2 text-blue-500 bg-white border border-blue-500 rounded-md hover:bg-blue-700 hover:text-white"
        >
          Previous Page
        </button>
        <span className="px-4 py-2 mx-2 bg-gray-200 text-gray-800 rounded-md">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 mx-2 text-blue-500 bg-white border border-blue-500 rounded-md hover:bg-blue-700 hover:text-white"
        >
          Next Page
        </button>
      </div>
    </>
  );
}

export default News;
