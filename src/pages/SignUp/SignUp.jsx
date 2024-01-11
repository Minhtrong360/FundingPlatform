import { useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import SpinnerBtn from "../../components/SpinnerBtn";
import AlertMsg from "../../components/AlertMsg";

const HeroSignUp = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const signInWitGG = async (e) => {
    console.log("signInWitGG");
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
      // Nếu rememberMe không được chọn, hiển thị thông báo lỗi bằng toast.error
      toast.error("Please accept the Terms and Conditions");
    } else {
      const { data, error } = await supabase
        .from("users")
        .select("email")
        .eq("email", email);

      if (error) {
        console.error("Error checking email:", error);
      } else if (data && data.length > 0) {
        // Nếu email đã tồn tại, hiển thị thông báo lỗi bằng toast.error
        toast.error("Email is already existed");
      } else {
        // Nếu email không tồn tại, thực hiện đăng ký

        try {
          await supabase.auth.signUp({ email, password });
          setResetLink(true);
        } catch (error) {
          console.error("Error signing up:", error);
          toast.error(error.message);
          // Xử lý lỗi đăng ký tại đây nếu cần
        }
      }
    }
    setIsLoading(false); // Đặt isLoading thành false sau khi hoàn thành đăng ký
  };

  return (
    <div className="relative bg-gradient-to-bl from-blue-100 via-transparent dark:from-blue-950 dark:via-transparent">
      <AlertMsg />
      {resetLink ? (
        <div className="block text-2xl font-bold text-gray-800 dark:text-white text-center">
          Email sent successfully. Check your inbox for the confirm
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank" // Đặt giá trị của target thành "_blank"
            rel="noopener noreferrer" // Đề phòng các vấn đề bảo mật
            className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            {` link`}
          </a>
          .
        </div>
      ) : (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {/* Grid */}
          <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div>
              <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
                Preline: A vision for 2024
              </p>

              <div className="mt-4 md:mb-12 max-w-2xl">
                <h1 className="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl dark:text-gray-200">
                  Fully customizable rules to match your unique needs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  We provide you with a test account that can be set up in
                  seconds. Our main focus is getting responses to you as soon as
                  we can.
                </p>
              </div>

              <blockquote className="hidden md:block relative max-w-sm">
                <div
                  className="absolute top-0 start-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-200 dark:text-gray-800"
                  aria-hidden="true"
                >
                  🇻🇳
                </div>

                <div className="relative z-10">
                  <p className="text-xl italic text-gray-800 dark:text-white">
                    Amazing people to work with. Very fast and professional
                    partner.
                  </p>
                </div>

                <footer className="mt-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                        alt=""
                      />
                    </div>
                    <div className="grow ms-4">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">
                        Josh Grazioso
                      </div>
                      <div className="text-xs text-gray-500">
                        Director Payments & Risk | Airbnb
                      </div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>

            {/* Right Column */}
            <div>
              <form onSubmit={handleSubmit}>
                <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
                  <div className="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-slate-900">
                    <div className="text-center">
                      <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
                        Start your free trial
                      </h1>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?
                        <a
                          className="ml-1 text-blue-600 decoration-2 hover:underline hover:cursor-pointer font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          onClick={() => navigate("/login")}
                        >
                          Sign in here
                        </a>
                      </p>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={(e) => signInWitGG(e)}
                        type="button"
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                      >
                        🇻🇳 Sign up with Google
                      </button>

                      <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-[1_1_0%] before:border-t before:border-gray-200 before:me-6 after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ms-6 dark:text-gray-500 dark:before:border-gray-700 dark:after:border-gray-700">
                        Or
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 dark:text-white"
                          >
                            Your full name
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                            placeholder="Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>

                        {/* Email Input */}
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 dark:text-white"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        {/* Password Input */}
                        <div className="relative col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm mb-2 dark:text-white"
                          >
                            New password
                          </label>
                          <input
                            type="password"
                            id="password"
                            className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Checkbox and Terms */}
                      <div className="mt-5 flex items-center">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <label
                            htmlFor="remember-me"
                            className="ml-3 text-sm dark:text-white"
                          >
                            I accept the{" "}
                            <a
                              className="text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                              href="#"
                            >
                              Terms and Conditions
                            </a>
                          </label>
                        </div>

                        <div className="ms-3"></div>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-5">
                        <button
                          type="submit"
                          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                        >
                          {isLoading ? <SpinnerBtn /> : "Get started"}
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
