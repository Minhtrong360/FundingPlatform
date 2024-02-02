import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";

import FundraisingRecords from "../pages/FundraisingRecords/FundraisingRecords";

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
import Newdb from "../pages/DashBoard/NewDashboard";
import LinkedInLoginComponent from "../pages/Login/linkedin";

import NewsComponent from "../pages/test";
import DashBoardPage from "../pages/DashBoard/DashBoardPage";
import CompanySetting from "../pages/FounderGitbook/CompanySetting";
import News from "../pages/News/News";
import LoadingButtonClick from "../components/LoadingButtonClick";
import X from "../pages/test01";
import Y from "../pages/test02";
function Router() {
  return (
    <Routes>
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

      <Route path="/fundraising" element={<FundraisingRecords />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
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
      <Route path="/newdb" element={<Newdb />} />

      <Route path="/trials" element={<Trial />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      {/* <Route path="/financials" element={<Financials />} /> */}
      <Route path="/financials" element={<NewsComponent />} />
      <Route path="/news" element={<News />} />
      <Route path="/X" element={<X />} />
      <Route path="/Y" element={<Y/>} />
      <Route
        path="/loading"
        element={<LoadingButtonClick isLoading={true} />}
      />
    </Routes>
  );
}

export default Router;
