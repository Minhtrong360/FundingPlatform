import { useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";

import AnnouncePage from "../../components/AnnouncePage";
import { GoogleOutlined } from "@ant-design/icons";
import LoadingButtonClick from "../../components/LoadingButtonClick";
import { message } from "antd";

const HeroSignUp = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const signInWitGG = async (e) => {
    e.preventDefault();
    await auth.loginWithGG();
  };
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetLink, setResetLink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Đặt isLoading thành true để bật trạng thái loading
    // Kiểm tra email đã tồn tại trong Supabase
    if (!rememberMe) {
      // Nếu rememberMe không được chọn, hiển thị thông báo lỗi bằng message.error
      message.error("Please accept the Terms and Conditions");
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email);

      if (error) {
        console.error("Error checking email:", error);
      } else if (data && data.length > 0) {
        // Nếu email đã tồn tại, hiển thị thông báo lỗi bằng message.error
        message.error("Email is already existed");
      } else {
        // Nếu email không tồn tại, thực hiện đăng ký

        try {
          if (!navigator.onLine) {
            // Không có kết nối Internet
            message.error("No internet access.");
            return;
          }
          await supabase.auth.signUp({ email, password, fullName });

          // Nếu không có lỗi, tiến hành cập nhật trường full_name trong bảng users
          const { error: updateError } = await supabase
            .from("users")
            .update({ full_name: fullName })
            .eq("email", email);

          if (updateError) {
            // Xử lý lỗi nếu có
            throw updateError;
          }

          setResetLink(true);
        } catch (error) {
          console.error("Error signing up:", error);
          message.error(error.message);
          // Xử lý lỗi đăng ký tại đây nếu cần
        }
      }
    }
    setIsLoading(false); // Đặt isLoading thành false sau khi hoàn thành đăng ký
  };

  return (
    <div className="relative bg-gradient-to-bl via-transparent darkFromBlueViaTransparent">
      {resetLink ? (
        <AnnouncePage
          title="Congratulations!"
          announce="You have signed up to BeeKrowd."
          describe="Email sent successfully. Check your inbox to confirm."
        />
      ) : (
        <div className="max-w-[85rem] px-3 py-20 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {/* Grid */}
          <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div>
              <div className="mt-4 md:mb-12 max-w-2xl">
                <h1 className="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl darkTextGray">
                  Building exceptional Fundraising profile with
                  <span class="text-blue-600"> BeeKrowd</span>
                </h1>
                <p className="text-gray-600 darkTextGray">
                  We're here to provide you with the insights, strategies, and
                  tools you need to craft a compelling and effective fundraising
                  profile.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
                  <div className="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg darkBgBlue">
                    <div className="text-center">
                      <h1 className="block text-2xl font-semibold text-gray-800 darkTextWhite">
                        Start your Subscribe Now
                      </h1>
                      <p className="mt-2 text-sm text-gray-600 darkTextGray">
                        Already have an account?
                        <button
                          className="ml-1 text-blue-600 decoration-2 hover:underline hover:cursor-pointer font-medium darkFocusOutlineNone darkFocusRing-1 darkFocus"
                          onClick={() => navigate("/login")}
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={(e) => signInWitGG(e)}
                        type="button"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none darkBgBlue darkBorderGray darkTextWhite darkHoverBgBlue darkFocusOutlineNone darkFocusRing-1 darkFocus"
                      >
                        <GoogleOutlined />
                        Sign up with Google
                      </button>

                      <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-300 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-300 after:ms-6 darkTextGray darkBeforeBorderGray darkAfterBoderGray">
                        Or
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 darkTextWhite"
                          >
                            Your full name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            className="peer p-4 block w-full border-gray-300 rounded-md text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                            placeholder="Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>

                        {/* Email Input */}
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 darkTextWhite"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="peer p-4 block w-full border-gray-300 rounded-md text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        {/* Password Input */}
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 darkTextWhite"
                          >
                            New password
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="peer p-4 block w-full border-gray-300 rounded-md text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 darkBgBlue darkBorderGray darkTextGray darkFocus"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <LoadingButtonClick isLoading={isLoading} />
                      {/* Checkbox and Terms */}
                      <div className="mt-5 flex items-center">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 darkBgBlue darkBorderGray"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            required
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-3 text-sm darkTextWhite"
                          >
                            I accept the{" "}
                            <button
                              className="text-blue-600 decoration-2 hover:underline hover:cursor-pointer font-medium darkFocusOutlineNone darkFocusRing-1 darkFocus"
                              onClick={() =>
                                window.open(
                                  "https://www.beekrowd.com/terms",
                                  "_blank"
                                )
                              }
                            >
                              Terms and Conditions
                            </button>
                          </label>
                        </div>

                        <div className="ms-3"></div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-5">
                        <button
                          type="submit"
                          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none darkFocusOutlineNone darkFocusRing-1 darkFocus"
                        >
                          Get started
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* End Right Column */}
          </div>
          {/* End Grid */}
        </div>
      )}
    </div>
  );
};

export default HeroSignUp;
