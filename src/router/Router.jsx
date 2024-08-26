import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";

import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/SignUp/ForgotPassword";
import UpdatePassword from "../pages/SignUp/UpdatePassword";

import Founder from "../pages/FounderGitbook/Founder";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentSuccess from "../pages/PaymentSuccess";

import Trial from "../pages/DashBoard/trial";
import AuthRequire from "./AuthRequired";

import TermsAndConditions from "../pages/DashBoard/term";
import UserPage from "../pages/UserProfile/UserPage";

// import LinkedInLoginComponent from "../pages/Login/linkedin";

import DashBoardPage from "../pages/DashBoard/DashBoardPage";
import CompanySetting from "../pages/FounderGitbook/CompanySetting";
import News from "../pages/News/News";
import FinancialPage from "../pages/FinalcialPage/FinancialPage";

// import ProgressBar from "../components/ProgressBar";
import NotificationsPage from "../pages/Notification/Notification";
import Confirmed from "../pages/SignUp/Confirmed";
import AdminPage from "../pages/Admin/AdminPage";

import PermissionRequired from "./PermissionRequired";
// import AnnouncePage from "../components/AnnouncePage";
import PricingPage from "../pages/Home/Components/PricingPage";
import FAQ from "../pages/Home/Components/FAQ";
import DetailBlog from "../pages/News/DetailBlog";
// import StaticNews from "../pages/News/StaticNews";
import NewProjectPosts from "../pages/StartUps/NewProjectPosts";
// import Brochure from "../pages/Home/Components/Brochure.jsx";
import NewDetailPage from "../pages/FounderGitbook/NewDetailPage.jsx";
// import App from "../supabase/PrivateDemo.jsx";
// import TourComponent from "../pages/JoyRide.jsx";
import FinancialList from "../pages/FinalcialPage/FinancialList.jsx";
import FleaMarketList from "../pages/FleaMarket/FleaMarketList.jsx";
import FleaMarketListAll from "../pages/FleaMarket/FleaMarketListAll.jsx";
import AdminRequired from "./AdminRequired.jsx";
import MarketResearch from "../pages/MarketResearch_Evaluation/MarketResearch.jsx";
import UniversitiesPage from "../pages/University/UniversitiesPage.jsx";
import CompetitionPosts from "../pages/University/CompetitionPosts.jsx";
import DraggableChart from "../pages/FinalcialPage/Components/DraggableChart.jsx";
import VCPage from "../pages/VC workspace/VCPage.jsx";
import CohortPost from "../pages/VC workspace/CohortPosts.jsx";
import Home from "../pages/home-1/page.js";
import HomeTwoPage from "./../pages/home-2/page";
import HomeThreePage from "./../pages/home-3/page";
import BlogOnePage from "../pages/blog-column-one/page.js";
import BlogTwoPage from "./../pages/blog-column-two/page";
import BlogPage from "../pages/blog/page.js";
import CareerPage from "./../pages/career/page";
import ComingSoonPage from "./../pages/coming-soon/page";
import ContactUsPage from "./../pages/contact-us/page";
import IntegrationPage from "../pages/integrations/page.js";
import PortfolioClassicPage from "./../pages/portfolio-classic/page";
import PortfolioGridPage from "./../pages/portfolio-grid/page";
import ResetPasswordPage from "./../pages/reset-password/page";
import ServicePage from "./../pages/service/page";
import SignInPage from "./../pages/sign-in/page";
import SingleBlogPage from "./../pages/single-blog/page";
import SingleCareerPage from "./../pages/single-career/page";
import SinglePortfolioPage from "./../pages/single-portfolio/page";
import SingleServicePage from "./../pages/single-service/page";
import SingleTeamPage from "./../pages/single-team/page";
import TeamPage from "./../pages/team/page";
import TestimonialPage from "./../pages/testimonials/page";
import AboutPage from "./../pages/about-us/page";
import SignUpPage from "../pages/sign-up/page.js";

function Router() {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* New */}
        <Route key={location.key} index element={<Home />} />
        <Route key={location.key} path="/home-2" element={<HomeTwoPage />} />
        <Route key={location.key} path="/home-3" element={<HomeThreePage />} />
        <Route key={location.key} path="/blog" element={<BlogPage />} />
        <Route key={location.key} path="/about-us" element={<AboutPage />} />
        <Route
          key={location.key}
          path="/blog-column-one"
          element={<BlogOnePage />}
        />
        <Route
          key={location.key}
          path="/blog-column-two"
          element={<BlogTwoPage />}
        />
        <Route key={location.key} path="/career" element={<CareerPage />} />
        <Route
          key={location.key}
          path="/coming-soon"
          element={<ComingSoonPage />}
        />
        <Route
          key={location.key}
          path="/contact-us"
          element={<ContactUsPage />}
        />
        <Route key={location.key} path="/faq" element={<FAQ />} />
        <Route
          key={location.key}
          path="/integrations"
          element={<IntegrationPage />}
        />
        <Route
          key={location.key}
          path="/portfolio-classic"
          element={<PortfolioClassicPage />}
        />
        <Route
          key={location.key}
          path="/portfolio-grid"
          element={<PortfolioGridPage />}
        />
        <Route key={location.key} path="/pricing" element={<PricingPage />} />
        <Route
          key={location.key}
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route key={location.key} path="/service" element={<ServicePage />} />
        <Route key={location.key} path="/sign-in" element={<SignInPage />} />
        <Route key={location.key} path="/sign-up" element={<SignUpPage />} />
        <Route
          key={location.key}
          path="/single-blog"
          element={<SingleBlogPage />}
        />
        <Route
          key={location.key}
          path="/single-career"
          element={<SingleCareerPage />}
        />
        <Route
          key={location.key}
          path="/single-portfolio"
          element={<SinglePortfolioPage />}
        />
        <Route
          key={location.key}
          path="/single-service"
          element={<SingleServicePage />}
        />
        <Route
          key={location.key}
          path="/single-team"
          element={<SingleTeamPage />}
        />
        <Route key={location.key} path="/team" element={<TeamPage />} />
        <Route
          key={location.key}
          path="/testimonials"
          element={<TestimonialPage />}
        />

        {/* Routes definition */}
        {/* <Route index element={<HomePage />} /> */}
        <Route
          key={location.key}
          path="/founder"
          element={
            <AuthRequire message="Sign in required!">
              <Founder />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/Flea-Market"
          element={
            <AuthRequire message="Sign in required!">
              <FleaMarketList />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/Listing-Flea-Market"
          element={
            <AuthRequire message="Sign in required!">
              <FleaMarketListAll />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/user-info"
          element={
            <AuthRequire message="Sign in required!">
              <UserPage />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/founder/:id"
          element={
            <AuthRequire message="Sign in required!">
              <NewDetailPage location={location} />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/notifications"
          element={
            <AuthRequire message="Sign in required!">
              <NotificationsPage />
            </AuthRequire>
          }
        />
        {/* <Route path="/fundraising" element={<FundraisingRecords />} />   */}
        <Route key={location.key} path="/login" element={<Login />} />
        <Route key={location.key} path="/signup" element={<SignUp />} />
        <Route key={location.key} path="/confirmed" element={<Confirmed />} />
        <Route
          key={location.key}
          path="/dashboard"
          element={
            <AuthRequire message="Sign in required!">
              <DashBoardPage />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          key={location.key}
          path="/update-password"
          element={<UpdatePassword />}
        />
        {/* <Route  key={location.key} path="/content" element={<ChatBotTest />} /> */}
        <Route
          key={location.key}
          path="/success"
          element={<PaymentSuccess />}
        />
        <Route key={location.key} path="*" element={<NotFoundPage />} />
        <Route
          key={location.key}
          path="/company/:id"
          element={
            <AuthRequire message="Sign in required!">
              <CompanySetting />
            </AuthRequire>
          }
        />
        {/* <Route path="/linkedin" element={<LinkedInLoginComponent />} /> */}
        <Route key={location.key} path="/trials" element={<Trial />} />
        <Route
          key={location.key}
          path="/terms"
          element={<TermsAndConditions />}
        />
        <Route
          key={location.key}
          path="/financials/:id"
          element={
            <AuthRequire message="Sign in required!">
              <PermissionRequired>
                <FinancialPage />
              </PermissionRequired>
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/financials"
          element={
            <AuthRequire message="Sign in required!">
              <PermissionRequired>
                <FinancialList />
              </PermissionRequired>
            </AuthRequire>
          }
        />
        {/* <Route
          key={location.key}
          path="/announce"
          element={
            <AnnouncePage
              title="Subscribe Now"
              announce="Subscribe now."
              describe="Subscribe available."
            />
          }
        /> */}
        <Route key={location.key} path="/news" element={<News />} />
        <Route key={location.key} path="/news/:id" element={<DetailBlog />} />
        <Route
          key={location.key}
          path="/startups"
          element={<NewProjectPosts location={location} />}
        />
        <Route key={location.key} path="/pricing" element={<PricingPage />} />
        <Route
          key={location.key}
          path="/admin"
          element={
            <AuthRequire message="Sign in required!">
              <AdminRequired>
                <AdminPage />
              </AdminRequired>
            </AuthRequire>
          }
        />
        {/* <Route  key={location.key} path="/example" element={<StaticNews />} /> */}
        <Route key={location.key} path="/FAQ" element={<FAQ />} />
        {/* <Route  key={location.key} path="/brochure" element={<Brochure />} /> */}
        <Route key={location.key} path="/mytabs" element={<NewDetailPage />} />
        {/* <Route  key={location.key} path="/app" element={<App />} /> */}
        {/* <Route  key={location.key} path="/tour" element={<TourComponent />} /> */}
        <Route
          key={location.key}
          path="/founders/market-research"
          element={
            <AuthRequire message="Sign in required!">
              <MarketResearch />
            </AuthRequire>
          }
        />
        {/* For universities */}
        <Route
          key={location.key}
          path="/workspace"
          element={
            <AuthRequire message="Sign in required!">
              <UniversitiesPage location={location} />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/competitions"
          element={<CompetitionPosts location={location} />}
        />
        <Route
          key={location.key}
          path="/vc_workspace"
          element={
            <AuthRequire message="Sign in required!">
              <VCPage location={location} />
            </AuthRequire>
          }
        />
        <Route
          key={location.key}
          path="/cohort"
          element={<CohortPost location={location} />}
        />
        <Route
          key={location.key}
          path="/dragChart"
          element={<DraggableChart />}
        />
      </Routes>
    </>
  );
}

export default Router;
