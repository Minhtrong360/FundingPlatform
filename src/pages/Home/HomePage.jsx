import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import Footer from "./Footer";

import Header from "./Header";

import HeroSection from "./Components/HeroSection";
import Features from "./Components/Features";
import FeatureComponent from "./Components/FeatureGIFs";
import FeaturesComponent from "./Components/FeaturesComponent";

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
      <FeaturesComponent />
      <div id="tabs-with-card-1" role="tabpanel" aria-labelledby="tabs-with-card-item-1">
           {/* Devices */}
           <div className="max-w-[1140px]  relative">
             {/* Browser Device */}
             <figure className="ms-auto me-20 relative z-[1] max-w-full w-[50rem] h-auto rounded-b-lg shadow-[0_2.75rem_3.5rem_-2rem_rgb(45_55_75_/_20%),_0_0_5rem_-2rem_rgb(45_55_75_/_15%)] dark:shadow-[0_2.75rem_3.5rem_-2rem_rgb(0_0_0_/_20%),_0_0_5rem_-2rem_rgb(0_0_0_/_15%)]">
             

               <div className="relative flex items-center max-w-[50rem] bg-gray-800 border-b border-gray-700 rounded-t-lg py-2 px-24">
               <div className="flex space-x-1 absolute top-2/4 start-4 -translate-y-1">
                 <span className="size-2 bg-gray-700 rounded-full"></span>
                 <span className="size-2 bg-gray-700 rounded-full"></span>
                 <span className="size-2 bg-gray-700 rounded-full"></span>
               </div>
               <a href="https:www.beekrowd.com" className="flex justify-center items-center size-full bg-gray-700 text-[.25rem] text-gray-200 rounded-sm sm:text-[.5rem]">www.beekrowd.com</a>
               </div>

               <div className="w-full min-w-400px max-w-800px rounded-b-lg">
                 <div className="relative w-full overflow-hidden rounded-b-lg" style={{ paddingTop: '56.25%' }}>
                 <p>
                   <iframe
                     title="YouTube video player"
                     className="absolute top-0 left-0 right-0 w-full h-full rounded-b-lg"
                     src="https:www.youtube.com/embed/56lpx33qSpI?si=CaJKbilv0ghPwRLC"
                     width="560"
                     height="315"
                     allowFullScreen
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   ></iframe>
                 </p>
               </div>
             </div>
              
             </figure>
             {/* End Browser Device */}
           </div>
        </div>
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
