import { ClockCircleOutlined, TeamOutlined, FundProjectionScreenOutlined, ArrowUpOutlined, ControlOutlined, BulbOutlined, DollarCircleOutlined, SolutionOutlined } from '@ant-design/icons';
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
        <ClockCircleOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Real-Time Reporting
        </h3>
        <p>Always work with accurate numbers as things change rapidly.</p>
      </div>
      <div className="space-y-4">
        <TeamOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Seamless Collaboration
        </h3>
        <p>Foster collaboration to drive the business forward.</p>
      </div>
      <div className="space-y-4">
        <FundProjectionScreenOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Model Any Scenario
        </h3>
        <p>Create multiple plans for potential outcomes.</p>
      </div>
      <div className="space-y-4">
        <ArrowUpOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Increased Confidence
        </h3>
        <p>Grow your business on a strong foundation.</p>
      </div>
      <div className="space-y-4">
        <ControlOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Greater Control</h3>
        <p>Make decisions founded on real-world data.</p>
      </div>
      <div className="space-y-4">
        <BulbOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">
          Accelerate Experience
        </h3>
        <p>Tap into financial experience to drive value.</p>
      </div>
      <div className="space-y-4">
        <DollarCircleOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Reduce Costs</h3>
        <p>Invest in driving the business forward.</p>
      </div>
      <div className="space-y-4">
        <SolutionOutlined className="h-12 w-12 text-black" />
        <h3 className="text-xl font-semibold text-blue-600">Hiring Clarity</h3>
        <p>Clear picture of who to hire and when.</p>
      </div>
    </div>
  );
}
