import Footer from "../../components/Section/Common/Footer";
import PageHeader from "../../components/Section/Common/PageHeader";
import SingleCareerSection from "../../components/Section/SingleCareer/SingleCareerSection";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

const SingleCareerPage = () => {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Career Details" />
      <SingleCareerSection />
      <Footer />
    </>
  );
};

export default SingleCareerPage;
