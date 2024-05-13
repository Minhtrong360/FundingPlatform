import { ClockCircleOutlined, TeamOutlined, FundProjectionScreenOutlined, ArrowUpOutlined, ControlOutlined, BulbOutlined, DollarCircleOutlined, SolutionOutlined, ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import FsB from "./founder&Business.jpg";
import BsI from "./B&I.jpg";
import VCs from "./VCs.jpg";
import { Carousel } from 'antd';
import { useMediaQuery } from 'react-responsive';

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




const ComponentsFeatures = () => {
  const isDesktop = useMediaQuery({ minWidth: 768 });

  return (
    <div className="bg-white text-gray-800 p-4 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {isDesktop ? (
        <>
          <div className="space-y-4">
            <ClockCircleOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Automated analysis</h3>
            <p>Automate the analysis of vast amounts of financial data, enabling quicker and more accurate forecasting.</p>
          </div>
          <div className="space-y-4">
            <TeamOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">One-click auto reporting</h3>
            <p>Facilitates the generation of financial reports, such as profit-and-loss statements and balance sheets, with minimal human intervention.</p>
          </div>
          <div className="space-y-4">
            <FundProjectionScreenOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">All-in-one Command center</h3>
            <p>Facilitate seamless collaboration among team members and integration with other business.</p>
          </div>
          <div className="space-y-4">
            <ArrowUpOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Real-time insights & Anomaly detection</h3>
            <p>Provide real-time insights into financial performance, highlighting data anomalies and discrepancies as they occur.</p>
          </div>
          <div className="space-y-4">
            <ControlOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Scenario analysis & Risk management</h3>
            <p>Enhances the capability of FP&A software to perform complex scenario analysis and their outcomes.</p>
          </div>
          <div className="space-y-4">
            <BulbOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Financials related queries</h3>
            <p>AI-powered FP&A can address financial queries effectively, enhancing accuracy, efficiency, and strategic decision-making.</p>
          </div>
        </>
      ) : (
        <Carousel arrows nextArrow={<ArrowRightOutlined />} prevArrow={<ArrowLeftOutlined/>} infinite={false}>
           <div className="space-y-4">
            <ClockCircleOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Automated analysis</h3>
            <p>Automate the analysis of vast amounts of financial data, enabling quicker and more accurate forecasting.</p>
          </div>
          <div className="space-y-4">
            <TeamOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">One-click auto reporting</h3>
            <p>Facilitates the generation of financial reports, such as profit-and-loss statements and balance sheets, with minimal human intervention.</p>
          </div>
          <div className="space-y-4">
            <FundProjectionScreenOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">All-in-one Command center</h3>
            <p>Facilitate seamless collaboration among team members and integration with other business.</p>
          </div>
          <div className="space-y-4">
            <ArrowUpOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Real-time insights & Anomaly detection</h3>
            <p>Provide real-time insights into financial performance, highlighting data anomalies and discrepancies as they occur.</p>
          </div>
          <div className="space-y-4">
            <ControlOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Scenario analysis & Risk management</h3>
            <p>Enhances the capability of FP&A software to perform complex scenario analysis and their outcomes.</p>
          </div>
          <div className="space-y-4">
            <BulbOutlined style={{ fontSize: '32px' }} className="h-12 w-12 text-black" />
            <h3 className="text-xl font-semibold text-blue-600">Financials related queries</h3>
            <p>AI-powered FP&A can address financial queries effectively, enhancing accuracy, efficiency, and strategic decision-making.</p>
          </div>
        </Carousel>
      )}
    </div>
  );
};


