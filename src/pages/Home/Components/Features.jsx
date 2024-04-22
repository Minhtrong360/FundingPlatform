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

      <ComponentsFeatures />

      <div className="mt-12 text-center"></div>
    </div>
  );
}
export default Features;

function ComponentsFeatures() {
  return (
    <div
      key="1"
      className="bg-white text-gray-800 p-12 grid grid-cols-2 lg:grid-cols-4 gap-8"
    >
      <div className="space-y-4">
        <ClockIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Real-Time Reporting
        </h3>
        <p>Always work with accurate numbers as things change rapidly.</p>
      </div>
      <div className="space-y-4">
        <UsersIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Seamless Collaboration
        </h3>
        <p>Foster collaboration to drive the business forward.</p>
      </div>
      <div className="space-y-4">
        <PresentationIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Model Any Scenario
        </h3>
        <p>Create multiple plans for potential outcomes.</p>
      </div>
      <div className="space-y-4">
        <ArrowUpIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Increased Confidence
        </h3>
        <p>Grow your business on a strong foundation.</p>
      </div>
      <div className="space-y-4">
        <ScaleIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Greater Control</h3>
        <p>Make decisions founded on real-world data.</p>
      </div>
      <div className="space-y-4">
        <BrainIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Accelerate Experience
        </h3>
        <p>Tap into financial experience to drive value.</p>
      </div>
      <div className="space-y-4">
        <HandIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Reduce Costs</h3>
        <p>Invest in driving the business forward.</p>
      </div>
      <div className="space-y-4">
        <GroupIcon className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Hiring Clarity</h3>
        <p>Clear picture of who to hire and when.</p>
      </div>
    </div>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function BrainIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function GroupIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M3 7V5c0-1.1.9-2 2-2h2" />
      <path d="M17 3h2c1.1 0 2 .9 2 2v2" />
      <path d="M21 17v2c0 1.1-.9 2-2 2h-2" />
      <path d="M7 21H5c-1.1 0-2-.9-2-2v-2" />
      <rect width="7" height="5" x="7" y="7" rx="1" />
      <rect width="7" height="5" x="10" y="12" rx="1" />
    </svg>
  );
}

function HandIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function PresentationIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

function ScaleIcon(props) {
  return (
    <svg
      {...props}
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
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
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
  );
}
