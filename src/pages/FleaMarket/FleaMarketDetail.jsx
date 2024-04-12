import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export default function FleaMarketDetail() {
  return (
    <div
      key="1"
      className="bg-white p-6 max-w-full mx-auto rounded-lg shadow-md"
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Steeped Coffee</h1>
          <p className="text-gray-500 mt-1">
            New standard in coffee: Specialty coffee brewed like tea in a...
          </p>
          <div className="mt-4">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Asset: STEE
              </span>
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Valuation Cap: $33,000,000
              </span>
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                Discount: 0%
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <span className="text-gray-900 font-semibold">Trading status</span>
            <CircleIcon className="text-green-500" />
          </div>
          <div className="flex items-center justify-end space-x-2 mt-4">
            <span className="text-gray-500">Indicative valuation</span>
            <span className="text-gray-900 font-bold">$33,000,000</span>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <img
          alt="Steeped Coffee Product"
          className="w-full h-auto"
          height="200"
          src="/placeholder.svg"
          style={{
            aspectRatio: "500/200",
            objectFit: "cover",
          }}
          width="500"
        />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Company Info
              </h2>
              <div className="mt-4">
                <p className="text-gray-600">Legal name</p>
                <p className="text-gray-900 font-semibold">Steeped, Inc.</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Headquarters</p>
                <p className="text-gray-900 font-semibold">Scotts Valley, US</p>
              </div>
            </div>
            <div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-600">Investors</p>
                <p className="text-gray-900 font-semibold">5,548</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Website</p>
                <Link className="text-blue-600" href="#">
                  steepedcoffee.com
                </Link>
              </div>
              <div className="flex gap-4 mt-4">
                <Button className="bg-blue-600 text-white">Buy</Button>
                <Button className="bg-blue-600 text-white">Sell</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6" />
    </div>
  );
}

function CircleIcon(props) {
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
    </svg>
  );
}
