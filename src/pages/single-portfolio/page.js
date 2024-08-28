import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import PortfolioDetailsSection from "../../components/Section/SinglePortfolio/PortfolioDetails/PortfolioDetails";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function SinglePortfolioPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Portfolio Details" />
      <PortfolioDetailsSection />
      <Footer />
    </>
  );
}
