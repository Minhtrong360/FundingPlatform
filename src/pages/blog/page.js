import BlogSection from "../../components/Section/Blog/BlogSection";
import Footer from "../../components/Section/Common/Footer";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";
import PageHeader from "./../../components/Section/Common/PageHeader/PageHeader";

const BlogPage = () => {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Our Blog" />
      <BlogSection />
      <Footer />
    </>
  );
};

export default BlogPage;
