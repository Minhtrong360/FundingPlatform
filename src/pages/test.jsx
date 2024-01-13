import React, { useState, useEffect } from "react";

const NewsComponent = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://newsapi.org/v2/everything?q=Tesla%20Cybertruck%20price&from=2023-12-25&to=2023-12-01&sortBy=relevancy&apiKey=735ebe2d42854133bf54ea63129634a9"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setArticles(data.articles.slice(0, 20)); // Get only the first 20 articles
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {articles.map((article, index) => (
        <div key={index}>
          <h3 className="font-medium">{article.title}</h3>
          <p>{article.description}</p>
          <p>{article.content}</p>
          <p>{article.url}</p>
          {/* Here you can add more details from the article */}
          <p>------------</p>
        </div>
      ))}
    </div>
  );
};

export default NewsComponent;
