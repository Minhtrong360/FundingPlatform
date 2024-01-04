import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";

import FundraisingRecords from "../pages/FundraisingRecords/FundraisingRecords";
import Dashboard from "../pages/DashBoard/DashBoard";
import SignUp from "../pages/SignUp/SignUp";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/SignUp/ForgotPassword";
import UpdatePassword from "../pages/SignUp/UpdatePassword";

import DetailPage from "../pages/FounderGitbook/DetailPage";
import Founder from "../pages/FounderGitbook/Founder";
import NotFoundPage from "../pages/NotFoundPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PageLayout from "../pages/DashBoard/layout";
import CompanyInfo from "../pages/FounderGitbook/companyInfo";

import Trial from "../pages/DashBoard/trial";
function Router() {
  return (
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="/founder" element={<Founder />} />
      <Route path="/founder/:id" element={<DetailPage />} />
      {/* <Route path="/dashboard" element={<DashBoardPage />} /> */}
      {/* <Route path="/project" element={<ProjectPage />} /> */}
      <Route path="/Fundraising" element={<FundraisingRecords />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      {/* <Route path="/content" element={<ChatBotTest />} /> */}
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/companyinput" element={<CompanyInfo />} />
   
      <Route path="/trials" element={<Trial />} />
   
    </Routes>
  );
}

export default Router;
