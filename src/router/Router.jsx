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
import GPTAnalyzer from "../pages/FinalcialPage/Components/GPTAnalyzer.jsx";
import MarketResearch from "../pages/MarketResearch_Evaluation/MarketResearch.jsx";

function Router() {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* Routes definition */}
        <Route index element={<HomePage />} />

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
          path="/Flea-Market/info"
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
              title="Free trial"
              announce="Subscribe now."
              describe="14-day free trial available."
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
          path="/GPT"
          element={<GPTAnalyzer numberOfMonths={36} />}
        />
        <Route
          key={location.key}
          path="/marketresearch"
          element={<MarketResearch />}
        />
      </Routes>
    </>
  );
}

export default Router;
