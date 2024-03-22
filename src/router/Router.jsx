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
import { useAuth } from "../context/AuthContext";
import ProgressBar from "../components/ProgressBar";
import NotificationsPage from "../pages/Notification/Notification";
import Confirmed from "../pages/SignUp/Confirmed";
import AdminPage from "../pages/Admin/AdminPage";
import PricingSection from "../pages/Home/Components/PricingWithLemon";

import PermissionRequired from "./PermissionRequired";
import AnnouncePage from "../components/AnnouncePage";
function Router() {
  const { subscribed } = useAuth();

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
              <PermissionRequired isPrivateDisabled={subscribed}>
                <FinancialPage />
              </PermissionRequired>
            </AuthRequire>
          }
        />
        <Route
          path="/announce"
          element={
            <AnnouncePage
              title="Subscription Required"
              announce="Financial model helps you build your business plan and you need to subscribe."
              describe="This is our special feature that helps startups or new businesses build their business plans. We provide tools with AI to build your BS, IS, FS... Please upgrade your plan to experience this exciting feature"
            />
          }
        />
        <Route path="/news" element={<News />} />

        <Route path="/Z" element={<PricingSection />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/loading" element={<ProgressBar isLoading={true} />} />
      </Routes>
    </>
  );
}

export default Router;
