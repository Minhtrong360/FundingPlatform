function CompanyInfo() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl dark:text-white">
            Company Info
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            This will be an amazing journey.
          </p>
        </div>

        <div className="mt-12">
          {/* Form */}
          <form>
            <div className="grid gap-4 lg:gap-6">
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="company-name"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Company name
                  </label>
                  <input
                    type="text"
                    name="company-name"
                    id="company-name"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>
              </div>
              {/* End Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="Business-sector"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Business sector
                  </label>
                  <input
                    type="text"
                    name="Business-sector"
                    id="Business-sector"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="Website"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Website
                  </label>
                  <input
                    type="text"
                    name="Website"
                    id="Website"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>
              </div>
              {/* Additional Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="target-amount"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Target amount
                  </label>
                  <input
                    type="text"
                    name="target-amount"
                    id="target-amount"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="type-offering"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Type offering
                  </label>
                  <input
                    type="text"
                    name="type-offering"
                    id="type-offering"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label
                    htmlFor="min-ticket-size"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    Min ticket size
                  </label>
                  <input
                    type="text"
                    name="min-ticket-size"
                    id="min-ticket-size"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="no-ticket"
                    className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                  >
                    No. ticket
                  </label>
                  <input
                    type="text"
                    name="no-ticket"
                    id="no-ticket"
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-image-url"
                  className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >
                  Profile image URL
                </label>
                <input
                  type="text"
                  name="profile-image-url"
                  id="profile-image-url"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                />
              </div>
              {/* End Additional Fields */}

              {/* Company Description */}
              <div>
                <label
                  htmlFor="company-description"
                  className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
                >
                  Company description
                </label>
                <textarea
                  id="company-description"
                  name="company-description"
                  rows="4"
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark-bg-slate-900 dark-border-gray-700 dark-text-gray-400 dark-focus-ring-gray-600"
                ></textarea>
              </div>
              {/* End Company Description */}
            </div>
            {/* End Grid */}

            {/* Checkbox */}
            <div className="mt-3 flex">
              <div className="flex">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="shrink-0 mt-1.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark-bg-gray-800 dark-border-gray-700 dark-checked-bg-blue-500 dark-checked-border-blue-500 dark-focus-ring-offset-gray-800"
                />
              </div>
              <div className="ms-3">
                <label
                  htmlFor="remember-me"
                  className="text-sm text-gray-600 dark-text-gray-400"
                >
                  By submitting this form I have read and acknowledged our Terms and Policies{" "}
                </label>
              </div>
            </div>
            {/* End Checkbox */}

            <div className="mt-6 grid">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark-focus-outline-none dark-focus-ring-1 dark-focus-ring-gray-600"
              >
                Submit
              </button>
            </div>
          </form>
          {/* End Form */}
        </div>
      </div>
    </div>
  );
}


  
  export default CompanyInfo;