import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";

import FundraisingRecords from "../pages/FundraisingRecords/FundraisingRecords";
import Dashboard from "../pages/DashBoard/DashBoard";
import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/SignUp/ForgotPassword";
import UpdatePassword from "../pages/SignUp/UpdatePassword";

import Founder from "../pages/FounderGitbook/Founder";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentSuccess from "../pages/PaymentSuccess";

import DetailPage from "../pages/FounderGitbook/DetailPage";

import CompanyInfo from "../pages/FounderGitbook/Company";

import Trial from "../pages/DashBoard/trial";
import AuthRequire from "./AuthRequired";

import TermsAndConditions from "../pages/DashBoard/term";
import UserPage from "../pages/UserProfile/UserPage";
import Newdb from "../pages/DashBoard/NewDashboard";
import LinkedInLoginComponent from "../pages/Login/linkedin";
import Financials from "../pages/Financials";
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
      {/* <Route
        path="/dashboard"
        element={
          <AuthRequire message="Sign in required!">
            <Dashboard />
          </AuthRequire>
        }
      /> */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      {/* <Route path="/content" element={<ChatBotTest />} /> */}
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route
        path="/company/:id"
        element={
          <AuthRequire message="Sign in required!">
            <CompanyInfo />
          </AuthRequire>
        }
      />
       <Route path="/linkedin" element={<LinkedInLoginComponent />} />
      <Route path="/newdb" element={<Newdb />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trials" element={<Trial />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/financials" element={<Financials />} />
    </Routes>
  );
}

export default Router;
