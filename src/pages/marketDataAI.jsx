import React, { useState } from "react";
import axios from "axios";
import OpenAI from "openai";
import ArticleBrief from "./FounderGitbook/ArticalBrief";
// import { toast } from "react-toastify";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_openaiApiKey,
  dangerouslyAllowBrowser: true,
});

async function summarizeKeyInformation(text, query) {
  try {
    if (!navigator.onLine) {
      // Không có kết nối Internet
      message.error("No internet access.");
      return;
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a system",
        },
        {
          role: "user",
          content: `Find only information with statistics, numbers, figures most relevant to ${query} that can be found in: ${text}. Show results in max 5 bullet points and numbering order list them.`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log(`An error occurred: ${error}`);
    return "Error in summarizing information";
  }
}

async function fetchNewsAndSummarize(query) {
  const url = "https://newsapi.org/v2/everything";
  const params = {
    q: query,
    searchIn: "content",
    language: "en",
    from: "2023-12-25",
    to: "2023-01-25",
    sortBy: "relevancy",
    apiKey: process.env.REACT_APP_newsApiKey,
  };

  const resultsArray = []; // Initialize an empty array to store results

  try {
    if (!navigator.onLine) {
      // Không có kết nối Internet
      message.error("No internet access.");
      return;
    }
    const response = await axios.get(url, { params });

    const articles = response.data.articles.slice(0, 5);

    for (const article of articles) {
      const text = article.description; // Use 'content' if it's more complete

      const extractedInfo = await summarizeKeyInformation(text, query);
      const lines = extractedInfo.split("\n");

      // Add the extracted information to the results array
      resultsArray.push({
        title: article.title,
        extractedInfo: lines,
        url: article.url,
      });
    }

    return resultsArray; // Return the array of results
  } catch (error) {
    console.error(`Failed to retrieve data. Error: ${error}`);
    return resultsArray; // Return an empty array in case of an error
  }
}

function MarketDataAI() {
  const [search, setSearch] = useState("Electric vehicle market size");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      if (!navigator.onLine) {
        // Không có kết nối Internet
        message.error("No internet access.");
        return;
      }
      const results = await fetchNewsAndSummarize(search);

      setResults(results);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false); // This will be executed regardless of success or error
    }
  };

  const handleCancel = () => {
    setResults([]);
    setSearch("");
  };

  return (
    <div className="flex items-start justify-center  px-4 pt-4  text-center sm:block sm:p-0">
      <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl darkBg sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
        <h3
          className="text-lg font-medium leading-6 text-gray-800 capitalize darkTextWhite"
          id="modal-title"
        >
          Market data AI
        </h3>
        <p className="mt-2 text-sm text-gray-500 darkTextGray">
          Search info from TechCrunch, Forbes, WSJ...
        </p>

        <form className="mt-4">
          <label className="block mt-3" htmlFor="email">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Keywords"
              value={search}
              onChange={handleSearchChange}
              className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 darkBorderGray darkBg darkTextGray darkFocusBorder"
            />
          </label>

          <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading ? true : false}
              className="w-full px-4 py-1 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 darkTextGray darkBorderGray darkHoverBgBlue hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSearch}
              disabled={isLoading ? true : false}
              className={`w-full px-4 py-1 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform ${
                isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40`}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {results.length > 0 && (
        <div>
          {results.map((result, index) => (
            <ArticleBrief key={index} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MarketDataAI;
