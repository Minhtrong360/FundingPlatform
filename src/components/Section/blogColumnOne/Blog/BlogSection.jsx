import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TwoBlogCard from "./../../../ui/Cards/TwoBlogCard";
import CategoryCard from "../../../ui/Cards/CategoryCard";
import PostCard from "../../../ui/Cards/PostCard";
import TagCard from "../../../ui/Cards/TagCard";

const BlogSection = () => {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./db/blogsTwo.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBlogData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="section zubuz-section-padding2">
      <div className="container">
        <div className="row">
          <div div className="col-lg-8">
            {blogData.map((post) => (
              <TwoBlogCard key={post?.id} post={post} />
            ))}
            <div class="zubuz-navigation">
              <nav class="navigation pagination" aria-label="Posts">
                <div class="nav-links">
                  <span aria-current="page" class="page-numbers current">
                    1
                  </span>
                  <Link class="page-numbers" to="">
                    2
                  </Link>
                  <Link class="next page-numbers" to="">
                    next
                  </Link>
                </div>
              </nav>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="right-sidebar">
              <div className="widget">
                <div className="wp-block-search__inside-wrapper">
                  <input
                    type="search"
                    placeholder="Search..."
                    className="wp-block-search__input"
                  />
                  <button id="wp-block-search__button" type="submit">
                    <img src="/images/icon/search.svg" alt="" />
                  </button>
                </div>
              </div>
              <CategoryCard />
              <PostCard />
              <TagCard />
              <div className="zubuz-blog-contact">
                <h3>How can we help you?</h3>
                <p>
                  We are here to help you! Tell us how we can help and we’ll get
                  in touch within next 24hrs
                </p>
                <Link to="/contact-us">Contact Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
