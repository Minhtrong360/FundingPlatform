import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

import AlertMsg from "../../components/AlertMsg";
import LoadingButtonClick from "../../components/LoadingButtonClick";

import Header from "../Home/Header";
import { Avatar, Button } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
function BlogPost({ articles }) {
  return (
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto mt-28">
      <Header />
      <section className="bg-white darkBg">
        <div className="container sm:px-6 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl darkTextWhite">
            Just Raised
          </h1>
          <Component />
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
                    className="block mt-4 text-3xl font-semibold text-gray-800 hover:underline darkTextWhite"
                  >
                    {article.title}
                  </a>

                  <p className="mt-3 text-sm text-gray-500 darkTextGray md:text-sm line-clamp-5">
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
          ))}
        </div>
      </section>
    </div>
  );
}



//  function Component() {
//   return (
//     <article className="max-w-2xl mx-auto my-8 p-4">
//       <header className="flex items-center mb-6">
//         <Avatar src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww" alt="Leyla Ludic">
//           LL
//         </Avatar>
//         <div className="ml-4">
//           <p className="text-sm font-semibold">Leyla Ludic</p>
//           <p className="text-sm text-gray-500">Jan 18 • 8 min read</p>
//         </div>
//         {/* <Button className="ml-auto" shape="circle" icon={<TwitterOutlined />} size="large">
//           Tweet
//         </Button> */}
//       </header>
//       <h1 className="text-3xl font-bold mb-4">Announcing a free plan for small teams</h1>
//       <p className="mb-6">
//         At preline, our mission has always been focused on bringing openness and transparency to the design process.
//         We've always believed that by providing a space where designers can share ongoing work not only empowers them to
//         make better products, it also helps them grow.
//       </p>
//       <p className="mb-6">
//         We're proud to be a part of creating a more open culture and to continue building a product that supports this
//         vision.
//       </p>
//       <figure>
//         <img
//           alt="A woman sitting at a table."
//           className="w-full h-auto mb-2"
//           height="320"
//           src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmluYW5jaWFsJTIwcGxhbm5pbmd8ZW58MHx8MHx8fDA%3D"
//           style={{
//             aspectRatio: "768/320",
//             objectFit: "cover",
//           }}
//           width="768"
//         />
//         <figcaption className="text-sm text-gray-500">A woman sitting at a table.</figcaption>
//       </figure>
//       <p className="mt-6">As we've grown, we've seen how Preline has helped companies such as ...</p>
//     </article>
//   );
// }



function Component() {
  // JSON data from the provided source
  const jsonData = {
    "article": {
      "introduction": {
        "text": "The article below will help you understand more about how to build a financial model and valuation for Alpha using AI technology.\n\nCurrently, AI can help you quickly and accurately build a financial model and valuation for your business. By utilizing AI technology, you can easily construct a financial model and valuation for your enterprise without needing deep financial knowledge.\n\nDetailed instructions on how to use AI are presented in detail and illustrated with images and videos in the following section of this article.\n\n"
      },
      "sections": [
        {
          "title": "1. This article is suitable for the following audiences\n\n",
          "content": "a. Founders of startups who want to build a financial model and valuation for their business.\n\nb. Investors who want to value businesses they are interested in.\n\nc. Financial experts who want to learn how to build financial models and valuations for businesses.\n\nd. Students and learners who want to master corporate finance knowledge.\n\ne. Managers who want to grasp corporate finance knowledge.\n\nf. Analysts looking for template models to practice analysis.\n\nBesides the main audiences mentioned above, this article is also suitable for anyone wanting to learn how to build a financial model and valuation for a business.\n\n"
        },
        {
          "title": "2. You need to identify the goal of building a financial model and valuation for Alpha.\n\n",
          "content": "The goals of building a financial model and valuation for Alpha may include:\n\na. Determining the value of the business: This goal helps you determine the value of Alpha based on financial data and business projections.\n\nb. Identifying the financial structure: This goal helps you determine the financial structure of Alpha, including equity capital structure, debt structure, additional capital structure.\n\nc. Identifying financial strategy: This goal helps you determine Alpha's financial strategy, including short-term, long-term, and mid-term financial strategies.\n\nd. Valuation for sales, mergers, acquisitions: This goal helps you determine the value of Alpha for sales, mergers, acquisitions.\n\nThese are just some basic goals, depending on the specific goals of the business, you can determine specific goals for building a financial model and valuation for Alpha.\n\n"
        },
        {
          "title": "3. You need to identify the audience for the financial model and valuation for Alpha.\n\n",
          "content": "The audience for the financial model and valuation for Alpha determines how information is presented, how data is calculated, and how results are presented. The professionalism level of the audience will affect how information is presented.\n\nFor example:\n\nIf the audience is professional investors, then you need to present information professionally, in detail, and specifically. If the audience is students and learners, then you need to present information in an easy-to-understand, accessible way.\n\nIf the audience is managers, then you need to present information in an overview, strategic, cost, profit, and risk manner.\n\nAfter identifying the goals and audience, you can start building a financial model and valuation for Alpha.\n\n"
        },
        {
          "title": "4. You need to identify the necessary assumptions to build a financial model and valuation for Alpha.\n\n",
          "content": "For a financial model and valuation, the assumption dataset is the most important and is the backbone of the model. Accurate assumptions will help you build an accurate financial model and valuation. Assumptions that lack logic and are unrealistic will lead to a flawed financial model and cannot be applied in real business, production.\n\nThis dataset includes metrics related to common metrics such as:\n\n- General assumptions: Company name, Number of forecast years, Currency, Starting cash balance, Income tax rate, etc.\n\n- Assumptions about customers: Number of new customers per month, growth rate of new customers per month, churn rate, cost to acquire new customers, etc.\n\n- Revenue-related assumptions: Sales channel, Distribution of customers from the sales channel into revenue calculation, Product name, Product price, Revenue discount, etc.\n\n- Cost-related assumptions: Cost name, Cost type, Cost value, Cost growth rate, etc.\n\n- Personnel-related assumptions: Position, Basic monthly salary, Annual salary increase rate, Number of personnel, etc.\n\n- Fixed asset-related assumptions: Name of the fixed asset to be purchased, Fixed asset value, Quantity of fixed assets to be purchased, etc.\n\n- Borrowing-related assumptions: Loan name, Loan amount, Interest rate, etc.\n\n- Capital raising-related assumptions: Name of the capital raising program or round, Percentage of equity offered, Form of capital raising, etc.\n\nWith AI support, making these assumptions has become much quicker, easier, and more efficient.\n\n"
        },
        {
          "title": "5. Build Alpha Financial Model and Valuation under 5 minutes with AI on BeeKrowd.\n\n",
          "content": "Step 1: Create an account on the BeeKrowd website.\n\nStep 2: Select the \"Financial Model\" tab on the menu bar.\n\nStep 3: Go to the input field named \"Build your financial model with AI\"\n\nStep 4: Enter your business model, in this case, Alpha.\n\nStep 5: Press the \"Build\" button to build the financial model and valuation for Alpha.\n\nStep 6: Wait for about 1 minute for the financial model and valuation for Alpha to be built.\n\nStep 7: View the proposed financial model and valuation results for Alpha with"
        }
      ]
    }
  };
  const renderContentWithLineBreaks = (content) => {
    // Replace newline characters with <br> elements
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <article className="max-w-2xl mx-auto my-8 p-4">
      <header className="flex items-center mb-8">
      <Avatar src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww" alt="Leyla Ludic">
          LL
        </Avatar>
        <div className="ml-4">
          <p className="text-sm font-semibold">Leyla Ludic</p>
          <p className="text-sm text-gray-500">Jan 18 • 8 min read</p>
        </div>
        {/* <Button className="ml-auto" shape="circle" icon={<TwitterOutlined />} size="large">
          Tweet
        </Button> */}
      </header>
       {/* Render introduction text */}
       <section>
        <p>{renderContentWithLineBreaks(jsonData.article.introduction.text)}</p>
      </section>

      {jsonData.article.sections.map((section, index) => (
        <section key={index}>
          <h2 className="text-xl font-semibold mb-8">{section.title}</h2>
          {/* Render content with line breaks */}
          <p>{renderContentWithLineBreaks(section.content)}</p>
        </section>
      ))}
    </article>
  );
}
  // return (
  //   <article className="max-w-2xl mx-auto my-8 p-4">
  //     <header className="flex items-center mb-6">
  //     <Avatar src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyfGVufDB8fDB8fHww" alt="Leyla Ludic">
  //         LL
  //       </Avatar>
  //       <div className="ml-4">
  //         <p className="text-sm font-semibold">Leyla Ludic</p>
  //         <p className="text-sm text-gray-500">Jan 18 • 8 min read</p>
  //       </div>
  //       {/* <Button className="ml-auto" shape="circle" icon={<TwitterOutlined />} size="large">
  //         Tweet
  //       </Button> */}
  //     </header>
  //     {jsonData.article.sections.map((section, index) => (
  //       <section key={index}>
  //         <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
  //         <p>{section.content}</p>
  //       </section>
  //     ))}
  //   </article>
  // );
// }




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
