import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import "@blocknote/core/style.css";

import "./custom-ant-design.css";
// import export icon from antd
import { YoutubeOutlined } from "@ant-design/icons";
import MarketDataAI from "../marketDataAI";
import SideBar from "../DashBoard/SideBar";
import {
  defaultBlockSchema,
  defaultBlockSpecs,
  defaultProps,
} from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote,
  createReactBlockSpec,
  ReactSlashMenuItem,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { useParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { Progress } from "antd";


const HeroSection = ({ title, description, button1Text, button2Text, imageUrl }) => {
  return (
    <div className="max-w-[85rem] mx-auto mt-24 px-4 sm:px-6 lg:px-8 z-0">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        <div>
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-800 dark:text-gray-400">
            {description}
          </p>
          
          
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">

            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              
            >
              {button1Text}
              {/* Replace with actual SVG */}
              <span>→</span>
            </a>
            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
             
            >
              {button2Text}
            </a>
            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
             
            >
              {button2Text}
            </a>
            <a
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
             
            >
              {button2Text}
            </a>
          </div>
        </div>

        <div className="relative ms-4">
          <img
            className="w-full rounded-md"
            src={imageUrl}
            alt="Image Description"
          />
          <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 w-full h-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-slate-800 dark:via-slate-900/0 dark:to-slate-900/0"></div>
        </div>
      </div>
    </div>
  );
};

const VideoComponent = ({ videoUrl }) => {
  return (
    <div className="w-[100%] h-[100%]">
      <ReactPlayer
        url={videoUrl}
        controls={true} // Display video controls
        width="100%" // Set the width of the player
        height="100%" // Set the height of the player
      />
    </div>
  );
};

function ProgressBar({ progress }) {
  // Calculate the width based on the progress value
  const width = `${progress}%`;

  return (
    <div
      className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap dark:bg-blue-500 transition duration-500"
        style={{ width }}
      >
        {progress}%
      </div>
    </div>
  );
}

function InputField({ name, value, onChange, label }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      />
    </div>
  );
}

// function InvestmentCard() {
//   const [investmentData, setInvestmentData] = useState({
//     numberOfInvestors: "",
//     valuation: "",
//     minTicketSize: "",
//     numberTicket: "",
//     offeringType: "",
//     targetAmount: "",
//     daysLeft: "",
//     offer: "",
//     progress: 0, // The logic for setting progress should be implemented as needed
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setInvestmentData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 border-2 border-blue-500">
//       <div className="font-bold text-xl mb-2 text-center text-blue-600">
//         ${investmentData.raisedAmount || "0"} raised
//       </div>
//       <ProgressBar progress={investmentData.progress} />
//       <div className="pt-4 grid grid-cols-2 gap-4">
//         <InputField
//           name="numberOfInvestors"
//           value={investmentData.numberOfInvestors}
//           onChange={handleInputChange}
//           label="No. Investors"
//         />
//         <InputField
//           name="offeringType"
//           value={investmentData.offeringType}
//           onChange={handleInputChange}
//           label="Offering Type"
//         />
//         <InputField
//           name="minTicketSize"
//           value={investmentData.minTicketSize}
//           onChange={handleInputChange}
//           label="Min Ticket Size"
//         />
//         <InputField
//           name="numberTicket"
//           value={investmentData.numberTicket}
//           onChange={handleInputChange}
//           label="Number Ticket"
//         />
//         <InputField
//           name="targetAmount"
//           value={investmentData.targetAmount}
//           onChange={handleInputChange}
//           label="Target Amount"
//         />
//         <InputField
//           name="offer"
//           value={investmentData.offer}
//           onChange={handleInputChange}
//           label="Offer"
//         />
//       </div>
//       <div className="mt-4">
//         <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
//           Reserve now
//         </button>
//       </div>
//     </div>
//   );
// }

// Reusable TextArea component
function TextAreaField({ label, name, placeholder, value, onChange }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm text-gray-700 font-medium dark:text-white"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows="4"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
      ></textarea>
    </div>
  );
}

// Reusable Checkbox component
function CheckboxField({ label, checked, onChange }) {
  return (
    <div className="mt-3 flex">
      <div className="flex">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="shrink-0 mt-1.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
        />
      </div>
      <div className="ms-3">
        <label
          htmlFor="remember-me"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {label}
        </label>
      </div>
    </div>
  );
}

// Main Form component
function InvestmentCard() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    workEmail: "",
    company: "",
    companyWebsite: "",
    details: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="relative">
      <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-10 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Fill in the form
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 grid gap-4 lg:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <InputField
              label="Work Email"
              name="workEmail"
              type="email"
              value={formData.workEmail}
              onChange={handleChange}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <InputField
                label="Company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
              />
              <InputField
                label="Company Website"
                name="companyWebsite"
                type="text"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </div>
            <TextAreaField
              label="Details"
              name="details"
              value={formData.details}
              onChange={handleChange}
            />
          </div>
          <CheckboxField
            label="By submitting this form I have read and acknowledged the Privacy policy"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <div className="mt-6 grid">
            <button
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              Send inquiry
            </button>
          </div>
        </form>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            We'll get back to you in 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}

function CategorizedLinks() {
  return (
    <div className="mt-5  ml-16">
      <div>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-primary-100 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          10/1/2018
        </a>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-secondary-100 text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          VietNam
        </a>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          No. Employee
        </a>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
            <path d="M9 18h6"></path>
            <path d="M10 22h4"></path>
          </svg>
          Legal equity
        </a>
      </div>
      <div>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
          Industry
        </a>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
          </svg>
          Revenue
        </a>
        <a
          className="mr-16 mt-5 m-1 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
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
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
          </svg>
          Bussiness model
        </a>
      </div>
    </div>
  );
}

function Card({ icon, title, metric, description, badgeText }) {
  return (
    <div className="w-100 h-100 bg-white shadow-lg rounded-lg p-5 dark:bg-slate-900  hover:border-transparent hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-x-4 mb-3">
        <div className="inline-flex justify-center items-center w-[62px] h-[62px] rounded-full bg-blue-100 dark:bg-blue-800">
          {icon}
        </div>
        <div className="flex-shrink-0">
          <h3 className="block text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
      <h3 className="text-5xl font-bold text-black-600 dark:text-gray-400">
        {metric}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mt-3">{description}</p>
      <Badge text={badgeText} />
    </div>
  );
}

// Badge component (same as provided in the original code)
function Badge({ text }) {
  return (
    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-gray-500 dark:bg-white/[.05] dark:text-white mt-4">
      {text}
    </span>
  );
}

// IconBlock component using the Card component
function StatBadge() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6 md:gap-10">
        {/* Card 1 */}
        <Card
          icon="🇻🇳"
          title="72.8% growth"
          metric={42} // Example metric value
          description="Revenue growth rate in 2019 compared to 2018."
          badgeText="New"
        />
        {/* End Card 1 */}

        {/* Card 2 */}
        <Card
          icon="🇻🇳"
          title="77K+ orders"
          metric={15} // Example metric value
          description="BOS. served over 77,000 cups of quality coffee to customers"
          badgeText="New"
        />
        {/* End Card 2 */}

        {/* Card 3 */}
        <Card
          icon="🇻🇳"
          title="$255K revenue"
          metric={98} // Example metric value
          description="Revenue for the fiscal year from Jan 1, 2019 to Dec 31, 2019"
          badgeText="New"
        />
        {/* End Card 3 */}

        {/* Card 4 */}
        <Card
          icon="🇻🇳"
          title="Great partners"
          metric={100} // Example metric value
          description="Nordic Approach, Synesso, Giesen"
          badgeText="New"
        />
        {/* Card 5 */}
        <Card
          icon="🇻🇳"
          title="1.24X buyback"
          metric={100} // Example metric value
          description="1.24 times value buyback after 3 years"
          badgeText="New"
        />
      </div>
    </div>
  );
}

function EditorTool() {
  // Create the YouTube Link block
  const YouTubeLinkBlock = createReactBlockSpec(
    {
      type: "youtubeLink",
      propSchema: {
        ...defaultProps,
        videoId: {
          default: "",
        },
      },
      content: "none",
    },
    {
      render: ({ block }) => {
        return (
          <div>
            {block.props.videoId && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${block.props.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        );
      },
      toExternalHTML: ({ block }) => {
        // Generate the HTML code for the YouTube video player
        if (block.props.videoId) {
          return `<div><iframe width="560" height="315" src="https://www.youtube.com/embed/${block.props.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        }
        return "";
      },
      parse: (element) => {
        // Parse the video ID from the HTML code if available
        const iframe = element.querySelector("iframe");
        if (iframe) {
          const src = iframe.getAttribute("src");
          const videoIdMatch = src.match(/embed\/([^?]+)/);
          if (videoIdMatch) {
            return {
              videoId: videoIdMatch[1],
            };
          }
        }
      },
    }
  );

  // Our block schema, which contains the configs for blocks that we want our
  // editor to use.
  const blockSchema = {
    // Adds all default blocks.
    ...defaultBlockSchema,
    // Adds the YouTube Link block.
    youtubeLink: YouTubeLinkBlock.config,
  };

  // Our block specs, which contain the configs and implementations for blocks
  // that we want our editor to use.
  const blockSpecs = {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the YouTube Link block.
    youtubeLink: YouTubeLinkBlock,
  };

  // Creates a slash menu item for inserting a YouTube Link block.
  const insertYouTubeLink: ReactSlashMenuItem<typeof blockSchema> = {
    name: "YouTube",
    execute: (editor) => {
      const videoUrl = prompt("Enter YouTube video URL"); // Prompt the user for the video URL

      if (videoUrl) {
        // Parse the video ID from the URL using a regular expression
        const videoIdMatch = videoUrl.match(
          /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?feature=player_embedded&v=|watch\?feature=player_embedded&v=|watch\?v=|watch\?v=))([^&?\s]+)/
        );

        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
          // Insert the YouTube Link block with the extracted video ID
          editor.insertBlocks(
            [
              {
                type: "youtubeLink",
                props: {
                  videoId: videoId,
                },
              },
            ],
            editor.getTextCursorPosition().block,
            "after"
          );
        } else {
          alert("Invalid YouTube video URL. Please provide a valid URL.");
        }
      }
    },
    aliases: ["youtube", "video", "link"],
    group: "Other",
    icon: <YoutubeOutlined />, // Assuming you have a video icon component
  };

  // Creates a new editor instance.
  const editor = useBlockNote({
    // Tells BlockNote which blocks to use.
    blockSpecs: blockSpecs,
    slashMenuItems: [
      ...getDefaultReactSlashMenuItems(blockSchema),
      insertYouTubeLink,
    ],
  });

  // Renders the editor instance using a React component.

  return (
    <BlockNoteView editor={editor} theme={"light"} style={{ width: "80%" }} />
  );
}



function Header() {
  return (
    <div>
      <p className="inline-block text-md font-medium bg-clip-text bg-gradient-to-l from-blue-600 to-violet-500 text-transparent dark:from-blue-400 dark:to-violet-400">
        BeeKrowd: A featured profile for 2024
      </p>
      <div className="mt-4 md:mb-12 max-w-2xl">
        <h1 className="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl dark:text-gray-200">
          Santa Pocket
        </h1>
      </div>
      <div className="video-container flex justify-center ">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/GP5jXj0O4OM"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

function SignupForm() {
  const [percentage, setPercentage] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  // Hàm để cập nhật phần trăm cho mỗi trường và tổng phần trăm
  const updatePercentage = (value) => {
    const newTotalPercentage = totalPercentage + value;
    setTotalPercentage(newTotalPercentage);
    setPercentage(newTotalPercentage / 6); // Chia đều thành 6 trường
  };

  return (
    <form>
      <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
        <div className="p-4 sm:p-7 flex flex-col bg-white rounded-lg shadow-lg dark:bg-slate-900">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Fundraising info
            </h1>
            <Progress percent={percentage} />
          </div>
          <div className="mt-5">
            <div className="grid grid-cols-2 gap-4 ">
              {/* Input fields go here */}
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                    onBlur={() => updatePercentage(1)}
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Target amount
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-last-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Doe"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-last-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Valuation
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="email"
                    id="hs-hero-signup-form-floating-input-email"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="you@email.com"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-email"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Min ticket
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-company-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="Preline"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-company-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    % Equity
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Valuation
                  </label>
                </div>
              </div>
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="hs-hero-signup-form-floating-input-first-name"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 focus:pt-6 focus:pb-2 [&amp;:not(:placeholder-shown)]:pt-6 [&amp;:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                    placeholder="John"
                  />
                  <label
                    htmlFor="hs-hero-signup-form-floating-input-first-name"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Offering type
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5"></div>
          </div>
        </div>
      </div>
    </form>
  );
}

function YoutubeAndForm() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className=" grid items-end md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Header />
        </div>
        <div>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid items-center lg:grid-cols-12 gap-6 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:pe-6 xl:pe-12">
            <p className="text-6xl font-bold leading-10 text-blue-600">
              92%
              <span className="ms-1 inline-flex items-center gap-x-1 bg-gray-200 font-medium text-gray-800 text-xs leading-4 rounded-full py-0.5 px-2 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
                </svg>
                +7% this month
              </span>
            </p>
            <p className="mt-2 sm:mt-3 text-gray-500">
              of U.S. adults have bought from businesses using Space
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 relative lg:before:absolute lg:before:top-0 lg:before:-start-12 lg:before:w-px lg:before:h-full lg:before:bg-gray-200 lg:before:dark:bg-gray-700">
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-3 sm:gap-8">
            <div>
              <p className="text-3xl font-semibold text-blue-600">99.95%</p>
              <p className="mt-1 text-gray-500">in fulfilling orders</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-blue-600">2,000+</p>
              <p className="mt-1 text-gray-500">partner with Preline</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-blue-600">85%</p>
              <p className="mt-1 text-gray-500">this year alone</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// const ChatBotTest = () => {
//   const { id } = useParams();
//   const { user } = useAuth();
//   const [viewError, setViewError] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Lấy dự án từ Supabase
//     supabase
//       .from("projects")
//       .select("*")
//       .eq("id", id)
//       .single()
//       .then(({ data, error }) => {
//         setIsLoading(false); // Đánh dấu rằng dữ liệu đã được tải xong
//         if (error) {
//           console.error(error);
//           // Xử lý lỗi khi không thể lấy dự án
//         } else {
//           console.log("user Id", user.id);
//           console.log("data.user_id", data.user_id);

//           // Kiểm tra quyền truy cập của người dùng
//           if (
//             data.status === false &&
//             data.user_id !== user.id &&
//             !data.invited_user?.includes(user.id)
//           ) {
//             // Kiểm tra xem dự án có trạng thái false, không thuộc về người dùng và không được mời tham gia
//             // Hoặc có thể kiểm tra invited_user ở đây

//             // Hiển thị thông báo hoặc thực hiện hành động tương ứng
//             setViewError(true);
//           } else {
//             setViewError(false);
//           }
//         }
//       });
//   }, [id, user.id]);

//   if (isLoading) {
//     return <div>Loading...</div>; // Hiển thị màn hình "isLoading" khi dữ liệu đang được tải
//   }

//   if (viewError) {
//     return <div>You are not allowed to see it</div>;
//   }

//   return (
//     <div className="shadow-sm bg-white pb-12">
//       <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
//         <div className="flex flex-col  w-[18%] max-md:w-full max-md:ml-0 mr-4">
//           <SideBar />
//         </div>
//         <div className="flex flex-col items-stretch w-[82%] max-md:w-full max-md:ml-0 mt-10">
//           {/* <YoutubeAndForm /> */}
//           {/* <Stats /> */}
//           <HeroSection
//             title="BeeKrowd"
//             description="Fintech company the href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value."
//             button1Text="Get started"
//             button2Text="Contact sales team"
//             imageUrl="https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//           />

//           <div class="flex justify-center max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
//             {/* <EditorTool /> */}
          
//             <EditorTool />
//           </div>
//         </div>
//         {/* <div className="flex flex-col  w-[25%] max-md:w-full max-md:ml-0 mr-4">
//           <MarketDataAI />
//         </div> */}
//       </div>
//     </div>
//   );
// };

const ChatBotTest = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("sizebarr",isSidebarOpen)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

 

  return (
    <div style={{ height: '600px' }} className="p-5 bg-white dark:bg-gray-900 antialiased !p-0"  onClick={toggleSidebar}>
      <div id="exampleWrapper" className="">
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <aside
          id="default-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
            isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'
          }`}
          aria-label="Sidebar"
          aria-hidden={!isSidebarOpen}
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"></path>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"></path>
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </a>
              </li>
              {/* Add more list items as needed */}
            </ul>
          </div>
        </aside>

        <div className="p-4 sm:ml-64" onClick={toggleSidebar}>
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
         
         
          <HeroSection
            title="BeeKrowd"
            description="Fintech company the href attribute requires a valid value to be accessible. Provide a valid, navigable address as the href value."
            button1Text="Get started"
            button2Text="Contact sales team"
            imageUrl="https://images.unsplash.com/photo-1633671475485-754e12f39817?q=80&w=700&h=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />

          <div class="flex justify-center max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          
            <EditorTool />
          </div>
        </div>
          </div>
        </div>
      </div>
  
  );
};
export default ChatBotTest;
