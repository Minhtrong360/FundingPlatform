import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";

import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/SignUp/ForgotPassword";
import UpdatePassword from "../pages/SignUp/UpdatePassword";

import Founder from "../pages/FounderGitbook/Founder";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentSuccess from "../pages/PaymentSuccess";

import DetailPage from "../pages/FounderGitbook/DetailPage";

import Trial from "../pages/DashBoard/trial";
import AuthRequire from "./AuthRequired";

import TermsAndConditions from "../pages/DashBoard/term";
import UserPage from "../pages/UserProfile/UserPage";

import LinkedInLoginComponent from "../pages/Login/linkedin";

import DashBoardPage from "../pages/DashBoard/DashBoardPage";
import CompanySetting from "../pages/FounderGitbook/CompanySetting";
import News from "../pages/News/News";
import FinancialPage from "../pages/FinalcialPage/FinancialPage";

import ProgressBar from "../components/ProgressBar";
import NotificationsPage from "../pages/Notification/Notification";
import Confirmed from "../pages/SignUp/Confirmed";
import AdminPage from "../pages/Admin/AdminPage";

import PermissionRequired from "./PermissionRequired";
import AnnouncePage from "../components/AnnouncePage";
import PricingPage from "../pages/Home/Components/PricingPage";
import FAQ from "../pages/Home/Components/FAQ";
import DetailBlog from "../pages/News/DetailBlog";
import StaticNews from "../pages/News/StaticNews";
import NewProjectPosts from "../pages/StartUps/NewProjectPosts";
import Brochure from "../pages/Home/Components/Brochure.jsx";
import MyTabs from "../pages/testseparated.jsx";
function Router() {
  return (
    <>
      <Routes>
        {/* Routes definition */}
        <Route index element={<HomePage />} />

        <Route
          path="/founder"
          element={
            <AuthRequire message="Sign in required!">
              <Founder />
            </AuthRequire>
          }
        />

        <Route
          path="/user-info"
          element={
            <AuthRequire message="Sign in required!">
              <UserPage />
            </AuthRequire>
          }
        />

        <Route
          path="/founder/:id"
          element={
            <AuthRequire message="Sign in required!">
              <DetailPage />
            </AuthRequire>
          }
        />
        <Route
          path="/notifications"
          element={
            <AuthRequire message="Sign in required!">
              <NotificationsPage />
            </AuthRequire>
          }
        />

        {/* <Route path="/fundraising" element={<FundraisingRecords />} />   */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route
          path="/dashboard"
          element={
            <AuthRequire message="Sign in required!">
              <DashBoardPage />
            </AuthRequire>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        {/* <Route path="/content" element={<ChatBotTest />} /> */}
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/company/:id"
          element={
            <AuthRequire message="Sign in required!">
              <CompanySetting />
            </AuthRequire>
          }
        />
        <Route path="/linkedin" element={<LinkedInLoginComponent />} />

        <Route path="/trials" element={<Trial />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        <Route
          path="/financials"
          element={
            <AuthRequire message="Sign in required!">
              <PermissionRequired>
                <FinancialPage />
              </PermissionRequired>
            </AuthRequire>
          }
        />
        <Route
          path="/announce"
          element={
            <AnnouncePage
              title="Free trial"
              announce="Subscribe now."
              describe="14-day free trial available."
            />
          }
        />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<DetailBlog />} />
        <Route path="/startups" element={<NewProjectPosts />} />

        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/example" element={<StaticNews />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/brochure" element={<Brochure />} />
        <Route path="/mytabs" element={<MyTabs />} />
        <Route path="/loading" element={<ProgressBar isLoading={true} />} />
      </Routes>
    </>
  );
}

export default Router;
