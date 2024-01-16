import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import Footer from "./Footer";
import YouTube from "react-youtube";
import Header from "./Header";
import PricingSection from "./Pricing";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";

import HeroSection from "./Components/HeroSection";
import Features from "./Components/Features";
import FeatureGIFs from "./Components/FeatureGIFs";
import Search from "./Components/Search";
import ProfileCard from "./Components/ProfileCard";
import HeroCard from "./Components/HeroCard";
import FAQ from "./Components/FAQ";
import { toast } from "react-toastify";



// create a function that returns all the components

const HomePage = () => {
  const { user } = useAuth();
  // Khởi tạo trạng thái currentUser với giá trị ban đầu là null
  const [currentUser, setCurrentUser] = useState(null);

  // Sử dụng useEffect để lấy thông tin người dùng khi trang được tải
  useEffect(() => {
    // Import Supabase client và thiết lập nó

    const fetchProjects = async () => {
      try {
        let { data: users, error } = await supabase
          .from("users")
          .select("*")

          // Filters
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        toast.error(error.message);
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  function Marquee() {
    const marqueeStyle = {
      position: 'fixed',
      bottom: '0',
      left: '0',
      width: '100%',
      backgroundColor: 'yellow',
      color: 'black',
      padding: '2px',
      overflow: 'hidden',
    };
  
    const animationStyle = {
      display: 'flex',
      gap: '8px',
      whiteSpace: 'nowrap',
      animation: 'marquee 25s linear infinite',
    };
  
    return (
      <div style={marqueeStyle}>
        <div style={animationStyle}>
          <div>
            <p className="text-sm font-medium mr-20">  📣 Update: Our new Fundraising Profile as a Service is now available!</p>
            
          </div>

          <div>
            <p className="text-sm font-medium mr-40">📣 Update: Financial Model as a Service is on the way!</p>
            
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <FeatureGIFs />
      <Search />
      <ProfileCard />
      <HeroCard />
      <PricingSection />
      
      <FAQ />
      <Marquee />
      <Footer />

    </>
  );
};
export default HomePage;
