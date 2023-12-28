import React, { useState } from 'react';

function MarketDataAI() {
  const [email, setEmail] = useState('Electric vehicle market size');
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSearch = () => {
    // Add your search logic here
    console.log('Searching for:', email);
    // You can replace the console.log with your actual search functionality
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex items-start justify-center  px-4 pt-4  text-center sm:block sm:p-0">
     

      <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
        <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">Market data AI</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Search info from TechCrunch, Forbes, WSJ...</p>

        <form className="mt-4">
          <label className="block mt-3" htmlFor="email">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Keywords"
              value={email}
              onChange={handleEmailChange}
              className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
            />
          </label>

          <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MarketDataAI;