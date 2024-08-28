import Footer from "../../components/Section/Common/Footer";
import PageHeader from "../../components/Section/Common/PageHeader";
import IntegrationSection from "../../components/Section/Integrations/Integration/Integration";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function IntegrationPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Integrations" />
      <IntegrationSection />
      <Footer />
    </>
  );
}
