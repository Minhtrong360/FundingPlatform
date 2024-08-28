import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import Header from "../../components/Section/Common/Header/Header";
import PortfolioClassic from "../../components/Section/Portfolio/Classic/PortfolioClassic";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function PortfolioClassicPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Portfolio Classic" />
      <PortfolioClassic />
      <Footer />
    </>
  );
}
