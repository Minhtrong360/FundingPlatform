import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import TeamSection from "../../components/Section/Team/Team/Team";
import CtaThree from "../../components/Section/Common/Cta-3/CtaThree";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function TeamPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Our Team" />
      <TeamSection />
      <CtaThree
        title="You want to join our amazing team"
        btnText="Join Our Team"
      />
      <Footer />
    </>
  );
}
