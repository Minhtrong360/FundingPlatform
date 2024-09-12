import { useState } from "react";
import BlogSection from "../../components/Section/Blog/BlogSection";
import Footer from "../../components/Section/Common/Footer";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";
import PageHeader from "./../../components/Section/Common/PageHeader/PageHeader";

const BlogPage = () => {
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  return (
    <>
      <HomeHeader />
      <PageHeader title="Our Blog" setIsCreatingBlog={setIsCreatingBlog} />
      <BlogSection
        isCreatingBlog={isCreatingBlog}
        setIsCreatingBlog={setIsCreatingBlog}
      />
      <Footer />
    </>
  );
};

export default BlogPage;
