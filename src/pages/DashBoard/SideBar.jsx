import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardOutlined } from '@ant-design/icons';



// function SideBar() {
//   return (
//     <aside className="flex flex-col md:flex-row h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
//       <a>
//         <img className="w-auto h-7" src="https://merakiui.com/images/logo.svg" alt="" />
//       </a>

//       <div className="flex flex-col justify-between flex-1 mt-6">
//         <nav className="-mx-3 space-y-3">
//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Home</span>
//           </a>

//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Dashboard</span>
//           </a>

//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Projects</span>
//           </a>

//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Tasks</span>
//           </a>

//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Reporting</span>
//           </a>

//           <a className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700">
//             <span className="mx-2 text-sm font-medium">Users</span>
//           </a>
//         </nav>

//         <div>
//           {/* Add any additional content or components here */}
//         </div>
//       </div>
//     </aside>
//   );
// }



// const SideBar = () => {
//   return (
//     <>
//       {/* Navigation Toggle */}
//       <button
//         type="button"
//         className="text-gray-500 hover:text-gray-600"
//         data-hs-overlay="#docs-sidebar"
//         aria-controls="docs-sidebar"
//         aria-label="Toggle navigation"
//       >
//         <span className="sr-only">Toggle Navigation</span>
//       </button>
//       {/* End Navigation Toggle */}
//       <div
//         id="docs-sidebar"
//         className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700"
//       >
//         <div className="px-6">
//           <a
//             className="flex-none text-xl font-semibold dark:text-white"
//             href="#"
//             aria-label="Brand"
//           >
//             Brand
//           </a>
//         </div>
//         <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
//           <ul className="space-y-1.5">
//             <li>
//               <a
//                 className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
//                 href="#"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                   <polyline points="9 22 9 12 15 12 15 22" />
//                 </svg>
//                 Dashboard
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// };


function SideBar() {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <DashboardOutlined
  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
  aria-hidden="true"
/>
              <span className="ms-3">Dashboard</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}




export default SideBar;
