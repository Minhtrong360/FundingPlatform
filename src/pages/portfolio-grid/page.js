import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import Header from "../../components/Section/Common/Header/Header";
import PortfolioGrid from "./../../components/Section/Portfolio/Grid/PortfolioGrid";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function PortfolioGridPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Portfolio Grid" />
      <PortfolioGrid />
      <Footer />
    </>
  );
}
