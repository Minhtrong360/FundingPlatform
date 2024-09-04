import PageHeader from "../../components/Section/Common/PageHeader";
import Footer from "../../components/Section/Common/Footer";
import AboutSection from "../../components/Section/SingleTeam/About/About";
import ExperienceSection from "../../components/Section/SingleTeam/Experience/Experience";
import Header from "../../components/Section/Common/Header/Header";
import HomeHeader from "../../components/Section/Common/Header/HomeHeader";

export default function SingleTeamPage() {
  return (
    <>
      <HomeHeader />
      <PageHeader title="Team Details" />
      <AboutSection />
      <ExperienceSection />
      <Footer />
    </>
  );
}
