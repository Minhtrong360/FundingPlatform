import React from "react";

function UserInfoSettings() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            User info settings
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Tell us your basic information.
          </p>
        </div>

        <div className="mt-12">
          <form>
            <div className="grid gap-4 lg:gap-6">
              <div className="grid grid-cols-1 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    autoComplete="Name"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="hs-work-email-hire-us-2"
                  className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="hs-work-email-hire-us-2"
                  id="hs-work-email-hire-us-2"
                  autoComplete="email"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="hs-company-hire-us-2"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    name="hs-company-hire-us-2"
                    id="hs-company-hire-us-2"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hs-company-website-hire-us-2"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Company Website
                  </label>
                  <input
                    type="text"
                    name="hs-company-website-hire-us-2"
                    id="hs-company-website-hire-us-2"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="hs-about-hire-us-2"
                  className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >
                  Details
                </label>
                <textarea
                  id="hs-about-hire-us-2"
                  name="hs-about-hire-us-2"
                  rows="4"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus:ring-gray-600"
                ></textarea>
              </div>
            </div>

            <div className="mt-3 flex">
              <div className="flex">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="shrink-0 mt-1.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark-bg-gray-800 dark-border-gray-700 dark-checked-bg-blue-500 dark-checked-border-blue-500 dark-focus-ring-offset-gray-800"
                />
              </div>
            </div>

            <div className="mt-6 grid">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserInfoSettings;
