import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import Footer from "./Footer";

import Header from "./Header";

import HeroSection from "./Components/HeroSection";
import Features from "./Components/Features";
import FeatureComponent from "./Components/FeatureGIFs";

import HeroCard from "./Components/HeroCard";
import FAQ from "./Components/FAQ";
import NewProjectPosts from "./Components/NewProjectPosts";
import PricingWithLemon from "./Components/PricingWithLemon";

// create a function that returns all the components

const HomePage = () => {
  // Khởi tạo trạng thái currentUser với giá trị ban đầu là null

  // function Marquee() {
  //   const marqueeStyle = {
  //     position: "fixed",
  //     bottom: "0",
  //     left: "0",
  //     width: "100%",
  //     backgroundColor: "yellow",
  //     color: "black",
  //     padding: "2px",
  //     overflow: "hidden",
  //   };

  //   const animationStyle = {
  //     display: "flex",
  //     gap: "8px",
  //     whiteSpace: "nowrap",
  //     animation: "marquee 25s linear infinite",
  //   };

  //   return (
  //     <div style={marqueeStyle}>
  //       <div style={animationStyle}>
  //         <div>
  //           <p className="text-sm font-medium mr-20">
  //             {" "}
  //             📣 Update: Our new Fundraising Profile as a Service is now
  //             available!
  //           </p>
  //         </div>

  //         <div>
  //           <p className="text-sm font-medium mr-40">
  //             📣 Update: Financial Model as a Service is on the way!
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <FeatureComponent />
      {/* <Search /> */}
      {/* <ProfileCard /> */}
      <NewProjectPosts />
      <HeroCard />
      {/* <PricingSection /> */}

      <PricingWithLemon />

      <FAQ />
      {/* <Marquee /> */}
      <Footer />
    </>
  );
};
export default HomePage;
