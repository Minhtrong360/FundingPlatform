import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import Footer from "./Footer";

import Header from "./Header";

import HeroSection from "./Components/HeroSection";
import Features from "./Components/Features";

import HeroCard from "./Components/HeroCard";
import PricingWithLemon from "./Components/PricingWithLemon";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <HeroCard />
      <Features />

      <PricingWithLemon />

      <Footer />
    </>
  );
};
export default HomePage;
