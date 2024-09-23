import Footer from "../../components/Section/Common/Footer";
import PageHeader from "../../components/Section/Common/PageHeader";
import Blog from "../../components/Section/blogColumnOne/Blog";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

const BlogOnePage = () => {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Our Blog" />
      <Blog />
      <Footer />
    </>
  );
};

export default BlogOnePage;
