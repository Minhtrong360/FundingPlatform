import React, { useState } from "react";

function FileUpload() {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
      </label>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-50 text-gray-500 dark:bg-white/[.05] dark:text-white">
      {text}
    </span>
  );
}

// CategorizedLinks component
function BadgeList() {
  return (
    <div className="mt-1 sm:mt-1">
      <a className="m-1 mt-4" href="#">
        <Badge text="Business" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Strategy" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Health" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Creative" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Environment" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Adventure" />
      </a>
      <a className="m-1" href="#"">
        <Badge text="Business" />
      </a>
      <a className="m-1" href="#>
        <Badge text="Strategy" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Health" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Creative" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Environment" />
      </a>
      <a className="m-1" href="#">
        <Badge text="Adventure" />
      </a>
    </div>
  );
}

const SectionTitle = ({ text }) => (
  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{text}</h2>
);

const SectionDescription = ({ text }) => (
  <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
);

const ProfilePhoto = ({ src, alt, buttonText }) => (
  <div className="flex items-center gap-5">
    <img
      className="inline-block h-16 w-16 rounded-full ring-2 ring-white dark:ring-gray-800"
      src={src}
      alt={alt}
    />
    <div className="flex gap-x-2">
      <div>
        <button
          type="button"
          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          {buttonText}
        </button>
      </div>
    </div>
  </div>
);

const LabelWithTooltip = ({ label, tooltipText }) => (
  <div className="inline-block">
    <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200">
      {label}
    </label>
    <div className="hs-tooltip inline-block">
      <button type="button" className="hs-tooltip-toggle ms-1"></button>
      <span
        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-slate-700"
        role="tooltip"
      >
        {tooltipText}
      </span>
    </div>
  </div>
);

const TextInput = ({ id, type, placeholder }) => (
  <input
    id={id}
    type={type}
    className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
    placeholder={placeholder}
  />
);

const SelectInput = () => (
  <select className="py-2 px-3 pe-9 block w-full sm:w-auto border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600">
    <option selected>Mobile</option>
    <option>Home</option>
    <option>Work</option>
    <option>Fax</option>
  </select>
);

const RadioButton = ({ id, label, isChecked }) => (
  <label
    htmlFor={id}
    className="flex py-2 px-3 block w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
  >
    <input
      type="radio"
      name="af-account-gender-checkbox"
      className="shrink-0 mt-0.5 border-gray-300 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:checked:bg-blue-600 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
      id={id}
      checked={isChecked}
    />
    <span className="text-sm text-gray-500 ms-3 dark:text-gray-400">
      {label}
    </span>
  </label>
);

const TextAreaInput = () => (
  <textarea
    id="af-account-bio"
    className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
    rows="6"
    placeholder="Type your message..."
  ></textarea>
);

const UserProfileForm = () => (
  <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-slate-900">
      <div class="mb-8">
        <SectionTitle text="Profile" />
        <SectionDescription text="Manage your name, password and account settings." />
      </div>
      <form>
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <div className="sm:col-span-3">
            <LabelWithTooltip label="Profile photo" />
          </div>

          <div className="sm:col-span-9">
            <ProfilePhoto
              src="https://preline.co/assets/img/160x160/img1.jpg"
              alt=""
              buttonText="Upload photo"
            />
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip
              label="Full name"
              tooltipText="Displayed on public forums, such as Preline"
            />
          </div>

          <div className="sm:col-span-9">
            <div className="sm:flex">
              <TextInput
                id="af-account-full-name"
                type="text"
                placeholder="Maria"
              />
              <TextInput type="text" placeholder="Boone" />
            </div>
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip label="Email" tooltipText="(Optional)" />
          </div>

          <div className="sm:col-span-9">
            <TextInput
              id="af-account-email"
              type="email"
              placeholder="maria@site.com"
            />
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip
              label="Password"
              tooltipText="Enter current password"
            />
          </div>

          <div className="sm:col-span-9">
            <div className="space-y-2">
              <TextInput
                id="af-account-password"
                type="text"
                placeholder="Enter current password"
              />
              <TextInput type="text" placeholder="Enter new password" />
            </div>
          </div>

          <div className="sm:col-span-3">
            <div className="inline-block">
              <LabelWithTooltip label="Phone" tooltipText="(Optional)" />
            </div>
          </div>

          <div className="sm:col-span-9">
            <div className="sm:flex">
              <TextInput
                id="af-account-phone"
                type="text"
                placeholder="+x(xxx)xxx-xx-xx"
              />
              <SelectInput />
            </div>

            <p className="mt-3">
              <a
                className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                href="../docs/index.html"
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
                Add phone
              </a>
            </p>
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip label="Gender" tooltipText="" />
          </div>

          <div className="sm:col-span-9">
            <div className="sm:flex">
              <RadioButton
                id="af-account-gender-checkbox"
                label="Male"
                isChecked={true}
              />
              <RadioButton
                id="af-account-gender-checkbox-female"
                label="Female"
                isChecked={false}
              />
              <RadioButton
                id="af-account-gender-checkbox-other"
                label="Other"
                isChecked={false}
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip label="BIO" tooltipText="" />
          </div>

          <div className="sm:col-span-9">
            <TextAreaInput />
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip label="ID Card" tooltipText="" />
          </div>

          <div className="sm:col-span-9">
            <FileUpload />
          </div>

          <div className="sm:col-span-3">
            <LabelWithTooltip label="Interest" tooltipText="" />
          </div>

          <div className="sm:col-span-9">
            <BadgeList />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-x-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  </div>
);

function Sidebar() {
  const [usersAccordionOpen, setUsersAccordionOpen] = useState(false);

  const toggleUsersAccordion = () => {
    setUsersAccordionOpen(!usersAccordionOpen);
  };

  return (
    <div
      id="docs-sidebar"
      className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="px-6">
        <a
          className="flex-none text-xl font-semibold dark:text-white"
          href="#"
          aria-label="Brand"
        >
          Brand
        </a>
      </div>
      <nav
        className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
        data-hs-accordion-always-open
      >
        <ul className="space-y-1.5">
          {/* Menu Items */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <svg
                className="w-4 h-4"
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
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Dashboard
            </a>
          </li>

          {/* Users Accordion */}
          <li className="hs-accordion" id="users-accordion">
            <button
              type="button"
              className={`hs-accordion-toggle ${
                usersAccordionOpen
                  ? "hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent"
                  : ""
              } w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:hs-accordion-active:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600`}
              onClick={toggleUsersAccordion}
            >
              <svg
                className="w-4 h-4"
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Users
              {/* Accordion Icons */}
              <svg
                className={`${
                  usersAccordionOpen
                    ? "hs-accordion-active:block"
                    : "hs-accordion-active:hidden"
                } ms-auto hidden w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400`}
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
                <path d="m18 15-6-6-6 6" />
              </svg>
              <svg
                className={`${
                  usersAccordionOpen
                    ? "hs-accordion-active:hidden"
                    : "hs-accordion-active:block"
                } ms-auto block w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400`}
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Users Sub-Menu */}
            <div
              id="users-accordion"
              className={`${
                usersAccordionOpen
                  ? "hs-accordion-content"
                  : "hs-accordion-content hidden"
              } w-full overflow-hidden transition-[height] duration-300`}
            >
              <ul
                className="hs-accordion-group ps-3 pt-2"
                data-hs-accordion-always-open
              >
                <li className="hs-accordion" id="users-accordion-sub-1">
                  <button
                    type="button"
                    className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:hs-accordion-active:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  >
                    Sub Menu 1{/* Accordion Icons */}
                    <svg
                      className="hs-accordion-active:block ms-auto hidden w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                    <svg
                      className="hs-accordion-active:hidden ms-auto block w-4 h-4 text-gray-600 group-hover:text-gray-500 dark:text-gray-400"
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Sub-Menu Content */}
                  <div
                    id="users-accordion-sub-1"
                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                  >
                    <ul className="ps-3 pt-2">
                      <li>
                        <a
                          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                        >
                          Sub-Menu Item 1
                        </a>
                      </li>
                      <li>
                        <a
                          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          href="#"
                        >
                          Sub-Menu Item 2
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Other Sub-Menu Items */}
                {/* Add more sub-menu items as needed */}
              </ul>
            </div>
          </li>

          {/* Other Menu Items */}
          {/* Add more menu items as needed */}
        </ul>
      </nav>
      <div className="px-6">
        <a
          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="w-4 h-4"
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Calendar
        </a>
      </div>
      <div className="px-6">
        <a
          className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          href="#"
        >
          <svg
            className="w-4 h-4"
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
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Documentation
        </a>
      </div>
    </div>
  );
}

const SidebarWithForm = () => {
  // const handleSubmit = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   // Handle form submission logic here
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="shadow-sm bg-white pb-12">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
        <div className="flex flex-col items-stretch w-[18%] max-md:w-full max-md:ml-0">
          <Sidebar />
        </div>
        <div className="flex flex-col items-stretch max-w-[85rem] ml-5  max-md:ml-0">
          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default SidebarWithForm;
