import BlogSection from "../../components/Section/Blog/BlogSection";
import Footer from "../../components/Section/Common/Footer";
import Header from "../../components/Section/Common/Header/Header";
import PageHeader from './../../components/Section/Common/PageHeader/PageHeader';


const BlogPage = () => {
  return (
    <>
      <Header />
      <PageHeader title="Our Blog" />
      <BlogSection />
      <Footer />
    </>
  );
};

export default BlogPage;
