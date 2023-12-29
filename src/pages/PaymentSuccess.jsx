import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full">
      <section className="bg-white dark:bg-gray-900">
        <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
          <div>
            <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
              Congratulations
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
              Payment successful
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Thanks for purchasing our services. Have a nice journey ahead.
            </p>

            <div className="flex items-center mt-6 gap-x-3">
              <button
                onClick={() => navigate("/founder")}
                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
              >
                <span>Go back</span>
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600"
              >
                Take me home
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentSuccess;
