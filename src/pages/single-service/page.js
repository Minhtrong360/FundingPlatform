import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import SupportSection from "../../components/Section/SingleService/Support/Support";
import TestimonialSection from "../../components/Section/Common/Testimonial/Testimonial";
import ContentSection from "../../components/Section/SingleService/Content/Content";
import IntegrationSection from "../../components/Section/Common/Integration/Integration";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function SingleServicePage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Services Details" />
      <SupportSection />
      <ContentSection />
      <TestimonialSection />
      <IntegrationSection />
      <Footer />
    </>
  );
}
