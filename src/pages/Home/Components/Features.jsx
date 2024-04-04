import FsB from "./founder&Business.jpg";
import BsI from "./B&I.jpg";
import VCs from "./VCs.jpg";
function Features() {
  return (
    <div className="max-w-[85rem] px-3 py-20 sm:px-6 lg:px-8 lg:py-14 mx-auto md:mt-64">
      <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
        <h3
          id="platform"
          className="block text-3xl font-extrabold text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl darkTextWhite"
        >
          A{" "}
          <span className="text-blue-600 bg-yellow-300 h-6">data-centric </span>{" "}
          platform for users.
        </h3>
        <p className="mt-6 text-lg text-gray-800">
          Regardless of who you are, our orientation is to provide you with a
          data-centric platform that serves best for analyzing the data of a
          business profile, financial analysis, and investment analysis.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 "
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src={FsB}
              alt=" Description"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 darkTextGray darkGroupHoverText">
              FOUNDERS
            </h3>
            <p className="mt-5 text-gray-800 darkTextGray">
              <ul>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Financial forecasting{" "}
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Financial reporting
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Expense tracking
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Cash flow management
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Sensitivity analysis
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Investment valuation
                  </span>
                </li>
              </ul>
            </p>
          </div>
        </div>

        <div
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 "
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src={BsI}
              alt="Description"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 darkTextGray darkGroupHoverText">
              ANALYSTS
            </h3>
            <p className="mt-5 text-gray-800 darkTextGray">
              <ul>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Business Profile analysis
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Investment research
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Portfolio management
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Risk assessment, Due diligence
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Performance tracking
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Financial modeling
                  </span>
                </li>
              </ul>
            </p>
          </div>
        </div>

        <div
          className="group flex flex-col h-full border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 rounded-xl p-5 "
          href="#"
        >
          <div className="aspect-w-16 aspect-h-11">
            <img
              className="w-full object-cover rounded-xl"
              src={VCs}
              alt="Description"
            />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 darkTextGray darkGroupHoverText">
              INVESTORS
            </h3>
            <p className="mt-5 text-gray-800 darkTextGray">
              <ul>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Analyzing financial data
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Advanced analytics
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Reporting features
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Conduct thorough due diligence
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Assess risk factors
                  </span>
                </li>
                <li className="flex space-x-2 justify-start items-center my-2">
                  <svg
                    className="flex-shrink-0 mt-0.5 h-4 w-4 text-blue-600 darkTextBlue"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-800 darkTextGray">
                    Evaluate the potential returns
                  </span>
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center"></div>
    </div>
  );
}
export default Features;
