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

import X from "../pages/test01";
import Y from "../pages/test02";
import FinancialPage from "../pages/FinalcialPage/FinancialPage";

import Z from "../pages/test03";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabase";
import ProgressBar from "../components/ProgressBar";
import ImageCrop from "../components/cropImage/ImageCrop";
import ImageCropper from "../components/ImageCropper";
import NotificationsPage from "../pages/Notification/Notification";
import Confirmed from "../pages/SignUp/Confirmed";
import AdminPage from "../pages/Admin/AdminPage";
import Compose from "../pages/News/Compose";

function Router() {
  const { user } = useAuth();

  const [currentUser, setCurrentUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!navigator.onLine) {
          toast.error("No internet access.");
          return;
        }
        let { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id);

        if (error) {
          console.log("error", error);
          throw error;
        }

        setCurrentUser(users[0]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    if (user) {
      fetchCurrentUser();
    }
  }, [user]);

  useEffect(() => {
    if (
      currentUser?.plan === "Free" ||
      currentUser?.plan === null ||
      currentUser?.plan === undefined ||
      currentUser?.subscription_status !== "active"
    ) {
      setSubscribed(false);
    } else {
      setSubscribed(true);
    }
  }, [currentUser]);
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
              <FinancialPage subscribed={subscribed} />
            </AuthRequire>
          }
        />
        {/* <Route path="/financialList" element={<FinancialList />} /> */}
        <Route path="/news" element={<News />} />
        {/* <Route path="/X" element={<X />} />
        <Route path="/Y" element={<Y />} />
        <Route path="/Z" element={<Z />} /> */}
        {/* <Route path="/W" element={<ImageCropper />} /> */}
        <Route path="/Z" element={<Z />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/post" element={<Compose />} />
        <Route path="/loading" element={<ProgressBar isLoading={true} />} />
      </Routes>
    </>
  );
}

export default Router;
