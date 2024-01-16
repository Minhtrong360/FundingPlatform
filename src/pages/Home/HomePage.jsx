import "@blocknote/core/style.css";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import Footer from "./Footer";

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
      <Footer />
    </>
  );
};
export default HomePage;
